"""
Écoute en continu les changements MongoDB (Change Streams) et répercute
chaque insert/update/delete vers PostgreSQL puis ChromaDB, dans cet ordre :

    MongoDB (événement) → PostgreSQL (validé/commit) → ChromaDB

PostgreSQL reste la source structurée intermédiaire : ChromaDB est toujours
reconstruit à partir de la ligne PostgreSQL qui vient d'être écrite (mêmes
fonctions que sync_postgres_to_chroma.py), jamais directement depuis le
document MongoDB brut. On n'écrit jamais dans ChromaDB avant que l'écriture
PostgreSQL correspondante n'ait été validée.

Contrairement à sync_mongo_to_postgres.py / sync_postgres_to_chroma.py
(lecture complète, à la demande), ce module est un processus persistant : il
doit tourner en continu (voir le service "mongo_sync_worker" dans
docker-compose.yml), pas être lancé ponctuellement.

Le point de reprise ("resume token") est sauvegardé dans PostgreSQL après
chaque événement traité, pour pouvoir reprendre exactement là où le listener
s'est arrêté en cas de redémarrage/crash, sans tout retraiter ni rien perdre.

Usage :
    python -m app.rag.mongo_change_listener
"""

from __future__ import annotations

import logging
import time

from pymongo import MongoClient
from pymongo.errors import OperationFailure, PyMongoError
import psycopg2
from psycopg2.extras import Json

from app.config import settings
from app.rag.sync_mongo_to_postgres import (
    REGULATION_SOURCE_COLLECTIONS,
    _build_article_record,
    _build_career_record,
    _build_property_record,
    _build_regulation_record,
    _ensure_schema,
    _upsert_record,
)
from app.rag.sync_postgres_to_chroma import (
    ARTICLE_METADATA_FIELDS,
    CAREER_METADATA_FIELDS,
    PROPERTY_METADATA_FIELDS,
    REGULATION_METADATA_FIELDS,
    _build_article_text,
    _build_career_text,
    _build_metadata,
    _build_property_text,
    _build_regulation_text,
)
from app.rag.vectorstore import (
    COLLECTION_BIENS,
    COLLECTION_CARRIERES,
    COLLECTION_MARCHE,
    COLLECTION_REGLEMENTATION,
    get_or_create_collection,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")
logger = logging.getLogger(__name__)

STREAM_KEY = "orchid_properties_articles"
MAX_BACKOFF_SECONDS = 60


# ---------------------------------------------------------------------------
# Suivi du point de reprise (resume token)
# ---------------------------------------------------------------------------

def _ensure_state_table(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS mongo_change_stream_state (
            stream_key TEXT PRIMARY KEY,
            resume_token JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        """
    )


def _load_resume_token(cursor) -> dict | None:
    cursor.execute(
        "SELECT resume_token FROM mongo_change_stream_state WHERE stream_key = %s",
        (STREAM_KEY,),
    )
    row = cursor.fetchone()
    return row[0] if row else None


def _save_resume_token(cursor, token: dict) -> None:
    cursor.execute(
        """
        INSERT INTO mongo_change_stream_state (stream_key, resume_token, updated_at)
        VALUES (%s, %s, NOW())
        ON CONFLICT (stream_key) DO UPDATE
        SET resume_token = EXCLUDED.resume_token,
            updated_at = NOW();
        """,
        (STREAM_KEY, Json(token)),
    )


def _clear_resume_token() -> None:
    """Efface le point de reprise (utilisé quand Mongo le rejette, ex: oplog trop court)."""
    connection = psycopg2.connect(settings.database_url)
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM mongo_change_stream_state WHERE stream_key = %s",
                (STREAM_KEY,),
            )
        connection.commit()
    finally:
        connection.close()


# ---------------------------------------------------------------------------
# Traitement d'un événement
# ---------------------------------------------------------------------------

def _handle_change(
    change: dict,
    pg_connection,
    biens_collection,
    marche_collection,
    carrieres_collection,
    reglementation_collection,
) -> None:
    collection_name = change["ns"]["coll"]
    operation = change["operationType"]

    if operation == "delete":
        mongo_id = str(change["documentKey"]["_id"])
        if collection_name == settings.mongo_properties_collection:
            with pg_connection.cursor() as cursor:
                cursor.execute("DELETE FROM chatbot_properties WHERE mongo_id = %s", (mongo_id,))
            pg_connection.commit()  # PostgreSQL d'abord, validé...
            biens_collection.delete(ids=[mongo_id])  # ...puis ChromaDB
            logger.info("✗ Bien supprimé : %s", mongo_id)
        elif collection_name == settings.mongo_articles_collection:
            with pg_connection.cursor() as cursor:
                cursor.execute("DELETE FROM chatbot_articles WHERE mongo_id = %s", (mongo_id,))
            pg_connection.commit()
            marche_collection.delete(ids=[mongo_id])
            logger.info("✗ Article supprimé : %s", mongo_id)
        elif collection_name == settings.mongo_careers_collection:
            with pg_connection.cursor() as cursor:
                cursor.execute("DELETE FROM chatbot_careers WHERE mongo_id = %s", (mongo_id,))
            pg_connection.commit()
            carrieres_collection.delete(ids=[mongo_id])
            logger.info("✗ Offre d'emploi supprimée : %s", mongo_id)
        elif collection_name in REGULATION_SOURCE_COLLECTIONS:
            with pg_connection.cursor() as cursor:
                cursor.execute("DELETE FROM chatbot_regulations WHERE mongo_id = %s", (mongo_id,))
            pg_connection.commit()
            reglementation_collection.delete(ids=[mongo_id])
            logger.info("✗ Règlement supprimé (%s) : %s", collection_name, mongo_id)
        return

    document = change.get("fullDocument")
    if not document:
        # Le document a pu être supprimé entre l'événement et la lecture complète.
        return

    if collection_name == settings.mongo_properties_collection:
        record = _build_property_record(document)
        if not record["mongo_id"]:
            return

        # Étape 1 : MongoDB → PostgreSQL, validé avant de toucher ChromaDB.
        with pg_connection.cursor() as cursor:
            _upsert_record(cursor, "chatbot_properties", record)
        pg_connection.commit()

        # Étape 2 : PostgreSQL → ChromaDB, construit depuis la ligne Postgres
        # qu'on vient d'écrire (mêmes fonctions que sync_postgres_to_chroma.py).
        text = _build_property_text(record)
        if text.strip():
            metadata = _build_metadata(
                record,
                table_name="chatbot_properties",
                metadata_fields=PROPERTY_METADATA_FIELDS,
            )
            biens_collection.upsert(ids=[record["mongo_id"]], documents=[text], metadatas=[metadata])
        logger.info("✓ Bien synchronisé (%s) : %s", operation, record["mongo_id"])

    elif collection_name == settings.mongo_articles_collection:
        record = _build_article_record(document)
        if not record["mongo_id"]:
            return

        with pg_connection.cursor() as cursor:
            _upsert_record(cursor, "chatbot_articles", record)
        pg_connection.commit()

        text = _build_article_text(record)
        if text.strip():
            metadata = _build_metadata(
                record,
                table_name="chatbot_articles",
                metadata_fields=ARTICLE_METADATA_FIELDS,
            )
            marche_collection.upsert(ids=[record["mongo_id"]], documents=[text], metadatas=[metadata])
        logger.info("✓ Article synchronisé (%s) : %s", operation, record["mongo_id"])

    elif collection_name == settings.mongo_careers_collection:
        record = _build_career_record(document)
        if not record["mongo_id"]:
            return

        with pg_connection.cursor() as cursor:
            _upsert_record(cursor, "chatbot_careers", record)
        pg_connection.commit()

        text = _build_career_text(record)
        if text.strip():
            metadata = _build_metadata(
                record,
                table_name="chatbot_careers",
                metadata_fields=CAREER_METADATA_FIELDS,
            )
            carrieres_collection.upsert(ids=[record["mongo_id"]], documents=[text], metadatas=[metadata])
        logger.info("✓ Offre d'emploi synchronisée (%s) : %s", operation, record["mongo_id"])

    elif collection_name in REGULATION_SOURCE_COLLECTIONS:
        record = _build_regulation_record(document, collection_name)
        if not record["mongo_id"]:
            return

        with pg_connection.cursor() as cursor:
            _upsert_record(cursor, "chatbot_regulations", record)
        pg_connection.commit()

        text = _build_regulation_text(record)
        if text.strip():
            metadata = _build_metadata(
                record,
                table_name="chatbot_regulations",
                metadata_fields=REGULATION_METADATA_FIELDS,
            )
            reglementation_collection.upsert(ids=[record["mongo_id"]], documents=[text], metadatas=[metadata])
        logger.info("✓ Règlement synchronisé (%s, %s) : %s", operation, collection_name, record["mongo_id"])


# ---------------------------------------------------------------------------
# Boucle d'écoute
# ---------------------------------------------------------------------------

def _watch_forever() -> None:
    mongo_client = MongoClient(
        settings.mongo_uri,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=45000,
    )
    pg_connection = psycopg2.connect(settings.database_url)
    pg_connection.autocommit = False

    try:
        with pg_connection.cursor() as cursor:
            _ensure_schema(cursor)
            _ensure_state_table(cursor)
            pg_connection.commit()
            resume_token = _load_resume_token(cursor)

        biens_collection = get_or_create_collection(COLLECTION_BIENS)
        marche_collection = get_or_create_collection(COLLECTION_MARCHE)
        carrieres_collection = get_or_create_collection(COLLECTION_CARRIERES)
        reglementation_collection = get_or_create_collection(COLLECTION_REGLEMENTATION)

        watched_collections = [
            settings.mongo_properties_collection,
            settings.mongo_articles_collection,
            settings.mongo_careers_collection,
            *REGULATION_SOURCE_COLLECTIONS,
        ]
        pipeline = [{"$match": {"ns.coll": {"$in": watched_collections}}}]

        watch_kwargs: dict = {"pipeline": pipeline, "full_document": "updateLookup"}
        if resume_token is not None:
            watch_kwargs["resume_after"] = resume_token

        logger.info("Écoute des changements MongoDB sur %s ...", watched_collections)
        database = mongo_client[settings.mongo_db]
        with database.watch(**watch_kwargs) as stream:
            for change in stream:
                _handle_change(
                    change,
                    pg_connection,
                    biens_collection,
                    marche_collection,
                    carrieres_collection,
                    reglementation_collection,
                )
                with pg_connection.cursor() as cursor:
                    _save_resume_token(cursor, change["_id"])
                pg_connection.commit()
    finally:
        mongo_client.close()
        pg_connection.close()


def run() -> None:
    logger.info("=== Démarrage du listener MongoDB Change Streams ===")
    backoff = 1

    while True:
        try:
            _watch_forever()
        except OperationFailure as exc:
            if exc.code == 286:  # ChangeStreamHistoryLost : token trop ancien / oplog dépassé
                logger.warning(
                    "Point de reprise invalide (oplog dépassé) — réinitialisation, "
                    "reprise depuis 'maintenant'."
                )
                _clear_resume_token()
                backoff = 1
                continue
            logger.exception("Erreur MongoDB : %s — nouvelle tentative dans %ds", exc, backoff)
        except PyMongoError as exc:
            logger.warning("Connexion MongoDB perdue (%s) — reconnexion dans %ds", exc, backoff)
        except Exception:
            logger.exception("Erreur inattendue dans le listener — reprise dans %ds", backoff)

        time.sleep(backoff)
        backoff = min(backoff * 2, MAX_BACKOFF_SECONDS)


if __name__ == "__main__":
    run()

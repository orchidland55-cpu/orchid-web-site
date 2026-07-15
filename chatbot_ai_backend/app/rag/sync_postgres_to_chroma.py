"""
Synchronise les données métier PostgreSQL vers ChromaDB.

Le script lit les tables `chatbot_properties` et `chatbot_articles` (déjà
alimentées depuis MongoDB par sync_mongo_to_postgres.py), transforme chaque
ligne en texte exploitable pour le RAG, puis indexe dans ChromaDB.

Usage (depuis le dossier backend/) :
    python -m app.rag.sync_postgres_to_chroma
    python -m app.rag.sync_postgres_to_chroma --reset
    python -m app.rag.sync_postgres_to_chroma --target properties --limit 20
"""

from __future__ import annotations

import argparse
import logging
import re
from datetime import datetime
from decimal import Decimal
from typing import Any

import psycopg2
from psycopg2.extras import RealDictCursor

from app.config import settings
from app.rag.vectorstore import (
    COLLECTION_BIENS,
    COLLECTION_MARCHE,
    collection_stats,
    get_chroma_client,
    get_or_create_collection,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------

def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, bool):
        return "oui" if value else "non"
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, list):
        return ", ".join(str(item) for item in value if item not in (None, ""))
    return str(value).strip()


_HTML_TAG_RE = re.compile(r"<[^>]+>")


def _clean_long_text(value: Any, max_length: int = 2000) -> str:
    """Retire le HTML brut et tronque les textes longs (descriptions, articles) :
    ces champs peuvent contenir des dizaines de Ko de balisage qui n'apporte
    rien à la recherche sémantique et dépasse les quotas de taille par
    document de certains hébergeurs ChromaDB (ex. Chroma Cloud, 16 Ko)."""
    text = _normalize_text(value)
    text = _HTML_TAG_RE.sub(" ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > max_length:
        text = text[:max_length].rsplit(" ", 1)[0] + "…"
    return text


def _metadata_value(value: Any) -> Any:
    if value is None:
        return ""
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, (bool, int, float, str)):
        return value
    return _normalize_text(value)


# ---------------------------------------------------------------------------
# Construction du texte indexé
# ---------------------------------------------------------------------------

def _build_property_text(row: dict[str, Any]) -> str:
    lines = [
        f"Titre: {row['title']}",
        f"Ville: {row['city']}",
        f"Localisation: {row['location']}",
        f"Type: {row['property_type']}",
        f"Prix: {row['price_text']}",
        f"Chambres: {_normalize_text(row['bedrooms'])}",
        f"Salles de bain: {_normalize_text(row['bathrooms'])}",
        f"Surface: {row['area_text']}",
        f"Statut: {row['status']}",
        f"Aménagements: {row['amenities']}",
        f"Parking: {row['parking']}",
        f"Jardin: {_normalize_text(row['garden'])}",
        f"Piscine: {_normalize_text(row['pool'])}",
        f"Sécurité: {_normalize_text(row['security'])}",
        f"Meublé: {_normalize_text(row['furnished'])}",
        f"Agent: {row['agent']}",
        f"Description: {_clean_long_text(row['description'])}",
    ]
    return "\n".join(line for line in lines if not line.endswith(": "))


def _build_article_text(row: dict[str, Any]) -> str:
    lines = [
        f"Titre: {row['title']}",
        f"Catégorie: {row['category']}",
        f"Auteur: {row['author']}",
        f"Date: {_normalize_text(row['published_at'])}",
        f"Mots-clés: {_normalize_text(row.get('tags') or [])}",
        f"Résumé: {_clean_long_text(row['summary'], max_length=500)}",
        f"Contenu: {_clean_long_text(row['content'])}",
    ]
    return "\n".join(line for line in lines if not line.endswith(": "))


def _build_metadata(row: dict[str, Any], *, table_name: str, metadata_fields: list[str]) -> dict[str, Any]:
    metadata: dict[str, Any] = {"source": "postgresql", "source_table": table_name}
    for field in metadata_fields:
        value = _metadata_value(row.get(field))
        if value not in ("", [], {}):
            metadata[field] = value
    return metadata


# ---------------------------------------------------------------------------
# Champs PostgreSQL à recopier tels quels dans les métadonnées Chroma
# (partagés entre la synchro complète ci-dessous et mongo_change_listener.py)
# ---------------------------------------------------------------------------

PROPERTY_METADATA_FIELDS = [
    "city", "location", "property_type", "price_amount",
    "bedrooms", "bathrooms", "area_amount", "status",
    "garden", "pool", "security", "furnished", "mongo_id",
]
ARTICLE_METADATA_FIELDS = ["category", "author", "published_at", "mongo_id"]


# ---------------------------------------------------------------------------
# Synchronisation
# ---------------------------------------------------------------------------

def _reset_collection(name: str) -> None:
    client = get_chroma_client()
    try:
        client.delete_collection(name)
        logger.info("Collection '%s' réinitialisée.", name)
    except Exception:
        logger.info("Collection '%s' absente, aucune suppression nécessaire.", name)


def _fetch_rows(cursor, table_name: str, limit: int | None) -> list[dict[str, Any]]:
    query = f"SELECT * FROM {table_name}"
    if limit is not None:
        query += " LIMIT %s"
        cursor.execute(query, (limit,))
    else:
        cursor.execute(query)
    return cursor.fetchall()


def _sync_table(
    *,
    cursor,
    table_name: str,
    target_collection_name: str,
    builder,
    metadata_fields: list[str],
    reset: bool,
    limit: int | None,
) -> int:
    if reset:
        _reset_collection(target_collection_name)

    rows = _fetch_rows(cursor, table_name, limit)
    if not rows:
        logger.warning("Aucune ligne à synchroniser depuis '%s'.", table_name)
        return 0

    target_collection = get_or_create_collection(target_collection_name)

    ids: list[str] = []
    documents: list[str] = []
    metadatas: list[dict[str, Any]] = []

    for row in rows:
        text = builder(row)
        if not text.strip():
            continue

        ids.append(row["mongo_id"])
        documents.append(text)
        metadatas.append(_build_metadata(row, table_name=table_name, metadata_fields=metadata_fields))

    target_collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    logger.info(
        "✓ %d ligne(s) synchronisée(s) depuis '%s' vers '%s'",
        len(ids),
        table_name,
        target_collection_name,
    )
    return len(ids)


def run(reset: bool = False, limit: int | None = None, target: str = "all") -> None:
    logger.info("=== Démarrage de la synchronisation PostgreSQL → ChromaDB (reset=%s) ===", reset)

    connection = psycopg2.connect(settings.database_url)
    total = 0
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            if target in ("all", "properties"):
                total += _sync_table(
                    cursor=cursor,
                    table_name="chatbot_properties",
                    target_collection_name=COLLECTION_BIENS,
                    builder=_build_property_text,
                    metadata_fields=PROPERTY_METADATA_FIELDS,
                    reset=reset,
                    limit=limit,
                )
            if target in ("all", "articles"):
                total += _sync_table(
                    cursor=cursor,
                    table_name="chatbot_articles",
                    target_collection_name=COLLECTION_MARCHE,
                    builder=_build_article_text,
                    metadata_fields=ARTICLE_METADATA_FIELDS,
                    reset=reset,
                    limit=limit,
                )
    finally:
        connection.close()

    logger.info("=== Synchronisation terminée — %d documents au total ===", total)

    stats = collection_stats()
    for name, count in stats.items():
        logger.info("  %-20s : %d documents", name, count)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Synchronise PostgreSQL vers ChromaDB")
    parser.add_argument("--reset", action="store_true", help="Vide les collections avant d'indexer")
    parser.add_argument("--limit", type=int, default=None, help="Limite le nombre de lignes par table (debug)")
    parser.add_argument(
        "--target",
        choices=["all", "properties", "articles"],
        default="all",
        help="Restreindre la synchronisation à une seule table",
    )
    args = parser.parse_args()
    run(reset=args.reset, limit=args.limit, target=args.target)

from __future__ import annotations

import logging
import hashlib
import re
from dataclasses import dataclass

import chromadb
from chromadb import Collection
from chromadb.errors import NotFoundError
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

from app.rag.language import detect_language, normalize_language
from app.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Noms des collections (source unique de vérité — importés par indexer.py)
# ---------------------------------------------------------------------------

COLLECTION_BIENS = "biens"
COLLECTION_FAQ_EN = "faq_en"
COLLECTION_FAQ_FR = "faq_fr"
COLLECTION_MARCHE = "marche"

# ---------------------------------------------------------------------------
# Client ChromaDB (lazy init, singleton)
# ---------------------------------------------------------------------------

_chroma_client: chromadb.HttpClient | chromadb.PersistentClient | None = None


class LocalHashEmbeddingFunction:
    """Embedding local déterministe sans dépendance réseau."""

    def __init__(self, dimension: int = 128) -> None:
        self.dimension = dimension

    def name(self) -> str:
        return "default"

    def __call__(self, input: list[str]) -> list[list[float]]:
        return self.embed_documents(input)

    def embed_documents(self, input: list[str]) -> list[list[float]]:
        return [self._embed(text) for text in input]

    def embed_query(self, input: list[str]) -> list[list[float]]:
        return [self._embed(text) for text in input]

    def _embed(self, text: str) -> list[float]:
        vector = [0.0] * self.dimension
        tokens = re.findall(r"\w+", text.lower())
        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            index = int.from_bytes(digest[:4], "little") % self.dimension
            vector[index] += 1.0
        norm = sum(value * value for value in vector) ** 0.5 or 1.0
        return [value / norm for value in vector]


def get_chroma_client() -> chromadb.HttpClient:
    """Retourne le client ChromaDB, en le créant si nécessaire.

    Priorité : Chroma Cloud (si CHROMA_API_KEY est renseigné) > serveur
    HTTP distant (si CHROMA_HOST n'est pas "localhost") > disque local.
    """
    global _chroma_client
    if _chroma_client is None:
        if settings.chroma_api_key:
            _chroma_client = chromadb.CloudClient(
                tenant=settings.chroma_tenant,
                database=settings.chroma_database,
                api_key=settings.chroma_api_key,
            )
            logger.info("Client ChromaDB Cloud prêt — tenant=%s database=%s", settings.chroma_tenant, settings.chroma_database)
        elif settings.chroma_host == "localhost":
            _chroma_client = chromadb.PersistentClient(
                path=settings.chroma_persist_directory,
            )
            logger.info(
                "Client ChromaDB local prêt — %s",
                settings.chroma_persist_directory,
            )
        else:
            _chroma_client = chromadb.HttpClient(
                host=settings.chroma_host,
                port=settings.chroma_port,
            )
            logger.info(
                "Client ChromaDB connecté — %s:%s",
                settings.chroma_host,
                settings.chroma_port,
            )
    return _chroma_client


def _embedding_fn() -> OpenAIEmbeddingFunction:
    """Fonction d'embedding OpenAI, avec fallback local si la clé est absente."""
    api_key = (settings.openai_api_key or "").strip()
    if api_key and not api_key.startswith("your_") and api_key not in {"replace_me", "replace-me"}:
        return OpenAIEmbeddingFunction(
            api_key=api_key,
            model_name="text-embedding-3-small",
        )
    return LocalHashEmbeddingFunction()


# ---------------------------------------------------------------------------
# Accès aux collections
# ---------------------------------------------------------------------------

def get_collection(name: str) -> Collection:
    """
    Retourne une collection existante.
    Lève une exception si elle n'a pas encore été créée (lance indexer d'abord).
    """
    client = get_chroma_client()
    return client.get_collection(name=name, embedding_function=_embedding_fn())


def get_or_create_collection(name: str) -> Collection:
    """
    Retourne la collection si elle existe, la crée sinon.
    Utilisé par indexer.py lors de l'indexation initiale.
    """
    client = get_chroma_client()
    collection = client.get_or_create_collection(
        name=name,
        embedding_function=_embedding_fn(),
        metadata={"hnsw:space": "cosine"},  # similarité cosinus
    )
    logger.info("Collection '%s' prête (%d docs)", name, collection.count())
    return collection


# ---------------------------------------------------------------------------
# Fonctions de recherche
# ---------------------------------------------------------------------------

@dataclass
class SearchResult:
    id: str
    content: str
    metadata: dict
    score: float  # distance cosinus — plus proche de 0 = plus pertinent


def search(
    collection_name: str,
    query: str,
    n_results: int = 5,
    where: dict | None = None,
    max_distance: float | None = None,
) -> list[SearchResult]:
    """
    Recherche sémantique dans une collection.

    Args:
        collection_name: collection cible (biens, faq_en, faq_fr, marche)
        query:           Phrase en langage naturel (ex: "appartement vue mer Casablanca")
        n_results:       Nombre de résultats à retourner (défaut : 5)
        where:           Filtre sur les métadonnées (ex: {"ville": "Casablanca"})

    Returns:
        Liste de SearchResult triés par pertinence (le plus pertinent en premier).

    Example:
        results = search(COLLECTION_BIENS, "villa avec piscine à Marrakech", n_results=3)
        for r in results:
            print(r.content, r.score)
    """
    try:
        collection = get_collection(collection_name)
    except NotFoundError:
        logger.warning("Collection '%s' absente — recherche vide.", collection_name)
        return []

    query_params: dict = {
        "query_texts": [query],
        "n_results": n_results,
        "include": ["documents", "metadatas", "distances"],
    }
    if where:
        query_params["where"] = where

    raw = collection.query(**query_params)

    results: list[SearchResult] = []
    ids = raw["ids"][0]
    docs = raw["documents"][0]
    metas = raw["metadatas"][0]
    distances = raw["distances"][0]

    for doc_id, doc, meta, dist in zip(ids, docs, metas, distances):
        distance = round(dist, 4)
        if max_distance is not None and distance > max_distance:
            continue
        results.append(
            SearchResult(
                id=doc_id,
                content=doc,
                metadata=meta,
                score=distance,
            )
        )

    logger.debug(
        "Recherche '%s' dans '%s' → %d résultats",
        query[:60],
        collection_name,
        len(results),
    )
    return results


def search_biens(query: str, n_results: int = 5, ville: str | None = None) -> list[SearchResult]:
    """Recherche dans la collection biens, avec filtre optionnel par ville."""
    where = {"ville": ville} if ville else None
    return search(COLLECTION_BIENS, query, n_results=n_results, where=where)


def search_faq(
    query: str,
    language: str | None = None,
    n_results: int = 3,
    max_distance: float = 0.55,
) -> list[SearchResult]:
    """
    Recherche dans la collection FAQ.

    Le seuil `max_distance` évite d'envoyer au modèle des FAQ trop éloignées
    de la question de l'utilisateur.
    """
    normalized_language = normalize_language(language) or detect_language(query, default="fr")
    collection_name = COLLECTION_FAQ_FR if normalized_language == "fr" else COLLECTION_FAQ_EN
    results = search(collection_name, query, n_results=n_results, max_distance=max_distance)
    if results:
        return results

    fallback_collection = COLLECTION_FAQ_EN if collection_name == COLLECTION_FAQ_FR else COLLECTION_FAQ_FR
    if fallback_collection == collection_name:
        return results

    logger.info(
        "FAQ '%s' vide ou absente — fallback vers '%s'.",
        collection_name,
        fallback_collection,
    )
    return search(fallback_collection, query, n_results=n_results, max_distance=max_distance)


def search_marche(query: str, n_results: int = 3) -> list[SearchResult]:
    """Recherche dans la collection données marché."""
    return search(COLLECTION_MARCHE, query, n_results=n_results)


# ---------------------------------------------------------------------------
# Utilitaires
# ---------------------------------------------------------------------------

def collection_stats() -> dict[str, int]:
    """Retourne le nombre de documents dans chaque collection."""
    stats = {}
    for name in [COLLECTION_BIENS, COLLECTION_FAQ_EN, COLLECTION_FAQ_FR, COLLECTION_MARCHE]:
        try:
            col = get_collection(name)
            stats[name] = col.count()
        except Exception:
            stats[name] = 0
    return stats

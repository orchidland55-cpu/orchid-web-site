from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import logging
import re
from collections.abc import Sequence

from app.rag.language import detect_language, normalize_language
from app.rag.vectorstore import SearchResult, _embedding_fn, search_biens, search_faq, search_marche


logger = logging.getLogger(__name__)


PROPERTY_KEYWORDS = {
    "appartement": 3,
    "villa": 3,
    "maison": 3,
    "terrain": 3,
    "studio": 3,
    "riad": 3,
    "bureau": 2,
    "local": 2,
    "surface": 2,
    "chambre": 2,
    "chambres": 2,
    "quartier": 2,
    "ville": 2,
    "disponible": 2,
    "disponibles": 2,
    "cherche": 3,
    "recherche": 3,
    "chercher": 3,
    "looking for": 3,
    "search": 3,
    "property": 3,
    "apartment": 3,
    "house": 3,
    "flat": 3,
    "buy": 2,
    "sell": 2,
    "rent": 2,
    "listing": 2,
    "available": 2,
}

FAQ_KEYWORDS = {
    "documents": 3,
    "document": 3,
    "papiers": 3,
    "notaire": 3,
    "frais": 3,
    "taxe": 3,
    "taxes": 3,
    "délai": 3,
    "delai": 3,
    "procédure": 3,
    "procedure": 3,
    "banque": 2,
    "mortgage": 2,
    "compte": 2,
    "étranger": 2,
    "etranger": 2,
    "foreign": 2,
    "how to": 2,
    "process": 2,
}

MARKET_KEYWORDS = {
    "prix": 4,
    "price": 4,
    "m²": 4,
    "m2": 4,
    "mètre": 3,
    "metre": 3,
    "marché": 3,
    "marche": 3,
    "market": 3,
    "rentabilité": 3,
    "rentabilite": 3,
    "yield": 3,
    "tendance": 2,
    "trend": 2,
    "évolution": 2,
    "evolution": 2,
    "hausse": 2,
    "baisse": 2,
    "investissement": 2,
    "investment": 2,
    "average": 2,
    "mean": 2,
}

INTENT_ANCHORS: dict[str, tuple[str, ...]] = {
    "property": (
        "Je cherche un appartement à Casablanca.",
        "Je veux acheter une villa au Maroc.",
        "Montre-moi les biens disponibles par quartier.",
        "I am looking for a property to buy or rent.",
        "I want a house in Marrakech.",
        "Show me available listings for a flat.",
    ),
    "faq": (
        "Quels documents faut-il pour acheter un bien ?",
        "Combien de temps prend la procédure d'achat ?",
        "Quels sont les frais de notaire et les taxes ?",
        "Can a foreigner buy property in Morocco?",
        "How does the purchase process work?",
        "What papers are needed for a sale?",
    ),
    "market": (
        "Quel est le prix moyen au mètre carré à Casablanca ?",
        "Quelles sont les tendances du marché immobilier ?",
        "Est-ce que les prix augmentent ou baissent ?",
        "What is the average price per square meter?",
        "How is the rental yield evolving?",
        "What are the current real estate market trends?",
    ),
}


@dataclass(frozen=True)
class SearchPlan:
    language: str
    intent: str
    primary_collections: tuple[str, ...]
    fallback_collections: tuple[str, ...]


def _score(text: str, keywords: dict[str, int]) -> int:
    score = 0
    for keyword, weight in keywords.items():
        if keyword in text:
            score += weight
    return score


def _keyword_classify(text: str) -> tuple[str, dict[str, int]]:
    scores = {
        "property": _score(text, PROPERTY_KEYWORDS),
        "faq": _score(text, FAQ_KEYWORDS),
        "market": _score(text, MARKET_KEYWORDS),
    }

    best_intent = max(scores, key=scores.get)
    best_score = scores[best_intent]
    sorted_scores = sorted(scores.values(), reverse=True)
    second_score = sorted_scores[1] if len(sorted_scores) > 1 else 0

    if best_score == 0 or best_score - second_score < 2:
        return "mixed", scores

    return best_intent, scores


def _extract_vector(raw_embedding: object) -> list[float]:
    if hasattr(raw_embedding, "tolist"):
        raw_embedding = raw_embedding.tolist()

    if not isinstance(raw_embedding, (list, tuple)) or not raw_embedding:
        raise TypeError("Embedding payload must be a non-empty list.")

    first = raw_embedding[0]
    if hasattr(first, "tolist"):
        first = first.tolist()
    vector = first if isinstance(first, (list, tuple)) else raw_embedding
    return [float(value) for value in vector]


@lru_cache(maxsize=1)
def _embedding_model() -> object:
    return _embedding_fn()


def _embed_text(text: str) -> list[float]:
    """Embed one text using the same embedding model as the vector store."""
    model = _embedding_model()
    if hasattr(model, "embed_query"):
        return _extract_vector(model.embed_query([text]))
    if hasattr(model, "embed_documents"):
        return _extract_vector(model.embed_documents([text]))
    if callable(model):
        return _extract_vector(model([text]))
    raise TypeError("Embedding model does not expose a supported API.")


def _cosine_similarity(left: Sequence[float], right: Sequence[float]) -> float:
    if len(left) != len(right):
        raise ValueError("Vectors must have the same dimension.")

    dot_product = sum(lhs * rhs for lhs, rhs in zip(left, right))
    left_norm = sum(value * value for value in left) ** 0.5
    right_norm = sum(value * value for value in right) ** 0.5
    if left_norm == 0 or right_norm == 0:
        return 0.0
    return dot_product / (left_norm * right_norm)


@lru_cache(maxsize=1)
def _anchor_embeddings() -> dict[str, tuple[list[float], ...]]:
    return {
        intent: tuple(_embed_text(anchor) for anchor in anchors)
        for intent, anchors in INTENT_ANCHORS.items()
    }


def _semantic_classify(text: str) -> tuple[str, dict[str, int]]:
    query_vector = _embed_text(text)
    anchor_vectors = _anchor_embeddings()

    similarity_scores: dict[str, float] = {}
    for intent, vectors in anchor_vectors.items():
        if not vectors:
            similarity_scores[intent] = 0.0
            continue
        similarities = [_cosine_similarity(query_vector, anchor_vector) for anchor_vector in vectors]
        similarity_scores[intent] = sum(similarities) / len(similarities)

    best_intent = max(similarity_scores, key=similarity_scores.get)
    best_score = similarity_scores[best_intent]
    sorted_scores = sorted(similarity_scores.values(), reverse=True)
    second_score = sorted_scores[1] if len(sorted_scores) > 1 else 0.0

    scaled_scores = {intent: int(round(score * 1000)) for intent, score in similarity_scores.items()}
    if best_score - second_score < 0.05:
        return "mixed", scaled_scores

    return best_intent, scaled_scores


def classify_intent(text: str) -> tuple[str, dict[str, int]]:
    """Classify a query with semantic anchors, then fall back to keywords if needed."""
    normalized_text = re.sub(r"\s+", " ", text.lower()).strip()
    try:
        return _semantic_classify(normalized_text)
    except Exception as exc:
        logger.warning("Semantic intent classification unavailable, falling back to keywords: %s", exc)
        return _keyword_classify(normalized_text)


def build_search_plan(text: str, language: str | None = None) -> SearchPlan:
    detected_language = normalize_language(language) or detect_language(text, default="fr")
    intent, _scores = classify_intent(text)

    if intent == "property":
        primary = ("biens",)
        fallback = ("faq", "marche")
    elif intent == "faq":
        primary = ("faq",)
        fallback = ("biens", "marche")
    elif intent == "market":
        primary = ("marche",)
        fallback = ("faq", "biens")
    else:
        primary = ("biens", "faq", "marche")
        fallback = ()

    return SearchPlan(
        language=detected_language,
        intent=intent,
        primary_collections=primary,
        fallback_collections=fallback,
    )


def gather_search_results(text: str, language: str | None = None) -> tuple[dict[str, list[SearchResult]], SearchPlan, tuple[str, ...]]:
    plan = build_search_plan(text, language=language)
    results: dict[str, list[SearchResult]] = {"biens": [], "faq": [], "marche": []}
    searched_collections: list[str] = []

    def search_collection(collection_name: str) -> None:
        if collection_name == "biens":
            results["biens"] = search_biens(text, n_results=3)
        elif collection_name == "faq":
            results["faq"] = search_faq(text, language=plan.language, n_results=2)
        elif collection_name == "marche":
            results["marche"] = search_marche(text, n_results=2)
        searched_collections.append(collection_name)

    for collection_name in plan.primary_collections:
        search_collection(collection_name)

    primary_has_results = any(results[name] for name in plan.primary_collections)
    if not primary_has_results:
        for collection_name in plan.fallback_collections:
            search_collection(collection_name)

    return results, plan, tuple(searched_collections)

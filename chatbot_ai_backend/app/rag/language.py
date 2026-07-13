from __future__ import annotations

import re

FRENCH_HINTS = {
    "bonjour",
    "merci",
    "s'il",
    "c'est",
    "est-ce",
    "qu'est",
    "comment",
    "quel",
    "quelle",
    "quels",
    "quelles",
    "peut-on",
    "pouvez-vous",
    "pourquoi",
    "appartement",
    "maison",
    "terrain",
    "achat",
    "vente",
    "documents",
    "frais",
    "maroc",
}

ENGLISH_HINTS = {
    "hello",
    "thanks",
    "what",
    "which",
    "can",
    "could",
    "how",
    "property",
    "apartment",
    "house",
    "land",
    "buy",
    "sell",
    "documents",
    "fees",
    "morocco",
}


def normalize_language(language: str | None) -> str | None:
    if not language:
        return None

    normalized = language.strip().lower()
    if normalized.startswith("fr"):
        return "fr"
    if normalized.startswith("en"):
        return "en"
    return None


def detect_language(text: str, default: str = "fr") -> str:
    normalized_text = text.strip().lower()
    if not normalized_text:
        return default

    french_score = 0
    english_score = 0

    for hint in FRENCH_HINTS:
        if hint in normalized_text:
            french_score += 1

    for hint in ENGLISH_HINTS:
        if hint in normalized_text:
            english_score += 1

    if re.search(r"[àâçéèêëîïôùûüÿœ]", normalized_text):
        french_score += 2

    if french_score == english_score == 0:
        return default

    return "fr" if french_score >= english_score else "en"

from __future__ import annotations

import re

from langdetect import DetectorFactory, LangDetectException, detect

# Résultats reproductibles d'un appel à l'autre (langdetect est
# probabiliste par défaut et peut varier sans seed fixe).
DetectorFactory.seed = 0

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
    normalized_text = text.strip()
    if not normalized_text:
        return default

    try:
        detected = detect(normalized_text)
    except LangDetectException:
        detected = None

    if detected == "fr":
        return "fr"
    if detected == "en":
        return "en"

    # Repli sur les indices lexicaux si langdetect hésite (texte très
    # court, ambigu) ou détecte une langue tierce non supportée.
    lowered = normalized_text.lower()
    french_score = sum(1 for hint in FRENCH_HINTS if hint in lowered)
    english_score = sum(1 for hint in ENGLISH_HINTS if hint in lowered)

    if re.search(r"[àâçéèêëîïôùûüÿœ]", lowered):
        french_score += 2

    if french_score == english_score == 0:
        return default

    return "fr" if french_score >= english_score else "en"

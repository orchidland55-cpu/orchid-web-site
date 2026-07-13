import re

SUSPICIOUS_PATTERNS = [
    r"ignore previous instructions",
    r"system prompt",
    r"developer message",
    r"reveal the hidden prompt",
    r"act as",
]


def looks_like_prompt_injection(text: str) -> bool:
    normalized = text.lower()
    return any(re.search(pattern, normalized) for pattern in SUSPICIOUS_PATTERNS)

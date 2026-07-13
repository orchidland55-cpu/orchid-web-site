import json
import logging
from typing import Any

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Client Redis (connexion unique partagée par toute l'app)
# ---------------------------------------------------------------------------

_redis_client: aioredis.Redis | None = None


def get_redis_client() -> aioredis.Redis:
    """Retourne le client Redis, en le créant si nécessaire (lazy init)."""
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


# ---------------------------------------------------------------------------
# Clé de stockage
# ---------------------------------------------------------------------------

def _session_key(session_id: str) -> str:
    """Préfixe uniforme pour toutes les clés de session."""
    return f"session:{session_id}:history"


# ---------------------------------------------------------------------------
# Fonctions publiques
# ---------------------------------------------------------------------------

async def save_message(session_id: str, role: str, content: str) -> None:
    """
    Ajoute un message à la fin de l'historique de la session.

    Chaque message est sérialisé en JSON et stocké dans une liste Redis.
    Le TTL est réinitialisé à chaque nouveau message — la session expire
    seulement si elle est inactive pendant redis_session_ttl secondes.

    Args:
        session_id: Identifiant unique de la session (ex: uuid4).
        role:       "user" | "assistant" | "system"
        content:    Texte du message.
    """
    client = get_redis_client()
    key = _session_key(session_id)

    message: dict[str, Any] = {"role": role, "content": content}

    try:
        pipe = client.pipeline()
        pipe.rpush(key, json.dumps(message, ensure_ascii=False))
        pipe.expire(key, settings.redis_session_ttl)
        await pipe.execute()
        logger.debug("Message sauvegardé — session=%s role=%s", session_id, role)
    except Exception as exc:
        logger.error("Erreur Redis save_message — session=%s : %s", session_id, exc)
        raise


async def get_history(session_id: str) -> list[dict[str, str]]:
    """
    Retourne l'historique complet de la session, du plus ancien au plus récent.

    Retourne une liste vide si la session n'existe pas ou a expiré.

    Args:
        session_id: Identifiant unique de la session.

    Returns:
        Liste de dicts {"role": ..., "content": ...}
    """
    client = get_redis_client()
    key = _session_key(session_id)

    try:
        raw_messages = await client.lrange(key, 0, -1)
        return [json.loads(m) for m in raw_messages]
    except Exception as exc:
        logger.error("Erreur Redis get_history — session=%s : %s", session_id, exc)
        raise


async def clear_session(session_id: str) -> None:
    """
    Supprime immédiatement l'historique d'une session.

    Utile quand l'utilisateur démarre une nouvelle conversation
    ou pour les tests.

    Args:
        session_id: Identifiant unique de la session.
    """
    client = get_redis_client()
    key = _session_key(session_id)

    try:
        await client.delete(key)
        logger.debug("Session supprimée — session=%s", session_id)
    except Exception as exc:
        logger.error("Erreur Redis clear_session — session=%s : %s", session_id, exc)
        raise


async def get_session_ttl(session_id: str) -> int:
    """
    Retourne le TTL restant (en secondes) de la session.

    Returns:
        Secondes restantes, -2 si la clé n'existe pas, -1 si pas d'expiration.
    """
    client = get_redis_client()
    key = _session_key(session_id)

    try:
        return await client.ttl(key)
    except Exception as exc:
        logger.error("Erreur Redis get_session_ttl — session=%s : %s", session_id, exc)
        raise


async def close_redis() -> None:
    """
    Ferme proprement la connexion Redis.
    À appeler dans le shutdown event de FastAPI.
    """
    global _redis_client
    if _redis_client is not None:
        await _redis_client.aclose()
        _redis_client = None
        logger.info("Connexion Redis fermée.")
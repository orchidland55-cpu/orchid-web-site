import logging

from fastapi import Request

from app.config import settings
from app.memory.redis_memory import get_redis_client

logger = logging.getLogger(__name__)


def get_client_ip(request: Request) -> str:
    """Résout l'IP réelle du client derrière un proxy (Express/Railway)."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


async def is_rate_limited(client_ip: str) -> bool:
    """Fenêtre fixe par IP : incrémente un compteur Redis avec expiration."""
    client = get_redis_client()
    key = f"rate_limit:{client_ip}"

    try:
        current = await client.incr(key)
        if current == 1:
            await client.expire(key, settings.rate_limit_window_seconds)
        return current > settings.rate_limit_max_requests
    except Exception as exc:
        logger.error("Erreur Redis is_rate_limited — ip=%s : %s", client_ip, exc)
        return False

from fastapi import Header, HTTPException, status

from app.config import settings


def verify_internal_token(x_internal_token: str | None = Header(default=None)) -> None:
    if not settings.internal_token:
        return

    if x_internal_token != settings.internal_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

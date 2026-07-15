import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class Settings(BaseModel):
    app_name: str = "OrchidIsland Chatbot API"
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/orchid_chatbot",
    )
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_session_ttl: int = int(os.getenv("REDIS_SESSION_TTL", "7200"))
    mongo_uri: str = os.getenv("MONGO_URI", "")
    mongo_db: str = os.getenv("MONGO_DB", "orchidDB")
    mongo_properties_collection: str = os.getenv("MONGO_PROPERTIES_COLLECTION", "properties")
    mongo_articles_collection: str = os.getenv("MONGO_ARTICLES_COLLECTION", "articles")
    chroma_host: str = os.getenv("CHROMA_HOST", "localhost")
    chroma_port: int = int(os.getenv("CHROMA_PORT", "8001"))
    chroma_persist_directory: str = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma")
    # Chroma Cloud (https://trychroma.com) — si CHROMA_API_KEY est renseigné,
    # get_chroma_client() se connecte à Chroma Cloud au lieu du disque local.
    chroma_tenant: str = os.getenv("CHROMA_TENANT", "")
    chroma_database: str = os.getenv("CHROMA_DATABASE", "")
    chroma_api_key: str = os.getenv("CHROMA_API_KEY", "")
    deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
    deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "https://integrate.api.nvidia.com/v1")
    deepseek_model: str = os.getenv("DEEPSEEK_MODEL", "deepseek-ai/deepseek-v4-pro")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    secret_key: str = os.getenv("SECRET_KEY", "replace-me")
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    internal_token: str = os.getenv("INTERNAL_TOKEN", "")
    rate_limit_max_requests: int = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "20"))
    rate_limit_window_seconds: int = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))


settings = Settings()

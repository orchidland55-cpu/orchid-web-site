"""
Synchronise les données métier MongoDB vers PostgreSQL.

Le script lit les collections `properties` et `articles` de MongoDB, retire les
champs inutiles au chatbot comme les images, puis prépare des enregistrements
structurés pour les futures tables PostgreSQL du projet.
"""

from __future__ import annotations

import argparse
import logging
from collections.abc import Iterable
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import Any

import psycopg2
from psycopg2.extras import Json
from pymongo import MongoClient
from pymongo.collection import Collection as MongoCollection

from app.config import settings

logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")
logger = logging.getLogger(__name__)

IMAGE_KEYS = {
    "image",
    "images",
    "mainImage",
    "coverImage",
    "thumbnail",
    "gallery",
    "additionalImages",
}


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, bool):
        return "oui" if value else "non"
    if isinstance(value, (int, float, Decimal)):
        if isinstance(value, float) and value.is_integer():
            return str(int(value))
        return str(value)
    if isinstance(value, dict):
        parts = []
        for key, item in value.items():
            normalized_item = _normalize_text(item)
            if normalized_item:
                parts.append(f"{key}: {normalized_item}")
        return ", ".join(parts)
    if isinstance(value, Iterable) and not isinstance(value, (str, bytes)):
        parts = [_normalize_text(item) for item in value]
        return ", ".join(part for part in parts if part)
    return " ".join(str(value).split())


def _pick_first(document: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = document.get(key)
        if value not in (None, "", [], {}):
            return value
    return None


def _to_bool(value: Any) -> bool | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    if text in {"true", "1", "yes", "y", "oui"}:
        return True
    if text in {"false", "0", "no", "n", "non"}:
        return False
    return None


def _to_int(value: Any) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _to_decimal(value: Any) -> Decimal | None:
    if value is None or value == "":
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None


def _to_datetime(value: Any) -> datetime | None:
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, dict) and "$date" in value:
        value = value["$date"]
    if isinstance(value, str):
        text = value.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(text)
        except ValueError:
            return None
    return None


def _sanitize_raw_data(document: dict[str, Any]) -> dict[str, Any]:
    def sanitize(value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: sanitize(item)
                for key, item in value.items()
                if key not in IMAGE_KEYS
            }
        if isinstance(value, list):
            return [sanitize(item) for item in value]
        if isinstance(value, datetime):
            return value.isoformat()
        return value

    return {
        key: sanitize(value)
        for key, value in document.items()
        if key not in IMAGE_KEYS and key != "_id"
    }


def _build_property_record(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "mongo_id": str(document.get("_id") or ""),
        "title": _normalize_text(_pick_first(document, "title", "name", "headline", "slug")),
        "city": _normalize_text(_pick_first(document, "city", "ville")),
        "location": _normalize_text(_pick_first(document, "location", "address", "neighborhood", "quartier")),
        "property_type": _normalize_text(_pick_first(document, "type", "propertyType", "category")),
        "price_text": _normalize_text(_pick_first(document, "price", "prix")),
        "price_amount": _to_decimal(_pick_first(document, "price", "prix")),
        "bedrooms": _to_int(_pick_first(document, "bedrooms", "rooms", "chambres")),
        "bathrooms": _to_int(_pick_first(document, "bathrooms", "sallesDeBain", "baths")),
        "area_text": _normalize_text(_pick_first(document, "area", "surface", "size")),
        "area_amount": _to_decimal(_pick_first(document, "area", "surface", "size")),
        "status": _normalize_text(_pick_first(document, "status", "state")),
        "description": _normalize_text(_pick_first(document, "description", "texte", "content", "details")),
        "amenities": _normalize_text(_pick_first(document, "amenities", "amenitiesList", "features", "equipments")),
        "parking": _normalize_text(_pick_first(document, "parking")),
        "garden": _to_bool(_pick_first(document, "garden")),
        "pool": _to_bool(_pick_first(document, "pool")),
        "security": _to_bool(_pick_first(document, "security")),
        "furnished": _to_bool(_pick_first(document, "furnished")),
        "agent": _normalize_text(_pick_first(document, "person", "performedBy", "agent", "author")),
        "source_collection": "properties",
        "raw_data": _sanitize_raw_data(document),
        "created_at": _to_datetime(_pick_first(document, "createdAt", "created_at")),
        "updated_at": _to_datetime(_pick_first(document, "updatedAt", "updated_at")),
    }


def _build_article_record(document: dict[str, Any]) -> dict[str, Any]:
    return {
        "mongo_id": str(document.get("_id") or ""),
        "title": _normalize_text(_pick_first(document, "title", "name", "headline")),
        "category": _normalize_text(_pick_first(document, "category", "type", "section", "topic")),
        "summary": _normalize_text(_pick_first(document, "summary", "excerpt", "intro", "description")),
        "content": _normalize_text(_pick_first(document, "content", "body", "texte", "details", "article")),
        "author": _normalize_text(_pick_first(document, "author", "performedBy", "person")),
        "tags": _pick_first(document, "tags", "keywords") or [],
        "published_at": _to_datetime(_pick_first(document, "publishedAt", "createdAt", "updatedAt", "date")),
        "source_collection": "articles",
        "raw_data": _sanitize_raw_data(document),
        "created_at": _to_datetime(_pick_first(document, "createdAt", "created_at")),
        "updated_at": _to_datetime(_pick_first(document, "updatedAt", "updated_at")),
    }


def _load_mongo_collection(client: MongoClient, database_name: str, collection_name: str) -> MongoCollection:
    return client[database_name][collection_name]


def _ensure_schema(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS chatbot_properties (
            mongo_id TEXT PRIMARY KEY,
            title TEXT NOT NULL DEFAULT '',
            city TEXT NOT NULL DEFAULT '',
            location TEXT NOT NULL DEFAULT '',
            property_type TEXT NOT NULL DEFAULT '',
            price_text TEXT NOT NULL DEFAULT '',
            price_amount NUMERIC NULL,
            bedrooms INTEGER NULL,
            bathrooms INTEGER NULL,
            area_text TEXT NOT NULL DEFAULT '',
            area_amount NUMERIC NULL,
            status TEXT NOT NULL DEFAULT '',
            description TEXT NOT NULL DEFAULT '',
            amenities TEXT NOT NULL DEFAULT '',
            parking TEXT NOT NULL DEFAULT '',
            garden BOOLEAN NULL,
            pool BOOLEAN NULL,
            security BOOLEAN NULL,
            furnished BOOLEAN NULL,
            agent TEXT NOT NULL DEFAULT '',
            source_collection TEXT NOT NULL DEFAULT 'properties',
            raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NULL,
            updated_at TIMESTAMPTZ NULL,
            synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS chatbot_articles (
            mongo_id TEXT PRIMARY KEY,
            title TEXT NOT NULL DEFAULT '',
            category TEXT NOT NULL DEFAULT '',
            summary TEXT NOT NULL DEFAULT '',
            content TEXT NOT NULL DEFAULT '',
            author TEXT NOT NULL DEFAULT '',
            tags JSONB NOT NULL DEFAULT '[]'::jsonb,
            published_at TIMESTAMPTZ NULL,
            source_collection TEXT NOT NULL DEFAULT 'articles',
            raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NULL,
            updated_at TIMESTAMPTZ NULL,
            synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        """
    )


def _truncate_tables(cursor) -> None:
    cursor.execute("TRUNCATE TABLE chatbot_properties, chatbot_articles;")


def _upsert_record(cursor, table_name: str, record: dict[str, Any]) -> None:
    prepared_record = dict(record)
    if "raw_data" in prepared_record and not isinstance(prepared_record["raw_data"], Json):
        prepared_record["raw_data"] = Json(prepared_record["raw_data"])
    if "tags" in prepared_record and not isinstance(prepared_record["tags"], Json):
        prepared_record["tags"] = Json(prepared_record["tags"])

    columns = list(prepared_record.keys())
    values = [prepared_record[column] for column in columns]
    assignments = ", ".join(
        f"{column} = EXCLUDED.{column}"
        for column in columns
        if column != "mongo_id"
    )
    placeholders = ", ".join(["%s"] * len(columns))
    cursor.execute(
        f"""
        INSERT INTO {table_name} ({", ".join(columns)})
        VALUES ({placeholders})
        ON CONFLICT (mongo_id) DO UPDATE
        SET {assignments},
            synced_at = NOW();
        """,
        values,
    )


def _sync_collection(
    *,
    source_collection: MongoCollection,
    cursor,
    table_name: str,
    builder,
    limit: int | None,
) -> int:
    mongo_cursor = source_collection.find({})
    if limit is not None:
        mongo_cursor = mongo_cursor.limit(limit)

    count = 0
    for document in mongo_cursor:
        record = builder(document)
        if not record["mongo_id"]:
            continue
        _upsert_record(cursor, table_name, record)
        count += 1

    logger.info(
        "✓ %d document(s) synchronisé(s) depuis '%s' vers '%s'",
        count,
        source_collection.name,
        table_name,
    )
    return count

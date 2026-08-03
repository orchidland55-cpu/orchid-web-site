from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

PROPERTY_ID = "470936546"

CREDENTIALS = PROJECT_ROOT / "config" / "credentials.json"

RAW_DATA = PROJECT_ROOT / "data" / "raw"

PROCESSED_DATA = PROJECT_ROOT / "data" / "processed"

RESULTS = PROJECT_ROOT / "data" / "results"

ARCHIVE = PROJECT_ROOT / "data" / "archive"

MODELS = PROJECT_ROOT / "models"

LOGS = PROJECT_ROOT / "logs"
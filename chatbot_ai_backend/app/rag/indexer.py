"""
Script d'indexation ChromaDB.

Lit les modules Python de FAQ dans backend/data/ (Q_A.py pour le français,
Q_A_en.py pour l'anglais — même structure SECTIONS, même questions, deux
langues) et insère les documents dans les collections ChromaDB. Les biens et
données de marché sont indexés séparément depuis PostgreSQL, voir
sync_postgres_to_chroma.py.

Usage (depuis le dossier backend/) :
    python -m app.rag.indexer
    python -m app.rag.indexer --reset   # vide les collections avant d'indexer
"""

import argparse
import importlib.util
import logging
import sys
from pathlib import Path
from types import ModuleType

from app.rag.vectorstore import (
    COLLECTION_FAQ_EN,
    COLLECTION_FAQ_FR,
    collection_stats,
    get_or_create_collection,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")
logger = logging.getLogger(__name__)

# Dossier data/ relatif à la racine du backend
DATA_DIR = Path(__file__).resolve().parents[2] / "data"
FAQ_FR_MODULE = "Q_A.py"
FAQ_EN_MODULE = "Q_A_en.py"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_qa_module(filename: str) -> ModuleType:
    """Importe dynamiquement un fichier Q_A*.py et retourne le module chargé."""
    path = DATA_DIR / filename
    if not path.exists():
        logger.error("Fichier introuvable : %s", path)
        sys.exit(1)

    module_name = f"qa_data_{path.stem}"
    spec = importlib.util.spec_from_file_location(module_name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _reset_collection(name: str) -> None:
    """Supprime tous les documents d'une collection sans la supprimer."""
    from app.rag.vectorstore import get_chroma_client
    client = get_chroma_client()
    try:
        client.delete_collection(name)
        logger.info("Collection '%s' vidée.", name)
    except Exception:
        pass  # n'existait pas encore


# ---------------------------------------------------------------------------
# Indexation par collection
# ---------------------------------------------------------------------------

def _index_faq_collection(collection_name: str, filename: str, language: str) -> int:
    module = _load_qa_module(filename)
    collection = get_or_create_collection(collection_name)

    ids, documents, metadatas = [], [], []
    for section in module.SECTIONS:
        section_title = section["title"]
        for qid, question, answer in section["qas"]:
            question = (question or "").strip()
            answer = (answer or "").strip()
            if not question or not answer:
                continue

            ids.append(str(qid))
            documents.append(f"Question : {question}\nRéponse : {answer}")
            metadatas.append(
                {
                    "question": question,
                    "answer": answer,
                    "section": section_title,
                    "language": language,
                    "source": filename,
                }
            )

    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    logger.info("✓ %d entrées FAQ indexées dans '%s'", len(ids), collection_name)
    return len(ids)


def index_faq(reset: bool = False) -> int:
    if reset:
        _reset_collection(COLLECTION_FAQ_EN)
        _reset_collection(COLLECTION_FAQ_FR)

    total = 0
    total += _index_faq_collection(COLLECTION_FAQ_EN, FAQ_EN_MODULE, "en")
    total += _index_faq_collection(COLLECTION_FAQ_FR, FAQ_FR_MODULE, "fr")
    return total


# ---------------------------------------------------------------------------
# Point d'entrée
# ---------------------------------------------------------------------------

def run(reset: bool = False) -> None:
    """Indexe la FAQ."""
    logger.info("=== Démarrage de l'indexation (reset=%s) ===", reset)

    total = index_faq(reset=reset)

    logger.info("=== Indexation terminée — %d documents au total ===", total)

    stats = collection_stats()
    for name, count in stats.items():
        logger.info("  %-20s : %d documents", name, count)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Indexe les données dans ChromaDB")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Vide les collections avant d'indexer (réindexation complète)",
    )
    args = parser.parse_args()
    run(reset=args.reset)

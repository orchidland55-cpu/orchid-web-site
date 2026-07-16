"""
Recharge complètement ChromaDB en un seul processus : biens/marché depuis
PostgreSQL, puis FAQ depuis les fichiers Q_A.py/Q_A_en.py.

Combine sync_postgres_to_chroma.run() et indexer.run() dans le même
interpréteur Python, pour être utilisé comme unique commande de pre-deploy
Railway (évite toute dépendance au chaînage shell `&&`, qui s'est révélé
peu fiable dans l'environnement de pre-deploy de Railway).

Usage :
    python -m app.rag.seed_all
"""
import logging

from app.rag import indexer, sync_postgres_to_chroma

logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")
logger = logging.getLogger(__name__)


def run() -> None:
    logger.info("=== Rechargement complet de ChromaDB ===")
    sync_postgres_to_chroma.run(reset=True)
    indexer.run(reset=True)
    logger.info("=== Rechargement complet terminé ===")


if __name__ == "__main__":
    run()

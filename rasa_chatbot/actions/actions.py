from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from pymongo import MongoClient
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connexion MongoDB - Utiliser la même base que le backend
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://ouaqabochra:oAfiRhJAUmyDISZ7@cluster0.ypinp1i.mongodb.net/orchid?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client["orchid"]
properties_collection = db["properties"]
articles_collection = db["articles"]
contacts_collection = db["contacts"]

class ActionListerBiens(Action):
    def name(self) -> Text:
        return "action_lister_biens"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        ville = next(tracker.get_latest_entity_values("ville"), None)
        logger.info(f"Ville extraite: {ville}")  # ✅ Log pour déboguer

        if ville:
            # Si ville spécifiée, lister quelques propriétés
            query = {"city": ville}
            biens = properties_collection.find(query).limit(3)
            message = f"Voici quelques propriétés disponibles à {ville} :\n"
            found = False

            for bien in biens:
                found = True
                type_bien = bien.get('type', 'Type inconnu')
                surface = bien.get('area', 'Surface inconnue')
                chambres = bien.get('bedrooms', 'N/A')
                prix = bien.get('price', 'Prix inconnu')
                titre = bien.get('title', 'Titre inconnu')

                message += f"- {titre}: {type_bien}, {surface} m², {chambres} chambres, {prix} €\n"

            if found:
                message += f"\nPour voir toutes les propriétés à {ville}, visitez : /properties?city={ville}"
            else:
                message = f"Aucune propriété trouvée à {ville}. Visitez /properties pour toutes les options."
        else:
            # Pas de ville spécifiée, donner le lien
            message = "Vous pouvez voir toutes les propriétés disponibles sur notre page propriétés : /properties"

        dispatcher.utter_message(text=message)
        return []

class ActionListerArticles(Action):
    def name(self) -> Text:
        return "action_lister_articles"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        categorie = next(tracker.get_latest_entity_values("categorie"), None)
        logger.info(f"Catégorie extraite: {categorie}")

        if categorie:
            # Si catégorie spécifiée, lister quelques articles
            query = {"status": "published", "category": categorie}
            articles = articles_collection.find(query).limit(3)
            message = f"Voici quelques articles sur {categorie} :\n"
            found = False

            for article in articles:
                found = True
                titre = article.get('title', 'Titre inconnu')
                excerpt = article.get('excerpt', 'Extrait inconnu')[:100]

                message += f"- {titre}: {excerpt}...\n"

            if found:
                message += f"\nPour voir tous les articles sur {categorie}, visitez : /blog?category={categorie}"
            else:
                message = f"Aucun article trouvé sur {categorie}. Visitez /blog pour tous les articles."
        else:
            # Pas de catégorie, donner le lien
            message = "Consultez nos derniers articles sur le blog : /blog"

        dispatcher.utter_message(text=message)
        return []

class ActionAideGenerale(Action):
    def name(self) -> Text:
        return "action_aide_generale"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        message = "Je peux vous aider avec :\n" \
                  "- Recherche de propriétés immobilières\n" \
                  "- Informations sur les articles et actualités\n" \
                  "- Contact avec notre équipe\n" \
                  "- Planifier une visite\n" \
                  "- Investir dans l'immobilier\n" \
                  "- Postuler en tant qu'investisseur\n" \
                  "Dites-moi ce dont vous avez besoin !"

        dispatcher.utter_message(text=message)
        return []

class ActionDonnerPrix(Action):
    def name(self) -> Text:
        return "action_donner_prix"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        type_bien = next(tracker.get_latest_entity_values("type"), None)
        ville = next(tracker.get_latest_entity_values("ville"), None)
        logger.info(f"Type: {type_bien}, Ville: {ville}")  # ✅ Log pour déboguer

        if type_bien or ville:
            # Si détails spécifiés, donner un exemple de prix
            query = {}
            if type_bien:
                query["type"] = type_bien
            if ville:
                query["city"] = ville

            bien = properties_collection.find_one(query)
            if bien:
                prix = bien.get('price', 'Prix inconnu')
                titre = bien.get('title', 'Titre inconnu')
                message = f"Le prix de {titre} ({bien['type']} à {bien['city']}) est {prix} €.\n"
                params = []
                if type_bien:
                    params.append(f"type={type_bien}")
                if ville:
                    params.append(f"city={ville}")
                query_string = "&".join(params)
                message += f"Pour plus d'options, visitez : /properties?{query_string}"
            else:
                message = "Aucun bien trouvé avec ces critères. Visitez /properties pour toutes les options."
        else:
            # Pas de détails, donner le lien
            message = "Consultez les prix sur notre page propriétés : /properties"

        dispatcher.utter_message(text=message)
        return []
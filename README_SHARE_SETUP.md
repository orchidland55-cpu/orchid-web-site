# Configuration du Partage Social avec Amis

## Vue d'ensemble
Le système de partage a été étendu pour permettre aux utilisateurs de partager des articles avec leurs amis/connexions sur Facebook, Twitter et LinkedIn.

## ⚡ Configuration Rapide

### Option 1: Variables d'environnement (Recommandé)
1. **Copiez** `.env.example` vers `.env`
2. **Remplacez les valeurs** par vos vraies clés API
3. **Redémarrez** votre serveur de développement

### Option 2: Configuration directe
1. **Ouvrez le fichier** `frontend/src/config/socialAuth.ts`
2. **Remplacez les placeholders** par vos vraies clés API
3. **Suivez les instructions** ci-dessous pour obtenir chaque clé

## 🔑 Obtenir les Clés API

### 1. Facebook App ID
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle app ou utilisez une existante
3. Dans "Paramètres" > "Paramètres de base", copiez l'**App ID**
4. Dans "Facebook Login" > "Paramètres", ajoutez votre domaine
5. Remplacez `YOUR_FACEBOOK_APP_ID` dans `socialAuth.ts`

### 2. Twitter Client ID
1. Allez sur [Twitter Developer Portal](https://developer.twitter.com/)
2. Créez un nouveau projet d'application
3. Dans "Keys and Tokens", copiez le **Client ID**
4. Dans "App permissions", assurez-vous d'avoir "Read and write"
5. Dans "Authentication settings", configurez OAuth 2.0
6. Remplacez `YOUR_TWITTER_CLIENT_ID` dans `socialAuth.ts`

### 3. LinkedIn Client ID
1. Allez sur [LinkedIn Developers](https://developer.linkedin.com/)
2. Créez une nouvelle application
3. Dans "Auth", copiez le **Client ID**
4. Dans "Products", ajoutez "Sign In with LinkedIn"
5. Dans "Authorized redirect URLs", ajoutez votre domaine
6. Remplacez `YOUR_LINKEDIN_CLIENT_ID` dans `socialAuth.ts`

## Fonctionnalités Implémentées

### Facebook
- ✅ Authentification via Facebook Login
- ✅ Récupération des amis
- ✅ Sélection multiple d'amis
- ✅ Partage avec amis sélectionnés

### Twitter
- ✅ Authentification OAuth 2.0
- ✅ Simulation de récupération d'amis (remplacer par API réelle)
- ✅ Sélection d'amis avec mentions @username
- ✅ Partage avec tweet incluant les mentions

### LinkedIn
- ✅ Authentification OAuth 2.0
- ✅ Simulation de récupération de connexions
- ✅ Sélection de connexions professionnelles
- ✅ Partage LinkedIn avec connexions

## Utilisation
1. Cliquez sur le bouton "Share"
2. Sélectionnez le réseau social
3. Connectez-vous si nécessaire
4. Choisissez les amis/connexions
5. Cliquez sur "Share" ou "Tweet"

## Notes Techniques
- Les données d'amis/connexions sont simulées pour le développement
- Remplacez les fonctions de simulation par les vraies APIs en production
- Assurez-vous que les redirections OAuth sont correctement configurées
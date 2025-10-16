// Configuration des clés API pour les réseaux sociaux
// Remplacez ces valeurs par vos vraies clés API

export const SOCIAL_AUTH_CONFIG = {
  FACEBOOK: {
    APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || '123456789', // Valeur de test
    VERSION: 'v18.0',
    SCOPES: 'email,user_friends'
  },

  TWITTER: {
    CLIENT_ID: import.meta.env.VITE_TWITTER_CLIENT_ID || 'test-twitter-client-id',
    SCOPES: 'tweet.read users.read follows.read',
    REDIRECT_URI: window.location.origin
  },

  LINKEDIN: {
    CLIENT_ID: import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'test-linkedin-client-id',
    SCOPES: 'r_liteprofile r_emailaddress w_member_social',
    REDIRECT_URI: window.location.origin
  }
};

// Instructions pour obtenir les clés API :

/*
=== FACEBOOK ===
1. Allez sur https://developers.facebook.com
2. Créez une nouvelle app ou utilisez une existante
3. Dans "Paramètres" > "Paramètres de base", copiez l'App ID
4. Dans "Facebook Login" > "Paramètres", ajoutez votre domaine
5. Remplacez YOUR_FACEBOOK_APP_ID par votre App ID réel

=== TWITTER ===
1. Allez sur https://developer.twitter.com
2. Créez un nouveau projet d'application
3. Dans "Keys and Tokens", copiez le Client ID
4. Dans "App permissions", assurez-vous d'avoir "Read and write"
5. Dans "Authentication settings", configurez OAuth 2.0
6. Remplacez YOUR_TWITTER_CLIENT_ID par votre Client ID réel

=== LINKEDIN ===
1. Allez sur https://developer.linkedin.com
2. Créez une nouvelle application
3. Dans "Auth", copiez le Client ID
4. Dans "Products", ajoutez "Sign In with LinkedIn"
5. Dans "Authorized redirect URLs", ajoutez votre domaine
6. Remplacez YOUR_LINKEDIN_CLIENT_ID par votre Client ID réel
*/

export default SOCIAL_AUTH_CONFIG;
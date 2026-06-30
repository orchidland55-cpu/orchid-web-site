import { useEffect } from 'react';

// Extend window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (options: object, elementId: string) => void & {
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
  }
}

let googleTranslateInitialized = false;
let initPromise: Promise<void> | null = null;

export const initGoogleTranslate = (): Promise<void> => {
  // Si déjà initialisé, retourner immédiatement
  if (googleTranslateInitialized && window.google?.translate) {
    return Promise.resolve();
  }

  // Si une initialisation est en cours, retourner la promesse existante
  if (initPromise) {
    return initPromise;
  }

  initPromise = new Promise((resolve) => {
    // Vérifier si Google Translate est déjà chargé
    if (window.google?.translate) {
      googleTranslateInitialized = true;
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-translate-script');

    if (existingScript) {
      // Attendre que Google soit prêt avec un timeout de sécurité
      let attempts = 0;
      const maxAttempts = 50; // 5 secondes max
      const interval = setInterval(() => {
        attempts++;
        if (window.google?.translate) {
          clearInterval(interval);
          googleTranslateInitialized = true;
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error('Google Translate failed to load');
          resolve(); // Résoudre quand même pour ne pas bloquer
        }
      }, 100);
      return;
    }

    // Créer le conteneur caché pour Google Translate
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    // Définir la fonction d'initialisation globale
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'auto',
            includedLanguages: 'en,fr,ar,es',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        googleTranslateInitialized = true;
        resolve();
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        resolve(); // Résoudre même en cas d'erreur
      }
    };

    // Charger le script Google Translate
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      resolve(); // Résoudre même en cas d'erreur de chargement
    };
    document.body.appendChild(script);
  });

  return initPromise;
};

/**
 * Programmatically switch the page language
 */
export const switchGoogleLanguage = async (langCode: string) => {
  try {
    // S'assurer que Google Translate est initialisé
    await initGoogleTranslate();

    // Attendre que le DOM soit prêt
    await new Promise(resolve => setTimeout(resolve, 500));

    // Essayer de changer la langue via le select de Google Translate
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (select) {
      // Vérifier si la langue est disponible
      const options = Array.from(select.options).map(opt => opt.value);
      
      if (options.includes(langCode)) {
        select.value = langCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Forcer la retraduction après un court délai
        setTimeout(() => {
          // Déclencher un rafraîchissement du DOM
          const event = new Event('DOMContentLoaded', { bubbles: true });
          document.dispatchEvent(event);
          
          // Forcer Google Translate à retraduire
          const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
          if (frame?.contentWindow) {
            frame.contentWindow.postMessage('translate', '*');
          }
        }, 100);
      } else {
        console.warn(`Language ${langCode} not available in Google Translate options`);
        
        // Fallback : utiliser le cookie directement
        setGoogleTranslateCookie(langCode);
        window.location.reload(); // Recharger la page pour appliquer
      }
    } else {
      // Si le select n'est pas trouvé, utiliser le cookie
      console.warn('Google Translate select not found, using cookie method');
      setGoogleTranslateCookie(langCode);
      window.location.reload();
    }
  } catch (error) {
    console.error('Error switching language:', error);
  }
};

/**
 * Définir le cookie Google Translate directement
 */
const setGoogleTranslateCookie = (langCode: string) => {
  const cookieValue = `/auto/${langCode}`;
  document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`; // 1 an
};

export const getCurrentGoogleLanguage = (): string => {
  try {
    // D'abord vérifier le cookie
    const cookies = document.cookie.split('; ');
    const googtrans = cookies.find(row => row.startsWith('googtrans='));

    if (!googtrans) return 'fr'; // Langue par défaut

    const value = decodeURIComponent(googtrans.split('=')[1]);
    const parts = value.split('/').filter(Boolean);
    
    if (parts.length < 2) return 'fr';
    
    const targetLang = parts[parts.length - 1];
    return targetLang || 'fr';
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'fr';
  }
};

/**
 * Hook React pour initialiser Google Translate au chargement
 */
export const useGoogleTranslate = () => {
  useEffect(() => {
    const initialize = async () => {
      await initGoogleTranslate();
      
      // Restaurer la langue sauvegardée
      const savedLang = getCurrentGoogleLanguage();
      if (savedLang && savedLang !== 'fr') {
        setTimeout(() => {
          switchGoogleLanguage(savedLang);
        }, 1000); // Attendre que tout soit chargé
      }
    };

    initialize();

    // Nettoyage (optionnel)
    return () => {
      // Ne pas supprimer le script pour éviter de le recharger
    };
  }, []);
};
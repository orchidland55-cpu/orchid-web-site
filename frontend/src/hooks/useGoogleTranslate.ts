import { useEffect } from 'react';

// Extend window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (options: object, elementId: string) => void;
      };
    };
  }
}

export const initGoogleTranslate = (): Promise<void> => {
  return new Promise((resolve) => {
    // Déjà chargé et prêt
    if (window.google && window.google.translate) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-translate-script');

    if (existingScript) {
      // attendre que google soit prêt
      const interval = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const container = document.createElement('div');
    container.id = 'google_translate_element';
    
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          includedLanguages: 'en,fr,ar,es',
          autoDisplay: false,
        },
        'google_translate_element'
      );
      resolve();
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    document.body.appendChild(script);
  });
};

/**
 * Programmatically switch the page language via the Google Translate cookie.
 * @param langCode  e.g. 'fr', 'ar', 'es', 'en'
 */
export const switchGoogleLanguage = async (langCode: string) => {
  await initGoogleTranslate();

  const interval = setInterval(() => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 200);
};

export const getCurrentGoogleLanguage = (): string => {
  const cookies = document.cookie.split('; ');
  const googtrans = cookies.find(row => row.startsWith('googtrans='));

  if (!googtrans) return 'en';

  const value = decodeURIComponent(googtrans.split('=')[1]);
  // Format attendu : /auto/fr ou /en/fr
  const parts = value.split('/').filter(Boolean); // ['auto', 'fr']
  
  if (parts.length < 2) return 'en';
  
  const targetLang = parts[parts.length - 1]; // toujours le dernier segment
  return targetLang || 'en';
};
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

/**
 * Hook to initialize Google Translate once in the app.
 * Call this in your root component (App.tsx or main layout).
 *
 * Usage:
 *   import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
 *   useGoogleTranslate(); // in App.tsx
 */
export const useGoogleTranslate = () => {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          includedLanguages: 'en,fr,ar,es',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // ✅ Délai de 3s pour ne pas bloquer le LCP
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      script.onload = () => {
        const observer = new MutationObserver(() => {
          const body = document.body;
          if (body.style.top && body.style.top !== '0px') {
            body.style.top = '0px';
          }
        });
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['style'],
        });
      };

      document.body.appendChild(script);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.getElementById('google-translate-script')?.remove();
      document.getElementById('google_translate_element')?.remove();
    };
  }, []);
};

/**
 * Programmatically switch the page language via the Google Translate cookie.
 * @param langCode  e.g. 'fr', 'ar', 'es', 'en'
 */
export const switchGoogleLanguage = (langCode: string) => {
  // Supprime tous les cookies googtrans existants
  document.cookie = `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `googtrans=;domain=${window.location.hostname};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  if (langCode === 'en') {
    // Pour revenir à l'anglais : supprimer le cookie suffit
    // Google Translate affiche la langue originale quand il n'y a pas de cookie
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    window.location.reload();
    return;
  }

  // Pour toute autre langue : cookie avec /auto/ comme source
  const cookieValue = `/auto/${langCode}`;
  document.cookie = `googtrans=${cookieValue};path=/`;
  document.cookie = `googtrans=${cookieValue};domain=${window.location.hostname};path=/`;

  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;

  window.location.reload();
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
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
    // Avoid duplicate injection
    if (document.getElementById('google-translate-script')) return;

    // Hidden container required by Google Translate
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Callback invoked by the Google script once loaded
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          includedLanguages: 'en,fr,ar,es',
          autoDisplay: false,       // Don't show Google's default widget
        },
        'google_translate_element'
      );
    };

    // Inject Google Translate script
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

    return () => {
      // Cleanup on unmount (dev hot-reload safety)
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
  // Google Translate works by setting a cookie named "googtrans"
  // Format: /sourceLanguage/targetLanguage
  // Try both source languages since site is mixed FR/EN
  document.cookie = `googtrans=/fr/${langCode};path=/`;
  document.cookie = `googtrans=/fr/${langCode};domain=${window.location.hostname};path=/`;
  document.cookie = `googtrans=/en/${langCode};path=/`;
  document.cookie = `googtrans=/en/${langCode};domain=${window.location.hostname};path=/`;

  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;

  window.location.reload();
};

/**
 * Read the currently active Google Translate language from the cookie.
 * Falls back to 'en' if no cookie is set.
 */
export const getCurrentGoogleLanguage = (): string => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('googtrans='));

  if (!cookie) return 'en';

  const value = cookie.split('=')[1]; // e.g. "/en/fr"
  const parts = value.split('/');     // ['', 'en', 'fr']
  return parts[2] || 'en';
};
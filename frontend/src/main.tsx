// ── Polices auto-hébergées (remplace Google Fonts) ──
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/700.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// ── App ──────────────────────────────────────────────
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { loadGTM } from '@/utils/gtm';

// ✅ Charger Google Analytics après le rendu initial (2 secondes de délai)
const loadAnalytics = async () => {
  try {
    const ReactGA = (await import('react-ga4')).default;
    ReactGA.initialize('G-PNVYWFNNY5');
  } catch (error) {
    // Ignorer les erreurs de chargement
  }
};

setTimeout(loadGTM, 3000); // Charger après 3 secondes
// Démarrer le chargement après 2 secondes pour ne pas bloquer le rendu
setTimeout(loadAnalytics, 2000);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
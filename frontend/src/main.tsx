import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4' 


ReactGA.initialize('G-PNVYWFNNY5') 

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

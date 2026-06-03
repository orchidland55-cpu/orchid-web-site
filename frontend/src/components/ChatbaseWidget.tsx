// components/ChatbaseWidget.tsx
// Chargement différé : attend que la page soit idle (requestIdleCallback)
// ou 5s max — évite d'impacter le TTI et le thread principal au démarrage.
import { useEffect } from "react";

const SCRIPT_ID  = "LaMaq3yQiQ-SQaPO8_j-H";
const SCRIPT_SRC = "https://www.chatbase.co/embed.min.js";
// Délai de sécurité si requestIdleCallback n'est pas disponible (Safari < 16)
const FALLBACK_DELAY_MS = 5000;

const ChatbaseWidget = () => {
  useEffect(() => {
    // Déjà chargé → ne rien faire
    if (document.getElementById(SCRIPT_ID)) return;

    const load = () => {
      // Déjà injecté entre-temps (double appel possible en StrictMode)
      if (document.getElementById(SCRIPT_ID)) return;

      // Initialisation de la file d'attente Chatbase
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: unknown[]) => {
          if (!window.chatbase.q) window.chatbase.q = [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") return target.q;
            return (...args: unknown[]) => target(prop, ...args);
          },
        });
      }

      const script    = document.createElement("script");
      script.src      = SCRIPT_SRC;
      script.id       = SCRIPT_ID;
      // defer : ne bloque ni le parser ni le rendu
      script.defer    = true;
      document.body.appendChild(script);
    };

    // requestIdleCallback → charge pendant un creux CPU (après LCP, TTI…)
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(load, { timeout: FALLBACK_DELAY_MS });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback : setTimeout 5s pour Safari / vieux navigateurs
      const id = setTimeout(load, FALLBACK_DELAY_MS);
      return () => clearTimeout(id);
    }
  }, []);

  return null;
};

export default ChatbaseWidget;
// components/ChatbaseWidget.tsx
import { useEffect } from "react";

const ChatbaseWidget = () => {
  useEffect(() => {
    // Évite de charger le script deux fois
    if (document.getElementById("LaMaq3yQiQ-SQaPO8_j-H")) return;

    (function () {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: any[]) => {
          if (!window.chatbase.q) window.chatbase.q = [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") return target.q;
            return (...args: any[]) => target(prop, ...args);
          },
        });
      }

      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "LaMaq3yQiQ-SQaPO8_j-H";
      script.defer = true;
      document.body.appendChild(script);
    })();
  }, []);

  return null;
};

export default ChatbaseWidget;
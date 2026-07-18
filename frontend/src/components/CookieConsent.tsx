import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, Check } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem("orchid-island-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2500); // ← augmenté pour laisser le LCP se stabiliser sur le Hero
      return () => clearTimeout(timer);
    }
  }, []);

  const persistAndClose = (data: Record<string, boolean>) => {
    localStorage.setItem(
      "orchid-island-cookie-consent",
      JSON.stringify({ ...data, timestamp: new Date().toISOString() })
    );
    setShowConsent(false);
  };

  const handleAcceptAll = () =>
    persistAndClose({ necessary: true, analytics: true, marketing: true, functional: true });

  const handleRejectAll = () =>
    persistAndClose({ necessary: true, analytics: false, marketing: false, functional: false });

  const handleAcceptSelected = () => persistAndClose(preferences);

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      {/* Bannière fine en bas d'écran — plus de plein écran, plus de backdrop-blur */}
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ type: "tween", duration: 0.25 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary/20 shadow-2xl"
      >
        <div className="max-w-4xl mx-auto p-4 md:p-5">
          {!showDetails ? (
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Cookie className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-foreground">
                  Nous utilisons des cookies pour améliorer votre expérience.{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    En savoir plus
                  </a>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button onClick={() => setShowDetails(true)} variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  Personnaliser
                </Button>
                <Button onClick={handleRejectAll} variant="ghost" size="sm">
                  Rejeter
                </Button>
                <Button onClick={handleAcceptAll} variant="luxury" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Préférences des Cookies</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {["necessary", "functional", "analytics", "marketing"].map((id) => (
                  <label key={id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences[id as keyof typeof preferences]}
                      disabled={id === "necessary"}
                      onChange={() =>
                        setPreferences((p) => ({ ...p, [id]: !p[id as keyof typeof preferences] }))
                      }
                    />
                    {id}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAcceptSelected} variant="luxury" size="sm">
                  Sauvegarder
                </Button>
                <Button onClick={() => setShowDetails(false)} variant="ghost" size="sm">
                  Retour
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
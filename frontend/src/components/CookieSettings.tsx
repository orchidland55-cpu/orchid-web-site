import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieSettings = () => {
  const [showConsent, setShowConsent] = useState(false);

  const openCookieSettings = () => {
    // Supprimer le consentement existant pour rouvrir le popup
    localStorage.removeItem("orchid-island-cookie-consent");
    // Recharger la page pour afficher le popup
    window.location.reload();
  };

  return (
    <Button
      onClick={openCookieSettings}
      variant="ghost"
      size="sm"
      className="text-ivory-white/70 hover:text-ivory-white"
    >
      <Cookie className="w-4 h-4 mr-2" />
      Paramètres des Cookies
    </Button>
  );
};

export default CookieSettings;

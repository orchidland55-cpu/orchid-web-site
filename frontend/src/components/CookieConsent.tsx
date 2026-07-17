import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cookie,
  Shield,
  Settings,
  X,
  Check,
  Info,
  Eye,
  BarChart3
} from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem("orchid-island-cookie-consent");
    if (!consent) {
      // Délai pour laisser la page se charger
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("orchid-island-cookie-consent", JSON.stringify(consentData));
    setShowConsent(false);
    
    // Ici vous pourriez initialiser Google Analytics, Facebook Pixel, etc.
    console.log("Tous les cookies acceptés:", consentData);
  };

  const handleAcceptSelected = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("orchid-island-cookie-consent", JSON.stringify(consentData));
    setShowConsent(false);
    
    console.log("Cookies sélectionnés acceptés:", consentData);
  };

  const handleRejectAll = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("orchid-island-cookie-consent", JSON.stringify(consentData));
    setShowConsent(false);
    
    console.log("Cookies rejetés, seuls les nécessaires conservés:", consentData);
  };

  const togglePreference = (type: keyof typeof preferences) => {
    if (type === "necessary") return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieTypes = [
    {
      id: "necessary",
      name: "Cookies Nécessaires",
      description: "Ces cookies sont essentiels au fonctionnement du site web et ne peuvent pas être désactivés.",
      icon: Shield,
      required: true,
      examples: "Authentification, sécurité, préférences de langue"
    },
    {
      id: "functional",
      name: "Cookies Fonctionnels",
      description: "Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du site.",
      icon: Settings,
      required: false,
      examples: "Préférences utilisateur, chat en direct, formulaires"
    },
    {
      id: "analytics",
      name: "Cookies Analytiques",
      description: "Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site web.",
      icon: BarChart3,
      required: false,
      examples: "Google Analytics, statistiques de visite, comportement utilisateur"
    },
    {
      id: "marketing",
      name: "Cookies Marketing",
      description: "Ces cookies sont utilisés pour vous proposer des publicités pertinentes.",
      icon: Eye,
      required: false,
      examples: "Publicités ciblées, réseaux sociaux, remarketing"
    }
  ];

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl"
        >
          <Card className="shadow-2xl border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              {/* Top Border Decoration */}
              <div className="h-1" style={{ background: 'linear-gradient(to right, #ccac36, #082648)' }}></div>
              {/* Header */}
              <div className="p-6 text-white" style={{ background: 'linear-gradient(to right, #ccac36, #082648)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Cookie className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Gestion des Cookies</h2>
                      <p className="text-white/90">Orchid Island respecte votre vie privée</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    RGPD Conforme
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!showDetails ? (
                  // Vue simplifiée
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg text-foreground mb-4">
                        Nous utilisons des cookies pour améliorer votre expérience sur notre site web, 
                        analyser le trafic et personnaliser le contenu.
                      </p>
                      <p className="text-muted-foreground">
                        En continuant à utiliser notre site, vous acceptez notre utilisation des cookies 
                        conformément à notre politique de confidentialité.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleAcceptAll}
                        variant="luxury" 
                        size="lg"
                        className="flex-1"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Accepter Tous les Cookies
                      </Button>
                      
                      <Button 
                        onClick={() => setShowDetails(true)}
                        variant="outline" 
                        size="lg"
                        className="flex-1"
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Personnaliser
                      </Button>
                      
                      <Button 
                        onClick={handleRejectAll}
                        variant="ghost" 
                        size="lg"
                        className="flex-1"
                      >
                        Rejeter Tout
                      </Button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => setShowDetails(true)}
                        className="text-sm text-primary hover:underline flex items-center mx-auto"
                      >
                        <Info className="w-4 h-4 mr-1" />
                        En savoir plus sur nos cookies
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vue détaillée
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">Préférences des Cookies</h3>
                      <Button
                        onClick={() => setShowDetails(false)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground">
                      Choisissez quels types de cookies vous souhaitez autoriser. 
                      Vous pouvez modifier ces préférences à tout moment.
                    </p>

                    <div className="space-y-4">
                      {cookieTypes.map((type) => (
                        <Card key={type.id} className="border-2 hover:border-primary/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                                  <type.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold text-foreground">{type.name}</h4>
                                    {type.required && (
                                      <Badge variant="secondary" className="text-xs">
                                        Requis
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {type.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    <strong>Exemples:</strong> {type.examples}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-4">
                                <button
                                  onClick={() => togglePreference(type.id as keyof typeof preferences)}
                                  disabled={type.required}
                                  className={`w-12 h-6 rounded-full transition-colors ${
                                    preferences[type.id as keyof typeof preferences]
                                      ? "bg-primary"
                                      : "bg-gray-300"
                                  } ${type.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                  <div
                                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                      preferences[type.id as keyof typeof preferences]
                                        ? "translate-x-6"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button 
                        onClick={handleAcceptSelected}
                        variant="luxury" 
                        size="lg"
                        className="flex-1"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Sauvegarder les Préférences
                      </Button>
                      
                      <Button 
                        onClick={handleAcceptAll}
                        variant="outline" 
                        size="lg"
                        className="flex-1"
                      >
                        Accepter Tout
                      </Button>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    En utilisant ce site, vous acceptez notre{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Politique de Confidentialité
                    </a>{" "}
                    et nos{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Conditions d'Utilisation
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;

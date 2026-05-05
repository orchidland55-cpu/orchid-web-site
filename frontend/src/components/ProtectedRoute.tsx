import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");

      // Pas de token → refus immédiat, pas besoin d'appeler le serveur
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        // Vérification du token côté serveur
        const isValid = await apiService.verifyToken();
        setStatus(isValid ? "valid" : "invalid");
      } catch {
        setStatus("invalid");
      }
    };

    verifyToken();
  }, []);

  // Écran de chargement pendant la vérification
  if (status === "checking") {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-muted-foreground text-sm">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Token invalide ou expiré → redirection vers login
  if (status === "invalid") {
    apiService.logout(); // nettoie le localStorage
    return <Navigate to="/admin" replace />;
  }

  // Token valide → affiche la page demandée
  return <>{children}</>;
};

export default ProtectedRoute;
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Check, AlertCircle, Loader2 } from "lucide-react";

// ─── Composant SetPassword ────────────────────────────────────────────────────

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  // Redirection si pas de token
  useEffect(() => {
    if (!token) {
      setError("Lien invalide. Aucun token trouvé.");
    }
  }, [token]);

  const validateForm = (): boolean => {
    if (!password || password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la définition du mot de passe");
      }

      setSuccess(true);

      // Redirection vers la page de login après 3 secondes
      setTimeout(() => {
        navigate("/admin");
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2340] to-[#1a3a5c] px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#b8972e] mb-3">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-playfair text-white mb-1">
              Définir votre mot de passe
            </h1>
            <p className="text-sm text-slate-300 font-lora">
              Orchid Island — Espace administration
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">

            {/* Success state */}
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-playfair text-slate-900 mb-2">
                  Mot de passe défini !
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Vous allez être redirigé vers la page de connexion...
                </p>
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
              </div>
            ) : (
              <>
                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Au moins 8 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-700">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Saisir à nouveau"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full bg-[#b8972e] hover:bg-[#a0802a] text-white font-lora"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Définir mon mot de passe
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 text-center">
            <p className="text-xs text-slate-500">
              Besoin d'aide ? Contactez un administrateur.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SetPassword;
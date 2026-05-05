import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { showToast } from "@/components/ToastContainer";
import { apiService } from "@/services/api"; // ✅ import apiService

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Vérification via le token JWT (plus via le simple booléen)
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const isValid = await apiService.verifyToken();
        if (isValid) {
          navigate("/admin/dashboard");
        } else {
          // Token expiré ou invalide → on nettoie
          apiService.logout();
        }
      } catch {
        apiService.logout();
      }
    };

    checkExistingSession();
  }, [navigate]);

  // ✅ Login sécurisé via l'API backend (plus de credentials hardcodés)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await apiService.login(email, password);

      // ✅ JWT pour la nouvelle sécurité
      localStorage.setItem("adminToken", data.token);

      // ✅ Backward compat pour les autres pages admin qui vérifient encore adminLoggedIn
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", data.user.email);

      showToast({
        type: "success",
        title: "Login Successful",
        message: "Welcome to Orchid Island Administration!",
        duration: 4000,
      });

      navigate("/admin/dashboard");

    } catch (err: any) {
      setError(err.message || "Incorrect email or password");

      showToast({
        type: "error",
        title: "Login Error",
        message: err.message || "Incorrect email or password",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Administration
            </h1>
            <p className="text-muted-foreground">
              Access reserved for Orchid Island administrators
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-luxury">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Admin Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@orchidisland.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Secure Access — Orchid Island Admin
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
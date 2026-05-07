// pages/SpaceAccess.tsx
// ✅ v2 — design cohérent avec le site (shadcn/ui + Tailwind + palette luxury)
// Page publique — visiteur saisit spaceId + mot de passe

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, AlertCircle, LogIn, Loader2, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import orchidLogo from '@/assets/logopng.png';

export default function SpaceAccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [spaceId,  setSpaceId]  = useState(params.get('id') || '');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blocked,  setBlocked]  = useState(false);

  useEffect(() => {
    // Session expirée — param passé par SpaceView
    if (params.get('expired') === '1') {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
    }
    if (!spaceId) inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await apiService.accessSpace(spaceId.trim().toUpperCase(), password);

      // Stocker le token en sessionStorage — expire à la fermeture de l'onglet
      sessionStorage.setItem(`spaceToken_${res.space.spaceId}`, res.token);
      sessionStorage.setItem(`spaceInfo_${res.space.spaceId}`, JSON.stringify(res.space));

      navigate(`/space/${res.space.spaceId}`);
    } catch (err: any) {
      setError(err.message || 'Identifiant ou mot de passe incorrect');
      const n = attempts + 1;
      setAttempts(n);
      if (n >= 5) {
        setBlocked(true);
        setTimeout(() => { setBlocked(false); setAttempts(0); }, 15 * 60 * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header léger — même style que le site */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <img src={orchidLogo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Contenu centré */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">

          {/* Titre */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 luxury-gradient rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Espace sécurisé</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Saisissez vos identifiants d'accès
              </p>
            </div>
          </div>

          {/* Carte formulaire */}
          <Card className="shadow-luxury">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Space ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Identifiant de l'espace
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    value={spaceId}
                    onChange={e => setSpaceId(e.target.value.toUpperCase())}
                    placeholder="SPACE-XXXXX"
                    disabled={loading || blocked}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading || blocked}
                      className="w-full px-3 py-2.5 pr-10 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Erreur */}
                {error && (
                  <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{blocked ? 'Trop de tentatives. Réessayez dans 15 minutes.' : error}</span>
                  </div>
                )}

                {/* Tentatives restantes */}
                {attempts > 0 && !blocked && (
                  <p className="text-xs text-amber-600 text-center">
                    {5 - attempts} tentative{5 - attempts > 1 ? 's' : ''} restante{5 - attempts > 1 ? 's' : ''}
                  </p>
                )}

                {/* Bouton */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading || blocked || !spaceId || !password}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Vérification…</>
                  ) : blocked ? (
                    'Accès temporairement bloqué'
                  ) : (
                    <><LogIn className="w-4 h-4" /> Accéder à l'espace</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Note sécurité */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5" />
            Session sécurisée · Accès limité à 4 heures
          </div>
        </div>
      </main>
    </div>
  );
}
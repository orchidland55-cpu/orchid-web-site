import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Globe,
  Users,
  BarChart3,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiService } from "@/services/api";

const AdminAnalytics = () => {
  const navigate = useNavigate();

  // États pour les données dynamiques
  const [yearlyViewsData, setYearlyViewsData] = useState<any[]>([]);
  const [monthlyComparisonData, setMonthlyComparisonData] = useState<any[]>([]);
  const [countryViewsData, setCountryViewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = [
    "#D4AF37", // Or (Maroc)
    "#4F46E5", // Bleu (France)
    "#EF4444", // Rouge (Espagne)
    "#10B981", // Vert (Allemagne)
    "#F59E0B", // Orange (Italie)
    "#6B7280", // Gris (Autres)
  ];

  const [activeTab, setActiveTab] = useState("annual");

  // Vérifier authentification
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Charger les données depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [yearlyData, monthlyData, countriesData] = await Promise.all([
          apiService.getYearlyViews(),
          apiService.getMonthlyComparison(),
          apiService.getCountryViews(),
        ]);

        // Transformer et sécuriser les données
        setYearlyViewsData(
          yearlyData.map((item: any) => ({
            ...item,
            vues: Number(item.vues),
            croissance: item.croissance ? Number(item.croissance).toFixed(1) : null,
          }))
        );

        setMonthlyComparisonData(
          monthlyData.map((item: any) => ({
            ...item,
            jour: String(item.jour),
            moisPrecedent: Number(item.moisPrecedent),
            moisActuel: Number(item.moisActuel),
          }))
        );

        setCountryViewsData(
          countriesData.map((item: any) => ({
            ...item,
            vues: Number(item.vues),
            pourcentage: Number(item.pourcentage),
          }))
        );

        setLoading(false);
      } catch (err: any) {
        console.error("Erreur de chargement :", err);
        setError("Impossible de charger les données. Vérifiez votre connexion ou réessayez plus tard.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-700 font-medium">Chargement des statistiques...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-white border border-red-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.168-.833-2.938 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-700 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // Calculs sécurisés (basés sur les données chargées)
  const totalViews = countryViewsData.reduce((sum, country) => sum + (country.vues || 0), 0);
  const currentMonthTotal = monthlyComparisonData.reduce((sum, day) => sum + (day.moisActuel || 0), 0);
  const previousMonthTotal = monthlyComparisonData.reduce((sum, day) => sum + (day.moisPrecedent || 0), 0);

  // Protection contre division par zéro
  const growthPercentage = previousMonthTotal === 0
    ? currentMonthTotal > 0 ? "∞" : "0"
    : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1);

  return (
    <PageTransition>
      <div className="min-h-screen bg-yellow-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm" className="text-gray-700 hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Statistiques des Vues</h1>
                  <p className="text-sm text-yellow-700">Analyse détaillée du trafic du site</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-700">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Vues totales</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mois Actuel</p>
                    <p className="text-2xl font-bold text-gray-800">{currentMonthTotal.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mois Précédent</p>
                    <p className="text-2xl font-bold text-gray-800">{previousMonthTotal.toLocaleString()}</p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Croissance</p>
                    <p className={`text-2xl font-bold ${parseFloat(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(growthPercentage) >= 0 ? '+' : ''}{growthPercentage}%
                    </p>
                  </div>
                  <BarChart3 className={`w-6 h-6 ${parseFloat(growthPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6 border border-gray-200">
            <button
              onClick={() => setActiveTab("annual")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "annual"
                  ? "bg-yellow-100 text-yellow-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Évolution Annuelle
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "monthly"
                  ? "bg-yellow-100 text-yellow-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Comparaison Mensuelle
            </button>
            <button
              onClick={() => setActiveTab("geographic")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "geographic"
                  ? "bg-yellow-100 text-yellow-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Répartition Géographique
            </button>
          </div>

          {/* Contenu selon l'onglet */}
          {activeTab === "annual" && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span>Évolution des Vues par Années</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {yearlyViewsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={yearlyViewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fill: "#6b7280" }} />
                      <YAxis tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        content={({ payload, label }) => {
                          if (!payload || !payload[0]) return null;
                          const value = payload[0].value as number;
                          if (isNaN(value)) return null;

                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 max-w-xs">
                              <p className="font-semibold text-gray-800">Année {label}</p>
                              <p className="text-sm text-gray-600">Vues: {value.toLocaleString()}</p>
                              {payload[0].payload.croissance && (
                                <p className="text-sm text-green-600">
                                  ↗ Croissance: +{payload[0].payload.croissance}%
                                </p>
                              )}
                            </div>
                          );
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vues"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{ fill: "#D4AF37", r: 5 }}
                        name="Vues Annuelles"
                        fill="#D4AF37"
                        fillOpacity={0.2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">Aucune donnée disponible.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "monthly" && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span>Comparaison Mensuelle</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Mois précédent vs Mois actuel (par jour)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyComparisonData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="jour" tick={{ fill: "#6b7280" }} />
                      <YAxis tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        content={({ payload, label }) => {
                          if (!payload || payload.length < 2) return null;
                          const prev = payload[0]?.value as number;
                          const curr = payload[1]?.value as number;
                          if (isNaN(prev) || isNaN(curr)) return null;

                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 max-w-xs">
                              <p className="font-semibold text-gray-800">Jour {label}</p>
                              <p className="text-sm text-gray-600">● Mois Précédent: {prev.toLocaleString()}</p>
                              <p className="text-sm text-yellow-700">● Mois Actuel: {curr.toLocaleString()}</p>
                              <p className="text-sm text-green-600">↗ Différence: {curr - prev}</p>
                            </div>
                          );
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="moisPrecedent"
                        stroke="#6B7280"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#6B7280", r: 4 }}
                        name="Mois Précédent"
                      />
                      <Line
                        type="monotone"
                        dataKey="moisActuel"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{ fill: "#D4AF37", r: 5 }}
                        name="Mois Actuel"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">Aucune donnée disponible.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "geographic" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Globe className="w-5 h-5 text-yellow-600" />
                    <span>Répartition par Pays</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {countryViewsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={countryViewsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="vues"
                          labelLine={false}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {countryViewsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ payload }) => {
                            if (!payload || !payload[0]) return null;
                            const data = payload[0].payload;
                            const value = payload[0].value as number;
                            if (isNaN(value)) return null;

                            return (
                              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 max-w-xs">
                                <p className="font-semibold text-gray-800">Pays: {data.pays}</p>
                                <p className="text-sm text-gray-600">
                                  {value.toLocaleString()} vues ({data.pourcentage}%)
                                </p>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-center py-10">Aucune donnée disponible.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Users className="w-5 h-5 text-yellow-600" />
                    <span>Détails par Pays</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {countryViewsData.length > 0 ? (
                    <div className="space-y-4">
                      {countryViewsData.map((country, index) => (
                        <div
                          key={country.pays}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="font-medium">{country.pays}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{country.vues.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{country.pourcentage}% du total</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune donnée disponible.</p>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Analyse Géographique:</strong> Le Maroc représente 42.5% du trafic total, confirmant votre forte présence locale. L'Europe (France, Espagne, Allemagne, Italie) contribue à 47.0% du trafic.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminAnalytics;
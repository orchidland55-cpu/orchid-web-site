import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart,
  Bar
} from "recharts";
import {
  ArrowLeft,
  Eye,
  TrendingUp,
  Globe,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminAnalytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Données pour le graphique des vues par années
  const yearlyViewsData = [
    { year: "2020", vues: 8500 },
    { year: "2021", vues: 12300 },
    { year: "2022", vues: 18700 },
    { year: "2023", vues: 25400 },
    { year: "2024", vues: 32100 }
  ];

  // Données pour la comparaison mois précédent vs mois actuel
  const monthlyComparisonData = [
    { jour: "1", moisPrecedent: 420, moisActuel: 380 },
    { jour: "2", moisPrecedent: 380, moisActuel: 450 },
    { jour: "3", moisPrecedent: 450, moisActuel: 520 },
    { jour: "4", moisPrecedent: 320, moisActuel: 480 },
    { jour: "5", moisPrecedent: 520, moisActuel: 590 },
    { jour: "6", moisPrecedent: 480, moisActuel: 620 },
    { jour: "7", moisPrecedent: 600, moisActuel: 680 },
    { jour: "8", moisPrecedent: 550, moisActuel: 720 },
    { jour: "9", moisPrecedent: 480, moisActuel: 650 },
    { jour: "10", moisPrecedent: 420, moisActuel: 580 },
    { jour: "11", moisPrecedent: 380, moisActuel: 520 },
    { jour: "12", moisPrecedent: 520, moisActuel: 680 },
    { jour: "13", moisPrecedent: 480, moisActuel: 720 },
    { jour: "14", moisPrecedent: 620, moisActuel: 780 },
    { jour: "15", moisPrecedent: 580, moisActuel: 820 },
    { jour: "16", moisPrecedent: 520, moisActuel: 750 },
    { jour: "17", moisPrecedent: 480, moisActuel: 680 },
    { jour: "18", moisPrecedent: 420, moisActuel: 620 },
    { jour: "19", moisPrecedent: 380, moisActuel: 580 },
    { jour: "20", moisPrecedent: 450, moisActuel: 650 },
    { jour: "21", moisPrecedent: 520, moisActuel: 720 },
    { jour: "22", moisPrecedent: 580, moisActuel: 780 },
    { jour: "23", moisPrecedent: 620, moisActuel: 820 },
    { jour: "24", moisPrecedent: 480, moisActuel: 680 },
    { jour: "25", moisPrecedent: 520, moisActuel: 750 },
    { jour: "26", moisPrecedent: 580, moisActuel: 820 },
    { jour: "27", moisPrecedent: 620, moisActuel: 880 },
    { jour: "28", moisPrecedent: 680, moisActuel: 920 },
    { jour: "29", moisPrecedent: 720, moisActuel: 980 },
    { jour: "30", moisPrecedent: 650, moisActuel: 850 }
  ];

  // Données pour les vues par pays
  const countryViewsData = [
    { pays: "Maroc", vues: 8500, pourcentage: 42.5 },
    { pays: "France", vues: 3200, pourcentage: 16.0 },
    { pays: "Espagne", vues: 2800, pourcentage: 14.0 },
    { pays: "Allemagne", vues: 1900, pourcentage: 9.5 },
    { pays: "Italie", vues: 1500, pourcentage: 7.5 },
    { pays: "Autres", vues: 2100, pourcentage: 10.5 }
  ];

  // Couleurs pour le graphique circulaire
  const COLORS = [
    "#D4AF37", // Or (Maroc)
    "#4F46E5", // Bleu (France)
    "#EF4444", // Rouge (Espagne)
    "#10B981", // Vert (Allemagne)
    "#F59E0B", // Orange (Italie)
    "#6B7280"  // Gris (Autres)
  ];

  // Statistiques générales
  const totalViews = countryViewsData.reduce((sum, country) => sum + country.vues, 0);
  const currentMonthTotal = monthlyComparisonData.reduce((sum, day) => sum + day.moisActuel, 0);
  const previousMonthTotal = monthlyComparisonData.reduce((sum, day) => sum + day.moisPrecedent, 0);
  const growthPercentage = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Statistiques des Vues</h1>
                  <p className="text-sm text-muted-foreground">Analyse détaillée du trafic du site</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mois Actuel</p>
                    <p className="text-2xl font-bold text-foreground">{currentMonthTotal.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mois Précédent</p>
                    <p className="text-2xl font-bold text-foreground">{previousMonthTotal.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Croissance</p>
                    <p className={`text-2xl font-bold ${parseFloat(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(growthPercentage) >= 0 ? '+' : ''}{growthPercentage}%
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${parseFloat(growthPercentage) >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                    <BarChart3 className={`w-6 h-6 ${parseFloat(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique des vues par années */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Évolution des Vues par Années</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), "Vues"]}
                    labelFormatter={(label) => `Année ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vues" 
                    stroke="#D4AF37" 
                    strokeWidth={3}
                    dot={{ fill: "#D4AF37", strokeWidth: 2, r: 6 }}
                    name="Vues Annuelles"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Comparaison mensuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Comparaison Mensuelle</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mois précédent vs Mois actuel (par jour)
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        value.toLocaleString(), 
                        name === "moisPrecedent" ? "Mois Précédent" : "Mois Actuel"
                      ]}
                      labelFormatter={(label) => `Jour ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="moisPrecedent" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#6B7280", strokeWidth: 2, r: 4 }}
                      name="Mois Précédent"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="moisActuel" 
                      stroke="#D4AF37" 
                      strokeWidth={3}
                      dot={{ fill: "#D4AF37", strokeWidth: 2, r: 5 }}
                      name="Mois Actuel"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vues par pays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Vues par Pays</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Répartition géographique du trafic
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={countryViewsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="vues"
                    >
                      {countryViewsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value.toLocaleString()} vues (${props.payload.pourcentage}%)`,
                        "Vues"
                      ]}
                      labelFormatter={(label) => `Pays: ${label}`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>
                          {value} ({entry.payload.pourcentage}%)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Liste détaillée des pays */}
                <div className="mt-6 space-y-3">
                  {countryViewsData.map((country, index) => (
                    <div key={country.pays} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="font-medium">{country.pays}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{country.vues.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{country.pourcentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminAnalytics;

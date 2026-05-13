// pages/AdminDashboard.tsx - VERSION AMÉLIORÉE AVEC GESTION DES RÔLES
//
// ⚠️ INSTRUCTIONS D'INTÉGRATION :
// 1. Remplacez votre fichier AdminDashboard.tsx actuel par celui-ci
// 2. Copiez le hook useUserRole.tsx dans /src/hooks/
// 3. Copiez le composant ProtectedRoute.tsx amélioré dans /src/components/
//
// Ce dashboard adapte l'affichage selon le rôle (admin ou editor)

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import orchidLogo from "@/assets/logopng.png";
import {
  BarChart3,
  Shield,
  Building,
  FileText,
  TrendingUp,
  Eye,
  MessageCircle,
  Plus,
  Settings,
  LogOut,
  Home,
  Calendar,
  Globe,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { showToast } from "@/components/ToastContainer";
import { apiService, Activity } from "@/services/api";
import UserManagementModal from "@/components/UserManagementModal";
import { useUserRole } from "@/hooks/useUserRole";  // ✅ Nouveau hook

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isEditor, role, email } = useUserRole();  // ✅ Utilisation du hook
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Analytics state
  const [yearlyViewsData, setYearlyViewsData] = useState<any[]>([]);
  const [countryViewsData, setCountryViewsData] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return "Just now";
  };

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivities();
    loadAnalyticsData();
  }, []);

  const loadDashboardStats = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getDashboardStats();
      setDashboardStats(result.data);
    } catch (error) {
      console.error('❌ Connection error:', error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Unable to load statistics from server"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const loadRecentActivities = async () => {
    setIsActivitiesLoading(true);
    setCurrentPage(1);
    try {
      const result = await apiService.getRecentActivities();
      const formattedActivities = (result.data || []).map((activity: Activity) => ({
        ...activity,
        time: activity.createdAt ? formatTimeAgo(activity.createdAt) : "Recently"
      }));
      setRecentActivities(formattedActivities);
    } catch (error) {
      console.error('❌ Error loading activities:', error);
      setRecentActivities([
        {
          action: "Loading error",
          item: "Unable to retrieve activities",
          createdAt: new Date().toISOString(),
          type: "error"
        } as Activity
      ]);
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const [yearlyData, countriesData] = await Promise.all([
        apiService.getYearlyViews(),
        apiService.getCountryViews()
      ]);
      setYearlyViewsData(yearlyData);
      setCountryViewsData(countriesData);
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      apiService.logout();
      showToast({
        type: "success",
        title: "Logout Successful",
        message: "You have been successfully logged out. See you soon!",
        duration: 3000
      });
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatsFromBackend = () => {
    if (!dashboardStats) {
      return [
        {
          title: "Total Properties",
          value: "...",
          change: "Loading...",
          icon: Building,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Blog Articles",
          value: "...",
          change: "Loading...",
          icon: FileText,
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Total Views",
          value: "...",
          change: "Loading...",
          icon: Eye,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        },
        {
          title: "Contact Requests",
          value: "...",
          change: "Loading...",
          icon: MessageCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50"
        }
      ];
    }

    return [
      {
        title: "Total Properties",
        value: dashboardStats.properties?.total?.toString() || "0",
        change: dashboardStats.properties?.growthText || "+0 this month",
        icon: Building,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Blog Articles",
        value: dashboardStats.articles?.total?.toString() || "0",
        change: dashboardStats.articles?.growthText || "+0 this week",
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Total Views",
        value: formatNumber(dashboardStats.views?.total || 0),
        change: dashboardStats.views?.growthText || "+0% this month",
        icon: Eye,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        title: "Contact Requests",
        value: dashboardStats.contacts?.total?.toString() || "0",
        change: dashboardStats.contacts?.growthText || "+0 today",
        icon: MessageCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      }
    ];
  };

  const stats = getStatsFromBackend();

  // ✅ NOUVEAU : Actions rapides adaptées selon le rôle
  const quickActions = [
    {
      title: "Add Property",
      description: "Create a new property",
      icon: Building,
      link: "/admin/properties/add",
      color: "luxury",
      allowedRoles: ['admin', 'editor']  // ✅ Accessible aux deux
    },
    {
      title: "New Article",
      description: "Write a blog article",
      icon: FileText,
      link: "/admin/articles/add",
      color: "elegant",
      allowedRoles: ['admin', 'editor']  // ✅ Accessible aux deux
    },
    {
      title: "View Properties",
      description: "Manage existing properties",
      icon: Eye,
      link: "/admin/properties",
      color: "outline",
      allowedRoles: ['admin', 'editor']  // ✅ Accessible aux deux
    },
    {
      title: "Manage Articles",
      description: "Edit blog articles",
      icon: Settings,
      link: "/admin/articles",
      color: "outline",
      allowedRoles: ['admin', 'editor']  // ✅ Accessible aux deux
    }
  ].filter(action => action.allowedRoles.includes(role || ''));  // ✅ Filtrage selon le rôle

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={orchidLogo}
                alt="Orchid Island Logo"
                className="h-12 w-auto"
              />
              {/* ✅ Badge de rôle */}
              <Badge variant={isAdmin ? "default" : "secondary"} className="ml-2">
                {isAdmin ? "👑 Administrateur" : "✏️ Éditeur"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* ✅ Bouton Manage Customer Space - uniquement pour admin */}
              {isAdmin && (
                <Link to="/space-manager">
                  <Button variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Data Room
                  </Button>
                </Link>
              )}
              
              {/* ✅ Bouton Manage Users - uniquement pour admin */}
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => setUserModalOpen(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              )}
              
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* ✅ Message d'information pour les éditeurs */}
        {isEditor && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Mode Éditeur</h3>
              <p className="text-sm text-blue-700">
                Vous pouvez créer et modifier des propriétés et des articles. 
                Seuls les administrateurs peuvent supprimer du contenu et gérer les utilisateurs.
              </p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const getCardConfig = (title: string) => {
              switch (title) {
                case "Total Views":
                  return {
                    isClickable: true,
                    linkTo: "/admin/analytics",
                    clickText: "Click for details →",
                    ariaLabel: "View detailed view statistics"
                  };
                case "Total Properties":
                  return {
                    isClickable: true,
                    linkTo: "/admin/properties",
                    clickText: "Manage properties →",
                    ariaLabel: "Manage real estate properties"
                  };
                case "Blog Articles":
                  return {
                    isClickable: true,
                    linkTo: "/admin/articles",
                    clickText: "Manage articles →",
                    ariaLabel: "Manage blog articles"
                  };
                case "Contact Requests":
                  return {
                    isClickable: isAdmin,  // ✅ Uniquement cliquable pour admin
                    linkTo: "/admin/contacts",
                    clickText: isAdmin ? "View requests →" : "",
                    ariaLabel: "View contact requests"
                  };
                default:
                  return {
                    isClickable: false,
                    linkTo: "",
                    clickText: "",
                    ariaLabel: ""
                  };
              }
            };

            const config = getCardConfig(stat.title);

            if (config.isClickable) {
              return (
                <Link
                  key={index}
                  to={config.linkTo}
                  aria-label={config.ariaLabel}
                  className="block"
                >
                  <Card className="hover:shadow-luxury transition-all duration-300 cursor-pointer hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      {config.clickText && (
                        <div className="mt-2 text-xs text-primary font-medium">
                          {config.clickText}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            return (
              <Card key={index} className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 luxury-gradient rounded-lg flex items-center justify-center">
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Modal de gestion des utilisateurs - uniquement pour admin */}
          {isAdmin && (
            <UserManagementModal open={userModalOpen} onOpenChange={setUserModalOpen} />
          )}

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isActivitiesLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Loading activities...
                  </p>
                ) : recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activities.
                  </p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {recentActivities
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-2 rounded-md bg-muted/50">
                            <div className="w-2 h-2 rounded-full mt-2 bg-yellow-500"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.item}</p>
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-primary">{activity.performedBy || "admin"}</span> • {formatTimeAgo(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {recentActivities.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Page {currentPage} / {Math.ceil(recentActivities.length / itemsPerPage)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            ← Prev
                          </button>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(recentActivities.length / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(recentActivities.length / itemsPerPage)}
                            className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Section - Visible pour tous */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
            <Link to="/admin/analytics">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Yearly Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Yearly Views Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                  </div>
                ) : yearlyViewsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={yearlyViewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fill: "#6b7280" }} />
                      <YAxis tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        content={({ payload, label }) => {
                          if (!payload || !payload[0]) return null;
                          const value = payload[0].value as number;
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3">
                              <p className="font-semibold text-gray-800">Year {label}</p>
                              <p className="text-sm text-gray-600">Views: {value?.toLocaleString()}</p>
                            </div>
                          );
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vues"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{ fill: "#D4AF37", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Country Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Views by Country</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                  </div>
                ) : countryViewsData.length > 0 ? (
                  <div className="space-y-4">
                    {countryViewsData.slice(0, 5).map((country, index) => (
                      <div key={country.pays} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: ["#D4AF37", "#4F46E5", "#EF4444", "#10B981", "#F59E0B"][index] }}
                          ></div>
                          <span className="font-medium">{country.pays}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{country.vues?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{country.pourcentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-10">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
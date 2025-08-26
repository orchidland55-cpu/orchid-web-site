import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import orchidLogo from "@/assets/logopng.png";
import {
  BarChart3,
  Users,
  Building,
  FileText,
  TrendingUp,
  Eye,
  MessageCircle,
  Plus,
  Settings,
  LogOut,
  Home,
  Calendar
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { showToast } from "@/components/ToastContainer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const email = localStorage.getItem("adminEmail");
    
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }
    
    setAdminEmail(email || "");
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminEmail");

      // Afficher un toast de déconnexion
      showToast({
        type: "success",
        title: "Déconnexion réussie",
        message: "Vous avez été déconnecté avec succès. À bientôt !",
        duration: 3000
      });

      // Délai pour permettre au toast de s'afficher avant la redirection
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    }
  };

  const stats = [
    {
      title: "Propriétés Totales",
      value: "24",
      change: "+3 ce mois",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Articles de Blog",
      value: "18",
      change: "+2 cette semaine",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Vues Totales",
      value: "12.5K",
      change: "+15% ce mois",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Demandes Contact",
      value: "47",
      change: "+8 aujourd'hui",
      icon: MessageCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivities = [
    {
      action: "Nouvelle propriété ajoutée",
      item: "Villa Luxury Marina",
      time: "Il y a 2 heures",
      type: "property"
    },
    {
      action: "Article publié",
      item: "Tendances Immobilier 2024",
      time: "Il y a 5 heures",
      type: "blog"
    },
    {
      action: "Demande de contact",
      item: "Client intéressé par penthouse",
      time: "Il y a 1 jour",
      type: "contact"
    },
    {
      action: "Propriété mise à jour",
      item: "Appartement Souissi",
      time: "Il y a 2 jours",
      type: "property"
    }
  ];

  const quickActions = [
    {
      title: "Ajouter Propriété",
      description: "Créer une nouvelle propriété",
      icon: Building,
      link: "/admin/properties/add",
      color: "luxury"
    },
    {
      title: "Nouvel Article",
      description: "Rédiger un article de blog",
      icon: FileText,
      link: "/admin/articles/add",
      color: "elegant"
    },
    {
      title: "Voir Propriétés",
      description: "Gérer les propriétés existantes",
      icon: Eye,
      link: "/admin/properties",
      color: "outline"
    },
    {
      title: "Gérer Articles",
      description: "Modifier les articles de blog",
      icon: Settings,
      link: "/admin/articles",
      color: "outline"
    }
  ];

  return (
    <PageTransition>
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
          </div>
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Voir le site
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              // Déterminer quelle carte est cliquable et sa destination
              const getCardConfig = (title: string) => {
                switch (title) {
                  case "Vues Totales":
                    return {
                      isClickable: true,
                      linkTo: "/admin/analytics",
                      clickText: "Cliquez pour voir les détails →",
                      ariaLabel: "Voir les statistiques détaillées des vues"
                    };
                  case "Propriétés Totales":
                    return {
                      isClickable: true,
                      linkTo: "/admin/properties",
                      clickText: "Gérer les propriétés →",
                      ariaLabel: "Gérer les propriétés immobilières"
                    };
                  case "Articles de Blog":
                    return {
                      isClickable: true,
                      linkTo: "/admin/articles",
                      clickText: "Gérer les articles →",
                      ariaLabel: "Gérer les articles de blog"
                    };
                  case "Demandes Contact":
                    return {
                      isClickable: true,
                      linkTo: "/admin/contacts",
                      clickText: "Voir les demandes →",
                      ariaLabel: "Voir les demandes de contact"
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
                        <div className="mt-2 text-xs text-primary font-medium">
                          {config.clickText}
                        </div>
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
                    <span>Actions Rapides</span>
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

            {/* Recent Activities */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Activités Récentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.item}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { showToast } from "@/components/ToastContainer";

const AdminContacts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Données d'exemple des demandes de contact
  const [contacts] = useState([
    {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@email.com",
      phone: "+212 6XX-XXX-XXX",
      subject: "Intérêt pour Villa Marina",
      message: "Bonjour, je suis très intéressé par la Villa Luxury Marina. Pourriez-vous me donner plus d'informations sur les modalités de visite et le prix final ?",
      propertyType: "Villa",
      date: "2024-03-18",
      time: "14:30",
      status: "new",
      priority: "high"
    },
    {
      id: 2,
      name: "Fatima Alaoui",
      email: "f.alaoui@gmail.com",
      phone: "+212 5XX-XXX-XXX",
      subject: "Demande d'information Penthouse",
      message: "Je recherche un penthouse à Rabat pour investissement. Le Penthouse Souissi m'intéresse particulièrement.",
      propertyType: "Penthouse",
      date: "2024-03-18",
      time: "11:15",
      status: "replied",
      priority: "medium"
    },
    {
      id: 3,
      name: "Jean Dubois",
      email: "jean.dubois@france.fr",
      phone: "+33 6XX-XXX-XXX",
      subject: "Investissement immobilier Maroc",
      message: "Français résidant à Paris, je souhaite investir dans l'immobilier de luxe au Maroc. Quelles sont vos meilleures opportunités actuelles ?",
      propertyType: "Investment",
      date: "2024-03-17",
      time: "16:45",
      status: "new",
      priority: "high"
    },
    {
      id: 4,
      name: "Youssef Tazi",
      email: "y.tazi@outlook.com",
      phone: "+212 6XX-XXX-XXX",
      subject: "Appartement Hivernage",
      message: "Bonjour, je voudrais visiter l'appartement à Hivernage. Quand est-ce que je peux programmer une visite ?",
      propertyType: "Appartement",
      date: "2024-03-17",
      time: "09:20",
      status: "scheduled",
      priority: "medium"
    },
    {
      id: 5,
      name: "Maria Garcia",
      email: "maria.garcia@spain.es",
      phone: "+34 6XX-XXX-XXX",
      subject: "Propriété vue sur mer",
      message: "Hola, estoy buscando una propiedad con vista al mar en Casablanca. ¿Tienen opciones disponibles?",
      propertyType: "Villa",
      date: "2024-03-16",
      time: "13:10",
      status: "replied",
      priority: "low"
    },
    {
      id: 6,
      name: "Omar Benjelloun",
      email: "o.benjelloun@email.ma",
      phone: "+212 5XX-XXX-XXX",
      subject: "Consultation investissement",
      message: "Je souhaite une consultation pour un projet d'investissement immobilier. Pouvons-nous planifier un rendez-vous ?",
      propertyType: "Commercial",
      date: "2024-03-16",
      time: "10:30",
      status: "scheduled",
      priority: "high"
    }
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case "replied":
        return <Badge variant="default" className="bg-green-100 text-green-800">Répondu</Badge>;
      case "scheduled":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Planifié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (contactId: number, newStatus: string) => {
    showToast({
      type: "success",
      title: "Statut mis à jour",
      message: `Le statut de la demande a été changé vers "${newStatus}"`,
      duration: 3000
    });
  };

  const handleDelete = (contactId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande de contact ?")) {
      showToast({
        type: "success",
        title: "Demande supprimée",
        message: "La demande de contact a été supprimée avec succès",
        duration: 3000
      });
    }
  };

  const getContactStats = () => {
    const total = contacts.length;
    const newCount = contacts.filter(c => c.status === "new").length;
    const repliedCount = contacts.filter(c => c.status === "replied").length;
    const scheduledCount = contacts.filter(c => c.status === "scheduled").length;
    
    return { total, newCount, repliedCount, scheduledCount };
  };

  const stats = getContactStats();

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
                  <h1 className="text-2xl font-bold text-foreground">Demandes de Contact</h1>
                  <p className="text-sm text-muted-foreground">Gérer les demandes des clients</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total demandes</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nouvelles</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Répondues</p>
                    <p className="text-2xl font-bold text-green-600">{stats.repliedCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Planifiées</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.scheduledCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, email ou sujet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="new">Nouveau</option>
                    <option value="replied">Répondu</option>
                    <option value="scheduled">Planifié</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(contact.priority)}
                          <h3 className="text-lg font-bold text-foreground">{contact.name}</h3>
                        </div>
                        {getStatusBadge(contact.status)}
                        <Badge variant="outline" className="text-xs">
                          {contact.propertyType}
                        </Badge>
                      </div>
                      
                      <h4 className="text-md font-semibold text-foreground mb-2">{contact.subject}</h4>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {contact.message}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(contact.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{contact.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        className="px-3 py-1 text-xs border border-input rounded-md bg-background"
                      >
                        <option value="new">Nouveau</option>
                        <option value="replied">Répondu</option>
                        <option value="scheduled">Planifié</option>
                      </select>
                      
                      <div className="flex space-x-1">
                        
                       <Button
    variant="outline"
    size="sm"
    onClick={() => handleDelete(contact.id)}
    className="ml-auto text-destructive hover:text-destructive flex"
  >
    <Trash2 className="w-4 h-4" />
  </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucune demande trouvée</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== "all" 
                    ? "Aucune demande ne correspond à vos critères de recherche."
                    : "Aucune demande de contact pour le moment."}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminContacts;

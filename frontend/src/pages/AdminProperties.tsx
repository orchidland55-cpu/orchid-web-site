import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  ArrowLeft,
  Filter,
  Bed,
  Bath,
  Square
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminProperties = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Sample properties data
  const [properties] = useState([
    {
      id: 1,
      title: "Villa Luxury Marina",
      type: "Villa",
      price: "2,500,000",
      location: "Marina, Casablanca",
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      status: "available",
      image: "/api/placeholder/300/200",
      featured: true
    },
    {
      id: 2,
      title: "Penthouse Souissi",
      type: "Penthouse",
      price: "1,800,000",
      location: "Souissi, Rabat",
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      status: "sold",
      image: "/api/placeholder/300/200",
      featured: false
    },
    {
      id: 3,
      title: "Appartement Hivernage",
      type: "Appartement",
      price: "950,000",
      location: "Hivernage, Marrakech",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      status: "available",
      image: "/api/placeholder/300/200",
      featured: true
    },
    {
      id: 4,
      title: "Villa Palmeraie",
      type: "Villa",
      price: "3,200,000",
      location: "Palmeraie, Marrakech",
      bedrooms: 6,
      bathrooms: 5,
      area: 600,
      status: "pending",
      image: "/api/placeholder/300/200",
      featured: false
    }
  ]);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-100 text-green-800">Disponible</Badge>;
      case "sold":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Vendu</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")) {
      console.log("Delete property:", id);
      // Handle delete logic here
    }
  };

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
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gestion des Propriétés</h1>
                  <p className="text-sm text-muted-foreground">Gérer le portfolio immobilier</p>
                </div>
              </div>
              <Link to="/admin/properties/add">
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Propriété
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des propriétés..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="all">Tous les types</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="appartement">Appartement</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-luxury transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {property.featured && (
                    <Badge className="absolute top-2 left-2 luxury-gradient text-white">
                      Vedette
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">{property.title}</h3>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-primary mb-3">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-lg font-bold">{property.price} MAD</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="w-4 h-4" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/admin/properties/edit/${property.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucune propriété trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== "all" 
                    ? "Aucune propriété ne correspond à vos critères de recherche."
                    : "Commencez par ajouter votre première propriété."}
                </p>
                <Link to="/admin/properties/add">
                  <Button variant="luxury">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une propriété
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminProperties;

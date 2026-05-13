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
  MapPin,
  ArrowLeft,
  Filter,
  Bed,
  Bath,
  Square,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiService, Property } from "@/services/api";

const AdminProperties = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Error loading properties");
    } finally {
      setLoading(false);
    }
  };

  // Extraire les types uniques de propriétés
  const propertyTypes = Array.from(
    new Set(properties.map(property => property.type).filter(Boolean))
  ).sort();

  const formatPrice = (price: number, currency: "MAD" | "USD" | "EUR" = "MAD") => {
  const localeMap = { MAD: "fr-MA", USD: "en-US", EUR: "fr-FR" };
  const symbolMap = { MAD: "MAD", USD: "$", EUR: "€" };
  const formatted = new Intl.NumberFormat(localeMap[currency], {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price);
  return currency === "MAD"
    ? `${formatted} MAD`
    : `${symbolMap[currency]}${formatted}`;
};

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
      case "sold":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Sold</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        setDeletingId(id);
        await apiService.deleteProperty(id);
        // Refresh the properties list
        await fetchProperties();
        alert("Property deleted successfully!");
      } catch (error) {
        console.error("Error deleting property:", error);
        alert(`Error deleting: ${error.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const siblingCount = 1; // Nombre de pages à afficher de chaque côté de la page actuelle
    const pageNumbers: (number | string)[] = [];

    // Toujours afficher la première page
    pageNumbers.push(1);

    // Calculer la plage de pages à afficher autour de la page actuelle
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

    // Afficher les pointillés à gauche si nécessaire
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // Si on est proche du début (pages 1-4)
    if (!showLeftDots && showRightDots) {
      const leftRange = 3 + 2 * siblingCount;
      for (let i = 2; i <= Math.min(leftRange, totalPages - 1); i++) {
        pageNumbers.push(i);
      }
      if (totalPages > leftRange + 1) {
        pageNumbers.push('...');
      }
    }
    // Si on est proche de la fin
    else if (showLeftDots && !showRightDots) {
      pageNumbers.push('...');
      const rightRange = 3 + 2 * siblingCount;
      for (let i = Math.max(totalPages - rightRange, 2); i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }
    // Si on est au milieu
    else if (showLeftDots && showRightDots) {
      pageNumbers.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
    }
    // Si le nombre total de pages est petit (moins de 7 pages)
    else {
      for (let i = 2; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }

    // Toujours afficher la dernière page (si elle existe et n'est pas la première)
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        {/* Navigation avec boutons */}
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-w-[80px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === '...') {
                return (
                  <span key={`dots-${index}`} className="px-3 text-muted-foreground">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "luxury" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber as number)}
                  className={`min-w-[40px] ${currentPage === pageNumber ? "text-white" : ""}`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="min-w-[80px]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Info sur la page actuelle */}
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Building className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Loading properties...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-background">
          <header className="bg-white border-b border-border shadow-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/admin/dashboard">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Property Management</h1>
                    <p className="text-sm text-muted-foreground">Manage real estate portfolio</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-8">
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Loading Error</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchProperties} variant="luxury">
                  Retry
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      
    );
  }

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
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Property Management</h1>
                  <p className="text-sm text-muted-foreground">Manage real estate portfolio</p>
                </div>
              </div>
              <Link to="/admin/properties/add">
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" />
                  New Property
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
                      placeholder="Search properties..."
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
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              {filteredProperties.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProperties.length)} of {filteredProperties.length} properties
                </div>
              )}
            </CardContent>
          </Card>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
              <Card key={property._id} className="hover:shadow-luxury transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={property.mainImage || property.additionalImages?.[0] || "/api/placeholder/300/200"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {property.featured && (
                    <Badge className="absolute top-2 left-2 luxury-gradient text-white">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">{property.title}</h3>

                  {/* Display person field */}
                  <div className="flex items-center space-x-1 text-muted-foreground mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{property.person || "—"}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-primary mb-3">
                    <span className="text-lg font-bold">{formatPrice(property.price, property.currency)}</span>
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
                    <Link to={`/admin/properties/edit/${property._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property._id)}
                      disabled={deletingId === property._id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}

          {filteredProperties.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== "all" 
                    ? "No properties match your search criteria."
                    : "Start by adding your first property."}
                </p>
                <Link to="/admin/properties/add">
                  <Button variant="luxury">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
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
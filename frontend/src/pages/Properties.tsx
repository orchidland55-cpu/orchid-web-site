import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Property } from "@/services/api";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  ArrowRight,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getCloudinaryUrl } from "@/services/cloudinary";

// ---------------------------------------------------------------------------
// Helper : renvoie le slug si disponible, sinon l'_id (rétrocompatibilité)
// pour les propriétés créées avant l'ajout des slugs.
// ---------------------------------------------------------------------------
const propertyPath = (property: Property) =>
  `/property/${property.slug || property._id}`;

const PropertiesPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    loadProperties();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCity]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const propertiesData = await apiService.getAllProperties();
      const availableProperties = propertiesData.filter(property =>
        property.status === 'available' || property.status === 'sold'
      );
      setProperties(availableProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number, currency: "MAD" | "USD" | "EUR" = "MAD") => {
    const localeMap = {MAD: "fr-MA", USD: "en-US", EUR: "fr-FR",};
    const symbolMap = {MAD: "MAD", USD: "$", EUR: "€",};

    const formatted = new Intl.NumberFormat(localeMap[currency], {
     style: "decimal",
     minimumFractionDigits: 0,
    }).format(price);

    return currency === "MAD"
      ? `${formatted} MAD`
      : `${symbolMap[currency]}${formatted}`;
  };

  const propertyTypes = Array.from(
    new Set(properties.map(property => property.type).filter(Boolean))
  ).sort();
  const propertyCities = Array.from(
    new Set(properties.map(property => property.city).filter(Boolean))
  ).sort();

  const filteredProperties = properties.filter(property => {
    const searchText = `${property.title} ${property.location} ${property.city}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase();
    const matchesCity = filterCity === "all" || property.city.toLowerCase() === filterCity.toLowerCase();

    return matchesSearch && matchesType && matchesCity;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const siblingCount = 1;
    const pageNumbers: (number | string)[] = [];

    pageNumbers.push(1);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = 3 + 2 * siblingCount;
      for (let i = 2; i <= Math.min(leftRange, totalPages - 1); i++) {
        pageNumbers.push(i);
      }
      if (totalPages > leftRange + 1) pageNumbers.push('...');
    } else if (showLeftDots && !showRightDots) {
      pageNumbers.push('...');
      const rightRange = 3 + 2 * siblingCount;
      for (let i = Math.max(totalPages - rightRange, 2); i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pageNumbers.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
    } else {
      for (let i = 2; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }

    if (totalPages > 1) pageNumbers.push(totalPages);

    return (
      <div className="flex flex-col items-center space-y-4 mt-12">
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-w-[90px]"
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
            className="min-w-[90px]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    );
  };

  return (
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
                  Our Exceptional Properties
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Discover our exclusive selection of luxury properties in Morocco
                </p>
              </div>
            </div>
          </section>

          {isLoading ? (
            <section className="py-20">
              <div className="container mx-auto px-6">
                <div className="text-center">
                  <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Loading properties...</h2>
                  <p className="text-muted-foreground">Please wait</p>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Filters Section */}
              <section className="py-12 bg-background border-b">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Input
                        type="text"
                        placeholder="Search for a property..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Types</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Cities</option>
                        {propertyCities.map((city) => (
                         <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="text-muted-foreground">
                        {filteredProperties.length}{" "}
                        {filteredProperties.length === 1 ? "property" : "properties"} found
                        {filteredProperties.length > 0 && (
                          <span className="text-sm ml-2">
                            (showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProperties.length)})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Properties Grid */}
              <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentProperties.map((property) => (
                      <Card key={property._id} className="group overflow-hidden hover:shadow-luxury transition-all duration-500 min-h-[600px]">
                        <div className="relative">
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={property.mainImage || "/api/placeholder/400/300"}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 z-10">
                              <Badge className="luxury-gradient text-primary-foreground px-3 py-1 text-xs font-medium">
                                {property.status === 'available' ? "Available" : "Sold"}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 z-10">
                              <Badge className="luxury-gradient text-primary-foreground px-3 py-1 text-xs font-medium">
                                {property.type}
                              </Badge>
                            </div>
                            {/* ✅ Lien avec slug */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Link to={propertyPath(property)}>
                                <Button variant="secondary" size="sm" className="bg-white/90 text-foreground hover:bg-white">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="mb-4">
                              <h3 className="text-xl font-playfair font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-muted-foreground mb-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{property.location}, {property.city}</span>
                              </div>
                              <div
                                className="text-muted-foreground text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: property.description && property.description.length > 200
                                    ? property.description.substring(0, 200) + '...'
                                    : property.description || ''
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-100">
                              <div className="text-center">
                                <Bed className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-sm font-medium text-foreground">{property.bedrooms}</span>
                                <div className="text-xs text-muted-foreground">Bedrooms</div>
                              </div>
                              <div className="text-center">
                                <Bath className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-sm font-medium text-foreground">{property.bathrooms}</span>
                                <div className="text-xs text-muted-foreground">Bathrooms</div>
                              </div>
                              <div className="text-center">
                                <Square className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-sm font-medium text-foreground">{property.area}</span>
                                <div className="text-xs text-muted-foreground">m²</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {property.amenities.slice(0, 3).map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {property.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{property.amenities.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div>
                                <div className="text-2xl font-bold text-primary">
                                  {formatPrice(property.price, property.currency)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {property.yearBuilt && `Built in ${property.yearBuilt}`}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {/* ✅ Lien avec slug */}
                                <Link to={propertyPath(property)}>
                                  <Button variant="luxury" size="sm">
                                    <ArrowRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {renderPagination()}

                  {filteredProperties.length === 0 && (
                    <div className="text-center py-20">
                      <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No properties found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
        <Footer />
      </div>
  );
};

export default PropertiesPage;
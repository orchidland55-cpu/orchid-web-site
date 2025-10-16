import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Star,
  Eye,
  ArrowRight,
  Building,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiService, Property } from "@/services/api";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAllProperties();
        console.log("🚀 Properties received:", data); // DEBUG

        // Filter only available properties
        const availableProperties = data.filter(
          (p) => p.status === "available"
        );

        // Take first 3
        setProperties(availableProperties.slice(0, 3));
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const stripHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };


  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'villa':
        return <Home className="w-4 h-4" />;
      case 'penthouse':
        return <Building className="w-4 h-4" />;
      case 'apartment':
        return <Building className="w-4 h-4" />;
      case 'chalet':
        return <Home className="w-4 h-4" />;
      case 'riad':
        return <Home className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-lora text-lg">Loading properties...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="font-lora text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Building className="w-5 h-5 text-primary" />
            <span className="font-serif text-primary font-medium">Our Properties</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Exceptional <span className="luxury-gradient bg-clip-text text-transparent">Properties</span>
          </h2>
          <p className="font-serif text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive selection of luxury properties in Morocco.
            Each property is carefully selected for its prime location and exceptional finishes.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property) => (
            <Card key={property._id} className="group overflow-hidden hover:shadow-luxury transition-all duration-500 min-h-[500px]">
              <div className="relative">
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.mainImage || "/placeholder-property.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
                    }}
                  />

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2 font-lora">
                    {property.featured && (
                      <Badge className="luxury-gradient text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {property.status}
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(property._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(property._id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Quick View Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center font-lora">
                    <Link to={`/properties/${property._id}`}>
                      <Button variant="secondary" size="sm" className="bg-white/90 text-foreground hover:bg-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Property Type & Location */}
                  <div className="flex items-center justify-between mb-3 font-lora">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      {getPropertyIcon(property.type)}
                      <span className="text-sm font-medium">{property.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.city}</span>
                    </div>
                  </div>

                  {/* Property Title */}
                  <h3 className="text-xl font-playfair font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  {/* Property Description */}
                  <p
                    className="font-lora text-muted-foreground text-sm mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: property.description && property.description.length > 150
                        ? property.description.substring(0, 150) + '...'
                        : property.description || ''
                    }}
                  />

                  {/* Property Details */}
                  <div className="font-lora flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
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
                  </div>

                  {/* Amenities */}
                  <div className="font-lora flex flex-wrap gap-1 mb-4">
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

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between font-lora mt-auto">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)} MAD
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(property.price / property.area).toLocaleString()} MAD/m²
                      </p>
                    </div>
                    <Link to={`/properties/${property._id}`}>
                      <Button variant="luxury" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center font-lora">
          <Link to="/properties">
            <Button variant="luxury" size="lg" className="group">
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Properties;
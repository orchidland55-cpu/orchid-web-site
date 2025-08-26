import { useState } from "react";
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
import { properties } from "@/data/properties";

// Use only first 3 properties for the homepage component
const displayProperties = properties.slice(0, 3).map(property => ({
  ...property,
  image: property.image || property.images?.[0] || ""
}));


const Properties = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'villa':
        return <Home className="w-4 h-4" />;
      case 'penthouse':
        return <Building className="w-4 h-4" />;
      case 'appartement':
        return <Building className="w-4 h-4" />;
      case 'chalet':
        return <Home className="w-4 h-4" />;
      case 'riad':
        return <Home className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Building className="w-5 h-5 text-primary" />
            <span className="font-serif text-primary font-medium">Nos Propriétés</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Propriétés d'<span className="luxury-gradient bg-clip-text text-transparent">Exception</span>
          </h2>
          <p className="font-serif text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive de propriétés de luxe au Maroc.
            Chaque bien est soigneusement choisi pour son emplacement privilégié et ses finitions exceptionnelles.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayProperties.map((property) => (
            <Card key={property.id} className="group overflow-hidden hover:shadow-luxury transition-all duration-500">
              <div className="relative">
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2 font-lora">
                    {property.featured && (
                      <Badge className="luxury-gradient text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Vedette
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {property.status}
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(property.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Quick View Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center font-lora">
                    <Link to={`/properties/${property.id}`}>
                      <Button variant="secondary" size="sm" className="bg-white/90 text-foreground hover:bg-white">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Property Type & Location */}
                  <div className="flex items-center justify-between mb-3 font-lora">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      {getPropertyIcon(property.type)}
                      <span className="text-sm font-medium">{property.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>

                  {/* Property Title */}
                  <h3 className="text-xl font-playfair font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  {/* Property Description */}
                  <p className="font-lora text-muted-foreground text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

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
                  <div className="flex items-center justify-between font-lora">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)} {property.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(property.price / property.area).toLocaleString()} MAD/m²
                      </p>
                    </div>
                    <Link to={`/properties/${property.id}`}>
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
              Voir Toutes les Propriétés
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Properties;
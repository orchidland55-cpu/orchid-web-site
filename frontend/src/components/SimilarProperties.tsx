import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Bed, Bath, Square, MapPin, ArrowRight } from "lucide-react";
import { apiService, Property } from "@/services/api";
import { getCloudinaryUrl } from "@/services/cloudinary";

interface SimilarPropertiesProps {
  currentPropertyId: string;
  type: string;
  city: string;
  price: number;
}

const SimilarProperties = ({ currentPropertyId, type, city, price }: SimilarPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollIntervalRef = useRef<number | null>(null); 

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const allProperties = await apiService.getAllProperties();
        
        const similar = allProperties
          .filter(prop => {
            if (prop._id === currentPropertyId) return false;
            if (prop.type === type && prop.city === city) return true;
            if (prop.type === type || prop.city === city) return true;
            return false;
          })
          .sort((a, b) => {
            const scoreA = (a.type === type ? 2 : 0) + (a.city === city ? 1 : 0);
            const scoreB = (b.type === type ? 2 : 0) + (b.city === city ? 1 : 0);
            return scoreB - scoreA;
          })
          .slice(0, 6);

        setProperties(similar);
      } catch (error) {
        console.error("Erreur chargement propriétés similaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentPropertyId, type, city]);

  // Auto-scroll avec setInterval + scrollTo
  useEffect(() => {
    if (properties.length <= 2) return;

    const startAutoScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      autoScrollIntervalRef.current = setInterval(() => {
        if (container && !isHovered) {
          const cardWidth = container.firstChild ? (container.firstChild as HTMLElement).offsetWidth + 16 : 300; // largeur carte + gap
          const newScrollPosition = container.scrollLeft + cardWidth;
          const maxScroll = container.scrollWidth - container.clientWidth;

          if (newScrollPosition >= maxScroll) {
            // Retour au début
            container.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
          } else {
            container.scrollTo({
              left: newScrollPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 3000); // Défilement toutes les 3 secondes
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [properties.length, isHovered]);

  const formatPrice = (price: number, currency: string = "MAD") => {
    const formatted = new Intl.NumberFormat("fr-MA", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price);
    return currency === "MAD" ? `${formatted} MAD` : `${currency}${formatted}`;
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-muted/20 border-t">
      <div className="container mx-auto px-4 sm:px-6">
        {/* En-tête de section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="default" className="mb-3">Similar Properties</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              You May Also Like
            </h2>
          </div>
          <Link 
            to="/properties"
            className="hidden sm:inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Slider horizontal avec scroll natif et auto-scroll */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Conteneur avec scroll horizontal */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {properties.map((property) => (
              <Link
                key={property._id}
                to={`/property/${property.slug || property._id}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[350px] snap-start group"
              >
                <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={getCloudinaryUrl(property.mainImage, 400, 300)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x300/f3f4f6/374151?text=No+Image";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="text-xs">
                        {property.status === 'available' ? 'Available' : property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-white/90 text-xs">
                        {property.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Contenu */}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{property.city}</span>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        {property.area}m²
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Gradient de fondu sur les bords pour indiquer le scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/20 to-transparent pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/20 to-transparent pointer-events-none sm:hidden" />
        </div>

        {/* Lien mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/properties">
            <Button variant="outline" size="sm">
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Styles pour cacher la scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SimilarProperties;
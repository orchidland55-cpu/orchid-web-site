import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Star, ArrowRight, Building, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService, Property } from "@/services/api";
import { getCloudinaryUrl } from "@/services/cloudinary";
import { HeroFilters } from "@/components/HeroSearchBar";

const propertyPath = (property: Property) =>
  `/property/${property.slug || property._id}`;

interface PropertiesProps {
  filters?: HeroFilters;
}

const DEFAULT_FILTERS: HeroFilters = {
  type: "all", city: "all", minPrice: 0, maxPrice: Infinity,
};

const Properties = ({ filters = DEFAULT_FILTERS }: PropertiesProps) => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // Charge une seule fois toutes les propriétés disponibles
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAllPropertiesCached();
        const available = data
          .filter((p) => p.status === "available")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllProperties(available);
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtre côté client à chaque changement de filters (pas de nouvelle requête)
  const displayed = allProperties
    .filter((p) => filters.type === "all" || p.type.toLowerCase() === filters.type)
    .filter((p) => filters.city === "all" || p.city === filters.city)
    .filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    .slice(0, 6);

  const hasActiveFilters =
    filters.type !== "all" || filters.city !== "all" || filters.minPrice > 0;

  const formatPrice = (price: number, currency: "MAD" | "USD" | "EUR" = "MAD") => {
    const localeMap = { MAD: "fr-MA", USD: "en-US", EUR: "fr-FR" };
    const symbolMap = { MAD: "MAD", USD: "$", EUR: "€" };
    const formatted = new Intl.NumberFormat(localeMap[currency], {
      style: "decimal", minimumFractionDigits: 0,
    }).format(price);
    return currency === "MAD" ? `${formatted} MAD` : `${symbolMap[currency]}${formatted}`;
  };

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "villa": case "chalet": case "riad":
        return <Home className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Building className="w-5 h-5 text-primary" />
            <span className="font-serif text-primary font-medium">Our Properties</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Exceptional{" "}
            <span className="luxury-gradient bg-clip-text text-transparent">Properties</span>
          </h2>
          <p className="font-serif text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive selection of luxury properties in Morocco.
            Each property is carefully selected for its prime location and exceptional finishes.
          </p>

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
              {filters.type !== "all" && (
                <span className="font-lora text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
                </span>
              )}
              {filters.city !== "all" && (
                <span className="font-lora text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {filters.city}
                </span>
              )}
              {filters.minPrice > 0 && (
                <span className="font-lora text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {filters.minPrice.toLocaleString()} –{" "}
                  {filters.maxPrice === Infinity ? "∞" : filters.maxPrice.toLocaleString()} MAD
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Grid ou empty state ── */}
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-lora text-muted-foreground text-lg mb-4">
              No properties match your criteria.
            </p>
            <Link to="/properties">
              <Button variant="luxury" size="sm">View all properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayed.map((property) => (
              <Link
                key={property._id}
                to={propertyPath(property)}
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-luxury transition-shadow duration-500 bg-card"
              >
                {/* Image cinématique */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.mainImage ? getCloudinaryUrl(property.mainImage, 480, 288) : "/placeholder-property.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={288}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-property.jpg"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-col gap-2 font-lora">
                    {property.featured && (
                      <Badge className="luxury-gradient text-white border-0 text-xs">
                        <Star className="w-3 h-3 mr-1" />Featured
                      </Badge>
                    )}
                    <Badge className="bg-white/90 text-foreground text-xs font-medium border-0">
                      For Sale
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                    <p className="font-lora text-xs tracking-widest uppercase text-white/80 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{property.city}
                    </p>
                    <h3 className="font-playfair text-xl font-bold text-white leading-snug">
                      {property.title}
                    </h3>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex items-center justify-between bg-card">
                  <div>
                    <p className="font-lora text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Price</p>
                    <p className="font-playfair text-xl font-bold text-foreground">
                      {formatPrice(property.price, property.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-lora text-sm text-muted-foreground">
                    {property.bedrooms  > 0 && <span className="flex items-center gap-1"><Bed    className="w-4 h-4 text-primary" />{property.bedrooms}</span>}
                    {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath   className="w-4 h-4 text-primary" />{property.bathrooms}</span>}
                    {property.area      > 0 && <span className="flex items-center gap-1"><Square className="w-4 h-4 text-primary" />{property.area} m²</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {displayed.length > 0 && (
          <div className="text-center font-lora">
            <Link to="/properties">
              <Button variant="luxury" size="sm" className="group md:size-lg text-xs sm:text-sm md:text-base">
                Explore More Luxury Properties
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
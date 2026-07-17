import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Star, ArrowRight } from "lucide-react";
import { Property } from "@/services/api";
import { getCloudinaryUrl } from "@/services/cloudinary";

interface PropertyCardProps {
  property: Property;
  variant?: "large" | "small";
}

const propertyPath = (property: Property) =>
  `/property/${property.slug || property._id}`;

const formatPrice = (price: number, currency: "MAD" | "USD" | "EUR" = "MAD") => {
  const localeMap = { MAD: "fr-MA", USD: "en-US", EUR: "fr-FR" };
  const symbolMap = { MAD: "MAD", USD: "$", EUR: "€" };
  const formatted = new Intl.NumberFormat(localeMap[currency], {
    style: "decimal", minimumFractionDigits: 0,
  }).format(price);
  return currency === "MAD" ? `${formatted} MAD` : `${symbolMap[currency]}${formatted}`;
};

// ✅ Les propriétés créées avant l'ajout du champ listingType n'ont pas cette
// valeur en base — traitées comme "sale" par défaut (comportement historique).
const getListingType = (p: Property): string => (p as any).listingType || "sale";

const PropertyCard = ({ property, variant = "small" }: PropertyCardProps) => {
  const imageHeight = variant === "large" ? 400 : 288;

  const listingLabel =
    property.status === "sold"
      ? "Sold"
      : getListingType(property) === "sale"
      ? "For Sale"
      : "For Rent";

  return (
    <Link
      to={propertyPath(property)}
      className="group flex flex-col h-full rounded-2xl overflow-hidden shadow-md hover:shadow-luxury transition-shadow duration-500 bg-card"
    >
      <div className="relative flex-1 overflow-hidden">
        <img
          src={property.mainImage ? getCloudinaryUrl(property.mainImage, 480, imageHeight) : "/placeholder-property.jpg"}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          decoding="async"
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
            {listingLabel}
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

      <div className="px-5 py-4 flex items-center justify-between bg-card shrink-0">
        <div>
          <p className="font-lora text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Price</p>
          <p className="font-playfair text-xl font-bold text-foreground">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
        <div className="flex items-center gap-3 font-lora text-sm text-muted-foreground">
          {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-primary" />{property.bedrooms}</span>}
          {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-primary" />{property.bathrooms}</span>}
          {property.area > 0 && <span className="flex items-center gap-1"><Square className="w-4 h-4 text-primary" />{property.area} m²</span>}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
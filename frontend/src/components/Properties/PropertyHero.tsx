import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import { Property } from "@/services/api";
import { getCloudinaryUrl } from "@/services/cloudinary";
import { propertyPath, formatPrice } from "@/utils/Property";

/**
 * Full-width editorial block used for the most recently added property.
 * Only shown on page 1 when no filters are active (see PropertiesPage).
 */
const PropertyHero = ({ property }: { property: Property }) => {
  return (
    <Link
      to={propertyPath(property)}
      className="group grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 md:gap-10 items-stretch mb-10"
    >
      <div className="relative rounded-xl overflow-hidden bg-muted h-64 md:h-[26rem]">
        <img
          src={
            property.mainImage
              ? getCloudinaryUrl(property.mainImage, 960, 640)
              : "/api/placeholder/960/640"
          }
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="eager"
          decoding="async"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-background/95 text-foreground text-xs font-medium px-3 py-1 rounded-full border border-border/40">
            {property.type}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center py-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
          Nouveau sur Orchid Island
        </span>

        <h2 className="font-playfair font-semibold text-2xl md:text-3xl text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
          {property.title}
        </h2>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>
            {property.city}
            {property.location ? ` · ${property.location}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Square className="w-4 h-4" />
            {property.area} m²
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span
            className={`text-2xl font-semibold ${
              property.status === "sold"
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            Découvrir ce bien
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyHero;
import { Property } from "@/services/api";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Images, ArrowRight } from "lucide-react";
import { getCloudinaryUrl } from "@/services/cloudinary";
import { propertyPath, formatPrice } from "@/utils/Property";

interface PropertyCardProps {
  property: Property;
  /**
   * "large" is used for the bigger slots in the masonry grid (more height
   * available for the image, slightly larger title/price).
   */
  variant?: "default" | "large";
}

const PropertyCard = ({ property, variant = "default" }: PropertyCardProps) => {
  const isSold = property.status === "sold";
  const isLarge = variant === "large";

  const imageCount =
    1 +
    (Array.isArray(property.additionalImages)
      ? property.additionalImages.filter(
          (i): i is string => typeof i === "string" && i.trim().length > 0
        ).length
      : 0);

  return (
    <Link
      to={propertyPath(property)}
      className="group h-full flex flex-col rounded-xl overflow-hidden border border-border/60 bg-card hover:border-border hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* ── Image ──
          flex-1 lets this area fill whatever height the grid cell gives it,
          so the same card works for a 1x1 slot or a 2x2 "featured" slot. */}
      <div className="relative flex-1 min-h-[140px] overflow-hidden bg-muted">
        <img
          src={
            property.mainImage
              ? getCloudinaryUrl(property.mainImage, 640, 480)
              : "/api/placeholder/640/480"
          }
          alt={property.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            isSold ? "grayscale-[40%]" : ""
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Type pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-background/95 text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/40">
            {property.type}
          </span>
        </div>

        {/* Status vendu */}
        {isSold && (
          <div className="absolute top-3 right-3">
            <span className="inline-block bg-background/95 text-destructive text-[11px] font-medium px-2.5 py-1 rounded-full border border-destructive/20">
              Vendu
            </span>
          </div>
        )}

        {/* Compteur photos */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
            <Images className="w-3 h-3" />
            {imageCount}
          </div>
        )}
      </div>

      {/* ── Corps ── */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-muted-foreground text-[11px] mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>
            {property.city}
            {property.location ? ` · ${property.location}` : ""}
          </span>
        </div>

        <h3
          className={`font-playfair font-semibold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2 ${
            isLarge ? "text-lg" : "text-[15px]"
          }`}
        >
          {property.title}
        </h3>

        <div className="border-t border-border/50 pt-4 mb-4">
          <div className="grid grid-cols-3 divide-x divide-border/50">
            <div className="text-center pr-3">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Bed className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="text-[13px] font-medium text-foreground">
                {property.bedrooms}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">ch.</div>
            </div>
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Bath className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="text-[13px] font-medium text-foreground">
                {property.bathrooms}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">sdb</div>
            </div>
            <div className="text-center pl-3">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Square className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="text-[13px] font-medium text-foreground">
                {property.area}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">m²</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`font-semibold ${
              isSold
                ? "text-muted-foreground line-through text-[14px]"
                : "text-foreground"
            } ${isLarge ? "text-xl" : "text-[17px]"}`}
          >
            {formatPrice(property.price, property.currency)}
          </div>
          <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-200">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
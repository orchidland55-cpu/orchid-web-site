import { Property } from "@/services/api";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Images, ArrowRight } from "lucide-react";
import { getCloudinaryUrl } from "@/services/cloudinary";
import { propertyPath, formatPrice } from "@/utils/Property";
import { LazyImage } from "@/components/OptimizedImage";

interface PropertyCardProps {
  property: Property;
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

  // ── Direction A : Cinématique full-bleed (grands slots 2×2) ───────────────
  if (isLarge) {
    return (
      <Link
        to={propertyPath(property)}
        aria-label={`Voir la propriété : ${property.title}, ${property.city}`}
        className="group relative flex h-full w-full rounded-xl overflow-hidden bg-neutral-900 block ring-1 ring-[#D4AF37]/40 hover:ring-[#D4AF37]/70 transition-all duration-300"
        style={{ minHeight: "340px" }}
      >
        {/* Image full-bleed avec LazyImage */}
        <LazyImage
          src={property.mainImage}
          alt={property.title}
          width={900}
          height={600}
          className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.02] ${
            isSold ? "grayscale-[40%]" : ""
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          widths={[400, 600, 900, 1200]}
          crop="fill"
          blurPlaceholder
        />

        {/* Dégradé bas */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
          }}
        />

        {/* Type pill — haut gauche */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="text-[11px] font-medium text-white px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "0.5px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            {property.type}
          </span>
          {isSold && (
            <span className="text-xs font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded-md bg-red-600 shadow-lg"> Sold </span>
          )}
        </div>

        {/* Prix — haut droite */}
        <div className="absolute top-4 right-4">
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#D4AF37", color: "#1a1a1a" }}
          >
            {formatPrice(property.price, property.currency)}
          </span>
        </div>

        {/* Compteur photos — bas droite image */}
        {imageCount > 1 && (
          <div
            className="absolute right-4 flex items-center gap-1 text-white text-[10px] px-2 py-1 rounded-full"
            style={{ bottom: "90px", background: "rgba(0,0,0,0.45)" }}
          >
            <Images className="w-3 h-3" />
            {imageCount}
          </div>
        )}

        {/* Corps bas */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-1.5 text-white/60 text-[11px] mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            {property.city}
            {property.location ? ` · ${property.location}` : ""}
          </div>

          <h3
            className="text-white font-playfair font-semibold leading-snug mb-4 line-clamp-2"
            style={{ fontSize: "19px" }}
          >
            {property.title}
          </h3>
          
          <div className="flex items-center gap-5">
          {!!property.bedrooms && (
           <div className="flex items-center gap-1.5 text-white/70 text-[12px]">
             <Bed className="w-3.5 h-3.5" />
             {property.bedrooms} ch.
           </div>
         )}
         {!!property.bathrooms && (
           <div className="flex items-center gap-1.5 text-white/70 text-[12px]">
             <Bath className="w-3.5 h-3.5" />
             {property.bathrooms} sdb
           </div>
         )}
          {!!property.area && (
            <div className="flex items-center gap-1.5 text-white/70 text-[12px]">
              <Square className="w-3.5 h-3.5" />
             {property.area} m²
           </div>
         )}
        </div>
               </div>
             </Link>
           );
         }

  // ── Direction C : Luxury card structurée (petits slots) ───────────────────
  return (
    <Link
      to={propertyPath(property)}
      aria-label={`Voir la propriété : ${property.title}, ${property.city}`}
      className="group h-full flex flex-col rounded-xl overflow-hidden border bg-card hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ring-1 ring-[#D4AF37]/40 hover:ring-[#D4AF37]/70"
      style={{ borderColor: "var(--color-border-tertiary, rgba(0,0,0,0.1))" }}
    >
      {/* Image avec LazyImage */}
      <div className="relative aspect-[4/3] overflow-hidden"
        style={{ background: "#1a1a1a" }}
      >
        <LazyImage
          src={property.mainImage}
          alt={property.title}
          width={640}
          height={400}
          className={`absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-[1.02] ${
            isSold ? "grayscale-[40%]" : ""
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          widths={[300, 640, 900]}
          crop="fill"
          blurPlaceholder
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide text-white px-2.5 py-1 rounded"
            style={{
              background: "rgba(0,0,0,0.38)",
              border: "0.5px solid rgba(255,255,255,0.18)",
              letterSpacing: "0.08em",
            }}
          >
            {property.type}
          </span>
          <div className="flex items-center gap-1.5">
            {isSold && (
              <span 
                className="text-[11px] font-medium text-red-300 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "0.5px solid rgba(239,68,68,0.3)",
                }}
              > Sold</span>
            )}
            {imageCount > 1 && (
              <span
                className="flex items-center gap-1 text-white text-[10px] px-2 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.4)" }}
              >
                <Images className="w-3 h-3" />
                {imageCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="p-4 flex flex-col gap-3">
        {/* Localisation */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          {property.city}
          {property.location ? ` · ${property.location}` : ""}
        </div>

        {/* Titre */}
        <h3 className="font-playfair font-semibold text-foreground text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Stats dans bloc encadré */}
        {(!!property.bedrooms || !!property.bathrooms || !!property.area) && (
        <div
         className="flex rounded-lg overflow-hidden"
         style={{ border: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.1))" }}
        >
         {!!property.bedrooms && (
            <div
             className="flex-1 py-2 text-center"
             style={
               (!!property.bathrooms || !!property.area)
                  ? { borderRight: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.1))" }
                 : {}
             }
           >
             <div className="flex items-center justify-center mb-0.5">
               <Bed className="w-3.5 h-3.5 text-muted-foreground" />
             </div>
              <div className="text-[13px] font-medium text-foreground">
                <span className="sr-only">Chambres :</span>
                {property.bedrooms}
              </div>
             <div className="text-[10px] text-muted-foreground">ch.</div>
           </div>
          )}
         {!!property.bathrooms && (
           <div
             className="flex-1 py-2 text-center"
              style={
               !!property.area
                 ? { borderRight: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.1))" }
                 : {}
              }
           >
             <div className="flex items-center justify-center mb-0.5">
               <Bath className="w-3.5 h-3.5 text-muted-foreground" />
             </div>
              <div className="text-[13px] font-medium text-foreground">{property.bathrooms}</div>
             <div className="text-[10px] text-muted-foreground">sdb</div>
           </div>
         )}
         {!!property.area && (
           <div className="flex-1 py-2 text-center">
              <div className="flex items-center justify-center mb-0.5">
               <Square className="w-3.5 h-3.5 text-muted-foreground" />
             </div>
              <div className="text-[13px] font-medium text-foreground">{property.area}</div>
             <div className="text-[10px] text-muted-foreground">m²</div>
           </div>
         )}
        </div>
      )}

        {/* Prix + CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div
              className={`font-semibold text-[17px] ${
                isSold ? "text-muted-foreground line-through text-[14px]" : "text-foreground"
              }`}
            >
              {formatPrice(property.price, property.currency)}
            </div>
            {!isSold && (
              <div className="text-[11px] mt-0.5" style={{ color: "#D4AF37" }}>
                Available
              </div>
            )}
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              border: "0.5px solid #D4AF37",
              color: "#D4AF37",
            }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
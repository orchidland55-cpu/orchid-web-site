import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, ArrowLeft, Building, Home, ChevronLeft, ChevronRight, Leaf, Waves, Shield, Sofa } from "lucide-react";
import "../styles/slider.css";
import { apiService, Property } from "@/services/api";
import { Helmet } from 'react-helmet-async';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Nettoie le HTML : lazy-load + suppression des dimensions hardcodées
  const fixImgSrc = (html: string): string => {
    return html
      .replace(/data-src="([^"]+)"/g, 'src="$1"')
      .replace(/data-srcset="([^"]+)"/g, 'srcset="$1"')
      // Supprime width= et height= en attributs HTML
      .replace(/<img([^>]*?)\s+width="[^"]*"/g, '<img$1')
      .replace(/<img([^>]*?)\s+height="[^"]*"/g, '<img$1')
      // Supprime width/height dans les styles inline
      .replace(/(<img[^>]*?)style="([^"]*)"/g, (_, pre, style) => {
        const cleaned = style
          .replace(/\bwidth\s*:[^;]+;?/g, '')
          .replace(/\bheight\s*:[^;]+;?/g, '')
          .trim();
        return cleaned ? `${pre}style="${cleaned}"` : pre;
      });
  };

  useEffect(() => {
    if (!id) {
      setError("Missing property ID");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPropertyById(id);
        if (!data) {
          setError("Property not found");
        } else {
          setProperty(data);
        }
      } catch (err) {
        console.error("Error loading:", err);
        setError("Unable to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Keyboard slider
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prevImage(); }
      if (e.key === "ArrowRight") { e.preventDefault(); nextImage(); }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="font-playfair text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Property not found"}
          </h1>
          <Link to="/properties">
            <Button variant="luxury">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description?.replace(/<[^>]*>/g, '').substring(0, 300),
    "url": `https://orchidisland.immo/property/${property.slug || property._id}`,
    "image": property.mainImage,
    "price": property.price,
    "priceCurrency": property.currency || "MAD",
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK"
    },
    "numberOfRooms": property.bedrooms,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressRegion": property.location,
      "addressCountry": "MA"
    },
    "offeredBy": {
      "@type": "RealEstateAgent",
      "name": "Orchid Immobilier",
      "url": "https://orchidisland.immo"
    }
  };

  // ── Construire la liste d'images ──────────────────────────────────────────
  const imagesToShow: string[] = [];
  if (property.mainImage?.trim()) imagesToShow.push(property.mainImage);

  const rawAdditional = property.additionalImages;
  if (Array.isArray(rawAdditional)) {
    imagesToShow.push(
      ...rawAdditional
        .filter((img): img is string => typeof img === "string")
        .map((img) => img.trim())
        .filter((img) => img.length > 0)
        .filter((img) => img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:image"))
    );
  } else if (typeof rawAdditional === "string") {
    const str = (rawAdditional as string).trim();
    if (str) {
      if (str.startsWith("http") || str.startsWith("data:image")) {
        imagesToShow.push(str);
      } else {
        imagesToShow.push(
          ...str
            .split(",")
            .map((img) => img.trim())
            .filter((img) => img.length > 0)
            .filter((img) => img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:image"))
        );
      }
    }
  }

  if (imagesToShow.length === 0) {
    imagesToShow.push("https://placehold.co/1200x800/f3f4f6/374151?text=No+image");
  }

  // ── Slider logic ──────────────────────────────────────────────────────────
  const nextImage = () => {
    if (!isTransitioning && imagesToShow.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => prev === imagesToShow.length - 1 ? 0 : prev + 1);
        setIsTransitioning(false);
      }, 100);
    }
  };

  const prevImage = () => {
    if (!isTransitioning && imagesToShow.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => prev === 0 ? imagesToShow.length - 1 : prev - 1);
        setIsTransitioning(false);
      }, 100);
    }
  };

  const goToImage = (index: number) => {
    if (!isTransitioning && index !== currentImageIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 100);
    }
  };

  const formatPrice = (price: number, currency: "MAD" | "USD" | "EUR" = "MAD") => {
    const localeMap = { MAD: "fr-MA", USD: "en-US", EUR: "fr-FR" };
    const symbolMap = { MAD: "MAD", USD: "$", EUR: "€" };
    const formatted = new Intl.NumberFormat(localeMap[currency], {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price);
    return currency === "MAD" ? `${formatted} MAD` : `${symbolMap[currency]}${formatted}`;
  };

  const statusLabel = {
    available: 'Available',
    sold: 'Sold',
    pending: 'Pending',
    draft: 'Draft'
  }[property.status] || property.status;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{property.title} | Orchid Immobilier</title>
        <meta name="description" content={property.description?.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <main>

        {/* ── Back navigation ── */}
        <section className="py-4 sm:py-6 bg-background border-b">
          <div className="font-playfair container mx-auto px-4 sm:px-6">
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Properties</span>
            </Link>
          </div>
        </section>

        {/* ── Main slider ── */}
        <section className="py-0">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Hauteur adaptée : plus petite sur mobile */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-luxury mb-6 sm:mb-8 group">
              <div className="relative w-full h-full">
                {imagesToShow.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100 translate-x-0 z-10"
                        : index < currentImageIndex
                        ? "opacity-0 scale-110 -translate-x-full z-0"
                        : "opacity-0 scale-110 translate-x-full z-0"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/1200x800/f3f4f6/374151?text=Load+error";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Flèches : plus petites sur mobile */}
              {imagesToShow.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={isTransitioning}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full transition-colors z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={isTransitioning}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full transition-colors z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Dots */}
              {imagesToShow.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  {imagesToShow.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Compteur */}
              {imagesToShow.length > 1 && (
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm z-20">
                  {currentImageIndex + 1} / {imagesToShow.length}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Lightbox ── */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] rounded-lg shadow-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-2xl sm:text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Thumbnails ── */}
        {imagesToShow.length > 1 && (
          <section className="py-4 sm:py-6 bg-background border-b">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                {/* justify-start sur mobile pour éviter le débordement du min-w-max */}
                <div className="flex gap-2 sm:gap-3 min-w-max sm:justify-center px-1">
                  {imagesToShow.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative group w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-lg flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-primary shadow-lg ring-2 ring-primary/20 scale-105"
                          : "border-gray-200 hover:border-primary/50 hover:scale-105"
                      }`}
                      title={`Image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/80x80/f3f4f6/374151?text=Img";
                        }}
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Details ── */}
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Sidebar passe SOUS le contenu sur mobile/tablet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

              {/* ── Colonne principale ── */}
              <div className="lg:col-span-2 space-y-8">

                {/* Titre + prix */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Badge variant="default">{statusLabel}</Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-4 sm:mb-6">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="text-base sm:text-lg">{property.location}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </div>

                {/* Stats : 2 colonnes sur mobile, 4 sur md+ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    { icon: <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />, value: property.bedrooms, label: "Bedrooms" },
                    { icon: <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />, value: property.bathrooms, label: "Bathrooms" },
                    { icon: <Square className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />, value: property.area, label: "m²" },
                    { icon: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />, value: property.yearBuilt, label: "Year" },
                  ].map(({ icon, value, label }) => (
                    <div key={label} className="text-center p-3 sm:p-4 bg-card rounded-lg border">
                      {icon}
                      <div className="text-xl sm:text-2xl font-bold">{value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Description — images responsives via prose + fixImgSrc */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">Description</h2>
                  <div
                    className="property-description text-base sm:text-lg text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: fixImgSrc(property.description) }}
                  />
                  </div>

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Amenities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-card rounded-lg border"
                        >
                          <Home className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm sm:text-base">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-4">Information</h3>
                    <div className="space-y-3 text-sm sm:text-base">
                      {[
                        { label: "Type", value: property.type },
                        { label: "Area", value: `${property.area} m²` },
                        { label: "Bedrooms", value: property.bedrooms },
                        { label: "Bathrooms", value: property.bathrooms },
                        { label: "Year", value: property.yearBuilt },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between gap-4">
                          <span className="text-muted-foreground shrink-0">{label}</span>
                          <span className="font-medium text-right">{value}</span>
                        </div>
                      ))}

                      {/* Options */}
                      {(property.garden || property.pool || property.security || property.furnished) && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Options</h4>
                          <div className="space-y-2">
                            {property.garden && (
                              <div className="flex items-center space-x-2">
                                <Leaf className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-sm">Garden</span>
                              </div>
                            )}
                            {property.pool && (
                              <div className="flex items-center space-x-2">
                                <Waves className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-sm">Pool</span>
                              </div>
                            )}
                            {property.security && (
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-gray-600 shrink-0" />
                                <span className="text-sm">24/7 Security</span>
                              </div>
                            )}
                            {property.furnished && (
                              <div className="flex items-center space-x-2">
                                <Sofa className="w-4 h-4 text-purple-500 shrink-0" />
                                <span className="text-sm">Furnished</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
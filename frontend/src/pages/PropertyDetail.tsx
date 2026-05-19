import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  Building,
  Home,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Waves,
  Shield,
  Sofa,
} from "lucide-react";
import "../styles/slider.css";
import { apiService, Property } from "@/services/api";

const PropertyDetail = () => {
  // `id` contient désormais soit un slug ("luxury-palace-marrakech"),
  // soit un _id MongoDB pour les anciens liens — les deux sont gérés côté backend.
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Missing property ID");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        // getPropertyById envoie le param tel quel (slug ou _id) ;
        // le backend sait gérer les deux.
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

  // Keyboard slider handling
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  // Construire la liste d'images
  const imagesToShow: string[] = [];
  if (property.mainImage && property.mainImage.trim()) {
    imagesToShow.push(property.mainImage);
  }

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

  // Slider logic
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

    return currency === "MAD"
      ? `${formatted} MAD`
      : `${symbolMap[currency]}${formatted}`;
  };

  const statusLabel = {
    available: 'Available',
    sold: 'Sold',
    pending: 'Pending',
    draft: 'Draft'
  }[property.status] || property.status;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Back navigation */}
        <section className="py-6 bg-background border-b">
          <div className="font-playfair container mx-auto px-6">
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Properties</span>
            </Link>
          </div>
        </section>

        {/* Main slider */}
        <section className="py-0">
          <div className="container mx-auto px-6">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-luxury mb-8 group">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none"></div>
                  </div>
                ))}
              </div>

              {imagesToShow.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={isTransitioning}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={isTransitioning}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-colors z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {imagesToShow.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {imagesToShow.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {imagesToShow.length > 1 && (
                <div className="absolute top-6 right-6 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                  {currentImageIndex + 1} / {imagesToShow.length}
                </div>
              )}
            </div>
          </div>
        </section>

        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-6 right-6 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Thumbnails */}
        {imagesToShow.length > 1 && (
          <section className="py-6 bg-background border-b">
            <div className="container mx-auto px-6">
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-3 min-w-max mx-auto px-2 justify-center">
                  {imagesToShow.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-lg flex-shrink-0 ${
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
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
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

        {/* Details */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default">{statusLabel}</Badge>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Square className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{property.area}</div>
                    <div className="text-sm text-muted-foreground">m²</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Building className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{property.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Year</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <div
                    className="text-lg text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-card rounded-lg border"
                        >
                          <Home className="w-4 h-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area</span>
                        <span className="font-medium">{property.area} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-3">Options</h4>
                        <div className="space-y-2">
                          {property.garden && (
                            <div className="flex items-center space-x-2">
                              <Leaf className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Garden</span>
                            </div>
                          )}
                          {property.pool && (
                            <div className="flex items-center space-x-2">
                              <Waves className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">Pool</span>
                            </div>
                          )}
                          {property.security && (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-gray-600" />
                              <span className="text-sm">24/7 Security</span>
                            </div>
                          )}
                          {property.furnished && (
                            <div className="flex items-center space-x-2">
                              <Sofa className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">Furnished</span>
                            </div>
                          )}
                        </div>
                      </div>
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
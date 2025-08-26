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
  Heart,
  Star,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Building,
  Home,
  Car,
  Wifi,
  Shield,
  Trees,
  Waves,
  Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import "../styles/slider.css";
import { properties } from "@/data/properties";

// Property data imported from centralized data file


const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id || "1"));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className=" font-playfair text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Propriété non trouvée</h1>
          <Link to="/properties">
            <Button variant="luxury">Retour aux propriétés</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (property && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === property.images.length - 1 ? 0 : prev + 1
        );
        setIsTransitioning(false);
      }, 100);
    }
  };

  const prevImage = () => {
    if (property && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === 0 ? property.images.length - 1 : prev - 1
        );
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency === 'MAD' ? 'MAD' : 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Back Navigation */}
        <section className="py-6 bg-background border-b">
          <div className="font-playfair container mx-auto px-6">
            <Link to="/properties" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </section>

        {/* Property Images Slider */}
        <section className="py-0">
          <div className="container mx-auto px-6">
            {/* Main Image Slider */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-luxury mb-8 group hover:shadow-luxury-hover smooth-transition-slow">
              {/* Image Container with Smooth Transitions */}
              <div className="relative w-full h-full">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
                      index === currentImageIndex
                        ? 'opacity-100 scale-100 translate-x-0 z-10'
                        : index < currentImageIndex
                        ? 'opacity-0 scale-110 -translate-x-full z-0'
                        : 'opacity-0 scale-110 translate-x-full z-0'
                    }`}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover scale-hover"
                    />
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 gradient-overlay"></div>

                    {/* Shimmer Effect on Load */}
                    <div className={`absolute inset-0 ${index === currentImageIndex ? '' : 'image-loading'}`}></div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows with Enhanced Design */}
              <button
                onClick={prevImage}
                disabled={isTransitioning}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-custom hover:bg-white/40 text-white p-4 rounded-full smooth-transition hover:scale-125 hover:shadow-luxury opacity-0 group-hover:opacity-100 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                disabled={isTransitioning}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-custom hover:bg-white/40 text-white p-4 rounded-full smooth-transition hover:scale-125 hover:shadow-luxury opacity-0 group-hover:opacity-100 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Enhanced Image Counter */}
              <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-custom text-white px-5 py-3 rounded-2xl text-sm font-semibold border border-white/20 smooth-transition hover:bg-black/40">
                <span className="text-primary font-bold text-lg">{currentImageIndex + 1}</span>
                <span className="text-white/70 mx-1"> / </span>
                <span className="text-white/90">{property.images.length}</span>
              </div>

              {/* Progress Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 opacity-0 group-hover:opacity-100 smooth-transition">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    disabled={isTransitioning}
                    className={`w-3 h-3 rounded-full smooth-transition hover:scale-150 ${
                      index === currentImageIndex
                        ? 'bg-white scale-150 shadow-luxury pulse-animation'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Thumbnail Navigation */}
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide px-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  disabled={isTransitioning}
                  className={`relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-3 smooth-transition-slow transform hover:scale-110 thumbnail-border ${
                    currentImageIndex === index
                      ? 'border-primary shadow-luxury scale-115 ring-4 ring-primary/30 ring-effect active'
                      : 'border-gray-200 hover:border-primary/60 hover:shadow-luxury-hover'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover smooth-transition hover:scale-105"
                  />

                  {/* Active State Overlay */}
                  <div className={`absolute inset-0 smooth-transition ${
                    currentImageIndex === index
                      ? 'bg-gradient-to-t from-primary/30 via-transparent to-primary/10'
                      : 'bg-transparent hover:bg-white/10'
                  }`}></div>

                  {/* Active Indicator */}
                  {currentImageIndex === index && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg pulse-animation"></div>
                  )}

                  {/* Image Number */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Image Title Overlay */}
            <div className="text-center mt-6">
              <h3 className="font-lora text-lg font-semibold text-foreground mb-2">
                Image {currentImageIndex + 1} de {property.images.length}
              </h3>
              <p className="text-muted-foreground">
                {property.title} - Galerie Photos
              </p>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-lora flex items-center space-x-3">
                      <Badge variant="default" className="luxury-gradient text-primary-foreground">
                        {property.status}
                      </Badge>
                      {property.featured && (
                        <Badge variant="outline" className="border-primary text-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
                    {property.title}
                  </h1>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold text-primary font-lora">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </div>

                {/* Property Stats */}
                <div className="font-lora grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Chambres</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Salles de bain</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Square className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{property.area}</div>
                    <div className="text-sm text-muted-foreground">m²</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Building className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{property.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Année</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-foreground mb-4">Description</h2>
                  <p className="font-lora text-lg text-muted-foreground leading-relaxed">
                    {property.fullDescription}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-foreground mb-6">Équipements et Services</h2>
                  <div className="font-lora grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
                        <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center">
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Agent */}
                <Card className="font-playfair shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Contacter l'Agent</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-lora font-semibold text-foreground">{property.agent.name}</div>
                        <div className="font-lora text-sm text-muted-foreground">Agent Immobilier</div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button variant="luxury" className="w-full">
                          <Phone className="font-lora w-4 h-4 mr-2" />
                          {property.agent.phone}
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button variant="elegant" className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Planifier une visite
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Info */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Informations</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium text-foreground">{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Surface</span>
                        <span className="font-medium text-foreground">{property.area} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chambres</span>
                        <span className="font-medium text-foreground">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salles de bain</span>
                        <span className="font-medium text-foreground">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Année</span>
                        <span className="font-medium text-foreground">{property.yearBuilt}</span>
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

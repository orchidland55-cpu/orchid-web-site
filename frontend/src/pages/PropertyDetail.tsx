import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Bed, Bath, Square, ArrowLeft, Building, Home,
  ChevronLeft, ChevronRight, Leaf, Waves, Shield, Sofa, Play,
} from "lucide-react";
import "../styles/slider.css";
import { apiService, Property } from "@/services/api";
import { Helmet } from "react-helmet-async";
import { getCloudinaryUrl, getCloudinaryVideoUrl, optimizeHtmlImages } from "@/services/cloudinary";
// import ImmersiveTourButton from "@/components/ImmersiveTourButton";
import PropertyContactForm from "@/components/PropertyContactForm";
import SimilarProperties from "@/components/SimilarProperties";
import { SITE_URL, ORGANIZATION_REF, WEBSITE_REF } from "@/config/schema";
import { OptimizedImage, LazyImage } from "@/components/OptimizedImage";

// ✅ Lazy-load : GSAP (utilisé à l'intérieur de ce composant) ne se charge
// désormais que si le visiteur clique réellement sur "Virtual Tour",
// au lieu d'être téléchargé à chaque visite d'une fiche propriété.
const ImmersiveTourModal = lazy(() => import("@/components/ImmersiveTourModal"));



interface CinematicGalleryProps {
  images: string[];
  thumbnails: string[];
  title: string;
  hasVirtualTour: boolean;
  onOpenTour: () => void;
}

const CinematicGallery = ({
  images,
  thumbnails,
  title,
  hasVirtualTour,
  onOpenTour,
}: CinematicGalleryProps) => {
  const [current, setCurrent] = useState(0);
  // ✅ On garde en mémoire l'index précédent le temps du fondu, pour ne
  // jamais monter plus de 2 images à la fois (au lieu des 11 d'origine).
  const [previous, setPrevious] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const FADE_DURATION = 450; // doit matcher la transition CSS ci-dessous

  const go = (index: number) => {
    if (transitioning || index === current) return;

    // On garde l'ancienne image montée le temps du fondu, puis on la retire.
    setPrevious(current);
    setCurrent(index);
    setTransitioning(true);

    clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setTransitioning(false);
      setPrevious(null); // ✅ démonte l'ancienne image : elle arrête de consommer des ressources
    }, FADE_DURATION);
  };

  useEffect(() => {
    return () => clearTimeout(fadeTimeoutRef.current);
  }, []);

  const prev = () => go(current === 0 ? images.length - 1 : current - 1);
  const next = () => go(current === images.length - 1 ? 0 : current + 1);

  /* Auto-scroll le strip pour que la thumb active reste visible */
  useEffect(() => {
    if (!stripRef.current) return;
    const strip = stripRef.current;
    const thumb = strip.children[current] as HTMLElement;
    if (!thumb) return;
    const thumbLeft = thumb.offsetLeft;
    const thumbRight = thumbLeft + thumb.offsetWidth;
    const stripLeft = strip.scrollLeft;
    const stripRight = stripLeft + strip.clientWidth;
    if (thumbLeft < stripLeft + 16) {
      strip.scrollTo({ left: thumbLeft - 16, behavior: "smooth" });
    } else if (thumbRight > stripRight - 16) {
      strip.scrollTo({ left: thumbRight - strip.clientWidth + 16, behavior: "smooth" });
    }
  }, [current]);

  /* Keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, transitioning]);

  // Auto-scroll toutes les 8s — s'arrête si une seule image
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      next();
    }, 8000);
    return () => clearInterval(timer);
  }, [current, transitioning]);

  // ✅ Seules l'image affichée (+ l'ancienne pendant les 450ms de fondu)
  // sont réellement montées dans le DOM. Avant, les 11 photos d'une
  // annonce étaient toutes montées en même temps (juste opacity:0),
  // ce qui les faisait toutes charger — et consommer des crédits
  // Cloudinary — dès l'arrivée sur la page.
  const indicesToRender = new Set<number>([current]);
  if (previous !== null) indicesToRender.add(previous);

  return (
    <>
      {/* ── Main cinematic frame ── */}
      <div className="relative w-full h-64 sm:h-80 md:h-[480px] lg:h-[580px] overflow-hidden rounded-xl sm:rounded-2xl select-none bg-zinc-600">

        {/* Images en stack cross-fade — seulement current (+ previous pendant le fondu) sont montées */}
        {images.map((src, i) => {
          if (!indicesToRender.has(i)) return null;

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: i === current ? 1 : 0,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                zIndex: i === current ? 1 : 0,
              }}
            >
              <OptimizedImage
                src={src}
                alt={`${title} — photo ${i + 1}`}
                width={1200}
                height={800}
                className="w-full h-full object-contain cursor-zoom-in"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                widths={[800, 1200]} // ✅ 2 tailles au lieu de [400, 800, 1200, 1600]
                priority={i === 0}
                onClick={() => setLightbox(src)}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/1200x800/f3f4f6/374151?text=Image+indisponible";
                }}
              />
            </div>
          );
        })}

        {/* Gradient overlay bas — porte le strip et les infos */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{
            height: "55%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
          }}
        />

        {/* Compteur haut-droite */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-20 bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Flèches navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={transitioning}
              aria-label="Image précédente"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={next}
              disabled={transitioning}
              aria-label="Image suivante"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* ── Bande inférieure : thumbnails + Virtual Tour ── */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-3 sm:px-5 pb-3 sm:pb-5 flex items-end justify-between gap-3">

          {/* Strip thumbnails */}
          {images.length > 1 && (
            <div
              ref={stripRef}
              className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0"
              style={{ scrollbarWidth: "none" }}
            >
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Voir photo ${i + 1}`}
                  className="relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-300"
                  style={{
                    width: i === current ? "52px" : "40px",
                    height: "40px",
                    outline: i === current ? "2px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.2)",
                    outlineOffset: "1px",
                    opacity: i === current ? 1 : 0.6,
                  }}
                >
                  <LazyImage
                    src={thumb}
                    alt={`Miniature ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    sizes="80px"
                    widths={[80]} // ✅ 1 seule taille au lieu de [40, 80, 120] — affichée à 40px max
                    crop="thumb"
                    quality={30}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/80x80/f3f4f6/374151?text=img";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Bouton Virtual Tour */}
          {/* {hasVirtualTour && (
            <button
              onClick={onOpenTour}
              className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-medium transition-colors"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "0.5px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white stroke-none" />
              <span className="hidden sm:inline">Virtual Tour</span>
              <span className="sm:hidden">Tour</span>
            </button>
          )} */}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/92 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Vue agrandie"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors text-lg"
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────── */

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [viewStartTime] = useState(Date.now());
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fixImgSrc = (html: string): string => {
    return html
      .replace(/data-src="([^"]+)"/g, 'src="$1"')
      .replace(/data-srcset="([^"]+)"/g, 'srcset="$1"')
      .replace(/<img([^>]*?)\s+width="[^"]*"/g, "<img$1")
      .replace(/<img([^>]*?)\s+height="[^"]*"/g, "<img$1")
      .replace(/(<img[^>]*?)style="([^"]*)"/g, (_, pre, style) => {
        const cleaned = style
          .replace(/\bwidth\s*:[^;]+;?/g, "")
          .replace(/\bheight\s*:[^;]+;?/g, "")
          .trim();
        return cleaned ? `${pre}style="${cleaned}"` : pre;
      })
      .replace(/(<figure[^>]*?)style="([^"]*)"/g, (_, pre, style) => {
        const cleaned = style
          .replace(/\bwidth\s*:[^;]+;?/g, "")
          .replace(/\bheight\s*:[^;]+;?/g, "")
          .trim();
        return cleaned ? `${pre}style="${cleaned}"` : pre;
      })
      .replace(/<figure([^>]*?)\s+width="[^"]*"/g, "<figure$1");
  };

  const processDescription = (html: string): string => {
    const fixed = fixImgSrc(html);
    return optimizeHtmlImages(fixed, 800);
  };

  useEffect(() => {
    if (!id) { setError("ID de propriété manquant"); setLoading(false); return; }
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPropertyById(id);
        if (!data) setError("Propriété introuvable");
        else setProperty(data);
        // Track property view
        try {
          let visitorId = localStorage.getItem("visitorId");

          if (!visitorId) {
            visitorId =
              "visitor_" +
              Math.random().toString(36).substring(2) +
              Date.now();

            localStorage.setItem("visitorId", visitorId);
          }

          const location = JSON.parse(
            localStorage.getItem("visitorLocation") || "{}"
          );

          await fetch(
            "https://orchid-web-site-production-1f73.up.railway.app/lead-activity/view-property",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                propertyId: data._id,
                visitorId,
                country: location.country || "",
                city: location.city || "",
                latitude: location.latitude || null,
                longitude: location.longitude || null,
                locationSource: location.locationSource || "unknown",
              }),
            }
          );
        } catch (err) {
          console.error("Property tracking failed:", err);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger la propriété");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    return () => {
      const visitorId = localStorage.getItem("visitorId");

      if (!visitorId || !property?._id) return;

      const timeSpentSeconds = Math.floor(
        (Date.now() - viewStartTime) / 1000
      );

      fetch(
        "https://orchid-web-site-production-1f73.up.railway.app/lead-activity/property-time",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            propertyId: property._id,
            timeSpentSeconds,
          }),
        }
      ).catch(console.error);
    };
  }, [property, viewStartTime]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const visitorId = localStorage.getItem("visitorId");

      if (!visitorId || !property?._id) return;

      const timeSpentSeconds = Math.floor(
        (Date.now() - viewStartTime) / 1000
      );

      navigator.sendBeacon(
        "https://orchid-web-site-production-1f73.up.railway.app/lead-activity/property-time",
        new Blob(
          [
            JSON.stringify({
              visitorId,
              propertyId: property._id,
              timeSpentSeconds,
            }),
          ],
          {
            type: "application/json",
          }
        )
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [property, viewStartTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-xl text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="font-playfair text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Propriété introuvable"}
          </h1>
          <Link to="/properties">
            <Button variant="luxury">Retour aux propriétés</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── JSON-LD ── */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Offer", "WebPage"],
    "@id": `${SITE_URL}/property/${property.slug || property._id}#offer`,
    "url": `${SITE_URL}/property/${property.slug || property._id}`,
    "isPartOf": WEBSITE_REF,
    "price": property.price,
    "priceCurrency": property.currency || "MAD",
    "itemOffered": {
      "@type": "Residence",
      "@id": `${SITE_URL}/property/${property.slug || property._id}#property`,
      "name": property.title,
      "description": property.description?.replace(/<[^>]*>/g, "").substring(0, 500),
      "image": property.mainImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.city,
        "addressRegion": property.location,
        "addressCountry": "MA",
      },
      "amenityFeature": property.amenities?.map(a => ({
        "@type": "LocationFeatureSpecification",
        "name": a,
        "value": true
      }))
    },
    "seller": ORGANIZATION_REF,
    "mainEntityOfPage": {
      "@id": `${SITE_URL}/property/${property.slug || property._id}#webpage`
    }
  };

  /* ── Construire la liste d'images ── */
  const imagesToShow: string[] = [];
  if (property.mainImage?.trim()) imagesToShow.push(property.mainImage);

  const rawAdditional = property.additionalImages;
  if (Array.isArray(rawAdditional)) {
    imagesToShow.push(
      ...rawAdditional
        .filter((img): img is string => typeof img === "string")
        .map((img) => img.trim())
        .filter((img) => img.length > 0)
        .filter(
          (img) =>
            img.startsWith("http://") ||
            img.startsWith("https://") ||
            img.startsWith("data:image")
        )
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
            .filter(
              (img) =>
                img.startsWith("http://") ||
                img.startsWith("https://") ||
                img.startsWith("data:image")
            )
        );
      }
    }
  }

  const optimizedImages = imagesToShow.map((img) =>
    img.startsWith("http") ? getCloudinaryUrl(img, 1200, 800) : img
  );
  const thumbnailImages = imagesToShow.map((img) =>
    img.startsWith("http") ? getCloudinaryUrl(img, 120, 80) : img
  );

  if (optimizedImages.length === 0) {
    optimizedImages.push(
      "https://placehold.co/1200x800/f3f4f6/374151?text=Aucune+image"
    );
  }

  const videos: string[] = Array.isArray(property.videos)
    ? property.videos.filter(
      (v): v is string => typeof v === "string" && v.trim().length > 0
    )
    : [];

  /* ── Formatage prix ── */
  const formatPrice = (
    price: number,
    currency: "MAD" | "USD" | "EUR" = "MAD"
  ) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Available</Badge>;
      case "sold":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Sold</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const baseUrl = `https://orchidisland.immo/property/${property.slug || property._id}`;


  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{property.title} | Orchid Immobilier</title>
        <link rel="canonical" href={baseUrl} />

        <meta
          name="description"
          content={property.description
            ?.replace(/<[^>]*>/g, "")
            .substring(0, 160)}
        />
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
              <span>Retour aux propriétés</span>
            </Link>
          </div>
        </section>

        {/* ── Cinematic Gallery ── */}
        <section className="py-4 sm:py-6 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <CinematicGallery
              images={optimizedImages}
              thumbnails={thumbnailImages}
              title={property.title}
              hasVirtualTour={videos.length > 0}
              onOpenTour={() => setTourOpen(true)}
            />
          </div>
        </section>
        {videos.length > 0 && (
          <section className="py-8 sm:py-10 bg-muted/30 border-y">
            <div className="container mx-auto px-4 sm:px-6">

              {/* Header section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Virtual Tour</h2>
                  {videos.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{videos.length} videos available</p>
                  )}
                </div>
              </div>

              {/* Vidéo active */}
              <div className="relative rounded-2xl overflow-hidden shadow-luxury bg-black aspect-video max-w-4xl mx-auto">
                {videoLoaded ? (
                <video
                  key={videos[currentVideoIndex]}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                >
                  <source src={getCloudinaryVideoUrl(videos[currentVideoIndex])} />
                </video>
                ) : (
                <button
                 onClick={() => setVideoLoaded(true)}
                  className="relative w-full h-full"
                  aria-label="Lancer la vidéo"
                >
                  <img
                   src={optimizedImages[1]?? optimizedImages[0]}
                   alt="Aperçu vidéo"
                   className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                   <Play className="w-16 h-16 text-white fill-white/90" />
                  </div>
                </button>
                )}
              </div>

              {/* Carrousel dots + miniatures si plusieurs */}
              {videos.length > 1 && (
                <div className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-3">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`transition-all duration-300 rounded-full ${index === currentVideoIndex
                        ? "w-6 h-2.5 bg-primary"
                        : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                        }`}
                      aria-label={`Video ${index + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>
        )}

        {/* ── Details ── */}
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

              {/* ── Colonne principale ── */}
              <div className="lg:col-span-2 space-y-8">

                {/* Titre + prix */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    {getStatusBadge(property.status)}
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

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    {
                      icon: <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />,
                      value: property.bedrooms,
                      label: "Chambres",
                    },
                    {
                      icon: <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />,
                      value: property.bathrooms,
                      label: "Salles de bain",
                    },
                    {
                      icon: <Square className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />,
                      value: property.area,
                      label: "m²",
                    },
                    {
                      icon: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />,
                      value: property.yearBuilt,
                      label: "Année",
                    },
                  ].map(({ icon, value, label }) => (
                    <div
                      key={label}
                      className="text-center p-3 sm:p-4 bg-card rounded-lg border"
                    >
                      {icon}
                      <div className="text-xl sm:text-2xl font-bold">{value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">Description</h2>
                  <div
                    className="property-description text-base sm:text-lg text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: processDescription(property.description),
                    }}
                  />
                </div>

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                      Équipements
                    </h2>
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
                    <h3 className="text-lg sm:text-xl font-bold mb-4">Informations</h3>
                    <div className="space-y-3 text-sm sm:text-base">
                      {[
                        { label: "Type", value: property.type },
                        { label: "Surface", value: `${property.area} m²` },
                        { label: "Chambres", value: property.bedrooms },
                        { label: "Salles de bain", value: property.bathrooms },
                        { label: "Année", value: property.yearBuilt },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between gap-4">
                          <span className="text-muted-foreground shrink-0">{label}</span>
                          <span className="font-medium text-right">{value}</span>
                        </div>
                      ))}

                      {(property.garden ||
                        property.pool ||
                        property.security ||
                        property.furnished) && (
                          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                            <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                              Options
                            </h4>
                            <div className="space-y-2">
                              {property.garden && (
                                <div className="flex items-center space-x-2">
                                  <Leaf className="w-4 h-4 text-green-500 shrink-0" />
                                  <span className="text-sm">Jardin</span>
                                </div>
                              )}
                              {property.pool && (
                                <div className="flex items-center space-x-2">
                                  <Waves className="w-4 h-4 text-blue-500 shrink-0" />
                                  <span className="text-sm">Piscine</span>
                                </div>
                              )}
                              {property.security && (
                                <div className="flex items-center space-x-2">
                                  <Shield className="w-4 h-4 text-gray-600 shrink-0" />
                                  <span className="text-sm">Sécurité 24/7</span>
                                </div>
                              )}
                              {property.furnished && (
                                <div className="flex items-center space-x-2">
                                  <Sofa className="w-4 h-4 text-purple-500 shrink-0" />
                                  <span className="text-sm">Meublé</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
                <PropertyContactForm
                  propertyTitle={property.title}
                  propertyId={property._id || property.slug || id || ''}
                />
              </div>
            </div>
          </div>
        </section>

        {tourOpen && (
          <Suspense fallback={null}>
            <ImmersiveTourModal
              videos={videos}
              images={optimizedImages}
              propertyTitle={property.title}
              isOpen={tourOpen}
              onClose={() => setTourOpen(false)}
            />
          </Suspense>
        )}
        <SimilarProperties
          currentPropertyId={property._id}
          type={property.type}
          city={property.city}
          price={property.price}
        />
      </main>


      <Footer />
    </div>
  );
};

export default PropertyDetail;
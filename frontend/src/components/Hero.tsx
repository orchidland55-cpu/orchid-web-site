import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Cloudinary URLs centralisés
const HERO_IMAGE_URL =
  "https://res.cloudinary.com/drgg2rocc/image/upload/f_auto,q_auto:eco,w_1200,dpr_auto/v1781262920/pexels-iwashere-18320910_1_fv44s3.jpg";

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/drgg2rocc/video/upload/q_auto,f_auto/v1781262489/14763266_3840_2160_60fps_1_vghvkk.mp4";

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <>
      {/* Preload image LCP sur mobile */}
      {!isDesktop && (
        <link
          rel="preload"
          as="image"
          href={HERO_IMAGE_URL}
          // @ts-ignore — fetchpriority est valide HTML mais pas encore dans les types React
          fetchpriority="high"
        />
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {isDesktop ? (
            // Desktop : vidéo
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={HERO_IMAGE_URL}
              className="w-full h-full object-cover"
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
          ) : (
            // Mobile : image statique uniquement
            <img
              src={HERO_IMAGE_URL}
              alt="Orchid Island luxury property"
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          )}

          {/* Gradient overlay — une seule fois */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0">
            {/* Luxury Badge */}
            <div className="inline-flex items-center space-x-2 bg-ivory-white/10 backdrop-blur-sm border border-ivory-white/20 rounded-full px-6 py-2 mb-8">
              <div className="w-2 h-2 luxury-gradient rounded-full" />
              <span className="text-ivory-white font-lora text-sm font-medium">
                Exclusive Luxury Properties
              </span>
            </div>

            {/* Heading */}
            <h1
              className="notranslate font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-ivory-white mb-6 leading-tight"
              translate="no"
            >
              Orchid Island
              <br />
              <span
                className="notranslate luxury-gradient bg-clip-text text-transparent"
                translate="no"
              >
                Real estate
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-lora text-xl md:text-2xl text-ivory-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The Address You'll Always Remember
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10 text-ivory-white/80 font-lora">
              {["Exclusive property sales", "Custom acquisition", "High-end rental"].map(
                (feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-1 h-1 luxury-gradient rounded-full" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/properties">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-ivory-white/10 backdrop-blur-sm border-ivory-white/30 text-ivory-white hover:bg-ivory-white hover:text-charcoal font-playfair px-8 py-6 h-auto"
                >
                  Discover our properties
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
import { useEffect, useState } from "react";

// Cloudinary URLs centralisés
const HERO_IMAGE_URL =
  "https://res.cloudinary.com/drgg2rocc/image/upload/f_auto,q_auto:eco,w_1200,dpr_auto/v1782416336/hero_tweegz.webp";

const HERO_VIDEO_URL ="";
//   "https://res.cloudinary.com/drgg2rocc/video/upload/q_auto,f_auto,w_1920,c_limit/v1781262489/14763266_3840_2160_60fps_1_vghvkk.mp4";

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {isDesktop ? (
            // Desktop : vidéo
            <video
              autoPlay muted loop playsInline
              preload="none"
              poster={HERO_IMAGE_URL}
              className="w-full h-full object-cover"
              aria-hidden="true"
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
                Luxury Real Estate in Marrakech and Morocco.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-lora text-xl md:text-2xl text-ivory-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The Address You'll Always Remember
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
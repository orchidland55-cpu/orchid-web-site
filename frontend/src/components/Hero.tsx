import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroVilla from "@/assets/hero-villa.jpg";
import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroVilla}
          alt="Luxury villa with stunning architecture and infinity pool"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Luxury Badge */}
          <div className="inline-flex items-center space-x-2 bg-ivory-white/10 backdrop-blur-sm border border-ivory-white/20 rounded-full px-6 py-2 mb-8">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-ivory-white font-lora text-sm font-medium">Exclusive Luxury Properties</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-ivory-white mb-6 leading-tight">
            Orchid Island<br />
            <span className="luxury-gradient bg-clip-text text-transparent">Real estate</span>
          </h1>

          {/* Subtitle */}
          <p className="font-lora text-xl md:text-2xl text-ivory-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
           The Address You’ll Always Remember
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10 text-ivory-white/80 font-lora">
            <div className=" flex items-center space-x-2">
              <div className=" w-1 h-1 luxury-gradient rounded-full "></div>
              <span>Vente de propriétés exclusives</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 luxury-gradient rounded-full"></div>
              <span>Acquisition personnalisée</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 luxury-gradient rounded-full"></div>
              <span>Location haut de gamme</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
           <Link to="/properties">
            <Button variant="outline" size="lg" className="bg-ivory-white/10 backdrop-blur-sm border-ivory-white/30 text-ivory-white hover:bg-ivory-white hover:text-charcoal font-playfair px-8 py-6 h-auto">

              Découvrir nos propriétés
                                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

            </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-ivory-white/60 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="font-playfair text-sm">Scroll down</span>
          <div className="w-px h-8 bg-ivory-white/30"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
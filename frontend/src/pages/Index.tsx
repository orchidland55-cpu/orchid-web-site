import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Properties from "@/components/Properties";
import News from "@/components/News";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import OurPartners from "@/components/Ourpartners";
import PropertyCategories from "@/components/PropertyCategories";
import { useRef, useState } from "react";
import HeroSearchBar, { HeroFilters } from "@/components/HeroSearchBar";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  const [heroFilters, setHeroFilters] = useState<HeroFilters>({
    type: "all", city: "all", minPrice: 0, maxPrice: Infinity,
  });

  const propertiesRef = useRef<HTMLDivElement>(null);

  const handleHeroSearch = (filters: HeroFilters) => {
    setHeroFilters(filters);
    propertiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="relative">
          <Hero />
          {/* Desktop uniquement : la search bar n'existe pas sur mobile */}
          <div className="hidden md:flex absolute bottom-[50px] left-0 right-0 translate-y-1/2 px-4 sm:px-6 z-20 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <HeroSearchBar onSearch={handleHeroSearch} />
          </div>
        </div>

        <div className="pt-4 md:pt-6">
          <AnimatedSection variant="fade-up">
            <div ref={propertiesRef}>
              <Properties filters={heroFilters} />
            </div>
          </AnimatedSection>

          <AnimatedSection variant="zoom-in" duration={800}>
            <PropertyCategories/>
          </AnimatedSection>

          <AnimatedSection variant="fade-right">
            <Introduction />
          </AnimatedSection>

          <AnimatedSection variant="fade-left">
            <News />
          </AnimatedSection>

          <AnimatedSection variant="fade-up">
            <OurPartners />
          </AnimatedSection>

          <AnimatedSection variant="fade-up" duration={800}>
            <Testimonials />
          </AnimatedSection>

          <AnimatedSection variant="fade">
            <FAQ />
          </AnimatedSection>
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
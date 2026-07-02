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
        <Hero />
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 z-20">
          <div className="max-w-5xl mx-auto">
            <HeroSearchBar onSearch={handleHeroSearch} />
          </div>
        </div>
        <div ref={propertiesRef}>
          <Properties filters={heroFilters} />
        </div>
        <PropertyCategories />
        <Introduction />
        <News />
        <OurPartners />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
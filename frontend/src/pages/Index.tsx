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
import { Helmet } from "react-helmet-async";
import { SITE_URL, ORGANIZATION_REF, WEBSITE_REF, LOGO_URL} from "@/config/schema";

const Index = () => {
  const [heroFilters, setHeroFilters] = useState<HeroFilters>({
    listingType: "all", type: "all", city: "all", minPrice: 0, maxPrice: Infinity,
  });

  const propertiesRef = useRef<HTMLDivElement>(null);

  const handleHeroSearch = (filters: HeroFilters) => {
    setHeroFilters(filters);
    propertiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#home`,
    url: `${SITE_URL}/`,
    name: "Orchid Island Real Estate | Luxury Real Estate & Investment",
    description:
      "Discover luxury real estate opportunities with Orchid Island Real Estate. Explore premium properties, investment opportunities, and expert real estate services across Morocco.",
    isPartOf: WEBSITE_REF,
    about: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Orchid Island Real Estate | Luxury Real Estate & Investment</title>
        <meta
          name="description"
          content="Discover luxury real estate opportunities with Orchid Island Real Estate. Explore premium properties, investment opportunities, and expert real estate services across Morocco."
        />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:title" content="Orchid Island Real Estate | Luxury Real Estate & Investment" />
        <meta property="og:description" content="Discover luxury real estate opportunities with Orchid Island Real Estate. Explore premium properties, investment opportunities, and expert real estate services across Morocco." />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289701/logopng_j3hjit.png"
        />
        <meta property="og:site_name" content="Orchid Island Real Estate" />
        <script type="application/ld+json">
          {JSON.stringify(homeJsonLd)}
        </script>
      </Helmet>
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
            <div ref={propertiesRef} className="scroll-mt-[120px]">
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
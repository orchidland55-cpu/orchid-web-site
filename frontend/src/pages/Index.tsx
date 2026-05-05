import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Properties from "@/components/Properties";
import SoldProperties from "@/components/SoldProperties";
import News from "@/components/News";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import OurPartners from "@/components/Ourpartners";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Introduction />
        <Properties />
        <SoldProperties />
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

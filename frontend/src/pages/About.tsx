import Header from "@/components/Header";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { SITE_URL, ORGANIZATION_REF, WEBSITE_REF, LOGO_URL } from "@/config/schema";

const About = () => {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about-us#webpage`,
    url: `${SITE_URL}/about-us`,
    name: "About Orchid Island Real Estate",
    description: "Learn more about Orchid Island Real Estate, our expertise, investment philosophy, and commitment to delivering luxury real estate solutions across Morocco and international markets.",
    isPartOf: WEBSITE_REF,
    mainEntity: ORGANIZATION_REF,
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
        <title>About Us | Orchid Island Real Estate</title>

        <meta
          name="description"
          content="Learn more about Orchid Island Real Estate, our expertise, investment philosophy, and commitment to delivering luxury real estate solutions across Morocco and international markets."
        />

        <link rel="canonical" href={`${SITE_URL}/about-us`} />

        <meta property="og:title" content="About Us | Orchid Island Real Estate" />
        <meta
          property="og:description"
          content="Learn more about Orchid Island Real Estate, our expertise, investment philosophy, and commitment to delivering luxury real estate solutions across Morocco and international markets."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/about-us`} />
        <meta property="og:image" content={LOGO_URL} />
        <meta property="og:site_name" content="Orchid Island Real Estate" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Orchid Island Real Estate" />
        <meta
          name="twitter:description"
          content="Learn more about Orchid Island Real Estate, our expertise, investment philosophy, and commitment to delivering luxury real estate solutions across Morocco and international markets."
        />
        <meta name="twitter:image" content={LOGO_URL} />

        <script type="application/ld+json">
          {JSON.stringify(aboutJsonLd)}
        </script>
      </Helmet>
      <Header />
      <main>
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
};

export default About;
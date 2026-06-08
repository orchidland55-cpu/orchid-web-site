import { Helmet } from "react-helmet-async";

const GlobalSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://orchidisland.immo/#organization",
    "name": "Orchid Island Real Estate",
    "url": "https://orchidisland.immo",
    "mainEntityOfPage": {
        "@id": "https://orchidisland.immo/#website"
    },
    "logo": "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289701/logopng_j3hjit.png",
    "sameAs": [
      "https://www.instagram.com/orchid_island_real_estate?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D",
      "https://www.linkedin.com/company/orchid-island-real-estate-marrakech/"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://orchidisland.immo/#website",
    "url": "https://orchidisland.immo",
    "name": "Orchid Island Real Estate",
    "publisher": {
      "@id": "https://orchidisland.immo/#organization"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default GlobalSchema;
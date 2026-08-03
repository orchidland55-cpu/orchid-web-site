import { Helmet } from "react-helmet-async";
import { ORGANIZATION_REF } from "@/config/schema";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}

export default function ServiceSchema({
  name,
  description,
  url,
  serviceType,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    "name": name,
    "description": description,
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "provider": {
      "@type": "RealEstateAgent",
      "@id": ORGANIZATION_REF["@id"],
    },
    "areaServed": [
      {
        "@type": "Place",
        "name": "Europe",
      },
      {
        "@type": "Place",
        "name": "Middle East",
      },
      {
        "@type": "Place",
        "name": "Africa",
      },
    ],
    "serviceType": serviceType,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
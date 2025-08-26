import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  currency: string;
  image?: string;
  images?: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  fullDescription?: string;
  amenities: string[];
  yearBuilt: number;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Penthouse Panoramique",
    location: "Casablanca Marina",
    price: 15500000,
    currency: "MAD",
    image: property1,
    images: [
      property1, 
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 285,
    type: "Penthouse",
    status: "À vendre",
    featured: true,
    description: "Penthouse d'exception avec vue panoramique sur l'océan Atlantique. Cette propriété unique offre des finitions haut de gamme, des espaces de vie généreux et une terrasse privée de 150m² avec vue imprenable. Situé dans le quartier le plus prisé de Casablanca Marina, cet appartement représente le summum du luxe urbain.",
    fullDescription: "Ce penthouse exceptionnel de 285m² situé au dernier étage d'une résidence de standing offre une vue panoramique à 360° sur l'océan Atlantique et la ville de Casablanca. L'appartement dispose de 4 chambres spacieuses dont une suite parentale avec dressing et salle de bain privative, 3 salles de bain modernes, un salon-séjour de 60m² avec cheminée, une cuisine équipée haut de gamme et une terrasse privée de 150m² avec jacuzzi. Les finitions sont d'un niveau exceptionnel avec du marbre italien, parquet en chêne massif et domotique intégrée.",
    amenities: ["Vue mer panoramique", "Terrasse 150m²", "Parking privé", "Concierge 24h/7j", "Piscine", "Salle de sport", "Spa", "Cave à vin"],
    yearBuilt: 2021,
    agent: {
      name: "Sarah Benali",
      phone: "+212 6XX-XXX-XXX",
      email: "sarah.benali@orchidisland.com"
    }
  },
  {
    id: 2,
    title: "Villa Bord de Mer",
    location: "Rabat Océan",
    price: 22800000,
    currency: "MAD",
    image: property2,
    images: [
      property2,
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 6,
    bathrooms: 5,
    area: 450,
    type: "Villa",
    status: "À vendre",
    featured: false,
    description: "Magnifique villa contemporaine de 450m² située en première ligne de mer à Rabat Océan. Cette propriété d'exception dispose d'un accès direct à une plage privée et offre des vues spectaculaires sur l'océan depuis toutes les pièces principales.",
    fullDescription: "Magnifique villa contemporaine de 450m² située en première ligne de mer à Rabat Océan. Cette propriété d'exception dispose d'un accès direct à une plage privée et offre des vues spectaculaires sur l'océan depuis toutes les pièces principales. La villa comprend 6 chambres, 5 salles de bain, un salon cathédrale, une cuisine professionnelle et de nombreux espaces de réception intérieurs et extérieurs.",
    amenities: ["Accès plage privée", "Piscine infinity", "Jardin paysager", "Garage 3 voitures", "Système domotique", "Climatisation", "Chauffage au sol"],
    yearBuilt: 2020,
    agent: {
      name: "Ahmed Tazi",
      phone: "+212 6XX-XXX-XXX",
      email: "ahmed.tazi@orchidisland.com"
    }
  },
  {
    id: 3,
    title: "Riad Authentique",
    location: "Marrakech Médina",
    price: 8900000,
    currency: "MAD",
    image: property3,
    images: [
      property3,
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    type: "Riad",
    status: "À vendre",
    featured: false,
    description: "Riad authentique du 18ème siècle entièrement rénové dans le respect de l'architecture traditionnelle marocaine. Situé dans un quartier calme de la médina de Marrakech, ce riad de 320m² s'organise autour d'un magnifique patio central avec fontaine.",
    fullDescription: "Riad authentique du 18ème siècle entièrement rénové dans le respect de l'architecture traditionnelle marocaine. Situé dans un quartier calme de la médina de Marrakech, ce riad de 320m² s'organise autour d'un magnifique patio central avec fontaine. Il comprend 5 chambres, 4 salles de bain, plusieurs salons, une cuisine moderne et une terrasse sur le toit avec vue sur l'Atlas.",
    amenities: ["Patio central", "Terrasse toit", "Piscine", "Hammam", "Parking proche", "Climatisation", "Chauffage", "Wifi"],
    yearBuilt: 1780,
    agent: {
      name: "Fatima Alaoui",
      phone: "+212 6XX-XXX-XXX",
      email: "fatima.alaoui@orchidisland.com"
    }
  },
  {
    id: 4,
    title: "Appartement Moderne Centre-Ville",
    location: "Casablanca Centre",
    price: 4500000,
    currency: "MAD",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: "Appartement",
    status: "À vendre",
    featured: true,
    description: "Superbe appartement de 120m² situé dans une résidence moderne au centre de Casablanca. Cet appartement lumineux dispose de 3 chambres, 2 salles de bain, un salon spacieux avec cuisine ouverte équipée. Les finitions sont modernes avec du parquet, une cuisine équipée haut de gamme et une terrasse avec vue sur la ville.",
    fullDescription: "Superbe appartement de 120m² situé dans une résidence moderne au centre de Casablanca. Cet appartement lumineux dispose de 3 chambres, 2 salles de bain, un salon spacieux avec cuisine ouverte équipée. Les finitions sont modernes avec du parquet, une cuisine équipée haut de gamme et une terrasse avec vue sur la ville. Idéalement situé proche des commerces, transports et centres d'affaires.",
    amenities: ["Vue ville", "Terrasse", "Parking", "Ascenseur", "Climatisation", "Cuisine équipée", "Proche transports", "Sécurité 24h"],
    yearBuilt: 2019,
    agent: {
      name: "Karim Benjelloun",
      phone: "+212 6XX-XXX-XXX",
      email: "karim.benjelloun@orchidisland.com"
    }
  },
  {
    id: 5,
    title: "Villa Moderne Ain Diab",
    location: "Casablanca Ain Diab",
    price: 18000000,
    currency: "MAD",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    type: "Villa",
    status: "À vendre",
    featured: false,
    description: "Élégante villa contemporaine de 380m² située dans le prestigieux quartier d'Ain Diab. Cette propriété offre 5 chambres dont une suite parentale, 4 salles de bain, un salon double hauteur, une cuisine moderne et de nombreux espaces de vie. Le jardin paysager de 800m² comprend une piscine, une terrasse et un espace barbecue.",
    fullDescription: "Élégante villa contemporaine de 380m² située dans le prestigieux quartier d'Ain Diab. Cette propriété offre 5 chambres dont une suite parentale, 4 salles de bain, un salon double hauteur, une cuisine moderne et de nombreux espaces de vie. Le jardin paysager de 800m² comprend une piscine, une terrasse et un espace barbecue. Garage pour 2 voitures et système de sécurité complet.",
    amenities: ["Piscine", "Jardin 800m²", "Garage 2 voitures", "Système sécurité", "Climatisation", "Chauffage", "Terrasse", "Barbecue"],
    yearBuilt: 2018,
    agent: {
      name: "Laila Fassi",
      phone: "+212 6XX-XXX-XXX",
      email: "laila.fassi@orchidisland.com"
    }
  },
  {
    id: 6,
    title: "Duplex Luxe Agdal",
    location: "Rabat Agdal",
    price: 7200000,
    currency: "MAD",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    type: "Duplex",
    status: "À vendre",
    featured: true,
    description: "Magnifique duplex de 200m² situé dans une résidence de standing à Agdal. Cet appartement sur deux niveaux comprend au rez-de-chaussée un salon, une cuisine équipée et une chambre, à l'étage 3 chambres dont une suite parentale avec dressing. La terrasse de 50m² offre une vue panoramique sur Rabat.",
    fullDescription: "Magnifique duplex de 200m² situé dans une résidence de standing à Agdal. Cet appartement sur deux niveaux comprend au rez-de-chaussée un salon, une cuisine équipée et une chambre, à l'étage 3 chambres dont une suite parentale avec dressing. La terrasse de 50m² offre une vue panoramique sur Rabat. Finitions haut de gamme avec marbre, parquet et domotique.",
    amenities: ["Terrasse 50m²", "Vue panoramique", "Domotique", "Parking", "Ascenseur", "Concierge", "Salle sport", "Piscine résidence"],
    yearBuilt: 2020,
    agent: {
      name: "Omar Benali",
      phone: "+212 6XX-XXX-XXX",
      email: "omar.benali@orchidisland.com"
    }
  }
];

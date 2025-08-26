import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  MapPin,
  Clock,
  Star,
  Shield,
  TrendingUp,
  Heart,
  CheckCircle,
  Building,
  Map,
  Phone,
  Mail
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { number: "15+", label: "Années d'expérience", icon: Clock },
    { number: "1,200+", label: "Propriétés vendues", icon: Building },
    { number: "98%", label: "Clients satisfaits", icon: Star },
    { number: "85+", label: "Partenaires de confiance", icon: Users },
  ];

  const services = [
    {
      title: "Vente de Propriétés de Luxe",
      description: "Accompagnement complet dans la vente de villas, penthouses et propriétés d'exception",
      features: ["Évaluation professionnelle", "Marketing haut de gamme", "Négociation experte"]
    },
    {
      title: "Achat et Investissement",
      description: "Conseil personnalisé pour l'acquisition de biens immobiliers de prestige",
      features: ["Recherche ciblée", "Analyse de marché", "Due diligence complète"]
    },
    {
      title: "Gestion Locative Premium",
      description: "Service de gestion locative pour propriétaires de biens haut de gamme",
      features: ["Sélection de locataires", "Maintenance premium", "Reporting détaillé"]
    },
    {
      title: "Conseil en Investissement",
      description: "Expertise en investissement immobilier et optimisation de portefeuille",
      features: ["Stratégie d'investissement", "Analyse ROI", "Diversification de portefeuille"]
    }
  ];

  const locations = [
    {
      city: "Casablanca",
      description: "Centre économique du Maroc",
      properties: "350+ propriétés",
      specialties: ["Marina", "Anfa", "Racine"]
    },
    {
      city: "Rabat",
      description: "Capitale administrative",
      properties: "280+ propriétés",
      specialties: ["Souissi", "Hay Riad", "Agdal"]
    },
    {
      city: "Marrakech",
      description: "Perle du Sud",
      properties: "420+ propriétés",
      specialties: ["Palmeraie", "Hivernage", "Gueliz"]
    },
    {
      city: "Tanger",
      description: "Porte de l'Europe",
      properties: "150+ propriétés",
      specialties: ["Marina Bay", "Malabata", "California"]
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Confiance",
      description: "Nous bâtissons des relations durables basées sur la transparence et l'intégrité."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque transaction et service que nous offrons."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Notre passion pour l'immobilier nous pousse à dépasser vos attentes."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Nous utilisons les dernières technologies pour optimiser votre expérience."
    }
  ];

  const team = [
    {
      name: "Ahmed Benali",
      role: "Directeur Général & Fondateur",
      experience: "20 ans d'expérience",
      speciality: "Immobilier de luxe",
      description: "Diplômé de l'École Supérieure de Commerce de Casablanca, Ahmed a fondé Orchid Island avec la vision de révolutionner le marché de l'immobilier de prestige au Maroc.",
      achievements: ["500+ transactions réalisées", "Expert en négociation complexe", "Réseau international"]
    },
    {
      name: "Fatima Alaoui",
      role: "Directrice Commerciale",
      experience: "15 ans d'expérience",
      speciality: "Négociation & Ventes",
      description: "Experte en relations clients et stratégies commerciales, Fatima supervise toutes les activités de vente et assure la satisfaction client.",
      achievements: ["Taux de satisfaction 98%", "Formation en négociation avancée", "Spécialiste clientèle internationale"]
    },
    {
      name: "Youssef Tazi",
      role: "Expert Immobilier Senior",
      experience: "12 ans d'expérience",
      speciality: "Évaluation & Conseil",
      description: "Architecte de formation, Youssef apporte son expertise technique dans l'évaluation et l'analyse des propriétés de prestige.",
      achievements: ["Certifié évaluateur immobilier", "Expert en architecture de luxe", "Conseil en investissement"]
    },
    {
      name: "Laila Benjelloun",
      role: "Responsable Marketing Digital",
      experience: "8 ans d'expérience",
      speciality: "Marketing & Communication",
      description: "Spécialisée en marketing digital et communication, Laila développe les stratégies de visibilité pour nos propriétés exclusives.",
      achievements: ["Campagnes digitales innovantes", "Photographie immobilière", "Réseaux sociaux premium"]
    },
    {
      name: "Omar Fassi",
      role: "Conseiller Juridique",
      experience: "18 ans d'expérience",
      speciality: "Droit Immobilier",
      description: "Avocat spécialisé en droit immobilier, Omar sécurise toutes nos transactions et accompagne nos clients dans les aspects juridiques.",
      achievements: ["Expert en droit des biens", "Transactions internationales", "Conseil fiscal immobilier"]
    },
    {
      name: "Nadia Chraibi",
      role: "Gestionnaire de Patrimoine",
      experience: "10 ans d'expérience",
      speciality: "Gestion & Investissement",
      description: "Spécialiste en gestion de patrimoine immobilier, Nadia conseille nos clients sur l'optimisation de leurs investissements.",
      achievements: ["Gestion de portefeuilles premium", "Stratégies d'investissement", "Optimisation fiscale"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-cream/50 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-deep-blue font-lora text-sm font-bold">À Propos de Nous</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Orchid <span className="luxury-gradient bg-clip-text text-transparent">Island</span>
          </h1>
          <p className="font-lora text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Votre partenaire de confiance dans l'immobilier de prestige au Maroc. 
            Depuis plus de 15 ans, nous accompagnons nos clients dans leurs projets 
            immobiliers les plus ambitieux.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 shadow-elegant hover:shadow-luxury transition-luxury border-0">
              <CardContent className="p-0">
                <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="font-lora text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="font-lora text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-6">
              Notre <span className="luxury-gradient bg-clip-text text-transparent">Histoire</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground mb-6">
              Fondée en 2008, Orchid Island est née de la vision de créer une agence immobilière 
              différente, centrée sur l'excellence du service et la satisfaction client. 
              Nous nous spécialisons dans l'immobilier haut de gamme à travers le Maroc.
            </p>
            <p className="font-lora text-lg text-muted-foreground mb-8">
              Notre équipe d'experts passionnés vous accompagne dans chaque étape de votre 
              projet immobilier, que ce soit pour l'achat, la vente ou l'investissement 
              dans des propriétés d'exception.
            </p>
            <div className="space-y-3">
              {[
                "Expertise reconnue dans l'immobilier de luxe",
                "Réseau étendu de partenaires de confiance",
                "Service personnalisé et accompagnement complet",
                "Connaissance approfondie du marché marocain"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-lora text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-cream to-light-gray rounded-lg shadow-elegant"></div>
            <div className="absolute inset-0 bg-luxury-gold/10 rounded-lg"></div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos <span className="luxury-gradient bg-clip-text text-transparent">Valeurs</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre action quotidienne et notre engagement envers nos clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 shadow-elegant hover:shadow-luxury transition-luxury border-0">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-deep-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-ivory-white" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="font-lora text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre <span className="luxury-gradient bg-clip-text text-transparent">Équipe</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              Des professionnels expérimentés et passionnés, dédiés à votre réussite immobilière.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 shadow-elegant hover:shadow-luxury transition-luxury border-0">
                <CardContent className="p-0">
                  <div className="w-24 h-24 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <Badge className=" bg-deep-blue text-ivory-white font-lora mb-3">
                    {member.role}
                  </Badge>
                  <p className="font-lora text-muted-foreground text-sm mb-2">
                    {member.experience}
                  </p>
                  <p className="font-lora text-primary text-sm font-medium">
                    {member.speciality}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <Card className="p-8 shadow-elegant border-0">
            <CardContent className="p-0">
              <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
                Notre Mission
              </h3>
              <p className="font-lora text-muted-foreground">
                Accompagner nos clients dans la réalisation de leurs projets immobiliers
                en offrant un service d'excellence, des conseils avisés et un accompagnement
                personnalisé. Nous nous engageons à créer de la valeur durable pour nos clients
                et partenaires.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 shadow-elegant border-0">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-deep-blue rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-ivory-white" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
                Notre Vision
              </h3>
              <p className="font-lora text-muted-foreground">
                Devenir la référence incontournable de l'immobilier de prestige au Maroc,
                reconnue pour notre expertise, notre intégrité et notre capacité d'innovation.
                Nous aspirons à transformer l'expérience immobilière de nos clients.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marrakech Map Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre Présence à <span className="luxury-gradient bg-clip-text text-transparent">Marrakech</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos zones d'expertise dans la perle du Sud et nos propriétés exclusives
              dans les quartiers les plus prestigieux de Marrakech.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map Container */}
            <div className="relative">
              <Card className="overflow-hidden shadow-luxury border-0">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gradient-to-br from-warm-brown/20 to-luxury-gold/20">
                    {/* Map Placeholder with Marrakech landmarks */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                          Carte Interactive Marrakech
                        </h3>
                        <p className="font-lora text-muted-foreground text-sm">
                          Zones de prestige et propriétés exclusives
                        </p>
                      </div>
                    </div>

                    {/* Location Markers */}
                    <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 luxury-gradient rounded-full animate-pulse"></div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-lora text-foreground whitespace-nowrap">
                        Palmeraie
                      </span>
                    </div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 luxury-gradient rounded-full animate-pulse"></div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-lora text-foreground whitespace-nowrap">
                        Hivernage
                      </span>
                    </div>

                    <div className="absolute top-3/4 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 luxury-gradient rounded-full animate-pulse"></div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-lora text-foreground whitespace-nowrap">
                        Gueliz
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Marrakech Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
                  Marrakech - Perle du Sud
                </h3>
                <p className="font-lora text-muted-foreground mb-6">
                  Marrakech représente l'un de nos marchés les plus dynamiques avec plus de 420 propriétés
                  de prestige dans notre portefeuille. Notre expertise locale nous permet d'offrir
                  les meilleures opportunités d'investissement.
                </p>
              </div>

              {/* Marrakech Districts */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Palmeraie</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Villas de luxe avec piscines privées et jardins paysagers. Prix moyen: 8-25M DH
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Hivernage</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Quartier moderne avec appartements haut de gamme et riads rénovés. Prix moyen: 3-12M DH
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Gueliz</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Centre-ville moderne avec penthouses et bureaux premium. Prix moyen: 2-8M DH
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info for Marrakech */}
              <Card className="p-6 bg-deep-blue text-ivory-white">
                <CardContent className="p-0">
                  <h4 className="font-playfair text-lg font-semibold mb-4">
                    Bureau Marrakech
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="font-lora text-sm">
                        Avenue Mohammed VI, Résidence Al Manar, Gueliz
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="font-lora text-sm">+212 524 43 21 87</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="font-lora text-sm">marrakech@orchidisland.ma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-cream/30 to-light-gray/30 rounded-2xl p-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à Commencer Votre <span className="luxury-gradient bg-clip-text text-transparent">Projet</span> ?
          </h2>
          <p className="font-lora text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contactez notre équipe d'experts pour une consultation personnalisée
            et découvrez comment nous pouvons vous aider à concrétiser vos ambitions immobilières.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/contact" className=" bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury">
                                    <button className="font-lora text-lg px-10  h-auto font-bold text-center">Nous Contacter</button> 
                                   </Link>
                                    <Link to="/properties">
            <Button variant="elegant" size="lg" className="font-lora text-lg px-10 py-6 h-auto font-bold">
              Voir Nos Propriétés
            </Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

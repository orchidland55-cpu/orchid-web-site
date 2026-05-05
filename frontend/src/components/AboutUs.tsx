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
    { number: "15+", label: "Years of experience", icon: Clock },
    { number: "1,200+", label: "Properties sold", icon: Building },
    { number: "98%", label: "Satisfied clients", icon: Star },
    { number: "85+", label: "Trusted partners", icon: Users },
  ];

  const services = [
    {
      title: "Luxury Property Sales",
      description: "Complete support in selling villas, penthouses and exceptional properties",
      features: ["Professional valuation", "High-end marketing", "Expert negotiation"]
    },
    {
      title: "Purchase and Investment",
      description: "Personalized advice for acquiring prestige real estate",
      features: ["Targeted search", "Market analysis", "Complete due diligence"]
    },
    {
      title: "Premium Rental Management",
      description: "Rental management service for high-end property owners",
      features: ["Tenant selection", "Premium maintenance", "Detailed reporting"]
    },
    {
      title: "Investment Consulting",
      description: "Real estate investment expertise and portfolio optimization",
      features: ["Investment strategy", "ROI analysis", "Portfolio diversification"]
    }
  ];

  // const locations = [
  //   {
  //     city: "Casablanca",
  //     description: "Economic center of Morocco",
  //     properties: "350+ properties",
  //     specialties: ["Marina", "Anfa", "Racine"]
  //   },
  //   {
  //     city: "Rabat",
  //     description: "Administrative capital",
  //     properties: "280+ properties",
  //     specialties: ["Souissi", "Hay Riad", "Agdal"]
  //   },
  //   {
  //     city: "Marrakech",
  //     description: "Pearl of the South",
  //     properties: "420+ properties",
  //     specialties: ["Palmeraie", "Hivernage", "Gueliz"]
  //   },
  //   {
  //     city: "Tangier",
  //     description: "Gateway to Europe",
  //     properties: "150+ properties",
  //     specialties: ["Marina Bay", "Malabata", "California"]
  //   }
  // ];

  const values = [
    {
      icon: Shield,
      title: "Trust",
      description: "We build lasting relationships based on transparency and integrity."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every transaction and service we offer."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our passion for real estate drives us to exceed your expectations."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We use the latest technologies to optimize your experience."
    }
  ];

  const team = [
    {
      name: "Ahmed Benali",
      role: "CEO & Founder",
      experience: "20 years of experience",
      speciality: "Luxury real estate",
      description: "Graduate of Casablanca Business School, Ahmed founded Orchid Island with the vision of revolutionizing the prestige real estate market in Morocco.",
      achievements: ["500+ completed transactions", "Complex negotiation expert", "International network"]
    },
    {
      name: "Fatima Alaoui",
      role: "Sales Director",
      experience: "15 years of experience",
      speciality: "Negotiation & Sales",
      description: "Expert in client relations and commercial strategies, Fatima oversees all sales activities and ensures client satisfaction.",
      achievements: ["98% satisfaction rate", "Advanced negotiation training", "International clientele specialist"]
    },
    {
      name: "Youssef Tazi",
      role: "Senior Real Estate Expert",
      experience: "12 years of experience",
      speciality: "Valuation & Consulting",
      description: "Architect by training, Youssef brings his technical expertise to the evaluation and analysis of prestige properties.",
      achievements: ["Certified real estate appraiser", "Luxury architecture expert", "Investment consulting"]
    },
    {
      name: "Laila Benjelloun",
      role: "Digital Marketing Manager",
      experience: "8 years of experience",
      speciality: "Marketing & Communication",
      description: "Specialized in digital marketing and communication, Laila develops visibility strategies for our exclusive properties.",
      achievements: ["Innovative digital campaigns", "Real estate photography", "Premium social media"]
    },
    {
      name: "Omar Fassi",
      role: "Legal Advisor",
      experience: "18 years of experience",
      speciality: "Real Estate Law",
      description: "Lawyer specialized in real estate law, Omar secures all our transactions and assists our clients with legal aspects.",
      achievements: ["Property law expert", "International transactions", "Real estate tax consulting"]
    },
    {
      name: "Nadia Chraibi",
      role: "Wealth Manager",
      experience: "10 years of experience",
      speciality: "Management & Investment",
      description: "Real estate wealth management specialist, Nadia advises our clients on optimizing their investments.",
      achievements: ["Premium portfolio management", "Investment strategies", "Tax optimization"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-cream/50 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-deep-blue font-lora text-sm font-bold">About Us</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Orchid <span className="luxury-gradient bg-clip-text text-transparent">Island</span>
          </h1>
          <p className="font-lora text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your trusted partner in prestige real estate in Morocco.
            For over 15 years, we have been supporting our clients in their
            most ambitious real estate projects.
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
      Our <span className="luxury-gradient bg-clip-text text-transparent">Story</span>
    </h2>
    <p className="font-lora text-lg text-muted-foreground mb-6">
      Founded in 2008, Orchid Island was born from the vision of creating a different
      real estate agency, focused on service excellence and client satisfaction.
      We specialize in high-end real estate throughout Morocco.
    </p>
    <p className="font-lora text-lg text-muted-foreground mb-8">
      Our team of passionate experts accompanies you through every step of your
      real estate project, whether for purchasing, selling, or investing
      in exceptional properties.
    </p>
    <div className="space-y-3">
      {[
        "Recognized expertise in luxury real estate",
        "Extensive network of trusted partners",
        "Personalized service and complete support",
        "In-depth knowledge of the Moroccan market"
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="font-lora text-muted-foreground">{item}</span>
        </div>
      ))}
    </div>
  </div>
  <div className="relative">
    <div className="w-full h-96 bg-gradient-to-br from-cream to-light-gray rounded-lg shadow-elegant overflow-hidden">
      <img 
        src="https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289706/orchid1_pwgnej.jpg" 
        alt="Orchid Island Real Estate" 
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div className="absolute inset-0 bg-luxury-gold/10 rounded-lg"></div>
  </div>
</div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="luxury-gradient bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our daily action and our commitment to our clients.
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
              Our <span className="luxury-gradient bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced and passionate professionals, dedicated to your real estate success.
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
                Our Mission
              </h3>
              <p className="font-lora text-muted-foreground">
                To support our clients in realizing their real estate projects
                by offering excellent service, sound advice and personalized support.
                We are committed to creating lasting value for our clients
                and partners.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 shadow-elegant border-0">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-deep-blue rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-ivory-white" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="font-lora text-muted-foreground">
                To become the undisputed reference in prestige real estate in Morocco,
                recognized for our expertise, integrity and capacity for innovation.
                We aspire to transform our clients' real estate experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marrakech Map Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Presence in <span className="luxury-gradient bg-clip-text text-transparent">Marrakech</span>
            </h2>
            <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our areas of expertise in the Pearl of the South and our exclusive properties
              in Marrakech's most prestigious neighborhoods.
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
                          Interactive Marrakech Map
                        </h3>
                        <p className="font-lora text-muted-foreground text-sm">
                          Prestige zones and exclusive properties
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
                  Marrakech - Pearl of the South
                </h3>
                <p className="font-lora text-muted-foreground mb-6">
                  Marrakech represents one of our most dynamic markets with over 420 prestige
                  properties in our portfolio. Our local expertise allows us to offer
                  the best investment opportunities.
                </p>
              </div>

              {/* Marrakech Districts */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Palmeraie</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Luxury villas with private pools and landscaped gardens. Average price: 8-25M DH
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Hivernage</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Modern district with high-end apartments and renovated riads. Average price: 3-12M DH
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-cream/30 rounded-lg">
                  <div className="w-3 h-3 luxury-gradient rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-1">Gueliz</h4>
                    <p className="font-lora text-sm text-muted-foreground">
                      Modern city center with penthouses and premium offices. Average price: 2-8M DH
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info for Marrakech */}
              <Card className="p-6 bg-deep-blue text-ivory-white">
                <CardContent className="p-0">
                  <h4 className="font-playfair text-lg font-semibold mb-4">
                    Marrakech Office
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
        {/* Association Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
               Our Commitment to <span className="luxury-gradient bg-clip-text text-transparent">Community</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289701/association_nark1e.jpg"
                alt="Community association"
                className="w-full h-80 object-cover rounded-lg shadow-luxury"
              />
              <div className="absolute inset-0 luxury-gradient opacity-20 rounded-lg"></div>
            </div>

            <div>
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-6">
                Supporting Local Communities
              </h3>
              <p className="font-lora text-lg text-muted-foreground mb-6">
                At Orchid Island, we firmly believe in sustainable development and supporting
                local communities. Our commitment goes beyond real estate to create
                a positive impact in Moroccan society.
              </p>
              <p className="font-lora text-muted-foreground mb-8">
                Discover how we collaborate with local associations to improve
                community life and contribute to Morocco's social development.
              </p>
              <Link to="/Scr">
                <Button variant="elegant" size="lg" className="font-lora text-lg px-8 py-3 h-auto font-semibold">
                  Discover Our Commitment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-cream/30 to-light-gray/30 rounded-2xl p-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your <span className="luxury-gradient bg-clip-text text-transparent">Project</span> ?
          </h2>
          <p className="font-lora text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our team of experts for a personalized consultation
            and discover how we can help you realize your real estate ambitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/contact" className=" bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury">
                                     <button className="font-lora text-lg px-8  py-3 h-auto  h- font-bold text-center">Contact Us</button>
                                    </Link>
                                     <Link to="/properties">
            <Button variant="elegant" size="lg" className="font-lora text-lg px-10 py-6 h-auto font-bold">
              View Our Properties
            </Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
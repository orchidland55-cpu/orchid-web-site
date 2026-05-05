import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, ArrowRight, CheckCircle, Star, TrendingUp, Users, Globe, Utensils, Music, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: Hotel,    label: "Luxury Hotels",          desc: "5-star and boutique hotel acquisitions, repositioning & development" },
  { icon: Utensils, label: "Premium Restaurants",    desc: "High-end F&B concepts, flagship dining & culinary destination brands" },
  { icon: Waves,    label: "Beach Clubs & Resorts",  desc: "Exclusive coastal destinations with premium membership models" },
  { icon: Music,    label: "Nightlife Venues",        desc: "Iconic nightlife assets generating diversified revenue streams" },
];

const expertise = [
  "Hotel acquisition, repositioning & full-cycle asset management",
  "Branding, concept creation & lifestyle destination development",
  "Operational strategy & guest experience design",
  "Revenue optimization & yield management frameworks",
  "Feasibility studies, market positioning & competitive analysis",
  "Cross-border hospitality investment structuring",
];

const whyUs = [
  { title: "End-to-End Advisory", desc: "From site selection to opening day, we manage every phase of your hospitality project." },
  { title: "Brand & Concept Creation", desc: "We craft distinctive identities that resonate with luxury travelers and drive repeat footfall." },
  { title: "Investment Structuring", desc: "Optimized capital stacks combining equity, debt, and institutional co-investment." },
  { title: "Global Network", desc: "Access to our curated network of operators, brands, designers, and investors across EMEA." },
];

const HospitalityService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Hotel className="w-4 h-4 mr-2" />
              Hospitality Advisory
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Luxury Hospitality
              <span className="luxury-gradient bg-clip-text text-transparent"> Investment & Advisory</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We develop and invest in world-class hospitality assets — from iconic 5-star hotels and
              premium restaurants to exclusive beach clubs and vibrant nightlife venues — across Africa,
              the Middle East, and Europe.
            </p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="luxury" size="lg" asChild>
              <Link to="/contact">Request Investment Brief <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
            <Button variant="elegant" size="lg" asChild>
              <Link to="/services">All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
                <Star className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Beyond Real Estate — We Create Destinations
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                At Orchid Island, our hospitality advisory goes far beyond property transactions. We
                specialize in <strong className="text-foreground">hospitality investment and asset
                development</strong>, seamlessly integrating real estate, brand strategy, operational
                excellence, and guest experience design into a single, results-driven approach.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Whether you are developing a <strong className="text-foreground">luxury hotel in
                Marrakech</strong>, a high-end restaurant concept in Dubai, or an exclusive beach club
                on the Mediterranean coast, we bring institutional rigor and creative vision to every
                project — transforming assets into lifestyle-driven destinations that command premium
                valuations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our track record spans <strong className="text-foreground">hotels, premium dining
                concepts, beach clubs, and nightlife venues</strong> across EMEA, delivering strong brand
                identity, diversified revenue streams, and long-term asset value appreciation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {highlights.map((h, i) => (
                <Card key={i} className="hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                      <h.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1 text-sm">{h.label}</h4>
                    <p className="text-xs text-muted-foreground">{h.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-cream/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              Expertise
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Full-Spectrum Hospitality Expertise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From feasibility to operations, our hospitality team covers every critical dimension of
              luxury asset development and investment management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {expertise.map((item, i) => (
              <div key={i} className="flex items-start space-x-3 bg-background rounded-xl p-5 hover:shadow-luxury transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Orchid Island */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Why Orchid Island
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Orchid Island Advantage in Hospitality
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <Card key={i} className="text-center hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream/30">
        <div className="container mx-auto px-6 text-center max-w-2xl mx-auto">
          <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" />
            Start a Conversation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Invest in World-Class Hospitality?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Partner with Orchid Island to develop, acquire, or reposition premium hospitality assets
            across Africa, the Middle East, and Europe.
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link to="/contact">
              Request Investment Brief <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
    </PageTransition>
  </div>
);

export default HospitalityService;
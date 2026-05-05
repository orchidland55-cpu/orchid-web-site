import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight, CheckCircle, TrendingUp, Users, Globe, Store, Building2, LayoutGrid, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: Store,      label: "Commercial Centers",     desc: "Flagship retail destinations and high-footfall shopping complexes" },
  { icon: LayoutGrid, label: "Mixed-Use Developments", desc: "Integrated retail, residential and office assets maximizing yield" },
  { icon: Building2,  label: "Private Projects",       desc: "Bespoke retail real estate for brands, developers and family offices" },
  { icon: MapPin,     label: "Strategic Locations",    desc: "Prime urban and suburban positioning across EMEA growth markets" },
];

const expertise = [
  "Retail real estate acquisition, repositioning & asset management",
  "Commercial center development and leasing strategy",
  "Mixed-use project structuring and capital optimization",
  "Tenant mix analysis and anchor brand negotiation",
  "Market entry advisory for international retail brands",
  "Valuation, risk assessment & retail yield optimization",
];

const whyUs = [
  { title: "Market Intelligence", desc: "Deep understanding of consumer trends, retail footfall dynamics and demand drivers across EMEA." },
  { title: "Development Expertise", desc: "End-to-end project delivery from land sourcing and permitting to construction oversight and leasing." },
  { title: "Capital Structuring", desc: "We design optimized financial structures for retail assets, attracting institutional and private capital." },
  { title: "Brand Network", desc: "Established relationships with international luxury and mid-market brands seeking EMEA expansion." },
];

const RetailService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Retail
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Retail & Mixed-Use
              <span className="luxury-gradient bg-clip-text text-transparent"> Real Estate Investment</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orchid Island invests in and develops high-performance retail real estate — commercial
              centers, mixed-use developments, and bespoke private projects — across Africa, the
              Middle East, and Europe, delivering strong yields and long-term capital appreciation.
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
                <ShoppingBag className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Unlocking Value in Retail & Mixed-Use Real Estate
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Retail real estate remains one of the most dynamic segments of the commercial property
                market, evolving rapidly as consumer behaviors shift and urban mixed-use concepts redefine
                how people live, work, and shop. At Orchid Island, we identify and execute{" "}
                <strong className="text-foreground">high-value retail and mixed-use real estate
                investments</strong> in markets where growing middle classes, tourism flows, and urban
                densification are driving sustained demand for quality retail space.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our retail investment strategy encompasses{" "}
                <strong className="text-foreground">flagship commercial centers, mixed-use
                developments combining retail, office and residential uses</strong>, as well as bespoke
                private projects for family offices, developers, and international brands entering new
                markets. We approach every asset with a value-creation mindset — optimizing tenant mix,
                repositioning underperforming assets, and structuring capital efficiently to enhance
                returns.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Across Morocco, West Africa, the Gulf and Southern Europe, our team leverages{" "}
                <strong className="text-foreground">deep market intelligence, institutional networks,
                and operational expertise</strong> to deliver retail real estate investments that
                generate resilient income and sustainable long-term growth.
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
              Full-Cycle Retail Real Estate Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From deal origination and development to leasing strategy and exit, we manage every
              dimension of the retail real estate investment lifecycle with precision.
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

      {/* Why */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Why Orchid Island
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Orchid Island Edge in Retail
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
            Invest in High-Performance Retail Real Estate
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Partner with Orchid Island to acquire, develop, or reposition retail and mixed-use assets
            in Africa, the Middle East, and Europe's most dynamic markets.
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

export default RetailService;
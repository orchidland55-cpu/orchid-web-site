import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowRight, CheckCircle, TrendingUp, Users, Globe, MapPin, Package, Network, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: MapPin,    label: "Strategic Hubs",          desc: "Prime logistics parks positioned at key intermodal and trade corridors" },
  { icon: Network,   label: "Supply Chain Infra",      desc: "Last-mile, cross-dock and fulfillment facilities for modern supply chains" },
  { icon: Package,   label: "E-Commerce Logistics",    desc: "Urban and peri-urban distribution assets serving e-commerce growth" },
  { icon: BarChart3, label: "Long-Lease Income",       desc: "Triple-net logistics assets generating stable, inflation-linked cash flows" },
];

const expertise = [
  "Logistics park and warehouse acquisition, development & management",
  "Strategic hub identification and intermodal infrastructure advisory",
  "Supply chain real estate structuring for institutional investors",
  "Last-mile and urban logistics asset origination",
  "Build-to-suit logistics facilities for e-commerce and FMCG operators",
  "Cross-border logistics portfolio management across EMEA",
];

const whyUs = [
  { title: "Strategic Positioning", desc: "We identify logistics assets at the intersection of trade routes, port access, and urban demand centers." },
  { title: "Occupier Intelligence", desc: "Access to leading logistics operators, 3PLs, and e-commerce platforms seeking long-term space across EMEA." },
  { title: "Structural Growth Play", desc: "Logistics real estate benefits from structural tailwinds including e-commerce penetration, near-shoring, and supply chain resilience." },
  { title: "Institutional Execution", desc: "Rigorous underwriting, ESG-aligned development standards, and transparent governance for every transaction." },
];

const LogisticsService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Truck className="w-4 h-4 mr-2" />
              Logistics
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Logistics Real Estate &
              <span className="luxury-gradient bg-clip-text text-transparent"> Supply Chain Infrastructure</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orchid Island invests in and develops strategic logistics hubs, warehousing platforms, and
              supply chain infrastructure assets across Africa, the Middle East, and Europe — capturing
              the structural growth of global trade and e-commerce.
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
                <Truck className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Capturing the Logistics Investment Opportunity Across EMEA
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Logistics real estate has become one of the most sought-after asset classes among
                institutional investors globally, driven by the accelerating growth of e-commerce,
                the restructuring of global supply chains, and the near-shoring of manufacturing
                activity. At Orchid Island, we identify and execute{" "}
                <strong className="text-foreground">high-value logistics and supply chain
                infrastructure investments</strong> — from large-scale distribution parks and
                intermodal hubs to last-mile urban logistics assets — in markets positioned to
                benefit from these macro tailwinds.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our logistics investment strategy is anchored in{" "}
                <strong className="text-foreground">strategic location intelligence</strong>:
                we target assets positioned at key trade corridors, port proximities, and urban
                demand centers where occupier demand is structural and vacancy is constrained.
                By combining real estate expertise with supply chain sector knowledge, we deliver
                investments offering <strong className="text-foreground">resilient long-term
                income, capital appreciation, and portfolio diversification</strong>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Across Morocco, West Africa, the Gulf, and Southern Europe, our team leverages
                regional market knowledge and occupier networks to{" "}
                <strong className="text-foreground">originate build-to-suit, value-add and
                core logistics transactions</strong> that generate stable triple-net income
                and superior risk-adjusted returns.
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
              End-to-End Logistics Real Estate Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From site selection and development to leasing, asset management, and exit,
              we manage the full investment lifecycle of logistics and supply chain assets.
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
              The Orchid Island Edge in Logistics
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
            Invest in Strategic Logistics Infrastructure with Orchid Island
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Partner with Orchid Island to access institutional-grade logistics and supply chain
            real estate opportunities across EMEA's most dynamic trade corridors.
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

export default LogisticsService;
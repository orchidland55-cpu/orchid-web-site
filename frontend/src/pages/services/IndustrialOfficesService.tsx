import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, ArrowRight, CheckCircle, TrendingUp, Users, Globe, Building2, Briefcase, BarChart3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: Building2,  label: "Grade-A Office Towers",    desc: "Institutional-grade corporate campuses and CBD office assets" },
  { icon: Factory,    label: "Industrial Platforms",      desc: "Modern light and heavy industrial facilities in strategic locations" },
  { icon: Briefcase,  label: "Corporate Real Estate",     desc: "Sale-leaseback, build-to-suit and corporate occupier advisory" },
  { icon: BarChart3,  label: "Portfolio Optimization",    desc: "Asset management and repositioning to enhance yields and valuations" },
];

const expertise = [
  "Grade-A office and corporate campus acquisition & development",
  "Industrial park origination, structuring and asset management",
  "Sale-leaseback transaction advisory for corporate occupiers",
  "Build-to-suit development for institutional tenants",
  "ESG-aligned refurbishment and energy efficiency programs",
  "Cross-border industrial and office portfolio management",
];

const whyUs = [
  { title: "Institutional Standards", desc: "We apply global best practices in underwriting, ESG compliance, and governance to every industrial and office transaction." },
  { title: "Corporate Network", desc: "Strong relationships with multinational occupiers, public institutions, and sovereign entities seeking quality workspace." },
  { title: "Value-Add Strategy", desc: "We specialize in identifying repositioning opportunities in industrial and office assets where active management unlocks significant upside." },
  { title: "Cross-Border Reach", desc: "Our EMEA coverage enables us to originate and execute industrial and office transactions across multiple regulatory and currency environments." },
];

const IndustrialOfficesService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Factory className="w-4 h-4 mr-2" />
              Industrial & Offices
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Institutional-Grade Industrial &
              <span className="luxury-gradient bg-clip-text text-transparent"> Office Real Estate</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orchid Island originates and manages high-quality industrial and office real estate
              investments across EMEA, delivering stable income, capital growth, and institutional-grade
              asset management for discerning investors.
            </p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="luxury" size="lg" asChild>
              <Link to="/contact-us">Request Investment Brief <ArrowRight className="w-5 h-5 ml-2" /></Link>
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
                <Factory className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Building Resilient Portfolios with Industrial & Office Assets
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Industrial and office real estate have consistently proven to be among the most
                resilient segments of institutional portfolios, offering predictable income streams,
                long-term lease structures, and capital appreciation driven by occupier demand and
                supply constraints. At Orchid Island, we originate and execute{" "}
                <strong className="text-foreground">institutional-grade industrial and office real
                estate investments</strong> — from Grade-A office towers and corporate campuses to
                modern industrial parks and logistics-adjacent manufacturing facilities.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                We apply a rigorous, intelligence-led investment process to identify assets where{" "}
                <strong className="text-foreground">value-add strategies, repositioning, or
                development</strong> can generate superior risk-adjusted returns. Our corporate real
                estate advisory capabilities — including sale-leaseback structuring and build-to-suit
                origination — enable us to serve both investors and occupiers, creating aligned
                transactions that benefit all parties.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our geographic focus spans <strong className="text-foreground">Morocco, West Africa,
                the Gulf, and Southern Europe</strong> — markets where rapid urbanization, infrastructure
                investment, and growing corporate demand are creating compelling entry points for
                industrial and office real estate investors.
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
              Comprehensive Industrial & Office Investment Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From deal origination to exit strategy, we cover every phase of the industrial and
              office investment lifecycle with institutional rigor and operational expertise.
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
              The Orchid Island Edge in Industrial & Offices
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
            Build Your Industrial & Office Portfolio with Orchid Island
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Let us originate, structure, and manage institutional-grade industrial and office real
            estate investments tailored to your risk profile and return objectives.
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link to="/contact-us">
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

export default IndustrialOfficesService;
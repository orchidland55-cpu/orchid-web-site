import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, CheckCircle, TrendingUp, Users, Globe, Building2, ShieldCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: Building2,  label: "Hospitals & Clinics",        desc: "Acquisition, development & repositioning of private healthcare facilities" },
  { icon: Activity,   label: "Integrated Medical Hubs",    desc: "Multi-specialty platforms combining diagnostics, surgery & wellness" },
  { icon: ShieldCheck,label: "Regulatory Structuring",     desc: "Full compliance with local and international healthcare investment frameworks" },
  { icon: TrendingUp, label: "Yield-Generating Assets",    desc: "Healthcare real estate offering stable, long-term income and capital growth" },
];

const expertise = [
  "Private hospital and clinic acquisition, development & repositioning",
  "Integrated medical platform strategy and structuring",
  "Healthcare real estate investment and asset management",
  "Joint ventures with international medical operators",
  "Regulatory compliance across MENA and European markets",
  "Financial modeling and healthcare-specific valuation frameworks",
];

const whyUs = [
  { title: "Sector Intelligence", desc: "In-depth knowledge of healthcare real estate dynamics across Africa, MENA, and Europe." },
  { title: "Institutional Structuring", desc: "We design investment vehicles adapted to the operational and regulatory complexity of healthcare assets." },
  { title: "Operator Network", desc: "Access to leading international healthcare groups and medical operators for strategic partnerships." },
  { title: "Long-Term Value", desc: "Healthcare assets provide resilient cash flows and inflation-protected returns." },
];

const HealthcareService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Healthcare
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Healthcare Real Estate
              <span className="luxury-gradient bg-clip-text text-transparent"> Investment & Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orchid Island invests in and develops high-performance healthcare real estate — hospitals,
              clinics, and integrated medical platforms — across Africa, the Middle East, and Europe,
              delivering resilient returns and lasting social impact.
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
                <Heart className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Investing in the Future of Healthcare Infrastructure
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Healthcare real estate represents one of the most resilient and fundamentally driven
                asset classes available to institutional and private investors. At Orchid Island, we
                identify, structure, and execute <strong className="text-foreground">high-value
                healthcare investments</strong> — from private hospitals and specialist clinics to
                integrated medical platforms that combine diagnostics, surgery, and wellness services.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our multidisciplinary team combines <strong className="text-foreground">real estate
                expertise, financial structuring, and deep sector knowledge</strong> to originate
                transactions that are both financially sound and operationally scalable. We work with
                leading international medical operators, private equity funds, and sovereign investors
                to develop healthcare ecosystems that meet growing regional demand.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From Morocco and West Africa to the Gulf and Southern Europe, our healthcare portfolio
                strategy targets markets with strong demographic fundamentals, rising healthcare
                expenditure, and <strong className="text-foreground">significant infrastructure gaps</strong>
                — precisely where institutional-grade investment creates the greatest value.
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
              End-to-End Healthcare Investment Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our healthcare real estate practice covers the full investment lifecycle — from market
              intelligence and deal sourcing to structuring, execution, and asset management.
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
              The Orchid Island Edge in Healthcare
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
            Invest in Healthcare Real Estate with Orchid Island
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Discover institutional-grade healthcare investment opportunities across Africa, the Middle
            East, and Europe. Our team is ready to structure the right vehicle for your capital.
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

export default HealthcareService;
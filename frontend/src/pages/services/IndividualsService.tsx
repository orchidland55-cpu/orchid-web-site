import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight, CheckCircle, TrendingUp, Users, Globe, Shield, Star, DollarSign, Key } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const highlights = [
  { icon: DollarSign, label: "Private Investments",     desc: "Exclusive access to off-market real estate and structured investment opportunities" },
  { icon: Shield,     label: "Wealth Structuring",      desc: "Tax-optimized legal structures, trusts and cross-border holding vehicles" },
  { icon: Key,        label: "Bespoke Real Estate",     desc: "Ultra-prime residential, trophy assets and lifestyle property acquisitions" },
  { icon: Star,       label: "White-Glove Advisory",    desc: "Dedicated advisory team for UHNWI, family offices and private investors" },
];

const expertise = [
  "Ultra-prime and luxury residential real estate acquisition",
  "Cross-border wealth structuring and asset protection",
  "Private investment portfolio construction and diversification",
  "Family office real estate strategy and co-investment access",
  "Residency and citizenship by investment advisory",
  "Bespoke transaction management and discretionary execution",
];

const whyUs = [
  { title: "Total Discretion", desc: "Every engagement is handled with absolute confidentiality and the highest standards of professional discretion." },
  { title: "Off-Market Access", desc: "Our proprietary network surfaces exclusive opportunities not available through conventional channels." },
  { title: "Holistic Advisory", desc: "We integrate real estate, financial structuring, and legal expertise to deliver truly comprehensive private wealth solutions." },
  { title: "Global Reach", desc: "From Marrakech and Casablanca to Madrid and Dubai, we execute across the most desirable markets worldwide." },
];

const IndividualsService = () => (
  <div className="min-h-screen">
    <PageTransition>
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Private Clients
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Private Wealth, Investment &
              <span className="luxury-gradient bg-clip-text text-transparent"> Bespoke Real Estate</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orchid Island delivers white-glove real estate and investment advisory to private
              individuals, family offices, and ultra-high-net-worth clients — combining discretion,
              expertise, and exclusive market access to protect and grow private wealth.
            </p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="luxury" size="lg" asChild>
              <Link to="/contact-us">Request a Private Consultation <ArrowRight className="w-5 h-5 ml-2" /></Link>
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
                <User className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Truly Personal Approach to Real Estate & Wealth
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                At Orchid Island, we understand that private clients require more than a transaction —
                they require a trusted partner who combines investment-grade expertise with absolute
                discretion and genuine personal service. Our private client practice is dedicated to
                serving <strong className="text-foreground">ultra-high-net-worth individuals (UHNWI),
                family offices, and private investors</strong> seeking to deploy capital into real
                estate and structured investment opportunities across EMEA.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                We offer exclusive access to <strong className="text-foreground">off-market luxury
                residential properties, prime commercial assets, and curated co-investment
                opportunities</strong> that are not available through conventional channels. From
                bespoke trophy property acquisitions in Marrakech, Casablanca, or the Costa del Sol,
                to cross-border wealth structuring and tax-optimized holding vehicles, we orchestrate
                every dimension of our clients' real estate and investment needs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you are a <strong className="text-foreground">private investor seeking yield,
                a family office diversifying into real assets, or a UHNWI acquiring a lifestyle
                property</strong>, our dedicated team ensures a seamless, confidential, and
                results-driven experience from first conversation to final execution.
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
              Comprehensive Private Client Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From luxury property acquisition and portfolio structuring to wealth protection and
              residency advisory, we offer a complete suite of services for private clients.
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
              The Orchid Island Private Client Advantage
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
            Private Consultation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your Real Estate. Your Legacy. Our Expertise.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Connect with our private client team for a confidential consultation. Whether you are
            looking to acquire, invest, structure, or protect — we are here to deliver.
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link to="/contact-us">
              Request a Private Consultation <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
    </PageTransition>
  </div>
);

export default IndividualsService;
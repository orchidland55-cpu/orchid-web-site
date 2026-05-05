import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  GitMerge,
  Layers,
  DollarSign,
  BarChart3,
  Hotel,
  ShieldCheck,
  Globe,
  ArrowRight,
  Briefcase,
  Heart,
  Server,
  ShoppingBag,
  Factory,
  Truck,
  User,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Building2,
    title: "Real Estate Services",
    description:
      "We originate and execute high-value real estate investments, with a focus on high-end and luxury properties across residential and commercial assets. Our expertise includes office spaces, retail centers, healthcare facilities, industrial projects, hospitality, and data centers, enabling diversified and resilient portfolios.",
    tags: ["Luxury Residential", "Commercial", "Hospitality", "Data Centers"],
  },
  {
    icon: TrendingUp,
    title: "Consulting",
    description:
      "Our consulting services support market entry, expansion, and strategic transformation. We advise on cross-border structuring, regulatory compliance, operational optimization, and business strategy, enabling clients to scale efficiently in complex environments.",
    tags: ["Market Entry", "Regulatory Compliance", "Strategy"],
  },
  {
    icon: GitMerge,
    title: "Mergers & Acquisitions",
    description:
      "We provide end-to-end advisory across buy-side and sell-side M&A transactions, including deal sourcing, valuation, negotiation, and execution. Our approach integrates financial, operational, and strategic due diligence.",
    tags: ["Buy-Side", "Sell-Side", "Due Diligence", "Valuation"],
  },
  {
    icon: Layers,
    title: "Investment Structuring",
    description:
      "We design tailored investment structures including joint ventures, private equity platforms, and institutional vehicles. Our solutions are engineered to optimize capital efficiency, governance, and risk allocation, while aligning stakeholders' interests.",
    tags: ["Joint Ventures", "Private Equity", "Institutional Vehicles"],
  },
  {
    icon: DollarSign,
    title: "Capital Raising",
    description:
      "We connect projects with global capital sources, including institutional investors, sovereign funds, family offices, and private equity firms. Through strategic positioning and targeted investor outreach, we secure efficient funding aligned with project objectives.",
    tags: ["Sovereign Funds", "Family Offices", "Private Equity"],
  },
  {
    icon: BarChart3,
    title: "Standard LBO & Innovative Financing",
    description:
      "We structure both traditional leveraged buyouts (LBOs) and innovative financing solutions tailored to complex transactions. By combining structured debt, mezzanine financing, and hybrid instruments, we create optimized capital stacks.",
    tags: ["LBO", "Mezzanine", "Structured Debt", "Hybrid Instruments"],
  },
  {
    icon: Hotel,
    title: "Hospitality Advisory",
    description:
      "We specialize in hospitality investment and asset development, covering hotels, restaurants, beach clubs, and nightlife concepts. Our approach goes beyond real estate by integrating branding, concept creation, operational strategy, and guest experience design.",
    tags: ["Hotels", "Restaurants", "Beach Clubs", "Lifestyle Destinations"],
  },
  {
    icon: ShieldCheck,
    title: "Value & Risk",
    description:
      "We provide advanced valuation and risk analysis, combining financial modeling with market intelligence to assess opportunities with precision. Our methodology identifies key value drivers, stress-tests assumptions, and anticipates potential risks.",
    tags: ["Financial Modeling", "Risk Analysis", "Market Intelligence"],
  },
  {
    icon: Globe,
    title: "Capital Flows",
    description:
      "We analyze and leverage global capital flows to strategically position assets and investment opportunities. By understanding liquidity trends, investor appetite, and macroeconomic dynamics, we align projects with the most relevant capital sources.",
    tags: ["Global Liquidity", "Macroeconomics", "Asset Positioning"],
  },
];

const industries = [
  { icon: Hotel,      label: "Hospitality",         description: "Hotels, restaurants, lifestyle destinations & nightlife assets" },
  { icon: Heart,      label: "Healthcare",           description: "Hospitals, clinics & integrated medical platforms" },
  { icon: Server,     label: "Data Centers",         description: "AI-driven & energy-linked infrastructure" },
  { icon: ShoppingBag,label: "Retail",               description: "Commercial centers, mixed-use & private developments" },
  { icon: Factory,    label: "Industrial & Offices", description: "Institutional-grade real estate & corporate assets" },
  { icon: Truck,      label: "Logistics",            description: "Strategic hubs & supply chain infrastructure" },
  { icon: User,       label: "Individuals",          description: "Private investments, wealth structuring & bespoke real estate" },
];

const pillars = [
  "Disciplined investment philosophy",
  "Market intelligence & financial structuring",
  "Operational expertise",
  "Strong returns & resilient cash flows",
  "Sustainable long-term growth",
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                What We Do
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Our
                <span className="luxury-gradient bg-clip-text text-transparent"> Services</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From high-value real estate investments to sophisticated capital structuring, we deliver
                institutional-grade solutions across Europe, the Middle East, and Africa.
              </p>
            </div>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="hover:shadow-luxury transition-all duration-300 flex flex-col"
                >
                  <CardContent className="p-8 flex flex-col flex-1">
                    {/* Icon */}
                    <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mb-5">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Industries We Serve ── */}
        <section className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
                <Factory className="w-4 h-4 mr-2" />
                Industries
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Industries We Serve
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We operate across high-growth and resilient sectors, identifying converging opportunities
                between real estate, technology, and capital markets.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="text-center hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <industry.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-foreground mb-2">{industry.label}</h4>
                    <p className="text-sm text-muted-foreground">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Investment Approach ── */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* Left */}
              <div>
                <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Investment Philosophy
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Investment Approach
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our investment philosophy is built on discipline, innovation, and long-term value creation.
                  We identify high-potential opportunities, structure them with optimized capital strategies,
                  and execute with institutional rigor.
                </p>
                <ul className="space-y-4">
                  {pillars.map((pillar, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — Global Presence card */}
              <Card className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-10">
                  <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Global Presence</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our activities span <strong className="text-foreground">Europe</strong>,{" "}
                    <strong className="text-foreground">the Middle East</strong>, and{" "}
                    <strong className="text-foreground">Africa</strong>, allowing us to connect global capital
                    with high-potential regional opportunities. We operate across both mature and emerging markets,
                    offering strategic access, local insight, and seamless cross-border execution.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Marrakech", "Madrid", "Dubai"].map((city) => (
                      <Badge key={city} variant="secondary" className="text-sm px-4 py-1">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                Investor Inquiry
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Partner With Us?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Partner with us to unlock new opportunities, structure smarter investments, and accelerate
                your growth on a global scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="luxury" size="lg" asChild>
                  <Link to="/contact">
                    Request Investment Brief
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="elegant" size="lg" asChild>
                  <Link to="/properties">
                    View Properties
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
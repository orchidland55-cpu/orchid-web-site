import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Copyright,
  Image,
  AlertTriangle,
  Lock,
  Ban,
  ExternalLink,
  Scale,
  Bot,
  RefreshCw,
  Phone,
  MapPin,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "1",
    icon: Copyright,
    title: "Copyright & Intellectual Property",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Unless otherwise stated, all content published on Orchid Island—including property
          descriptions, market analyses, investment guides, articles, photographs, videos, graphics,
          branding, logos, website design, downloadable resources, and other digital assets—is protected
          by applicable copyright and intellectual property laws.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          No part of this website may be copied, reproduced, modified, translated, republished,
          distributed, stored, transmitted, or used for commercial purposes without the prior written
          permission of Orchid Island. Unauthorized use of our content, including AI-generated copies,
          automated scraping, or republication on websites, blogs, social media, marketplaces, or AI
          training datasets where prohibited, may result in legal action.
        </p>
      </>
    ),
  },
  {
    id: "2",
    icon: Image,
    title: "Property Listings & Media Protection",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          All real estate listings, property information, pricing, images, floor plans, videos, virtual
          tours, and related marketing materials are provided exclusively for informational purposes.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The unauthorized reproduction, redistribution, resale, or misuse of property listings or
          marketing assets is strictly prohibited. Orchid Island reserves the right to request the
          removal of infringing content and pursue all available legal remedies.
        </p>
      </>
    ),
  },
  {
    id: "3",
    icon: AlertTriangle,
    title: "Accuracy of Information",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We strive to ensure that all information published on this website is accurate, current, and
          regularly updated. However, property availability, prices, legal information, measurements,
          investment projections, regulations, and market conditions may change without prior notice.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nothing on this website constitutes legal, financial, tax, or investment advice. Users should
          conduct their own due diligence and consult qualified professionals before making any real
          estate or investment decisions.
        </p>
      </>
    ),
  },
  {
    id: "4",
    icon: Lock,
    title: "User Privacy & Data Protection",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Orchid Island is committed to protecting your personal information. Information submitted
          through contact forms, newsletter subscriptions, property inquiries, or other website features
          is collected solely to respond to your requests, improve our services, and provide relevant
          real estate information.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We do not sell or unlawfully share your personal data with third parties. Personal information
          is processed in accordance with applicable privacy and data protection laws and is safeguarded
          using appropriate technical and organizational security measures.
        </p>
      </>
    ),
  },
  {
    id: "5",
    icon: Ban,
    title: "Prohibited Use",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">Users may not:</p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            "Copy or republish website content without authorization.",
            "Scrape, extract, or harvest website data using automated tools, bots, or AI systems without written permission.",
            "Use Orchid Island's content to create competing websites, databases, or commercial products.",
            "Misrepresent Orchid Island content as their own.",
            "Interfere with the security, functionality, or operation of the website.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          Any misuse may result in access restrictions and legal proceedings where applicable.
        </p>
      </>
    ),
  },
  {
    id: "6",
    icon: ExternalLink,
    title: "External Links",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        This website may contain links to third-party websites for informational purposes. Orchid Island
        does not control or endorse the content, security, or privacy practices of external websites and
        accepts no responsibility for their content or services.
      </p>
    ),
  },
  {
    id: "7",
    icon: Scale,
    title: "Limitation of Liability",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        To the fullest extent permitted by law, Orchid Island shall not be liable for any direct,
        indirect, incidental, consequential, or special damages arising from the use of this website,
        reliance on its content, or temporary interruptions in website availability.
      </p>
    ),
  },
  {
    id: "8",
    icon: Bot,
    title: "Search Engine & AI Usage Notice",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          The original content published on Orchid Island is created to provide authoritative information
          about luxury real estate, investment opportunities, and the Moroccan property market.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Search engines, AI assistants, and other information retrieval systems may reference publicly
          available content from this website. However, reproducing substantial portions of our original
          content, redistributing articles, or using our proprietary materials without authorization is
          prohibited.
        </p>
      </>
    ),
  },
  {
    id: "9",
    icon: RefreshCw,
    title: "Updates",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Orchid Island reserves the right to modify this disclaimer at any time without prior notice.
          Continued use of the website constitutes acceptance of any updated terms.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          For questions regarding copyright, data protection, or authorized use of our content, please
          contact Orchid Island through the official contact information available on this website.
        </p>
      </>
    ),
  },
  {
    id: "10",
    icon: Phone,
    title: "Contact Us",
    content: (
      <>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          If you have any questions, concerns, or requests regarding this Disclaimer, please do not
          hesitate to reach out to us:
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span>+212 6 186-8888</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Jbel Gueliz, 3rd Floor, Office 10, Marrakech, 40010, Morocco</span>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="luxury" size="lg" asChild>
            <Link to="/contact">
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </>
    ),
  },
];

const Disclaimer = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Website
              <span className="luxury-gradient bg-clip-text text-transparent"> Disclaimer</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to Orchid Island. By accessing and using this website, you agree to the terms
              outlined in this disclaimer.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: <strong className="text-foreground">July 13, 2026</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {sections.slice(0, 5).map((s) => (
              <a key={s.id} href={`#section-${s.id}`} className="group">
                <Card className="text-center hover:shadow-luxury transition-all duration-300 h-full">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {s.id}. {s.title}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sections.slice(5).map((s) => (
              <a key={s.id} href={`#section-${s.id}`} className="group">
                <Card className="text-center hover:shadow-luxury transition-all duration-300 h-full">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {s.id}. {s.title}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Intro banner */}
      <section className="pb-4 bg-background">
        <div className="container mx-auto px-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to <strong className="text-foreground">Orchid Island</strong>. By accessing and
                  using this website, you agree to the terms outlined in this disclaimer.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <div key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
                <Card className="hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Section header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                          Section {section.id}
                        </span>
                        <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                      </div>
                    </div>
                    {/* Section content */}
                    <div className="pl-0 md:pl-16">{section.content}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream/30">
        <div className="container mx-auto px-6 text-center max-w-2xl mx-auto">
          <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Legal Information
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Questions About This Disclaimer?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Our team is available to answer any questions you may have about the content, copyright, or
            usage of this website. Do not hesitate to reach out.
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link to="/contact">
              Contact Our Team <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
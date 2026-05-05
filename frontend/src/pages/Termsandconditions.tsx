import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  Globe,
  Building2,
  Link2,
  ShieldOff,
  AlertTriangle,
  Umbrella,
  Scale,
  RefreshCw,
  XCircle,
  Phone,
  MapPin,
  ArrowRight,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "1",
    icon: CheckCircle,
    title: "Acceptance of Terms",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          By using this website, you confirm that:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            "You are at least 18 years old or have the legal capacity to enter into a binding agreement.",
            "You will use the website and services in accordance with these Terms and all applicable laws.",
            "If you are using the website on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "2",
    icon: Globe,
    title: "Use of the Website",
    content: (
      <>
        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-foreground mb-3">2.1 — Permitted Use</h4>
            <p className="text-muted-foreground text-sm mb-3">
              You may use our website for lawful purposes only. Specifically, you agree to:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                "Not engage in any activity that disrupts or damages the website or its functionality.",
                "Not use the website to commit fraud, violate intellectual property rights, or infringe on any third-party rights.",
                "Provide accurate and complete information when submitting forms or inquiries.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">2.2 — Prohibited Activities</h4>
            <p className="text-muted-foreground text-sm mb-3">You agree not to:</p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                "Attempt to gain unauthorized access to our systems or user accounts.",
                "Post or transmit harmful content, including viruses, malware, or illegal material.",
                "Engage in spamming, phishing, or other unethical practices.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "3",
    icon: ScrollText,
    title: "Intellectual Property",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          All content on this website, including text, images, graphics, logos, videos, and software,
          is the property of <strong className="text-foreground">Orchid Island Real Estate</strong> or
          its licensors and is protected by intellectual property laws.
        </p>
        <p className="text-muted-foreground text-sm mb-3">You may not:</p>
        <ul className="space-y-2 text-muted-foreground text-sm">
          {[
            "Reproduce, distribute, or modify any content without prior written permission.",
            "Use our trademarks, logos, or branding without explicit consent.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          Any unauthorized use of the website or its content may result in legal action.
        </p>
      </>
    ),
  },
  {
    id: "4",
    icon: Building2,
    title: "Real Estate Services",
    content: (
      <>
        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-foreground mb-3">4.1 — Listings and Information</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                "All property listings and descriptions on our website are provided for informational purposes only. While we strive to ensure accuracy, we do not guarantee the completeness, reliability, or timeliness of the information.",
                "Prices, availability, and terms of properties are subject to change without notice.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">4.2 — Property Transactions</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                "We act as intermediaries in real estate transactions and do not assume liability for disputes between buyers, sellers, or third parties.",
                "Any contracts or agreements related to property purchases, rentals, or investments are governed by separate legal terms and should be reviewed by a qualified professional.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "5",
    icon: Link2,
    title: "Third-Party Links",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Our website may contain links to third-party websites or resources. These links are provided
          for convenience only, and we do not endorse or control the content, privacy policies, or
          practices of these external sites.
        </p>
        <p className="text-muted-foreground text-sm mb-3">
          You acknowledge and agree that Orchid Island Real Estate is not responsible for:
        </p>
        <ul className="space-y-2 text-muted-foreground text-sm">
          {[
            "The availability or accuracy of third-party content.",
            "Any losses or damages incurred as a result of using third-party services.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "6",
    icon: ShieldOff,
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          The website and all services are provided{" "}
          <strong className="text-foreground">"as is"</strong> and{" "}
          <strong className="text-foreground">"as available"</strong> without warranties of any kind,
          either express or implied. To the fullest extent permitted by law, we disclaim all warranties,
          including but not limited to:
        </p>
        <ul className="space-y-2 text-muted-foreground text-sm">
          {[
            "Merchantability, fitness for a particular purpose, or non-infringement.",
            "The accuracy, reliability, or availability of the website or its content.",
            "We do not guarantee that the website will be error-free, secure, or uninterrupted.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "7",
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          To the maximum extent permitted by law, Orchid Island Real Estate shall not be liable for any
          direct, indirect, incidental, consequential, or special damages arising from:
        </p>
        <ul className="space-y-2 text-muted-foreground text-sm">
          {[
            "Your use or inability to use the website or services.",
            "Errors, omissions, or inaccuracies in the content.",
            "Unauthorized access to or alteration of your data.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          In no event shall our total liability exceed the amount paid by you, if any, for using our
          services.
        </p>
      </>
    ),
  },
  {
    id: "8",
    icon: Umbrella,
    title: "Indemnification",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          You agree to indemnify, defend, and hold harmless{" "}
          <strong className="text-foreground">Orchid Island Real Estate</strong>, its affiliates,
          officers, employees, and agents from any claims, liabilities, damages, losses, or expenses
          (including legal fees) arising from:
        </p>
        <ul className="space-y-2 text-muted-foreground text-sm">
          {[
            "Your use of the website or services.",
            "Your violation of these Terms or applicable laws.",
            "Any content or information you submit to the website.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "9",
    icon: Scale,
    title: "Governing Law & Jurisdiction",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          These Terms are governed by and construed in accordance with the{" "}
          <strong className="text-foreground">laws of Morocco</strong>. Any disputes arising from or
          related to these Terms shall be subject to the exclusive jurisdiction of the{" "}
          <strong className="text-foreground">courts of Marrakech, Morocco</strong>.
        </p>
      </>
    ),
  },
  {
    id: "10",
    icon: RefreshCw,
    title: "Modifications to Terms",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We reserve the right to update or modify these Terms at any time. Changes will be posted on
        this page with an updated "Last Updated" date. Your continued use of the website after such
        changes constitutes your acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "11",
    icon: XCircle,
    title: "Termination",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We may suspend or terminate your access to the website at any time, without prior notice, if
        you violate these Terms or engage in prohibited activities. Upon termination, all provisions of
        these Terms that by their nature should survive will remain in effect, including intellectual
        property rights, disclaimers, and limitations of liability.
      </p>
    ),
  },
  {
    id: "12",
    icon: Phone,
    title: "Contact Us",
    content: (
      <>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          If you have any questions, concerns, or requests regarding these Terms and Conditions, please
          do not hesitate to contact us:
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span>+212 6 186-88888</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Jbel Gueliz, 3rd Floor, Office 10, 40010, Marrakech, Morocco</span>
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

// Split nav into two rows of 6
const navRow1 = sections.slice(0, 6);
const navRow2 = sections.slice(6);

const TermsAndConditions = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      {/* ── Hero ── */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Terms &
              <span className="luxury-gradient bg-clip-text text-transparent"> Conditions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these Terms and Conditions carefully before using our website or services.
              By accessing <strong className="text-foreground">orchidisland.immo</strong>, you agree
              to be bound by the following terms.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: <strong className="text-foreground">22 April 2025</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick Nav ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {navRow1.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} className="group">
                <Card className="text-center hover:shadow-luxury transition-all duration-300 h-full">
                  <CardContent className="p-4">
                    <div className="w-9 h-9 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                      <s.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {s.id}. {s.title}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {navRow2.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} className="group">
                <Card className="text-center hover:shadow-luxury transition-all duration-300 h-full">
                  <CardContent className="p-4">
                    <div className="w-9 h-9 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                      <s.icon className="w-4 h-4 text-white" />
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

      {/* ── Intro Banner ── */}
      <section className="pb-4 bg-background">
        <div className="container mx-auto px-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to <strong className="text-foreground">Orchid Island Real Estate</strong>.
                  These Terms and Conditions ("Terms") govern your use of our website{" "}
                  <strong className="text-foreground">orchidisland.immo</strong> and any related
                  services. By accessing or using our website, you agree to comply with and be bound
                  by these Terms. If you do not agree, you must not use our website or services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-24"
              >
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
                    <div className="md:pl-16">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-cream/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Scale className="w-4 h-4 mr-2" />
              Legal Inquiry
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Questions About Our Terms?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              If you have any questions or concerns about these Terms and Conditions, our team is
              available to provide clarification and guidance.
            </p>
            <Button variant="luxury" size="lg" asChild>
              <Link to="/contact">
                Contact Our Team <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default TermsAndConditions;
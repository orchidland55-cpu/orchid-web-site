import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  Building2,
  Server,
  ScrollText,
  ShieldCheck,
  Cookie,
  AlertTriangle,
  Scale,
  Phone,
  MapPin,
  ArrowRight,
  Hash,
  Receipt,
  User,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "1",
    icon: Building2,
    title: "Editorial Information",
    content: (
      <>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          The website <strong className="text-foreground">orchidisland.immo</strong> is published by:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Building2, label: "Company Name",             value: "Orchid Island" },
            { icon: ScrollText,label: "Legal Structure",          value: "SARL" },
            { icon: MapPin,    label: "Registered Office",        value: "38 Rue Marrakech, Morocco, 40000" },
            { icon: Receipt,   label: "Capital Stock",            value: "500,000 MAD" },
            { icon: Hash,      label: "Registration Number",      value: "3254" },
            { icon: Hash,      label: "Tax ID (ICE)",             value: "004221735003330" },
            { icon: Phone,     label: "Phone",                    value: "+212 6 186-88888" },
            { icon: User,      label: "Director of Publication",  value: "Ahmed Alaoui" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-background rounded-xl p-4 border border-border"
            >
              <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "2",
    icon: Server,
    title: "Hosting Provider",
    content: (
      <>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          This website is hosted by:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Building2, label: "Hosting Company", value: "Namecheap, Inc." },
            { icon: MapPin,    label: "Address",          value: "4600 East Washington Street, Suite 305, Phoenix, Arizona 85034, United States" },
            { icon: Globe,     label: "Website",          value: "www.namecheap.com" },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 bg-background rounded-xl p-4 border border-border ${i === 1 ? "sm:col-span-2" : ""}`}
            >
              <div className="w-8 h-8 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
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
          The content of the website, including texts, images, graphics, logos, videos, and any other
          material, is the exclusive property of{" "}
          <strong className="text-foreground">Orchid Island Real Estate</strong> or its partners. All
          elements are protected by intellectual property laws, including copyright, trademarks, and
          design rights.
        </p>
        <div className="mt-4 p-4 bg-background rounded-xl border-l-4 border-l-destructive">
          <p className="text-sm text-muted-foreground">
            Any reproduction, representation, modification, or distribution of the content without
            prior written consent from Orchid Island Real Estate is{" "}
            <strong className="text-foreground">strictly prohibited</strong> and may result in legal
            action.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "4",
    icon: ShieldCheck,
    title: "Personal Data Protection",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          In accordance with Moroccan{" "}
          <strong className="text-foreground">Law No. 09-08</strong> on the protection of individuals
          with regard to the processing of personal data, and the{" "}
          <strong className="text-foreground">General Data Protection Regulation (GDPR)</strong> of the
          European Union, users of the website have the following rights:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm mb-5">
          {[
            { label: "Right to Access",       desc: "You have the right to request access to your personal data." },
            { label: "Right to Rectification",desc: "You can request corrections to inaccurate or incomplete data." },
            { label: "Right to Erasure",      desc: 'You can request the deletion of your personal data under certain conditions ("right to be forgotten").' },
            { label: "Right to Object",       desc: "You can object to the processing of your personal data for legitimate reasons." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong className="text-foreground">{item.label}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          Personal data collected through the website (e.g., contact forms, newsletter subscriptions)
          is processed only for the purposes explicitly stated at the time of collection. Data will not
          be shared with third parties without your consent, except when required by law.
        </p>
        <div className="p-4 bg-background rounded-xl border border-border text-sm space-y-2">
          <p className="font-semibold text-foreground mb-2">
            For any inquiries regarding your personal data, please contact us:
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Jbel Gueliz, 3rd Floor, Office 10, 40010, Marrakech, Morocco</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Data retention periods will comply with applicable legal requirements.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "5",
    icon: Cookie,
    title: "Cookies",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          This website uses cookies to improve user experience and analyze traffic. By continuing to
          browse the site, you agree to the use of cookies.
        </p>
        <p className="text-muted-foreground text-sm">
          You can manage or disable cookies through your browser settings. For more information,
          please refer to our{" "}
          <Link to="/privacy-policy" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "6",
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          While every effort is made to ensure the accuracy and reliability of the information provided
          on this website, <strong className="text-foreground">Orchid Island Real Estate</strong> cannot
          guarantee that the content is free from errors or omissions.
        </p>
        <p className="text-muted-foreground text-sm mb-3">
          The company shall not be held liable for any direct or indirect damages resulting from:
        </p>
        <ul className="space-y-2 text-muted-foreground text-sm mb-4">
          {[
            "The use of the website or its content.",
            "The inability to access the website or its services.",
            "The use of third-party websites linked to this site.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm leading-relaxed">
          External links provided on this website are for informational purposes only. Orchid Island
          Real Estate does not endorse and assumes no responsibility for the content, privacy policies,
          or practices of these external sites.
        </p>
      </>
    ),
  },
  {
    id: "7",
    icon: Scale,
    title: "Applicable Law & Jurisdiction",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        These Legal Notices are governed in accordance with{" "}
        <strong className="text-foreground">Moroccan law</strong>. Any disputes arising from the use
        of this website or its content shall be subject to the exclusive jurisdiction of the{" "}
        <strong className="text-foreground">courts of Marrakech, Morocco</strong>.
      </p>
    ),
  },
];

const LegalNotice = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      {/* ── Hero ── */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Gavel className="w-4 h-4 mr-2" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Legal
              <span className="luxury-gradient bg-clip-text text-transparent"> Notice</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This Legal Notice provides mandatory information about the publisher of the website
              <strong className="text-foreground"> orchidisland.immo</strong>, its hosting provider,
              and the legal framework governing its use.
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick Nav ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {sections.map((s) => (
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
                  <Gavel className="w-5 h-5 text-white" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  In compliance with applicable legal requirements, the following information is
                  provided to all users of the website{" "}
                  <strong className="text-foreground">orchidisland.immo</strong> operated by{" "}
                  <strong className="text-foreground">Orchid Island Real Estate</strong>, a SARL
                  registered under Moroccan law.
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

      {/* ── Related Legal Docs ── */}
      <section className="py-16 bg-cream/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="default" className="mb-4 luxury-gradient text-primary-foreground">
              <ScrollText className="w-4 h-4 mr-2" />
              Legal Documents
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Related Legal Documents
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              For a complete understanding of how we operate and protect your data, please consult
              our other legal documents.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="hover:shadow-luxury transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-1">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    How we collect, use, and protect your personal data.
                  </p>
                  <Button variant="elegant" size="sm" asChild>
                    <Link to="/privacy-policy">
                      Read Policy <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-luxury transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-1">Terms & Conditions</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The rules governing your use of our website and services.
                  </p>
                  <Button variant="elegant" size="sm" asChild>
                    <Link to="/terms-and-conditions">
                      Read Terms <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
              <Gavel className="w-4 h-4 mr-2" />
              Legal Inquiry
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Questions About This Legal Notice?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Our team is available to answer any legal questions or concerns about the operation
              of this website and our compliance framework.
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

export default LegalNotice;
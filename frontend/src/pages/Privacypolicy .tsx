import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Database,
  Scale,
  Share2,
  Clock,
  UserCheck,
  Lock,
  Cookie,
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
    icon: Database,
    title: "Information We Collect",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We may collect the following types of personal data when you interact with our website or services:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">1.1 — Information You Provide Directly</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Contact Information:</strong> Name, email address, phone number, postal address, when you fill out forms (contact forms, property inquiries, or newsletter subscriptions).</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Professional Information:</strong> Details about your real estate needs, preferences, budget, or property interests.</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Identification Information:</strong> Copies of identification documents (passport or ID card) if required for legal or contractual purposes.</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">1.2 — Automatically Collected Information</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Technical Data:</strong> IP address, browser type, operating system, device information, and browsing behavior on our website.</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Cookies and Similar Technologies:</strong> Information collected through cookies or tracking technologies to enhance your experience and analyze site usage.</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">1.3 — Information from Third Parties</h4>
            <p className="text-muted-foreground text-sm">
              We may receive information about you from third parties, such as real estate partners, social media platforms, or public databases, but only when permitted by applicable laws.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "2",
    icon: Eye,
    title: "How We Use Your Personal Data",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We process your personal data for the following purposes:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            { label: "To Respond to Inquiries", desc: "To provide information about properties, services, or other requests made through our website." },
            { label: "To Provide Services", desc: "To manage real estate transactions, rentals, or other services you request." },
            { label: "Marketing and Communication", desc: "To send newsletters, promotional offers, or updates about our services (only with your consent)." },
            { label: "Improving Our Website", desc: "To analyze user behavior, optimize site performance, and enhance your experience." },
            { label: "Legal Compliance", desc: "To comply with legal obligations, such as tax reporting or anti-fraud measures." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "3",
    icon: Scale,
    title: "Legal Basis for Processing",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We process your personal data based on one or more of the following legal grounds:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            { label: "Consent", desc: "You have explicitly agreed to the processing of your data for a specific purpose (e.g., subscribing to our newsletter)." },
            { label: "Contractual Necessity", desc: "Processing is necessary to fulfill a contract with you (e.g., managing a property purchase or rental)." },
            { label: "Legal Obligation", desc: "Processing is required to comply with applicable laws (e.g., tax or accounting regulations)." },
            { label: "Legitimate Interests", desc: "Processing is necessary for our legitimate business interests, such as improving our services or ensuring the security of our website, provided these interests do not override your rights." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "4",
    icon: Share2,
    title: "Sharing Your Personal Data",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We do not sell or rent your personal data to third parties. However, we may share your information with the following entities under specific circumstances:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            { label: "Service Providers", desc: "Trusted partners who assist us in operating our website, conducting business, or providing services (e.g., IT support, marketing agencies, payment processors)." },
            { label: "Legal Authorities", desc: "When required by law or to protect our rights, property, or safety." },
            { label: "Real Estate Partners", desc: "If necessary to facilitate property transactions or collaborations." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          All third parties are obligated to keep your data confidential and secure.
        </p>
      </>
    ),
  },
  {
    id: "5",
    icon: Clock,
    title: "Data Retention",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required by law.
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Contact inquiries:</strong> 25 years.</span></li>
          <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong className="text-foreground">Transaction records:</strong> 25 years for tax and legal compliance purposes.</span></li>
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          Once the retention period expires, your data will be securely deleted or anonymized.
        </p>
      </>
    ),
  },
  {
    id: "6",
    icon: UserCheck,
    title: "Your Rights",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Under applicable data protection laws, you have the following rights regarding your personal data:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            { label: "Right to Access", desc: "Request a copy of the personal data we hold about you." },
            { label: "Right to Rectification", desc: "Request corrections to inaccurate or incomplete data." },
            { label: "Right to Erasure", desc: "Request the deletion of your personal data under certain conditions." },
            { label: "Right to Object", desc: "Object to the processing of your data for specific purposes (e.g., direct marketing)." },
            { label: "Right to Data Portability", desc: "Request the transfer of your data to another organization in a structured format." },
            { label: "Right to Withdraw Consent", desc: "Withdraw your consent for processing at any time, where applicable." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 p-4 bg-background rounded-xl border border-border text-sm text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground mb-2">To exercise your rights, please contact us:</p>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary flex-shrink-0" /><span>Jbel Gueliz, 3rd Floor, Office 10, Marrakech, 40010</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary flex-shrink-0" /><span>+212 6 186-8888</span></div>
          <p className="mt-2 text-xs">We will respond to your request within 30 days and may request additional information to verify your identity.</p>
        </div>
      </>
    ),
  },
  {
    id: "7",
    icon: Lock,
    title: "Security Measures",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, misuse, or alteration. These measures include encryption, firewalls, and restricted access to authorized personnel.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: "8",
    icon: Cookie,
    title: "Cookies and Tracking Technologies",
    content: (
      <>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Our website uses cookies and similar technologies to enhance your browsing experience and analyze site usage.
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm">
          {[
            { label: "Essential Cookies", desc: "Necessary for the website to function properly." },
            { label: "Analytics Cookies", desc: "Used to track visitor behavior and improve site performance." },
            { label: "Marketing Cookies", desc: "Used to deliver personalized advertisements." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm mt-4">
          You can manage or disable cookies through your browser settings.
        </p>
      </>
    ),
  },
  {
    id: "9",
    icon: RefreshCw,
    title: "Changes to This Privacy Policy",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        We reserve the right to update or modify this Privacy Policy at any time. Any changes will be
        posted on this page with an updated "Last Updated" date. We encourage you to review this policy
        periodically to stay informed about how we protect your data.
      </p>
    ),
  },
  {
    id: "10",
    icon: Phone,
    title: "Contact Us",
    content: (
      <>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please do not hesitate to reach out to us:
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

const PrivacyPolicy = () => (
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
              Privacy
              <span className="luxury-gradient bg-clip-text text-transparent"> Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              At Orchid Island, we are committed to protecting your privacy and ensuring the
              security of your personal data. This policy explains how we collect, use, and
              safeguard your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: <strong className="text-foreground">22 April 2025</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {sections.slice(0, 5).map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="group"
              >
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
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="group"
              >
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
                  Welcome to <strong className="text-foreground">Orchid Island Real Estate</strong>. We
                  are committed to protecting your privacy and ensuring the security of your personal data.
                  By using our website <strong className="text-foreground">orchidisland.immo</strong>, you
                  agree to the terms outlined in this Privacy Policy.
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
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className={`scroll-mt-24 ${index % 2 !== 0 ? "" : ""}`}
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
                    <div className="pl-0 md:pl-16">
                      {section.content}
                    </div>
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
            Data Protection
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Questions About Your Privacy?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Our team is available to answer any questions you may have about how we handle your
            personal data. Do not hesitate to reach out.
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

export default PrivacyPolicy;
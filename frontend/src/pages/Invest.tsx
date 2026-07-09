import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  CheckCircle,
  TrendingUp,
  Home,
  Shield,
  Users
} from "lucide-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type Profile = "buyer" | "seller";

const Invest = () => {
  const [profile, setProfile] = useState<Profile>("buyer");

  const [formData, setFormData] = useState({
    // Champs communs
    fullName: "",
    email: "",
    whatsapp: "",
    message: "",
    // Acheteur
    preferredLanguage: "",
    budget: "",
    city: "",
    propertyType: "",
    objective: "",
    timeline: "",
    financing: "",
    propertyManagement: "",
    // Vendeur
    sellerPropertyType: "",
    location: "",
    ownershipStatus: "",
    askingPrice: "",
    sellerTimeline: "",
    mandateStatus: "",
    titleDeedAvailable: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSwitch = (p: Profile) => {
    setProfile(p);
    // Reset les champs spécifiques à chaque profil pour éviter les données parasites
    setFormData((prev) => ({
      ...prev,
      preferredLanguage: "",
      budget: "",
      city: "",
      propertyType: "",
      objective: "",
      timeline: "",
      financing: "",
      propertyManagement: "",
      sellerPropertyType: "",
      location: "",
      ownershipStatus: "",
      askingPrice: "",
      sellerTimeline: "",
      mandateStatus: "",
      titleDeedAvailable: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setStatus({ type: "error", message: "Veuillez valider le reCAPTCHA." });
      return;
    }

    // Construction du message structuré selon le profil
    const structuredMessage =
      profile === "buyer"
        ? `
[PROFIL : ACHETEUR]
Langue préférée   : ${formData.preferredLanguage || "—"}
Budget            : ${formData.budget || "—"}
Ville souhaitée   : ${formData.city || "—"}
Type de bien      : ${formData.propertyType || "—"}
Objectif          : ${formData.objective || "—"}
Délai             : ${formData.timeline || "—"}
Financement       : ${formData.financing || "—"}
Gestion immo.     : ${formData.propertyManagement || "—"}

Message : ${formData.message || "—"}
        `.trim()
        : `
[PROFIL : VENDEUR]
Type de bien      : ${formData.sellerPropertyType || "—"}
Localisation      : ${formData.location || "—"}
Statut propriété  : ${formData.ownershipStatus || "—"}
Prix demandé      : ${formData.askingPrice || "—"}
Délai de vente    : ${formData.sellerTimeline || "—"}
Statut mandat     : ${formData.mandateStatus || "—"}
Titre de propriété: ${formData.titleDeedAvailable || "—"}

Message : ${formData.message || "—"}
        `.trim();

    // Payload — même structure qu'avant, zéro changement backend
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.whatsapp,
      investmentService: profile,
      message: structuredMessage,
      recaptchaToken,
    };

    try {
      const response = await fetch(
        "https://orchid-web-site-production-1f73.up.railway.app/invest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! We will get back to you soon.",
        });
        setFormData({
          fullName: "", email: "", whatsapp: "", message: "",
          preferredLanguage: "", budget: "", city: "", propertyType: "",
          objective: "", timeline: "", financing: "", propertyManagement: "",
          sellerPropertyType: "", location: "", ownershipStatus: "",
          askingPrice: "", sellerTimeline: "", mandateStatus: "", titleDeedAvailable: "",
        });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        setStatus({ type: "error", message: data.error || "Une erreur est survenue." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Erreur réseau." });
    }
  };

  const selectClass =
    "font-lora w-full h-12 px-3 bg-white border-2 border-gray-300 rounded-md text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const labelClass = "font-playfair block text-sm font-medium text-foreground mb-2";
  const inputClass = "h-12 bg-white border-2 border-gray-300 focus:border-primary";

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section
          className="relative py-32 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/drgg2rocc/image/upload/v1782221275/investImg_kg5w0p.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center">
              <h1 className="font-playfair text-white text-4xl md:text-6xl font-bold mb-6">
                INVEST WITH{" "}
                <span className="luxury-gradient bg-clip-text text-transparent">
                  ORCHIDISLAND
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Why Invest */}
        <section className="py-20 bg-gradient-to-b from-cream/30 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-8">
                    WHY INVEST WITH ORCHID ISLAND?
                  </h2>
                  <p className="font-lora text-lg text-muted-foreground mb-8 leading-relaxed">
                    Morocco offers a booming real estate market, stable growth, and high
                    rental yields — and Orchid Island offers you the expertise to make the
                    most of it. We provide comprehensive investment services including:
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      "Strategic locations with strong growth potential",
                      "Market-driven investment advice",
                      "Legal and tax guidance tailored to your nationality",
                      "Full support from purchase to property management",
                      "Ongoing market analysis and portfolio optimization",
                      "OrchidIsland International is also open to all types of investments on different fields",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-2xl">
                    <img
                      src="https://res.cloudinary.com/drgg2rocc/image/upload/v1782221631/pexels-so-kenobi-323520146-18446424_gtbun0.jpg"
                      alt="Real Estate Investment"
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                      <div className="font-playfair text-center">
                        <div className="text-2xl font-bold text-primary">REAL ESTATE</div>
                        <div className="text-lg font-semibold text-foreground">INVESTMENT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="font-lora grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: TrendingUp, value: "15%+", label: "Average ROI" },
                { icon: Building, value: "500+", label: "Properties Sold" },
                { icon: Users, value: "1000+", label: "Happy Investors" },
                { icon: Shield, value: "8", label: "Cities Covered" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="testimonials" className="py-20 deep-gradient">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
                  INVEST{" "}
                  <span className="luxury-gradient bg-clip-text text-transparent">NOW!</span>
                </h2>
              </div>

              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Toggle Buyer / Seller ── */}
                    <div className="flex rounded-lg border-2 border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => handleProfileSwitch("buyer")}
                        className={`flex-1 py-2.5 rounded-md text-sm font-playfair font-semibold transition-all duration-200 ${
                          profile === "buyer"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-500 hover:text-foreground"
                        }`}
                      >
                        🏠 I want to Buy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProfileSwitch("seller")}
                        className={`flex-1 py-2.5 rounded-md text-sm font-playfair font-semibold transition-all duration-200 ${
                          profile === "seller"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-500 hover:text-foreground"
                        }`}
                      >
                        💼 I want to Sell
                      </button>
                    </div>

                    {/* ── Champs communs ── */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>WhatsApp *</label>
                        <Input
                          type="tel"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          required
                          placeholder="+212 6XX XXX XXX"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* ── Champs Acheteur ── */}
                    {profile === "buyer" && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Preferred Language</label>
                            <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="French">Français</option>
                              <option value="English">English</option>
                              <option value="Arabic">العربية</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Budget</label>
                            <select name="budget" value={formData.budget} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="< 2M MAD">Less than 2M MAD</option>
                              <option value="2M - 5M MAD">2M – 5M MAD</option>
                              <option value="5M - 10M MAD">5M – 10M MAD</option>
                              <option value="> 10M MAD">More than 10M MAD</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Preferred City</label>
                            <select name="city" value={formData.city} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Marrakech">Marrakech</option>
                              <option value="Casablanca">Casablanca</option>
                              <option value="Rabat">Rabat</option>
                              <option value="Tanger">Tanger</option>
                              <option value="Agadir">Agadir</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Property Type</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Villa">Villa</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Riad">Riad</option>
                              <option value="Land">Land</option>
                              <option value="Commercial">Commercial</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Objective</label>
                            <select name="objective" value={formData.objective} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Primary residence">Primary Residence</option>
                              <option value="Secondary residence">Secondary Residence</option>
                              <option value="Rental investment">Rental Investment</option>
                              <option value="Resale">Resale</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Timeline</label>
                            <select name="timeline" value={formData.timeline} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="ASAP">As soon as possible</option>
                              <option value="1-3 months">1–3 months</option>
                              <option value="3-6 months">3–6 months</option>
                              <option value="6-12 months">6–12 months</option>
                              <option value="+12 months">More than 12 months</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Financing</label>
                            <select name="financing" value={formData.financing} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Cash">Cash</option>
                              <option value="Bank loan">Bank Loan</option>
                              <option value="In progress">Financing in Progress</option>
                              <option value="Not yet decided">Not Yet Decided</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Property Management Needed?</label>
                            <select name="propertyManagement" value={formData.propertyManagement} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                              <option value="Maybe">Maybe</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* ── Champs Vendeur ── */}
                    {profile === "seller" && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Property Type</label>
                            <select name="sellerPropertyType" value={formData.sellerPropertyType} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Villa">Villa</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Riad">Riad</option>
                              <option value="Land">Land</option>
                              <option value="Commercial">Commercial</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Location</label>
                            <Input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="e.g. Marrakech, Palmeraie"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Ownership Status</label>
                            <select name="ownershipStatus" value={formData.ownershipStatus} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Sole owner">Sole Owner</option>
                              <option value="Co-ownership">Co-ownership</option>
                              <option value="Inheritance">Inheritance</option>
                              <option value="Company">Owned by Company</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Asking Price (MAD)</label>
                            <Input
                              type="text"
                              name="askingPrice"
                              value={formData.askingPrice}
                              onChange={handleInputChange}
                              placeholder="e.g. 3 500 000 MAD"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Sale Timeline</label>
                            <select name="sellerTimeline" value={formData.sellerTimeline} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Urgent">Urgent</option>
                              <option value="1-3 months">1–3 months</option>
                              <option value="3-6 months">3–6 months</option>
                              <option value="No rush">No Rush</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Mandate Status</label>
                            <select name="mandateStatus" value={formData.mandateStatus} onChange={handleInputChange} className={selectClass}>
                              <option value="">Select...</option>
                              <option value="Exclusive mandate">Exclusive Mandate</option>
                              <option value="Simple mandate">Simple Mandate</option>
                              <option value="No mandate yet">No Mandate Yet</option>
                              <option value="Already with agency">Already with Another Agency</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Title Deed Available?</label>
                          <select name="titleDeedAvailable" value={formData.titleDeedAvailable} onChange={handleInputChange} className={selectClass}>
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="In progress">In Progress</option>
                            <option value="No">No</option>
                            <option value="Not sure">Not Sure</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* ── Message ── */}
                    <div>
                      <label className={labelClass}>Message</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder={
                          profile === "buyer"
                            ? "Tell us more about what you're looking for..."
                            : "Tell us more about your property..."
                        }
                        className="resize-none bg-white border-2 border-gray-300 focus:border-primary"
                      />
                    </div>

                    {/* ── reCAPTCHA ── */}
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptchaChange}
                      />
                    </div>

                    {/* ── Submit ── */}
                    <div className="text-center pt-4">
                      <Button
                        type="submit"
                        disabled={!recaptchaToken}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-10 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        SEND
                      </Button>
                    </div>
                  </form>

                  {/* ── Status message ── */}
                  {status.type && (
                    <div
                      className={`mt-6 flex items-center gap-3 px-4 py-3 rounded-lg border ${
                        status.type === "success"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-red-50 border-red-300 text-red-700"
                      }`}
                    >
                      {status.type === "success" ? "✅" : "❌"}
                      <span className="font-medium">{status.message}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Invest;
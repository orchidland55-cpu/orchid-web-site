import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Send, MessageCircle, Calendar} from "lucide-react";
import { useRef,useState } from "react";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";
import ReCAPTCHA from "react-google-recaptcha";


const Contact = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    propertyType: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('https://orchid-web-site-production.up.railway.app/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage("✅ Message sent successfully! We will respond to you soon.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          propertyType: ""
        });
      } else {
        const error = await response.json();

        // If it's just an email issue, but data is saved
        if (error.details && error.details.includes('Invalid login')) {
          setSubmitMessage("✅ Your message has been received and saved! (Email temporarily unavailable)");

          // Reset form since data is saved
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            propertyType: ""
          });
        } else {
          setSubmitMessage("❌ Error sending. Please try again.");
        }
      }
    } catch (error) {
      setSubmitMessage("❌ Connection error. Please check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+212 618-688-888"],
      description: "Call us anytime"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["Centre d’affaire Oualid, Jbel Gueliz 10, 40010 Marrakech, Morocco"],
      description: "Visit our office"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Fri: 9:00 - 18:00", "Sat: 10:00 - 16:00"],
      description: "Business hours"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                <MessageCircle className="w-4 h-4 mr-2" />
                Get In Touch
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Contact
                <span className="luxury-gradient bg-clip-text text-transparent"> Orchid Island</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Ready to find your dream property? Our luxury real estate experts are here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{info.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-foreground font-medium">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 bg-cream/30">
          <div className="container">
            <div className="grid lg:grid-cols gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 XXX-XXX-XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Property Interest
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Select property type</option>
                        <option value="villa">Luxury Villa</option>
                        <option value="apartment">Premium Apartment</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="commercial">Commercial Property</option>
                        <option value="investment">Investment Opportunity</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your requirements..."
                      rows={6}
                      required
                    />
                  </div>

                  {submitMessage && (
                    <div className={`p-4 rounded-md mb-4 ${
                      submitMessage.includes('✅')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  {/* reCAPTCHA placeholder */}
                    <div className="mb-4">
                   <ReCAPTCHA
                     sitekey={RECAPTCHA_SITE_KEY}  // Remplace par ta Site Key
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                  <div className="grid lg:grid-cols-2 gap-12">
                  <Button
                    type="submit"
                    variant="luxury"
                    size="lg"
                    className="w-full"
                    disabled={!recaptchaToken || isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  <Button
                    variant="elegant"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule a Visit
                  </Button>
                </div>
                </form>
              </div>
              {/* Map */}
              <div className="h-96 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.6460753537453!2d-8.025032399999997!3d31.6435395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8bf0da58cc444bb%3A0xae64f92fc9524f5!2sOrchid%20Island%20Real%20Estate!5e0!3m2!1sen!2sma!4v1773534817924!5m2!1sen!2sma"
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};

export default Contact;
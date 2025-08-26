import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  User,
  Building,
  Globe
} from "lucide-react";
import { useState } from "react";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+212 5XX-XXX-XXX", "+212 6XX-XXX-XXX"],
      description: "Call us anytime"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@orchidisland.com", "sales@orchidisland.com"],
      description: "Send us a message"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["123 Luxury Avenue", "Casablanca, Morocco"],
      description: "Visit our office"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Fri: 9:00 - 18:00", "Sat: 10:00 - 16:00"],
      description: "Business hours"
    }
  ];

  const offices = [
    {
      city: "Casablanca",
      address: "123 Luxury Avenue, Marina District",
      phone: "+212 5XX-XXX-XXX",
      email: "casablanca@orchidisland.com"
    },
    {
      city: "Rabat",
      address: "456 Royal Street, Souissi",
      phone: "+212 5XX-XXX-XXX",
      email: "rabat@orchidisland.com"
    },
    {
      city: "Marrakech",
      address: "789 Palmeraie Road, Hivernage",
      phone: "+212 5XX-XXX-XXX",
      email: "marrakech@orchidisland.com"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
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

                  <Button type="submit" variant="luxury" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Office Locations */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Offices
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Visit us at any of our luxury real estate offices across Morocco.
                </p>

                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <Card key={index} className="hover:shadow-luxury transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-2">{office.city}</h3>
                            <div className="space-y-2 text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{office.address}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{office.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{office.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <Button
                    variant="elegant"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule a Meeting
                  </Button>
                </div>
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

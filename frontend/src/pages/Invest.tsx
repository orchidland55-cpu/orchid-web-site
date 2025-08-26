import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  CheckCircle,
  Send,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

const Invest = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    investmentService: "",
    message: ""
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
    console.log("Investment inquiry submitted:", formData);
    alert("Thank you for your interest! We will contact you soon.");
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      investmentService: "",
      message: ""
    });
  };

  const investmentBenefits = [
    "Strategic locations with strong growth potential",
    "Market-driven investment advice",
    "Legal and tax guidance tailored to your nationality",
    "Full support from purchase to property management"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Animated Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-primary/20 mb-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <TrendingUp className="w-5 h-5 text-primary animate-bounce" />
                <span className="text-primary font-semibold">Premium Investment Opportunities</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-foreground mb-8 ekit-heading--title elementskit-section-title animate-fade-in-up">
                Invest with{" "}
                <span className="luxury-gradient bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                  OrchidIsland
                </span>
              </h1>

              <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-12 elementor-heading-title elementor-size-default animate-fade-in-up delay-200">
                Why Invest with Orchid Island?
              </h2>

              {/* Interactive Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up delay-600">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3 group-hover:animate-bounce" />
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">15%+</div>
                  <div className="text-sm text-muted-foreground">Average ROI</div>
                </div>
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <Building className="w-10 h-10 text-primary mx-auto mb-3 group-hover:animate-bounce" />
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">500+</div>
                  <div className="text-sm text-muted-foreground">Properties Sold</div>
                </div>
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3 group-hover:animate-bounce" />
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Investors</div>
                </div>
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <Send className="w-10 h-10 text-primary mx-auto mb-3 group-hover:animate-bounce" />
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">8</div>
                  <div className="text-sm text-muted-foreground">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Benefits & Description */}
        <section className="py-24 bg-gradient-to-b from-background via-cream/20 to-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
                  Why Choose{" "}
                  <span className="luxury-gradient bg-clip-text text-transparent">
                    OrchidIsland
                  </span>
                </h2>
                <div className="w-24 h-1 luxury-gradient mx-auto rounded-full"></div>
              </div>

              {/* Interactive Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {investmentBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Content */}
                    <div className="relative z-10 flex items-start space-x-4">
                      <div className="w-14 h-14 luxury-gradient rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-7 h-7 text-white group-hover:animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors duration-300">
                          {benefit}
                        </p>

                        {/* Animated Line */}
                        <div className="w-0 h-0.5 bg-gradient-to-r from-primary to-secondary mt-4 group-hover:w-full transition-all duration-500"></div>
                      </div>
                    </div>

                    {/* Floating Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </section>

        {/* Contact Form for Investment */}
        <section className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {/* Form Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                  Contact Us to Invest
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ready to start your investment journey? Fill out the form below and our team will contact you within 24 hours.
                </p>
              </div>

              {/* Form */}
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Name"
                          required
                          className="h-11"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone"
                          required
                          className="h-11"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Investment Services
                        </label>
                        <select
                          name="investmentService"
                          value={formData.investmentService}
                          onChange={handleInputChange}
                          required
                          className="w-full h-11 px-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          <option value="">-Buy a Property</option>
                          <option value="buy-property">Buy a Property</option>
                          <option value="investment-consultation">Investment Consultation</option>
                          <option value="property-management">Property Management</option>
                          <option value="market-analysis">Market Analysis</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Message"
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <div className="text-center pt-4">
                      <Button
                        type="submit"
                        variant="luxury"
                        size="lg"
                        className="px-8 py-3"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Investment Inquiry
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                <div>
                  <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Office</h3>
                  <p className="text-sm text-muted-foreground">Marrakech, Morocco</p>
                </div>
                <div>
                  <Send className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">invest@orchidisland.com</p>
                </div>
                <div>
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">+212 5XX-XXX-XXX</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Invest;

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
  TrendingUp,
  Home,
  Shield,
  Users
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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/invest", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
    const data = await response.json();

    if (response.ok) {
      alert("Merci ! Nous avons reçu votre demande.");
      setFormData({ fullName: "", email: "", phone: "", investmentService: "", message: "" });
    } else {
      alert(data.error || "Une erreur est survenue.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau.");
  }
};


  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Background Image */}
        <section 
          className="relative py-32 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center">
              <h1 className="font-playfair text-white text-4xl md:text-6xl font-bold text-foreground mb-6">
            INVEST WITH <span className="luxury-gradient bg-clip-text text-transparent">ORCHIDISLAND</span>
          </h1>
            </div>
          </div>
        </section>

        {/* Why Invest Section */}
        <section className="py-20 bg-gradient-to-b from-cream/30 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Content */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-8">
                    WHY INVEST WITH ORCHID ISLAND?
                  </h2>
                  
                  <p className="font-lora text-lg text-muted-foreground mb-8 leading-relaxed">
                    Morocco offers a booming real estate market, stable growth, and high rental yields - and Orchid Island 
                    offers you the expertise to make the most of it. We provide comprehensive investment services including:
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      "Strategic locations with strong growth potential",
                      "Market-driven investment advice", 
                      "Legal and tax guidance tailored to your nationality",
                      "Full support from purchase to property management",
                      "Ongoing market analysis and portfolio optimization",
                      "OrchidIsland International is also open to all types of investments on different fields"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Real Estate Investment"
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
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

        {/* Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="font-lora grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground">15%+</div>
                <div className="text-sm text-muted-foreground">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Investors</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground">8</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
   <section id="testimonials" className="py-20 deep-gradient">
         
          
        
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
                  INVEST <span className="luxury-gradient bg-clip-text text-transparent">NOW!</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Image */}
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Investment Planning"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl"></div>
                </div>

                {/* Right Form */}
                <div>
                  <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-playfair block text-sm font-medium text-foreground mb-2">
                              Full Name:
                            </label>
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="h-12 bg-white border-2 border-gray-300 focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="font-playfair block text-sm font-medium text-foreground mb-2">
                              Phone:
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="h-12 bg-white border-2 border-gray-300 focus:border-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-playfair block text-sm font-medium text-foreground mb-2">
                            Email:
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-12 bg-white border-2 border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="font-playfair block text-sm font-medium text-foreground mb-2">
                            Investment Services:
                          </label>
                          <select
                            name="investmentService"
                            value={formData.investmentService}
                            onChange={handleInputChange}
                            required
                            className="font-lora w-full h-12 px-3 bg-white border-2 border-gray-300 rounded-md text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">- Buy a Property</option>
                            <option value="buy-property">Buy a Property</option>
                            <option value="investment-consultation">Investment Consultation</option>
                            <option value="property-management">Property Management</option>
                            <option value="market-analysis">Market Analysis</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-playfair block text-sm font-medium text-foreground mb-2">
                            Message:
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="resize-none bg-white border-2 border-gray-300 focus:border-primary"
                          />
                        </div>

                        {/* reCAPTCHA placeholder */}
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" id="recaptcha" className="w-4 h-4" />
                          <label htmlFor="recaptcha" className="font-lora text-sm text-muted-foreground">
                            I'm not a robot
                          </label>
                          <div className="font-lora ml-auto text-xs text-muted-foreground">
                            RECAPTCHA
                          </div>
                        </div>

                        <div className="text-center pt-4">
                          <Button
                            type="submit"
                            className=" bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury"
                          >
                            SEND
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
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
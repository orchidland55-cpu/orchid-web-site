import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Mail, Phone, User, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Postulation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    experience: "",
    motivation: "",
    cv: null as File | null,
    coverLetter: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cv' | 'coverLetter') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      position: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formDataObj = new FormData();
  formDataObj.append('firstName', formData.firstName);
  formDataObj.append('lastName', formData.lastName);
  formDataObj.append('email', formData.email);
  formDataObj.append('phone', formData.phone);
  formDataObj.append('address', formData.address);
  formDataObj.append('position', formData.position);
  formDataObj.append('experience', formData.experience);
  formDataObj.append('motivation', formData.motivation);
  
  if (formData.cv) formDataObj.append('cv', formData.cv);
  if (formData.coverLetter) formDataObj.append('coverLetter', formData.coverLetter);

  try {
    const response = await fetch('https://orchid-web-site-production.up.railway.app/postulation', {
      method: 'POST',
      body: formDataObj,
    });
    
    const result = await response.json();
    alert(result.message);

    // 🔄 Reload page after success
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert('Error submitting application');
  }
};


  return (
    <div className="min-h-screen bg-ivory-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Join Our Team
            </h1>
            <p className="font-lora text-lg text-charcoal/80 max-w-3xl mx-auto">
              At Orchid Island, we're seeking passionate talent to help us redefine excellence in luxury real estate in Morocco.
            </p>
          </div>

          {/* Application Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardTitle className="font-playfair text-2xl">Application Form</CardTitle>
                <CardDescription className="text-white/90 font-lora">
                  Fill out this form to apply for a position at Orchid Island
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-lora flex items-center gap-2">
                        <User className="w-4 h-4" />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="Your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-lora flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-lora flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-lora flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-lora flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="font-lora"
                      placeholder="Your full address"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="font-lora">Desired Position *</Label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger className="font-lora">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent-immobilier">Real Estate Agent</SelectItem>
                        <SelectItem value="conseiller-commercial">Sales Advisor</SelectItem>
                        <SelectItem value="gestionnaire-patrimoine">Wealth Manager</SelectItem>
                        <SelectItem value="marketing">Marketing & Communications</SelectItem>
                        <SelectItem value="administratif">Administrative</SelectItem>
                        <SelectItem value="autre">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="font-lora">
                      Professional Experience *
                    </Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="font-lora min-h-[120px]"
                      placeholder="Describe your relevant professional experience..."
                    />
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="font-lora">
                      Motivation Letter *
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      className="font-lora min-h-[150px]"
                      placeholder="Explain why you want to join Orchid Island..."
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-lora flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        CV (PDF) *
                      </Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, 'cv')}
                          required
                          className="font-lora"
                        />
                        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {formData.cv && (
                        <p className="text-sm text-green-600 font-lora">
                          ✓ {formData.cv.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-lora flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Cover Letter (PDF)
                      </Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, 'coverLetter')}
                          className="font-lora"
                        />
                        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {formData.coverLetter && (
                        <p className="text-sm text-green-600 font-lora">
                          ✓ {formData.coverLetter.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      variant="luxury"
                      size="lg"
                      className="w-full font-lora text-lg"
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Why Orchid Island?
                </h3>
                <div className="space-y-4 font-lora text-charcoal/80">
                  <p>
                    • Stimulating work environment in the luxury real estate sector
                  </p>
                  <p>
                    • Professional development and continuous training opportunities
                  </p>
                  <p>
                    • Dynamic and collaborative team
                  </p>
                  <p>
                    • Attractive compensation and social benefits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Postulation;
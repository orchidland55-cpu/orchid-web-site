
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Postulation submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Votre candidature a été soumise avec succès!");
  };

  return (
    <div className="min-h-screen bg-ivory-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Rejoignez Notre Équipe
            </h1>
            <p className="font-lora text-lg text-charcoal/80 max-w-3xl mx-auto">
              Chez Orchid Island, nous recherchons des talents passionnés pour nous aider à 
              redéfinir l'excellence dans l'immobilier de luxe au Maroc.
            </p>
          </div>

          {/* Application Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardTitle className="font-playfair text-2xl">Formulaire de Candidature</CardTitle>
                <CardDescription className="text-white/90 font-lora">
                  Remplissez ce formulaire pour postuler à un poste chez Orchid Island
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-lora flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-lora flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nom *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="font-lora"
                        placeholder="Votre nom"
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
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-lora flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Téléphone *
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
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="font-lora"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="font-lora">Poste souhaité *</Label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger className="font-lora">
                        <SelectValue placeholder="Sélectionnez un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent-immobilier">Agent Immobilier</SelectItem>
                        <SelectItem value="conseiller-commercial">Conseiller Commercial</SelectItem>
                        <SelectItem value="gestionnaire-patrimoine">Gestionnaire de Patrimoine</SelectItem>
                        <SelectItem value="marketing">Marketing & Communication</SelectItem>
                        <SelectItem value="administratif">Administratif</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="font-lora">
                      Expérience professionnelle *
                    </Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="font-lora min-h-[120px]"
                      placeholder="Décrivez votre expérience professionnelle pertinente..."
                    />
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="font-lora">
                      Lettre de motivation *
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      className="font-lora min-h-[150px]"
                      placeholder="Expliquez pourquoi vous souhaitez rejoindre Orchid Island..."
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
                        Lettre de motivation (PDF)
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
                      Soumettre ma candidature
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
                  Pourquoi Orchid Island ?
                </h3>
                <div className="space-y-4 font-lora text-charcoal/80">
                  <p>
                    • Environnement de travail stimulant dans le secteur de l'immobilier de luxe
                  </p>
                  <p>
                    • Opportunités de développement professionnel et de formation continue
                  </p>
                  <p>
                    • Équipe dynamique et collaborative
                  </p>
                  <p>
                    • Rémunération attractive et avantages sociaux
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
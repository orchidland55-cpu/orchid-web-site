import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Save, Building } from "lucide-react";
import { apiService } from "@/services/api";
import { showToast } from "@/components/ToastContainer";

const AdminAddCareer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    contractType: "CDI",
    salary: "",
    duration: "",
    stageType: "",
    freelanceDeadline: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        contractType: formData.contractType,
      };

      if (formData.contractType === "CDI") {
        payload.salary = formData.salary;
      } else if (formData.contractType === "CDD") {
        payload.salary = formData.salary;
        payload.duration = formData.duration;
      } else if (formData.contractType === "Stage") {
        payload.stageType = formData.stageType;
      } else if (formData.contractType === "Freelance") {
        payload.freelanceDeadline = formData.freelanceDeadline || null;
      }

      await apiService.createCareer(payload);
      showToast({ type: "success", title: "Offre créée", message: "L'offre d'emploi a été publiée." });
      navigate("/admin");
    } catch (error: any) {
      showToast({ type: "error", title: "Erreur", message: "Impossible de créer l'offre." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderExtraFields = () => {
    switch (formData.contractType) {
      case "Stage":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Type de stage *</label>
            <div className="flex flex-wrap gap-4">
              {["Stage PFE", "Stage PFA", "Stage d'observation", "Stage technique", "Pré Embauche", "Autre"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="stageType"
                    value={type}
                    checked={formData.stageType === type}
                    onChange={handleInputChange}
                    className="accent-[#D4AF37]"
                    required
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "CDI":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Salaire *</label>
            <Input name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Ex: 12 000 - 15 000 MAD" required />
          </div>
        );
      case "CDD":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Salaire *</label>
              <Input name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Ex: 12 000 - 15 000 MAD" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Durée *</label>
              <Input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Ex: 6 mois, 1 an" required />
            </div>
          </>
        );
      case "Freelance":
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Date de deadline (optionnel)</label>
      <Input type="date" name="freelanceDeadline" value={formData.freelanceDeadline} onChange={handleInputChange} />
    </div>
  );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#D4AF37]" />
              Créer une offre d'emploi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre du poste *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ville *</label>
                <Input name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de contrat *</label>
                <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
            {renderExtraFields()}
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} required />
            </div>
            <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c9a22a] text-white" disabled={isLoading}>
              {isLoading ? "Publication..." : "Publier l'offre"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminAddCareer;
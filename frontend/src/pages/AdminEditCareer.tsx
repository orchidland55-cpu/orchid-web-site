import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Save, Building, ArrowLeft } from "lucide-react";
import { apiService } from "@/services/api";
import { showToast } from "@/components/ToastContainer";

interface AdminEditCareerProps {
  id: string;
  onDone?: () => void;
}

const AdminEditCareer = ({ id, onDone }: AdminEditCareerProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    contractType: "CDI",
    salary: "",
    duration: "",
    stageType: "",
    freelanceDeadline: "",
    status: "active",
  });

  useEffect(() => {
    loadCareer();
  }, [id]);

  const loadCareer = async () => {
    try {
      setIsFetching(true);
      const data = await apiService.getCareerById(id);
      setFormData({
        title: data.title,
        description: data.description,
        city: data.city,
        contractType: data.contractType,
        salary: data.salary || "",
        duration: data.duration || "",
        stageType: data.stageType || "",
        freelanceDeadline: data.freelanceDeadline ? data.freelanceDeadline.split("T")[0] : "",
        status: data.status || "active",
      });
    } catch (error) {
      console.error("❌ Error loading career:", error);
      showToast({ type: "error", title: "Erreur", message: "Impossible de charger l'offre d'emploi" });
    } finally {
      setIsFetching(false);
    }
  };

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
        status: formData.status,
      };

      if (formData.contractType === "CDI") {
        payload.salary = formData.salary;
        payload.duration = null;
        payload.stageType = null;
        payload.freelanceDeadline = null;
      } else if (formData.contractType === "CDD") {
        payload.salary = formData.salary;
        payload.duration = formData.duration;
        payload.stageType = null;
        payload.freelanceDeadline = null;
      } else if (formData.contractType === "Stage") {
        payload.stageType = formData.stageType;
        payload.salary = null;
        payload.duration = null;
        payload.freelanceDeadline = null;
      } else if (formData.contractType === "Freelance") {
        payload.freelanceDeadline = formData.freelanceDeadline || null;
        payload.salary = null;
        payload.duration = null;
        payload.stageType = null;
      }

      await apiService.updateCareer(id, payload);
      showToast({ type: "success", title: "Mis à jour", message: "L'offre d'emploi a été mise à jour." });
      if (onDone) onDone();
    } catch (error: any) {
      showToast({ type: "error", title: "Erreur", message: error.message || "Impossible de mettre à jour l'offre." });
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
            <label className="block text-sm font-medium mb-1">Date de deadline *</label>
            <Input type="date" name="freelanceDeadline" value={formData.freelanceDeadline} onChange={handleInputChange} required />
          </div>
        );
      default:
        return null;
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Modifier l'offre d'emploi</h2>
          <Button variant="outline" size="sm" type="button" onClick={() => onDone ? onDone() : navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#D4AF37]" />
              Modifier: {formData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre *</label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="active">Active</option>
                  <option value="closed">Fermée</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} required />
            </div>
            <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c9a22a] text-white" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminEditCareer;
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase, MapPin, Calendar, Upload, Send,
  CheckCircle2, Loader2, FileText, X,
} from "lucide-react";
import { apiService } from "@/services/api";
import { showToast } from "@/components/ToastContainer";
import { SITE_URL } from "@/config/schema";

// ── Type d'une offre publiée côté admin ────────────────────────────────────
interface CareerOffer {
  _id: string;
  title: string;
  description: string;
  city: string;
  contractType: "CDI" | "CDD" | "Stage" | "Freelance";
  salary?: string;
  duration?: string;
  stageType?: string;
  freelanceDeadline?: string;
  status: "active" | "closed";
  createdAt: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

const Postulation = () => {
  // ── Offres ──────────────────────────────────────────────────────────────
  const [careers, setCareers] = useState<CareerOffer[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<CareerOffer | null>(null);

  // ── Formulaire ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    experience: "",
    motivation: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoadingCareers(true);
        const data = await apiService.getAllCareers();
        setCareers((data as CareerOffer[]).filter((c) => c.status === "active"));
      } catch (err) {
        console.error("Erreur chargement des offres:", err);
      } finally {
        setLoadingCareers(false);
      }
    };
    fetchCareers();
  }, []);

  const handleApplyClick = (career: CareerOffer) => {
    setSelectedCareer(career);
    setFormData((prev) => ({ ...prev, position: career.title }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "coverLetter"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast({
        type: "error",
        title: "Fichier trop volumineux",
        message: "Le fichier ne doit pas dépasser 5 Mo.",
      });
      e.target.value = "";
      return;
    }

    if (type === "cv") setCvFile(file);
    else setCoverLetterFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile) {
      showToast({
        type: "error",
        title: "CV requis",
        message: "Merci de joindre votre CV avant d'envoyer votre candidature.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      if (formData.address) payload.append("address", formData.address);
      payload.append("position", formData.position);
      payload.append("experience", formData.experience);
      payload.append("motivation", formData.motivation);
      payload.append("cv", cvFile);
      if (coverLetterFile) payload.append("coverLetter", coverLetterFile);

      await apiService.createPostulation(payload);
      setSubmitted(true);
      showToast({
        type: "success",
        title: "Candidature envoyée",
        message: "Nous avons bien reçu votre candidature.",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Erreur",
        message: err.message || "Impossible d'envoyer votre candidature. Réessayez.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Carrières & Offres d'emploi | Orchid Island Real Estate</title>
        <link rel="canonical" href={`${SITE_URL}/contact-us/careers/`} />
        <meta
          name="description"
          content="Découvrez nos offres d'emploi et postulez pour rejoindre Orchid Island, agence immobilière de luxe à Marrakech."
        />
      </Helmet>

      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="py-12 sm:py-16 bg-muted/30 border-b">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Rejoignez notre équipe
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Découvrez nos opportunités de carrière et faites partie d'une équipe passionnée
              par l'immobilier de luxe à Marrakech.
            </p>
          </div>
        </section>

        {/* ── Offres ouvertes ── */}
        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Offres ouvertes</h2>

            {loadingCareers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : careers.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  Aucune offre n'est ouverte pour le moment. N'hésitez pas à nous envoyer
                  une candidature spontanée via le formulaire ci-dessous.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {careers.map((career) => (
                  <Card key={career._id} className="hover:shadow-luxury transition-all duration-300">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold leading-tight">
                          {career.title}
                        </h3>
                        <Badge className="shrink-0 bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
                          {career.contractType}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {career.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground mb-5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{career.city}</span>
                        </div>
                        {career.salary && <span>💰 {career.salary}</span>}
                        {career.duration && <span>Durée : {career.duration}</span>}
                        {career.stageType && <span>{career.stageType}</span>}
                        {career.freelanceDeadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>Deadline : {formatDate(career.freelanceDeadline)}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="luxury"
                        className="w-full"
                        onClick={() => handleApplyClick(career)}
                      >
                        Postuler
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Formulaire de candidature ── */}
        <section ref={formRef} className="py-10 sm:py-14 bg-muted/30 border-t scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Candidature envoyée !</h3>
                    <p className="text-muted-foreground">
                      Merci pour votre candidature
                      {formData.position ? ` pour le poste de ${formData.position}` : ""}.
                      Notre équipe l'examinera et reviendra vers vous rapidement.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    {selectedCareer ? `Postuler : ${selectedCareer.title}` : "Candidature spontanée"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Remplissez le formulaire ci-dessous, notre équipe RH vous répondra dans les
                    meilleurs délais.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Prénom *</label>
                            <Input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Nom *</label>
                            <Input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Téléphone *</label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Ville *</label>
                          <Input name="address" value={formData.address} onChange={handleInputChange} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Poste souhaité *</label>
                          <Input
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Expérience *</label>
                          <Textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Résumez votre parcours professionnel..."
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Lettre de motivation *</label>
                          <Textarea
                            name="motivation"
                            value={formData.motivation}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Pourquoi souhaitez-vous rejoindre Orchid Island ?"
                            required
                          />
                        </div>

                        {/* CV */}
                        <div>
                          <label className="block text-sm font-medium mb-1">CV *</label>
                          <input
                            ref={cvInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "cv")}
                          />
                          <button
                            type="button"
                            onClick={() => cvInputRef.current?.click()}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Upload className="w-4 h-4 shrink-0 text-muted-foreground" />
                              {cvFile ? (
                                <span className="truncate">{cvFile.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Choisir un fichier (PDF, Word)...</span>
                              )}
                            </span>
                            {cvFile && (
                              <X
                                className="w-4 h-4 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCvFile(null);
                                  if (cvInputRef.current) cvInputRef.current.value = "";
                                }}
                              />
                            )}
                          </button>
                        </div>

                        {/* Lettre de motivation (fichier optionnel) */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Lettre de motivation — fichier (optionnel)
                          </label>
                          <input
                            ref={coverLetterInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "coverLetter")}
                          />
                          <button
                            type="button"
                            onClick={() => coverLetterInputRef.current?.click()}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                              {coverLetterFile ? (
                                <span className="truncate">{coverLetterFile.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Choisir un fichier (PDF, Word)...</span>
                              )}
                            </span>
                            {coverLetterFile && (
                              <X
                                className="w-4 h-4 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCoverLetterFile(null);
                                  if (coverLetterInputRef.current) coverLetterInputRef.current.value = "";
                                }}
                              />
                            )}
                          </button>
                        </div>

                        <Button type="submit" variant="luxury" className="w-full" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Envoyer ma candidature
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Postulation;
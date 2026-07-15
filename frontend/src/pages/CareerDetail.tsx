import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  CheckCircle2, Loader2, FileText, X, ArrowLeft,
} from "lucide-react";
import { apiService } from "@/services/api";
import { showToast } from "@/components/ToastContainer";
import { SITE_URL } from "@/config/schema";

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

const CareerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [career, setCareer] = useState<CareerOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    motivation: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCareer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getCareerById(id);
        setCareer(data as CareerOffer);
      } catch (err: any) {
        console.error("Erreur chargement de l'offre:", err);
        setError(err.message || "Impossible de charger cette offre.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

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
      payload.append("position", career?.title || "");
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

  // ── États de chargement / erreur ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Offre introuvable</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Cette offre a peut-être été supprimée ou le lien est incorrect."}
          </p>
          <Button variant="luxury" asChild>
            <Link to="/contact-us/careers/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux offres
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{career.title} | Carrières Orchid Island Real Estate</title>
        <link rel="canonical" href={`${SITE_URL}/careers/${career._id}`} />
        <meta name="description" content={career.description.slice(0, 155)} />
      </Helmet>

      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="py-10 sm:py-14 bg-muted/30 border-b">
          <div className="container mx-auto px-4 sm:px-6">
            <button
              onClick={() => navigate("/contact-us/careers/")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux offres
            </button>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
                    {career.contractType}
                  </Badge>
                  {career.status === "closed" && (
                    <Badge variant="secondary">Offre fermée</Badge>
                  )}
                </div>
                <h1 className="font-playfair text-2xl sm:text-4xl font-bold mb-4">
                  {career.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{career.city}</span>
                  </div>
                  {career.salary && <span>💰 {career.salary}</span>}
                  {career.duration && <span>Durée : {career.duration}</span>}
                  {career.stageType && <span>{career.stageType}</span>}
                  {career.freelanceDeadline && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline : {formatDate(career.freelanceDeadline)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Description détaillée ── */}
        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-10">
              <Card>
                <CardContent className="p-5 sm:p-8">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Description du poste</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {career.description}
                  </p>
                </CardContent>
              </Card>

              {/* ── Formulaire de candidature ── */}
              {career.status === "closed" ? (
                <Card>
                  <CardContent className="p-8 sm:p-10 text-center">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      Cette offre n'accepte plus de candidatures
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Consultez nos autres offres ouvertes.
                    </p>
                    <Button variant="luxury" asChild>
                      <Link to="/contact-us/careers/">Voir les offres</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : submitted ? (
                <Card>
                  <CardContent className="p-8 sm:p-10 text-center">
                    <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Candidature envoyée !</h3>
                    <p className="text-muted-foreground mb-6">
                      Merci pour votre candidature pour le poste de{" "}
                      <strong className="text-foreground">{career.title}</strong>. Notre équipe
                      l'examinera et reviendra vers vous rapidement.
                    </p>
                    <Button variant="luxury" asChild>
                      <Link to="/contact-us/careers/">Voir d'autres offres</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2">
                    Postuler : {career.title}
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
                          <label className="block text-sm font-medium mb-1">Ville</label>
                          <Input name="address" value={formData.address} onChange={handleInputChange} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Poste souhaité</label>
                          <Input value={career.title} disabled className="bg-muted/50" />
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
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareerDetails;
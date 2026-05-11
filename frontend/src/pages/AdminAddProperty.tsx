import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, PropertyFormData, Admin } from "@/services/api";
import { uploadToCloudinary } from "@/services/cloudinary";
import {
  Building,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Star,
  Camera,
  TrendingUp,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Quote,
  Palette,
  Plus,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import RichTextEditor from "@/components/RichTextEditor";
import SEOAnalyzer from "@/components/Seoanalyzer";

// ─── Clé localStorage pour les types custom ───────────────────────────────────
const STORAGE_KEY = "orchid_property_types";

// ─── Types de base (fallback) ─────────────────────────────────────────────────
const BASE_PROPERTY_TYPES = [
  "Villa", "Penthouse", "Chalet", "Riad", "Hotel",
  "Apartment", "House", "Studio", "Duplex", "Triplex",
  "Land", "Mall", "Office", "Warehouse", "Resort",
];

// ─── Hook partagé pour gérer les types ───────────────────────────────────────
function usePropertyTypes() {
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const custom: string[] = stored ? JSON.parse(stored) : [];
      // Merge base + custom sans doublons
      return [...new Set([...BASE_PROPERTY_TYPES, ...custom])];
    } catch {
      return BASE_PROPERTY_TYPES;
    }
  });

  const [newType, setNewType] = useState("");

  const addCustomType = () => {
    const trimmed = newType.trim();
    if (!trimmed) return;

    // Vérifier les doublons (insensible à la casse)
    const alreadyExists = propertyTypes.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setNewType("");
      return;
    }

    const updated = [...propertyTypes, trimmed];
    setPropertyTypes(updated);

    // Persister uniquement les types custom dans localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const custom: string[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...custom, trimmed]));
    } catch {
      console.error("localStorage write failed");
    }

    setNewType("");
  };

  return { propertyTypes, newType, setNewType, addCustomType };
}

// ─── Composant principal ──────────────────────────────────────────────────────

const AdminAddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    status: "available",
    featured: false,
    mainImage: "",
    additionalImages: [],
    amenities: "",
    yearBuilt: "",
    parking: "",
    garden: false,
    pool: false,
    security: false,
    furnished: false,
    person: "",
    // ── SEO ──────────────────────────────────────
    seoTitle: "",
    metaDescription: "",
    slug: "",
    focusKeyword: "",
    imageAlt: "",
    ogTitle: "",
    twitterTitle: "",
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Admins dynamiques
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);

  // ✅ Types de propriété dynamiques
  const { propertyTypes, newType, setNewType, addCustomType } = usePropertyTypes();

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await apiService.getAssignableUsers();
        setAdmins(data);
      } catch (error) {
        console.error("Erreur chargement admins:", error);
      } finally {
        setAdminsLoading(false);
      }
    };
    loadAdmins();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
    setIsUploadingMain(true);
    setUploadProgress(0);
    try {
      const result = await uploadToCloudinary(file, "orchid/properties", (percent) =>
        setUploadProgress(percent)
      );
      setFormData((prev) => ({ ...prev, mainImage: result.url }));
    } catch (error) {
      console.error("Main image upload error:", error);
      alert("Failed to upload main image. Please try again.");
    } finally {
      setIsUploadingMain(false);
      setUploadProgress(0);
    }
  };

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setAdditionalImageFiles((prev) => [...prev, ...files]);
    setIsUploadingAdditional(true);
    for (const file of files) {
      const localPreview = URL.createObjectURL(file);
      setAdditionalImagePreviews((prev) => [...prev, localPreview]);
      try {
        const result = await uploadToCloudinary(file, "orchid/properties");
        setAdditionalImagePreviews((prev) =>
          prev.map((p) => (p === localPreview ? result.url : p))
        );
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        setAdditionalImagePreviews((prev) => prev.filter((p) => p !== localPreview));
        alert(`Failed to upload "${file.name}". Please try again.`);
      }
    }
    setIsUploadingAdditional(false);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const allAdditionalImages = [...additionalImagePreviews, ...formData.additionalImages];
      const finalData = { ...formData, additionalImages: allAdditionalImages };
      const createdProperty = await apiService.createProperty(finalData);
      console.log("Property created:", createdProperty);
      alert("Property created successfully!");
      navigate("/admin/properties");
    } catch (error: any) {
      console.error("Error creating property:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const allAdditionalImages = [...additionalImagePreviews, ...formData.additionalImages];
      const draftData = { ...formData, status: "draft", additionalImages: allAdditionalImages };
      const savedProperty = await apiService.createPropertyDraft(draftData);
      console.log("Draft saved:", savedProperty);
      alert("Draft saved!");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cities = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda"];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/properties">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">New Property</h1>
                <p className="text-sm text-muted-foreground">Add a new property to the portfolio</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="luxury" form="property-form" type="submit" disabled={isLoading}>
                <Building className="w-4 h-4 mr-2" />
                {isLoading ? "Creating..." : "Create Property"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <form id="property-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="E.g., Luxury Marina Villa"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Type *</label>
                    {/* ✅ Select dynamique */}
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {/* ✅ Champ pour ajouter un type custom */}
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomType())}
                        placeholder="Add a new type..."
                        className="text-sm h-8"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCustomType}
                        className="h-8 px-2 flex-shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Les types ajoutés sont sauvegardés automatiquement
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price (MAD) *</label>
                    <Input
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="2500000"
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) =>
                      handleInputChange({ target: { name: "description", value: content } } as any)
                    }
                    placeholder="Detailed property description..."
                    uploadFolder="orchid/properties"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use the toolbar to format your text (bold, italic, lists, links, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">District/Area *</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="E.g., Marina, Souissi"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Square className="w-5 h-5" />
                  <span>Property Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bedrooms *</label>
                    <Input name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="3" type="number" min="0" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bathrooms *</label>
                    <Input name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="2" type="number" min="0" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Area (m²) *</label>
                    <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="180" type="number" min="0" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Year Built</label>
                    <Input name="yearBuilt" value={formData.yearBuilt} onChange={handleInputChange} placeholder="2020" type="number" min="1900" max={new Date().getFullYear()} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Parking Spaces</label>
                    <Input name="parking" value={formData.parking} onChange={handleInputChange} placeholder="2" type="number" min="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Amenities</label>
                  <Textarea name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Air conditioning, Heating..." rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Main Image *</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" id="main-image-upload" />
                      <label htmlFor="main-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose main image
                      </label>
                      {mainImageFile && <span className="text-sm text-muted-foreground">{mainImageFile.name}</span>}
                      {isUploadingMain && (
                        <div className="w-full mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-foreground mb-2">Or use image URL</label>
                      <Input name="mainImage" value={formData.mainImage} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                  {(mainImagePreview || formData.mainImage) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Main image preview:</p>
                      <img src={mainImagePreview || formData.mainImage} alt="Preview" className="w-full h-48 object-cover rounded-lg border" onError={(e) => { e.currentTarget.src = "/api/placeholder/600/400"; }} />
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Additional Images</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="hidden" id="additional-images-upload" />
                      <label htmlFor="additional-images-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Add images
                      </label>
                      <span className="text-sm text-muted-foreground">{additionalImageFiles.length} image(s)</span>
                      {isUploadingAdditional && <span className="text-xs text-primary animate-pulse ml-2">Uploading...</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Or use image URLs (one per line)</label>
                      <Textarea
                        name="additionalImages"
                        value={formData.additionalImages.join("\n")}
                        onChange={(e) => {
                          const urls = e.target.value.split("\n").map((url) => url.trim()).filter((url) => url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image")));
                          setFormData((prev) => ({ ...prev, additionalImages: urls }));
                        }}
                        placeholder="https://example.com/image1.jpg"
                        rows={3}
                      />
                    </div>
                    {additionalImagePreviews.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Image previews:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {additionalImagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                              <button type="button" onClick={() => removeAdditionalImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* SEO */}
            <Card>
              <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <TrendingUp className="w-5 h-5" />
                  <span>SEO</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                     SEO Title
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formData.seoTitle.length}/60)
                      </span>
                    </label>
                    <Input
                     name="seoTitle"
                     value={formData.seoTitle}
                     onChange={handleInputChange}
                     placeholder="Ex : Villa de luxe à Marrakech — Orchid"
                     maxLength={60}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mot-clé principal
                    </label>
                    <Input
                     name="focusKeyword"
                     value={formData.focusKeyword}
                      onChange={handleInputChange}
                     placeholder="Ex : villa luxe Marrakech"
                    />
                  </div>
                </div>
                    
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                   Meta Description
                   <span className="ml-2 text-xs text-muted-foreground">
                     ({formData.metaDescription.length}/160)
                   </span>
                  </label>
                  <Textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Courte description pour Google (120–160 caractères recommandés)"
                    rows={3}
                    maxLength={160}
                  />
                </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Slug (URL)
        </label>
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="villa-luxe-marrakech"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Minuscules, tirets uniquement, sans espaces
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Image Alt Text
        </label>
        <Input
          name="imageAlt"
          value={formData.imageAlt}
          onChange={handleInputChange}
          placeholder="Ex : Villa de luxe avec piscine à Marrakech"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Open Graph Title
        </label>
        <Input
          name="ogTitle"
          value={formData.ogTitle}
          onChange={handleInputChange}
          placeholder="Titre pour Facebook / LinkedIn"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Twitter Card Title
        </label>
        <Input
          name="twitterTitle"
          value={formData.twitterTitle}
          onChange={handleInputChange}
          placeholder="Titre pour Twitter / X"
        />
      </div>
    </div>
  </CardContent>
</Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Status & Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Assigned User *</label>
                  <select name="person" value={formData.person} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border text-sm" required disabled={adminsLoading}>
                    <option value="">{adminsLoading ? "Loading..." : "Select user"}</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin.name}>{admin.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "featured", label: "Featured Property" },
                    { name: "garden", label: "Garden" },
                    { name: "pool", label: "Pool" },
                    { name: "security", label: "24/7 Security" },
                    { name: "furnished", label: "Furnished" },
                  ].map(({ name, label }) => (
                    <label key={name} className="flex items-center space-x-2">
                      <input type="checkbox" name={name} checked={formData[name as keyof PropertyFormData] as boolean} onChange={handleInputChange} className="rounded border-input" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* SEO Analysis */}
              <Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <TrendingUp className="w-5 h-5" />
      <span>SEO Analysis</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <SEOAnalyzer
      seoTitle={formData.seoTitle}
      metaDescription={formData.metaDescription}
      slug={formData.slug}
      focusKeyword={formData.focusKeyword}
      content={formData.description}
      image={formData.mainImage}
      imageAlt={formData.imageAlt}
      ogTitle={formData.ogTitle}
      twitterTitle={formData.twitterTitle}
    />
  </CardContent>
</Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.featured && <Badge className="luxury-gradient text-white">Featured</Badge>}
                  <h3 className="font-bold text-foreground">{formData.title || "Property Title"}</h3>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{formData.location && formData.city ? `${formData.location}, ${formData.city}` : "Location"}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-primary">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold">{formData.price ? `${parseInt(formData.price).toLocaleString()} MAD` : "Price"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1"><Bed className="w-4 h-4" /><span>{formData.bedrooms || "0"}</span></div>
                    <div className="flex items-center space-x-1"><Bath className="w-4 h-4" /><span>{formData.bathrooms || "0"}</span></div>
                    <div className="flex items-center space-x-1"><Square className="w-4 h-4" /><span>{formData.area || "0"}m²</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddProperty;
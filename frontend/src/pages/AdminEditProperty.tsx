import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building, Save, Eye, ArrowLeft, Upload, MapPin, DollarSign,
  Bed, Bath, Square, Star, Camera, Trash2, TrendingUp, Video, Plus, X,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiService, PropertyFormData } from "@/services/api";
import { uploadToCloudinary, uploadVideoToCloudinary } from "@/services/cloudinary";
import RichTextEditor from "@/components/RichTextEditor";
import SEOAnalyzer from "@/components/Seoanalyzer";

// ─── Clé localStorage ─────────────────────────────────────────────────────────
const STORAGE_KEY = "orchid_property_types";

const BASE_PROPERTY_TYPES = [
  "Villa", "Penthouse", "Chalet", "Riad", "Hotel",
  "Apartment", "House", "Studio", "Duplex", "Triplex",
  "Land", "Mall", "Office", "Warehouse", "Resort",
];

// ─── Villes de suggestion ─────────────────────────────────────────────────────
const SUGGESTED_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier",
  "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
  "Safi", "El Jadida", "Beni Mellal", "Nador", "Settat",
];

// ─── Devises disponibles ──────────────────────────────────────────────────────
const CURRENCIES = [
  { value: "MAD", label: "MAD", symbol: "د.م." },
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
];

// ─── Hook types de propriété ──────────────────────────────────────────────────
function usePropertyTypes() {
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const custom: string[] = stored ? JSON.parse(stored) : [];
      return [...new Set([...BASE_PROPERTY_TYPES, ...custom])];
    } catch {
      return BASE_PROPERTY_TYPES;
    }
  });

  const [newType, setNewType] = useState("");

  const addCustomType = () => {
    const trimmed = newType.trim();
    if (!trimmed) return;
    const alreadyExists = propertyTypes.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) { setNewType(""); return; }
    const updated = [...propertyTypes, trimmed];
    setPropertyTypes(updated);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const custom: string[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...custom, trimmed]));
    } catch { console.error("localStorage write failed"); }
    setNewType("");
  };

  return { propertyTypes, newType, setNewType, addCustomType };
}

// ─── Combobox City ────────────────────────────────────────────────────────────
interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

function CityCombobox({ value, onChange }: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = SUGGESTED_CITIES.filter((c) =>
    c.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => { setInputValue(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (city: string) => {
    setInputValue(city);
    onChange(city);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={inputValue}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder="Type or select a city..."
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-input rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((city) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                city === value ? "bg-accent/50 font-medium" : ""
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const AdminEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "", description: "", price: "", location: "", city: "",
    type: "", bedrooms: "", bathrooms: "", area: "", status: "available",
    featured: false, mainImage: "", additionalImages: [],
    videos: [],               // ✅
    currency: "MAD",          // ✅
    amenities: "", yearBuilt: "", parking: "",
    garden: false, pool: false, security: false, furnished: false,
    person: "admin",
    seoTitle: "", metaDescription: "", slug: "",
    focusKeyword: "", imageAlt: "", ogTitle: "", twitterTitle: "",
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ États vidéo
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const { propertyTypes, newType, setNewType, addCustomType } = usePropertyTypes();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }
    loadPropertyData();
  }, [navigate, id]);

  const loadPropertyData = async () => {
    if (!id) {
      alert("Property ID missing");
      navigate("/admin/properties");
      return;
    }
    setIsLoadingData(true);
    try {
      const propertyData = await apiService.getPropertyById(id);
      const loaded: PropertyFormData = {
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price.toString(),
        currency: (propertyData.currency as "MAD" | "USD" | "EUR") || "MAD", // ✅
        location: propertyData.location,
        city: propertyData.city,
        type: propertyData.type,
        bedrooms: propertyData.bedrooms.toString(),
        bathrooms: propertyData.bathrooms.toString(),
        area: propertyData.area.toString(),
        status: propertyData.status,
        featured: propertyData.featured,
        mainImage: propertyData.mainImage,
        additionalImages: propertyData.additionalImages || [],
        videos: propertyData.videos || [],                                     // ✅
        amenities: propertyData.amenities?.join(", ") || "",
        yearBuilt: propertyData.yearBuilt ? propertyData.yearBuilt.toString() : "",
        parking: propertyData.parking,
        garden: propertyData.garden,
        pool: propertyData.pool,
        security: propertyData.security,
        furnished: propertyData.furnished,
        person: propertyData.person || "admin",
        seoTitle: propertyData.seoTitle || "",
        metaDescription: propertyData.metaDescription || "",
        slug: propertyData.slug || "",
        focusKeyword: propertyData.focusKeyword || "",
        imageAlt: propertyData.imageAlt || "",
        ogTitle: propertyData.ogTitle || "",
        twitterTitle: propertyData.twitterTitle || "",
      };
      setFormData(loaded);
      setMainImagePreview(propertyData.mainImage);
      if (propertyData.additionalImages?.length > 0) {
        setAdditionalImagePreviews(propertyData.additionalImages);
      }
      // ✅ Charger les vidéos existantes dans les previews
      if (propertyData.videos?.length > 0) {
        setVideoPreviews(propertyData.videos);
      }
    } catch (error: any) {
      console.error("Error loading property:", error);
      alert("Error loading data");
      navigate("/admin/properties");
    } finally {
      setIsLoadingData(false);
    }
  };

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
      const result = await uploadToCloudinary(file, "orchid/properties", (percent) => setUploadProgress(percent));
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
        setAdditionalImagePreviews((prev) => prev.map((p) => (p === localPreview ? result.url : p)));
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        setAdditionalImagePreviews((prev) => prev.filter((p) => p !== localPreview));
        alert(`Failed to upload "${file.name}". Please try again.`);
      }
    }
    setIsUploadingAdditional(false);
  };

  // ✅ Upload vidéo
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    for (const file of files) {
      const localPreview = URL.createObjectURL(file);
      setVideoPreviews((prev) => [...prev, localPreview]);
      try {
        const result = await uploadVideoToCloudinary(
          file,
          "orchid/properties/videos",
          (percent) => setVideoUploadProgress(percent)
        );
        setVideoPreviews((prev) =>
          prev.map((p) => (p === localPreview ? result.url : p))
        );
        setFormData((prev) => ({ ...prev, videos: [...prev.videos, result.url] }));
      } catch (error) {
        console.error(`Video upload error for ${file.name}:`, error);
        setVideoPreviews((prev) => prev.filter((p) => p !== localPreview));
        alert(`Failed to upload video "${file.name}". Please try again.`);
      }
    }
    setIsUploadingVideo(false);
    setVideoUploadProgress(0);
  };

  const removeVideo = (index: number) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);
    try {
      const allImages = [...additionalImagePreviews, ...formData.additionalImages];
      const finalData = { ...formData, additionalImages: allImages };
      await apiService.updateProperty(id, finalData);
      alert("Property updated!");
      navigate("/admin/properties");
    } catch (error: any) {
      console.error("Error updating property:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const allImages = [...additionalImagePreviews, ...formData.additionalImages];
      const draftData = { ...formData, status: "draft", additionalImages: allImages };
      await apiService.updateProperty(id, draftData);
      alert("Draft saved!");
      navigate("/admin/properties");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Delete this property?")) {
      setIsLoading(true);
      try {
        await apiService.deleteProperty(id);
        alert("Property deleted!");
        navigate("/admin/properties");
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Devise sélectionnée
  const selectedCurrency = CURRENCIES.find((c) => c.value === formData.currency) || CURRENCIES[0];

  if (isLoadingData) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Building className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/admin/properties">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </a>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Edit Property</h1>
                <p className="text-sm text-muted-foreground">ID: {id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />DELETE
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />{isLoading ? "Saving..." : "Save Draft"}
              </Button>
              <Button variant="luxury" form="property-form" type="submit" disabled={isLoading}>
                <Building className="w-4 h-4 mr-2" />{isLoading ? "Updating..." : "Update"}
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
                  <Building className="w-5 h-5" /><span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="E.g., Luxury Marina Villa" required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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

                  {/* ✅ Prix + Devise */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price *</label>
                    <div className="flex">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="h-10 px-2 rounded-l-md border border-r-0 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <Input
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="2500000"
                        type="number"
                        required
                        className="rounded-l-none flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Devise sélectionnée : {selectedCurrency.symbol} ({selectedCurrency.label})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) => handleInputChange({ target: { name: "description", value: content } } as any)}
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
                  <MapPin className="w-5 h-5" /><span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* ✅ Combobox City */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                    <CityCombobox
                      value={formData.city}
                      onChange={(val) => setFormData((prev) => ({ ...prev, city: val }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Select from suggestions or type any city
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">District/Area *</label>
                    <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="E.g., Marina, Souissi" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Square className="w-5 h-5" /><span>Details</span>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Parking</label>
                    <Input name="parking" value={formData.parking} onChange={handleInputChange} placeholder="2" type="number" min="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Amenities</label>
                  <Textarea name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Air conditioning, Heating..." rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Images & Vidéos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" /><span>Images & Videos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Main Image *</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" id="main-image-upload" />
                      <label htmlFor="main-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Upload className="w-4 h-4 mr-2" />Change Image
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
                      <label className="block text-sm font-medium text-foreground mb-2">Edit Image URL</label>
                      <Input name="mainImage" value={formData.mainImage} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                  {(mainImagePreview || formData.mainImage) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Current Image:</p>
                      <img src={mainImagePreview || formData.mainImage} alt="Preview" className="w-full h-48 object-cover rounded-lg border" onError={(e) => { e.currentTarget.src = "/api/placeholder/600/400"; }} />
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Additional Images</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="hidden" id="additional-images-upload" />
                      <label htmlFor="additional-images-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Upload className="w-4 h-4 mr-2" />Add Images
                      </label>
                      <span className="text-sm text-muted-foreground">{additionalImageFiles.length} new</span>
                      {isUploadingAdditional && <span className="text-xs text-primary animate-pulse ml-2">Uploading...</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Edit URLs (one per line)</label>
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
                        <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
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

                {/* ✅ Videos */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoChange}
                        className="hidden"
                        id="videos-upload"
                      />
                      <label
                        htmlFor="videos-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add / Replace video(s)
                      </label>
                      <span className="text-sm text-muted-foreground">{formData.videos.length} video(s)</span>
                      {isUploadingVideo && (
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${videoUploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading video... {videoUploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formats acceptés : MP4, MOV, AVI, WebM — stockés sur Cloudinary
                    </p>

                    {videoPreviews.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videoPreviews.map((src, index) => (
                          <div key={index} className="relative rounded-lg border overflow-hidden bg-black">
                            <video src={src} controls className="w-full h-40 object-contain" />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
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
                  <TrendingUp className="w-5 h-5" /><span>SEO</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      SEO Title
                      <span className="ml-2 text-xs text-muted-foreground">({formData.seoTitle.length}/60)</span>
                    </label>
                    <Input name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} placeholder="Ex : Villa de luxe à Marrakech — Orchid" maxLength={60} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mot-clé principal</label>
                    <Input name="focusKeyword" value={formData.focusKeyword} onChange={handleInputChange} placeholder="Ex : villa luxe Marrakech" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Description
                    <span className="ml-2 text-xs text-muted-foreground">({formData.metaDescription.length}/160)</span>
                  </label>
                  <Textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} placeholder="Courte description pour Google (120–160 caractères recommandés)" rows={3} maxLength={160} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
                    <Input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="villa-luxe-marrakech" />
                    <p className="text-xs text-muted-foreground mt-1">Minuscules, tirets uniquement, sans espaces</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Image Alt Text</label>
                    <Input name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} placeholder="Ex : Villa de luxe avec piscine à Marrakech" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Open Graph Title</label>
                    <Input name="ogTitle" value={formData.ogTitle} onChange={handleInputChange} placeholder="Titre pour Facebook / LinkedIn" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Twitter Card Title</label>
                    <Input name="twitterTitle" value={formData.twitterTitle} onChange={handleInputChange} placeholder="Titre pour Twitter / X" />
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
                  <Star className="w-5 h-5" /><span>Status & Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "featured", label: "Featured" },
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
                  <TrendingUp className="w-5 h-5" /><span>SEO Analysis</span>
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

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" /><span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.featured && <Badge className="luxury-gradient text-white">Featured</Badge>}
                  <h3 className="font-bold text-foreground">{formData.title || "Title"}</h3>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{formData.location && formData.city ? `${formData.location}, ${formData.city}` : "Location"}</span>
                  </div>
                  {/* ✅ Prix + devise dans la preview */}
                  <div className="flex items-center space-x-1 text-primary">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold">
                      {formData.price
                        ? `${parseInt(formData.price).toLocaleString()} ${formData.currency}`
                        : "Price"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1"><Bed className="w-4 h-4" /><span>{formData.bedrooms || "0"}</span></div>
                    <div className="flex items-center space-x-1"><Bath className="w-4 h-4" /><span>{formData.bathrooms || "0"}</span></div>
                    <div className="flex items-center space-x-1"><Square className="w-4 h-4" /><span>{formData.area || "0"}m²</span></div>
                  </div>
                  {/* ✅ Indicateur vidéos */}
                  {formData.videos.length > 0 && (
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                      <Video className="w-4 h-4" />
                      <span>{formData.videos.length} video{formData.videos.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminEditProperty;
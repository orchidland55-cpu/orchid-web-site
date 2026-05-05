import { useState, useEffect, useRef } from "react"; // ✅ Added useRef
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Keep for other fields
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
  // ✅ Toolbar icons
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  ImageIcon, // Renamed to avoid conflict
  Quote,
  Palette,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import RichTextEditor from "@/components/RichTextEditor";


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
    additionalImages: [], // array
    amenities: "",
    yearBuilt: "",
    parking: "",
    garden: false,
    pool: false,
    security: false,
    furnished: false,
    person: ""
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ État pour les admins dynamiques
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await apiService.getAdmins();
        setAdmins(data);
      } catch (error) {
        console.error('Erreur chargement admins:', error);
      } finally {
        setAdminsLoading(false);
      }
    };
    loadAdmins();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);
   setMainImagePreview(URL.createObjectURL(file)); // preview local immédiat
    setIsUploadingMain(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(
        file,
        "orchid/properties",
       (percent) => setUploadProgress(percent)
      );
      setFormData(prev => ({ ...prev, mainImage: result.url }));
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

    setAdditionalImageFiles(prev => [...prev, ...files]);
    setIsUploadingAdditional(true);

    for (const file of files) {
      // Preview local immédiat
      const localPreview = URL.createObjectURL(file);
      setAdditionalImagePreviews(prev => [...prev, localPreview]);

      try {
        const result = await uploadToCloudinary(file, "orchid/properties");
       // Remplace le preview local par l'URL Cloudinary
        setAdditionalImagePreviews(prev =>
          prev.map(p => (p === localPreview ? result.url : p))
        );
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        // Supprime le preview si l'upload échoue
        setAdditionalImagePreviews(prev => prev.filter(p => p !== localPreview));
        alert(`Failed to upload "${file.name}". Please try again.`);
      }
    }

    setIsUploadingAdditional(false);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    // Combine uploaded images (base64) and existing URLs in formData
    const allAdditionalImages = [...additionalImagePreviews, ...formData.additionalImages];

    // Create final data object
    const finalData = {
      ...formData,
      additionalImages: allAdditionalImages, // <-- Array of images
    };

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
    // Combine images
    const allAdditionalImages = [...additionalImagePreviews, ...formData.additionalImages];

    const draftData = {
      ...formData,
      status: "draft",
      additionalImages: allAdditionalImages, // <-- Array of images
    };

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

  const propertyTypes = [
    "Villa",
    "Penthouse",
    "Chalet",
    "Riad",
    "Hotel",
    "Apartment",
    "House",
    "Studio",
    "Duplex",
    "Triplex",
    "Land",
    "Mall"
  ];

  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fes",
    "Tangier",
    "Agadir",
    "Meknes",
    "Oujda"
  ];

  return (
    // <PageTransition>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property Title *
                    </label>
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
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Property Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                      >
                        <option value="">Select type</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price (MAD) *
                      </label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    {/* ✅ Replace Textarea with RichTextEditor (integrated above) */}
                    <RichTextEditor
                      value={formData.description}
                      onChange={(content) => handleInputChange({ target: { name: 'description', value: content } } as any)}
                      placeholder="Detailed property description..."
                      uploadFolder="orchid/properties"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Use the toolbar to format your text (bold, italic, lists, links, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>

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
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        District/Area *
                      </label>
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
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bedrooms *
                      </label>
                      <Input
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="3"
                        type="number"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bathrooms *
                      </label>
                      <Input
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="2"
                        type="number"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Area (m²) *
                      </label>
                      <Input
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="180"
                        type="number"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Year Built
                      </label>
                      <Input
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        placeholder="2020"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Parking Spaces
                      </label>
                      <Input
                        name="parking"
                        value={formData.parking}
                        onChange={handleInputChange}
                        placeholder="2"
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amenities
                    </label>
                    <Textarea
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      placeholder="Air conditioning, Heating..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Images</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Main Image *
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose main image
                        </label>
                        {mainImageFile && (
                          <span className="text-sm text-muted-foreground">
                           {mainImageFile.name}
                         </span>
                        )}
                        {isUploadingMain && (
                          <div className="w-full mt-2">
                           <div className="bg-gray-200 rounded-full h-2">
                             <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                               style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                           <p className="text-xs text-muted-foreground mt-1">
                             Uploading... {uploadProgress}%
                           </p>
                          </div>
                        )}
                      </div>
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Or use image URL
                        </label>
                        <Input
                          name="mainImage"
                          value={formData.mainImage}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    {(mainImagePreview || formData.mainImage) && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground mb-2">Main image preview:</p>
                        <img
                          src={mainImagePreview || formData.mainImage}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = "/api/placeholder/600/400";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Additional Images
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImagesChange}
                          className="hidden"
                          id="additional-images-upload"
                        />
                        <label
                          htmlFor="additional-images-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Add images
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {additionalImageFiles.length} image(s)
                        </span>
                        {isUploadingAdditional && (
                          <span className="text-xs text-primary animate-pulse ml-2">
                            Uploading...
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Or use image URLs (one per line)
                        </label>
                        <Textarea
                          name="additionalImages"
                          value={formData.additionalImages.join('\n')}
                          onChange={(e) => {
                            const urls = e.target.value
                              .split('\n')
                              .map(url => url.trim())
                              .filter(url => url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')));
                            setFormData(prev => ({
                              ...prev,
                              additionalImages: urls
                            }));
                          }}
                          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                          rows={3}
                        />
                      </div>
                      {additionalImagePreviews.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Image previews:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {additionalImagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeAdditionalImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Assigned Admin *
                    </label>
                    <select
                      name="person"
                      value={formData.person}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border text-sm"
                      required
                      disabled={adminsLoading}
                    >
                      <option value="">
                        {adminsLoading ? "Loading..." : "Select admin"}
                      </option>
                      {admins.map((admin) => (
                        <option key={admin._id} value={admin.name}>
                          {admin.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Featured Property</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="garden"
                        checked={formData.garden}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Garden</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pool"
                        checked={formData.pool}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Pool</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="security"
                        checked={formData.security}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">24/7 Security</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="furnished"
                        checked={formData.furnished}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Furnished</span>
                    </label>
                  </div>
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
                    {formData.featured && (
                      <Badge className="luxury-gradient text-white">Featured</Badge>
                    )}
                    <h3 className="font-bold text-foreground">
                      {formData.title || "Property Title"}
                    </h3>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {formData.location && formData.city 
                          ? `${formData.location}, ${formData.city}`
                          : "Location"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">
                        {formData.price ? `${parseInt(formData.price).toLocaleString()} MAD` : "Price"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" />
                        <span>{formData.bedrooms || "0"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" />
                        <span>{formData.bathrooms || "0"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4" />
                        <span>{formData.area || "0"}m²</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    // </PageTransition>
    
  );
};

export default AdminAddProperty;
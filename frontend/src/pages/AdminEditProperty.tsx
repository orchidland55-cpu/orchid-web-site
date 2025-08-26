import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Trash2
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AdminEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
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
    additionalImages: "",
    amenities: "",
    yearBuilt: "",
    parking: "",
    garden: false,
    pool: false,
    security: false,
    furnished: false
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }

    loadPropertyData();
  }, [navigate, id]);

  const loadPropertyData = async () => {
    setIsLoadingData(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample data - in real app, this would come from API
    const sampleProperties: { [key: string]: any } = {
      "1": {
        title: "Villa Luxury Marina",
        description: "Magnifique villa de luxe située dans le prestigieux quartier de la Marina à Casablanca. Cette propriété exceptionnelle offre une vue imprenable sur l'océan et dispose de finitions haut de gamme.",
        price: "2500000",
        location: "Marina",
        city: "Casablanca",
        type: "Villa",
        bedrooms: "5",
        bathrooms: "4",
        area: "450",
        status: "available",
        featured: true,
        mainImage: "/api/placeholder/600/400",
        additionalImages: "/api/placeholder/400/300,/api/placeholder/400/300,/api/placeholder/400/300",
        amenities: "Climatisation, Chauffage central, Cuisine équipée, Terrasse, Vue sur mer, Garage",
        yearBuilt: "2020",
        parking: "3",
        garden: true,
        pool: true,
        security: true,
        furnished: false
      },
      "2": {
        title: "Penthouse Souissi",
        description: "Penthouse d'exception dans le quartier résidentiel de Souissi à Rabat. Appartement de standing avec terrasse panoramique et prestations de luxe.",
        price: "1800000",
        location: "Souissi",
        city: "Rabat",
        type: "Penthouse",
        bedrooms: "4",
        bathrooms: "3",
        area: "320",
        status: "sold",
        featured: false,
        mainImage: "/api/placeholder/600/400",
        additionalImages: "/api/placeholder/400/300,/api/placeholder/400/300",
        amenities: "Climatisation, Ascenseur, Terrasse, Parking souterrain",
        yearBuilt: "2019",
        parking: "2",
        garden: false,
        pool: false,
        security: true,
        furnished: true
      }
    };

    const propertyData = sampleProperties[id as string];
    if (propertyData) {
      setFormData(propertyData);
      setMainImagePreview(propertyData.mainImage);
      
      // Set additional images previews
      if (propertyData.additionalImages) {
        const additionalUrls = propertyData.additionalImages.split(',').filter((url: string) => url.trim());
        setAdditionalImagePreviews(additionalUrls);
      }
    } else {
      alert("Propriété non trouvée");
      navigate("/admin/properties");
    }
    
    setIsLoadingData(false);
  };

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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMainImagePreview(result);
        setFormData(prev => ({
          ...prev,
          mainImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAdditionalImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAdditionalImagePreviews(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Updated property data:", formData);
    alert("Propriété mise à jour avec succès !");
    navigate("/admin/properties");
    
    setIsLoading(false);
  };

  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, status: "draft" }));
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Brouillon sauvegardé !");
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.")) {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Propriété supprimée avec succès !");
      navigate("/admin/properties");
    }
  };

  const propertyTypes = [
    "Villa",
    "Penthouse",
    "Appartement",
    "Maison",
    "Studio",
    "Duplex",
    "Triplex",
    "Terrain"
  ];

  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda"
  ];

  if (isLoadingData) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Building className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Chargement de la propriété...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/properties">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux propriétés
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Modifier la Propriété</h1>
                  <p className="text-sm text-muted-foreground">ID: {id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder brouillon
                </Button>
                <Button variant="luxury" form="property-form" type="submit" disabled={isLoading}>
                  <Building className="w-4 h-4 mr-2" />
                  {isLoading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <form id="property-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Informations de base</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Titre de la propriété *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Villa Luxury Marina avec vue sur mer"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Type de propriété *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Prix (MAD) *
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
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description détaillée de la propriété..."
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Localisation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Ville *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                      >
                        <option value="">Sélectionner une ville</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Quartier/Zone *
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Ex: Marina, Souissi, Hivernage"
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
                    <span>Détails de la propriété</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Chambres *
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
                        Salles de bain *
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
                        Surface (m²) *
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
                        Année de construction
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
                        Places de parking
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
                      Équipements
                    </label>
                    <Textarea
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      placeholder="Climatisation, Chauffage central, Cuisine équipée..."
                      rows={3}
                    />
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
                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Image principale *
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
                          Changer image principale
                        </label>
                        {mainImageFile && (
                          <span className="text-sm text-muted-foreground">
                            {mainImageFile.name}
                          </span>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ou modifier l'URL d'image
                        </label>
                        <Input
                          name="mainImage"
                          value={formData.mainImage}
                          onChange={handleInputChange}
                          placeholder="https://exemple.com/image.jpg"
                        />
                      </div>
                    </div>

                    {(mainImagePreview || formData.mainImage) && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground mb-2">Image principale actuelle:</p>
                        <img
                          src={mainImagePreview || formData.mainImage}
                          alt="Aperçu"
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = "/api/placeholder/600/400";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Images supplémentaires
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
                          Ajouter des images
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {additionalImageFiles.length} nouvelle(s) image(s) sélectionnée(s)
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ou modifier les URLs d'images
                        </label>
                        <Textarea
                          name="additionalImages"
                          value={formData.additionalImages}
                          onChange={handleInputChange}
                          placeholder="URLs des images séparées par des virgules"
                          rows={3}
                        />
                      </div>

                      {/* Additional Images Preview */}
                      {additionalImagePreviews.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Images supplémentaires:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {additionalImagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Aperçu ${index + 1}`}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Statut & Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Statut de la propriété
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="available">Disponible</option>
                      <option value="sold">Vendu</option>
                      <option value="pending">En attente</option>
                      <option value="draft">Brouillon</option>
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
                      <span className="text-sm font-medium">Propriété vedette</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="garden"
                        checked={formData.garden}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Jardin</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pool"
                        checked={formData.pool}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Piscine</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="security"
                        checked={formData.security}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Sécurité 24h/24</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="furnished"
                        checked={formData.furnished}
                        onChange={handleInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium">Meublé</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Aperçu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.featured && (
                      <Badge className="luxury-gradient text-white">Vedette</Badge>
                    )}
                    <h3 className="font-bold text-foreground">
                      {formData.title || "Titre de la propriété"}
                    </h3>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {formData.location && formData.city 
                          ? `${formData.location}, ${formData.city}`
                          : "Localisation"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">
                        {formData.price ? `${parseInt(formData.price).toLocaleString()} MAD` : "Prix"}
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
    </PageTransition>
  );
};

export default AdminEditProperty;

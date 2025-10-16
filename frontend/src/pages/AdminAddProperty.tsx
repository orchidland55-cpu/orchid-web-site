import { useState, useEffect, useRef } from "react"; // ✅ Added useRef
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Keep for other fields
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, PropertyFormData } from "@/services/api";
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

// ✅ RichTextEditor component integrated directly here — no separate file
const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      editorRef.current.innerHTML = value || '';
      setIsEditorReady(true);
    }
  }, [value, isEditorReady]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const changeFontSize = (size) => {
    executeCommand('fontSize', size);
  };

  const changeTextColor = () => {
    const color = prompt('Enter color (e.g., #ff0000 or red):');
    if (color) {
      executeCommand('foreColor', color);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="border-b border-border p-2 bg-muted/30">
        <div className="flex flex-wrap items-center gap-1">
          {/* Font Size */}
          <select
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-2 py-1 text-xs border border-border rounded bg-background"
            title="Font Size"
          >
            <option value="">Size</option>
            <option value="1">Very Small</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">Very Large</option>
            <option value="6">Huge</option>
          </select>
          {/* Heading Style */}
          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="px-2 py-1 text-xs border border-border rounded bg-background ml-1"
            title="Style"
          >
            <option value="">Style</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="p">Paragraph</option>
          </select>
          <div className="w-px h-6 bg-border mx-1"></div>
          {/* Formatting Buttons */}
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(button.command, button.value)}
              className="p-1 h-8 w-8"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
          <div className="w-px h-6 bg-border mx-1"></div>
          {/* Special Buttons */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={changeTextColor}
            className="p-1 h-8 w-8"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="p-1 h-8 w-8"
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="p-1 h-8 w-8"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Editing Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none rich-text-content"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          [contentEditable]:empty:before {
            content: attr(data-placeholder);
            color: hsl(var(--muted-foreground));
            font-style: italic;
          }
          [contentEditable]:focus:before {
            content: none;
          }
          /* Editor element styles */
          .rich-text-content h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h4 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content p { margin: 0.5em 0; line-height: 1.6; }
          .rich-text-content ul, .rich-text-content ol { margin: 0.5em 0; padding-left: 2em; }
          .rich-text-content li { margin: 0.25em 0; }
          .rich-text-content blockquote { 
            border-left: 4px solid hsl(var(--border)); 
            padding-left: 1em; 
            margin: 1em 0; 
            font-style: italic; 
            color: hsl(var(--muted-foreground)); 
          }
          .rich-text-content a { color: hsl(var(--primary)); text-decoration: underline; }
          .rich-text-content img { max-width: 100%; height: auto; margin: 1em 0; }
          .rich-text-content strong { font-weight: bold; }
          .rich-text-content em { font-style: italic; }
          .rich-text-content u { text-decoration: underline; }
        `
      }} />
    </div>
  );
};

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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

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

  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions - higher quality settings
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Enable image smoothing for better quality
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = 'high';

        // Draw and compress image with higher quality
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with higher quality (90%)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAdditionalImageFiles(prev => [...prev, ...files]);

      for (const file of files) {
        try {
          console.log(`🔄 Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

          // Compress the image
          const compressedBase64 = await compressImage(file, 800, 0.8);

          console.log(`✅ Image compressed: ${file.name}, New size: ${(compressedBase64.length / 1024 / 1024).toFixed(2)}MB`);

          // Check size limit - increased for higher quality
          if (compressedBase64.length > 3000000) { // 3MB limit for high-quality compressed images
            alert(`Compressed image "${file.name}" is still too large (${(compressedBase64.length / 1024 / 1024).toFixed(2)}MB). Try a smaller image or reduce resolution.`);
            continue;
          }

          setAdditionalImagePreviews(prev => [...prev, compressedBase64]);
        } catch (error) {
          console.error("❌ Compression error for file:", file.name, error);
          alert(`Error: Unable to compress image "${file.name}".`);
        }
      }
    }
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
    "Apartment",
    "House",
    "Studio",
    "Duplex",
    "Triplex",
    "Land"
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
    <PageTransition>
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
                    >
                      <option value="">Select admin</option>
                      <option value="khawla">Profil:1</option>
                      <option value="yassine">Profil:2</option>
                      <option value="mehdi">Profil:3</option>
                      <option value="hiba">Profil:4</option>
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
    </PageTransition>
  );
};

export default AdminAddProperty;
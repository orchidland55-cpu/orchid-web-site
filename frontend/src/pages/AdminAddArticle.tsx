import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Tag,
  User,
  Calendar,
  Globe,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image,
  Quote,
  Type,
  Palette,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { showToast } from "@/components/ToastContainer";
import { apiService, ArticleFormData } from "@/services/api";

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
            <Image className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Editing Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none rich-text-content"
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

const SEOAnalyzer = ({ formData }) => {
  const calculateSEOScore = () => {
    let score = 0;
    const factors = [];

    // SEO Title
    if (formData.seoTitle) {
      if (formData.seoTitle.length >= 30 && formData.seoTitle.length <= 60) {
        score += 20;
        factors.push({ type: 'success', text: 'Optimal SEO title (30-60 characters)' });
      } else {
        factors.push({ type: 'warning', text: `SEO title: ${formData.seoTitle.length} characters (recommended: 30-60)` });
      }
    } else {
      factors.push({ type: 'error', text: 'Missing SEO title' });
    }

    // Meta Description
    if (formData.metaDescription) {
      if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) {
        score += 20;
        factors.push({ type: 'success', text: 'Optimal meta description (120-160 characters)' });
      } else {
        factors.push({ type: 'warning', text: `Meta description: ${formData.metaDescription.length} characters (recommended: 120-160)` });
      }
    } else {
      factors.push({ type: 'error', text: 'Missing meta description' });
    }

    // Slug
    if (formData.slug) {
      score += 15;
      factors.push({ type: 'success', text: 'Custom URL defined' });
    } else {
      factors.push({ type: 'warning', text: 'Custom URL recommended' });
    }

    // Focus Keyword
    if (formData.focusKeyword) {
      score += 15;
      factors.push({ type: 'success', text: 'Primary keyword set' });

      // Check presence in title
      if (formData.seoTitle && formData.seoTitle.toLowerCase().includes(formData.focusKeyword.toLowerCase())) {
        score += 10;
        factors.push({ type: 'success', text: 'Keyword present in SEO title' });
      } else {
        factors.push({ type: 'warning', text: 'Keyword missing from SEO title' });
      }

      // Check presence in meta description
      if (formData.metaDescription && formData.metaDescription.toLowerCase().includes(formData.focusKeyword.toLowerCase())) {
        score += 10;
        factors.push({ type: 'success', text: 'Keyword present in meta description' });
      } else {
        factors.push({ type: 'warning', text: 'Keyword missing from meta description' });
      }
    } else {
      factors.push({ type: 'error', text: 'Missing primary keyword' });
    }

    // Image with alt text
    if (formData.image && formData.imageAlt) {
      score += 10;
      factors.push({ type: 'success', text: 'Image with alt text defined' });
    } else if (formData.image) {
      factors.push({ type: 'warning', text: 'Image without alt text' });
    }

    return { score, factors };
  };

  const { score, factors } = calculateSEOScore();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">SEO Score</h4>
        <div className="flex items-center space-x-2">
          <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
          <span className="text-sm text-muted-foreground">({getScoreLabel(score)})</span>
        </div>
      </div>
      <Progress value={score} className="h-2" />
      <div className="space-y-2">
        {factors.map((factor, index) => (
          <div key={index} className="flex items-start space-x-2 text-sm">
            {factor.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
            {factor.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />}
            {factor.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
            <span className="text-muted-foreground">{factor.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminAddArticle = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    status: "draft",
    image: "",
    person: "",
    // SEO Fields
    seoTitle: "",
    metaDescription: "",
    slug: "",
    focusKeyword: "",
    imageAlt: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    twitterTitle: "",
    twitterDescription: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: autoSlug,
        seoTitle: value.length <= 60 ? value : value.substring(0, 57) + '...'
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setImagePreview(result);
          setFormData((prev) => ({
            ...prev,
            image: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.excerpt.trim()) {
        throw new Error("Excerpt is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }
      if (!formData.person.trim()) {
        throw new Error("Admin is required");
      }
      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }

      const articleData: ArticleFormData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author || "Unknown Author",
        person: formData.person,
        category: formData.category,
        status: formData.status,
        featured: false,
        image: formData.image || "",
        tags: formData.tags || "",
      };

      await apiService.createArticle(articleData);

      showToast({
        type: "success",
        title: "Article Created",
        message: "The article was successfully created!",
        duration: 3000,
      });

      navigate("/admin/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      showToast({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Unable to create article. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const articleData: ArticleFormData = {
        title: formData.title || "",
        excerpt: formData.excerpt || "",
        content: formData.content || "",
        author: formData.author || "Unknown Author",
        person: formData.person || "",
        category: formData.category || "",
        status: "draft",
        featured: false,
        image: formData.image || "",
        tags: formData.tags || "",
      };

      await apiService.createArticleDraft(articleData);

      showToast({
        type: "info",
        title: "Draft Saved",
        message: "Your draft has been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      showToast({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Unable to save draft.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Market Analysis",
    "Investment",
    "Location Spotlight",
    "Sustainability",
    "Technology",
    "Global Markets",
  ];

  const generatePreviewUrl = () => {
    const baseUrl = "https://monsite.com";
    return `${baseUrl}/${formData.slug || 'article-title'}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/articles">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Articles
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    New Article
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Create a new blog article
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {isLoading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Article Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Article Title *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., Luxury Real Estate Market Trends in 2024"
                      className="text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Article Content *
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Write the full content of your article here. Use the toolbar to format text..."
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Use the toolbar above to format text (bold, italic, lists, links, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>SEO Optimization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      SEO Title *
                    </label>
                    <Input
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      placeholder="Search engine optimized title (30-60 characters)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.seoTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Description *
                    </label>
                    <Textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="A short summary that will appear on the blog page..."
                      rows={3}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Article URL (Slug)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                        monsite.com/
                      </span>
                      <Input
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="article-url"
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Final URL: {generatePreviewUrl()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Primary Keyword
                    </label>
                    <Input
                      name="focusKeyword"
                      value={formData.focusKeyword}
                      onChange={handleInputChange}
                      placeholder="luxury real estate, investment..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The keyword you want to rank for
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Canonical URL (Optional)
                    </label>
                    <Input
                      name="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={handleInputChange}
                      placeholder="https://monsite.com/main-article"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Useful to avoid duplicate content
                    </p>
                  </div>

                  {/* Open Graph */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Social Media Sharing
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Facebook/LinkedIn Title (Optional)
                        </label>
                        <Input
                          name="ogTitle"
                          value={formData.ogTitle}
                          onChange={handleInputChange}
                          placeholder="Title optimized for Facebook and LinkedIn"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Facebook/LinkedIn Description (Optional)
                        </label>
                        <Textarea
                          name="ogDescription"
                          value={formData.ogDescription}
                          onChange={handleInputChange}
                          placeholder="Description for sharing on Facebook and LinkedIn"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Twitter Title (Optional)
                        </label>
                        <Input
                          name="twitterTitle"
                          value={formData.twitterTitle}
                          onChange={handleInputChange}
                          placeholder="Title optimized for Twitter"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Twitter Description (Optional)
                        </label>
                        <Textarea
                          name="twitterDescription"
                          value={formData.twitterDescription}
                          onChange={handleInputChange}
                          placeholder="Description for sharing on Twitter"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Featured Image</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select an image from your computer
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </label>
                        {imageFile && (
                          <span className="text-sm text-muted-foreground">
                            {imageFile.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Accepted formats: JPG, PNG, GIF (recommended: 800x400px)
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Or use an image URL
                      </label>
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Image Alt Text *
                      </label>
                      <Input
                        name="imageAlt"
                        value={formData.imageAlt}
                        onChange={handleInputChange}
                        placeholder="Description for accessibility and SEO"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Important for accessibility and search ranking
                      </p>
                    </div>
                  </div>

                  {(imagePreview || formData.image) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Preview:
                      </p>
                      <img
                        src={imagePreview || formData.image}
                        alt={formData.imageAlt || "Preview"}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+not+found";
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SEO Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>SEO Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SEOAnalyzer formData={formData} />
                </CardContent>
              </Card>

              {/* Article Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Admin *
                    </label>
                    <select
                      name="person"
                      value={formData.person}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                      required
                    >
                      <option value="">Select admin</option>
                      <option value="khawla">Profil:1</option>
                      <option value="mehdi">Profil:2</option>
                      <option value="yassin">Profil:3</option>
                      <option value="hiba">Profil:4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Publication Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Google Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Google Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">
                        {generatePreviewUrl()}
                      </div>
                      <h3 className="text-primary text-lg leading-tight hover:underline cursor-pointer">
                        {formData.seoTitle || formData.title || "Article Title"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-snug">
                        {formData.metaDescription || formData.excerpt || "Article meta description..."}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Preview how this will appear in Google search results
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regular Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Article Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary">
                        {formData.category || "Category"}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-foreground">
                      {formData.title || "Article Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      {formData.metaDescription || formData.excerpt || "Article meta description..."}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date().toLocaleDateString("en-US")}</span>
                      </div>
                    </div>
                    {formData.content && (
                      <div className="mt-4 p-2 bg-muted/50 rounded text-xs">
                        <p className="font-medium mb-2">Content Preview:</p>
                        <div 
                          className="prose prose-xs max-w-none"
                          dangerouslySetInnerHTML={{ __html: formData.content.slice(0, 200) + '...' }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminAddArticle;
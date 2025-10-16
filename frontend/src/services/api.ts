// API service pour la communication avec le backend
const API_BASE_URL = 'http://localhost:3000';

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: string;
  featured: boolean;
  mainImage: string;
  additionalImages: string[];
  amenities: string;
  yearBuilt: string;
  parking: string;
  garden: boolean;
  pool: boolean;
  security: boolean;
  furnished: boolean;
  person: string; // ✅ ajouté
}

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  featured: boolean;
  mainImage: string;
  additionalImages: string[];
  amenities: string[];
  yearBuilt?: number;
  parking: string;
  garden: boolean;
  pool: boolean;
  security: boolean;
  furnished: boolean;
  person: string; // ✅ ajouté
}

export interface Property extends PropertyData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces pour les articles
export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  person: string; // ✅ déjà présent
  category: string;
  status: string;
  featured: boolean;
  image: string;
  tags: string;
}

export interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  person: string; // ✅ déjà présent
  category: string;
  status: string;
  featured: boolean;
  image: string;
  tags: string[];
}

export interface Article extends ArticleData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  readTime?: string;
  views?: number;
  comments?: number;
}

// Interfaces pour les postulations
export interface PostulationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  experience: string;
  motivation: string;
  cv: File;
  coverLetter?: File;
}

export interface PostulationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  experience: string;
  motivation: string;
  cv: string;
  coverLetter?: string;
}

export interface Postulation extends PostulationData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// 🆕 Interface pour les activités récentes — AJOUTÉE ICI ✅
export interface Activity {
  id?: string;
  action: string;
  item: string;
  createdAt: string;
  type: "property" | "blog" | "contact" | "user" | "postulation" | "unknown" | "error"; // ✅ Ajouté "error"
  performedBy: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`; // ✅ API_BASE_URL est accessible ici

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP! status: ${response.status}`;

        switch (response.status) {
          case 413:
            errorMessage = 'Les données sont trop volumineuses. Veuillez réduire la taille des images ou du contenu.';
            break;
          case 400:
            errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
            break;
          case 404:
            errorMessage = 'Propriété non trouvée. Elle a peut-être été supprimée ou l\'ID est incorrect.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          default:
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {}
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de réseau');
    }
  }

  // Convertir les données du formulaire en données pour l'API
  private convertFormDataToApiData(formData: PropertyFormData): PropertyData {
    const description = formData.description.length > 5000
      ? formData.description.substring(0, 5000) + '...'
      : formData.description;

    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity).slice(0, 20)
      : [];

    // ✅ Correction ici : on garde les base64 et les URLs depuis l'array
    const additionalImagesArray = (() => {
      if (Array.isArray(formData.additionalImages) && formData.additionalImages.length > 0) {
        return formData.additionalImages
          .filter(url => url && url.trim() && (url.startsWith('http') || url.startsWith('data:image')))
          .slice(0, 10);
      }
      return [];
    })();

    return {
      title: formData.title.substring(0, 200),
      description,
      price: parseFloat(formData.price) || 0,
      location: formData.location.substring(0, 100),
      city: formData.city.substring(0, 50),
      type: formData.type,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area: parseFloat(formData.area) || 0,
      status: formData.status,
      featured: formData.featured,
      mainImage: formData.mainImage,
      additionalImages: additionalImagesArray,
      amenities: amenitiesArray,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      parking: formData.parking.substring(0, 50),
      garden: formData.garden,
      pool: formData.pool,
      security: formData.security,
      furnished: formData.furnished,
      person: formData.person.substring(0, 100)
    };
  }

  // Méthodes API pour les propriétés
  async getAllProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties');
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.request<Property>(`/properties/${id}`);
    console.log('🔍 API Service - Retrieved property:');
    console.log('🔍 Main image present:', !!property.mainImage);
    console.log('🔍 Main image length:', property.mainImage?.length || 0);
    console.log('🔍 Additional images count:', property.additionalImages?.length || 0);
    console.log('🔍 Additional images type:', Array.isArray(property.additionalImages) ? 'array' : typeof property.additionalImages);
    return property;
  }

  async createProperty(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);

    // Debug: Check the size of the data being sent
    const jsonString = JSON.stringify(propertyData);
    console.log('📤 Sending property data:');
    console.log('📤 Total JSON size:', jsonString.length, 'characters');
    console.log('📤 Main image size:', propertyData.mainImage?.length || 0);
    console.log('📤 Additional images count:', propertyData.additionalImages?.length || 0);
    if (propertyData.additionalImages) {
      console.log('📤 Additional images sizes:', propertyData.additionalImages.map(img => img.length));
    }

    return this.request<Property>('/properties', {
      method: 'POST',
      body: jsonString,
    });
  }

  async createPropertyDraft(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    propertyData.status = 'draft';
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: string, formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Convertir les données du formulaire d'article en données pour l'API
  private convertArticleFormDataToApiData(formData: ArticleFormData): ArticleData {
    return {
      title: formData.title.substring(0, 200),
      content: formData.content,
      excerpt: formData.excerpt.substring(0, 500),
      author: formData.author.substring(0, 100),
      person: formData.person.substring(0, 100), // ✅ déjà présent
      category: formData.category,
      status: formData.status,
      featured: formData.featured,
      image: formData.image,
      tags: formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).slice(0, 10)
        : []
    };
  }

  // Méthodes API pour les articles
  async getAllArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles');
  }

  async getArticleById(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  async createArticle(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async createArticleDraft(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    articleData.status = 'draft';
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: string, formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string): Promise<{ message: string }> {
  // ✅ Récupérer le nom de l'admin depuis le localStorage
  const adminName = localStorage.getItem("adminEmail")?.split("@")[0] || "admin";
  return this.request<{ message: string }>(`/articles/${id}?person=${encodeURIComponent(adminName)}`, {
    method: 'DELETE',
  });
}

  // Méthode utilitaire pour vérifier la connexion au backend
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Méthodes API pour le dashboard
  async getDashboardStats(): Promise<any> {
    return this.request<any>('/dashboard/stats');
  }

  async getDetailedStats(type: string): Promise<any> {
    return this.request<any>(`/dashboard/details/${type}`);
  }

  // Méthodes API pour les contacts
  async getAllContacts(): Promise<any> {
    return this.request<any>('/contacts');
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  async updateContactStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Méthodes API pour les postulations
  async getAllPostulations(): Promise<Postulation[]> {
    return this.request<Postulation[]>('/postulations');
  }

  async createPostulation(formData: FormData): Promise<Postulation> {
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {},
    };

    const url = `${API_BASE_URL}/postulations`;

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP! status: ${response.status}`;

        switch (response.status) {
          case 413:
            errorMessage = 'Les fichiers sont trop volumineux. Veuillez réduire la taille des fichiers.';
            break;
          case 400:
            errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          default:
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {}
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de réseau');
    }
  }

  // 🆕 Méthode ajoutée pour les activités récentes — CORRIGÉE ICI ✅
  async getRecentActivities(): Promise<{ success: boolean; data: Activity[] }> {
    return this.request<{ success: boolean; data: Activity[] }>('/admin/recent-activities');
  }

  // Méthodes API pour les analytics
  async getYearlyViews(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/yearly');
  }

  async getMonthlyComparison(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/monthly');
  }

  async getCountryViews(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/countries');
  }

  // Méthode pour tracker les vues de pages
  async trackPageView(page: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/analytics/track-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      });
    } catch (error) {
      console.error('Erreur tracking page view:', error);
    }
  }
}

export const apiService = new ApiService();
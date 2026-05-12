// API service pour la communication avec le backend
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  person: string;
  // ── SEO ──────────────────────────────────────
  seoTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
  imageAlt: string;
  ogTitle: string;
  twitterTitle: string;
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
  person: string;
  // ── SEO ──────────────────────────────────────
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  focusKeyword?: string;
  imageAlt?: string;
  ogTitle?: string;
  twitterTitle?: string;
}

export interface Property extends PropertyData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  person: string;
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
  person: string;
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

export interface Activity {
  id?: string;
  action: string;
  item: string;
  createdAt: string;
  type: "property" | "blog" | "contact" | "user" | "postulation" | "unknown" | "error";
  performedBy: string;
}

export interface Admin {
  _id: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

// ── Types utilisateurs ────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'editor';

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string; // optionnel — uniquement si l'admin veut le changer
}
// ── Types SpaceFiles ────────────────────────────────────────────────────────
export interface SpaceFile {
  _id: string;
  name: string;
  url: string;
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  size: number;
  sizeFormatted: string;
  uploadedBy: string;
  uploadedAt: string;
}
 
export interface SpaceData {
  _id: string;
  name: string;
  spaceId: string;
  allowUpload: boolean;
  description: string;
  isActive: boolean;
  filesCount: number;
  totalSize?: string;
  createdBy?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}
 
export interface SpaceDataWithPassword extends SpaceData {
  passwordPlain: string;    // retourné UNE SEULE FOIS à la création
}
 
export interface CreateSpacePayload {
  name: string;
  password: string;
  allowUpload?: boolean;
  description?: string;
}
 
export interface UpdateSpacePayload {
  name?: string;
  description?: string;
  allowUpload?: boolean;
  isActive?: boolean;
  password?: string;
}
 
export interface SpaceAccessPayload {
  spaceId: string;
  password: string;
}
 
export interface SpaceAccessResponse {
  success: boolean;
  token: string;
  space: {
    name: string;
    spaceId: string;
    allowUpload: boolean;
    description: string;
  };
}
 
export interface SpaceFilesData {
  name: string;
  spaceId: string;
  allowUpload: boolean;
  description: string;
  files: SpaceFile[];
}

// ─────────────────────────────────────────────────────────────────────────────

class ApiService {

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("adminToken");

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP! status: ${response.status}`;

        switch (response.status) {
          case 401:
            this.logout();
            window.location.href = '/admin';
            errorMessage = 'Session expirée, veuillez vous reconnecter.';
            break;
          case 403:
            errorMessage = 'Accès refusé.';
            break;
          case 409:
            try {
              const body = await response.json();
              errorMessage = body.message || 'Cet email est déjà utilisé.';
            } catch {}
            break;
          case 413:
            errorMessage = 'Les données sont trop volumineuses. Veuillez réduire la taille des images ou du contenu.';
            break;
          case 400:
            try {
              const body = await response.json();
              errorMessage = body.message || 'Données invalides.';
            } catch {
              errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
            }
            break;
          case 404:
            errorMessage = 'Ressource non trouvée. Elle a peut-être été supprimée ou l\'ID est incorrect.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          default:
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {}
        }

        throw new Error(errorMessage);
      }

      // 204 No Content (DELETE)
      if (response.status === 204) return undefined as T;

      return await response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erreur de réseau');
    }
  }

  // ============================================================
  // AUTH
  // ============================================================

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email ou mot de passe incorrect');
    return data;
  }

  // async verifyToken(): Promise<boolean> {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) return false;
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     return res.ok;
  //   } catch {
  //     return false;
  //   }
  // }

//   async verifyToken(): Promise<{ valid: boolean; role?: string }> {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return { valid: false };
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) return { valid: false };
//     const data = await res.json();
//     return { valid: true, role: data.user.role }; // ← data.user.role
//   } catch {
//     return { valid: false };
//   }
// }

async verifyToken(): Promise<{ valid: boolean; role?: string }> {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return { valid: false };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Token invalide ou expiré
    if (res.status === 401) {
      localStorage.removeItem("adminToken");

      return { valid: false };
    }

    // Autre erreur backend
    if (!res.ok) {
      return { valid: false };
    }

    const data = await res.json();

    return {
      valid: true,
      role: data.user.role,
    };

  } catch (error) {

    // Erreur réseau → on NE supprime PAS forcément le token
    console.error("verifyToken error:", error);

    return { valid: false };
  }
}
  

  async getAdmins(): Promise<Admin[]> {
    const res = await this.request<{ success: boolean; data: Admin[] }>('/api/auth/admins');
    return res.data;
  }

  logout(): void {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
  }

  // ============================================================
  // GESTION DES UTILISATEURS
  // ============================================================

  /** Récupère tous les utilisateurs (admin + editor). */
  async getUsers(): Promise<AppUser[]> {
    const res = await this.request<{ success: boolean; data: AppUser[] }>('/api/users');
    return res.data;
  }

  async getAssignableUsers(): Promise<{ _id: string; name: string }[]> {
    const res = await this.request<{ success: boolean; data: { _id: string; name: string }[] }>('/api/users/assignable');
    return res.data;
  }

  /**
   * Crée un utilisateur et déclenche l'envoi de l'email d'invitation.
   * Pas de mot de passe à envoyer — il sera défini par l'utilisateur via le lien email.
   */
  async createUser(payload: CreateUserPayload): Promise<AppUser> {
    const res = await this.request<{ success: boolean; warning?: string; data: AppUser }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Remonter l'avertissement si l'email n'a pas pu être envoyé
    if (res.warning) throw new Error(`__WARNING__${res.warning}`);
    return res.data;
  }

  /** Met à jour les infos d'un utilisateur. Le mot de passe n'est modifié que s'il est fourni. */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<AppUser> {
    // Ne pas envoyer un mot de passe vide
    const body = { ...payload };
    if (!body.password) delete body.password;

    const res = await this.request<{ success: boolean; data: AppUser }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.data;
  }

  /** Supprime un utilisateur. */
  async deleteUser(id: string): Promise<void> {
    await this.request<void>(`/api/users/${id}`, { method: 'DELETE' });
  }

  /** Renvoie l'email d'invitation à un utilisateur qui n'a pas encore défini son mot de passe. */
  async resendInvite(id: string): Promise<void> {
    await this.request<void>(`/api/users/${id}/resend-invite`, { method: 'POST' });
  }

  // ============================================================
  // PROPRIÉTÉS
  // ============================================================

  private convertFormDataToApiData(formData: PropertyFormData): PropertyData {
    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map(a => a.trim()).filter(a => a).slice(0, 20)
      : [];

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
      description: formData.description,
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
      person: formData.person.substring(0, 100),
    };
  }

  async getAllProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties');
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.request<Property>(`/properties/${id}`);
    console.log('🔍 API Service - Retrieved property:');
    console.log('🔍 Main image present:', !!property.mainImage);
    console.log('🔍 Main image length:', property.mainImage?.length || 0);
    console.log('🔍 Additional images count:', property.additionalImages?.length || 0);
    return property;
  }

  async createProperty(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    const jsonString = JSON.stringify(propertyData);
    console.log('📤 Sending property data, size:', jsonString.length, 'characters');
    return this.request<Property>('/properties', { method: 'POST', body: jsonString });
  }

  async createPropertyDraft(formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    propertyData.status = 'draft';
    return this.request<Property>('/properties', { method: 'POST', body: JSON.stringify(propertyData) });
  }

  async updateProperty(id: string, formData: PropertyFormData): Promise<Property> {
    const propertyData = this.convertFormDataToApiData(formData);
    return this.request<Property>(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(propertyData) });
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/properties/${id}`, { method: 'DELETE' });
  }

  // ============================================================
  // ARTICLES
  // ============================================================

  private convertArticleFormDataToApiData(formData: ArticleFormData): ArticleData {
    return {
      title: formData.title.substring(0, 200),
      content: formData.content,
      excerpt: formData.excerpt.substring(0, 500),
      author: formData.author.substring(0, 100),
      person: formData.person.substring(0, 100),
      category: formData.category,
      status: formData.status,
      featured: formData.featured,
      image: formData.image,
      tags: formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).slice(0, 10)
        : [],
    };
  }

  async getAllArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles');
  }

  async getArticleById(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  async createArticle(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>('/articles', { method: 'POST', body: JSON.stringify(articleData) });
  }

  async createArticleDraft(formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    articleData.status = 'draft';
    return this.request<Article>('/articles', { method: 'POST', body: JSON.stringify(articleData) });
  }

  async updateArticle(id: string, formData: ArticleFormData): Promise<Article> {
    const articleData = this.convertArticleFormDataToApiData(formData);
    return this.request<Article>(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(articleData) });
  }

  async deleteArticle(id: string): Promise<{ message: string }> {
    const adminName = localStorage.getItem("adminEmail")?.split("@")[0] || "admin";
    return this.request<{ message: string }>(`/articles/${id}?person=${encodeURIComponent(adminName)}`, {
      method: 'DELETE',
    });
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getDashboardStats(): Promise<any> {
    return this.request<any>('/dashboard/stats');
  }

  async getDetailedStats(type: string): Promise<any> {
    return this.request<any>(`/dashboard/details/${type}`);
  }

  // ============================================================
  // CONTACTS
  // ============================================================

  async getAllContacts(): Promise<any> {
    return this.request<any>('/contacts');
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/contacts/${id}`, { method: 'DELETE' });
  }

  async updateContactStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ============================================================
  // POSTULATIONS
  // ============================================================

  async getAllPostulations(): Promise<Postulation[]> {
    return this.request<Postulation[]>('/postulations');
  }

  async createPostulation(formData: FormData): Promise<Postulation> {
    const url = `${API_BASE_URL}/postulations`;
    const token = localStorage.getItem("adminToken");
    

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!response.ok) {
        let errorMessage = `Erreur HTTP! status: ${response.status}`;
        switch (response.status) {
          case 413: errorMessage = 'Les fichiers sont trop volumineux.'; break;
          case 400: errorMessage = 'Données invalides.'; break;
          case 500: errorMessage = 'Erreur interne du serveur.'; break;
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
      if (error instanceof Error) throw error;
      throw new Error('Erreur de réseau');
    }
  }

  // ============================================================
  // ACTIVITÉS & ANALYTICS
  // ============================================================

  async getRecentActivities(): Promise<{ success: boolean; data: Activity[] }> {
    return this.request<{ success: boolean; data: Activity[] }>('/admin/recent-activities');
  }

  async getYearlyViews(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/yearly');
  }

  async getMonthlyComparison(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/monthly');
  }

  async getCountryViews(): Promise<any[]> {
    return this.request<any[]>('/api/analytics/countries');
  }

  async trackPageView(page: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/analytics/track-page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });
    } catch (error) {
      console.error('Erreur tracking page view:', error);
    }
  }
   /** Liste tous les espaces. */
  async getSpaces(): Promise<SpaceData[]> {
    const res = await this.request<{ success: boolean; data: SpaceData[] }>('/api/spaces');
    return res.data;
  }
 
  /**
   * Crée un espace.
   * Retourne le mot de passe en clair dans `passwordPlain` — à afficher UNE SEULE FOIS.
   */
  async createSpace(payload: CreateSpacePayload): Promise<SpaceDataWithPassword> {
    const res = await this.request<{ success: boolean; data: SpaceDataWithPassword }>(
      '/api/spaces',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    return res.data;
  }
 
  /** Met à jour un espace. */
  async updateSpace(id: string, payload: UpdateSpacePayload): Promise<SpaceData> {
    const body = { ...payload };
    if (!body.password) delete body.password;   // ne pas envoyer un mot de passe vide
    const res = await this.request<{ success: boolean; data: SpaceData }>(
      `/api/spaces/${id}`,
      { method: 'PUT', body: JSON.stringify(body) }
    );
    return res.data;
  }
 
  /** Supprime un espace et tous ses fichiers Cloudinary. */
  async deleteSpace(id: string): Promise<void> {
    await this.request<void>(`/api/spaces/${id}`, { method: 'DELETE' });
  }
 
  /** Détail d'un espace avec ses fichiers (pour l'admin). */
  async getSpaceById(id: string): Promise<SpaceData & { files: SpaceFile[] }> {
    const res = await this.request<{ success: boolean; data: SpaceData & { files: SpaceFile[] } }>(
      `/api/spaces/${id}`
    );
    return res.data;
  }
 
  /** Supprime un fichier d'un espace (admin). */
  async deleteSpaceFile(spaceId: string, fileId: string): Promise<void> {
    await this.request<void>(`/api/spaces/${spaceId}/files/${fileId}`, {
      method: 'DELETE',
    });
  }
 
  // ============================================================
  // ESPACES DE PARTAGE (visiteur)
  // ============================================================
 
  /**
   * Authentifie un visiteur sur un espace.
   * Retourne un JWT scopé à stocker en sessionStorage (pas localStorage).
   */
  async accessSpace(spaceId: string, password: string): Promise<SpaceAccessResponse> {
    const res = await fetch(`${API_BASE_URL}/api/spaces/access`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ spaceId, password }),
    });
 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Identifiant ou mot de passe incorrect');
    return data;
  }
 
  /**
   * Récupère les fichiers d'un espace (visiteur authentifié).
   * @param spaceId   - ex: "SPACE-A3K9X"
   * @param spaceToken - JWT d'espace (depuis sessionStorage)
   */
  async getSpaceFiles(spaceId: string, spaceToken: string): Promise<SpaceFilesData> {
    const res = await fetch(`${API_BASE_URL}/api/spaces/${spaceId}/files`, {
      headers: { Authorization: `Bearer ${spaceToken}` },
    });
 
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) throw new Error('__EXPIRED__');
      throw new Error(data.message || 'Erreur de chargement');
    }
    return data.data;
  }
}

export const apiService = new ApiService();
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_BASE_URL = import.meta.env.VITE_API_URL;


// ─── NOUVEAU : Interface pour les options d'optimisation ──────────────────
export interface CloudinaryOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
  gravity?: 'auto' | 'center' | 'face' | 'north' | 'south' | 'east' | 'west';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  dpr?: number; // Device Pixel Ratio pour retina
}

// ─── AMÉLIORATION : getCloudinaryUrl avec plus d'options ──────────────────
export const getCloudinaryUrl = (
  urlOrPublicId: string,
  width?: number,
  height?: number,
  quality: number | "auto" = "auto",
  options: CloudinaryOptimizeOptions = {}
): string => {
  if (!urlOrPublicId) return urlOrPublicId;

  const {
    format = 'auto',
    crop = width || height ? 'fill' : undefined,
    gravity = 'auto',
    dpr,
  } = options;

  // Construction des transformations
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
    dpr && `dpr_${dpr}`,
  ]
    .filter(Boolean)
    .join(",");

  // Cas 1 : URL complète Cloudinary
  if (urlOrPublicId.includes("res.cloudinary.com")) {
    // Supprime les transformations existantes entre /upload/ et le versionning/path
    return urlOrPublicId.replace(
      /\/upload\/(?:[a-zA-Z0-9_,/:]+\/)*?(v\d+\/)/,
      `/upload/${transforms}/$1`
    );
  }

  // Cas 2 : publicId seul → on reconstruit l'URL complète
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${urlOrPublicId}`;
};

// ─── NOUVEAU : Génération de srcSet automatique ────────────────────────────
export const getSrcSet = (
  urlOrPublicId: string,
  widths: number[] = [400, 600, 800, 1200],
  height?: number,
  quality: number | 'auto' = 'auto'
): string => {
  return widths
    .map((w) => {
      const url = getCloudinaryUrl(urlOrPublicId, w, height, quality);
      return `${url} ${w}w`;
    })
    .join(', ');
};

// ─── NOUVEAU : Génération de srcSet pour retina ────────────────────────────
export const getResponsiveSrcSet = (
  urlOrPublicId: string,
  baseWidths: number[] = [400, 600, 800, 1200],
  height?: number,
  quality: number | 'auto' = 'auto'
): { srcSet: string; sizes: string } => {
  // Pour les écrans retina (2x), on double les largeurs
  const allWidths = [
    ...baseWidths,
    ...baseWidths.map(w => w * 2),
  ].sort((a, b) => a - b);

  const srcSet = allWidths
    .map((w) => {
      const url = getCloudinaryUrl(urlOrPublicId, w, height, quality);
      return `${url} ${w}w`;
    })
    .join(', ');

  // Sizes adaptatives
  const sizes = baseWidths
    .map((w, i) => {
      const next = baseWidths[i + 1];
      if (next) {
        return `(max-width: ${next}px) ${w}px`;
      }
      return `${w}px`;
    })
    .join(', ');

  return { srcSet, sizes };
};

// ─── AMÉLIORATION : optimizeHtmlImages avec plus d'options ────────────────
export const optimizeHtmlImages = (
  html: string,
  width?: number,
  height?: number,
  quality: number | "auto" = "auto",
  options: CloudinaryOptimizeOptions = {}
): string => {
  if (!html) return html;

  // Remplace chaque src="...cloudinary..." par sa version optimisée
  return html.replace(
    /(<img[^>]+src=")([^"]*res\.cloudinary\.com[^"]*)(")/gi,
    (_, before, url, after) => {
      const optimized = getCloudinaryUrl(url, width, height, quality, options);
      return `${before}${optimized}${after}`;
    }
  );
};

// ─── NOUVEAU : Optimisation des images avec lazy loading automatique ──────
export const optimizeHtmlWithLazy = (
  html: string,
  width?: number,
  height?: number,
  quality: number | "auto" = "auto",
  options: CloudinaryOptimizeOptions = {}
): string => {
  if (!html) return html;

  let optimized = optimizeHtmlImages(html, width, height, quality, options);

  // Ajoute lazy loading et decoding async si non présents
  optimized = optimized.replace(
    /<img([^>]*?)>/gi,
    (match, attrs) => {
      // Ne pas ajouter lazy si déjà présent ou si c'est une image critique
      if (attrs.includes('loading=') || attrs.includes('fetchpriority="high"')) {
        return match;
      }
      return `<img${attrs} loading="lazy" decoding="async">`;
    }
  );

  return optimized;
};

// ─── NOUVEAU : Image placeholder (blur-up) ────────────────────────────────
export const getBlurPlaceholder = (
  urlOrPublicId: string,
  size: number = 20
): string => {
  return getCloudinaryUrl(urlOrPublicId, size, size, 10, {
    format: 'auto',
    crop: 'thumb',
    gravity: 'auto',
  });
};

// ─── NOUVEAU : URL pour les vidéos optimisées ─────────────────────────────
export const getOptimizedVideoUrl = (
  urlOrPublicId: string,
  width?: number,
  quality: number | 'auto' = 'auto'
): string => {
  if (!urlOrPublicId) return urlOrPublicId;

  const transforms = [
    `f_auto`,
    `q_${quality}`,
    width && `w_${width}`,
  ]
    .filter(Boolean)
    .join(',');

  if (urlOrPublicId.includes('res.cloudinary.com')) {
    return urlOrPublicId.replace(
      /\/upload\/(?:[a-zA-Z0-9_,/:]+\/)*?(v\d+\/)/,
      `/video/upload/${transforms}/$1`
    );
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${urlOrPublicId}`;
};

// ─── Type pour les dimensions d'image ──────────────────────────────────────
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// ─── NOUVEAU : Calcule les dimensions optimales ────────────────────────────
export const getOptimalDimensions = (
  containerWidth: number,
  containerHeight?: number,
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | number
): ImageDimensions => {
  let ratio: number;

  if (typeof aspectRatio === 'string') {
    const [w, h] = aspectRatio.split(':').map(Number);
    ratio = w / h;
  } else if (typeof aspectRatio === 'number') {
    ratio = aspectRatio;
  } else {
    ratio = 16 / 9; // Default
  }

  let width = containerWidth;
  let height = containerWidth / ratio;

  if (containerHeight && height > containerHeight) {
    height = containerHeight;
    width = containerHeight * ratio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio: width / height,
  };
};

// ─── Reste du fichier inchangé ─────────────────────────────────────────────

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export interface CloudinaryVideoUploadResult {
  publicId: string;
  url: string;
  duration: number;
  format: string;
}

// ... (le reste de votre code d'upload reste identique)

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export interface CloudinaryVideoUploadResult {
  publicId: string;
  url: string;
  duration: number;
  format: string;
}

// ── Upload image ──────────────────────────────────────────────────────────────

export const uploadToCloudinary = (
  file: File,
  folder: string = "orchid",
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          publicId: data.public_id,
          url: data.secure_url,
          width: data.width,
          height: data.height,
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

// ── Upload vidéo ──────────────────────────────────────────────────────────────
// Même logique que uploadToCloudinary mais pointe vers /video/upload

export const uploadVideoToCloudinary = (
  file: File,
  folder: string = "orchid/videos",
  onProgress?: (percent: number) => void
): Promise<CloudinaryVideoUploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          publicId: data.public_id,
          url: data.secure_url,
          duration: data.duration || 0,
          format: data.format || "",
        });
      } else {
        reject(new Error(`Video upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Video upload failed"));

    // ✅ /video/upload au lieu de /image/upload
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
    xhr.send(formData);
  });
};


// ── Types space ────────────────────────────────────────────────────────────────────

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

export interface SpaceInfo {
  name: string;
  spaceId: string;
  allowUpload: boolean;
  description: string;
}

export interface SpaceFilesResponse {
  success: boolean;
  data: SpaceInfo & { files: SpaceFile[] };
}

// ── Upload d'un fichier dans un espace (via backend — signé) ─────────────────

export async function uploadFileToSpace(
  spaceId: string,
  file: File,
  spaceToken: string,
  onProgress?: (percent: number) => void
): Promise<SpaceFile> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data);
        } catch {
          reject(new Error('Réponse invalide du serveur'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || `Erreur ${xhr.status}`));
        } catch {
          reject(new Error(`Erreur HTTP ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));
    xhr.addEventListener('abort', () => reject(new Error('Upload annulé')));

    xhr.open('POST', `${API_BASE_URL}/api/spaces/${spaceId}/files`);
    xhr.setRequestHeader('Authorization', `Bearer ${spaceToken}`);
    xhr.send(formData);
  });
}

// ── Récupérer les fichiers d'un espace ───────────────────────────────────────

export async function getSpaceFilesFromCloud(
  spaceId: string,
  spaceToken: string
): Promise<SpaceFilesResponse['data']> {
  const res = await fetch(`${API_BASE_URL}/api/spaces/${spaceId}/files`, {
    headers: { Authorization: `Bearer ${spaceToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erreur ${res.status}`);
  }

  const data: SpaceFilesResponse = await res.json();
  return data.data;
}

// ── Authentification à un espace ─────────────────────────────────────────────

export interface SpaceAccessResponse {
  token: string;
  space: SpaceInfo;
}

export async function authenticateSpace(
  spaceId: string,
  password: string
): Promise<SpaceAccessResponse> {
  const res = await fetch(`${API_BASE_URL}/api/spaces/access`, {
    method  : 'POST',
    headers : { 'Content-Type': 'application/json' },
    body    : JSON.stringify({ spaceId, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Identifiant ou mot de passe incorrect');
  }

  return data;
}
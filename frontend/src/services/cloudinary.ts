// src/services/cloudinary.ts

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// ── URL optimisée image ───────────────────────────────────────────────────────

export const getCloudinaryUrl = (
  publicId: string,
  width?: number,
  height?: number,
  quality: number | "auto" = "auto"
): string => {
  const transforms = [
    "f_auto",
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    width || height ? "c_fill" : "",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
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
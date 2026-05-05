// src/services/cloudinary.ts

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

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

// Construit l'URL optimisée à partir du publicId
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
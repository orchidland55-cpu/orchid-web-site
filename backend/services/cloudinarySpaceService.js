// services/cloudinarySpaceService.js
//
// Upload SIGNÉ côté serveur uniquement.
// Les credentials Cloudinary ne sont JAMAIS exposés au frontend.
//
const cloudinary = require('cloudinary').v2;

// Configuration — utilise les mêmes variables d'env que le reste du projet
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
  secure     : true,
});

// ─────────────────────────────────────────────────────────────────────────────
// Déterminer le resourceType Cloudinary selon le mimetype du fichier
// ─────────────────────────────────────────────────────────────────────────────
function resolveResourceType(mimetype = '') {
  if (mimetype.startsWith('image/'))                      return 'image';
  if (mimetype.startsWith('video/') || mimetype.startsWith('audio/')) return 'video';
  // PDF, ZIP, Word, Excel, texte, binaires → 'raw'
  return 'raw';
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload un fichier (buffer) dans le dossier de l'espace
//
// @param {Buffer}  buffer       — contenu du fichier (depuis multer memoryStorage)
// @param {string}  spaceId      — ex: "SPACE-A3K9X"
// @param {string}  originalName — nom original du fichier
// @param {string}  mimetype     — type MIME détecté par multer
// @returns {object} résultat Cloudinary { public_id, secure_url, resource_type, format, bytes }
// ─────────────────────────────────────────────────────────────────────────────
async function uploadSpaceFile(buffer, spaceId, originalName, mimetype) {
  const resourceType = resolveResourceType(mimetype);

  // Nettoyer le nom pour l'utiliser comme public_id
  const safeName = originalName
    .replace(/\.[^/.]+$/, '')          // retirer l'extension
    .replace(/[^a-zA-Z0-9_-]/g, '_')  // remplacer les caractères spéciaux
    .substring(0, 100);

  const publicId = `spaces/${spaceId}/${Date.now()}_${safeName}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id     : publicId,
        resource_type : resourceType,
        folder        : `spaces/${spaceId}`,
        // Pas de transformation — on conserve le fichier original intact
        use_filename      : false,
        unique_filename   : false,
        overwrite         : false,
        // Accès restreint (non indexé publiquement)
        type              : 'upload',
        access_mode       : 'public', // l'URL est protégée par notre backend
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Supprimer un fichier de Cloudinary
//
// @param {string} fileId       — public_id Cloudinary
// @param {string} resourceType — 'image' | 'video' | 'raw'
// ─────────────────────────────────────────────────────────────────────────────
async function deleteSpaceFile(fileId, resourceType = 'raw') {
  try {
    const result = await cloudinary.uploader.destroy(fileId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Erreur suppression Cloudinary [${fileId}]:`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supprimer tous les fichiers d'un espace (lors de la suppression de l'espace)
//
// @param {string} spaceId — ex: "SPACE-A3K9X"
// @param {Array}  files   — tableau des fichiers du modèle Space
// ─────────────────────────────────────────────────────────────────────────────
async function deleteSpaceFolder(spaceId, files = []) {
  // Supprimer chaque fichier individuellement (Cloudinary gratuit ne permet
  // pas la suppression de dossier entier via API)
  const deletions = files.map(file =>
    deleteSpaceFile(file.fileId, file.resourceType).catch(err => {
      // On log mais on ne bloque pas — le fichier sera orphelin sur Cloudinary
      console.error(`Impossible de supprimer ${file.fileId}:`, err.message);
    })
  );

  await Promise.allSettled(deletions);
}

module.exports = {
  uploadSpaceFile,
  deleteSpaceFile,
  deleteSpaceFolder,
  resolveResourceType,
};
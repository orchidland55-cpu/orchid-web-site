// middleware/uploadMiddleware.js
//
// Valide le fichier côté serveur (taille + MIME type) avant l'upload Cloudinary.
// Utilise memoryStorage : le fichier reste en RAM puis est streamé vers Cloudinary.
//
const multer = require('multer');

// ─────────────────────────────────────────────────────────────────────────────
// MIME types autorisés (whitelist explicite)
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',
  // Vidéos
  'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/webm', 'video/3gpp',
  // Audio
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Archives
  'application/zip',
  'application/x-rar-compressed', 'application/vnd.rar',
  'application/x-7z-compressed',
  'application/gzip', 'application/x-tar',
  // Texte / Code
  'text/plain', 'text/csv', 'text/html', 'text/css',
  'application/json', 'application/xml', 'text/xml',
]);

// Taille max : 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// Configuration multer
// ─────────────────────────────────────────────────────────────────────────────
const storage = multer.memoryStorage(); // buffer en RAM, jamais écrit sur disque

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Type de fichier non autorisé : ${file.mimetype}`),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize : MAX_FILE_SIZE,      // 50 MB
    files    : 1,                  // 1 fichier par requête
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware exporté — gère les erreurs multer proprement
// ─────────────────────────────────────────────────────────────────────────────
const uploadSingle = (req, res, next) => {
  // Si le body a déjà été parsé (cas express-fileupload non exclu),
  // reconstruire un stream vide ne fonctionnera pas — on le détecte ici
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({
      message: 'La requête doit être de type multipart/form-data',
    });
  }
 
  upload.single('file')(req, res, (err) => {
    if (!err) return next();
 
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'Fichier trop volumineux. Taille maximale : 50 MB.',
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: 'Champ de fichier invalide. Utilisez le champ "file".',
        });
      }
      return res.status(400).json({ message: `Erreur upload : ${err.message}` });
    }
 
    if (err) {
      return res.status(415).json({ message: err.message });
    }
 
    next();
  });
};

module.exports = { uploadSingle, ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
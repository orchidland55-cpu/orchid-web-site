// controllers/spaceController.js
const crypto = require('crypto');
const jwt    = require('jsonwebtoken');
const Space  = require('../models/Space');
const {
  uploadSpaceFile,
  deleteSpaceFile,
  deleteSpaceFolder,
} = require('../services/cloudinarySpaceService');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Génère un spaceId lisible unique — ex: "SPACE-A3K9X" */
function generateSpaceId() {
  return 'SPACE-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/** Formate les octets en chaîne lisible (ex: "2.3 MB") */
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — CRUD des espaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/spaces
 * Crée un nouvel espace de partage.
 * Corps : { name, password, allowUpload?, description? }
 *
 * Retourne le mot de passe en clair UNE SEULE FOIS dans la réponse.
 */
const createSpace = async (req, res) => {
  try {
    const { name, password, allowUpload = false, description = '' } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Nom et mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
    }

    // Générer un spaceId unique (retry si collision, très improbable)
    let spaceId;
    let attempts = 0;
    do {
      spaceId = generateSpaceId();
      attempts++;
      if (attempts > 10) {
        return res.status(500).json({ message: 'Impossible de générer un identifiant unique' });
      }
    } while (await Space.findOne({ spaceId }));

    const space = new Space({
      name       : name.trim(),
      spaceId,
      password,                      // hashé par le pre-save hook
      createdBy  : req.user.userId,
      allowUpload: Boolean(allowUpload),
      description: description.trim(),
      files      : [],
      isActive   : true,
    });

    await space.save();

    res.status(201).json({
      success : true,
      message : 'Espace créé avec succès.',
      data    : {
        _id        : space._id,
        name       : space.name,
        spaceId    : space.spaceId,
        // Mot de passe retourné en clair UNE SEULE FOIS — à communiquer aux visiteurs
        passwordPlain : password,
        allowUpload: space.allowUpload,
        description: space.description,
        isActive   : space.isActive,
        filesCount : 0,
        createdAt  : space.createdAt,
      },
    });
  } catch (error) {
    console.error('Erreur createSpace:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * GET /api/spaces
 * Liste tous les espaces (admin uniquement).
 * Ne retourne jamais le mot de passe.
 */
const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find()
      .select('-password -files.url')     // ne jamais exposer le hash ni les URLs brutes
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const formatted = spaces.map(s => ({
      _id        : s._id,
      name       : s.name,
      spaceId    : s.spaceId,
      allowUpload: s.allowUpload,
      description: s.description,
      isActive   : s.isActive,
      filesCount : s.files.length,
      totalSize  : formatSize(s.files.reduce((acc, f) => acc + (f.size || 0), 0)),
      createdBy  : s.createdBy,
      createdAt  : s.createdAt,
      updatedAt  : s.updatedAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Erreur getSpaces:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * GET /api/spaces/:id
 * Détail d'un espace pour l'admin (avec liste de fichiers complète).
 */
const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email');

    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }

    res.json({ success: true, data: space });
  } catch (error) {
    console.error('Erreur getSpaceById:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * PUT /api/spaces/:id
 * Modifie un espace (nom, description, allowUpload, isActive, password).
 * Le mot de passe n'est modifié que s'il est fourni.
 */
const updateSpace = async (req, res) => {
  try {
    const { name, description, allowUpload, isActive, password } = req.body;

    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }

    if (name        !== undefined) space.name        = name.trim();
    if (description !== undefined) space.description = description.trim();
    if (allowUpload !== undefined) space.allowUpload = Boolean(allowUpload);
    if (isActive    !== undefined) space.isActive    = Boolean(isActive);

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Le mot de passe doit contenir au moins 6 caractères',
        });
      }
      space.password = password;   // re-hashé par le pre-save hook
    }

    await space.save();

    res.json({
      success: true,
      message: 'Espace mis à jour.',
      data: {
        _id        : space._id,
        name       : space.name,
        spaceId    : space.spaceId,
        allowUpload: space.allowUpload,
        description: space.description,
        isActive   : space.isActive,
        filesCount : space.files.length,
        updatedAt  : space.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erreur updateSpace:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * DELETE /api/spaces/:id
 * Supprime l'espace ET tous ses fichiers Cloudinary.
 */
const deleteSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }

    // Supprimer tous les fichiers sur Cloudinary
    await deleteSpaceFolder(space.spaceId, space.files);

    await Space.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    console.error('Erreur deleteSpace:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH VISITEUR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/spaces/access
 * Authentifie un visiteur avec spaceId + password.
 * Retourne un JWT scopé valable 4h.
 *
 * Protégé par rate limiting (5 essais / 15min / IP) — configuré dans index.js
 */
const accessSpace = async (req, res) => {
  try {
    const { spaceId, password } = req.body;

    if (!spaceId || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis' });
    }

    const space = await Space.findOne({ spaceId: spaceId.toUpperCase().trim() });

    // Réponse générique volontaire — ne pas indiquer si c'est l'ID ou le MDP qui est faux
    if (!space) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
    }

    if (!space.isActive) {
      return res.status(403).json({ message: 'Cet espace est temporairement désactivé' });
    }

    const isMatch = await space.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
    }

    // Générer un JWT scopé à cet espace uniquement
    const token = jwt.sign(
      {
        spaceId    : space.spaceId,
        allowUpload: space.allowUpload,
        type       : 'space',           // discriminant important
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      success: true,
      token,
      space: {
        name       : space.name,
        spaceId    : space.spaceId,
        allowUpload: space.allowUpload,
        description: space.description,
      },
    });
  } catch (error) {
    console.error('Erreur accessSpace:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FICHIERS — accessible aux visiteurs authentifiés
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/spaces/:spaceId/files
 * Liste les fichiers d'un espace.
 * Accessible avec un JWT d'espace valide.
 */
const getSpaceFiles = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findOne({ spaceId: spaceId.toUpperCase() })
      .select('name spaceId allowUpload description isActive files');

    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }

    if (!space.isActive) {
      return res.status(403).json({ message: 'Cet espace est désactivé' });
    }

    res.json({
      success: true,
      data: {
        name       : space.name,
        spaceId    : space.spaceId,
        allowUpload: space.allowUpload,
        description: space.description,
        files      : space.files.map(f => ({
          _id         : f._id,
          name        : f.name,
          url         : f.url,           // URL Cloudinary directe
          resourceType: f.resourceType,
          format      : f.format,
          size        : f.size,
          sizeFormatted: formatSize(f.size),
          uploadedBy  : f.uploadedBy,
          uploadedAt  : f.uploadedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Erreur getSpaceFiles:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * POST /api/spaces/:spaceId/files
 * Upload un fichier dans l'espace.
 * Nécessite : JWT d'espace valide + allowUpload === true
 * Le fichier est transmis via multipart/form-data, champ "file".
 */
const uploadFile = async (req, res) => {
  try {
    const { spaceId } = req.params;

    // Le fichier est déjà validé par uploadMiddleware (taille + MIME)
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const space = await Space.findOne({ spaceId: spaceId.toUpperCase() });
    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }
    if (!space.isActive) {
      return res.status(403).json({ message: 'Cet espace est désactivé' });
    }

    // Déterminer qui uploade (admin connecté ou visiteur)
    const uploadedBy = req.isAdmin ? 'admin' : 'visitor';

    // Upload vers Cloudinary
    const cloudResult = await uploadSpaceFile(
      req.file.buffer,
      space.spaceId,
      req.file.originalname,
      req.file.mimetype
    );

    // Ajouter le fichier au document Space
    const newFile = {
      fileId      : cloudResult.public_id,
      name        : req.file.originalname,
      url         : cloudResult.secure_url,
      resourceType: cloudResult.resource_type,
      format      : cloudResult.format || req.file.originalname.split('.').pop(),
      size        : cloudResult.bytes || req.file.size,
      uploadedBy,
      uploadedAt  : new Date(),
    };

    space.files.push(newFile);
    await space.save();

    const savedFile = space.files[space.files.length - 1];

    res.status(201).json({
      success: true,
      message: 'Fichier uploadé avec succès.',
      data: {
        _id          : savedFile._id,
        name         : savedFile.name,
        url          : savedFile.url,
        resourceType : savedFile.resourceType,
        format       : savedFile.format,
        size         : savedFile.size,
        sizeFormatted: formatSize(savedFile.size),
        uploadedBy   : savedFile.uploadedBy,
        uploadedAt   : savedFile.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Erreur uploadFile:', error);

    // Erreur Cloudinary
    if (error.http_code) {
      return res.status(502).json({ message: 'Erreur lors de l\'upload vers le stockage cloud.' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * DELETE /api/spaces/:spaceId/files/:fileId
 * Supprime un fichier d'un espace (admin uniquement).
 */
const deleteFile = async (req, res) => {
  try {
    const { spaceId, fileId } = req.params;

    const space = await Space.findOne({ spaceId: spaceId.toUpperCase() });
    if (!space) {
      return res.status(404).json({ message: 'Espace non trouvé' });
    }

    const fileIndex = space.files.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    const file = space.files[fileIndex];

    // Supprimer de Cloudinary
    await deleteSpaceFile(file.fileId, file.resourceType);

    // Supprimer du document MongoDB
    space.files.splice(fileIndex, 1);
    await space.save();

    res.status(204).send();
  } catch (error) {
    console.error('Erreur deleteFile:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  // Admin
  createSpace,
  getSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace,
  // Visiteur
  accessSpace,
  // Fichiers
  getSpaceFiles,
  uploadFile,
  deleteFile,
};
// middleware/authMiddleware.js
//
// Version étendue — conserve verifyJWT et requireAdmin existants,
// ajoute verifySpaceJWT et checkUploadAllowed pour les espaces.
//
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// EXISTANT — ne pas modifier
// ─────────────────────────────────────────────────────────────────────────────

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expiré ou invalide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

const requireAdminOrEditor = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs et éditeurs' });
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// NOUVEAU — JWT scopé pour les espaces de partage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vérifie le JWT d'espace (type: 'space').
 *
 * Token attendu dans le header : Authorization: Bearer <spaceToken>
 * Payload décodé : { spaceId, allowUpload, type: 'space' }
 *
 * SÉCURITÉ : vérifie que le spaceId du token correspond à celui de la route
 * pour empêcher tout accès croisé entre espaces.
 */
const verifySpaceJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token d\'accès manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que c'est bien un token d'espace (pas un token admin réutilisé)
    if (decoded.type !== 'space') {
      return res.status(403).json({ message: 'Token non autorisé pour cet accès' });
    }

    // Vérifier que le spaceId du token correspond à la route demandée
    const routeSpaceId = req.params.spaceId?.toUpperCase();
    if (routeSpaceId && decoded.spaceId !== routeSpaceId) {
      return res.status(403).json({ message: 'Accès refusé à cet espace' });
    }

    req.space = decoded; // { spaceId, allowUpload, type: 'space' }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session expirée. Veuillez vous reconnecter à l\'espace.',
        expired: true,
      });
    }
    return res.status(401).json({ message: 'Token invalide' });
  }
};

/**
 * Vérifie que l'espace autorise les uploads.
 * À utiliser après verifySpaceJWT.
 */
const checkUploadAllowed = (req, res, next) => {
  if (!req.space?.allowUpload) {
    return res.status(403).json({
      message: 'Cet espace ne permet pas l\'upload de fichiers.',
    });
  }
  next();
};

const verifyAdminOrSpaceJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token d\'accès manquant' });
  }
 
  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    // CAS 1 : JWT admin standard
    if (decoded.userId && decoded.role === 'admin') {
      req.user = decoded;
      req.isAdmin = true;
      return next();
    }
 
    // CAS 2 : JWT d'espace
    if (decoded.type === 'space') {
      // Vérifier que le spaceId du token correspond à la route
      const routeSpaceId = req.params.spaceId?.toUpperCase();
      if (routeSpaceId && decoded.spaceId !== routeSpaceId) {
        return res.status(403).json({ message: 'Accès refusé à cet espace' });
      }
      req.space = decoded;
      req.isAdmin = false;
      return next();
    }
 
    return res.status(403).json({ message: 'Token non autorisé' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée', expired: true });
    }
    return res.status(401).json({ message: 'Token invalide' });
  }
};

const checkUploadAllowedOrAdmin = (req, res, next) => {
  // Admin peut toujours uploader
  if (req.isAdmin) return next();
 
  // Visiteur : vérifier l'autorisation de l'espace
  if (!req.space?.allowUpload) {
    return res.status(403).json({
      message: 'Cet espace ne permet pas l\'upload de fichiers.',
    });
  }
  next();
};

module.exports = { 
  verifyJWT, 
  requireAdmin, 
  verifySpaceJWT, 
  checkUploadAllowed, 
  verifyAdminOrSpaceJWT, 
  checkUploadAllowedOrAdmin,
  requireAdminOrEditor
};
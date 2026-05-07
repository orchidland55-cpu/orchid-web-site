// controllers/authController.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSetPasswordEmail } = require('../services/emailService');

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (user.role !== 'admin' && user.role !== 'editor') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    // Bloquer la connexion si le mot de passe n'a pas encore été défini
    if (!user.passwordSet) {
      return res.status(403).json({
        message: 'Vous devez d\'abord définir votre mot de passe via le lien reçu par email.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/auth/verify
const verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};

// GET /api/auth/admins — liste des admins (nom + id uniquement)
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('name _id')
      .sort({ name: 1 });

    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Erreur getAdmins:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GESTION DES UTILISATEURS (admin only)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/users
// Crée l'utilisateur et envoie un email pour définir le mot de passe.
const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Nom et email requis' });
    }

    // Vérifier si l'email est déjà utilisé
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Générer un token de définition de mot de passe (valide 24h)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h

    // Mot de passe temporaire aléatoire (requis par le schéma, sera remplacé)
    const tempPassword = crypto.randomBytes(16).toString('hex');

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'editor',
      password: tempPassword,
      passwordSet: false,
      resetPasswordToken: rawToken,
      resetPasswordExpires: tokenExpiry,
    });

    await user.save();

    // Envoyer l'email d'invitation
    try {
      await sendSetPasswordEmail(user.email, user.name, rawToken);
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On ne supprime pas l'utilisateur créé — l'admin peut renvoyer manuellement
      return res.status(201).json({
        success: true,
        warning: 'Utilisateur créé mais l\'email n\'a pas pu être envoyé.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          passwordSet: user.passwordSet,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé. Un email a été envoyé.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordSet: user.passwordSet,
      },
    });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/users/:id
// Met à jour nom, email, rôle. Le mot de passe n'est modifié que s'il est fourni.
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier unicité email si modifié
    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    if (name)  user.name  = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role)  user.role  = role;

    // Mise à jour optionnelle du mot de passe
    if (password && password.length >= 8) {
      user.password = password; // sera hashé par le pre-save hook
    } else if (password && password.length > 0) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordSet: user.passwordSet,
      },
    });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher un admin de se supprimer lui-même
    if (req.user.userId === id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DÉFINIR LE MOT DE PASSE (public — via token email)
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/auth/set-password
const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token et mot de passe requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Chercher l'utilisateur avec ce token non expiré
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Lien invalide ou expiré. Contactez un administrateur.',
      });
    }

    // Définir le mot de passe et nettoyer le token
    user.password = password;         // hashé par pre-save
    user.passwordSet = true;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ success: true, message: 'Mot de passe défini avec succès. Vous pouvez vous connecter.' });
  } catch (error) {
    console.error('Erreur setPassword:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// RENVOYER L'EMAIL D'INVITATION (admin only)
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/users/:id/resend-invite
const resendInvite = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.passwordSet) {
      return res.status(400).json({ message: 'Cet utilisateur a déjà défini son mot de passe' });
    }

    // Générer un nouveau token
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = rawToken;
    user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendSetPasswordEmail(user.email, user.name, rawToken);

    res.json({ success: true, message: 'Email de définition du mot de passe renvoyé.' });
  } catch (error) {
    console.error('Erreur resendInvite:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  login,
  verifyToken,
  getAdmins,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  setPassword,
  resendInvite,
};
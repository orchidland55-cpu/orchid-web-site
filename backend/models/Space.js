// models/Space.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Sous-schéma fichier ───────────────────────────────────────────────────────
const FileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,          // public_id Cloudinary
    },
    name: {
      type: String,
      required: true,          // nom original du fichier
      trim: true,
      maxlength: 255,
    },
    url: {
      type: String,
      required: true,          // secure_url Cloudinary
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      required: true,
    },
    format: {
      type: String,             // pdf, zip, mp4, png …
      lowercase: true,
      trim: true,
    },
    size: {
      type: Number,             // en octets
      default: 0,
    },
    uploadedBy: {
      type: String,             // 'admin' | 'visitor'
      default: 'visitor',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// ── Schéma principal ──────────────────────────────────────────────────────────
const SpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Identifiant lisible partagé avec les visiteurs (ex: "SPACE-A3K9X")
    spaceId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Mot de passe hashé (bcrypt)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Admin qui a créé l'espace
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Les visiteurs authentifiés peuvent-ils uploader ?
    allowUpload: {
      type: Boolean,
      default: false,
    },

    // Liste des fichiers
    files: [FileSchema],

    // L'admin peut désactiver l'espace sans le supprimer
    isActive: {
      type: Boolean,
      default: true,
    },

    // Description optionnelle visible après connexion
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

// ── Hash automatique avant save (uniquement si password modifié) ──────────────
SpaceSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt   = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Méthode de comparaison ────────────────────────────────────────────────────
SpaceSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ── Index pour accélerer la recherche par spaceId ─────────────────────────────
SpaceSchema.index({ spaceId: 1 });

module.exports = mongoose.model('Space', SpaceSchema);
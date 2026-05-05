// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor',
    },

    // ── Champs pour le flux "définir son mot de passe" ──────────────────────
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    // Indique si l'utilisateur a déjà défini son mot de passe
    // false = compte créé par un admin, email envoyé, en attente
    // true  = mot de passe défini, compte actif
    passwordSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash automatique avant chaque save (uniquement si password modifié)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer le mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
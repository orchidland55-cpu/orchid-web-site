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
      required: function () {
        return this.passwordSet === true; // ← requis seulement une fois le mot de passe défini
      },
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor',
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    passwordSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash automatique avant chaque save (uniquement si password modifié)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next(); // ← garde si password vide
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
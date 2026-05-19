const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  // Slug SEO : généré automatiquement depuis le titre (partie avant –, |, /, etc.)
  // Exemple : "Ultimate Luxury Palace in Marrakech – Orchid" → "ultimate-luxury-palace-in-marrakech"
  slug: {
    type: String,
    unique: true,
    sparse: true, // ← permet aux docs existants sans slug de coexister sans conflit
    lowercase: true,
    trim: true,
  },
  description: String,
  price: Number,
  currency: { type: String, enum: ["MAD", "USD", "EUR"], default: "MAD" },
  location: String,
  city: String,
  type: String,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  status: { type: String, default: "available" },
  featured: { type: Boolean, default: false },
  mainImage: {
    type: String,
    maxlength: 15000000
  },
  additionalImages: [{
    type: String,
    maxlength: 15000000
  }],
  videos: [{ type: String }],
  amenities: [String],
  yearBuilt: Number,
  parking: String,
  garden: { type: Boolean, default: false },
  pool: { type: Boolean, default: false },
  security: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false },
  person: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:  { type: String, required: function() { return this.status !== 'draft'; } },
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
  // ✅ Achat / Location. Par défaut "sale" — cohérent avec le comportement
  // historique du site (100% vente jusqu'ici). Les documents existants en
  // base n'auront ce champ qu'après une resauvegarde ; le frontend traite
  // l'absence de valeur comme "sale" pour rester rétrocompatible.
  listingType: { type: String, enum: ["sale", "rent"], default: "sale" },
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
  person: { type: String, required: function() { return this.status !== 'draft'; } },
  // ✅ Champs SEO manquants
  seoTitle:        { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  focusKeyword:    { type: String, default: "" },
  imageAlt:        { type: String, default: "" },
  ogTitle:         { type: String, default: "" },
  twitterTitle:    { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
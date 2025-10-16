const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
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
    maxlength: 15000000 // ✅ 15 Mo pour les chaînes base64 haute qualité
  },
  additionalImages: [{
    type: String,
    maxlength: 15000000 // ✅ 15 Mo pour chaque image supplémentaire haute qualité
  }],
  amenities: [String],        // array of strings
  yearBuilt: Number,
  parking: String,
  garden: { type: Boolean, default: false },
  pool: { type: Boolean, default: false },
  security: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false },
  person: { type: String, required: true } // ✅ Admin associé
}, { timestamps: true });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);

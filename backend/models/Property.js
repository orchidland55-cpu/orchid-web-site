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
  mainImage: String,
  additionalImages: [String], // array of image URLs
  amenities: [String],        // array of strings
  yearBuilt: Number,
  parking: String,
  garden: { type: Boolean, default: false },
  pool: { type: Boolean, default: false },
  security: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);

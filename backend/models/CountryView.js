// backend/models/CountryView.js
const mongoose = require('mongoose');

const countryViewSchema = new mongoose.Schema({
  pays: { type: String, required: true, unique: true },
  vues: { type: Number, required: true },
  pourcentage: { type: Number, default: 0 }
});

module.exports = mongoose.model('CountryView', countryViewSchema);
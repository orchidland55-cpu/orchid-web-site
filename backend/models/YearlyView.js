// backend/models/YearlyView.js
const mongoose = require('mongoose');

const yearlyViewSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true },
  vues: { type: Number, required: true }
});

module.exports = mongoose.model('YearlyView', yearlyViewSchema);
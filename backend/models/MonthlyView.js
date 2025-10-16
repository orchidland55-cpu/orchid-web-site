// backend/models/MonthlyView.js
const mongoose = require('mongoose');

const monthlyViewSchema = new mongoose.Schema({
  jour: { type: String, required: true },
  moisPrecedent: { type: Number, required: true },
  moisActuel: { type: Number, required: true }
});

module.exports = mongoose.model('MonthlyView', monthlyViewSchema);
// 📄 models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    trim: true
  },
  item: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['property', 'blog', 'contact', 'user', 'postulation', 'unknown'],
    default: 'unknown'
  },
  performedBy: {  // ✅ NOUVEAU CHAMP
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // ✅ AJOUTÉ : Supprime automatiquement après 24 heures (86400 secondes)
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Activity', activitySchema);
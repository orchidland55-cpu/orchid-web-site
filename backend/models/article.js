const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  featured: { type: Boolean, default: false },
  image: String,
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);

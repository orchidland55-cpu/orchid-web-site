const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  person: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  featured: { type: Boolean, default: false },
  image: String,
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },

  // Slug SEO : généré automatiquement depuis le titre (partie avant –, |, /, etc.)
  // sparse: true → les docs existants sans slug ne causent pas de conflit d'index unique
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },

  seoTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  focusKeyword: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  canonicalUrl: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  twitterTitle: { type: String, default: "" },
  twitterDescription: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);
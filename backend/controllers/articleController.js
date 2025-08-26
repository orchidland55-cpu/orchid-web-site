const mongoose = require('mongoose');

// Redéfinir le schéma Article avec tous les champs nécessaires
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

// Utiliser le modèle existant ou en créer un nouveau
const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    console.log(`📋 ${articles.length} articles récupérés`);
    res.json(articles);
  } catch (err) {
    console.error('❌ Erreur getAllArticles:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    console.log(`📖 Article récupéré: ${article.title}`);
    res.json(article);
  } catch (err) {
    console.error('❌ Erreur getArticleById:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST a new article
exports.addArticle = async (req, res) => {
  try {
    console.log('📝 Création d\'un nouvel article...');
    console.log('📋 Données reçues:', JSON.stringify(req.body, null, 2));
    
    // Traitement spécial pour les tags
    let processedData = { ...req.body };
    if (typeof processedData.tags === 'string') {
      processedData.tags = processedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    console.log('🔄 Données traitées:', JSON.stringify(processedData, null, 2));
    
    const article = new Article(processedData);
    console.log('💾 Article avant sauvegarde:', JSON.stringify(article.toObject(), null, 2));
    
    await article.save();
    console.log('✅ Article sauvegardé avec succès:', article._id);
    console.log('🔍 Article final:', JSON.stringify(article.toObject(), null, 2));
    
    res.status(201).json(article);
  } catch (err) {
    console.error('❌ Erreur création article:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT update article
exports.updateArticle = async (req, res) => {
  try {
    console.log(`📝 Mise à jour article ${req.params.id}...`);
    console.log('📋 Données reçues:', JSON.stringify(req.body, null, 2));
    
    // Traitement spécial pour les tags
    let processedData = { ...req.body };
    if (typeof processedData.tags === 'string') {
      processedData.tags = processedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    const article = await Article.findByIdAndUpdate(
      req.params.id, 
      processedData, 
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    console.log('✅ Article mis à jour:', article._id);
    res.json(article);
  } catch (err) {
    console.error('❌ Erreur mise à jour article:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE article
exports.deleteArticle = async (req, res) => {
  try {
    console.log(`🗑️ Suppression article ${req.params.id}...`);

    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    console.log('✅ Article supprimé:', article.title);
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('❌ Erreur suppression article:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST increment article views
exports.incrementArticleViews = async (req, res) => {
  try {
    console.log(`👁️ Incrémentation des vues pour l'article ${req.params.id}...`);

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    console.log(`✅ Vues incrémentées: ${article.views}`);
    res.json({
      success: true,
      views: article.views,
      message: 'Vue ajoutée avec succès'
    });
  } catch (err) {
    console.error('❌ Erreur incrémentation vues:', err);
    res.status(500).json({ error: err.message });
  }
};

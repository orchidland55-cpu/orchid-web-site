const Article = require("../models/article");
const Activity = require("../models/Activity");
const CountryView = require('../models/CountryView');

// Fonction pour obtenir le pays depuis l'IP
async function getCountryFromIP(ip) {
  try {
    if (ip === '127.0.0.1' || ip === '::1') return 'Maroc';

    const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

    if (ipNum >= 0xC5000000 && ipNum <= 0xC5FFFFFF) return 'Maroc';
    if (ipNum >= 0xC2000000 && ipNum <= 0xC2FFFFFF) return 'France';
    if (ipNum >= 0x58000000 && ipNum <= 0x58FFFFFF) return 'Espagne';
    if (ipNum >= 0x50000000 && ipNum <= 0x50FFFFFF) return 'Allemagne';
    if (ipNum >= 0x4F000000 && ipNum <= 0x4FFFFFFF) return 'Italie';

    return 'Autres';
  } catch (error) {
    console.error('Erreur lors de la détermination du pays:', error);
    return 'Autres';
  }
}

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new article
exports.addArticle = async (req, res) => {
  try {
    let processedData = { ...req.body };

    // Traitement des tags (si envoyés comme une chaîne)
    if (typeof processedData.tags === "string") {
      processedData.tags = processedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Création de l'article
    const article = new Article(processedData);
    await article.save();

    // Enregistrer une activité si l'article est publié
    if (article.status === 'published') {
      const activity = new Activity({
        action: "Article publié",
        item: article.title || "Sans titre",
        type: "blog",
        performedBy: article.person || "admin" // Utilise le champ du modèle
      });
      await activity.save();
    }

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update article
exports.updateArticle = async (req, res) => {
  try {
    let processedData = { ...req.body };

    // Traitement des tags (si envoyés comme une chaîne)
    if (typeof processedData.tags === "string") {
      processedData.tags = processedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Mise à jour de l'article
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );

    if (!article) return res.status(404).json({ error: "Article not found" });

    // Enregistrer une activité si l'article est publié
    if (article.status === 'published') {
      const activity = new Activity({
        action: "Article mis à jour",
        item: article.title || "Sans titre",
        type: "blog",
        performedBy: article.person || "admin" // Utilise le champ du modèle mis à jour
      });
      await activity.save();
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE article
exports.deleteArticle = async (req, res) => {
  try {
    // Trouver l'article avant de le supprimer
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    // Enregistrer l'activité de suppression
    const activity = new Activity({
      action: "Article supprimé",
      item: article.title || "Sans titre",
      type: "blog",
      performedBy: article.person || "admin" // Utilise le champ du modèle avant suppression
    });
    await activity.save();

    // Supprimer l'article
    await Article.findByIdAndDelete(req.params.id);

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error('❌ Erreur deleteArticle:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST increment article views
exports.incrementArticleViews = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) return res.status(404).json({ error: "Article not found" });

    // Analytics: Tracker la vue d'article
    try {
      const clientIP = req.ip ||
                       req.connection.remoteAddress ||
                       req.socket.remoteAddress ||
                       (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                       '127.0.0.1';

      const cleanIP = clientIP.replace(/^::ffff:/, '');
      const country = await getCountryFromIP(cleanIP);

      // Incrémenter les vues pour ce pays
      await CountryView.findOneAndUpdate(
        { pays: country },
        { $inc: { vues: 1 } },
        { upsert: true, new: true }
      );

      // Recalculer les pourcentages
      const totalViews = await CountryView.aggregate([{ $group: { _id: null, total: { $sum: "$vues" } } }]);
      const total = totalViews[0]?.total || 1;

      await CountryView.updateMany({}, [
        { $set: { pourcentage: { $round: [{ $multiply: [{ $divide: ["$vues", total] }, 100] }, 1] } } }
      ]);

      console.log(`📄 Article vu: ${article.title} depuis ${country} (${cleanIP})`);

    } catch (analyticsError) {
      console.error('Erreur analytics article:', analyticsError);
    }

    res.json({ success: true, views: article.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
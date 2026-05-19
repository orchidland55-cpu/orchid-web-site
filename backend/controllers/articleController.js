const mongoose = require('mongoose');
const Article = require("../models/article");
const Activity = require("../models/Activity");
const CountryView = require('../models/CountryView');

// ---------------------------------------------------------------------------
// Génération du slug — même logique que propertyController
// Coupe avant le premier délimiteur fort : –  —  |  :  /  ou  " - "
// Exemple : "Top 10 villas à Marrakech – Guide 2024" → "top-10-villas-a-marrakech"
// ---------------------------------------------------------------------------
function generateSlug(title) {
  if (!title) return '';

  const cutPattern = /\s*[–—|:/]\s*|\s+-\s+/;
  const [firstPart] = title.split(cutPattern);

  const accentMap = {
    à:'a',â:'a',ä:'a',á:'a',ã:'a',
    è:'e',é:'e',ê:'e',ë:'e',
    î:'i',ï:'i',í:'i',ì:'i',
    ô:'o',ö:'o',ó:'o',ò:'o',õ:'o',
    û:'u',ü:'u',ú:'u',ù:'u',
    ç:'c',ñ:'n',
    À:'a',Â:'a',Ä:'a',Á:'a',
    È:'e',É:'e',Ê:'e',Ë:'e',
    Î:'i',Ï:'i',Ô:'o',Ö:'o',
    Û:'u',Ü:'u',Ç:'c',Ñ:'n',
  };

  return firstPart
    .replace(/[àâäáãèéêëîïíìôöóòõûüúùçñÀÂÄÁÈÉÊËÎÏÔÖÛÜÇÑ]/g, c => accentMap[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Garantit l'unicité du slug en ajoutant un suffixe numérique si nécessaire
// ---------------------------------------------------------------------------
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug    = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Article.findOne(query).select('_id').lean();
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// ---------------------------------------------------------------------------
// Lookup hybride : slug en priorité, puis _id MongoDB (rétrocompatibilité)
// ---------------------------------------------------------------------------
async function findArticleBySlugOrId(param) {
  // Essai 1 : slug
  const bySlug = await Article.findOne({ slug: param });
  if (bySlug) return bySlug;

  // Essai 2 : _id MongoDB
  if (mongoose.Types.ObjectId.isValid(param)) {
    return Article.findById(param);
  }

  return null;
}

// ---------------------------------------------------------------------------
// Fonction pour obtenir le pays depuis l'IP
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// GET all articles
// ---------------------------------------------------------------------------
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// GET article by slug OU _id (rétrocompatible)
// ---------------------------------------------------------------------------
exports.getArticleById = async (req, res) => {
  try {
    const article = await findArticleBySlugOrId(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST — créer un article
// Le slug est généré depuis le titre (ou depuis seoTitle/slug si fourni manuellement)
// ---------------------------------------------------------------------------
exports.addArticle = async (req, res) => {
  try {
    let processedData = { ...req.body };

    // Traitement des tags
    if (typeof processedData.tags === "string") {
      processedData.tags = processedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Générer le slug
    // Priorité : slug manuel (champ SEO) → sinon depuis le titre
    const rawSlug = processedData.slug && processedData.slug.trim()
      ? generateSlug(processedData.slug)
      : generateSlug(processedData.title);

    processedData.slug = await ensureUniqueSlug(rawSlug);
    console.log('🔗 Slug article généré:', processedData.slug);

    const article = new Article(processedData);
    await article.save();

    if (article.status === 'published') {
      const activity = new Activity({
        action: "Article publié",
        item: article.title || "Sans titre",
        type: "blog",
        performedBy: article.person || "admin"
      });
      await activity.save();
    }

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// PUT — mettre à jour un article
// Régénère le slug si le titre change (sauf si un slug manuel est fourni)
// ---------------------------------------------------------------------------
exports.updateArticle = async (req, res) => {
  try {
    const existing = await Article.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Article not found" });

    let processedData = { ...req.body };

    // Traitement des tags
    if (typeof processedData.tags === "string") {
      processedData.tags = processedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Gestion du slug
    const titleChanged = processedData.title && processedData.title !== existing.title;
    const manualSlug   = processedData.slug && processedData.slug.trim();

    if (manualSlug && processedData.slug !== existing.slug) {
      // Slug fourni manuellement par l'admin
      const rawSlug = generateSlug(processedData.slug);
      processedData.slug = await ensureUniqueSlug(rawSlug, req.params.id);
    } else if (titleChanged && !manualSlug) {
      // Le titre a changé → régénérer automatiquement
      const rawSlug = generateSlug(processedData.title);
      processedData.slug = await ensureUniqueSlug(rawSlug, req.params.id);
    } else {
      // Ne pas toucher au slug existant
      delete processedData.slug;
    }

    console.log('🔗 Slug article après update:', processedData.slug || existing.slug);

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );

    if (article.status === 'published') {
      const activity = new Activity({
        action: "Article mis à jour",
        item: article.title || "Sans titre",
        type: "blog",
        performedBy: article.person || "admin"
      });
      await activity.save();
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// DELETE article
// ---------------------------------------------------------------------------
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const activity = new Activity({
      action: "Article supprimé",
      item: article.title || "Sans titre",
      type: "blog",
      performedBy: article.person || "admin"
    });
    await activity.save();

    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error('❌ Erreur deleteArticle:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST increment article views — accepte slug OU _id
// ---------------------------------------------------------------------------
exports.incrementArticleViews = async (req, res) => {
  try {
    // La route existante utilise l'_id, on garde la compatibilité
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) return res.status(404).json({ error: "Article not found" });

    try {
      const clientIP = req.ip ||
                       req.connection.remoteAddress ||
                       req.socket.remoteAddress ||
                       (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                       '127.0.0.1';

      const cleanIP = clientIP.replace(/^::ffff:/, '');
      const country = await getCountryFromIP(cleanIP);

      await CountryView.findOneAndUpdate(
        { pays: country },
        { $inc: { vues: 1 } },
        { upsert: true, new: true }
      );

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
const mongoose = require('mongoose');
const Property = require('../models/Property');
const Activity = require('../models/Activity');
const CountryView = require('../models/CountryView');

// ---------------------------------------------------------------------------
// Génération du slug façon WordPress / SEO
// Règle : on prend la partie du titre AVANT le premier délimiteur fort
//         (–  —  |  :  /  _  avec espaces optionnels autour)
//         puis on transforme en kebab-case ASCII.
//
// Exemples :
//   "Ultimate Luxury Palace in Marrakech – Orchid Island Estate"
//     → "ultimate-luxury-palace-in-marrakech"
//   "Villa Prestige | Vue mer | Casablanca"
//     → "villa-prestige"
//   "Appartement 3 chambres - Rabat"
//     → "appartement-3-chambres"       (tiret simple conservé, pas coupé)
// ---------------------------------------------------------------------------
function generateSlug(title) {
  if (!title) return '';

  // 1. Couper avant le premier délimiteur fort (–, —, |, :, /)
  //    Le tiret simple entouré d'espaces est aussi un délimiteur fort.
  //    On NE coupe PAS sur un tiret collé (ex: "Dar-El-Bacha" reste intact).
  const cutPattern = /\s*[–—|:/]\s*|\s+-\s+/;
  const [firstPart] = title.split(cutPattern);

  // 2. Translittération légère des caractères accentués fréquents en français/arabe
  const accentMap = {
    à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a',
    è: 'e', é: 'e', ê: 'e', ë: 'e',
    î: 'i', ï: 'i', í: 'i', ì: 'i',
    ô: 'o', ö: 'o', ó: 'o', ò: 'o', õ: 'o',
    û: 'u', ü: 'u', ú: 'u', ù: 'u',
    ç: 'c', ñ: 'n',
    À: 'a', Â: 'a', Ä: 'a', Á: 'a',
    È: 'e', É: 'e', Ê: 'e', Ë: 'e',
    Î: 'i', Ï: 'i',
    Ô: 'o', Ö: 'o',
    Û: 'u', Ü: 'u',
    Ç: 'c', Ñ: 'n',
  };

  let slug = firstPart
    .replace(/[àâäáãèéêëîïíìôöóòõûüúùçñÀÂÄÁÈÉÊËÎÏÔÖÛÜÇÑ]/g, c => accentMap[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // supprime les caractères non-alphanumériques sauf tiret/espace
    .trim()
    .replace(/\s+/g, '-')           // espaces → tirets
    .replace(/-+/g, '-')            // tirets multiples → un seul
    .replace(/^-|-$/g, '');         // supprime tirets en début/fin

  return slug;
}

// ---------------------------------------------------------------------------
// Garantit l'unicité du slug en ajoutant un suffixe numérique si nécessaire
// Ex : "luxury-villa" → "luxury-villa-2" si le premier existe déjà
// ---------------------------------------------------------------------------
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Property.findOne(query).select('_id').lean();
    if (!existing) break;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// ---------------------------------------------------------------------------
// Lookup hybride : accepte un slug OU un ObjectId MongoDB
// Ordre : slug en priorité (plus fréquent en production), puis _id
// ---------------------------------------------------------------------------
async function findPropertyBySlugOrId(param) {
  // Essai 1 : slug
  const bySlug = await Property.findOne({ slug: param });
  if (bySlug) return bySlug;

  // Essai 2 : _id MongoDB (rétrocompatibilité avec les anciens liens)
  if (mongoose.Types.ObjectId.isValid(param)) {
    return Property.findById(param);
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
// GET all properties
// ---------------------------------------------------------------------------
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    console.error('❌ Erreur getAllProperties:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// GET a property by slug OR MongoDB _id  (rétrocompatible)
// ---------------------------------------------------------------------------
exports.getPropertyById = async (req, res) => {
  try {
    const property = await findPropertyBySlugOrId(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    console.log('📖 Retrieved property:', property.title);
    console.log('📖 Slug:', property.slug);
    console.log('📖 Main image present:', !!property.mainImage);
    console.log('📖 Main image length:', property.mainImage?.length || 0);
    console.log('📖 Additional images count:', property.additionalImages?.length || 0);

    // Analytics: tracker la vue de propriété
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

      console.log(`🏠 Propriété vue: ${property.title} depuis ${country} (${cleanIP})`);
    } catch (analyticsError) {
      console.error('Erreur analytics propriété:', analyticsError);
    }

    res.json(property);
  } catch (err) {
    console.error('❌ Erreur getPropertyById:', err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST — créer une propriété
// Le slug est généré automatiquement depuis le titre si non fourni,
// ou validé/nettoyé s'il est fourni manuellement par l'admin.
// ---------------------------------------------------------------------------
exports.addProperty = async (req, res) => {
  try {
    console.log('📝 Creating property:', req.body.title);

    // Générer le slug
    const rawSlug = req.body.slug
      ? generateSlug(req.body.slug)   // slug manuel fourni par le frontend (champ SEO)
      : generateSlug(req.body.title); // slug automatique depuis le titre

    const slug = await ensureUniqueSlug(rawSlug);
    console.log('🔗 Slug généré:', slug);

    const property = new Property({ ...req.body, slug });
    const savedProperty = await property.save();

    console.log('✅ Property saved — slug:', savedProperty.slug);

    const activity = new Activity({
      action: "Propriété créée",
      item: property.title || "Sans titre",
      type: "property",
      performedBy: property.person || "admin"
    });
    await activity.save();

    res.status(201).json(savedProperty);
  } catch (err) {
    console.error('❌ Erreur addProperty:', err);
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// PUT — mettre à jour une propriété
// Si le titre change ET qu'aucun slug manuel n'est fourni, on régénère le slug.
// ---------------------------------------------------------------------------
exports.updateProperty = async (req, res) => {
  try {
    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Property not found' });

    const updateData = { ...req.body };

    // Régénérer le slug si :
    //   - un slug manuel est fourni dans le body  → on le nettoie
    //   - le titre a changé ET pas de slug existant → on génère
    //   - le titre a changé ET le slug existant était auto (= dérivé de l'ancien titre) → on régénère
    const titleChanged = req.body.title && req.body.title !== existing.title;
    const manualSlug   = req.body.slug && req.body.slug.trim();

    if (manualSlug) {
      // Slug fourni manuellement par l'admin (champ SEO)
      const rawSlug = generateSlug(manualSlug);
      updateData.slug = await ensureUniqueSlug(rawSlug, req.params.id);
    } else if (titleChanged) {
      // Le titre a changé → on régénère automatiquement
      const rawSlug = generateSlug(req.body.title);
      updateData.slug = await ensureUniqueSlug(rawSlug, req.params.id);
    }
    // Sinon : on ne touche pas au slug existant

    console.log('🔗 Slug après update:', updateData.slug || existing.slug);

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });

    const activity = new Activity({
      action: "Propriété mise à jour",
      item: property.title || "Sans titre",
      type: "property",
      performedBy: property.person || "admin"
    });
    await activity.save();

    res.json(property);
  } catch (err) {
    console.error('❌ Erreur updateProperty:', err);
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// DELETE a property
// ---------------------------------------------------------------------------
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const activity = new Activity({
      action: "Propriété supprimée",
      item: property.title || "Sans titre",
      type: "property",
      performedBy: property.person || "admin"
    });
    await activity.save();

    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('❌ Erreur deleteProperty:', err);
    res.status(500).json({ error: err.message });
  }
};
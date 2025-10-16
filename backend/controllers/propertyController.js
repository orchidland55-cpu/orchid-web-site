const Property = require('../models/Property');
const Activity = require('../models/Activity');
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

// GET all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    console.error('❌ Erreur getAllProperties:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    console.log('📖 Retrieved property:');
    console.log('📖 Main image present:', !!property.mainImage);
    console.log('📖 Main image length:', property.mainImage?.length || 0);
    console.log('📖 Additional images count:', property.additionalImages?.length || 0);
    console.log('📖 Additional images type:', Array.isArray(property.additionalImages) ? 'array' : typeof property.additionalImages);

    // Analytics: Tracker la vue de propriété
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

// POST a new property
exports.addProperty = async (req, res) => {
  try {
    console.log('📝 Creating property with data:');
    console.log('📝 Raw request body size:', JSON.stringify(req.body).length);
    console.log('📝 Main image present:', !!req.body.mainImage);
    console.log('📝 Main image length:', req.body.mainImage?.length || 0);
    console.log('📝 Additional images count:', req.body.additionalImages?.length || 0);
    console.log('📝 Additional images type:', Array.isArray(req.body.additionalImages) ? 'array' : typeof req.body.additionalImages);

    if (req.body.additionalImages && Array.isArray(req.body.additionalImages)) {
      console.log('📝 Additional images lengths:', req.body.additionalImages.map(img => img.length));
      console.log('📝 First additional image sample:', req.body.additionalImages[0]?.substring(0, 100));
    }

    const property = new Property(req.body);
    const savedProperty = await property.save();

    console.log('✅ Property saved successfully');
    console.log('✅ Saved mainImage length:', savedProperty.mainImage?.length || 0);
    console.log('✅ Saved additionalImages count:', savedProperty.additionalImages?.length || 0);

    const activity = new Activity({
      action: "Propriété créée",
      item: property.title || property.name || "Sans titre",
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

// PUT update a property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const activity = new Activity({
      action: "Propriété mise à jour",
      item: property.title || property.name || "Sans titre",
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

// DELETE a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const activity = new Activity({
      action: "Propriété supprimée",
      item: property.title || property.name || "Sans titre",
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

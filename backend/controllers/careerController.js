const Career = require('../models/Career');
const Activity = require('../models/Activity');

exports.getAllCareers = async (req, res) => {
  try {
    // ✅ req.user n'existe que si un token valide a été fourni (voir middleware optionalAuth)
    const isPrivileged = req.user && ['admin', 'editor'].includes(req.user.role);
    const filter = isPrivileged ? {} : { status: 'active' };

    const careers = await Career.find(filter).sort({ createdAt: -1 });
    res.json(careers);
  } catch (err) {
    console.error('❌ Erreur getAllCareers:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ error: "Offre non trouvée." });
    }

    // ✅ Un visiteur public ne peut pas voir une offre non active (draft/fermée)
    const isPrivileged = req.user && ['admin', 'editor'].includes(req.user.role);
    if (!isPrivileged && career.status !== 'active') {
      return res.status(404).json({ error: "Offre non trouvée." });
    }

    res.json(career);
  } catch (err) {
    console.error('❌ Erreur getCareerById:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ error: "Offre non trouvée." });
    }

    const activity = new Activity({
      action: "Offre supprimée",
      item: career.title,
      type: "career",
      performedBy: req.query.person || "admin"
    });
    await activity.save();

    res.json({ message: "Offre supprimée avec succès." });
  } catch (err) {
    console.error('❌ Erreur deleteCareer:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!career) {
      return res.status(404).json({ error: "Offre non trouvée." });
    }

    const activity = new Activity({
      action: "Offre modifiée",
      item: career.title,
      type: "career",
      performedBy: req.body.person || "admin"
    });
    await activity.save();

    res.json(career);
  } catch (err) {
    console.error('❌ Erreur updateCareer:', err);
    res.status(400).json({ error: err.message, details: err.errors });
  }
};

exports.addCareer = async (req, res) => {
  try {
    console.log("📥 Requête reçue:", req.body);
    if (!req.body.title || !req.body.description || !req.body.city || !req.body.contractType) {
      console.error("❌ Validation échouée: Champs manquants");
      return res.status(400).json({ error: "Tous les champs requis sont manquants." });
    }

    const career = new Career(req.body);
    await career.save();

    const activity = new Activity({
      action: "Offre créée",
      item: career.title,
      type: "career",
      performedBy: req.body.person || "admin"
    });
    await activity.save();

    res.status(201).json(career);
  } catch (err) {
    console.error('❌ Erreur addCareer détaillée:', err);
    res.status(400).json({ error: err.message, details: err.errors });
  }
};
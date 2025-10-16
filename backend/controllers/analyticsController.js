// backend/controllers/analyticsController.js
const YearlyView = require('../models/YearlyView');
const MonthlyView = require('../models/MonthlyView');
const CountryView = require('../models/CountryView');

exports.getYearlyViews = async (req, res) => {
  try {
    const data = await YearlyView.find().sort({ year: 1 });
    const withGrowth = data.map((item, index) => {
      if (index === 0) return { ...item.toObject(), croissance: null };
      const prev = data[index - 1].vues;
      const growth = ((item.vues - prev) / prev * 100).toFixed(1);
      return { ...item.toObject(), croissance: growth };
    });
    res.json(withGrowth);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getMonthlyComparison = async (req, res) => {
  try {
    const data = await MonthlyView.find().sort({ jour: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getCountryViews = async (req, res) => {
  try {
    const data = await CountryView.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.addViewToCountry = async (req, res) => {
  try {
    const { country } = req.body;
    if (!country) return res.status(400).json({ error: "Pays requis" });

    const updated = await CountryView.findOneAndUpdate(
      { pays: country },
      { $inc: { vues: 1 } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Pays non trouvé" });

    // Recalculer pourcentages
    const total = await CountryView.aggregate([{ $group: { _id: null, total: { $sum: "$vues" } } }]);
    const totalVues = total[0]?.total || 1;

    await CountryView.updateMany({}, [
      { $set: { pourcentage: { $round: [{ $multiply: [{ $divide: ["$vues", totalVues] }, 100] }, 1] } } }
    ]);

    res.json({ message: "Vue ajoutée", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
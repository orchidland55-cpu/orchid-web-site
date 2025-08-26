const mongoose = require('mongoose');

// Contrôleur pour les statistiques du dashboard
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques du dashboard...');

    // 1️⃣ Compter les propriétés totales
    const totalProperties = await mongoose.connection.db.collection('properties').countDocuments();
    
    // Propriétés ajoutées ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const propertiesThisMonth = await mongoose.connection.db.collection('properties').countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // 2️⃣ Compter les articles de blog
    const totalArticles = await mongoose.connection.db.collection('articles').countDocuments();
    
    // Articles ajoutés cette semaine
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    
    const articlesThisWeek = await mongoose.connection.db.collection('articles').countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // 3️⃣ Calculer les vues totales réelles à partir des articles
    const articlesWithViews = await mongoose.connection.db.collection('articles').find({}).toArray();
    const totalViews = articlesWithViews.reduce((sum, article) => sum + (article.views || 0), 0);

    // Calculer la croissance des vues (vues du mois dernier vs ce mois)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const articlesLastMonth = await mongoose.connection.db.collection('articles').find({
      createdAt: { $gte: lastMonth, $lt: startOfMonth }
    }).toArray();
    const viewsLastMonth = articlesLastMonth.reduce((sum, article) => sum + (article.views || 0), 0);

    const viewsGrowth = viewsLastMonth > 0 ? Math.round(((totalViews - viewsLastMonth) / viewsLastMonth) * 100) : 0;

    // 4️⃣ Compter les demandes de contact
    const totalContacts = await mongoose.connection.db.collection('contacts').countDocuments();
    
    // Contacts aujourd'hui
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const contactsToday = await mongoose.connection.db.collection('contacts').countDocuments({
      date: { $gte: startOfDay }
    });

    // 5️⃣ Préparer les statistiques
    const stats = {
      properties: {
        total: totalProperties,
        growth: propertiesThisMonth,
        growthText: `+${propertiesThisMonth} ce mois`,
        icon: "building",
        color: "blue"
      },
      articles: {
        total: totalArticles,
        growth: articlesThisWeek,
        growthText: `+${articlesThisWeek} cette semaine`,
        icon: "fileText",
        color: "green"
      },
      views: {
        total: totalViews,
        growth: viewsGrowth,
        growthText: `+${viewsGrowth}% ce mois`,
        icon: "eye",
        color: "purple"
      },
      contacts: {
        total: totalContacts,
        growth: contactsToday,
        growthText: `+${contactsToday} aujourd'hui`,
        icon: "messageCircle",
        color: "orange"
      }
    };

    console.log('✅ Statistiques calculées:', stats);

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur dans getDashboardStats:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
      details: error.message
    });
  }
};

// Statistiques détaillées pour chaque section
const getDetailedStats = async (req, res) => {
  try {
    const { type } = req.params; // 'properties', 'articles', 'contacts', 'views'

    let data = {};

    switch (type) {
      case 'properties':
        const properties = await mongoose.connection.db.collection('properties').find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();
        data = {
          recent: properties,
          byType: await getPropertiesByType(),
          byStatus: await getPropertiesByStatus()
        };
        break;

      case 'articles':
        const articles = await mongoose.connection.db.collection('articles').find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();
        data = {
          recent: articles,
          byCategory: await getArticlesByCategory(),
          byStatus: await getArticlesByStatus()
        };
        break;

      case 'contacts':
        const contacts = await mongoose.connection.db.collection('contacts').find({})
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray();
        data = {
          recent: contacts,
          byPropertyType: await getContactsByPropertyType(),
          byMonth: await getContactsByMonth()
        };
        break;

      default:
        return res.status(400).json({ error: 'Type de statistique invalide' });
    }

    res.status(200).json({
      success: true,
      type,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur dans getDetailedStats:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques détaillées",
      details: error.message
    });
  }
};

// Fonctions utilitaires
async function getPropertiesByType() {
  return await mongoose.connection.db.collection('properties').aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]).toArray();
}

async function getPropertiesByStatus() {
  return await mongoose.connection.db.collection('properties').aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]).toArray();
}

async function getArticlesByCategory() {
  return await mongoose.connection.db.collection('articles').aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]).toArray();
}

async function getArticlesByStatus() {
  return await mongoose.connection.db.collection('articles').aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]).toArray();
}

async function getContactsByPropertyType() {
  return await mongoose.connection.db.collection('contacts').aggregate([
    { $group: { _id: "$propertyType", count: { $sum: 1 } } }
  ]).toArray();
}

async function getContactsByMonth() {
  return await mongoose.connection.db.collection('contacts').aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 }
  ]).toArray();
}

// Export des fonctions
module.exports = {
  getDashboardStats,
  getDetailedStats
};

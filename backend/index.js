const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload'); // pour récupérer les fichiers
const Activity = require('./models/Activity');
const YearlyView = require('./models/YearlyView');
const MonthlyView = require('./models/MonthlyView');
const CountryView = require('./models/CountryView');
const User = require('./models/User');
const { verifyJWT, requireAdmin, requireAdminOrEditor } = require('./middleware/authMiddleware');
const {
     login, verifyToken, getAdmins,
     getUsers, createUser, updateUser, deleteUser,
     setPassword, resendInvite,
   } = require('./controllers/authController');

// Controllers
const propertyController = require('./controllers/propertyController');
const articleController = require('./controllers/articleController');
const contactController = require('./controllers/contactController');
const dashboardController = require('./controllers/dashboardController');
const { sendPostulation } = require('./controllers/postulationController');
const { sendInvestmentEmail } = require('./controllers/investController');
const { sendMessageToChatbot } = require('./controllers/chatbotController');

const rateLimit = require('express-rate-limit');
const {
  createSpace, getSpaces, getSpaceById, updateSpace, deleteSpace,
  accessSpace,
  getSpaceFiles, uploadFile, deleteFile,
} = require('./controllers/spaceController');
const { verifySpaceJWT, checkUploadAllowed } = require('./middleware/authMiddleware');
const { uploadSingle } = require('./middleware/uploadMiddleware');

dotenv.config(); // charge les variables d'environnement

const app = express();

const PORT = process.env.PORT || 3000;

// ===== Middlewares =====
app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
// app.use(fileUpload()); // middleware pour gérer les fichiers
app.use((req, res, next) => {
  // Ne pas appliquer express-fileupload sur les routes d'upload d'espaces
  // (ces routes utilisent multer à la place)
  if (req.path.startsWith('/api/spaces') && req.method === 'POST') {
    return next();
  }
  return fileUpload()(req, res, next);
});

// Debug middleware to log request sizes
app.use((req, res, next) => {
  if (req.path === '/properties' && req.method === 'POST') {
    console.log('📥 Incoming request to /properties:');
    console.log('📥 Content-Length:', req.headers['content-length']);
    console.log('📥 Content-Type:', req.headers['content-type']);
  }
  next();
});

// Fonction pour obtenir le pays depuis l'IP
async function getCountryFromIP(ip) {
  try {
    // Pour développement, on simule des pays basés sur l'IP
    if (ip === '127.0.0.1' || ip === '::1') return 'Maroc'; // Localhost = Maroc

    // Simulation simple basée sur des plages d'IP
    const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

    // Maroc: 197.0.0.0 - 197.255.255.255
    if (ipNum >= 0xC5000000 && ipNum <= 0xC5FFFFFF) return 'Maroc';
    // France: 194.0.0.0 - 194.255.255.255
    if (ipNum >= 0xC2000000 && ipNum <= 0xC2FFFFFF) return 'France';
    // Espagne: 88.0.0.0 - 88.255.255.255
    if (ipNum >= 0x58000000 && ipNum <= 0x58FFFFFF) return 'Espagne';
    // Allemagne: 80.0.0.0 - 80.255.255.255
    if (ipNum >= 0x50000000 && ipNum <= 0x50FFFFFF) return 'Allemagne';
    // Italie: 79.0.0.0 - 79.255.255.255
    if (ipNum >= 0x4F000000 && ipNum <= 0x4FFFFFFF) return 'Italie';

    return 'Autres';
  } catch (error) {
    console.error('Erreur lors de la détermination du pays:', error);
    return 'Autres';
  }
}

// Middleware d'analytics pour tracker les vues de pages
async function analyticsMiddleware(req, res, next) {
  // Ne pas tracker les routes admin et API internes
  if (req.path.startsWith('/admin') ||
      req.path.startsWith('/api') ||
      req.path === '/properties' ||
      req.path === '/articles' ||
      req.path === '/contacts' ||
      req.path === '/postulation' ||
      req.path === '/invest' ||
      req.path === '/chatbot' ||
      req.path === '/dashboard' ||
      req.method !== 'GET') {
    return next();
  }

  try {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const jour = `${day.toString().padStart(2, '0')}`;

    // Obtenir l'IP du client
    const clientIP = req.ip ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                     '127.0.0.1';

    // Nettoyer l'IP (enlever ::ffff: pour IPv4)
    const cleanIP = clientIP.replace(/^::ffff:/, '');

    // Déterminer le pays
    const country = await getCountryFromIP(cleanIP);

    // Tracker la vue annuelle
    await YearlyView.findOneAndUpdate(
      { year },
      { $inc: { vues: 1 } },
      { upsert: true, new: true }
    );

    // Tracker la vue mensuelle (mois actuel)
    await MonthlyView.findOneAndUpdate(
      { jour },
      { $inc: { moisActuel: 1 } },
      { upsert: true, new: true }
    );

    // Tracker la vue par pays
    await CountryView.findOneAndUpdate(
      { pays: country },
      { $inc: { vues: 1 } },
      { upsert: true, new: true }
    );

    // Recalculer les pourcentages pour tous les pays
    const totalViews = await CountryView.aggregate([{ $group: { _id: null, total: { $sum: "$vues" } } }]);
    const total = totalViews[0]?.total || 1;

    await CountryView.updateMany({}, [
      { $set: { pourcentage: { $round: [{ $multiply: [{ $divide: ["$vues", total] }, 100] }, 1] } } }
    ]);

    console.log(`📊 Vue trackée: ${req.path} depuis ${country} (${cleanIP})`);

  } catch (error) {
    console.error('Erreur analytics middleware:', error);
  }

  next();
}

// Limite les tentatives de connexion aux espaces : 5 essais / 15 min / IP
const spaceAccessLimiter = rateLimit({
  windowMs        : 15 * 60 * 1000,   // 15 minutes
  max             : 5,
  standardHeaders : true,
  legacyHeaders   : false,
  message         : {
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  },
  // En production, ajouter : keyGenerator: (req) => req.ip
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requêtes par IP
  message: "Trop de requêtes, veuillez réessayer plus tard."
});

app.use("/invest", limiter);

// Appliquer le middleware d'analytics
app.use(analyticsMiddleware);

// Routes d'authentification (PUBLIQUES)
app.post('/api/auth/login', login);
app.get('/api/auth/verify', verifyJWT, verifyToken);

// ===== Connect to MongoDB =====
mongoose.connect(process.env.MONGO_URI)
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ===== Test simple route =====
app.get('/', (req, res) => {
    res.send('Hello World from Node.js backend!');
});

// ===== CRUD routes for properties =====
app.get('/properties', propertyController.getAllProperties);
app.get('/properties/:id', propertyController.getPropertyById);
app.post('/properties', verifyJWT, requireAdminOrEditor, propertyController.addProperty);  // ✅ Éditeurs peuvent créer
app.put('/properties/:id', verifyJWT, requireAdminOrEditor, propertyController.updateProperty);  // ✅ Éditeurs peuvent modifier
app.delete('/properties/:id', verifyJWT, requireAdmin, propertyController.deleteProperty);  // ❌ Seuls admins peuvent supprimer

// ===== CRUD routes for articles =====
app.get('/articles', articleController.getAllArticles);
app.get('/articles/:id', articleController.getArticleById);
app.post('/articles', verifyJWT, requireAdminOrEditor, articleController.addArticle);  // ✅ Éditeurs peuvent créer
app.put('/articles/:id', verifyJWT, requireAdminOrEditor, articleController.updateArticle);  // ✅ Éditeurs peuvent modifier
app.delete('/articles/:id', verifyJWT, requireAdmin, articleController.deleteArticle);  // ❌ Seuls admins peuvent supprimer
app.post('/articles/:id/views', articleController.incrementArticleViews);

// ===== Contact routes =====
app.post('/contact', contactController.addContact);
app.get('/contacts', contactController.getAllContacts);
app.put('/contacts/:id/status', verifyJWT, requireAdmin, contactController.updateContactStatus);
app.delete('/contacts/:id', verifyJWT, requireAdmin, contactController.deleteContact);
app.post('/schedule-visit', contactController.scheduleVisit);
app.get('/test-email', contactController.testEmail);

// ===== Dashboard routes =====
app.get('/dashboard/stats', dashboardController.getDashboardStats);
app.get('/dashboard/details/:type', dashboardController.getDetailedStats);

// ===== Postulation route =====
app.post('/postulation', sendPostulation);

// ===== Invest route =====
app.post('/invest', sendInvestmentEmail);

// ===== Chatbot route =====
app.post('/chatbot', sendMessageToChatbot);

// 📄 Route dynamique pour les activités récentes (filtrées sur 24h)
app.get('/admin/recent-activities', verifyJWT, requireAdmin, async (req, res) => {
  console.log("✅ Envoi des activités récentes (moins de 24h) au frontend");

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await Activity.find({
      createdAt: { $gte: twentyFourHoursAgo }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('action item type createdAt performedBy');

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

// Route protégée — seul un admin connecté peut voir la liste
app.get('/api/auth/admins', verifyJWT, requireAdmin, getAdmins);

// Route publique — définir le mot de passe via token email
app.post('/api/auth/set-password', setPassword);
 
// Gestion des utilisateurs (admin uniquement)
app.get('/api/users',                      verifyJWT, requireAdmin, getUsers);
app.post('/api/users',                     verifyJWT, requireAdmin, createUser);
app.put('/api/users/:id',                  verifyJWT, requireAdmin, updateUser);
app.delete('/api/users/:id',               verifyJWT, requireAdmin, deleteUser);
app.post('/api/users/:id/resend-invite',   verifyJWT, requireAdmin, resendInvite);


// Importer les contrôleurs
const {
  getYearlyViews,
  getMonthlyComparison,
  getCountryViews,
  addViewToCountry
} = require('./controllers/analyticsController');

// Définir les routes
app.get('/api/analytics/yearly', getYearlyViews);
app.get('/api/analytics/monthly', getMonthlyComparison);
app.get('/api/analytics/countries', getCountryViews);

// Route POST pour ajouter une vue (optionnel — pour tester la dynamique)
app.post('/api/analytics/add-view', addViewToCountry);

// Route pour tracker les vues de pages depuis le frontend
app.post('/api/analytics/track-page', async (req, res) => {
  try {
    const { page } = req.body;
    const clientIP = req.ip ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                     '127.0.0.1';

    const cleanIP = clientIP.replace(/^::ffff:/, '');
    const country = await getCountryFromIP(cleanIP);

    // Tracker la vue annuelle
    const now = new Date();
    const year = now.getFullYear().toString();

    await YearlyView.findOneAndUpdate(
      { year },
      { $inc: { vues: 1 } },
      { upsert: true, new: true }
    );

    // Tracker la vue mensuelle
    const day = now.getDate();
    const jour = day.toString().padStart(2, '0');

    await MonthlyView.findOneAndUpdate(
      { jour },
      { $inc: { moisActuel: 1 } },
      { upsert: true, new: true }
    );

    // Tracker la vue par pays
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

    console.log(`📊 Page trackée: ${page} depuis ${country} (${cleanIP})`);

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur tracking page:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Auth visiteur (publique — protégée par rate limit)
app.post('/api/spaces/access', spaceAccessLimiter, accessSpace);
 
// Fichiers (visiteurs authentifiés — JWT d'espace)
app.get(
  '/api/spaces/:spaceId/files',
  verifySpaceJWT,
  getSpaceFiles
);
 
const { verifyAdminOrSpaceJWT, checkUploadAllowedOrAdmin } = require('./middleware/authMiddleware');

app.post(
  '/api/spaces/:spaceId/files',
  verifyAdminOrSpaceJWT,       // accepte JWT admin OU JWT espace
  checkUploadAllowedOrAdmin,   // admin = toujours OK / visiteur = vérifie allowUpload
  uploadSingle,
  uploadFile
);
 
// Suppression de fichier — accessible aussi par l'admin avec son JWT standard
// On accepte soit un JWT d'espace (admin de l'espace) soit un JWT admin global
app.delete(
  '/api/spaces/:spaceId/files/:fileId',
  verifyJWT,
  requireAdmin,
  deleteFile
);

app.get('/api/users/assignable', verifyJWT, requireAdminOrEditor, async (req, res) => {
  const users = await User.find({}, 'name');
  res.json({ success: true, data: users });
});
 
// CRUD espaces (admin uniquement)
app.get    ('/api/spaces',     verifyJWT, requireAdmin, getSpaces);
app.post   ('/api/spaces',     verifyJWT, requireAdmin, createSpace);
app.get    ('/api/spaces/:id', verifyJWT, requireAdmin, getSpaceById);
app.put    ('/api/spaces/:id', verifyJWT, requireAdmin, updateSpace);
app.delete ('/api/spaces/:id', verifyJWT, requireAdmin, deleteSpace);

// Route de test
app.get('/', (req, res) => {
  res.send('✅ Backend Analytics API is running!');
});


// ===== Start server =====
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
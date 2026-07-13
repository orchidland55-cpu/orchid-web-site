const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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
const careerController = require('./controllers/careerController');
const { sendPostulation } = require('./controllers/postulationController');
const { sendInvestmentEmail } = require('./controllers/investController');
const { sendMessageToChatbot } = require('./controllers/chatbotController');
const { testOdooConnection } = require("./services/odooService");
const axios = require("axios");
const Lead = require("./models/Lead");
const LeadActivity = require("./models/LeadActivity");

const {
  trackPropertyView,
  trackWhatsAppClick,
  trackPropertyTime,
  trackServiceTime,
  syncLeadToOdoo
} = require("./controllers/leadActivityController");

const leadAnalyticsController =
  require("./controllers/leadAnalyticsController");


const rateLimit = require('express-rate-limit');
const {
  createSpace, getSpaces, getSpaceById, updateSpace, deleteSpace,
  accessSpace,
  getSpaceFiles, uploadFile, deleteFile,
} = require('./controllers/spaceController');
const { verifySpaceJWT, checkUploadAllowed } = require('./middleware/authMiddleware');
const { uploadSingle } = require('./middleware/uploadMiddleware');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // cache 5 minutes

// Middleware de cache
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) {
    return res.json(cached);
  }
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, data);
    return originalJson(data);
  };
  next();
};

const app = express();
app.set('trust proxy', 1); // pour obtenir l'IP réelle du client derrière un proxy (ex: Railway)
app.use(compression());
// Helmet config: disable helmet-managed CSP (frontend can be configured separately)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// IMPORTANT: Do NOT set document-level CSP from within API endpoints.
// CSP is enforced by the browser on the *page* origin, and adding restrictive
// headers here can break admin login/verify fetch() calls.
//
// If you need CSP, configure it at the HTML/document layer (or remove it from
// the API layer entirely).


const PORT = process.env.PORT || 3000;

// ===== Middlewares =====
// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
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

async function getLocationFromIP(ip) {

  try {

    const response = await axios.get(
      `http://ip-api.com/json/${ip}`
    );

    return {
      country: response.data.country || "Unknown",
      city: response.data.city || "Unknown"
    };

  } catch (error) {

    console.error("Location lookup failed:", error.message);

    return {
      country: "Unknown",
      city: "Unknown"
    };
  }
}

async function getLocationFromCoordinates(latitude, longitude) {

  try {

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
      {
        headers: {
          "User-Agent": "OrchidIsland/1.0"
        }
      }
    );

    const address = response.data.address;

    return {
      country:
        address.country || "Unknown",

      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        "Unknown"
    };

  } catch (error) {

    console.error(
      "GPS reverse geocoding failed:",
      error.message
    );

    return {
      country: "Unknown",
      city: "Unknown"
    };
  }
}

// Middleware d'analytics pour tracker les vues de pages
async function analyticsMiddleware(req, res, next) {
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

  const now = new Date();
  const year = now.getFullYear().toString();
  const day = now.getDate();
  const jour = day.toString().padStart(2, '0');

  const clientIP = req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    '127.0.0.1';

  const cleanIP = clientIP.replace(/^::ffff:/, '');


  const country = await getCountryFromIP(cleanIP);

  // Fire and forget
  YearlyView.findOneAndUpdate(
    { year },
    { $inc: { vues: 1 } },
    { upsert: true, new: true }
  ).catch(console.error);

  MonthlyView.findOneAndUpdate(
    { jour },
    { $inc: { moisActuel: 1 } },
    { upsert: true, new: true }
  ).catch(console.error);

  CountryView.findOneAndUpdate(
    { pays: country },
    { $inc: { vues: 1 } },
    { upsert: true, new: true }
  ).then(async () => {
    const totalViews = await CountryView.aggregate([
      { $group: { _id: null, total: { $sum: "$vues" } } }
    ]);
    const total = totalViews[0]?.total || 1;
    await CountryView.updateMany({}, [
      { $set: { pourcentage: { $round: [{ $multiply: [{ $divide: ["$vues", total] }, 100] }, 1] } } }
    ]);
  }).catch(console.error);

  console.log(`📊 Vue trackée: ${req.path} depuis ${country} (${cleanIP})`);

  next();
}

// Limite les tentatives de connexion aux espaces : 5 essais / 15 min / IP
const spaceAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  },
  // En production, ajouter : keyGenerator: (req) => req.ip
});

// Limiter global
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return (
      req.path === "/" ||
      req.path.startsWith("/properties") ||
      req.path.startsWith("/articles") ||
      req.path.startsWith("/api/analytics/track-page")
    );
  }
});

app.use("/api", apiLimiter);

// Anti brute-force login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Trop de tentatives de connexion. Réessayez dans 15 minutes."
});

// Formulaires publics
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Limite de soumissions atteinte. Réessayez dans 1 heure."
});

// Appliquer le middleware d'analytics
app.use(analyticsMiddleware);

// Routes d'authentification (PUBLIQUES)
app.post('/api/auth/login', loginLimiter, login);
app.get('/api/auth/verify', verifyJWT, verifyToken);

// ===== Connect to MongoDB =====
mongoose.connect(process.env.MONGO_URI)
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//.then(() => console.log("MongoDB connected"))
//.catch(err => console.log("MongoDB connection error:", err));
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    testOdooConnection()
      .then(uid => {
        console.log("✅ Odoo Connected. UID:", uid);
      })
      .catch(err => {
        console.log("❌ Odoo Authentication Failed");
      });

  })
  .catch(err => console.log("MongoDB connection error:", err));

// ===== Test simple route =====
app.get('/', (req, res) => {
  res.send('Hello World from Node.js backend!');
});

// ===== CRUD routes for properties =====
app.get('/properties', cacheMiddleware, propertyController.getAllProperties);
app.get('/properties/:id', cacheMiddleware, propertyController.getPropertyById);

app.post('/properties', verifyJWT, requireAdminOrEditor, (req, res, next) => {
  cache.flushAll();
  next();
}, propertyController.addProperty);

app.put('/properties/:id', verifyJWT, requireAdminOrEditor, (req, res, next) => {
  cache.flushAll();
  next();
}, propertyController.updateProperty);

app.delete('/properties/:id', verifyJWT, requireAdmin, (req, res, next) => {
  cache.flushAll();
  next();
}, propertyController.deleteProperty);

// ===== CRUD routes for articles =====
app.get('/articles', cacheMiddleware, articleController.getAllArticles);
app.get('/articles/:id', cacheMiddleware, articleController.getArticleById);

app.post('/articles', verifyJWT, requireAdminOrEditor, (req, res, next) => {
  cache.flushAll();
  next();
}, articleController.addArticle);

app.put('/articles/:id', verifyJWT, requireAdminOrEditor, (req, res, next) => {
  cache.flushAll();
  next();
}, articleController.updateArticle);

app.delete('/articles/:id', verifyJWT, requireAdmin, (req, res, next) => {
  cache.flushAll();
  next();
}, articleController.deleteArticle);

app.post('/articles/:id/views', articleController.incrementArticleViews);

// ===== Contact routes =====
app.post('/contact', formLimiter, contactController.addContact);
app.get('/contacts', verifyJWT, requireAdmin, contactController.getAllContacts);
app.put('/contacts/:id/status', verifyJWT, requireAdmin, contactController.updateContactStatus);
app.delete('/contacts/:id', verifyJWT, requireAdmin, contactController.deleteContact);
app.post('/schedule-visit', contactController.scheduleVisit);
app.get(
  "/lead-analytics",
  leadAnalyticsController.getLeadAnalytics
);

app.post(
  "/lead-activity/view-property",
  trackPropertyView
);

app.post(
  "/lead-activity/whatsapp-click",
  trackWhatsAppClick
);

app.post(
  "/lead-activity/property-time",
  trackPropertyTime
);

app.post(
  "/lead-activity/service-time",
  trackServiceTime
);
// ===== Dashboard routes =====
app.get('/dashboard/stats', verifyJWT, requireAdminOrEditor, dashboardController.getDashboardStats);
app.get('/dashboard/details/:type', verifyJWT, requireAdminOrEditor, dashboardController.getDetailedStats);

// ===== Career routes =====
app.get('/api/careers', verifyJWT, requireAdminOrEditor, careerController.getAllCareers);
app.get('/api/careers/:id', verifyJWT, requireAdminOrEditor, careerController.getCareerById);
app.post('/api/careers', verifyJWT, requireAdminOrEditor, careerController.addCareer);
app.put('/api/careers/:id', verifyJWT, requireAdminOrEditor, careerController.updateCareer);
app.delete('/api/careers/:id', verifyJWT, requireAdminOrEditor, careerController.deleteCareer);

// ===== Postulation route =====
app.post('/postulation', formLimiter, sendPostulation);

// ===== Invest route =====
app.post('/invest', formLimiter, sendInvestmentEmail);

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
app.get('/api/users', verifyJWT, requireAdmin, getUsers);
app.post('/api/users', verifyJWT, requireAdmin, createUser);
app.put('/api/users/:id', verifyJWT, requireAdmin, updateUser);
app.delete('/api/users/:id', verifyJWT, requireAdmin, deleteUser);
app.post('/api/users/:id/resend-invite', verifyJWT, requireAdmin, resendInvite);


// Importer les contrôleurs
const {
  getYearlyViews,
  getMonthlyComparison,
  getCountryViews,
  addViewToCountry
} = require('./controllers/analyticsController');

// Définir les routes
app.get('/api/analytics/yearly', verifyJWT, requireAdminOrEditor, getYearlyViews);
app.get('/api/analytics/monthly', verifyJWT, requireAdminOrEditor, getMonthlyComparison);
app.get('/api/analytics/countries', verifyJWT, requireAdminOrEditor, getCountryViews);
app.post('/api/analytics/add-view', verifyJWT, requireAdmin, addViewToCountry);

// Route pour tracker les vues de pages depuis le frontend
app.post('/api/analytics/track-page', async (req, res) => {
  try {
    const {
      page,
      visitorId,
      latitude,
      longitude,
      locationSource
    } = req.body;

    if (!page || typeof page !== 'string' || page.length > 200) {
      return res.status(400).json({ error: 'Page invalide' });
    }

    console.log("REQUEST BODY:");
    console.log(req.body);

    console.log("LATITUDE:", latitude);
    console.log("LONGITUDE:", longitude);
    console.log("SOURCE:", locationSource);
    const clientIP = req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
      '127.0.0.1';

    let cleanIP = clientIP.replace(/^::ffff:/, '');

    if (cleanIP === "::1" || cleanIP === "127.0.0.1") {

      const response = await axios.get(
        "https://api.ipify.org?format=json"
      );

      cleanIP = response.data.ip;
    }
    const ipLocation = await getLocationFromIP(cleanIP);

    let country;
    let city;

    if (latitude && longitude) {

      const gpsLocation = await getLocationFromCoordinates(
        latitude,
        longitude
      );

      country = gpsLocation.country;
      city = gpsLocation.city;

    } else {

      country = ipLocation.country;
      city = ipLocation.city;

    }

    console.log("IP LOCATION:", ipLocation);
    console.log("REAL CLIENT IP:", cleanIP);

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
    const servicePages = {
      "/services/hospitality": "Hospitality",
      "/healthcare": "Healthcare",
      "/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform": "Data Centers",
      "/services/retail": "Retail",
      "/services/industrial-offices": "Industrial & Offices",
      "/services/logistics": "Logistics",
      "/services/individuals": "Individuals"
    };

    if (visitorId && servicePages[page]) {

      const lead = await Lead.findOne({ visitorId });

      await LeadActivity.create({
        leadId: lead?._id || null,
        visitorId,

        country,
        city,

        latitude,
        longitude,
        locationSource,

        activityType: "SERVICE_VIEW",
        details: servicePages[page]
      });

      console.log(
        `🏢 Service viewed: ${servicePages[page]}`
      );

      if (lead) {

        await syncLeadToOdoo(visitorId);

        console.log(
          `🔄 Odoo synced for service page: ${servicePages[page]}`
        );
      }
    }

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
app.get('/api/spaces', verifyJWT, requireAdmin, getSpaces);
app.post('/api/spaces', verifyJWT, requireAdmin, createSpace);
app.get('/api/spaces/:id', verifyJWT, requireAdmin, getSpaceById);
app.put('/api/spaces/:id', verifyJWT, requireAdmin, updateSpace);
app.delete('/api/spaces/:id', verifyJWT, requireAdmin, deleteSpace);

// Route de test
app.get('/', (req, res) => {
  res.send('✅ Backend Analytics API is running!');
});

app.get("/test-ip", (req, res) => {

  res.json({
    ip: req.ip,
    forwarded: req.headers["x-forwarded-for"],
    remote: req.connection.remoteAddress
  });

});
// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on port :${PORT}`);
});

// Ping toutes les 5 minutes pour éviter le cold start Railway
if (process.env.NODE_ENV === 'production') {
  const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  setInterval(() => {
    fetch(`${BACKEND_URL}/`)
      .then(() => console.log('🏓 Keep-alive ping'))
      .catch(console.error);
  }, 5 * 60 * 1000);
}
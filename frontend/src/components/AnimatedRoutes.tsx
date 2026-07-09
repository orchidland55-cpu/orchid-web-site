import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PageTransition from "./PageTransition";
import ProtectedRoute from "./ProtectedRoute";

// ── Imports statiques (chargés immédiatement) ─────────────────────────────
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// ── Imports lazy (chargés uniquement à la navigation) ─────────────────────
const Blog = lazy(() => import("@/pages/blog"));
const About = lazy(() => import("@/pages/About"));
const Scr = lazy(() => import("@/pages/SCR"));
const Properties = lazy(() => import("@/pages/Properties"));
const Invest = lazy(() => import("@/pages/Invest"));
const Contact = lazy(() => import("@/pages/Contact"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const PropertyDetail = lazy(() => import("@/pages/PropertyDetail"));
const Postulation = lazy(() => import("@/pages/Postulation"));
const SetPassword = lazy(() => import("@/pages/SetPassword"));
const PrivacyPolicy = lazy(() => import("@/pages/Privacypolicy "));
const TermsAndConditions = lazy(() => import("@/pages/Termsandconditions"));
const LegalNotice = lazy(() => import("@/pages/Legalnotice"));

// ── Services ────────────────────────────────────────────────────────────
const Services = lazy(() => import("@/pages/services/Services"));
const DataCentersPage = lazy(() => import("@/pages/services/DataCentersPage"));
const HospitalityService = lazy(() => import("@/pages/services/Hospitalityservice"));
const HealthcareService = lazy(() => import("@/pages/services/Healthcareservice"));
const RetailService = lazy(() => import("@/pages/services/RetailService"));
const IndustrialOfficesService = lazy(() => import("@/pages/services/IndustrialOfficesService"));
const LogisticsService = lazy(() => import("@/pages/services/LogisticsService"));
const IndividualsService = lazy(() => import("@/pages/services/IndividualsService"));

// ── Spaces ──────────────────────────────────────────────────────────────
const SpaceAccess = lazy(() => import("@/pages/SpaceAccess"));
const SpaceView = lazy(() => import("@/pages/SpaceView"));
const SpaceManagerPage = lazy(() => import("@/pages/SpaceManagerPage"));

// ── Admin ───────────────────────────────────────────────────────────────
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminAddArticle = lazy(() => import("@/pages/AdminAddArticle"));
const AdminAddProperty = lazy(() => import("@/pages/AdminAddProperty"));
const AdminProperties = lazy(() => import("@/pages/AdminProperties"));
const AdminArticles = lazy(() => import("@/pages/AdminArticles"));
const AdminEditProperty = lazy(() => import("@/pages/AdminEditProperty"));
const AdminEditArticle = lazy(() => import("@/pages/AdminEditArticle"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminContacts = lazy(() => import("@/pages/AdminContacts"));

const AnimatedRoutes = () => {
  return (
    <Routes>
      {/* ── Publiques ── */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/contact-us/careers/" element={<PageTransition><Postulation /></PageTransition>} />
        <Route path="/real-estate-guide-orchid-island-marrakech" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/corporate-social-responsibility" element={<PageTransition><Scr /></PageTransition>} />
        <Route path="/about-us" element={<PageTransition><About /></PageTransition>} />
        <Route path="/properties" element={<PageTransition><Properties /></PageTransition>} />
        <Route path="/investment-orchidisland" element={<PageTransition><Invest /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/contact-us" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/:id" element={<PageTransition><ArticleDetail /></PageTransition>} />
        <Route path="/property/:id" element={<PageTransition><PropertyDetail /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms-and-conditions" element={<PageTransition><TermsAndConditions /></PageTransition>} />
        <Route path="/legal-notice" element={<PageTransition><LegalNotice /></PageTransition>} />
        <Route path="/set-password" element={<PageTransition><SetPassword /></PageTransition>} />

        {/* ── Services ── */}
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform" element={<PageTransition><DataCentersPage /></PageTransition>} />
        <Route path="/services/hospitality" element={<PageTransition><HospitalityService /></PageTransition>} />
        <Route path="/healthcare" element={<PageTransition><HealthcareService /></PageTransition>} />
        <Route path="/services/retail" element={<PageTransition><RetailService /></PageTransition>} />
        <Route path="/services/industrial-offices" element={<PageTransition><IndustrialOfficesService /></PageTransition>} />
        <Route path="/services/logistics" element={<PageTransition><LogisticsService /></PageTransition>} />
        <Route path="/services/individuals" element={<PageTransition><IndividualsService /></PageTransition>} />

        {/* ── Spaces ── */}
        <Route path="/space" element={<PageTransition><SpaceAccess /></PageTransition>} />
        <Route path="/space/:spaceId" element={<PageTransition><SpaceView /></PageTransition>} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminProperties /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/properties/add" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminAddProperty /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/properties/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminEditProperty /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/articles" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminArticles /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/articles/add" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminAddArticle /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/articles/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminEditArticle /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminAnalytics /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><PageTransition><AdminContacts /></PageTransition></ProtectedRoute>} />
        <Route path="/space-manager" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><SpaceManagerPage /></PageTransition></ProtectedRoute>} />

      {/* ── 404 ── */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
  );
};

export default AnimatedRoutes;
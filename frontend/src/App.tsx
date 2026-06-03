import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import WhatsAppButton from "./components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense } from "react";

// ── Imports statiques (chargés immédiatement) ─────────────────────────────────
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// ── Imports lazy (chargés uniquement à la navigation) ────────────────────────
const Blog             = lazy(() => import("./pages/blog"));
const About            = lazy(() => import("./pages/About"));
const Scr              = lazy(() => import("./pages/SCR"));
const Properties       = lazy(() => import("./pages/Properties"));
const Invest           = lazy(() => import("./pages/Invest"));
const Contact          = lazy(() => import("./pages/Contact"));
const ArticleDetail    = lazy(() => import("./pages/ArticleDetail"));
const PropertyDetail   = lazy(() => import("./pages/PropertyDetail"));
const Postulation      = lazy(() => import("@/pages/Postulation"));
const SetPassword      = lazy(() => import("./pages/SetPassword"));
const PrivacyPolicy    = lazy(() => import("./pages/Privacypolicy "));
const TermsAndConditions = lazy(() => import("./pages/Termsandconditions"));
const LegalNotice      = lazy(() => import("./pages/Legalnotice"));

// ── Services ──────────────────────────────────────────────────────────────────
const Services                 = lazy(() => import("./pages/services/Services"));
const DataCentersPage          = lazy(() => import("@/pages/services/DataCentersPage"));
const HospitalityService       = lazy(() => import("./pages/services/Hospitalityservice"));
const HealthcareService        = lazy(() => import("./pages/services/Healthcareservice"));
const RetailService            = lazy(() => import("./pages/services/RetailService"));
const IndustrialOfficesService = lazy(() => import("./pages/services/IndustrialOfficesService"));
const LogisticsService         = lazy(() => import("./pages/services/LogisticsService"));
const IndividualsService       = lazy(() => import("./pages/services/IndividualsService"));

// ── Spaces ────────────────────────────────────────────────────────────────────
const SpaceAccess      = lazy(() => import("./pages/SpaceAccess"));
const SpaceView        = lazy(() => import("./pages/SpaceView"));
const SpaceManagerPage = lazy(() => import("./pages/SpaceManagerPage"));

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminLogin          = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard      = lazy(() => import("./pages/AdminDashboard"));
const AdminAddArticle     = lazy(() => import("./pages/AdminAddArticle"));
const AdminAddProperty    = lazy(() => import("./pages/AdminAddProperty"));
const AdminProperties     = lazy(() => import("./pages/AdminProperties"));
const AdminArticles       = lazy(() => import("./pages/AdminArticles"));
const AdminEditProperty   = lazy(() => import("./pages/AdminEditProperty"));
const AdminEditArticle    = lazy(() => import("./pages/AdminEditArticle"));
const AdminAnalytics      = lazy(() => import("./pages/AdminAnalytics"));
const AdminContacts       = lazy(() => import("./pages/AdminContacts"));

// ── Fallback pendant le chargement ────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Analytics />
            <SpeedInsights />
            <AnalyticsTracker />

            <Suspense fallback={<PageLoader />}>
              <Routes>

                {/* ── Publiques ── */}
                <Route path="/" element={<Index />} />
                <Route path="/contact-us/careers/" element={<Postulation />} />
                <Route path="/real-estate-guide-orchid-island-marrakech" element={<Blog />} />
                <Route path="/corporate-social-responsibility" element={<Scr />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/investment-orchidisland" element={<Invest />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/:id" element={<ArticleDetail />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/legal-notice" element={<LegalNotice />} />
                <Route path="/set-password" element={<SetPassword />} />

                {/* ── Services ── */}
                <Route path="/services" element={<Services />} />
                <Route path="/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform" element={<DataCentersPage />} />
                <Route path="/services/hospitality" element={<HospitalityService />} />
                <Route path="/healthcare" element={<HealthcareService />} />
                <Route path="/services/retail" element={<RetailService />} />
                <Route path="/services/industrial-offices" element={<IndustrialOfficesService />} />
                <Route path="/services/logistics" element={<LogisticsService />} />
                <Route path="/services/individuals" element={<IndividualsService />} />

                {/* ── Spaces ── */}
                <Route path="/space" element={<SpaceAccess />} />
                <Route path="/space/:spaceId" element={<SpaceView />} />

                {/* ── Admin ── */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminProperties /></ProtectedRoute>} />
                <Route path="/admin/properties/add" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminAddProperty /></ProtectedRoute>} />
                <Route path="/admin/properties/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminEditProperty /></ProtectedRoute>} />
                <Route path="/admin/articles" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminArticles /></ProtectedRoute>} />
                <Route path="/admin/articles/add" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminAddArticle /></ProtectedRoute>} />
                <Route path="/admin/articles/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminEditArticle /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminAnalytics /></ProtectedRoute>} />
                <Route path="/admin/contacts" element={<ProtectedRoute allowedRoles={['admin', 'editor']}><AdminContacts /></ProtectedRoute>} />
                <Route path="/space-manager" element={<ProtectedRoute allowedRoles={['admin']}><SpaceManagerPage /></ProtectedRoute>} />

                {/* ── 404 ── */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </Suspense>

            <ChatbaseWidget />
            <WhatsAppButton />
            <Toaster />
            <Sonner />
            <ToastContainer />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
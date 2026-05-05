import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useGoogleTranslate } from "@/hooks/useGoogleTranslate";
import ScrollToTop from "./components/ScrollToTop";
import AnimatedRoutes from "./components/AnimatedRoutes";
import ToastContainer from "./components/ToastContainer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ AJOUTÉ

import Postulation from "@/pages/Postulation";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Scr from "./pages/SCR";
import Properties from "./pages/Properties";
import Invest from "./pages/Invest";
import Contact from "./pages/Contact";
import ArticleDetail from "./pages/ArticleDetail";
import PropertyDetail from "./pages/PropertyDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddArticle from "./pages/AdminAddArticle";
import AdminAddProperty from "./pages/AdminAddProperty";
import AdminProperties from "./pages/AdminProperties";
import AdminArticles from "./pages/AdminArticles";
import AdminEditProperty from "./pages/AdminEditProperty";
import AdminEditArticle from "./pages/AdminEditArticle";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminContacts from "./pages/AdminContacts";
import DataCentersPage from "@/pages/services/DataCentersPage";
import Services from "./pages/services/Services";
import HospitalityService from "./pages/services/Hospitalityservice";
import HealthcareService from "./pages/services/Healthcareservice";
import RetailService from "./pages/services/RetailService";
import IndustrialOfficesService from "./pages/services/IndustrialOfficesService";
import LogisticsService from "./pages/services/LogisticsService";
import IndividualsService from "./pages/services/IndividualsService";
import PrivacyPolicy from "./pages/Privacypolicy ";
import TermsAndConditions from "./pages/Termsandconditions";
import LegalNotice from "./pages/Legalnotice";
import SetPassword from "./pages/SetPassword";

import Chatbot from "./components/Chatbot";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

function App() {
  useGoogleTranslate(); // Initialisation de Google Translate
  return (
    <div className="overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <ScrollToTop />
            <AnalyticsTracker />
            <Routes>

              {/* ===== Routes publiques — inchangées ===== */}
              <Route path="/" element={<Index />} />
              <Route path="/postulation" element={<Postulation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/Scr" element={<Scr />} />
              <Route path="/about" element={<About />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/invest" element={<Invest />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog/:id" element={<ArticleDetail />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/services/data-centers" element={<DataCentersPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/hospitality" element={<HospitalityService />} />
              <Route path="/services/healthcare" element={<HealthcareService />} />
              <Route path="/services/retail" element={<RetailService />} />
              <Route path="/services/industrial-offices" element={<IndustrialOfficesService />} />
              <Route path="/services/logistics" element={<LogisticsService />} />
              <Route path="/services/individuals" element={<IndividualsService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/set-password" element={<SetPassword />} />
              
              {/* ===== Page de login — publique ===== */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* ===== Routes admin — protégées par JWT ===== */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/properties" element={
                <ProtectedRoute><AdminProperties /></ProtectedRoute>
              } />
              <Route path="/admin/properties/add" element={
                <ProtectedRoute><AdminAddProperty /></ProtectedRoute>
              } />
              <Route path="/admin/properties/edit/:id" element={
                <ProtectedRoute><AdminEditProperty /></ProtectedRoute>
              } />
              <Route path="/admin/articles" element={
                <ProtectedRoute><AdminArticles /></ProtectedRoute>
              } />
              <Route path="/admin/articles/add" element={
                <ProtectedRoute><AdminAddArticle /></ProtectedRoute>
              } />
              <Route path="/admin/articles/edit/:id" element={
                <ProtectedRoute><AdminEditArticle /></ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute><AdminAnalytics /></ProtectedRoute>
              } />
              <Route path="/admin/contacts" element={
                <ProtectedRoute><AdminContacts /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>

            {/* Chatbot et WhatsApp visibles sur toutes les pages */}
            <Chatbot />
            <WhatsAppButton />

            {/* Toasters et notifications */}
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
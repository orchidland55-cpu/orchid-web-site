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
import Blog from "./pages/blog";
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
import ChatbaseWidget from "@/components/ChatbaseWidget";
import { Analytics } from "@vercel/analytics/react";

import SpaceAccess from "./pages/SpaceAccess";
import SpaceView from "./pages/SpaceView";
import SpaceManagerPage from "./pages/SpaceManagerPage";

// import Chatbot from "./components/Chatbot";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

function App() {
  useGoogleTranslate(); // Initialisation de Google Translate
  return (
    <div className="overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router future={{ 
              v7_startTransition: true,
              v7_relativeSplatPath: true }
            }>
            <ScrollToTop />
            <Analytics/>
            <AnalyticsTracker />
            <Routes >

              {/* ===== Routes publiques ===== */}
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
              <Route path="/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform" element={<DataCentersPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/hospitality" element={<HospitalityService />} />
              <Route path="/healthcare" element={<HealthcareService />} />
              <Route path="/services/retail" element={<RetailService />} />
              <Route path="/services/industrial-offices" element={<IndustrialOfficesService />} />
              <Route path="/services/logistics" element={<LogisticsService />} />
              <Route path="/services/individuals" element={<IndividualsService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/set-password" element={<SetPassword />} />

              
              <Route path="/space" element={<SpaceAccess />} />
              <Route path="/space/:spaceId"  element={<SpaceView />} />

              {/* ===== Page de login — publique ===== */}
              <Route path="/admin" element={<AdminLogin />} />
              

              {/* ===== DASHBOARD - Accessible aux admins ET éditeurs ===== */}
               <Route 
                path="/admin/dashboard" 
                element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <AdminDashboard />
                </ProtectedRoute>
                } 
              />
              {/* ===== PROPRIÉTÉS - Accessible aux admins ET éditeurs ===== */}
              <Route 
                path="/admin/properties" 
                element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <AdminProperties />
                </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties/add" 
                element={
                 <ProtectedRoute allowedRoles={['admin', 'editor']}>
                   <AdminAddProperty />
                  </ProtectedRoute>
               } 
              />
              <Route 
                path="/admin/properties/edit/:id" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                    <AdminEditProperty />
                  </ProtectedRoute>
                } 
              />
              {/* ===== ARTICLES - Accessible aux admins ET éditeurs ===== */}
              <Route 
               path="/admin/articles" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                    <AdminArticles />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/articles/add" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                   <AdminAddArticle />
                 </ProtectedRoute>
                } 
              />
              <Route 
               path="/admin/articles/edit/:id" 
               element={
                 <ProtectedRoute allowedRoles={['admin', 'editor']}>
                   <AdminEditArticle />
                 </ProtectedRoute>
                } 
              />
               {/* ===== ANALYTICS - Accessible aux admins ET éditeurs ===== */}
              <Route 
                path="/admin/analytics" 
                element={
                 <ProtectedRoute allowedRoles={['admin', 'editor']}>
                   <AdminAnalytics />
                  </ProtectedRoute>
                } 
              />
 
              {/* ===== CONTACTS - UNIQUEMENT ADMIN ===== */}
              <Route 
                path="/admin/contacts" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                    <AdminContacts />
                  </ProtectedRoute>
                } 
              />
              {/* ===== GESTION ESPACES - UNIQUEMENT ADMIN ===== */}
              <Route 
                path="/space-manager" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SpaceManagerPage />
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>

            {/* Chatbot et WhatsApp visibles sur toutes les pages */}
            {/* <Chatbot /> */}
            
            <ChatbaseWidget />
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
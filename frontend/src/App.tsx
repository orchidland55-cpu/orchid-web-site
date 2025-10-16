import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import AnimatedRoutes from "./components/AnimatedRoutes";
import ToastContainer from "./components/ToastContainer";
import AnalyticsTracker from "./components/AnalyticsTracker";

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

import Chatbot from "./components/Chatbot";           // 💬 Chatbot
import WhatsAppButton from "./components/WhatsAppButton"; // ✅ bouton WhatsApp séparé

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
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


            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/articles/add" element={<AdminAddArticle />} />
            <Route path="/admin/properties/add" element={<AdminAddProperty />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/properties/edit/:id" element={<AdminEditProperty />} />
            <Route path="/admin/articles/edit/:id" element={<AdminEditArticle />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* 💬 Chatbot et WhatsApp visibles sur toutes les pages */}
          <Chatbot />
          <WhatsAppButton />

          {/* Toasters et notifications */}
          <Toaster />
          <Sonner />
          <ToastContainer />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

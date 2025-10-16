import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Index from "../pages/Index";
import About from "../pages/About";
import PropertiesPage from "../pages/Properties";
import PropertyDetail from "../pages/PropertyDetail";
import Invest from "../pages/Invest";
import Blog from "../pages/Blog";
import ArticleDetail from "../pages/ArticleDetail";
import Contact from "../pages/Contact";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminArticles from "../pages/AdminArticles";
import AdminProperties from "../pages/AdminProperties";
import AdminAddArticle from "../pages/AdminAddArticle";
import AdminAddProperty from "../pages/AdminAddProperty";
import AdminEditArticle from "../pages/AdminEditArticle";
import AdminEditProperty from "../pages/AdminEditProperty";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminContacts from "../pages/AdminContacts";
import NotFound from "../pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/properties"
          element={
            <PageTransition>
              <PropertiesPage />
            </PageTransition>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <PageTransition>
              <PropertyDetail />
            </PageTransition>
          }
        />
        <Route
          path="/invest"
          element={
            <PageTransition>
              <Invest />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <Blog />
            </PageTransition>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <PageTransition>
              <ArticleDetail />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <PageTransition>
              <AdminArticles />
            </PageTransition>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <PageTransition>
              <AdminProperties />
            </PageTransition>
          }
        />
        <Route
          path="/admin/articles/add"
          element={
            <PageTransition>
              <AdminAddArticle />
            </PageTransition>
          }
        />
        <Route
          path="/admin/properties/add"
          element={
            <PageTransition>
              <AdminAddProperty />
            </PageTransition>
          }
        />
        <Route
          path="/admin/articles/edit/:id"
          element={
            <PageTransition>
              <AdminEditArticle />
            </PageTransition>
          }
        />
        <Route
          path="/admin/properties/edit/:id"
          element={
            <PageTransition>
              <AdminEditProperty />
            </PageTransition>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <PageTransition>
              <AdminAnalytics />
            </PageTransition>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <PageTransition>
              <AdminContacts />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

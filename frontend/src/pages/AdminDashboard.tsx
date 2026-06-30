import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import orchidLogo from "@/assets/logopng.png";
import {
  BarChart3,
  Shield,
  Building,
  FileText,
  TrendingUp,
  Eye,
  MessageCircle,
  Plus,
  Settings,
  LogOut,
  Home,
  Calendar,
  Globe,
  AlertCircle,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  ScanSearch,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { showToast } from "@/components/ToastContainer";
import { apiService, Activity } from "@/services/api";
import UserManagementModal from "@/components/UserManagementModal";
import { useUserRole } from "@/hooks/useUserRole";

// ─── Lazy imports des pages internes ────────────────────────────────────────
// On charge les pages existantes à la demande.
// Elles s'affichent dans la zone de contenu du shell sans navigation externe.
const AdminProperties     = lazy(() => import("@/pages/AdminProperties"));
const AdminAddProperty    = lazy(() => import("@/pages/AdminAddProperty"));
const AdminArticles       = lazy(() => import("@/pages/AdminArticles"));
const AdminAddArticle     = lazy(() => import("@/pages/AdminAddArticle"));
const AdminAnalytics     = lazy(() => import("@/pages/AdminAnalytics"));
const AdminContacts       = lazy(() => import("@/pages/AdminContacts"));
const SpaceManagerPage   = lazy(() => import("@/pages/SpaceManagerPage"));
const AdminEditProperty = lazy(() => import("@/pages/AdminEditProperty"));
const AdminEditArticle = lazy(() => import("@/pages/AdminEditArticle"));

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewKey =
  | "dashboard"
  | "analytics"
  | "properties"
  | "properties-add"
  | "properties-edit"
  | "articles-edit"
  | "articles"
  | "articles-add"
  | "contacts"
  | "space-manager"
  | "due-diligence"
  | "price-prediction"
  | "reverse-engineering";

// ─── Fallback spinner ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
  </div>
);

// ─── NavItem ─────────────────────────────────────────────────────────────────
type NavItemProps = {
  icon: React.ElementType;
  label: string;
  viewKey: ViewKey;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

const NavItem = ({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: NavItemProps) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
      transition-colors duration-150 text-left
      ${collapsed ? "justify-center px-2" : ""}
      ${
        active
          ? "bg-background text-foreground font-medium border-l-2 border-[#D4AF37] pl-[10px]"
          : "text-muted-foreground hover:bg-background hover:text-foreground"
      }
      ${collapsed && active ? "border-l-2 border-[#D4AF37] pl-[6px]" : ""}
    `}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    {!collapsed && <span>{label}</span>}
  </button>
);

// ─── IframeView ────────────────────────────────────────────────────────────── tous les trois liens sont a changer par les vrais
const EXTERNAL_APPS: Record<string, { url: string; label: string }> = {
  "due-diligence":       { url: "https://placeholder-due-diligence.vercel.app",      label: "Due Diligence" },
  "price-prediction":  { url: "https://price-prediction-hmqrl6gzgyqxbm9nktg4at.streamlit.app/", label: "Price Prediction" },
  "reverse-engineering": { url: "https://placeholder-reverse-engineering.vercel.app", label: "Reverse Engineering" },
};

const IframeView = ({ viewKey }: { viewKey: ViewKey }) => {
  const app = EXTERNAL_APPS[viewKey];
  if (!app) return null;
  return (
    <div className="flex flex-col h-full -mx-4 sm:-mx-6 -my-6">
      <iframe
        src={app.url}
        title={app.label}
        className="flex-1 w-full border-0"
        style={{ height: "calc(100vh - 3.5rem)" }}
        allow="fullscreen"
      />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isEditor, role, email } = useUserRole();

  // ── State ─────────────────────────────────────────────────────────────────
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities]  = useState<Activity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [userModalOpen, setUserModalOpen]        = useState(false);
  const [yearlyViewsData, setYearlyViewsData]    = useState<any[]>([]);
  const [countryViewsData, setCountryViewsData]  = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading]  = useState(true);
  const [currentPage, setCurrentPage]            = useState(1);
  const itemsPerPage = 2;

  // Layout state
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [activeView, setActiveView]     = useState<ViewKey>("dashboard");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Titre dynamique selon la vue active
  const viewTitles: Record<ViewKey, string> = {
    dashboard:       "Dashboard",
    analytics:       "Analytics",
    properties:      "Properties",
    "properties-add": "Add Property",
    articles:        "Articles",
    "articles-add":  "New Article",
    contacts:        "Contact Requests",
    "space-manager": "Data Room",
    "properties-edit": "Edit Property",
    "articles-edit": "Edit Article",
    "due-diligence":       "Due Diligence",
    "price-prediction":  "Price Prediction",
    "reverse-engineering": "Reverse Engineering",
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTimeAgo = (dateString: string): string => {
    const date    = new Date(dateString);
    const now     = new Date();
    const diffMs  = now.getTime() - date.getTime();
    const diffH   = Math.floor(diffMs / 3_600_000);
    const diffD   = Math.floor(diffH / 24);
    if (diffD > 0) return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
    if (diffH > 0) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const formatNumber = (num: number) =>
    num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();


  const goTo = (view: ViewKey, id?: string) => {
    setActiveView(view);
    setActiveId(id || null);
    setMobileOpen(false);
    document.getElementById("admin-content")?.scrollTo({ top: 0 });
  };

  // ── Data loading ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadDashboardStats();
    loadRecentActivities();
    loadAnalyticsData();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const result = await apiService.getDashboardStats();
      setDashboardStats(result.data);
    } catch (error) {
      console.error("❌ Connection error:", error);
      showToast({ type: "error", title: "Connection Error", message: "Unable to load statistics from server" });
    } finally {
    }
  };

  const loadRecentActivities = async () => {
    setIsActivitiesLoading(true);
    setCurrentPage(1);
    try {
      const result = await apiService.getRecentActivities();
      const formatted = (result.data || []).map((a: Activity) => ({
        ...a,
        time: a.createdAt ? formatTimeAgo(a.createdAt) : "Recently",
      }));
      setRecentActivities(formatted);
    } catch (error) {
      console.error("❌ Error loading activities:", error);
      setRecentActivities([{
        action: "Loading error",
        item: "Unable to retrieve activities",
        createdAt: new Date().toISOString(),
        type: "error",
      } as Activity]);
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const [yearlyData, countriesData] = await Promise.all([
        apiService.getYearlyViews(),
        apiService.getCountryViews(),
      ]);
      setYearlyViewsData(yearlyData);
      setCountryViewsData(countriesData);
    } catch (error) {
      console.error("❌ Error loading analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      apiService.logout();
      showToast({
        type: "success",
        title: "Logout Successful",
        message: "You have been successfully logged out. See you soon!",
        duration: 3000,
      });
      setTimeout(() => navigate("/admin"), 500);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const getStatsFromBackend = () => {
    if (!dashboardStats) {
      return [
        { title: "Total Properties",  value: "...", change: "Loading...", icon: Building,      color: "text-blue-600",   bgColor: "bg-blue-50"   },
        { title: "Blog Articles",     value: "...", change: "Loading...", icon: FileText,       color: "text-green-600",  bgColor: "bg-green-50"  },
        { title: "Total Views",       value: "...", change: "Loading...", icon: Eye,            color: "text-purple-600", bgColor: "bg-purple-50" },
        { title: "Contact Requests",  value: "...", change: "Loading...", icon: MessageCircle,  color: "text-orange-600", bgColor: "bg-orange-50" },
      ];
    }
    return [
      { title: "Total Properties",  value: dashboardStats.properties?.total?.toString()           || "0", change: dashboardStats.properties?.growthText  || "+0 this month",  icon: Building,      color: "text-blue-600",   bgColor: "bg-blue-50"   },
      { title: "Blog Articles",     value: dashboardStats.articles?.total?.toString()             || "0", change: dashboardStats.articles?.growthText     || "+0 this week",   icon: FileText,       color: "text-green-600",  bgColor: "bg-green-50"  },
      { title: "Total Views",       value: formatNumber(dashboardStats.views?.total              || 0),  change: dashboardStats.views?.growthText         || "+0% this month", icon: Eye,            color: "text-purple-600", bgColor: "bg-purple-50" },
      { title: "Contact Requests",  value: dashboardStats.contacts?.total?.toString()            || "0", change: dashboardStats.contacts?.growthText      || "+0 today",       icon: MessageCircle,  color: "text-orange-600", bgColor: "bg-orange-50" },
    ];
  };

  const stats = getStatsFromBackend();

  // ── Quick actions ─────────────────────────────────────────────────────────
  const quickActions = [
    { title: "Add Property",      description: "Create a new property",       icon: Building,  view: "properties-add" as ViewKey, allowedRoles: ["admin","editor"] },
    { title: "New Article",       description: "Write a blog article",         icon: FileText,  view: "articles-add"   as ViewKey, allowedRoles: ["admin","editor"] },
    { title: "View Properties",   description: "Manage existing properties",   icon: Eye,       view: "properties"     as ViewKey, allowedRoles: ["admin","editor"] },
    { title: "Manage Articles",   description: "Edit blog articles",           icon: Settings,  view: "articles"       as ViewKey, allowedRoles: ["admin","editor"] },
  ].filter((a) => a.allowedRoles.includes(role || ""));

  // ── Stat card config ──────────────────────────────────────────────────────
  const getCardConfig = (title: string) => {
    switch (title) {
      case "Total Views":       return { isClickable: true,    view: "analytics"  as ViewKey, clickText: "Click for details →",   ariaLabel: "View detailed view statistics"  };
      case "Total Properties":  return { isClickable: true,    view: "properties" as ViewKey, clickText: "Manage properties →",   ariaLabel: "Manage real estate properties"  };
      case "Blog Articles":     return { isClickable: true,    view: "articles"   as ViewKey, clickText: "Manage articles →",     ariaLabel: "Manage blog articles"           };
      case "Contact Requests":  return { isClickable: isAdmin, view: "contacts"   as ViewKey, clickText: isAdmin ? "View requests →" : "", ariaLabel: "View contact requests" };
      default:                  return { isClickable: false,   view: "dashboard"  as ViewKey, clickText: "",                      ariaLabel: ""                               };
    }
  };

  // ── Sidebar inner ─────────────────────────────────────────────────────────
  const SidebarInner = () => (
    <div className="flex flex-col h-full">

      {/* Logo + collapse button */}
      <div className={`
        flex items-center border-b border-border shrink-0
        ${collapsed ? "justify-center px-2 py-4" : "gap-2 px-3 py-4"}
      `}>
        {!collapsed && (
          <>
            <img src={orchidLogo} alt="Orchid Island" className="h-8 w-auto" />
            <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs shrink-0">
              {isAdmin ? "👑 Admin" : "✏️ Éditeur"}
            </Badge>
          </>
        )}
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`
            hidden lg:flex items-center justify-center w-6 h-6 rounded-md
            text-muted-foreground hover:text-foreground hover:bg-muted
            transition-colors shrink-0
            ${collapsed ? "" : "ml-auto"}
          `}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav scrollable */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-5 px-2 scrollbar-thin">

        {/* Overview */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Overview
            </p>
          )}
          <div className="space-y-0.5">
            <NavItem icon={LayoutDashboard} label="Dashboard"  viewKey="dashboard" active={activeView === "dashboard"}  collapsed={collapsed} onClick={() => goTo("dashboard")}  />
            <NavItem icon={BarChart3}       label="Analytics"  viewKey="analytics" active={activeView === "analytics"}  collapsed={collapsed} onClick={() => goTo("analytics")}  />
          </div>
        </div>

        {/* Content */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Content
            </p>
          )}
          <div className="space-y-0.5">
            <NavItem icon={Building}      label="Properties"       viewKey="properties" active={activeView === "properties" || activeView === "properties-add" || activeView === "properties-edit"} collapsed={collapsed} onClick={() => goTo("properties")} />
            <NavItem icon={FileText}      label="Articles"         viewKey="articles"   active={activeView === "articles"   || activeView === "articles-add"   || activeView === "articles-edit"}   collapsed={collapsed} onClick={() => goTo("articles")}   />
            {/* Contacts — cliquable seulement si admin (logique inchangée) */}
            {isAdmin ? (
              <NavItem icon={MessageCircle} label="Contact Requests" viewKey="contacts" active={activeView === "contacts"} collapsed={collapsed} onClick={() => goTo("contacts")} />
            ) : (
              <div
                title={collapsed ? "Contact Requests (Admin only)" : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  text-muted-foreground/40 cursor-not-allowed select-none
                  ${collapsed ? "justify-center px-2" : ""}
                `}
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Contact Requests</span>}
              </div>
            )}
          </div>
        </div>

        {/* Admin only */}
        {isAdmin && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Admin only
              </p>
            )}
            <div className="space-y-0.5">
              <button
                onClick={() => { setMobileOpen(false); setUserModalOpen(true); }}
                title={collapsed ? "Manage Users" : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  text-muted-foreground hover:bg-background hover:text-foreground
                  transition-colors duration-150
                  ${collapsed ? "justify-center px-2" : ""}
                `}
              >
                <Shield className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Manage Users</span>}
              </button>
              <NavItem icon={Home} label="Data Room" viewKey="space-manager" active={activeView === "space-manager"} collapsed={collapsed} onClick={() => goTo("space-manager")} />
              <NavItem icon={ClipboardCheck} label="Due Diligence"      viewKey="due-diligence"       active={activeView === "due-diligence"}       collapsed={collapsed} onClick={() => goTo("due-diligence")}       />
              <NavItem icon={GraduationCap}  label="Price Prediction" viewKey="price-prediction"  active={activeView === "price-prediction"}  collapsed={collapsed} onClick={() => goTo("price-prediction")}  />
              <NavItem icon={ScanSearch}     label="Reverse Engineering" viewKey="reverse-engineering" active={activeView === "reverse-engineering"} collapsed={collapsed} onClick={() => goTo("reverse-engineering")} />
            </div>
          </div>
        )}

        {/* Site */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Site
            </p>
          )}
          <div className="space-y-0.5">
            <button
              onClick={() => window.open("/", "_blank")}
              title={collapsed ? "View Site" : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                text-muted-foreground hover:bg-background hover:text-foreground
                transition-colors duration-150
                ${collapsed ? "justify-center px-2" : ""}
              `}
            >
              <Globe className="w-4 h-4 shrink-0" />
              {!collapsed && <span>View Site</span>}
            </button>
          </div>
        </div>

      </nav>

      {/* Footer user + logout */}
      <div className="border-t border-border px-2 py-3 shrink-0">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <div
            className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-xs font-semibold shrink-0"
            title={collapsed ? (email || "admin") : undefined}
          >
            {email ? email[0].toUpperCase() : "A"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{email || "admin"}</p>
              <p className="text-[10px] text-muted-foreground">
                {isAdmin ? "Administrateur" : "Éditeur"}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // ── Dashboard home view ───────────────────────────────────────────────────
  const DashboardHome = () => (
    <div className="space-y-6">

      {/* Bandeau éditeur — inchangé */}
      {isEditor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Mode Éditeur</h3>
            <p className="text-sm text-blue-700">
              Vous pouvez créer et modifier des propriétés et des articles.
              Seuls les administrateurs peuvent supprimer du contenu et gérer les utilisateurs.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards — logique inchangée */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const config = getCardConfig(stat.title);
          const cardInner = (
            <Card className={`transition-all duration-300 ${config.isClickable ? "hover:shadow-luxury cursor-pointer hover:scale-[1.02]" : "hover:shadow-luxury"}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-0.5">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-0.5">{stat.change}</p>
                  </div>
                  <div className={`w-11 h-11 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                {config.clickText && (
                  <div className="mt-2 text-xs text-primary font-medium">{config.clickText}</div>
                )}
              </CardContent>
            </Card>
          );
          if (config.isClickable) {
            return (
              <button
                key={index}
                onClick={() => goTo(config.view)}
                aria-label={config.ariaLabel}
                className="block text-left w-full"
              >
                {cardInner}
              </button>
            );
          }
          return <div key={index}>{cardInner}</div>;
        })}
      </div>

      {/* Quick Actions + Recent Activities */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="w-4 h-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(action.view)}
                    className="text-left"
                  >
                    <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 luxury-gradient rounded-lg flex items-center justify-center shrink-0">
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities — inchangé */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isActivitiesLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading activities...</p>
              ) : recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activities.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {recentActivities
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/50">
                          <div className="w-2 h-2 rounded-full mt-2 bg-yellow-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                            <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-primary">{activity.performedBy || "admin"}</span>
                              {" "}•{" "}{formatTimeAgo(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {recentActivities.length > itemsPerPage && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Page {currentPage} / {Math.ceil(recentActivities.length / itemsPerPage)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >← Prev</button>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(Math.ceil(recentActivities.length / itemsPerPage), p + 1))}
                          disabled={currentPage === Math.ceil(recentActivities.length / itemsPerPage)}
                          className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >Next →</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
          <Button variant="outline" size="sm" onClick={() => goTo("analytics")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Full Analytics
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Yearly Views — inchangé */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4" />
                Yearly Views Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" />
                </div>
              ) : yearlyViewsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={yearlyViewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (!payload || !payload[0]) return null;
                        const value = payload[0].value as number;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3">
                            <p className="font-semibold text-gray-800">Year {label}</p>
                            <p className="text-sm text-gray-600">Views: {value?.toLocaleString()}</p>
                          </div>
                        );
                      }}
                    />
                    <Line type="monotone" dataKey="vues" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-10">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Country Views — inchangé */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-4 h-4" />
                Views by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" />
                </div>
              ) : countryViewsData.length > 0 ? (
                <div className="space-y-4">
                  {countryViewsData.slice(0, 5).map((country, index) => (
                    <div key={country.pays} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: ["#D4AF37","#4F46E5","#EF4444","#10B981","#F59E0B"][index] }}
                        />
                        <span className="font-medium text-sm">{country.pays}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{country.vues?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{country.pourcentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // ── Render de la vue active ────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardHome />;
      case "analytics":
        return (
          <Suspense fallback={<PageLoader />}>
            <AdminAnalytics />
          </Suspense>
        );
      case "properties":
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminProperties
        onNavigate={(id: string) => goTo("properties-edit", id)}
      />
    </Suspense>
  );
      case "properties-add":
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminAddProperty />
    </Suspense>
  );
      case "articles":
        return (
          <Suspense fallback={<PageLoader />}>
            <AdminArticles
              onNavigate={(id: string) => goTo("articles-edit", id)}
            />
          </Suspense>
        );
      case "articles-add":
        return (
          <Suspense fallback={<PageLoader />}>
            <AdminAddArticle />
          </Suspense>
        );
      case "contacts":
        return isAdmin ? (
          <Suspense fallback={<PageLoader />}>
            <AdminContacts />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-sm">Accès réservé aux administrateurs.</p>
          </div>
        );
      case "space-manager":
        return isAdmin ? (
          <Suspense fallback={<PageLoader />}>
            <SpaceManagerPage />
          </Suspense>
        ) : null;
      case "properties-edit":
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminEditProperty
        id={activeId}
        onDone={() => goTo("properties")}
      />
    </Suspense>
  );
  case "articles-edit":
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminEditArticle
        id={activeId}
        onDone={() => goTo("articles")}
      />
    </Suspense>
  );
  case "due-diligence":
  case "price-prediction":
  case "reverse-engineering":
    return <IframeView viewKey={activeView} />;
      default:
        return <DashboardHome />;
    }
  };

  // ── Actions topbar contextuelles ──────────────────────────────────────────
  const TopbarActions = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => goTo("properties-add")}>
              <Building className="w-4 h-4 mr-1.5" />
              Add property
            </Button>
            <Button size="sm" className="bg-[#D4AF37] hover:bg-[#c9a22a] text-white border-0" onClick={() => goTo("articles-add")}>
              <Plus className="w-4 h-4 mr-1.5" />
              New article
            </Button>
          </>
        );
      case "properties":
        return (
          <Button size="sm" className="bg-[#D4AF37] hover:bg-[#c9a22a] text-white border-0" onClick={() => goTo("properties-add")}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add property
          </Button>
        );
      case "articles":
        return (
          <Button size="sm" className="bg-[#D4AF37] hover:bg-[#c9a22a] text-white border-0" onClick={() => goTo("articles-add")}>
            <Plus className="w-4 h-4 mr-1.5" />
            New article
          </Button>
        );
      case "properties-add":
      case "properties-edit":
        return (
          <Button variant="outline" size="sm" onClick={() => goTo("properties")}>
            ← Back
          </Button>
        );
      case "articles-edit":
      case "articles-add":
        return (
          <Button variant="outline" size="sm" onClick={() => goTo("articles")}>
            ← Back
          </Button>
        );
      default:
        return null;
    }
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    // Root : hauteur écran fixe, pas de scroll global
    <div className="h-screen overflow-hidden bg-background flex">

      {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col shrink-0 border-r border-border bg-muted/30
          h-screen
          transition-all duration-200 ease-in-out
          ${collapsed ? "w-14" : "w-56"}
        `}
      >
        <SidebarInner />
      </aside>

      {/* ── Sidebar mobile (drawer overlay) ─────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-background border-r border-border h-full shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarInner />
          </aside>
        </div>
      )}

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">

        {/* Topbar fixe */}
        <header className="shrink-0 bg-background border-b border-border z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              {/* Burger mobile */}
              <button
                className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-foreground leading-tight">
                  {viewTitles[activeView]}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TopbarActions />
            </div>
          </div>
        </header>

        {/* Zone de contenu — seule partie scrollable */}
        <main
          id="admin-content"
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        >
          {renderContent()}
        </main>
      </div>

      {/* ✅ UserManagementModal — inchangé, conditionnel admin */}
      {isAdmin && (
        <UserManagementModal open={userModalOpen} onOpenChange={setUserModalOpen} />
      )}
    </div>
  );
};

export default AdminDashboard;

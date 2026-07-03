import { HelmetProvider } from "react-helmet-async";
import GlobalSchema from "./components/GlobalSchema";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { lazy, Suspense, useEffect, useState } from "react";
import { startKeepAlive } from "@/utils/keepAlive";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

// ✅ Widgets en lazy loading
const ChatbaseWidget = lazy(() => import("@/components/ChatbaseWidget"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

// ── Fallback pendant le chargement ────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// ✅ QueryClient optimisé
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  startKeepAlive();
  useGoogleTranslate();

  const [languageKey, setLanguageKey] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(prev => prev + 1);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    let visitorId = localStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId =
        "visitor_" +
        Math.random().toString(36).substring(2) +
        Date.now();

      localStorage.setItem("visitorId", visitorId);
      console.log("Visitor ID created:", visitorId);
    }

    const locationStored = localStorage.getItem("visitorLocation");

    if (locationStored) {
      const location = JSON.parse(locationStored);

      if (location.locationSource === "gps") {
        return;
      }

      // Si refusé précédemment, on retente.
      localStorage.removeItem("visitorLocation");
    }

    console.log("Requesting GPS permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationSource: "gps",
        };

        localStorage.setItem("visitorLocation", JSON.stringify(locationData));
        console.log("GPS location saved:", locationData);
      },
      (error) => {
        console.log("Location denied:", error.message);
        console.log("Location error:", error);

        localStorage.setItem(
          "visitorLocation",
          JSON.stringify({
            latitude: null,
            longitude: null,
            locationSource: "denied",
          })
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // ✅ Hook pour charger les widgets après 3 secondes
  const useWidgets = () => {
    const location = useLocation();
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    const isAdmin = location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/space-manager") ||
      location.pathname.startsWith("/editor");

    return { shouldLoad, isAdmin };
  };

  const trackPageView = async (path: string) => {
    try {
      const ReactGA = (await import('react-ga4')).default;
      ReactGA.send({ hitType: 'pageview', page: path });
    } catch (error) {
      // Ignorer les erreurs
    }
  };

  const PublicWidgets = () => {
    const location = useLocation();
    const { shouldLoad, isAdmin } = useWidgets();

    useEffect(() => {
      trackPageView(location.pathname + location.search);
    }, [location]);

    if (isAdmin) return null;
    if (!shouldLoad) return null;

    return (
      <Suspense fallback={null}>
        <ChatbaseWidget />
        <WhatsAppButton />
      </Suspense>
    );
  };

  return (
    <div key={languageKey}>
      <HelmetProvider>
        <div className="overflow-x-clip">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <GlobalSchema />
                <ScrollToTop />
                <Analytics />
                <SpeedInsights />
                <AnalyticsTracker />

                <Suspense fallback={<PageLoader />}>
                  <AnimatedRoutes />
                </Suspense>

                <PublicWidgets />
                <Toaster />
                <Sonner />
                <ToastContainer />
              </Router>
            </TooltipProvider>
          </QueryClientProvider>
        </div>
      </HelmetProvider>
    </div>
  );
}

export default App;
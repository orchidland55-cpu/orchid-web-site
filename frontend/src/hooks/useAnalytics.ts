import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '@/services/api';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la vue de page lors du changement de route
    const trackPageView = async () => {
      try {
        await apiService.trackPageView(location.pathname);
      } catch (error) {
        console.error('Erreur tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);

  // Fonction pour tracker des événements personnalisés
  const trackEvent = async (eventName: string, data?: any) => {
    try {
      // Pour l'instant, on utilise la même route de tracking de page
      // Mais on peut étendre cela plus tard pour des événements spécifiques
      await apiService.trackPageView(`${location.pathname}?event=${eventName}`);
    } catch (error) {
      console.error('Erreur tracking event:', error);
    }
  };

  return { trackEvent };
};
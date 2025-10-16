import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsTracker = () => {
  // Le hook useAnalytics track automatiquement les changements de page
  useAnalytics();

  return null; // Ce composant ne rend rien visuellement
};

export default AnalyticsTracker;
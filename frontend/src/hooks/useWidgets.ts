// src/hooks/useWidgets.ts
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useWidgets = () => {
  const location = useLocation();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Charger les widgets après 3 secondes
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
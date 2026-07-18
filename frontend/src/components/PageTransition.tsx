import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// ✅ Flag au niveau du module : survit aux remounts de composant (navigation SPA),
// mais se réinitialise à un vrai rechargement de page (F5 / première visite).
// → Le tout premier rendu de page ne subit jamais le fade-in (protège le LCP),
//   mais les navigations internes suivantes gardent la transition.
let hasAppRenderedOnce = false;

const PageTransition = ({ children }: PageTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Premier rendu de toute la session : pas de fade-in, affichage immédiat
    if (!hasAppRenderedOnce) {
      hasAppRenderedOnce = true;
      el.style.opacity = "1";
      return;
    }

    // Navigations suivantes : fade-in normal
    el.style.opacity = "0";
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.35s ease";
        el.style.opacity = "1";
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="w-full" style={{ willChange: "opacity" }}>
      {children}
    </div>
  );
};

export default PageTransition;
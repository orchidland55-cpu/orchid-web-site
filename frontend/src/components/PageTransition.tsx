import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// ✅ CSS pur — supprime framer-motion du bundle principal (~140 Kio)
const PageTransition = ({ children }: PageTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Force un reflow puis déclenche l'animation
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="w-full" style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
};

export default PageTransition;
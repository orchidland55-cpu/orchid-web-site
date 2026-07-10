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
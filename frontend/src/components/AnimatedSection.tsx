import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Variant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: Variant;
  threshold?: number;
  className?: string;
}

const hiddenStyles: Record<Variant, string> = {
  "fade-up":    "opacity-0 translate-y-16",
  "fade-down":  "opacity-0 -translate-y-16",
  "fade-left":  "opacity-0 translate-x-16",
  "fade-right": "opacity-0 -translate-x-16",
  "zoom-in":    "opacity-0 scale-90",
  "fade":       "opacity-0",
};

const visibleStyles: Record<Variant, string> = {
  "fade-up":    "opacity-100 translate-y-0",
  "fade-down":  "opacity-100 translate-y-0",
  "fade-left":  "opacity-100 translate-x-0",
  "fade-right": "opacity-100 translate-x-0",
  "zoom-in":    "opacity-100 scale-100",
  "fade":       "opacity-100",
};

const AnimatedSection = ({
  children,
  delay = 0,
  duration = 700,
  variant = "fade-up",
  threshold = 0.15,
  className = "",
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation(threshold);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible ? visibleStyles[variant] : hiddenStyles[variant]
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
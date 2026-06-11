import { useEffect, useRef, useState, useCallback } from "react";

interface ImmersiveTourProps {
  images: string[];
  propertyTitle?: string;
}

// Chaque image a un mouvement Ken Burns unique pour varier l'effet
const KEN_BURNS_PRESETS = [
  // [fromScale, toScale, fromX, toX, fromY, toY] — en %
  { fromScale: 1.08, toScale: 1.0,  fromX:  2,  toX: -2,  fromY:  1, toY: -1  }, // zoom out + glisse gauche
  { fromScale: 1.0,  toScale: 1.08, fromX: -2,  toX:  2,  fromY: -1, toY:  1  }, // zoom in  + glisse droite
  { fromScale: 1.06, toScale: 1.0,  fromX:  0,  toX:  0,  fromY:  2, toY: -2  }, // zoom out + montée
  { fromScale: 1.0,  toScale: 1.06, fromX:  2,  toX: -2,  fromY:  0, toY:  0  }, // zoom in  + glisse gauche pur
  { fromScale: 1.05, toScale: 1.0,  fromX: -1,  toX:  1,  fromY: -2, toY:  2  }, // zoom out + descente
];

const ImmersiveTour = ({ images, propertyTitle }: ImmersiveTourProps) => {
  const sectionRef     = useRef<HTMLDivElement>(null);
  const rafRef         = useRef<number>(0);

  const [activeIndex,    setActiveIndex]    = useState(0);
  const [prevIndex,      setPrevIndex]      = useState<number | null>(null);
  const [showHint,       setShowHint]       = useState(true);
  const [globalProgress, setGlobalProgress] = useState(0);
  // scenePct : 0→1 dans la scène courante, sert à interpoler le Ken Burns
  const [scenePct,       setScenePct]       = useState(0);

  const SCENE_HEIGHT_VH = 120; // vh de scroll par image

  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;

      const rect     = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total    = section.offsetHeight - window.innerHeight;

      if (scrolled < 0 || scrolled > total + 1) return;

      const clamped   = Math.max(0, Math.min(scrolled, total));
      const globalPct = clamped / total;
      setGlobalProgress(globalPct);

      if (scrolled > 50) setShowHint(false);

      // Scène active
      const sceneHeightPx = (window.innerHeight * SCENE_HEIGHT_VH) / 100;
      const sceneIndex    = Math.min(
        Math.floor(clamped / sceneHeightPx),
        images.length - 1
      );
      const sceneScrolled = clamped - sceneIndex * sceneHeightPx;
      const pct           = Math.min(sceneScrolled / sceneHeightPx, 1);

      setScenePct(pct);

      if (sceneIndex !== activeIndex) {
        setPrevIndex(activeIndex);
        setActiveIndex(sceneIndex);
        // Effacer le prev après la transition
        setTimeout(() => setPrevIndex(null), 900);
      }
    });
  }, [activeIndex, images.length]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  if (!images.length) return null;

  // Interpolation Ken Burns pour l'image active
  const preset  = KEN_BURNS_PRESETS[activeIndex % KEN_BURNS_PRESETS.length];
  const scale   = preset.fromScale + (preset.toScale - preset.fromScale) * scenePct;
  const tx      = preset.fromX    + (preset.toX    - preset.fromX)    * scenePct;
  const ty      = preset.fromY    + (preset.toY    - preset.fromY)    * scenePct;

  return (
    <section
      ref={sectionRef}
      style={{ height: `${images.length * SCENE_HEIGHT_VH}vh` }}
      className="relative"
      aria-label="Immersive property tour"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* ── Image précédente (fade out) ── */}
        {prevIndex !== null && (
          <div
            key={`prev-${prevIndex}`}
            className="absolute inset-0"
            style={{ animation: "immersiveFadeOut 0.9s ease forwards" }}
          >
            <img
              src={images[prevIndex]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scale(1.04)" }}
              draggable={false}
            />
          </div>
        )}

        {/* ── Image active avec Ken Burns contrôlé par le scroll ── */}
        <div
          key={`active-${activeIndex}`}
          className="absolute inset-0"
          style={{ animation: prevIndex !== null ? "immersiveFadeIn 0.9s ease forwards" : "none" }}
        >
          <img
            src={images[activeIndex]}
            alt={`Tour — vue ${activeIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform : `scale(${scale}) translate(${tx}%, ${ty}%)`,
              willChange: "transform",
            }}
            draggable={false}
          />
        </div>

        {/* ── Vignette périphérique douce ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* ── Gradient bas ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
        />

        {/* ── Gradient haut (pour lisibilité du label) ── */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)" }}
        />

        {/* ── Hint "Scroll to explore" ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ opacity: showHint ? 1 : 0, transition: "opacity 1.2s ease" }}
        >
          <p className="text-white/75 text-[11px] sm:text-xs font-light tracking-[0.3em] uppercase mb-7">
            Scroll to explore
          </p>
          <div className="flex flex-col items-center gap-0.5">
            {[0, 1, 2].map((n) => (
              <svg
                key={n}
                className="w-[14px] h-[14px] text-white"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={1.2}
                style={{ animation: `immersiveChevron 1.8s ease-in-out ${n * 0.28}s infinite` }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ))}
          </div>
        </div>

        {/* ── Label Virtual Tour + titre (haut gauche) ── */}
        {propertyTitle && (
          <div
            className="absolute top-6 left-6 sm:top-8 sm:left-10 pointer-events-none select-none"
            style={{ opacity: showHint ? 0 : 1, transition: "opacity 1.2s ease" }}
          >
            <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5 font-light">
              Virtual Tour
            </p>
            <p className="text-white/80 text-sm font-light leading-snug max-w-[200px] truncate">
              {propertyTitle}
            </p>
          </div>
        )}

        {/* ── Strip de thumbnails (bas centre) ── */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none"
          style={{ opacity: showHint ? 0 : 1, transition: "opacity 1.2s ease" }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-sm transition-all duration-500"
              style={{
                width : i === activeIndex ? "36px" : "20px",
                height: i === activeIndex ? "24px" : "14px",
                opacity: i === activeIndex ? 1 : 0.45,
                outline: i === activeIndex ? "1.5px solid rgba(255,255,255,0.8)" : "none",
                outlineOffset: "1px",
              }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── Compteur (bas gauche) ── */}
        <div
          className="absolute bottom-9 left-6 sm:left-10 pointer-events-none select-none"
          style={{ opacity: showHint ? 0 : 1, transition: "opacity 1.2s ease" }}
        >
          <span className="text-white/30 text-[10px] tabular-nums tracking-[0.2em] font-light">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-1.5 text-white/15">/</span>
            {String(images.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Indicateur vertical (droite) ── */}
        <div className="absolute right-5 sm:right-7 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-600"
              style={{
                width          : "1.5px",
                height         : i === activeIndex ? "32px" : "8px",
                backgroundColor: i === activeIndex
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.2)",
                transition     : "height 0.5s ease, background-color 0.5s ease",
              }}
            />
          ))}
        </div>

        {/* ── Barre de progression (tout en bas) ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/8 pointer-events-none">
          <div
            className="h-full bg-white/40"
            style={{ width: `${globalProgress * 100}%`, transition: "width 0.06s linear" }}
          />
        </div>

      </div>

      <style>{`
        @keyframes immersiveChevron {
          0%,100% { opacity:0.12; transform:translateY(-4px); }
          50%     { opacity:0.85; transform:translateY(5px);  }
        }
        @keyframes immersiveFadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes immersiveFadeOut {
          from { opacity:1; } to { opacity:0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes immersiveChevron { 0%,100% { opacity:0.5; transform:none; } }
          @keyframes immersiveFadeIn  { from { opacity:1; } }
          @keyframes immersiveFadeOut { to   { opacity:0; } }
        }
      `}</style>
    </section>
  );
};

export default ImmersiveTour;
// /**
//  * ImmersiveTourModal — Visite cinématique en modal plein écran
//  *
//  * Architecture scroll :
//  *  - Aucun container scrollable, aucun GSAP ScrollTrigger
//  *  - wheel + touch natifs interceptés avec { passive: false } sur le modal
//  *  - progressRef accumule le delta de scroll (0→1)
//  *  - Boucle RAF dédiée applique le seek vidéo quand le décodeur est libre
//  *  - La page principale est figée (position:fixed) pendant l'ouverture
//  */

// import { useEffect, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { gsap } from "gsap";
// import { X, Play } from "lucide-react";

// // ─────────────────────────────────────────────────────────────────────────────
// // Types & constantes
// // ─────────────────────────────────────────────────────────────────────────────

// export interface ImmersiveTourModalProps {
//   videos        : string[];
//   images        : string[];
//   propertyTitle?: string;
//   isOpen        : boolean;
//   onClose       : () => void;
// }

// type Phase = "intro" | "scrolling" | "outro";

// // Sensibilité du scroll : plus la valeur est petite, plus il faut scroller
// const SCROLL_SENSITIVITY = 0.00012;

// // ─────────────────────────────────────────────────────────────────────────────
// // Composant
// // ─────────────────────────────────────────────────────────────────────────────

// const ImmersiveTourModal = ({
//   videos, images, propertyTitle, isOpen, onClose,
// }: ImmersiveTourModalProps) => {

//   // ── Refs ──────────────────────────────────────────────────────────────────
//   const modalRef       = useRef<HTMLDivElement>(null);
//   const videoRef       = useRef<HTMLVideoElement>(null);
//   const kenBurnsRef    = useRef<gsap.core.Tween | null>(null);
//   const progressRef    = useRef(0);        // 0→1, accumulé depuis les events wheel/touch
//   const targetTimeRef  = useRef(0);        // secondes cibles pour le seek
//   const seekingRef     = useRef(false);    // verrou décodeur
//   const rafRef         = useRef<number>(0);
//   const touchStartY    = useRef(0);
//   const enteredRef     = useRef(false);    // ref pour accès dans les event listeners

//   // ── State ─────────────────────────────────────────────────────────────────
//   const [phase,          setPhase]          = useState<Phase>("intro");
//   const [videoReady,     setVideoReady]     = useState(false);
//   const [videoDuration,  setVideoDuration]  = useState(0);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [edgeOpacity,    setEdgeOpacity]    = useState(0);
//   const [entered,        setEntered]        = useState(false);

//   const video = videos[0] ?? null;

//   // ── Figer / libérer la page principale ───────────────────────────────────
//   useEffect(() => {
//     if (!isOpen) return;
//     const scrollY = window.scrollY;
//     document.body.style.cssText = `
//       position: fixed;
//       top: -${scrollY}px;
//       left: 0; right: 0; width: 100%;
//       overflow: hidden;
//     `;
//     return () => {
//       document.body.style.cssText = "";
//       window.scrollTo(0, scrollY);
//     };
//   }, [isOpen]);

//   // ── Reset à l'ouverture ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isOpen) return;
//     setPhase("intro");
//     setVideoReady(false);
//     setVideoDuration(0);
//     setScrollProgress(0);
//     setEdgeOpacity(0);
//     setEntered(false);
//     enteredRef.current   = false;
//     progressRef.current  = 0;
//     targetTimeRef.current = 0;
//     seekingRef.current   = false;
//     cancelAnimationFrame(rafRef.current);
//   }, [isOpen]);

//   // ── Cleanup total ─────────────────────────────────────────────────────────
//   useEffect(() => () => {
//     kenBurnsRef.current?.kill();
//     cancelAnimationFrame(rafRef.current);
//     document.body.style.cssText = "";
//   }, []);

//   // ── Métadonnées vidéo ─────────────────────────────────────────────────────
//   const onLoadedMetadata = useCallback(() => {
//     const v = videoRef.current;
//     if (!v) return;
//     setVideoDuration(v.duration);
//     v.currentTime = 0;
//   }, []);

//   const onCanPlayThrough = useCallback(() => setVideoReady(true), []);

//   // ── Ken Burns ─────────────────────────────────────────────────────────────
//   const startKenBurns = useCallback(() => {
//     kenBurnsRef.current?.kill();
//     kenBurnsRef.current = gsap.to(videoRef.current, {
//       scale: 1.07, duration: 9, ease: "none", repeat: -1, yoyo: true,
//     });
//   }, []);

//   const stopKenBurns = useCallback(() => {
//     kenBurnsRef.current?.kill();
//     kenBurnsRef.current = null;
//     gsap.to(videoRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
//   }, []);

//   useEffect(() => {
//     if (videoReady && !entered && isOpen) startKenBurns();
//   }, [videoReady, entered, isOpen, startKenBurns]);

//   // ── Boucle RAF seek ───────────────────────────────────────────────────────
//   const startSeekLoop = useCallback(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     v.addEventListener("seeked", () => { seekingRef.current = false; }, { passive: true });

//     let lastProg = -1;
//     let lastVel  = 0;

//     const loop = () => {
//       // Seek seulement si le décodeur est libre
//       if (!seekingRef.current) {
//         const diff = Math.abs(v.currentTime - targetTimeRef.current);
//         if (diff > 0.016) {                    // ~1 frame à 60fps
//           seekingRef.current = true;
//           v.currentTime      = targetTimeRef.current;
//         }
//       }

//       // Mettre à jour les states React seulement si la progression a changé
//       const prog = progressRef.current;
//       if (Math.abs(prog - lastProg) > 0.001) {
//         lastProg = prog;
//         setScrollProgress(prog);
//       }

//       // Edge opacity décroît naturellement (inertie visuelle)
//       lastVel = lastVel * 0.88;
//       if (Math.abs(lastVel) > 0.001) setEdgeOpacity(Math.min(lastVel, 1));

//       rafRef.current = requestAnimationFrame(loop);
//     };

//     rafRef.current = requestAnimationFrame(loop);
//     return lastVel; // pour ESLint
//   }, []);

//   // ── Event handlers wheel / touch ──────────────────────────────────────────
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       if (!enteredRef.current) return;

//       const duration = videoRef.current?.duration ?? 0;
//       if (!duration) return;

//       const delta = e.deltaY * SCROLL_SENSITIVITY;
//       progressRef.current  = Math.max(0, Math.min(1, progressRef.current + delta));
//       targetTimeRef.current = progressRef.current * duration;

//       // Edge blur proportionnel à la vitesse
//       setEdgeOpacity(Math.min(Math.abs(e.deltaY) * 0.004, 1));

//       // Outro
//       if (progressRef.current >= 0.97) setPhase("outro");
//     };

//     const handleTouchStart = (e: TouchEvent) => {
//       touchStartY.current = e.touches[0].clientY;
//     };

//     const handleTouchMove = (e: TouchEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       if (!enteredRef.current) return;

//       const duration = videoRef.current?.duration ?? 0;
//       if (!duration) return;

//       const deltaY = touchStartY.current - e.touches[0].clientY;
//       touchStartY.current = e.touches[0].clientY;

//       const delta = deltaY * SCROLL_SENSITIVITY * 8; // touch plus sensible
//       progressRef.current   = Math.max(0, Math.min(1, progressRef.current + delta));
//       targetTimeRef.current  = progressRef.current * duration;

//       setEdgeOpacity(Math.min(Math.abs(deltaY) * 0.02, 1));
//       if (progressRef.current >= 0.97) setPhase("outro");
//     };

//     const modal = modalRef.current;
//     if (!modal) return;

//     // { passive: false } obligatoire pour pouvoir appeler preventDefault()
//     modal.addEventListener("wheel",      handleWheel,      { passive: false });
//     modal.addEventListener("touchstart", handleTouchStart, { passive: true  });
//     modal.addEventListener("touchmove",  handleTouchMove,  { passive: false });

//     return () => {
//       modal.removeEventListener("wheel",      handleWheel);
//       modal.removeEventListener("touchstart", handleTouchStart);
//       modal.removeEventListener("touchmove",  handleTouchMove);
//     };
//   }, [isOpen]);

//   // ── Entrer dans les lieux ─────────────────────────────────────────────────
//   const handleEnter = useCallback(() => {
//     stopKenBurns();
//     enteredRef.current = true;
//     setEntered(true);
//     setPhase("scrolling");
//     startSeekLoop();
//   }, [stopKenBurns, startSeekLoop]);

//   // ── Fermer ────────────────────────────────────────────────────────────────
//   const handleClose = useCallback(() => {
//     kenBurnsRef.current?.kill();
//     cancelAnimationFrame(rafRef.current);
//     onClose();
//   }, [onClose]);

//   // ── Escape ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isOpen) return;
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [isOpen, handleClose]);

//   if (!isOpen || !video) return null;

//   // ─────────────────────────────────────────────────────────────────────────
//   // Render via Portal
//   // ─────────────────────────────────────────────────────────────────────────

//   return createPortal(
//     <div
//       ref={modalRef}
//       className="fixed inset-0 bg-black"
//       style={{
//         zIndex   : 9998,
//         animation: "immersiveModalIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
//         touchAction: "none",
//       }}
//       role="dialog"
//       aria-modal="true"
//       aria-label="Virtual Tour"
//     >
//       {/* ── Bouton fermer ── */}
//       <button
//         onClick={handleClose}
//         className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
//         aria-label="Fermer"
//       >
//         <X className="w-4 h-4" />
//       </button>

//       {/* ── Vidéo plein écran ── */}
//       <video
//         ref={videoRef}
//         src={video}
//         muted
//         playsInline
//         preload="auto"
//         onLoadedMetadata={onLoadedMetadata}
//         onCanPlayThrough={onCanPlayThrough}
//         className="absolute inset-0 w-full h-full object-cover origin-center"
//         style={{ willChange: "transform" }}
//       />

//       {/* Edge blur gauche */}
//       <div className="absolute inset-y-0 left-0 w-2/5 pointer-events-none" style={{
//         opacity  : edgeOpacity * 0.5,
//         background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
//         backdropFilter: `blur(${edgeOpacity * 4}px)`,
//         transition: "opacity 0.06s linear",
//       }} />
//       {/* Edge blur droite */}
//       <div className="absolute inset-y-0 right-0 w-2/5 pointer-events-none" style={{
//         opacity  : edgeOpacity * 0.5,
//         background: "linear-gradient(to left, rgba(0,0,0,0.7), transparent)",
//         backdropFilter: `blur(${edgeOpacity * 4}px)`,
//         transition: "opacity 0.06s linear",
//       }} />

//       {/* Vignette */}
//       <div className="absolute inset-0 pointer-events-none" style={{
//         background: "radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(0,0,0,0.45) 100%)",
//       }} />

//       {/* Gradient bas */}
//       <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none" style={{
//         background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
//       }} />

//       {/* Gradient haut */}
//       <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none" style={{
//         background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
//       }} />

//       {/* ════════════════════════════════════════════════════════
//           ÉTAPE 1 — Intro
//       ════════════════════════════════════════════════════════ */}
//       <div
//         className="absolute inset-0 flex flex-col items-center justify-center"
//         style={{
//           opacity      : phase === "intro" ? 1 : 0,
//           pointerEvents: phase === "intro" ? "auto" : "none",
//           transition   : "opacity 0.6s ease",
//           zIndex       : 10,
//         }}
//       >
//         {propertyTitle && (
//           <p className="text-white/70 text-[10px] tracking-[0.35em] uppercase mb-4 select-none">
//             {propertyTitle}
//           </p>
//         )}
//         <p className="text-white text-2xl sm:text-3xl font-extralight tracking-[0.08em] mb-12 select-none drop-shadow-lg">
//           Virtual Tour
//         </p>

//         {videoReady ? (
//           <button
//             onClick={handleEnter}
//             className="group relative flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm font-light tracking-[0.18em] uppercase transition-all duration-300 hover:scale-105 active:scale-98"
//             style={{
//               background    : "rgba(255,255,255,0.08)",
//               border        : "1px solid rgba(255,255,255,0.25)",
//               backdropFilter: "blur(12px)",
//               boxShadow     : "0 0 40px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)",
//             }}
//             onMouseEnter={(e) => {
//               const b = e.currentTarget as HTMLButtonElement;
//               b.style.background = "rgba(255,255,255,0.14)";
//               b.style.borderColor = "rgba(255,255,255,0.45)";
//             }}
//             onMouseLeave={(e) => {
//               const b = e.currentTarget as HTMLButtonElement;
//               b.style.background = "rgba(255,255,255,0.08)";
//               b.style.borderColor = "rgba(255,255,255,0.25)";
//             }}
//           >
//             <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
//               <Play className="w-3 h-3 fill-white ml-0.5" />
//             </div>
//             Entrer dans les lieux
//           </button>
//         ) : (
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative w-10 h-10">
//               <div className="absolute inset-0 rounded-full border border-white/10" />
//               <div className="absolute inset-0 rounded-full border border-t-white/60"
//                 style={{ animation: "immersiveSpin 1s linear infinite" }} />
//             </div>
//             <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase select-none">
//               Chargement…
//             </p>
//           </div>
//         )}

//         {videoReady && (
//           <div className="absolute bottom-10 flex flex-col items-center gap-1.5 pointer-events-none select-none">
//             <p className="text-white text-[10px] tracking-[0.28em] uppercase mb-3 drop-shadow-md"
//              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}>
//              Scrollez pour commencer
//             </p>
//             {[0,1,2].map((n) => (
//               <svg key={n} className="w-3.5 h-3.5 text-white/70" fill="none"
//                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.1}
//                 style={{ animation: `immersiveChevron 2s ease-in-out ${n*0.3}s infinite` }}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//               </svg>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           ÉTAPE 2 — HUD scroll
//       ════════════════════════════════════════════════════════ */}
//       {phase === "scrolling" && (
//         <>
//           {propertyTitle && (
//             <div className="absolute top-6 left-6 sm:top-8 sm:left-10 pointer-events-none select-none" style={{ zIndex: 10 }}>
//              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-1.5 font-light">Virtual Tour</p>
//              <p className="text-white/80 text-xs font-light max-w-[180px] truncate"
//                 style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>{propertyTitle}</p>
//             </div>
//           )}
//           <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-[9px] tracking-[0.22em] uppercase pointer-events-none select-none"
//             style={{ zIndex: 10, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
//             Scrollez pour avancer
//           </p>
//         </>
//       )}

//       {/* ════════════════════════════════════════════════════════
//           ÉTAPE 3 — Outro
//       ════════════════════════════════════════════════════════ */}
//       {phase === "outro" && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center"
//           style={{ animation: "immersiveFadeIn 1s ease forwards", zIndex: 10 }}>
//           <p className="text-white/60 text-[9px] tracking-[0.35em] uppercase mb-4 select-none pointer-events-none">
//             Fin de la visite
//           </p>
//           {propertyTitle && (
//            <p className="text-white text-lg font-extralight tracking-wide mb-12 select-none pointer-events-none drop-shadow-lg"
//               style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>
//               {propertyTitle}
//             </p>
//           )}
//           <button
//             onClick={handleClose}
//             className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white text-[11px] font-light tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105"
//             style={{
//               background    : "rgba(255,255,255,0.09)",
//               border        : "1px solid rgba(255,255,255,0.22)",
//               backdropFilter: "blur(10px)",
//             }}
//             onMouseEnter={(e) => {
//               const b = e.currentTarget as HTMLButtonElement;
//               b.style.background = "rgba(255,255,255,0.16)";
//               b.style.borderColor = "rgba(255,255,255,0.4)";
//             }}
//             onMouseLeave={(e) => {
//               const b = e.currentTarget as HTMLButtonElement;
//               b.style.background = "rgba(255,255,255,0.09)";
//               b.style.borderColor = "rgba(255,255,255,0.22)";
//             }}
//           >
//             <X className="w-3.5 h-3.5" />
//             Fermer la visite
//           </button>
//         </div>
//       )}

//       {/* Barre de progression */}
//       {phase !== "intro" && (
//         <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
//           style={{ background: "rgba(255,255,255,0.08)", zIndex: 10 }}>
//           <div className="h-full" style={{
//             width     : `${scrollProgress * 100}%`,
//             background: "rgba(255,255,255,0.45)",
//             transition: "width 0.04s linear",
//           }} />
//         </div>
//       )}

//       <style>{`
//         @keyframes immersiveModalIn { from{opacity:0;transform:scale(1.015)} to{opacity:1;transform:scale(1)} }
//         @keyframes immersiveSpin    { to{transform:rotate(360deg)} }
//         @keyframes immersiveChevron { 0%,100%{opacity:.08;transform:translateY(-5px)} 50%{opacity:.7;transform:translateY(6px)} }
//         @keyframes immersiveFadeIn  { from{opacity:0} to{opacity:1} }
//         @media (prefers-reduced-motion:reduce) {
//           @keyframes immersiveModalIn { from{opacity:0} to{opacity:1} }
//           @keyframes immersiveChevron { 0%,100%{opacity:.3} }
//         }
//       `}</style>
//     </div>,
//     document.body
//   );
// };

// export default ImmersiveTourModal;
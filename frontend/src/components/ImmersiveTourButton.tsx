/**
 * ImmersiveTourButton — Bouton déclencheur du modal de visite immersive
 *
 * Usage dans PropertyDetail :
 *   <ImmersiveTourButton onClick={() => setTourOpen(true)} />
 */

import { Play } from "lucide-react";

interface ImmersiveTourButtonProps {
  onClick: () => void;
}

const ImmersiveTourButton = ({ onClick }: ImmersiveTourButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-98"
      aria-label="Lancer la visite virtuelle immersive"
    >
      {/* Icône play avec halo animé */}
      <div className="relative flex-shrink-0">
        {/* Halo pulsant */}
        <div
          className="absolute inset-0 rounded-full bg-primary/20"
          style={{ animation: "tourButtonPulse 2.4s ease-in-out infinite" }}
        />
        {/* Cercle principal */}
        <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow duration-300">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>
      </div>

      {/* Texte */}
      <div className="text-left">
        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-light leading-none mb-1">
          Visite immersive
        </p>
        <p className="text-sm font-medium text-foreground leading-none group-hover:text-primary transition-colors duration-200">
          Entrer dans les lieux
        </p>
      </div>

      <style>{`
        @keyframes tourButtonPulse {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.5); opacity: 0;   }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tourButtonPulse { 0%, 100% { opacity: 0; } }
        }
      `}</style>
    </button>
  );
};

export default ImmersiveTourButton;
import { Search, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

// ── Config ────────────────────────────────────────────────────────────────────
const IMAGE_SEARCH_APP_URL = "https://placeholder-image-search.vercel.app";

interface PropertyFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  propertyTypes: string[];
  filterCity: string;
  onFilterCityChange: (value: string) => void;
  propertyCities: string[];
  onImageSearch?: (file: File | null, url: string | null) => void;
  isImageSearchMode?: boolean;
  // Mettre à true quand la feature recherche par image est prête
  enableImageSearch?: boolean;
}

// ── Image Search Sidebar ──────────────────────────────────────────────────────
const ImageSearchSidebar = ({ onClose }: { onClose: () => void }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 z-50 h-screen w-full max-w-lg flex flex-col bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-foreground">
              Recherche par image
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 relative">
          {!iframeReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background">
              <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={IMAGE_SEARCH_APP_URL}
            title="Recherche par image"
            className={`w-full h-full border-0 transition-opacity duration-300 ${iframeReady ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIframeReady(true)}
            allow="camera; clipboard-read; clipboard-write"
          />
        </div>
        <div className="px-5 py-3 border-t border-border shrink-0 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Propulsé par la recherche visuelle Orchid Island
          </p>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Fermer
          </button>
        </div>
      </aside>
    </>
  );
};

// ── PropertyFilterBar ─────────────────────────────────────────────────────────
const PropertyFilterBar = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  propertyTypes,
  filterCity,
  onFilterCityChange,
  propertyCities,
  isImageSearchMode,
  enableImageSearch = false, // false jusqu'à ce que la feature soit prête
}: PropertyFilterBarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    (value: string) => onSearchChange(value),
    200
  );

  return (
    <>
      {/* ── Desktop : pill tout-en-un ── */}
      <div className="hidden md:flex items-center bg-background border border-border/60 rounded-full shadow-sm px-2 py-1.5 gap-1 w-full">

        {/* Search input */}
        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-1.5">
          <Search className="w-4 h-4 text-primary shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-0.5">
              Search
            </span>
            <Input
              type="text"
              placeholder=""
              defaultValue={searchTerm}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm bg-transparent font-lora"
            />
          </div>

          {/* Bouton caméra — activé uniquement quand enableImageSearch=true */}
          {enableImageSearch && (
            <button
              onClick={() => setSidebarOpen(true)}
              title="Rechercher par image"
              className={`p-1 rounded-md transition-colors shrink-0 ${
                sidebarOpen
                  ? "text-[#D4AF37] bg-[#D4AF37]/10"
                  : "text-muted-foreground hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
              }`}
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        <span className="w-px h-7 bg-border/60 shrink-0" />

        {/* Type select */}
        <div className="flex flex-col min-w-0 px-3 py-1.5">
          <label htmlFor="filter-type-desktop" className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-0.5">
            Type
          </label>
          <select
            id="filter-type-desktop"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            disabled={isImageSearchMode}
            className={`font-lora text-sm text-foreground bg-transparent border-0 focus:outline-none cursor-pointer transition-opacity ${
              isImageSearchMode ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <option value="all">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <span className="w-px h-7 bg-border/60 shrink-0" />

        {/* City select */}
        <div className="flex flex-col min-w-0 px-3 py-1.5">
          <label htmlFor="filter-city-desktop" className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-0.5">
            Location
          </label>
          <select
            id="filter-city-desktop"
            value={filterCity}
            onChange={(e) => onFilterCityChange(e.target.value)}
            disabled={isImageSearchMode}
            className={`font-lora text-sm text-foreground bg-transparent border-0 focus:outline-none cursor-pointer transition-opacity ${
              isImageSearchMode ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <option value="all">Toutes les villes</option>
            {propertyCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      
      </div>

      {/* ── Mobile : layout vertical en deux lignes ── */}
      <div className="flex md:hidden flex-col gap-2 w-full">

        {/* Ligne 1 : champ de recherche */}
        <div className="flex items-center gap-2 bg-background border border-border/60 rounded-full shadow-sm px-4 py-2.5">
          <Search className="w-4 h-4 text-primary shrink-0" />
          <Input
            type="text"
            placeholder="Rechercher un bien..."
            defaultValue={searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm bg-transparent font-lora flex-1 min-w-0"
          />
          {/* Caméra mobile — même condition */}
          {enableImageSearch && (
            <button
              onClick={() => setSidebarOpen(true)}
              title="Rechercher par image"
              className="p-1 rounded-md text-muted-foreground hover:text-[#D4AF37] transition-colors shrink-0"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ligne 2 : filtres + bouton search */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            disabled={isImageSearchMode}
            className={`font-lora text-xs text-foreground bg-background border border-border/60 rounded-full px-3 py-2 flex-1 focus:outline-none transition-opacity ${
              isImageSearchMode ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <option value="all">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterCity}
            onChange={(e) => onFilterCityChange(e.target.value)}
            disabled={isImageSearchMode}
            className={`font-lora text-xs text-foreground bg-background border border-border/60 rounded-full px-3 py-2 flex-1 focus:outline-none transition-opacity ${
              isImageSearchMode ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <option value="all">Toutes les villes</option>
            {propertyCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button className="flex items-center justify-center bg-foreground text-background font-lora text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sidebar image search */}
      {sidebarOpen && (
        <ImageSearchSidebar onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default PropertyFilterBar;
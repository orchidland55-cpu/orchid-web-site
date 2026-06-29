import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Home, Building2, Layers, Briefcase, TreePine, Castle, Warehouse, Users } from "lucide-react";
import { apiService, Property } from "@/services/api";

// ── Icon map par type ─────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ReactNode> = {
  villa:      <Home        className="w-6 h-6" strokeWidth={1.5} />,
  apartment:  <Building2   className="w-6 h-6" strokeWidth={1.5} />,
  penthouse:  <Layers      className="w-6 h-6" strokeWidth={1.5} />,
  commercial: <Briefcase   className="w-6 h-6" strokeWidth={1.5} />,
  land:       <TreePine    className="w-6 h-6" strokeWidth={1.5} />,
  riad:       <Castle      className="w-6 h-6" strokeWidth={1.5} />,
  chalet:     <Home        className="w-6 h-6" strokeWidth={1.5} />,
  warehouse:  <Warehouse   className="w-6 h-6" strokeWidth={1.5} />,
  duplex:     <Layers      className="w-6 h-6" strokeWidth={1.5} />,
  studio:     <Users       className="w-6 h-6" strokeWidth={1.5} />,
};

// Label d'affichage propre par type
const TYPE_LABELS: Record<string, string> = {
  villa:      "Luxury Villas",
  apartment:  "Apartments",
  penthouse:  "Penthouses",
  commercial: "Commercial",
  land:       "Land",
  riad:       "Riads",
  chalet:     "Chalets",
  warehouse:  "Warehouses",
  duplex:     "Duplexes",
  studio:     "Studios",
};

const getIcon  = (type: string) => TYPE_ICONS[type.toLowerCase()]  ?? <Home className="w-6 h-6" strokeWidth={1.5} />;
const getLabel = (type: string) => TYPE_LABELS[type.toLowerCase()] ?? (type.charAt(0).toUpperCase() + type.slice(1));

// ── Component ─────────────────────────────────────────────────────────────────
const PropertyCategories = () => {
  const [types, setTypes]     = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data: Property[] = await apiService.getAllPropertiesCached();
        // Dédupliquer les types présents en BDD (disponibles uniquement)
        const uniqueTypes = Array.from(
          new Set(
            data
              .filter((p) => p.status === "available")
              .map((p) => p.type.toLowerCase())
          )
        );
        setTypes(uniqueTypes);
      } catch (err) {
        console.error("❌ PropertyCategories:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClick = (type: string) => {
    // Navigue vers /properties avec le type en query param
    navigate(`/properties?type=${encodeURIComponent(type)}`);
  };

  if (loading) {
    // Skeleton cards pendant le chargement
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <SkeletonHeader />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!types.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-lora text-xs tracking-[0.18em] uppercase text-muted-foreground">
              Categories
            </span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-center font-bold text-foreground">
            Properties for every ambition
          </h2>
        </div>

        {/* ── Type cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => handleClick(type)}
              className="
                group relative flex flex-col justify-between
                bg-card border border-border/60 rounded-2xl
                p-5 text-left
                hover:border-primary/40 hover:shadow-md
                transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
              "
              aria-label={`Browse ${getLabel(type)}`}
            >
              {/* Icon */}
              <span className="text-foreground/70 group-hover:text-primary transition-colors duration-200 mb-6">
                {getIcon(type)}
              </span>

              {/* Label + arrow */}
              <div className="flex items-end justify-between gap-2">
                <span className="font-lora text-sm font-medium text-foreground leading-snug">
                  {getLabel(type)}
                </span>
                <ArrowUpRight
                  className="
                    w-4 h-4 shrink-0 text-muted-foreground/50
                    group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                    transition-all duration-200
                  "
                />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

// ── Skeleton header ───────────────────────────────────────────────────────────
const SkeletonHeader = () => (
  <div>
    <div className="h-3 w-24 bg-muted/40 rounded-full animate-pulse mb-4" />
    <div className="h-10 w-56 bg-muted/40 rounded-lg animate-pulse mb-2" />
    <div className="h-10 w-40 bg-muted/40 rounded-lg animate-pulse" />
  </div>
);

export default PropertyCategories;
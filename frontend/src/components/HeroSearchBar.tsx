import { useState, useEffect } from "react";
import { MapPin, Home, BadgeDollarSign, Search } from "lucide-react";
import { apiService, Property } from "@/services/api";

// ── Budget ranges ─────────────────────────────────────────────────────────────
export const BUDGET_RANGES = [
  { label: "Any budget",    min: 0,          max: Infinity   },
  { label: "< 500K MAD",    min: 0,          max: 500_000    },
  { label: "500K – 1M MAD", min: 500_000,    max: 1_000_000  },
  { label: "1M – 3M MAD",   min: 1_000_000,  max: 3_000_000  },
  { label: "3M – 5M MAD",   min: 3_000_000,  max: 5_000_000  },
  { label: "5M – 10M MAD",  min: 5_000_000,  max: 10_000_000 },
  { label: "> 10M MAD",     min: 10_000_000, max: Infinity   },
];

export interface HeroFilters {
  type:     string;
  city:     string;
  minPrice: number;
  maxPrice: number;
}

interface HeroSearchBarProps {
  onSearch: (filters: HeroFilters) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Divider = () => (
  <span className="hidden md:block w-px h-8 bg-border/50 shrink-0" />
);

// ── Component ─────────────────────────────────────────────────────────────────
const HeroSearchBar = ({ onSearch }: HeroSearchBarProps) => {
  const [propertyTypes,  setPropertyTypes]  = useState<string[]>([]);
  const [propertyCities, setPropertyCities] = useState<string[]>([]);
  const [selectedType,   setSelectedType]   = useState("all");
  const [selectedCity,   setSelectedCity]   = useState("all");
  const [selectedBudget, setSelectedBudget] = useState(0); // index dans BUDGET_RANGES

  useEffect(() => {
    apiService.getAllPropertiesCached().then((data: Property[]) => {
      const available = data.filter((p) => p.status === "available");
      setPropertyTypes([...new Set(available.map((p) => p.type.toLowerCase()))]);
      setPropertyCities([...new Set(available.map((p) => p.city))]);
    });
  }, []);

  const handleSearch = () => {
    const range = BUDGET_RANGES[selectedBudget];
    onSearch({
      type:     selectedType,
      city:     selectedCity,
      minPrice: range.min,
      maxPrice: range.max,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-white/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] px-2 py-2 flex flex-col md:flex-row md:items-center gap-1">

      {/* Location */}
      <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-1">
            Location
          </span>
          <select
            aria-label="location"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="font-lora text-sm text-foreground bg-transparent border-0 focus:outline-none cursor-pointer w-full truncate"
          >
            <option value="all">Marrakech, Tanger, Rabat…</option>
            {propertyCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <Divider />

      {/* Property type */}
      <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5">
        <Home className="w-4 h-4 text-primary shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-1">
            Property type
          </span>
          <select
            aria-label="property-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="font-lora text-sm text-foreground bg-transparent border-0 focus:outline-none cursor-pointer w-full truncate"
          >
            <option value="all">Villa, Penthouse, Riad…</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{capitalize(t)}</option>
            ))}
          </select>
        </div>
      </div>

      <Divider />

      {/* Budget */}
      <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5">
        <BadgeDollarSign className="w-4 h-4 text-primary shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-lora text-[10px] tracking-widest uppercase text-muted-foreground leading-none mb-1">
            Budget
          </span>
          <select
            aria-label="budget"
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(Number(e.target.value))}
            className="font-lora text-sm text-foreground bg-transparent border-0 focus:outline-none cursor-pointer w-full truncate"
          >
            {BUDGET_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search button */}
      <div className="px-1 shrink-0">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 w-full md:w-auto justify-center bg-foreground text-background font-lora text-sm font-medium px-6 py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  );
};

export default HeroSearchBar;
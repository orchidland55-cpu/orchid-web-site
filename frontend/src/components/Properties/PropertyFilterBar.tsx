import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PropertyFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  propertyTypes: string[];
  filterCity: string;
  onFilterCityChange: (value: string) => void;
  propertyCities: string[];
}

const PropertyFilterBar = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  propertyTypes,
  filterCity,
  onFilterCityChange,
  propertyCities,
}: PropertyFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 bg-card border border-border/60 rounded-2xl px-4 py-3">
  
        {/* Search */}
        <div className="flex items-center gap-2 md:w-64 shrink-0">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
           type="text"
            placeholder="Rechercher une propriété..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm bg-transparent"
         />
        </div>

        {/* Spacer */}
  <div className="flex-1" />

  {/* Selects */}
  <div className="flex items-center gap-3">
    <select
      value={filterType}
      onChange={(e) => onFilterTypeChange(e.target.value)}
      className="border border-border/60 rounded-full bg-transparent text-sm text-foreground px-3 py-1.5 focus:outline-none"
    >
      <option value="all">Tous les types</option>
      {propertyTypes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>

    <select
      value={filterCity}
      onChange={(e) => onFilterCityChange(e.target.value)}
      className="border border-border/60 rounded-full bg-transparent text-sm text-foreground px-3 py-1.5 focus:outline-none"
    >
      <option value="all">Toutes les villes</option>
      {propertyCities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>

</div>
  );
};

export default PropertyFilterBar;
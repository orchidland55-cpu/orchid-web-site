import { Property } from "@/services/api";
import PropertyCard from "./PropertyCard";

interface MasonryGridProps {
  properties: Property[];
}

const MasonryGrid = ({ properties }: MasonryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property._id} className="h-96">
          <PropertyCard property={property} variant="large" />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
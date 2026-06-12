import { Property } from "@/services/api";
import PropertyCard from "./PropertyCard";
import "@/styles/Masonry.css";

const CELL_KEYS = ["a", "b", "c", "d", "e", "f"] as const;
// "a" and "d" are the 2x2 featured slots in the masonry pattern.
const LARGE_CELLS = new Set(["a", "d"]);

interface MasonryGridProps {
  properties: Property[];
}

const MasonryGrid = ({ properties }: MasonryGridProps) => {
  const chunks: Property[][] = [];
  for (let i = 0; i < properties.length; i += 6) {
    chunks.push(properties.slice(i, i + 6));
  }

  return (
    <div className="flex flex-col gap-6">
      {chunks.map((chunk, chunkIndex) => {
        // Trailing partial block (< 6 items): plain responsive grid, all
        // cards the same size, no grid-template-areas needed.
        if (chunk.length < 6) {
          return (
            <div
              key={chunkIndex}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {chunk.map((property) => (
                <div key={property._id} className="h-80">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          );
        }

        // Alternate which side the "featured" slot sits on, so the rhythm
        // doesn't look identical block after block.
        const mirrored = chunkIndex % 2 === 1;

        return (
          <div
            key={chunkIndex}
            className={`masonry-grid ${mirrored ? "masonry-grid--mirrored" : ""}`}
          >
            {chunk.map((property, i) => {
              const cell = CELL_KEYS[i];
              return (
                <div key={property._id} className={`masonry-cell-${cell}`}>
                  <PropertyCard
                    property={property}
                    variant={LARGE_CELLS.has(cell) ? "large" : "default"}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MasonryGrid;
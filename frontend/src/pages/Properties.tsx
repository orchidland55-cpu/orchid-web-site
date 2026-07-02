import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { apiService, Property } from "@/services/api";
import { Building, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyHero from "@/components/Properties/PropertyHero";
import PropertyFilterBar from "@/components/Properties/PropertyFilterBar";
import MasonryGrid from "@/components/Properties/MasonryGrid";
import { getCloudinaryUrl } from "@/services/cloudinary";


const PropertiesPage = () => {
  const filterBarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [filterSticky, setFilterSticky] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const [searchParams] = useSearchParams();
  const [filterType, setFilterType] = useState<string>(
    searchParams.get("type") ?? "all"
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFilterSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCity]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = getCloudinaryUrl("hero_tweegz.webp", 1600, 900, "auto", {
      format: "auto",
      crop: "fill",
      gravity: "auto",
    });
    document.head.appendChild(link); // ← ne pas return cette ligne

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllPropertiesCached();
      setProperties(
        data.filter(
          (p) => p.status === "available" || p.status === "sold"
        )
      );
    } catch (err) {
      console.error("Error loading properties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = Array.from(
    new Set(properties.map((p) => p.type).filter(Boolean))
  ).sort();
  const propertyCities = Array.from(
    new Set(properties.map((p) => p.city).filter(Boolean))
  ).sort();

  const hasActiveFilters =
    searchTerm.trim() !== "" || filterType !== "all" || filterCity !== "all";

  const filteredProperties = properties
    .filter((p) => {
      const text = `${p.title} ${p.location} ${p.city}`.toLowerCase();
      return (
        text.includes(searchTerm.toLowerCase()) &&
        (filterType === "all" ||
          p.type.toLowerCase() === filterType.toLowerCase()) &&
        (filterCity === "all" ||
          p.city.toLowerCase() === filterCity.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // The most recently added property gets the editorial hero treatment,
  // but only in the default "discovery" view: page 1, no search/filters.
  // As soon as the user searches or filters, or moves to another page,
  // every result goes straight into the masonry grid.
  const showHero =
    currentPage === 1 && !hasActiveFilters && currentProperties.length > 0;
  const heroProperty = showHero ? currentProperties[0] : null;
  const gridProperties = showHero
    ? currentProperties.slice(1)
    : currentProperties;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const siblings = 1;
    const pages: (number | "...")[] = [1];
    const left = Math.max(currentPage - siblings, 2);
    const right = Math.min(currentPage + siblings, totalPages - 1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return (
      <div className="flex flex-col items-center gap-3 mt-14">
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border/60 text-muted-foreground hover:border-border hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`dots-${i}`}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handlePageChange(p as number)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === p
                    ? "bg-foreground text-background"
                    : "border border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border/60 text-muted-foreground hover:border-border hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Page {currentPage} sur {totalPages} · {filteredProperties.length} propriétés
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* ── Hero ── purely visual now: no search bar overlay.
            Filters live with the results below, where they belong. */}
        <section
          className="relative h-[420px] md:h-[520px] flex items-center"
          style={{
            backgroundImage: `url('${getCloudinaryUrl(
              "hero_tweegz.webp",
              1600, 900, "auto",
              { format: "auto", crop: "fill", gravity: "auto" }
            )}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 container mx-auto px-6 w-full">
            <div className="max-w-xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white leading-tight mb-4">
                Our Exceptional <br /> Properties
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover our exclusive selection of luxury properties in Morocco
              </p>
            </div>
          </div>
        </section>

        {/* ── Filter bar — sticky, hors du hero ── */}
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
          <div className="container mx-auto px-6 py-3">
            <PropertyFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              propertyTypes={propertyTypes}
              filterCity={filterCity}
              onFilterCityChange={setFilterCity}
              propertyCities={propertyCities}
            />
          </div>
        </div>

        {/* ── Results ── */}
        {isLoading ? (
          <section className="py-20 min-h-[600px]">
            <div className="container mx-auto px-6 text-center">
              <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Loading properties...
              </h2>
              <p className="text-muted-foreground">Please wait</p>
            </div>
          </section>
        ) : (
          <section className="py-16 bg-background min-h-[600px]">
            <div className="container mx-auto px-6">
              <div className="mb-8">

                {filteredProperties.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-8">
                    {filteredProperties.length} propriété
                    {filteredProperties.length > 1 ? "s" : ""}
                    {filterCity !== "all" ? ` à ${filterCity}` : ""}
                    {filterType !== "all" ? ` · ${filterType}` : ""}
                  </p>
                )}

                {currentProperties.length > 0 ? (
                  <>
                    {heroProperty && <PropertyHero property={heroProperty} />}
                    <MasonryGrid properties={gridProperties} />
                    {renderPagination()}
                  </>
                ) : (
                  <div className="text-center py-24">
                    <Building className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No properties found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
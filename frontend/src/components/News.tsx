import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService, Article } from "@/services/api";
import { getCloudinaryUrl } from "@/services/cloudinary";

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articlePath = (id: string, slug?: string) => `/${slug || id}`;

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const articlesData = await apiService.getAllArticles();
        const publishedArticles = articlesData
          .filter((article) => article.status === "published")
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
        setArticles(publishedArticles);
      } catch (err) {
        console.error("❌ Error loading articles:", err);
        setError("Unable to load articles. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading) {
    return (
      <section id="news" className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-lora text-lg">Loading articles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="font-lora text-red-500 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1, 3);

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.slice(0, n - 1) + "…" : str || "";
  };

  return (
    <section id="news" className="py-20 bg-background">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cream/50 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-deep-blue font-lora text-sm font-bold">News</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our latest <span className="luxury-gradient bg-clip-text text-transparent">articles</span>
          </h2>
          <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest luxury real estate trends, expert advice, and market insights.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Featured Article */}
          {featuredArticle && (
            <div className="lg:col-span-2">
              <Card className="group relative overflow-hidden shadow-elegant hover:shadow-luxury transition-luxury border-0 bg-transparent h-full">
                <div className="relative h-72 sm:h-96 lg:h-full min-h-[400px]">
                  <img
                    src={getCloudinaryUrl(featuredArticle.image, 900, 520) || "/placeholder-article.jpg"}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={520}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-article.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div className="absolute inset-0 flex items-end sm:items-center justify-center">
                    <div className="font-lora text-center text-white p-4 sm:p-8 w-full">
                      <Badge className="luxury-gradient text-primary-foreground font-lora mb-2 sm:mb-4">
                        {featuredArticle.category || "Advice"}
                      </Badge>
                      <h3 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 line-clamp-2">
                        {featuredArticle.title}
                      </h3>
                      <p className="font-lora text-white/90 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 hidden sm:block line-clamp-3">
                        {truncate(featuredArticle.excerpt || featuredArticle.content, 120)}
                      </p>
                      <Link to={articlePath(featuredArticle._id, featuredArticle.slug)}>
                        <Button variant="luxury" className="w-fit">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-charcoal font-lora">
                      Latest
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 2 articles suivants — FIX : pas de flex-1 ni h-full sur les cards */}
          <div className="flex flex-col gap-6">
            {otherArticles.map((article) => (
              <Card
                key={article._id}
                className="group overflow-hidden shadow-subtle hover:shadow-elegant transition-luxury border-0 bg-card"
                // ✅ Pas de flex-1 ici — hauteur déterminée par le contenu
              >
                {/* ✅ Hauteur fixe stable + overflow-hidden sur le wrapper, pas sur l'img */}
                <div className="relative overflow-hidden" style={{ height: "192px" }}>
                  <img
                    src={getCloudinaryUrl(article.image, 500, 200) || "/placeholder-article.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={500}
                    height={200}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-article.jpg";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-charcoal font-lora">
                      {article.category || "Read More"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-playfair text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-smooth">
                    {article.title}
                  </h3>
                  <p className="font-lora text-muted-foreground text-sm mb-4 leading-relaxed">
                    {truncate(article.excerpt || article.content, 80)}
                  </p>
                  <div className="flex items-center justify-end">
                    <Link to={articlePath(article._id, article.slug)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 p-0 h-auto font-bold font-lora"
                      >
                        Read →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/real-estate-guide-orchid-island-marrakech">
            <Button variant="elegant" size="lg" className="font-playfair text-lg px-10 py-6 h-auto">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default News;
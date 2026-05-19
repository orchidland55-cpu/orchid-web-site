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
  const articlePath = (id: string, slug?: string) =>
  `/real-estate-guide-orchid-island-marrakech/${slug || id}`;

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const articlesData = await apiService.getAllArticles();
        // console.log("🚀 Articles received from backend:", articlesData); // DEBUG

        // Filter only published articles (status: "published")
        const publishedArticles = articlesData.filter(
          (article) => article.status === "published"
        );

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

  // Loading state
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

  // Error state
  if (error) {
    return (
      <section id="news" className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="font-lora text-red-500 text-lg">{error}</p>
          {/* <p className="text-muted-foreground mt-2">
            Make sure the backend is running at <code>http://localhost:3000</code>
          </p> */}
        </div>
      </section>
    );
  }

  // Select featured article (or first one)
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  // Take next 2 articles (or first 2 if no featured)
  const otherArticles = featuredArticle
    ? articles.filter((a) => a._id !== featuredArticle._id).slice(0, 2)
    : articles.slice(0, 2);

  // Utility function to truncate text
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
          {/* Featured Article (Large) */}
          {featuredArticle && (
            <div className="lg:col-span-2 flex">
              <Card className="group relative overflow-hidden shadow-elegant hover:shadow-luxury transition-luxury border-0 bg-transparent h-full">
                <div className="relative h-full">
                  <img
                    src={getCloudinaryUrl(featuredArticle.image) || "/placeholder-article.jpg"}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-article.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-lora text-center text-white p-8">
                      <Badge className="luxury-gradient text-primary-foreground font-lora mb-4">
                        {featuredArticle.category || "Advice"}
                      </Badge>
                      <h3 className="font-playfair text-3xl font-bold mb-4">
                        {featuredArticle.title}
                      </h3>
                      <p className="font-lora text-white/90 text-lg leading-relaxed mb-6">
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
                  {featuredArticle.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-charcoal font-lora">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Other Articles (Small cards) */}
          <div className="space-y-6">
            {otherArticles.map((article) => (
              <Card
                key={article._id}
                className="group overflow-hidden shadow-subtle hover:shadow-elegant transition-luxury border-0 bg-card"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getCloudinaryUrl(article.image) || "/placeholder-article.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          <Link to={`/real-estate-guide-orchid-island-marrakech`}>
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
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { apiService, Article } from "@/services/api";
import { Calendar, Clock, ArrowLeft, FileText, ChevronRight } from "lucide-react";
import ShareButton from '@/components/ShareButton';
import { getCloudinaryUrl } from "@/services/cloudinary";
import { Helmet } from 'react-helmet-async';

// ---------------------------------------------------------------------------
// Helper : slug si disponible, sinon _id (rétrocompatibilité)
// ---------------------------------------------------------------------------
const articlePath = (a: Article) => `/blog/${a.slug || a._id}`;

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      if (!id) {
        setError("Missing article ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // getArticleById envoie le param tel quel (slug ou _id)
        // le backend sait gérer les deux.
        const articleData = await apiService.getArticleById(id);
        if (!articleData || articleData.status !== "published") {
          setError("Article not found or not published");
          setLoading(false);
          return;
        }
        setArticle(articleData);

        const allArticles = await apiService.getAllArticles();

        // Articles liés (même catégorie, publiés, excluant l'article courant)
        // On exclut par _id ET par slug pour éviter tout doublon
        const related = allArticles
          .filter(
            (a) =>
              a.status === "published" &&
              a._id !== articleData._id &&
              a.category === articleData.category
          )
          .slice(0, 4);
        setRelatedArticles(related);

        // Articles récents
        const recent = allArticles
          .filter((a) => a.status === "published" && a._id !== articleData._id)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setRecentArticles(recent);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Error loading article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Loading article...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="font-lora text-muted-foreground mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link to="/blog">
              <Button variant="default">
                <ArrowLeft className="font-playfair w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "url": `https://orchid-immo-web-site.vercel.app/blog/${article.slug || article._id}`,
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Orchid Immobilier",
     "url": "https://orchid-immo-web-site.vercel.app"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.title} | Orchid Immobilier</title>
        <meta name="description" content={article.excerpt?.substring(0, 160)} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <main>
        {/* Article Header */}
        <section className="py-12">
          <div className="font-playfair container mx-auto px-6">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            <div className="font-lora max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
                {article.title}
              </h1>
              <div className="font-lora flex flex-wrap items-center justify-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {article.readTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{article.readTime}</span>
                  </div>
                )}
              </div>
              <div className="font-lora flex items-center justify-center space-x-4 mb-8">
                <ShareButton />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar Layout */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Article Content */}
                <div className="flex-1 lg:max-w-4xl">
                  {/* Hero Image */}
                  <div className="mb-12">
                    <img
                      src={getCloudinaryUrl(article.image, 800, 600) || "/fallback.jpg"}
                      alt={article.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  {/* Article Content */}
                  <article
                    className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>

                {/* Right Sidebar */}
                <aside className="lg:w-80 lg:sticky lg:top-8 lg:h-fit">
                  <div className="space-y-6">
                    {/* Article Info Card */}
                    <Card className="border-border shadow-lg">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <img
                            src={getCloudinaryUrl(article.image, 800, 600) || "/fallback.jpg"}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="font-lora absolute top-4 left-4">
                            <Badge variant="secondary">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h3 className="font-playfair text-lg font-bold text-foreground mb-4 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-3 text-primary" />
                            <time>
                              {new Date(article.createdAt).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          {article.readTime && (
                            <div className="font-lora flex items-center text-muted-foreground">
                              <Clock className="w-4 h-4 mr-3 text-primary" />
                              <span>{article.readTime}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Articles Sidebar */}
                    {recentArticles.length > 0 && (
                      <Card className="border-border shadow-lg">
                        <CardHeader>
                          <h3 className="font-playfair text-lg font-semibold text-foreground">
                            Recent Articles
                          </h3>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <div className="space-y-4">
                            {recentArticles.map((recent) => (
                              /* ✅ Lien avec slug */
                              <Link
                                key={recent._id}
                                to={articlePath(recent)}
                                className="block group cursor-pointer"
                              >
                                <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                  <img
                                    src={getCloudinaryUrl(recent.image, 800, 600) || "/fallback.jpg"}
                                    alt={recent.title}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-playfair font-medium text-sm text-foreground group-hover:text-primary line-clamp-2 mb-1">
                                      {recent.title}
                                    </h4>
                                    <div className="font-lora flex items-center text-xs text-muted-foreground">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {new Date(recent.createdAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Social Sharing */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h3 className="font-playfair text-lg font-bold text-foreground mb-4">
                Share this article
              </h3>
              <div className="relative">
                <ShareButton />
              </div>
            </div>
          </div>
        </section>

        {/* Related + Recent Articles */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Articles in the same category
                </h2>
                <p className="font-lora text-lg text-muted-foreground">
                  Discover other relevant content.
                </p>
              </div>

              {/* Related Articles Carousel */}
              {relatedArticles.length > 0 && (
                <div className="mb-8">
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {relatedArticles.map((relatedArticle) => (
                        <CarouselItem
                          key={relatedArticle._id}
                          className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                          {/* ✅ Lien avec slug */}
                          <Link to={articlePath(relatedArticle)}>
                            <Card className="h-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                              <CardHeader className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg">
                                  <img
                                    src={getCloudinaryUrl(relatedArticle.image, 400, 300) || "/api/placeholder/400/300"}
                                    alt={relatedArticle.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="font-lora absolute top-4 left-4">
                                    <Badge variant="secondary">
                                      {relatedArticle.category}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-6">
                                <h3 className="font-playfair text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                  {relatedArticle.title}
                                </h3>
                                <p className="font-lora text-muted-foreground mb-4 line-clamp-3">
                                  {relatedArticle.excerpt}
                                </p>
                              </CardContent>
                              <CardFooter className="p-6 pt-0">
                                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                              </CardFooter>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 bg-background border-border shadow-lg hover:bg-muted" />
                    <CarouselNext className="hidden md:flex -right-12 bg-background border-border shadow-lg hover:bg-muted" />
                  </Carousel>
                </div>
              )}

              <div className="font-lora text-center mt-12">
                <Link to="/blog">
                  <Button variant="default" size="lg">
                    View All Articles
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArticleDetail;
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------------------
// Helper : slug si disponible, sinon _id (rétrocompatibilité)
// ---------------------------------------------------------------------------
const articlePath = (a: Article) => `/${a.slug || a._id}`;

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fixImgSrc(html: string): string {
  return html
    .replace(/data-src="([^"]+)"/g, 'src="$1"')
    .replace(/data-srcset="([^"]+)"/g, 'srcset="$1"')
    // Supprime width= et height= en attributs HTML
    .replace(/<img([^>]*?)\s+width="[^"]*"/g, '<img$1')
    .replace(/<img([^>]*?)\s+height="[^"]*"/g, '<img$1')
    // Supprime width/height dans style="" inline
    .replace(/(<img[^>]*?)style="([^"]*)"/g, (_, pre, style) => {
      const cleaned = style
        .replace(/\bwidth\s*:[^;]+;?/g, '')
        .replace(/\bheight\s*:[^;]+;?/g, '')
        .trim();
      return cleaned ? `${pre}style="${cleaned}"` : pre;
    });
}

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      if (!id) {
        setError("Missing article ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const articleData = await apiService.getArticleById(id);
        if (!articleData || articleData.status !== "published") {
          setError("Article not found or not published");
          setLoading(false);
          return;
        }
        setArticle(articleData);

        const allArticles = await apiService.getAllArticles();

        const related = allArticles
          .filter(
            (a) =>
              a.status === "published" &&
              a._id !== articleData._id &&
              a.category === articleData.category
          )
          .slice(0, 4);
        setRelatedArticles(related);

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
          <div className="container mx-auto px-4 sm:px-6 text-center">
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
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="font-lora text-muted-foreground mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link to="/real-estate-guide-orchid-island-marrakech">
              <Button variant="default">
                <ArrowLeft className="w-4 h-4 mr-2" />
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
    "url": `https://orchidisland.immo/real-estate-guide-orchid-island-marrakech/${article.slug || article._id}`,
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Orchid Immobilier",
      "url": "https://orchidisland.immo"
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
      <Header />
      <main>

        {/* ── Article Header ── */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">

            <Link
              to="/real-estate-guide-orchid-island-marrakech"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6 sm:mb-8 transition-colors duration-300 font-playfair"
            >
              <ArrowLeft className="w-4 h-4 mr-2 shrink-0" />
              Back to Blog
            </Link>

            <div className="font-lora max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>

              {/* Title : taille réduite sur mobile */}
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Meta : empilé sur très petit écran */}
              <div className="font-lora flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
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
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>{article.readTime}</span>
                  </div>
                )}
              </div>

              <div className="font-lora flex items-center justify-center mb-6 sm:mb-8">
                <ShareButton />
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content + Sidebar ── */}
        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">

                {/* ── Article Content ── */}
                <div className="flex-1 min-w-0">

                  {/* Hero Image */}
                  <div className="mb-8 sm:mb-12">
                    <img
                      src={getCloudinaryUrl(article.image, 800, 600) || "/fallback.jpg"}
                      alt={article.title}
                      className="w-full h-52 sm:h-72 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Article body — prose responsive */}
                  <article
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-foreground/90 leading-relaxed
                               prose-headings:font-playfair prose-headings:text-foreground
                               prose-img:rounded-lg prose-img:w-full"
                    dangerouslySetInnerHTML={{ __html: fixImgSrc(article.content) }}
                  />
                </div>

                {/* ── Right Sidebar ── */}
                {/* Sur mobile/tablet la sidebar passe SOUS le contenu ;
                    sur desktop elle reste collante à droite */}
                <aside className="w-full lg:w-72 xl:w-80 lg:shrink-0 lg:sticky lg:top-8 lg:self-start">
                  <div className="space-y-6">

                    {/* Article Info Card — masquée sur mobile (image déjà visible en hero) */}
                    <Card className="hidden lg:block border-border shadow-lg">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <img
                            src={getCloudinaryUrl(article.image, 800, 600) || "/fallback.jpg"}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="font-lora absolute top-4 left-4">
                            <Badge variant="secondary">{article.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h3 className="font-playfair text-lg font-bold text-foreground mb-4 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-3 text-primary shrink-0" />
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
                              <Clock className="w-4 h-4 mr-3 text-primary shrink-0" />
                              <span>{article.readTime}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    {recentArticles.length > 0 && (
                      <Card className="border-border shadow-lg">
                        <CardHeader className="pb-2">
                          <h3 className="font-playfair text-lg font-semibold text-foreground">
                            Recent Articles
                          </h3>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="space-y-3">
                            {recentArticles.map((recent) => (
                              <Link
                                key={recent._id}
                                to={articlePath(recent)}
                                className="block group"
                              >
                                <div className="flex gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                  <img
                                    src={getCloudinaryUrl(recent.image, 160, 160) || "/fallback.jpg"}
                                    alt={recent.title}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-playfair font-medium text-sm text-foreground group-hover:text-primary line-clamp-2 mb-1 leading-snug">
                                      {recent.title}
                                    </h4>
                                    <div className="font-lora flex items-center text-xs text-muted-foreground">
                                      <Calendar className="w-3 h-3 mr-1 shrink-0" />
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

        {/* ── Social Sharing ── */}
        <section className="py-8 sm:py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-playfair text-lg font-bold text-foreground mb-4">
                Share this article
              </h3>
              <ShareButton />
            </div>
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="py-16 sm:py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

              <div className="text-center mb-8 sm:mb-10">
                <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Articles in the same category
                </h2>
                <p className="font-lora text-base sm:text-lg text-muted-foreground">
                  Discover other relevant content.
                </p>
              </div>

              {relatedArticles.length > 0 && (
                /* Wrapper : marge latérale pour laisser de la place aux flèches sur md+ */
                <div className="mb-8 md:px-12">
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {relatedArticles.map((relatedArticle) => (
                        <CarouselItem
                          key={relatedArticle._id}
                          /* 1 colonne mobile, 2 tablette, 3 desktop */
                          className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <Link to={articlePath(relatedArticle)}>
                            <Card className="h-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                              <CardHeader className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg">
                                  <img
                                    src={getCloudinaryUrl(relatedArticle.image, 400, 300) || "/fallback.jpg"}
                                    alt={relatedArticle.title}
                                    className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="font-lora absolute top-4 left-4">
                                    <Badge variant="secondary">
                                      {relatedArticle.category}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 sm:p-6">
                                <h3 className="font-playfair text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                  {relatedArticle.title}
                                </h3>
                                <p className="font-lora text-sm sm:text-base text-muted-foreground line-clamp-3">
                                  {relatedArticle.excerpt}
                                </p>
                              </CardContent>
                              <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                              </CardFooter>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Flèches : visibles à partir de md, positionnées DANS le wrapper px-12 */}
                    <CarouselPrevious className="hidden md:flex left-0 bg-background border-border shadow-lg hover:bg-muted" />
                    <CarouselNext className="hidden md:flex right-0 bg-background border-border shadow-lg hover:bg-muted" />
                  </Carousel>
                </div>
              )}

              <div className="font-lora text-center mt-8 sm:mt-12">
                <Link to="/real-estate-guide-orchid-island-marrakech">
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
      <Footer />
    </div>
  );
};

export default ArticleDetail;
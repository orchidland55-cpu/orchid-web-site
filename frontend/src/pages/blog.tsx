import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Article } from "@/services/api";
import {
  Calendar,
  ArrowRight,
  Eye,
  MessageCircle,
  Share2,
  TrendingUp,
  Home,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShareButton from "@/components/ShareButton";
import { getCloudinaryUrl } from "@/services/cloudinary";

// ---------------------------------------------------------------------------
// Helper : slug si disponible, sinon _id (rétrocompatibilité)
// ---------------------------------------------------------------------------
const articlePath = (id: string, slug?: string) =>
  `/blog/${slug || id}`;

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAllArticles();
        const publishedArticles = data.filter(article => article.status === 'published');
        setArticles(publishedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Error loading articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const blogPosts = articles.map(article => ({
    id: article._id,
    slug: article.slug,           // ✅ slug inclus
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: new Date(article.createdAt).toLocaleDateString('en-US'),
    createdAt: article.createdAt,
    views: article.views?.toString() || "0",
    comments: article.comments || 0,
    category: article.category,
    image: article.image || "/api/placeholder/800/400",
    featured: article.featured || false
  }));

  const dynamicCategories = Array.from(
    new Set(articles.map(article => article.category).filter(Boolean))
  ).sort();

  const categories = ["All Posts", ...dynamicCategories];

  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory === "All Posts") return true;
    return post.category === selectedCategory;
  });

  const nonFeaturedPosts = filteredPosts
    .filter(post => !post.featured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(nonFeaturedPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = nonFeaturedPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const latestSection = document.getElementById('latest-articles');
    if (latestSection) {
      latestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const siblingCount = 1;
    const pageNumbers: (number | string)[] = [];

    pageNumbers.push(1);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = 3 + 2 * siblingCount;
      for (let i = 2; i <= Math.min(leftRange, totalPages - 1); i++) pageNumbers.push(i);
      if (totalPages > leftRange + 1) pageNumbers.push('...');
    } else if (showLeftDots && !showRightDots) {
      pageNumbers.push('...');
      const rightRange = 3 + 2 * siblingCount;
      for (let i = Math.max(totalPages - rightRange, 2); i <= totalPages - 1; i++) pageNumbers.push(i);
    } else if (showLeftDots && showRightDots) {
      pageNumbers.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pageNumbers.push(i);
      pageNumbers.push('...');
    } else {
      for (let i = 2; i <= totalPages - 1; i++) pageNumbers.push(i);
    }

    if (totalPages > 1) pageNumbers.push(totalPages);

    return (
      <div className="flex flex-col items-center space-y-4 mt-12">
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-w-[90px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === '...') {
                return (
                  <span key={`dots-${index}`} className="px-3 text-muted-foreground">
                    ...
                  </span>
                );
              }
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "luxury" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber as number)}
                  className={`min-w-[40px] ${currentPage === pageNumber ? "text-white" : ""}`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="min-w-[90px]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground font-lora">
          Page {currentPage} of {totalPages} • Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, nonFeaturedPosts.length)} of {nonFeaturedPosts.length} articles
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Building className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">Loading articles...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-6 luxury-gradient text-primary-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real Estate Insights
              </Badge>
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
                Luxury Real Estate
                <span className="luxury-gradient bg-clip-text text-transparent"> Blog</span>
              </h1>
              <p className="font-lora text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay informed with the latest trends, insights, and expert analysis in luxury real estate markets.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-6">
            <div className="font-lora flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "luxury" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {filteredPosts.filter(post => post.featured).map((post) => (
          <section key={post.id} className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="font-lora text-center mb-8">
                <Badge variant="default" className="luxury-gradient text-primary-foreground">
                  Featured Article
                </Badge>
              </div>
              <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={getCloudinaryUrl(post.image, 800, 600)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="font-lora w-fit mb-4">
                      {post.category}
                    </Badge>
                    <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {post.title}
                    </h2>
                    <p className="font-lora text-muted-foreground mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    {/* ✅ Lien avec slug */}
                    <Link to={articlePath(post.id, post.slug)}>
                      <Button variant="luxury" className="w-fit">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        ))}

        {/* Blog Posts Grid */}
        <section id="latest-articles" className="py-20 bg-cream/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Articles
              </h2>
              <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert insights and market analysis from our team of real estate professionals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                /* ✅ Lien avec slug */
                <Link key={post.id} to={articlePath(post.id, post.slug)}>
                  <Card className="group hover:shadow-luxury transition-all duration-300 overflow-hidden h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getCloudinaryUrl(post.image, 800, 600)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="font-lora p-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="font-playfair text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-lora text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <ShareButton showText={false} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {renderPagination()}

            {nonFeaturedPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="font-lora text-muted-foreground">No articles in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
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
  Building
} from "lucide-react";
import ShareButton from "@/components/ShareButton";

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts"); // ✅ New state

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

  // ✅ Transform articles for display
  const blogPosts = articles.map(article => ({
    id: article._id,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: new Date(article.createdAt).toLocaleDateString('en-US'),
    views: article.views?.toString() || "0",
    comments: article.comments || 0,
    category: article.category, // Must match values in `categories`
    image: article.image || "/api/placeholder/800/400",
    featured: article.featured || false
  }));

  // ✅ List of displayed categories
  const categories = [
    "All Posts",
    "Market Analysis",
    "Investment",
    "Location Spotlight",
    "Sustainability",
    "Technology",
    "Global Markets"
  ];

  // ✅ Dynamic filtering
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory === "All Posts") return true;
    return post.category === selectedCategory; // ✅ Ensure `post.category` matches exactly
  });

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
                  key={category} // ✅ Use category as key
                  variant={selectedCategory === category ? "luxury" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)} // ✅ Click handler
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
                      src={post.image}
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
                    <Link to={`/blog/${post.id}`}>
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
        <section className="py-20 bg-cream/30">
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
              {filteredPosts.filter(post => !post.featured).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="group hover:shadow-luxury transition-all duration-300 overflow-hidden h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
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

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        {/* Author removed */}
                      </div>

                      <div className="flex items-center justify-between">
                        <ShareButton showText={false} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredPosts.filter(post => !post.featured).length === 0 && (
              <div className="text-center py-12">
                <p className="font-lora text-muted-foreground">No articles in this category.</p>
              </div>
            )}

            <div className="font-lora text-center mt-12">
              <Button variant="elegant" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
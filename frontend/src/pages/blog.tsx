import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import blog0 from "@/assets/blog0.jpg";
import blog1 from "@/assets/blog1.jpg";
import blog2 from "@/assets/blog2.jpg";
import blog3 from "@/assets/blog3.jpg";
import blog4 from "@/assets/blog4.jpg";
import blog5 from "@/assets/blog5.jpg";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Eye,
  MessageCircle,
  Share2,
  TrendingUp,
  Home,
  Building
} from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Luxury Real Estate Market Trends 2024",
      excerpt: "Discover the latest trends shaping the luxury real estate market and what investors should know.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      views: "2.1k",
      comments: 24,
      category: "Market Analysis",
      image: blog0,
      featured: true
    },
    {
      id: 2,
      title: "Investment Strategies for Premium Properties",
      excerpt: "Learn proven strategies for maximizing returns on luxury property investments.",
      author: "Michael Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      views: "1.8k",
      comments: 18,
      category: "Investment",
      image: blog1,
    },
    {
      id: 3,
      title: "Orchid Island: A Paradise for Investors",
      excerpt: "Explore why Orchid Island has become the premier destination for luxury real estate investment.",
      author: "Emma Rodriguez",
      date: "March 10, 2024",
      readTime: "6 min read",
      views: "3.2k",
      comments: 35,
      category: "Location Spotlight",
      image: blog2,
    },
    {
      id: 4,
      title: "Sustainable Luxury: Eco-Friendly Properties",
      excerpt: "How sustainable design is revolutionizing the luxury real estate market.",
      author: "David Park",
      date: "March 8, 2024",
      readTime: "4 min read",
      views: "1.5k",
      comments: 12,
      category: "Sustainability",
      image: blog3,
    },
    {
      id: 5,
      title: "Technology in Modern Luxury Homes",
      excerpt: "Smart home technology trends that are defining luxury living in 2024.",
      author: "Lisa Wang",
      date: "March 5, 2024",
      readTime: "8 min read",
      views: "2.7k",
      comments: 28,
      category: "Technology",
      image: blog4,
    },
    {
      id: 6,
      title: "Global Luxury Markets: Opportunities Abroad",
      excerpt: "International luxury real estate markets offering exceptional investment potential.",
      author: "James Thompson",
      date: "March 3, 2024",
      readTime: "6 min read",
      views: "1.9k",
      comments: 21,
      category: "Global Markets",
      image: blog5,
    }
  ];

  const categories = [
    "All Posts",
    "Market Analysis",
    "Investment",
    "Location Spotlight",
    "Sustainability",
    "Technology",
    "Global Markets"
  ];

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
              <h1 className=" font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
                Luxury Real Estate
                <span className="luxury-gradient bg-clip-text text-transparent"> Blog</span>
              </h1>
              <p className="foont-lora text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay informed with the latest trends, insights, and expert analysis in luxury real estate markets.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-6">
            <div className="font-lora flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "luxury" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <section key={post.id} className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="font-lora text-center mb-8">
                <Badge variant="default" className=" luxury-gradient text-primary-foreground">
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
                  <CardContent className=" p-8 flex flex-col justify-center">
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
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
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
              {blogPosts.filter(post => !post.featured).map((post) => (
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
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>

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

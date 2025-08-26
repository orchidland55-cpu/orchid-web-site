import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import blog0 from "@/assets/blog0.jpg";
import blog1 from "@/assets/blog1.jpg";
import blog2 from "@/assets/blog2.jpg";
import blog3 from "@/assets/blog3.jpg";
import blog4 from "@/assets/blog4.jpg";
import blog5 from "@/assets/blog5.jpg";
import blog1y from "@/assets/blog1y.jpg";
import blog2y from "@/assets/blog2y.jpg";
import blog3y from "@/assets/blog3y.jpg";
import blog4y from "@/assets/blog4y.jpg";
import blog1a from "@/assets/blog1a.jpg";
import blog1b from "@/assets/blog1b.jpg";
import blog1c from "@/assets/blog1c.jpg";
import blog1d from "@/assets/blog1d.jpg";
import blog2a from "@/assets/blog2a.jpg";
import blog2b from "@/assets/blog2b.jpg";
import blog2c from "@/assets/blog2c.jpg";
import blog2d from "@/assets/blog2d.jpg";
import blog3a from "@/assets/blog3a.jpg";
import blog3b from "@/assets/blog3b.jpg";
import blog3c from "@/assets/blog3c.jpg";
import blog3d from "@/assets/blog3d.jpg";
import blog4a from "@/assets/blog4a.jpg";
import blog4b from "@/assets/blog4b.jpg";
import blog4c from "@/assets/blog4c.jpg";
import blog4d from "@/assets/blog4d.jpg";
import blog5a from "@/assets/blog5a.jpg";
import blog5b from "@/assets/blog5b.jpg";
import blog5c from "@/assets/blog5c.jpg";
import blog5d from "@/assets/blog5d.jpg";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight
} from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams();

  // Sample related articles data
  const relatedArticles = [
    {
      id: "2",
      title: "Smart Home Technology in Luxury Properties",
      excerpt: "Discover how cutting-edge technology is reshaping luxury living experiences...",
      author: "Michael Chen",
      date: "March 12, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: blog2
    },
    {
      id: "3", 
      title: "Investment Strategies for High-End Real Estate",
      excerpt: "Expert insights on maximizing returns in the luxury property market...",
      author: "Emily Rodriguez",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Investment",
      image: blog3
    },
    {
      id: "4",
      title: "Sustainable Luxury: Green Building Trends",
      excerpt: "How eco-friendly features are becoming essential in luxury developments...",
      author: "David Thompson",
      date: "March 8, 2024", 
      readTime: "5 min read",
      category: "Sustainability",
      image: blog4
    },
    {
      id: "5",
      title: "Global Luxury Markets: Asia Pacific Rising",
      excerpt: "Exploring emerging luxury real estate opportunities in Asia Pacific...",
      author: "Lisa Zhang",
      date: "March 5, 2024",
      readTime: "7 min read", 
      category: "Global Markets",
      image: blog5
    },
    {
      id: "6",
      title: "The Future of Luxury: Virtual Reality Tours",
      excerpt: "How VR technology is revolutionizing property viewing experiences...",
      author: "James Wilson",
      date: "March 3, 2024",
      readTime: "4 min read",
      category: "Technology", 
      image: blog0
    }
  ];

  // Sample article data with sections for alternating layout
  const articles = {
    
  "1": {
    title: "Luxury Real Estate Market Trends 2024",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    views: "2.1k",
    comments: 24,
    category: "Market Analysis",
    image: blog1,
    sections: [
      {
        title: "Market Overview",
        content: "The global luxury real estate market has shown remarkable resilience, with prime properties in key markets appreciating by an average of 8-12% year-over-year. This growth is particularly pronounced in emerging luxury destinations and established premium locations.",
        image: blog1y
      },
      {
        title: "Sustainable Luxury Trend",
        content: "High-net-worth individuals are increasingly seeking properties that combine opulence with sustainability. Features like solar panels, smart home technology, and eco-friendly materials are becoming standard expectations.",
        image: blog2y
      },
      {
        title: "Remote Work Revolution",
        content: "The shift towards remote and hybrid work models has fundamentally changed what buyers seek in luxury properties. Home offices and high-speed connectivity are now essential.",
        image: blog3y
      },
      {
        title: "Investment Opportunities",
        content: "Emerging markets in Southeast Asia and Latin America are showing strong potential, while traditional luxury markets like Monaco, Manhattan, and London offer stability and prestige.",
        image: blog4y
      }
    ],
    tags: ["Market Analysis", "Investment", "Luxury Properties", "2024 Trends"]
  },
  "2": {
    title: "Investment Strategies for Premium Properties",
    author: "Michael Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    views: "1.8k",
    comments: 18,
    category: "Investment",
    image: blog2,
    sections: [
      {
        title: "High-Yield Locations",
        content: "Identify regions with high demand for luxury rentals or resale potential. Prime cities consistently outperform secondary markets in ROI.",
        image: blog2a
      },
      {
        title: "Portfolio Diversification",
        content: "Mix residential and commercial luxury assets to balance risk. International properties can hedge against local market fluctuations.",
        image: blog2b
      },
      {
        title: "Value-Add Opportunities",
        content: "Renovation and premium upgrades increase both property value and rental yield. Focus on bespoke features that appeal to high-net-worth buyers.",
        image: blog2c
      },
      {
        title: "Tax & Legal Strategies",
        content: "Leverage tax-efficient structures and understand local regulations to maximize investment returns and protect assets.",
        image: blog2d
      }
    ],
    tags: ["Investment", "Luxury Properties", "ROI", "Portfolio Management"]
  },
  "3": {
    title: "Orchid Island: A Paradise for Investors",
    author: "Emma Rodriguez",
    date: "March 10, 2024",
    readTime: "6 min read",
    views: "3.2k",
    comments: 35,
    category: "Location Spotlight",
    image: blog3,
    sections: [
      {
        title: "Prime Waterfront Properties",
        content: "Orchid Island offers exclusive waterfront villas that attract both domestic and international buyers seeking prestige and privacy.",
        image: blog3a
      },
      {
        title: "High-End Amenities",
        content: "Luxury communities with world-class amenities including private marinas, golf courses, and spa facilities make it a prime destination.",
        image: blog3b
      },
      {
        title: "Growing Market Appeal",
        content: "Rising demand from investors seeking emerging luxury destinations is boosting property values year-on-year.",
        image: blog3c
      },
      {
        title: "Sustainable Development",
        content: "Eco-conscious projects and green building initiatives appeal to modern buyers, aligning luxury with responsibility.",
        image: blog3d
      }
    ],
    tags: ["Location Spotlight", "Luxury Real Estate", "Waterfront", "Investment"]
  },
  "4": {
    title: "Sustainable Luxury: Eco-Friendly Properties",
    author: "David Park",
    date: "March 8, 2024",
    readTime: "4 min read",
    views: "1.5k",
    comments: 12,
    category: "Sustainability",
    image: blog4,
    sections: [
      {
        title: "Green Architecture",
        content: "Innovative architectural designs reduce environmental impact while maintaining premium aesthetics and comfort.",
        image: blog4a
      },
      {
        title: "Energy Efficiency",
        content: "Solar energy, heat recovery systems, and efficient appliances are now expected in high-end luxury properties.",
        image: blog4b
      },
      {
        title: "Eco-Luxury Interiors",
        content: "Sustainable materials, non-toxic finishes, and locally sourced designs enhance both style and environmental responsibility.",
        image: blog4c
      },
      {
        title: "Market Demand",
        content: "Buyers increasingly prioritize eco-friendly homes, making sustainability a key differentiator in luxury markets.",
        image: blog4d
      }
    ],
    tags: ["Sustainability", "Luxury Homes", "Green Design", "Eco-Friendly"]
  },
  "5": {
    title: "Technology in Modern Luxury Homes",
    author: "Lisa Wang",
    date: "March 5, 2024",
    readTime: "8 min read",
    views: "2.7k",
    comments: 28,
    category: "Technology",
    image: blog5,
    sections: [
      {
        title: "Smart Home Integration",
        content: "Automation systems control lighting, security, climate, and entertainment for a seamless luxury experience.",
        image: blog5a
      },
      {
        title: "AI Assistants",
        content: "Voice and AI-driven assistants improve convenience, energy efficiency, and security in modern high-end residences.",
        image: blog5b
      },
      {
        title: "Luxury Home Networking",
        content: "High-speed internet and advanced networking solutions are essential for modern remote work and smart home systems.",
        image: blog5c
      },
      {
        title: "Future Trends",
        content: "Integration of VR/AR tours, AI property management, and predictive maintenance are shaping the future of luxury real estate.",
        image: blog5d
      }
    ],
    tags: ["Technology", "Smart Homes", "Luxury Living", "Innovation"]
}

  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="font-lora text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Article Header */}
        <section className="py-12">
          <div className="font-playfair container mx-auto px-6">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="font-lora max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>
              
              <h1 className="font-playfair text-4xl md:text-5xl font-bold  text-foreground mb-6">
                {article.title}
              </h1>
              
              <div className="font-lora flex flex-wrap items-center justify-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="font-lora flex items-center justify-center space-x-4 mb-8">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="font-playfair max-w-6xl mx-auto">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Alternating Content Sections */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-20">
              {article.sections.map((section, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Image - Left on even indexes, Right on odd indexes */}
                  <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  
                  {/* Content - Right on even indexes, Left on odd indexes */}
                  <div className={`space-y-6 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <p className="font-lora text-lg text-foreground/90 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Article Footer */}

        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Tags */}
              <div className="mb-8">
                <h3 className="font-playfair text-lg font-bold text-foreground mb-4">Tags</h3>
                <div className="font-lora flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Share */}
              <div className="pt-8 border-t border-border">
                <h3 className="font-playfair text-lg font-bold text-foreground mb-4">Share this article</h3>
                <div className="font-lora  flex flex-wrap gap-4">
                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles Slider */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
                Related Articles
              </h2>
              <p className="font-lora text-lg text-muted-foreground">
                Continue reading our latest insights
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {relatedArticles.map((relatedArticle) => (
                    <CarouselItem key={relatedArticle.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Link to={`/blog/${relatedArticle.id}`}>
                        <Card className="h-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                          <CardHeader className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={relatedArticle.image}
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
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{relatedArticle.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{relatedArticle.readTime}</span>
                                </div>
                              </div>
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
            
            <div className="font-lora text-center mt-12">
              <Link to="/blog">
                <Button variant="default" size="lg">
                  View All Articles
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArticleDetail;
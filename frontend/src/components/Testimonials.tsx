import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Benali",
    role: "Real Estate Investor",
    location: "Casablanca",
    content: "Orchid Island exceeded all my expectations. Their expertise and professionalism helped me find the property of my dreams. A truly high-end service.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: "Mohamed Malainine",
    role: "Locak Guide",
    location: "Rabat", 
    content: "Excellent experience with Orchid Island Real Estate! The team is highly professional, responsive, and truly attentive to client needs. They guided me throughout the entire process with transparency and efficiency. The properties offered are of great quality and perfectly matched my expectations. I highly recommend them for anyone looking for real estate in Marrakech.",
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    name: "Salma Bouhlal",
    role: "Client",
    location: "Marrakech",
    content: "I had a great experience with Orchid Island Real Estate. The team is professional, responsive, and truly attentive to clients needs. They supported me throughout the entire process with transparency and efficiency, which made everything smooth and stress-free. I highly recommend their services to anyone looking for a reliable and trustworthy real estate agency. Thank you again for the excellent support!",
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: "Hiba",
    role: "International Consultant",
    location: "Tanger",
    content: "I purchased a property in Marrakech with the help of Orchid Island Real Estate, and I had a fantastic experience with them. Professional team, smooth process, and excellent expertise in luxury properties. I highly recommend them!",
    rating: 5,
    featured: false,
  },
  {
    id: 5,
    name: "JIHADE GHARBY",
    role: "Retired",
    location: "Agadir",
    content: "An exceptional experience with Orchid Island! The team is incredibly professional, welcoming, and dedicated. It’s rare to find such a high standard of quality and innovation in Marrakech. Highly recommended!",
    rating: 5,
    featured: false,
  },
  {
    id: 6,
    name: "Edris",
    role: "Architect",
    location: "Fès",
    content: "From my very first conversation with Mr. Dekkak and the Orchid Island Real Estate agency, the firm demonstrated exceptional professionalism and provided unwavering support at every stage.",
    rating: 5,
    featured: false,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 deep-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-ivory-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-ivory-white font-inter text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-ivory-white mb-6">
            What our <span className="luxury-gradient bg-clip-text text-transparent">customers</span> say 
          </h2>
          <p className="font-lora text-lg text-ivory-white/80 max-w-2xl mx-auto">
            Our clients’ satisfaction is our greatest reward.
            Discover their experiences with Orchid Island.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className={`group overflow-hidden transition-luxury border-0 hover:-translate-y-2 ${
                testimonial.featured 
                  ? 'bg-ivory-white shadow-luxury' 
                  : 'bg-ivory-white/10 backdrop-blur-sm border border-ivory-white/20 shadow-elegant hover:shadow-luxury'
              }`}
            >
              <CardContent className="p-8 relative">
                <Quote className={`w-12 h-12 mb-6 ${
                  testimonial.featured ? 'text-primary' : 'text-ivory-white/60'
                }`} />
                
                <p className={`font-lora leading-relaxed mb-6 ${
                  testimonial.featured ? 'text-charcoal' : 'text-ivory-white/90'
                }`}>
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-current" />
                  ))}
                </div>
                
                <div className="border-t border-border pt-6">
                  <p className={`font-playfair font-semibold mb-1 ${
                    testimonial.featured ? 'text-charcoal' : 'text-ivory-white'
                  }`}>
                    {testimonial.name}
                  </p>
                  <p className={`font-lora text-sm ${
                    testimonial.featured ? 'text-muted-foreground' : 'text-ivory-white/70'
                  }`}>
                    {testimonial.role}
                  </p>
                  <p className={`font-lora text-xs ${
                    testimonial.featured ? 'text-muted-foreground' : 'text-ivory-white/60'
                  }`}>
                    {testimonial.location}
                  </p>
                </div>
                
                {testimonial.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 luxury-gradient rounded-full"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center px-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 bg-ivory-white/10 backdrop-blur-sm rounded-2xl sm:rounded-full px-6 py-4 max-w-full">
    
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary fill-current" />
              <span className="font-lora text-ivory-white font-medium">4.9/5</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-ivory-white/30"></div>

            <div className="flex items-center space-x-2">
              <span className="font-lora text-ivory-white font-medium">200+ Customer Reviews</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-ivory-white/30"></div>

            <div className="flex items-center space-x-2">
              <span className="font-lora text-ivory-white font-medium">98% Recommendation</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
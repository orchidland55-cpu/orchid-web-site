import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Benali",
    role: "Investisseur Immobilier",
    location: "Casablanca",
    content: "Orchid Island a dépassé toutes mes attentes. Leur expertise et leur professionnalisme m'ont permis de trouver la propriété de mes rêves. Un service véritablement haut de gamme.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: "Sophie Dubois",
    role: "Entrepreneuse",
    location: "Rabat", 
    content: "L'équipe d'Orchid Island comprend parfaitement les besoins des clients internationaux. Leur accompagnement personnalisé a rendu notre acquisition simple et sécurisée.",
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    name: "Omar El Fassi",
    role: "Directeur Financier",
    location: "Marrakech",
    content: "Une agence qui porte bien son nom - véritablement exclusive. Chaque propriété présentée était d'un niveau exceptionnel. The Address You'll Always Remember.",
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: "Fatima Zahra",
    role: "Consultante International",
    location: "Tanger",
    content: "Un service d'exception du premier contact à la signature. L'équipe a su comprendre mes critères très spécifiques et m'a proposé des biens parfaitement adaptés à mes besoins.",
    rating: 5,
    featured: false,
  },
  {
    id: 5,
    name: "Jean-Pierre Martin",
    role: "Retraité",
    location: "Agadir",
    content: "Après avoir visité plusieurs agences, Orchid Island s'est démarquée par son professionnalisme et sa connaissance approfondie du marché de luxe marocain.",
    rating: 5,
    featured: false,
  },
  {
    id: 6,
    name: "Yasmine Tabet",
    role: "Architecte",
    location: "Fès",
    content: "Une expérience remarquable. L'attention portée aux détails et la qualité du service client sont vraiment exceptionnelles. Je recommande vivement Orchid Island.",
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
            <span className="text-ivory-white font-inter text-sm font-medium">Témoignages</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-ivory-white mb-6">
            Ce que disent nos <span className="luxury-gradient bg-clip-text text-transparent">Clients</span>
          </h2>
          <p className="font-lora text-lg text-ivory-white/80 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus belle récompense. 
            Découvrez leurs expériences avec Orchid Island.
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
                  <h4 className={`font-playfair font-semibold mb-1 ${
                    testimonial.featured ? 'text-charcoal' : 'text-ivory-white'
                  }`}>
                    {testimonial.name}
                  </h4>
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
        <div className="text-center">
          <div className="inline-flex items-center space-x-8 bg-ivory-white/10 backdrop-blur-sm rounded-full px-8 py-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary fill-current" />
              <span className="font-lora text-ivory-white font-medium">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-ivory-white/30"></div>
            <div className="flex items-center space-x-2">
              <span className="font-lora text-ivory-white font-medium">200+ Avis Clients</span>
            </div>
            <div className="w-px h-6 bg-ivory-white/30"></div>
            <div className="flex items-center space-x-2">
              <span className="font-lora text-ivory-white font-medium">98% Recommandation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
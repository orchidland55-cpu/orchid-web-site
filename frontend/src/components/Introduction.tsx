import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import imagetest from "@/assets/hero-villa.jpg";
import {
  Award,
  Users,
  MapPin,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

const Introduction = () => {
  const achievements = [
    {
      icon: Building,
      number: "500+",
      label: "Propriétés Vendues",
      description: "Transactions réussies"
    },
    {
      icon: Users,
      number: "1000+",
      label: "Clients Satisfaits",
      description: "Depuis notre création"
    },
    {
      icon: Award,
      number: "15+",
      label: "Années d'Expérience",
      description: "Dans l'immobilier de luxe"
    },
    {
      icon: MapPin,
      number: "8",
      label: "Villes Couvertes",
      description: "À travers le Maroc"
    }
  ];

  const features = [
    "Expertise reconnue dans l'immobilier de luxe",
    "Accompagnement personnalisé de A à Z",
    "Réseau exclusif de propriétés premium",
    "Service client disponible 24h/7j",
    "Conseils en investissement immobilier",
    "Processus transparent et sécurisé"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-luxury">
              <img
                src={imagetest}
                alt="Orchid Island - Immobilier de luxe au Maroc"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay Badge */}
              

              {/* Floating Stats Card */}
              
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 luxury-gradient rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full opacity-30 blur-xl"></div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
               <div className="pt-6 border-t border-border">
             
            </div>
              <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-lora text-primary font-medium">À Propos de Nous</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
                Votre Partenaire de Confiance en{" "}
                <span className="luxury-gradient bg-clip-text text-transparent">
                  Immobilier de Luxe
                </span>
              </h2>
              
              <p className="font-lora text-xl text-muted-foreground leading-relaxed mb-8">
                Depuis plus de 15 ans, Orchid Island accompagne une clientèle exigeante 
                dans la recherche et l'acquisition de propriétés d'exception au Maroc. 
                Notre expertise et notre réseau exclusif font de nous le leader de 
                l'immobilier de prestige.
              </p>
            </div>

            {/* Features List */}
           

            {/* Achievements Grid */}
            

            {/* Call to Actions */}
           

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-border">
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;

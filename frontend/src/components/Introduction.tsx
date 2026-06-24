import csrHero from "@/assets/property-1.webp";
import { Award, Users, Building } from "lucide-react";


const Introduction = () => {
  const achievements = [
    {
      icon: Building,
      number: "500+",
      label: "Properties Sold",
      description: "Successful Transactions"
    },
    {
      icon: Users,
      number: "98%",
      label: "Satisfied clients",
      description: "Since our creation"
    },
    {
      icon: Award,
      number: "15+",
      label: "Years of experience",
      description: "In luxury real estate"
    },
    {
      icon: Users,
      number: "85+",
      label: "Trusted partners",
      description: "Across Morocco"
    }
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
                src="https://res.cloudinary.com/drgg2rocc/image/upload/v1782205023/aboutsec_nr0krk.jpg"
                alt="Orchid Island - Immobilier de luxe au Maroc"
                className="w-full h-[500px] object-cover"
                loading="lazy"
                decoding="async"
                width={800}
                height={500}
              />                            
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
                <span className="font-lora text-primary font-medium">About Us</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
                Your Trusted Partner in{" "}
                <span className="luxury-gradient bg-clip-text text-transparent">
                  Luxury Real Estate
                </span>
              </h2>
              
              <p className="font-lora text-xl text-muted-foreground leading-relaxed mb-8">
                For over 15 years, Orchid Island has been guiding an demanding clientele 
                in the search and acquisition of exceptional properties in Morocco. 
                Our expertise and exclusive network make us the leader in 
                luxury real estate.
              </p>
            </div>         

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                {achievements.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{item.number}</h3>
                      <p className="font-lora text-lg font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;

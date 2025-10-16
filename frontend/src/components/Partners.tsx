const Partners = () => {
  const partners = [
    {
      name: "Sotheby's International Realty",
      description: "Global network for luxury real estate",
    },
    {
      name: "Christie's Real Estate",
      description: "International expertise in exceptional properties",
    },
    {
      name: "Engel & Völkers",
      description: "European leader in high-end real estate",
    },
    {
      name: "Banque Populaire",
      description: "Trusted financial partner",
    },
    {
      name: "BMCE Bank",
      description: "Tailored financing solutions",
    },
    {
      name: "Attijariwafa Bank",
      description: "Personalized wealth management",
    },
    {
      name: "Knight Frank",
      description: "International prestige real estate advisory",
    },
    {
      name: "Coldwell Banker",
      description: "Premium luxury real estate network",
    },
    {
      name: "Crédit du Maroc",
      description: "High-end banking solutions",
    },
    {
      name: "Savills",
      description: "Global expertise in exceptional real estate",
    },
  ];

  return (
    <section id="partners" className="py-20 elegant-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-foreground font-lora text-sm font-bold">Strategic Partners</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="luxury-gradient bg-clip-text text-transparent">Prestige</span> Partners
          </h2>
          <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
            We collaborate with global leaders in luxury real estate and the most prestigious financial 
            institutions to offer you exceptional service.
          </p>
        </div>

        {/* Partners Grid - 5 columns, 2 rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center hover:shadow-luxury transition-luxury hover:-translate-y-2"
            >
              <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-playfair font-bold text-lg">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                {partner.name}
              </h3>
              <p className="font-lora text-sm text-muted-foreground leading-relaxed">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              50+
            </div>
            <div className="font-lora text-muted-foreground">
              International Partners
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              15+
            </div>
            <div className="font-lora text-muted-foreground">
              Years of Experience
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              500+
            </div>
            <div className="font-lora text-muted-foreground">
              Properties Sold
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              98%
            </div>
            <div className="font-lora text-muted-foreground">
              Client Satisfaction
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
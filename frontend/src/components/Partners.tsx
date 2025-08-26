const Partners = () => {
  const partners = [
    {
      name: "Sotheby's International Realty",
      description: "Réseau mondial de l'immobilier de luxe",
    },
    {
      name: "Christie's Real Estate",
      description: "Expertise internationale en propriétés d'exception",
    },
    {
      name: "Engel & Völkers",
      description: "Leader européen de l'immobilier haut de gamme",
    },
    {
      name: "Banque Populaire",
      description: "Partenaire financier de confiance",
    },
    {
      name: "BMCE Bank",
      description: "Solutions de financement sur mesure",
    },
    {
      name: "Attijariwafa Bank",
      description: "Accompagnement patrimonial personnalisé",
    },
    {
      name: "Knight Frank",
      description: "Conseil en immobilier de prestige international",
    },
    {
      name: "Coldwell Banker",
      description: "Réseau premium de l'immobilier de luxe",
    },
    {
      name: "Crédit du Maroc",
      description: "Solutions bancaires haut de gamme",
    },
    {
      name: "Savills",
      description: "Expertise mondiale en immobilier d'exception",
    },
  ];

  return (
    <section id="partners" className="py-20 elegant-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-foreground font-lora text-sm font-bold">Partenaires Stratégiques</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nos <span className="luxury-gradient bg-clip-text text-transparent">Partenaires</span> de Prestige
          </h2>
          <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous collaborons avec les leaders mondiaux de l'immobilier de luxe et les institutions financières 
            les plus prestigieuses pour vous offrir un service d'excellence.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 text-center hover:shadow-luxury transition-luxury hover:-translate-y-2"
            >
              <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-playfair font-bold text-xl">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-3">
                {partner.name}
              </h3>
              <p className="font-lora text-muted-foreground">
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
              Partenaires Internationaux
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              15+
            </div>
            <div className="font-lora text-muted-foreground">
              Années d'Expérience
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              500+
            </div>
            <div className="font-lora text-muted-foreground">
              Propriétés Vendues
            </div>
          </div>
          <div className="group">
            <div className="font-lora text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-luxury">
              98%
            </div>
            <div className="font-lora text-muted-foreground">
              Satisfaction Client
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
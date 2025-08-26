import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqData = [
  {
    id: "item-1",
    question: "Comment Orchid Island sélectionne-t-elle ses propriétés ?",
    answer: "Nous appliquons des critères stricts de sélection basés sur l'emplacement privilégié, la qualité architecturale, les finitions haut de gamme et le potentiel d'investissement. Chaque propriété est minutieusement évaluée par notre équipe d'experts.",
  },
  {
    id: "item-2",
    question: "Quels services proposez-vous aux investisseurs internationaux ?",
    answer: "Nous offrons un accompagnement complet : recherche personnalisée, analyses de marché, assistance juridique, gestion des formalités administratives, et suivi post-acquisition. Notre équipe multilingue facilite tous vos projets d'investissement au Maroc.",
  },
  {
    id: "item-3",
    question: "Quelle est la fourchette de prix des propriétés Orchid Island ?",
    answer: "Nos propriétés débutent généralement à partir de 3 millions DH et peuvent atteindre plus de 50 millions DH pour les biens d'exception. Nous proposons un portefeuille diversifié adapté à différents budgets d'investissement de luxe.",
  },
  {
    id: "item-4",
    question: "Proposez-vous des services de gestion locative ?",
    answer: "Oui, nous gérons intégralement la location de votre bien : recherche de locataires qualifiés, état des lieux, encaissement des loyers, maintenance et entretien. Notre service de conciergerie haut de gamme assure une rentabilité optimale.",
  },
  {
    id: "item-5",
    question: "Comment garantissez-vous la confidentialité des transactions ?",
    answer: "La discrétion est au cœur de notre métier. Nous respectons des protocoles stricts de confidentialité, utilisons des accords de non-divulgation systématiques et proposons des solutions juridiques adaptées pour préserver l'anonymat de nos clients VIP.",
  },
  {
    id: "item-6",
    question: "Quels sont les délais moyens pour finaliser un achat ?",
    answer: "Pour un achat comptant, la transaction peut être finalisée en 30 à 45 jours. Avec financement, comptez 60 à 90 jours selon la complexité du dossier. Notre équipe juridique accélère tous les processus administratifs.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 luxury-gradient rounded-full"></div>
            <span className="text-foreground font-lora text-sm font-bold">Questions Fréquentes</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Foire aux <span className="luxury-gradient bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus fréquemment posées sur nos services 
            et notre expertise en immobilier de luxe.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6 shadow-elegant hover:shadow-luxury transition-luxury"
              >
                <AccordionTrigger className="text-left font-playfair text-lg font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 max-w-2xl mx-auto shadow-elegant">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
              Une question spécifique ?
            </h3>
            <p className="font-lora text-muted-foreground mb-6">
              Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions 
              personnalisées sur l'immobilier de luxe au Maroc.
            </p>
            <Link to="/contact" className="bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury">
                         <button>Nous Contacter</button> 
                        </Link>
           
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
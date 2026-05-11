import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqData = [
  {
    id: "item-1",
    question: "How does Orchid Island select its properties?",
    answer: "We apply strict selection criteria based on prime location, architectural quality, premium finishes, and investment potential. Each property is carefully evaluated by our team of experts.",
  },
  {
    id: "item-2",
    question: "What services do you offer to international investors?",
    answer: "We provide comprehensive support: personalized property search, market analysis, legal assistance, administrative process management, and post-acquisition follow-up. Our multilingual team facilitates all your investment projects in Morocco.",
  },
  {
    id: "item-3",
    question: "What is the price range of Orchid Island properties?",
    answer: "Our properties generally start from 3 million MAD and can exceed 50 million MAD for exceptional estates. We offer a diverse portfolio suited to different luxury investment budgets.",
  },
  {
    id: "item-4",
    question: "Do you offer property management services?",
    answer: "Yes, we fully manage your property rentals: finding qualified tenants, property inspections, rent collection, maintenance, and upkeep. Our premium concierge service ensures optimal profitability.",
  },
  {
    id: "item-5",
    question: "How do you guarantee transaction confidentiality?",
    answer: "Discretion is at the core of our business. We follow strict confidentiality protocols, systematically use non-disclosure agreements, and provide tailored legal solutions to preserve the anonymity of our VIP clients.",
  },
  {
    id: "item-6",
    question: "What are the average timelines for completing a purchase?",
    answer: "For a cash purchase, the transaction can be completed within 30 to 45 days. With financing, expect 60 to 90 days depending on the complexity of the case. Our legal team helps accelerate all administrative processes.",
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
            <span className="text-foreground font-lora text-sm font-bold">Frequently Asked Questions</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked <span className="luxury-gradient bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="font-lora text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to the most frequently asked questions about our services and expertise in luxury real estate.
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
              A Specific Question?
            </h3>
            <p className="font-lora text-muted-foreground mb-6">
              Our team of experts is available to answer all your personalized questions 
              about luxury real estate in Morocco.
            </p>
            <Link to="/contact" className="bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury">
                         <button>Contact Us</button> 
                        </Link>
           
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
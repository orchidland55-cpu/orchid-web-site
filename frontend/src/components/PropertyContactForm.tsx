import { useState, FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

interface PropertyContactFormProps {
  propertyTitle: string;
  propertyId: string;
}

const PropertyContactForm = ({ propertyTitle, propertyId }: PropertyContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello, I am interested in the property "${propertyTitle}". Can you provide me more information? ?`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // reCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // On ajoute les champs cachés pour matcher exactement la structure de l'API
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Question about: ${propertyTitle}`, // Champ caché
        message: formData.message,
        propertyType: "Property Inquiry" // Champ caché
      };

      const response = await fetch('https://orchid-web-site-production-1f73.up.railway.app/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage("Message sent successfully! We'll get back to you soon.");
        setSubmitSuccess(true);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Bonjour, je suis intéressé(e) par la propriété "${propertyTitle}" (Réf: ${propertyId}). Pouvez-vous me fournir plus d'informations ?`,
        });
        
        // Reset reCAPTCHA
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        
      } else {
        const error = await response.json();

        // If it's just an email issue, but data is saved
        if (error.details && error.details.includes('Invalid login')) {
          setSubmitMessage("Your message has been received! (Email temporarily unavailable)");
          setSubmitSuccess(true);

          // Reset form since data is saved
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: `Bonjour, je suis intéressé(e) par la propriété "${propertyTitle}" (Réf: ${propertyId}). Pouvez-vous me fournir plus d'informations ?`,
          });
          
          // Reset reCAPTCHA
          recaptchaRef.current?.reset();
          setRecaptchaToken(null);
        } else {
          setSubmitMessage("Error sending message. Please try again.");
          setSubmitSuccess(false);
        }
      }
    } catch (error) {
      setSubmitMessage("Connection error. Please try again later.");
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/10">
      <CardContent className="p-4 sm:p-6">
        {/* En-tête */}
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Ask About This Property</h3>
        </div>

        {/* Message de succès */}
        {submitSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Message Sent!</p>
            <p className="text-xs text-muted-foreground mb-4">
              We'll respond to you as soon as possible.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSubmitSuccess(false);
                setSubmitMessage("");
              }}
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          /* Formulaire */
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-10 text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-10 text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-10 text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Textarea
                name="message"
                placeholder="Your message or questions about this property..."
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="text-sm resize-none"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Message de statut */}
            {submitMessage && (
              <div className={`p-3 rounded-md text-sm ${
                submitMessage.includes('success') || submitMessage.includes('received')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  {submitMessage.includes('success') || submitMessage.includes('received') ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{submitMessage}</span>
                </div>
              </div>
            )}

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
            </div>

            <Button
              type="submit"
              variant="luxury"
              size="sm"
              className="w-full"
              disabled={!recaptchaToken || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyContactForm;
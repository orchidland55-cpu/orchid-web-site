import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import orchidFooterLogo from "@/assets/logowhitepro-r.png";
import CookieSettings from "@/components/CookieSettings";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const handlePostulerClick = () => {
    navigate("/postulation");
  };

  return (
    <footer className="bg-charcoal text-ivory-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src={orchidFooterLogo}
                alt="Orchid Island Logo"
                className="h-16 w-auto mb-4"
              />
            </div>
            <p className="font-lora text-ivory-white/80 mb-6 leading-relaxed">
              {t('footer.brand.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
             <h4 className="font-playfair font-semibold text-xl mb-6">{t('footer.services.title')}</h4>
             <ul className="font-lora space-y-3">
               <li><a href="#" className="text-ivory-white/80 hover:text-primary transition-smooth">{t('footer.services.propertySales')}</a></li>
               <li><a href="#" className="text-ivory-white/80 hover:text-primary transition-smooth">{t('footer.services.customAcquisition')}</a></li>
               <li><a href="#" className="text-ivory-white/80 hover:text-primary transition-smooth">{t('footer.services.highEndRental')}</a></li>
               <li><a href="#" className="text-ivory-white/80 hover:text-primary transition-smooth">{t('footer.services.investmentAdvice')}</a></li>
               <li><a href="#" className="text-ivory-white/80 hover:text-primary transition-smooth">{t('footer.services.wealthManagement')}</a></li>
             </ul>
           </div>

          {/* Contact Info */}
          <div>
             <h4 className="font-playfair font-semibold text-xl mb-6">{t('footer.contact.title')}</h4>
             <div className="space-y-4 font-lora">
               <div className="font-lora flex items-start space-x-3">
                 <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-ivory-white/80">{t('footer.contact.address.line1')}</p>
                   <p className="text-ivory-white/80">{t('footer.contact.address.line2')}</p>
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <Phone className="w-5 h-5 text-primary" />
                 <p className="text-ivory-white/80">{t('footer.contact.phone')}</p>
               </div>
               <div className="flex items-center space-x-3">
                 <Mail className="w-5 h-5 text-primary" />
                 <p className="text-ivory-white/80">{t('footer.contact.email')}</p>
               </div>
             </div>
           </div>

          {/* Newsletter */}
          <div>
             <h4 className="font-playfair font-semibold text-xl mb-6">{t('footer.newsletter.title')}</h4>
             <p className="font-lora text-ivory-white/80 mb-4">
               {t('footer.newsletter.description')}
             </p>
             <form onSubmit={handleNewsletterSubmit} className="space-y-3">
               <Link to="/Postulation" className=" bg-primary hover:bg-primary/90 text-primary-foreground font-lora font-medium px-8 py-3 rounded-lg shadow-luxury hover:shadow-elegant transition-luxury">
                 <button className="font-lora text-lg px-10 h-auto font-bold text-center">{t('footer.newsletter.apply')}</button>
               </Link>
             </form>
           </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-ivory-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
             <div className="font-lora text-ivory-white/60 text-sm">
               {t('footer.bottom.copyright')}
             </div>
             <div className="flex space-x-6 font-lora text-sm">
               <a href="#" className="text-ivory-white/60 hover:text-primary transition-smooth">
                 {t('footer.bottom.privacyPolicy')}
               </a>
               <a href="#" className="text-ivory-white/60 hover:text-primary transition-smooth">
                 {t('footer.bottom.termsOfUse')}
               </a>
               <a href="#" className="text-ivory-white/60 hover:text-primary transition-smooth">
                 {t('footer.bottom.legalNotice')}
               </a>
               <CookieSettings />
             </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import orchidLogo from "@/assets/logopng.png";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <header className="bg-background/70 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-subtle">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={orchidLogo}
              alt="Orchid Island Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center space-x-8">
             <Link to="/" className="font-playfair text-foreground hover:text-primary transition-smooth">
               {t('header.home')}
             </Link>
             <Link to="/about" className="font-playfair text-foreground hover:text-primary transition-smooth">
               {t('header.about')}
             </Link>
             <Link to="/properties" className="font-playfair text-foreground hover:text-primary transition-smooth">
               {t('header.properties')}
             </Link>
             <Link to="/blog" className="font-playfair text-foreground hover:text-primary transition-smooth">
               {t('header.articles')}
             </Link>
           </nav>

          {/* Newsletter & Contact */}
           <div className="font-lora hidden lg:flex items-center space-x-4">
             <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-2">
             </form>
             <Link to="/invest">
               <Button variant="luxury" size="sm">
                 {t('header.invest')}
               </Button>
             </Link>
             <Link to="/contact">
               <Button variant="elegant" size="sm">
                 {t('header.contact')}
               </Button>
             </Link>
             <LanguageSwitcher />
           </div>
 
           {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4 mb-4">
               <Link to="/" className="font-lora text-foreground hover:text-primary transition-smooth">
                 {t('header.home')}
               </Link>
               <Link to="/about" className="font-lora text-foreground hover:text-primary transition-smooth">
                 {t('header.about')}
               </Link>
               <Link to="/properties" className="font-lora text-foreground hover:text-primary transition-smooth">
                 {t('header.properties')}
               </Link>
               <Link to="/blog" className="font-lora text-foreground hover:text-primary transition-smooth">
                 {t('header.blog')}
               </Link>
             </nav>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <div className="font-lora flex space-x-2">
                <Link to="/invest" className="flex-1">
                  <Button variant="luxury" size="sm" className="w-full">
                    {t('header.invest')}
                  </Button>
                </Link>
                <Link to="/contact" className="flex-1">
                  <Button variant="elegant" size="sm" className="w-full">
                    {t('header.contact')}
                  </Button>
                </Link>
              </div>
            </form>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

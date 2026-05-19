import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import orchidFooterLogo from "@/assets/logowhitepro-r.png";
import CookieSettings from "@/components/CookieSettings";

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

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
              Your trusted partner for luxury real estate in Morocco. The Address You'll Always Remember.
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/people/Orchid-Island/61577156887769/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/orchid_island_real_estate?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/orchid-island-real-estate-marrakech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://x.com/EstateOrch47105" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-ivory-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair font-semibold text-xl mb-6">Our Services</h4>
            <ul className="font-lora space-y-3">
              <li><a href="/properties" className="text-ivory-white/80 hover:text-primary transition-smooth">Property Sales</a></li>
              <li><a href="/contact-us" className="text-ivory-white/80 hover:text-primary transition-smooth">Custom Acquisition</a></li>
              <li><a href="/contact-us" className="text-ivory-white/80 hover:text-primary transition-smooth">High-End Rental</a></li>
              <li><a href="/investment-orchidisland" className="text-ivory-white/80 hover:text-primary transition-smooth">Investment Advice</a></li>
              <li><a href="/contact-us" className="text-ivory-white/80 hover:text-primary transition-smooth">Wealth Management</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold text-xl mb-6">Contact</h4>
            <div className="space-y-4 font-lora">
              <div className="font-lora flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-ivory-white/80">Centre d'affaire Oualid, Jbel Gueliz 10,</p>
                  <p className="text-ivory-white/80">40010 Marrakech, Morocco</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-ivory-white/80">+212 6 18 68 88 88</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair font-semibold text-xl mb-6">Quick Links</h4>
            <ul className="font-lora space-y-3">
              <li><a href="/corporate-social-responsibility" className="text-ivory-white/80 hover:text-primary transition-smooth">Orchid Island CSR</a></li>
              <li><a href="/contact-us/careers/" className="text-ivory-white/80 hover:text-primary transition-smooth">Careers</a></li>
              <li><a href="/services" className="text-ivory-white/80 hover:text-primary transition-smooth">Services</a></li>
              <li><a href="/" className="text-ivory-white/80 hover:text-primary transition-smooth">Home</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-ivory-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="font-lora text-ivory-white/60 text-sm">
              © {year} Orchid Island. All rights reserved.
            </div>
            <div className="flex space-x-6 font-lora text-sm">
              <a href="/privacy-policy" className="text-ivory-white/60 hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="/terms-and-conditions" className="text-ivory-white/60 hover:text-primary transition-smooth">
                Terms of Use
              </a>
              <a href="/legal-notice" className="text-ivory-white/60 hover:text-primary transition-smooth">
                Legal Notice
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
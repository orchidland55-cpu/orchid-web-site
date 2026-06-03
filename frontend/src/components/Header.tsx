import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

// ─── X (Twitter) icon — lucide ne l'inclut pas, on le dessine ────────────────
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Services submenu items ───────────────────────────────────────────────────
const services = [
  { label: "Hospitality",          path: "/services/hospitality" },
  { label: "Healthcare",           path: "/healthcare" },
  { label: "Data Centers",         path: "/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform" },
  { label: "Retail",               path: "/services/retail" },
  { label: "Industrial & Offices", path: "/services/industrial-offices" },
  { label: "Logistics",            path: "/services/logistics" },
  { label: "Individuals",          path: "/services/individuals" },
];

const socialLinks = [
  { href: "https://www.instagram.com/orchid_island_real_estate?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D", icon: Instagram, label: "Instagram" },
  { href: "https://web.facebook.com/people/Orchid-Island/61577156887769/",  icon: Facebook,  label: "Facebook"  },
  { href: "https://x.com/EstateOrch47105",icon: XIcon,     label: "X"         },
  { href: "https://www.linkedin.com/company/orchid-island-real-estate-marrakech/",  icon: Linkedin,  label: "LinkedIn"  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Header = () => {
  const [isMenuOpen, setIsMenuOpen]                 = useState(false);
  const [servicesOpen, setServicesOpen]             = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const email = "";
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50">
        {/* ══ MAIN NAV ═════════════════════════════════════════════════════════ */}
        <div className="bg-background/70 backdrop-blur-md border-b border-border/50 shadow-subtle">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">

              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289701/logopng_j3hjit.png"
                    alt="Orchid Island Logo"
                    className="h-12 w-auto"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="font-playfair text-foreground hover:text-primary transition-smooth">
                  Home
                </Link>
                <Link to="/about-us" className="font-playfair text-foreground hover:text-primary transition-smooth">
                  About us
                </Link>

                {/* Services dropdown */}
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/services"
                    className="font-playfair flex items-center gap-1 text-foreground hover:text-primary transition-smooth"
                  >
                    Services
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {servicesOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border rotate-45" />
                      <ul className="py-1">
                        {services.map((service) => (
                          <li key={service.path}>
                            <Link
                              to={service.path}
                              onClick={() => setServicesOpen(false)}
                              className="block px-4 py-2.5 text-sm font-lora text-foreground hover:bg-primary/8 hover:text-primary transition-smooth"
                            >
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link to="/properties" className="font-playfair text-foreground hover:text-primary transition-smooth">
                  Properties
                </Link>
                <Link to="/real-estate-guide-orchid-island-marrakech" className="font-playfair text-foreground hover:text-primary transition-smooth">
                  Blog
                </Link>
              </nav>

              {/* CTA Buttons */}
              <div className="font-lora hidden lg:flex items-center space-x-4">
                <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-2" />
                <Link to="/investment-orchidisland">
                  <Button variant="luxury" size="sm">INVEST</Button>
                </Link>
                <Link to="/contact-us">
                  <Button variant="elegant" size="sm">Contact Us</Button>
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

            {/* ── Mobile Menu ── */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
                <nav className="flex flex-col space-y-4 mb-4">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-lora text-foreground hover:text-primary transition-smooth">
                    Home
                  </Link>
                  <Link to="/about-us" onClick={() => setIsMenuOpen(false)} className="font-lora text-foreground hover:text-primary transition-smooth">
                    About us
                  </Link>

                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="font-lora flex items-center gap-1 text-foreground hover:text-primary transition-smooth w-full text-left"
                    >
                      Services
                      <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileServicesOpen && (
                      <ul className="mt-2 ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                        {services.map((service) => (
                          <li key={service.path}>
                            <Link
                              to={service.path}
                              onClick={() => { setIsMenuOpen(false); setMobileServicesOpen(false); }}
                              className="block text-sm font-lora text-muted-foreground hover:text-primary transition-smooth"
                            >
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link to="/properties" onClick={() => setIsMenuOpen(false)} className="font-lora text-foreground hover:text-primary transition-smooth">
                    Properties
                  </Link>
                  <Link to="/real-estate-guide-orchid-island-marrakech" onClick={() => setIsMenuOpen(false)} className="font-lora text-foreground hover:text-primary transition-smooth">
                    Blog
                  </Link>
                </nav>

                <div className="font-lora flex space-x-2">
                  <Link to="/investment-orchidisland" className="flex-1">
                    <Button variant="luxury" size="sm" className="w-full">INVEST</Button>
                  </Link>
                  <Link to="/contact-us" className="flex-1">
                    <Button variant="elegant" size="sm" className="w-full">Contact Us</Button>
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-[#b8972e] hover:text-[#d4af50] transition-colors">
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
            )}
          </div>
        </div>

      </header>
      <div className="h-[80px]" aria-hidden="true" />
    </>
  );
};

export default Header;
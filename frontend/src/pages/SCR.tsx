import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import csrHero from "@/assets/property-1.jpg";
import educationSupport from "@/assets/property-2.jpg";
import elderCare from "@/assets/property-3.jpg";
import culturalHeritage from "@/assets/property-1.jpg";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Book, Landmark, Handshake, Users } from "lucide-react";

// Import Header and Footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const keyInitiatives = [
  {
    title: "Education Support",
    description: "Providing supplies and resources for underprivileged schools in rural areas.",
    icon: Book,
    targetSection: "education-commitment",
  },
  {
    title: "Cultural Projects",
    description: "Organizing local events to preserve Moroccan heritage and traditions.",
    icon: Landmark,
    targetSection: "cultural-engagement",
  },
  {
    title: "Partnership with Local NGOs",
    description: "Supporting smaller associations with logistics, funding, and visibility.",
    icon: Handshake,
    targetSection: "get-involved",
  },
  {
    title: "Human Aid Campaigns",
    description: "Distributing food and winter supplies to vulnerable families.",
    icon: Users,
    targetSection: "human-aid",
  },
];

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const ParallaxImage = ({ src, alt }) => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const translateX = useTransform(mouseX, [0, 1], ["-30px", "30px"]);
  const translateY = useTransform(mouseY, [0, 1], ["-20px", "20px"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-lg shadow-lg"
      style={{ translateX, translateY }}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
};

const CSR = () => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={csrHero}
              alt="Orchid Island Social Responsibility"
              className="w-full h-full object-cover animate-scale-in"
            />
            <div className="absolute inset-0 bg-slate-900/60"></div>
          </div>

          {/* Back Link */}
          

          <div className="relative container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl animate-fade-in-up">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                Orchidisland's Social Responsibility
              </h1>
              <p
                className="font-playfair text-xl md:text-2xl"
                style={{ color: "#ccac36" }}
              >
                Empowering Communities Through Anouar Association
              </p>
            </div>
          </div>
        </section>

        {/* CSR Commitment */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-center mb-12 animate-fade-in">
                <span style={{ color: "#082648" }}>CSR </span>
                <span style={{ color: "#ccac36" }}>Commitment</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    At Orchidisland Marrakech, we believe business should serve people through Corporate Social Responsibility, not the other way around. That's why our Chairman Mohamed Dekkak is also the President of Anouar Association, a non-profit organization working across Morocco to uplift communities through education, cultural preservation, and direct aid. Our commitment goes beyond words as we support multiple associations and local causes, using our business success to fuel real change.
                  </p>
                </div>
                <div className="animate-slide-in-right">
                  <motion.img
                    src={csrHero}
                    alt="CSR Commitment"
                    className="w-full object-cover rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Initiatives */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-center mb-12 animate-fade-in">
                <span style={{ color: "#082648" }}>Our Key </span>
                <span style={{ color: "#ccac36" }}>Initiatives</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-center">
                {keyInitiatives.map((initiative, index) => {
                  const Icon = initiative.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => scrollToSection(initiative.targetSection)}
                      className="p-8 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                      <Icon className="mx-auto mb-4 w-12 h-12 text-slate-700 group-hover:text-slate-900 transition-colors" />
                      <h3
                        className="font-playfair font-bold text-xl mb-2 relative inline-block transition-colors"
                        style={{ color: "#ccac36" }}
                      >
                        {initiative.title}
                        <span
                          className="absolute left-0 -bottom-1 w-full h-[2px] bg-current transition-all"
                        ></span>
                      </h3>
                      <p className="font-lora text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                        {initiative.description}
                      </p>
                      <div className="mt-4 text-sm text-[#082648] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to learn more →
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Parallax Section: Building Stronger Communities */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <ParallaxImage src={elderCare} alt="Building Stronger Communities" />
          </div>
          <div className="relative container mx-auto px-6 text-center animate-fade-in-up">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8">
              Building Stronger Communities Together
            </h2>
          </div>
        </section>

        {/* Education Commitment */}
        <section id="education-commitment" className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-center mb-12 animate-fade-in">
                <span style={{ color: "#082648" }}>Our Commitment to </span>
                <span style={{ color: "#ccac36" }}>Education</span>
              </h2>
              <div className="text-center animate-fade-in-up">
                <p className="font-lora text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl mx-auto">
                  At OrchidIsland, we believe in building more than properties — we build futures. Through our CSR initiatives, we support the construction of schools and educational programs for children in underserved communities across Morocco.
                </p>
                <p className="text-xl font-semibold text-slate-900 italic">
                  Because real impact starts with education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Human Aid & Elder Health */}
        <section id="human-aid" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-center mb-12 animate-fade-in">
                <span style={{ color: "#082648" }}>Human Aid & </span>
                <span style={{ color: "#ccac36" }}>Elders Health</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left">
                  <p className="font-lora text-lg text-slate-700 leading-relaxed mb-6">
                    OrchidIsland supports our elders with free health checkups, nutritious meals, and community events to boost their well-being. We also provide education and emergency aid to ensure seniors stay healthy and connected.
                  </p>
                  <p className="font-lora text-lg font-semibold text-slate-900 italic">
                    Because caring for elders and providing aid is essential for a strong, healthy community.
                  </p>
                </div>
                <div className="animate-slide-in-right">
                  <motion.img
                    src={elderCare}
                    alt="Elder Care"
                    className="w-full object-cover rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Engagement */}
        <section id="cultural-engagement" className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-center mb-12 animate-fade-in">
                <span style={{ color: "#082648" }}>Cultural </span>
                <span style={{ color: "#ccac36" }}>Engagement</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left">
                  <motion.img
                    src={culturalHeritage}
                    alt="Cultural Engagement"
                    className="w-full object-cover rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                  />
                </div>
                <div className="animate-slide-in-right">
                  <p className="font-lora text-lg text-slate-700 leading-relaxed mb-6">
                    At OrchidIsland, we proudly support cultural initiatives that celebrate Morocco's rich heritage, from restoring historical sites to sponsoring local arts and traditions. We believe preserving these treasures not only honors our past but also strengthens community identity and inspires future generations to cherish and continue our vibrant culture.
                  </p>
                  <p className="font-lora text-lg font-semibold text-slate-900 italic">
                    Because investing in culture means investing in identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Earthquake Relief Banner */}
        <section className="relative h-[500px] w-full flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${elderCare})` }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4">
              Hope and Relief for the Atlas Mountains
            </h2>
            <p
              className="font-playfair text-2xl md:text-3xl luxury-gradient bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(90deg, #ccac36, #e0c37e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Earthquake 2023
            </p>
          </div>
        </section>

        {/* Get Involved CTA */}
        <section id="get-involved" className="py-16 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <h2 className="font-playfair text-3xl font-bold text-white mb-4">
                Get Involved and Make a Difference
              </h2>
              <p className="font-lora text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                The Orchidisland and Anouar Association invites individuals, corporations, and community groups to join its mission. Whether through donations, volunteering, or partnerships, your support can help expand the association's impactful programs and foster a more inclusive and compassionate society.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="font-lora color:#082648  text-white px-8 py-3 transition-all duration-300 hover:scale-105"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default CSR;
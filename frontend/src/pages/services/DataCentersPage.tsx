import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Server,
  Zap,
  Shield,
  Globe2,
  TrendingUp,
  Cpu,
  Wind,
  CheckCircle2,
  ArrowRight,
  Building2,
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const whyMorocco = [
  { icon: Globe2,    label: "Gateway between Europe and Africa" },
  { icon: Zap,       label: "Strong renewable energy potential" },
  { icon: TrendingUp,label: "Competitive industrial power costs" },
  { icon: Building2, label: "Growing regional digital economy" },
  { icon: Shield,    label: "Government focus on digital infrastructure" },
];

const opportunities = [
  {
    icon: Cpu,
    title: "AI Infrastructure Platforms",
    desc: "Deployment of high-density GPU clusters designed for artificial intelligence, machine learning, and high-performance computing workloads.",
  },
  {
    icon: Shield,
    title: "Sovereign Data Infrastructure",
    desc: "Secure computing environments designed for governments and regulated industries requiring compliant and localized data platforms.",
  },
  {
    icon: Globe2,
    title: "Digital Infrastructure Expansion",
    desc: "Development of scalable infrastructure campuses supporting regional digital economies and cross-border computing demand.",
  },
];

const architecture = [
  "Modular AI data center deployment",
  "Integrated power and cooling systems",
  "High-density GPU infrastructure",
  "Sovereign and confidential computing",
  "Standardized facility architecture",
];

const energy = [
  {
    icon: Zap,
    title: "Renewable Energy",
    desc: "Morocco's strong solar and wind generation capacity provides a foundation for sustainable energy supply for large-scale computing infrastructure.",
  },
  {
    icon: Shield,
    title: "Integrated Power Systems",
    desc: "Reliable power architecture designed for mission-critical digital infrastructure operations.",
  },
  {
    icon: Wind,
    title: "Advanced Cooling",
    desc: "Liquid, on-chip, and immersion cooling technologies designed to optimize energy efficiency for high-density computing.",
  },
];

const govPolicy = [
  "Digital infrastructure development",
  "Renewable energy expansion",
  "Data localization initiatives",
  "Strategic technology investment",
];

const dealHighlights = [
  "AI-ready data centers designed with a capacity of 7.5 MW per site",
  "Sovereign cloud infrastructure powered by a federated control framework",
  "Advanced management of AI workloads across multiple jurisdictions",
  "Standardized infrastructure aligned with strict regulatory and compliance requirements",
  "Strategic expansion targeting high-growth African regions and transatlantic markets",
];

const strategicBenefits = [
  "Full-stack control across both infrastructure and cloud environments",
  "Seamless cross-border AI deployment supported by federated governance models",
  "Direct access to highly regulated industries such as government, finance, healthcare, and energy",
  "Lower reliance on global hyperscale cloud providers",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const DataCentersPage = () => {
  return (
    <PageTransition>
    <Header />
      <div className="min-h-screen bg-background text-foreground font-lora">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#0a0f1e] text-white py-28 px-6">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777375521/data-centre-640x427_lqnqmk.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[10px] pointer-events-none" />

          <div className="relative container mx-auto max-w-4xl text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
              className="inline-flex items-center gap-2 border border-primary/40 text-primary text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            >
              <Server className="w-3.5 h-3.5" />
              Data Center Investment · Morocco
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="font-playfair text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              Sovereign AI &{" "}
              <span className="text-primary">Data Center</span>{" "}
              Infrastructure in Morocco
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              We develop sovereign-grade AI and data center infrastructure
              platforms serving governments, regulated industries, and enterprise
              clients — integrating power, development, and AI computing
              capabilities across the full project lifecycle.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/contact-us">
                <Button variant="luxury" size="lg">
                  Request Investment Information
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Why Morocco ───────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                  Strategic Location
                </span>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Why Morocco for Data Centers
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Morocco has emerged as a strategically attractive location for
                  sovereign-grade AI and high-performance data center
                  infrastructure. Its geographic position between Africa and
                  Europe enables low-latency connectivity to European digital
                  markets while serving growing digital demand across North and
                  West Africa.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The country combines political stability, competitive
                  industrial power pricing, and abundant renewable energy
                  resources, creating favorable conditions for large-scale
                  compute infrastructure.
                </p>
              </motion.div>

              <motion.ul
                className="space-y-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {whyMorocco.map((item, i) => (
                  <motion.li
                    key={item.label}
                    variants={fadeUp}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {/* ── Investment Opportunities ───────────────────────────────────────── */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                Opportunities
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2">
                Investment Opportunities
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                We develop modular, ultra-high-density GPU data centers designed
                to support mission-critical computing workloads for governments,
                enterprises, and digital platforms.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {opportunities.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  className="group p-8 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Infrastructure & Platform Architecture ────────────────────────── */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                  Architecture
                </span>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Infrastructure & Platform Architecture
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We design standardized AI-native data center facilities
                  integrating power, cooling systems, security, and confidential
                  computing capabilities.
                </p>
                <ul className="space-y-3">
                  {architecture.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual placeholder — replace with real image */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="relative rounded-2xl overflow-hidden bg-[#0a0f1e] h-80 flex items-center justify-center border border-primary/20"
              >
                <div className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage: "url('https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777375520/69a1dfffac9ce-640x427_ekedwg.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Energy & Sustainability ───────────────────────────────────────── */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                Sustainability
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2">
                Energy & Sustainability
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Energy infrastructure is a critical component of modern AI
                computing platforms. We integrate efficient power systems and
                advanced cooling technologies to support scalable and
                high-performance compute environments.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {energy.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  className="p-8 rounded-2xl border border-border bg-background hover:border-primary/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Government Policy ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden bg-[#0a0f1e] h-72 flex items-center justify-center border border-primary/20 order-2 lg:order-1"
              >
                <div className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage: "url('https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777375521/Data-Centre-Morocco-Marrakech--640x427_lc8nys.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="order-1 lg:order-2"
              >
                <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                  Policy
                </span>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Government Policy & Digital Infrastructure Strategy
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Morocco has made digital infrastructure, data localization,
                  and energy transition national priorities. Government
                  investments in renewable energy and digital connectivity
                  create a supportive environment for data center infrastructure
                  development.
                </p>
                <ul className="space-y-3">
                  {govPolicy.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Landmark Deal ─────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-[#0a0f1e] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                Strategic Partnership
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2">
                A Landmark Deal Shaping Sovereign AI Infrastructure
              </h2>
              <div className="mt-6 rounded-lg overflow-hidden border border-primary/20"> 
                <img src="https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777375520/dcdkwebp-768x432_lshzeb.webp" 
                     alt=""
                     style={{
                        width: "100%",
                        height: "auto",
                        backgroundSize: "cover",
                        
                     }} />
              </div>
              <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                A strategic alliance redefining the landscape of AI
                infrastructure across multiple continents — setting a new
                benchmark for secure, scalable, and compliant artificial
                intelligence deployment.
              </p>
            </motion.div>

            {/* Deal Overview */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
              >
                <h3 className="font-playfair text-xl font-semibold mb-4 text-primary">
                  Deal Overview
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  US Data Centers Morocco and Oréus have entered into a
                  strategic partnership through the signing of a Memorandum of
                  Understanding (MoU) at GITEX AFRICA 2026, paving the way for
                  the deployment of a sovereign AI infrastructure platform
                  spanning Morocco, Spain, the United States, and key markets
                  across West Africa.
                </p>
                <ul className="space-y-3">
                  {dealHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
              >
                <h3 className="font-playfair text-xl font-semibold mb-4 text-primary">
                  Strategic Value
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  This agreement positions both organizations as key players in
                  a fast-growing AI infrastructure market, where data
                  sovereignty, regulatory compliance, and scalable solutions
                  have become essential.
                </p>
                <ul className="space-y-3">
                  {strategicBenefits.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Executive Insights */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  name: "Mohamed Dekkak",
                  role: "Founding Partner, US Data Centers Morocco",
                  quote:
                    "Demand for sovereign AI infrastructure is accelerating due to regulatory pressure, data sovereignty requirements, and the rapid growth of AI workloads. Our platform connects AI data centers across Morocco, Spain, the United States, and West Africa.",
                },
                {
                  name: "Laurent Choukroun",
                  role: "CEO, Oréus",
                  quote:
                    "AI infrastructure must operate across multiple jurisdictions while ensuring governance, security, and compliance at a local level. This partnership enables the deployment of sovereign AI platforms capable of scaling across regions without compromising control.",
                },
              ].map((exec, i) => (
                <motion.blockquote
                  key={exec.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  className="p-8 rounded-2xl border border-primary/30 bg-primary/5"
                >
                  <p className="text-white/80 text-sm leading-relaxed italic mb-6">
                    "{exec.quote}"
                  </p>
                  <footer>
                    <p className="font-semibold text-primary">{exec.name}</p>
                    <p className="text-white/50 text-xs mt-1">{exec.role}</p>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="text-primary text-xs uppercase tracking-widest font-semibold">
                Investor Inquiry
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-2 mb-4">
                Position Your Business at the Core of Sovereign AI Growth
              </h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                Leverage a platform built for scale, compliance, and global
                expansion. Investors and strategic partners may request
                additional information and partnership details.
              </p>
              <Link to="/contact-us">
                <Button variant="luxury" size="lg">
                  Request Investment Brief
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
        <Footer />
    </PageTransition>
  );
};

export default DataCentersPage;
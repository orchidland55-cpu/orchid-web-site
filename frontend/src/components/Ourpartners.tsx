import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Partner data ─────────────────────────────────────────────────────────────
// Replace `logo` with actual image imports or URLs when available.
// `name` is used as alt text and shown on hover.

const partners = [
  { name: "Université Cadi Ayyad – Marrakech", logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384150/logo-dark_wp88uk.webp",     initials: "UCA",      url: "https://www.uca.ma" },
  { name: "supdeco",                           logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384151/supdeco_vhlucf.webp",       initials: "supdeco",  url: "https://supdeco.ma/" },
  { name: "UM6P",                              logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384149/1337_hkxlev.webp",          initials: "UM6P",     url: "https://www.um6p.ma" },
  { name: "Golden Ratio Builders",             logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384559/image_laptop_gyxaoo.webp",  initials: "GRB",      url: "https://www.goldenratiobuilders.com" },
  { name: "USDC",                              logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384149/USDC_uxjgyu.webp",          initials: "USDC",     url: "https://www.usdatacenters.ma" },
  { name: "Licorne",                           logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384148/LINCORNE_wb6ur8.webp",      initials: "LIC",      url: "https://www.licorne.ma" },
  { name: "Al Akhawayn University",            logo:"https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384147/logo-AUI_ajbbmb.webp",       initials: "AUI",      url: "https://www.aui.ma" },
  { name: "ADGECO Group",                      logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384146/1631351340805_oxwaoc.webp", initials: "ADG",      url: "https://www.adgeco.com" },
  { name: "UPEC",                              logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384145/UPEC_dau1yd.webp",          initials: "UPEC",     url: "https://www.u-pec.fr" },
  { name: "EMSI",                              logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384144/Emsi_logo_w0hfye.webp",     initials: "EMSI",     url: "https://www.emsi.ma" },
  { name: "Oeil Du Pecheur",                   logo: "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777384144/logo3_1_a6m3iq.webp",       initials: "ODP",      url: "https://oeil-du-pecheur.fr/?srsltid=AfmBOorJzKZZpWI8mzuZWN5ce1BQStJ0aMtYSrSdLCDc-vgPkMi-I3fY" },
];

// ─── Single card ──────────────────────────────────────────────────────────────

const PartnerCard = ({
  partner,
  index,
}: {
  partner: (typeof partners)[0];
  index: number;
}) => (
  <motion.a
    href={partner.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
    className="group relative flex items-center justify-center p-6 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.08)] transition-all duration-300 cursor-pointer aspect-[3/2]"
  >
    {/* Subtle gold shimmer on hover */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/0 transition-all duration-500 pointer-events-none" />

    {partner.logo ? (
      <img
        src={partner.logo}
        alt={partner.name}
        className="max-h-14 max-w-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
      />
    ) : (
      /* Placeholder shown until real logos are provided */
      <div className="flex flex-col items-center gap-1 select-none">
        <span className="font-playfair text-lg font-bold text-muted-foreground/50 group-hover:text-primary transition-colors duration-300 tracking-wider">
          {partner.initials}
        </span>
        <span className="text-[10px] text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors duration-300 text-center leading-tight max-w-[100px]">
          {partner.name}
        </span>
      </div>
    )}

    {/* Tooltip on hover */}
    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 font-lora">
      {partner.name}
    </div>
  </motion.a>
);

// ─── Main component ───────────────────────────────────────────────────────────

const OurPartners = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-3"
          >
            Trusted Network
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Our Partners
          </motion.h2>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
            className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
            className="font-lora text-muted-foreground max-w-xl mx-auto text-base leading-relaxed"
          >
            At <span className="text-foreground font-semibold">Orchid Island</span>,
            we collaborate with trusted partners who share our dedication to
            quality, innovation, and exceptional services.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} index={i} />
          ))}
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-16 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-primary text-xs tracking-widest uppercase font-lora">
            Excellence through collaboration
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

      </div>
    </section>
  );
};

export default OurPartners;
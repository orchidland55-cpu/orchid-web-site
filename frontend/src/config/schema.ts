// ─────────────────────────────────────────────────────────
// Schémas JSON-LD réutilisables (alignés avec GlobalSchema)
// ─────────────────────────────────────────────────────────

export const SITE_URL = "https://orchidisland.immo";

export const ORGANIZATION_REF = {
  "@id": `${SITE_URL}/#organization`
};

export const WEBSITE_REF = {
  "@id": `${SITE_URL}/#website`
};

export const LOGO_URL =
  "https://res.cloudinary.com/drgg2rocc/image/upload/q_auto/f_auto/v1777289701/logopng_j3hjit.png";

export const AUTHOR_SCHEMA = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person/Mohamed-DEKKAK`,
  "name": "Mohamed DEKKAK",
  "jobTitle": "Real Estate Expert",
  "description": "Luxury real estate expert in Marrakech, Morocco",
  "affiliation": ORGANIZATION_REF
};
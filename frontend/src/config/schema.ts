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

export const AUTHOR_SCHEMA = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person/Mohamed-DEKKAK`,
  "name": "Mohamed DEKKAK",
  "jobTitle": "Real Estate Expert",
  "description": "Luxury real estate expert in Marrakech, Morocco",
  "affiliation": ORGANIZATION_REF
};
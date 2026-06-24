// ─────────────────────────────────────────────────────────
// Helpers SEO / GEO
// ─────────────────────────────────────────────────────────

import { SITE_URL, ORGANIZATION_SCHEMA, AUTHOR_SCHEMA } from "@/config/schema";

/**
 * Génère un schema Speakable pour les assistants vocaux.
 * Les IA génératives (Google SGE, Bing Chat) utilisent ce type de schema.
 */
export const generateSpeakableSchema = (title: string, excerpt: string, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/${slug}#webpage`,
  "url": `${SITE_URL}/${slug}`,
  "speakable": {
    "@type": "SpeakableSpecification",
    "xpath": [
      "/html/head/title",
      "/html/head/meta[@name='description']/@content"
    ]
  },
  "about": {
    "@type": "Thing",
    "name": title,
    "description": excerpt
  }
});

/**
 * Génère un schema FAQPage à partir d'un tableau de Q&A.
 */
export const generateFAQSchema = (faqs: { question: string; answer: string }[], pageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/${pageUrl}#faq`,
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
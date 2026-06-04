import { useMemo } from "react";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FactorType = "success" | "warning" | "error" | "info";

interface Factor {
  type: FactorType;
  category: string;
  text: string;
  points: number;
  maxPoints: number;
}

export interface SEOAnalyzerProps {
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  focusKeyword?: string;
  content?: string;        // HTML brut du RichTextEditor (articles)
  description?: string;    // HTML brut (properties)
  image?: string;
  imageAlt?: string;
  ogTitle?: string;
  twitterTitle?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countOccurrences(text: string, keyword: string): number {
  if (!keyword) return 0;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return (text.match(regex) || []).length;
}

function extractHeadings(html: string): { h1: string[]; h2: string[]; h3: string[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  const extract = (tag: string) =>
    [...doc.querySelectorAll(tag)].map((el) => el.textContent?.trim() || "");

  return {
    h1: extract("h1"),
    h2: extract("h2"),
    h3: extract("h3"),
  };
}

function extractLinks(html: string): { internal: number; external: number; authoritative: number } {
  const matches = [...html.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi)];

  // Domaines considérés comme autoritaires
  const AUTHORITATIVE_DOMAINS = [
    "wikipedia.org", "gov", "edu", "who.int", "un.org",
    "reuters.com", "bbc.com", "nature.com", "pubmed.ncbi.nlm.nih.gov",
    "scholar.google.com", "investopedia.com",
  ];

  let internal = 0;
  let external = 0;
  let authoritative = 0;

  for (const m of matches) {
    const href = m[1];
    if (href.startsWith("http://") || href.startsWith("https://")) {
      external++;
      const isAuth = AUTHORITATIVE_DOMAINS.some((d) => href.includes(d));
      if (isAuth) authoritative++;
    } else {
      internal++;
    }
  }

  return { internal, external, authoritative };
}

/** Extrait le texte du premier paragraphe <p> */
function extractFirstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  return match ? stripHtml(match[1]) : "";
}

/** Extrait les src et alt de toutes les images <img> dans le body */
function extractBodyImages(html: string): { src: string; alt: string }[] {
  return [...html.matchAll(/<img\s[^>]*>/gi)].map((m) => {
    const srcMatch = m[0].match(/src=["']([^"']+)["']/i);
    const altMatch = m[0].match(/alt=["']([^"']*?)["']/i);
    return {
      src: srcMatch ? srcMatch[1] : "",
      alt: altMatch ? altMatch[1] : "",
    };
  });
}

/**
 * Score de lisibilité simplifié basé sur la longueur moyenne des phrases.
 * Retourne : "facile" | "moyen" | "difficile"
 */
function readabilityScore(plainText: string): { level: "facile" | "moyen" | "difficile"; avgWords: number } {
  const sentences = plainText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return { level: "facile", avgWords: 0 };

  const totalWords = sentences.reduce((acc, s) => acc + wordCount(s), 0);
  const avg = totalWords / sentences.length;

  if (avg <= 15) return { level: "facile", avgWords: Math.round(avg) };
  if (avg <= 25) return { level: "moyen", avgWords: Math.round(avg) };
  return { level: "difficile", avgWords: Math.round(avg) };
}

// ─── Moteur de scoring ────────────────────────────────────────────────────────

function analyzeSEO(props: SEOAnalyzerProps): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];

  const {
    seoTitle = "",
    metaDescription = "",
    slug = "",
    focusKeyword = "",
    content = "",
    description = "",
    image = "",
    imageAlt = "",
    ogTitle = "",
    twitterTitle = "",
  } = props;

  // Utilise content pour les articles, description pour les properties
  const rawContent = content || description;

  const kw = focusKeyword.trim().toLowerCase();
  const plainContent = stripHtml(rawContent);
  const words = wordCount(plainContent);
  const headings = extractHeadings(rawContent);
  const links = extractLinks(rawContent);

  // ── 1. SEO Title (20 pts) ──────────────────────────────────────────────────
  if (!seoTitle) {
    factors.push({ type: "error", category: "Title", text: "SEO title manquant", points: 0, maxPoints: 20 });
  } else if (seoTitle.length < 30) {
    factors.push({ type: "warning", category: "Title", text: `SEO title trop court : ${seoTitle.length} caractères (min. 30)`, points: 8, maxPoints: 20 });
  } else if (seoTitle.length > 60) {
    factors.push({ type: "warning", category: "Title", text: `SEO title trop long : ${seoTitle.length} caractères (max. 60, tronqué par Google)`, points: 10, maxPoints: 20 });
  } else {
    factors.push({ type: "success", category: "Title", text: `SEO title optimal : ${seoTitle.length} caractères`, points: 20, maxPoints: 20 });
  }

  // ── 2. Meta Description (15 pts) ──────────────────────────────────────────
  if (!metaDescription) {
    factors.push({ type: "error", category: "Meta", text: "Meta description manquante", points: 0, maxPoints: 15 });
  } else if (metaDescription.length < 120) {
    factors.push({ type: "warning", category: "Meta", text: `Meta description courte : ${metaDescription.length} car. (recommandé : 120-160)`, points: 6, maxPoints: 15 });
  } else if (metaDescription.length > 160) {
    factors.push({ type: "warning", category: "Meta", text: `Meta description trop longue : ${metaDescription.length} car. (tronquée à 160 par Google)`, points: 8, maxPoints: 15 });
  } else {
    factors.push({ type: "success", category: "Meta", text: `Meta description optimale : ${metaDescription.length} caractères`, points: 15, maxPoints: 15 });
  }

  // ── 3. Slug (10 pts) ──────────────────────────────────────────────────────
  if (!slug) {
    factors.push({ type: "warning", category: "URL", text: "Slug non défini (sera auto-généré)", points: 0, maxPoints: 10 });
  } else {
    // Longueur du slug (nouveau)
    const slugWords = slug.split("-").filter(Boolean).length;
    if (slugWords > 6) {
      factors.push({ type: "warning", category: "URL", text: `Slug trop long : ${slugWords} segments (max. recommandé : 6)`, points: 4, maxPoints: 10 });
    } else if (kw && !slug.toLowerCase().includes(kw.split(" ")[0])) {
      factors.push({ type: "warning", category: "URL", text: "Slug défini mais le mot-clé principal n'y apparaît pas", points: 6, maxPoints: 10 });
    } else {
      factors.push({ type: "success", category: "URL", text: `Slug optimal : ${slugWords} segment(s), mot-clé présent`, points: 10, maxPoints: 10 });
    }
  }

  // ── 4. Mot-clé principal ──────────────────────────────────────────────────
  if (!kw) {
    factors.push({ type: "error", category: "Keyword", text: "Mot-clé principal non défini — critère le plus important", points: 0, maxPoints: 29 });
  } else {
    // 4a. Dans le SEO title (7 pts)
    if (seoTitle.toLowerCase().includes(kw)) {
      factors.push({ type: "success", category: "Keyword", text: "Mot-clé présent dans le SEO title", points: 7, maxPoints: 7 });
    } else {
      factors.push({ type: "warning", category: "Keyword", text: "Mot-clé absent du SEO title", points: 0, maxPoints: 7 });
    }

    // 4b. Dans la meta description (5 pts)
    if (metaDescription.toLowerCase().includes(kw)) {
      factors.push({ type: "success", category: "Keyword", text: "Mot-clé présent dans la meta description", points: 5, maxPoints: 5 });
    } else {
      factors.push({ type: "warning", category: "Keyword", text: "Mot-clé absent de la meta description", points: 0, maxPoints: 5 });
    }

    // 4c. Dans le premier paragraphe (7 pts) — NOUVEAU
    if (!rawContent) {
      factors.push({ type: "error", category: "Keyword", text: "Contenu vide — impossible d'analyser le premier paragraphe", points: 0, maxPoints: 7 });
    } else {
      const firstPara = extractFirstParagraph(rawContent);
      if (!firstPara) {
        factors.push({ type: "warning", category: "Keyword", text: "Aucun paragraphe détecté dans le contenu", points: 0, maxPoints: 7 });
      } else if (firstPara.toLowerCase().includes(kw)) {
        factors.push({ type: "success", category: "Keyword", text: "Mot-clé présent dans le premier paragraphe", points: 7, maxPoints: 7 });
      } else {
        factors.push({ type: "warning", category: "Keyword", text: "Mot-clé absent du premier paragraphe — Google accorde plus de poids aux 100 premiers mots", points: 0, maxPoints: 7 });
      }
    }

    // 4d. Dans le contenu — densité (10 pts)
    if (!plainContent) {
      factors.push({ type: "error", category: "Keyword", text: "Contenu vide — impossible d'analyser la densité du mot-clé", points: 0, maxPoints: 10 });
    } else {
      const occurrences = countOccurrences(plainContent, kw);
      const density = words > 0 ? (occurrences / words) * 100 : 0;

      if (occurrences === 0) {
        factors.push({ type: "error", category: "Keyword", text: "Mot-clé absent du corps de l'article", points: 0, maxPoints: 10 });
      } else if (density < 0.5) {
        factors.push({ type: "warning", category: "Keyword", text: `Densité trop faible : ${density.toFixed(1)}% (${occurrences}×) — recommandé : 0.5–2%`, points: 4, maxPoints: 10 });
      } else if (density > 3) {
        factors.push({ type: "warning", category: "Keyword", text: `Keyword stuffing détecté : ${density.toFixed(1)}% (${occurrences}×) — risque de pénalité Google`, points: 4, maxPoints: 10 });
      } else {
        factors.push({ type: "success", category: "Keyword", text: `Densité optimale : ${density.toFixed(1)}% (${occurrences} occurrence${occurrences > 1 ? "s" : ""})`, points: 10, maxPoints: 10 });
      }
    }
  }

  // ── 5. Contenu — longueur (10 pts) ────────────────────────────────────────
  if (!plainContent) {
    factors.push({ type: "error", category: "Contenu", text: "Contenu vide", points: 0, maxPoints: 10 });
  } else if (words < 300) {
    factors.push({ type: "error", category: "Contenu", text: `Contenu trop court : ${words} mots (min. recommandé : 300)`, points: 0, maxPoints: 10 });
  } else if (words < 600) {
    factors.push({ type: "warning", category: "Contenu", text: `Contenu acceptable : ${words} mots (idéal : 600+)`, points: 5, maxPoints: 10 });
  } else if (words < 1200) {
    factors.push({ type: "success", category: "Contenu", text: `Bonne longueur : ${words} mots`, points: 8, maxPoints: 10 });
  } else {
    factors.push({ type: "success", category: "Contenu", text: `Excellent contenu long-form : ${words} mots`, points: 10, maxPoints: 10 });
  }

  // ── 6. Lisibilité (8 pts) — NOUVEAU ──────────────────────────────────────
  if (plainContent) {
    const { level, avgWords } = readabilityScore(plainContent);
    if (level === "facile") {
      factors.push({ type: "success", category: "Contenu", text: `Lisibilité excellente : ~${avgWords} mots/phrase en moyenne`, points: 8, maxPoints: 8 });
    } else if (level === "moyen") {
      factors.push({ type: "info", category: "Contenu", text: `Lisibilité correcte : ~${avgWords} mots/phrase — peut être simplifié`, points: 5, maxPoints: 8 });
    } else {
      factors.push({ type: "warning", category: "Contenu", text: `Phrases trop longues : ~${avgWords} mots/phrase (max. recommandé : 25) — nuit à la lisibilité`, points: 2, maxPoints: 8 });
    }
  }

  // ── 7. Structure des titres H1/H2 (10 pts) ────────────────────────────────
  const hasH1 = headings.h1.length > 0;
  const hasH2 = headings.h2.length > 0;

  if (!rawContent) {
    // pas de contenu
  } else if (!hasH1 && !hasH2) {
    factors.push({ type: "error", category: "Structure", text: "Aucun titre H1 ou H2 dans le contenu", points: 0, maxPoints: 10 });
  } else if (!hasH1) {
    factors.push({ type: "warning", category: "Structure", text: `Pas de H1 dans le contenu — ${headings.h2.length} H2 présent(s)`, points: 4, maxPoints: 10 });
  } else if (headings.h1.length > 1) {
    factors.push({ type: "warning", category: "Structure", text: `${headings.h1.length} H1 détectés — il ne devrait y en avoir qu'un seul`, points: 5, maxPoints: 10 });
  } else {
    const h1HasKw = kw ? headings.h1[0].toLowerCase().includes(kw) : true;

    // Keyword dans un H2 (nouveau)
    const h2HasKw = kw ? headings.h2.some((h) => h.toLowerCase().includes(kw)) : true;

    if (kw && !h1HasKw && !h2HasKw) {
      factors.push({ type: "warning", category: "Structure", text: "H1 présent mais le mot-clé n'apparaît ni dans le H1 ni dans un H2", points: 5, maxPoints: 10 });
    } else if (kw && !h1HasKw) {
      factors.push({ type: "warning", category: "Structure", text: `H1 sans mot-clé — mais présent dans un H2 (${headings.h2.length} H2)`, points: 7, maxPoints: 10 });
    } else if (kw && !h2HasKw) {
      factors.push({ type: "info", category: "Structure", text: `Mot-clé dans le H1 ✓ — envisage de l'inclure dans un H2 aussi (${headings.h2.length} H2)`, points: 8, maxPoints: 10 });
    } else {
      factors.push({ type: "success", category: "Structure", text: `Structure optimale : H1 + H2 contiennent le mot-clé (${headings.h2.length} H2)`, points: 10, maxPoints: 10 });
    }
  }

  // ── 8. Liens (7 pts) ──────────────────────────────────────────────────────
  if (rawContent) {
    if (links.internal === 0 && links.external === 0) {
      factors.push({ type: "warning", category: "Liens", text: "Aucun lien dans l'article (interne ou externe)", points: 0, maxPoints: 7 });
    } else if (links.internal === 0) {
      factors.push({ type: "warning", category: "Liens", text: `${links.external} lien(s) externe(s) — aucun lien interne (maillage interne recommandé)`, points: 2, maxPoints: 7 });
    } else if (links.authoritative > 0) {
      // Liens vers sources autoritaires (nouveau)
      factors.push({ type: "success", category: "Liens", text: `${links.internal} lien(s) interne(s), ${links.external} externe(s) dont ${links.authoritative} source(s) autoritaire(s)`, points: 7, maxPoints: 7 });
    } else {
      factors.push({ type: "info", category: "Liens", text: `${links.internal} lien(s) interne(s), ${links.external} externe(s) — ajouter un lien vers une source autoritaire renforcerait la crédibilité`, points: 5, maxPoints: 7 });
    }
  }

  // ── 9. Image featured & Alt (7 pts) ───────────────────────────────────────
  if (!image) {
    factors.push({ type: "warning", category: "Image", text: "Aucune image featured définie", points: 0, maxPoints: 7 });
  } else if (!imageAlt) {
    factors.push({ type: "warning", category: "Image", text: "Image présente mais sans texte alt (accessibilité & SEO)", points: 3, maxPoints: 7 });
  } else if (kw && !imageAlt.toLowerCase().includes(kw)) {
    factors.push({ type: "info", category: "Image", text: "Alt text défini — envisage d'y inclure le mot-clé", points: 5, maxPoints: 7 });
  } else {
    factors.push({ type: "success", category: "Image", text: "Image featured avec alt text optimisé", points: 7, maxPoints: 7 });
  }

  // ── 10. Images dans le body sans alt (5 pts) — NOUVEAU ───────────────────
  if (rawContent) {
    const bodyImages = extractBodyImages(rawContent);
    if (bodyImages.length > 0) {
      const missingAlt = bodyImages.filter((img) => !img.alt).length;
      if (missingAlt === 0) {
        factors.push({ type: "success", category: "Image", text: `Toutes les images du contenu ont un alt text (${bodyImages.length} image${bodyImages.length > 1 ? "s" : ""})`, points: 5, maxPoints: 5 });
      } else if (missingAlt === bodyImages.length) {
        factors.push({ type: "error", category: "Image", text: `Aucune image du contenu n'a d'alt text (${missingAlt}/${bodyImages.length} manquant${missingAlt > 1 ? "s" : ""})`, points: 0, maxPoints: 5 });
      } else {
        factors.push({ type: "warning", category: "Image", text: `${missingAlt} image${missingAlt > 1 ? "s" : ""} sans alt text sur ${bodyImages.length} dans le contenu`, points: 2, maxPoints: 5 });
      }
    }
  }

  // ── 11. Social / Open Graph (5 pts) ───────────────────────────────────────
  const hasOg = Boolean(ogTitle);
  const hasTwitter = Boolean(twitterTitle);

  if (!hasOg && !hasTwitter) {
    factors.push({ type: "info", category: "Social", text: "Titres Open Graph / Twitter non définis (optionnel mais recommandé)", points: 2, maxPoints: 5 });
  } else if (hasOg && hasTwitter) {
    factors.push({ type: "success", category: "Social", text: "Open Graph et Twitter Card configurés", points: 5, maxPoints: 5 });
  } else {
    factors.push({ type: "info", category: "Social", text: `${hasOg ? "Open Graph" : "Twitter Card"} défini — l'autre plateforme manque`, points: 3, maxPoints: 5 });
  }

  // ── Score final ───────────────────────────────────────────────────────────
  const totalPoints = factors.reduce((acc, f) => acc + f.points, 0);
  const totalMax = factors.reduce((acc, f) => acc + f.maxPoints, 0);
  const score = Math.round((totalPoints / totalMax) * 100);

  return { score, factors };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

const ICON_MAP: Record<FactorType, JSX.Element> = {
  success: <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />,
  warning: <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />,
  error:   <XCircle    className="w-4 h-4 text-red-500   mt-0.5 flex-shrink-0" />,
  info:    <Info       className="w-4 h-4 text-blue-500  mt-0.5 flex-shrink-0" />,
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "À améliorer";
  return "Insuffisant";
}

function getProgressColor(score: number) {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

const CATEGORY_ORDER = ["Title", "Meta", "URL", "Keyword", "Contenu", "Structure", "Liens", "Image", "Social"];

// ─── Composant principal ──────────────────────────────────────────────────────

const SEOAnalyzer = (props: SEOAnalyzerProps) => {
  const { score, factors } = useMemo(() => analyzeSEO(props), [
    props.seoTitle,
    props.metaDescription,
    props.slug,
    props.focusKeyword,
    props.content,
    props.description,
    props.image,
    props.imageAlt,
    props.ogTitle,
    props.twitterTitle,
  ]);

  const grouped = useMemo(() => {
    const map: Record<string, Factor[]> = {};
    for (const f of factors) {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    }
    return map;
  }, [factors]);

  const errorsCount   = factors.filter((f) => f.type === "error").length;
  const warningsCount = factors.filter((f) => f.type === "warning").length;

  return (
    <div className="space-y-4">
      {/* Score global */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Score SEO</h4>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
            score >= 80 ? "border-green-200 bg-green-50 text-green-700" :
            score >= 60 ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
            score >= 40 ? "border-orange-200 bg-orange-50 text-orange-700" :
            "border-red-200 bg-red-50 text-red-700"
          }`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Barre de progression colorée */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Résumé rapide */}
      {(errorsCount > 0 || warningsCount > 0) && (
        <div className="flex gap-3 text-xs">
          {errorsCount > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="w-3 h-3" />
              {errorsCount} erreur{errorsCount > 1 ? "s" : ""}
            </span>
          )}
          {warningsCount > 0 && (
            <span className="flex items-center gap-1 text-yellow-600">
              <AlertCircle className="w-3 h-3" />
              {warningsCount} avertissement{warningsCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Facteurs groupés par catégorie */}
      <div className="space-y-3">
        {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {cat}
            </p>
            <div className="space-y-1.5 pl-1">
              {grouped[cat].map((factor, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {ICON_MAP[factor.type]}
                  <span className={
                    factor.type === "error"   ? "text-red-600" :
                    factor.type === "warning" ? "text-yellow-700" :
                    factor.type === "info"    ? "text-blue-600" :
                    "text-muted-foreground"
                  }>
                    {factor.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOAnalyzer;
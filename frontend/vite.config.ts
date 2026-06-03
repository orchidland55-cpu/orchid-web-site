import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import { fetchDynamicRoutes } from "./scripts/fetchDynamicRoutes";

const staticRoutes = [
  '/',
  '/contact-us/careers/',
  '/real-estate-guide-orchid-island-marrakech',
  '/corporate-social-responsibility',
  '/about-us',
  '/properties',
  '/investment-orchidisland',
  '/contact-us',
  '/services',
  '/services/data-center-investment-in-morocco-sovereign-ai-infrastructure-platform',
  '/services/hospitality',
  '/healthcare',
  '/services/retail',
  '/services/industrial-offices',
  '/services/logistics',
  '/services/individuals',
  '/privacy-policy',
  '/terms-and-conditions',
  '/legal-notice',
];

export default defineConfig(async ({ mode }) => {
  const dynamicRoutes = await fetchDynamicRoutes();

  return {
    server: {
      host: "::",
      port: 8080,
    },

    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      Sitemap({
        hostname: 'https://www.orchidisland.immo/',
        dynamicRoutes: [...staticRoutes, ...dynamicRoutes],
        generateRobotsTxt: false,
        exclude: [
          '/admin',
          '/admin/*',
          '/space',
          '/space/*',
          '/space-manager',
          '/set-password',
        ],
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date(),
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      // ── CSS ──────────────────────────────────────────────────────────────
      // cssCodeSplit:true = Vite génère un .css par chunk JS lazy
      // → le CSS d'une page n'est chargé que quand cette page est visitée
      cssCodeSplit: true,

      // Inline les assets < 4 Ko directement dans le JS (évite des requêtes)
      assetsInlineLimit: 4096,

      // Source maps désactivés en prod (taille + perf)
      sourcemap: false,

      rollupOptions: {
        output: {
          // ── Nommage des chunks ──────────────────────────────────────────
          // Hash court mais stable pour le cache long terme
          chunkFileNames:  'assets/js/[name]-[hash].js',
          entryFileNames:  'assets/js/[name]-[hash].js',
          assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',

          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;

            // ── Vendors critiques (chargés sur toutes les pages) ──────────
            if (
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('/react/')           // react core
            ) return 'vendor-react';

            // ── Query ─────────────────────────────────────────────────────
            if (id.includes('@tanstack')) return 'vendor-query';

            // ── UI / Radix ─────────────────────────────────────────────────
            if (id.includes('@radix-ui')) return 'vendor-ui';

            // ── Animation ─────────────────────────────────────────────────
            if (id.includes('framer-motion')) return 'vendor-motion';

            // ── Icônes ────────────────────────────────────────────────────
            if (id.includes('lucide-react')) return 'vendor-icons';

            // ── Dates ─────────────────────────────────────────────────────
            if (id.includes('date-fns')) return 'vendor-dates';

            // ── Analytics Vercel (non critique, lazy) ─────────────────────
            if (
              id.includes('@vercel/analytics') ||
              id.includes('@vercel/speed-insights')
            ) return 'vendor-analytics';

            // ── Tout le reste : un chunk "misc" ───────────────────────────
            return 'vendor-misc';
          },
        },
      },
    },
  };
});
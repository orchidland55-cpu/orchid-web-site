import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import { fetchDynamicRoutes } from "./scripts/fetchDynamicRoutes";
import { visualizer } from "rollup-plugin-visualizer";

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
]

// ✅ On passe à une fonction async pour pouvoir awaiter le fetch
export default defineConfig(async ({ mode }) => {
  const dynamicRoutes = await fetchDynamicRoutes()

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
  cssCodeSplit: true,
  rollupOptions: {
    output: {
      manualChunks(id: string) {
        if (id.includes('node_modules')) {
          if (id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
          if (id.includes('@tanstack')) return 'query-vendor';
          if (id.includes('@radix-ui')) return 'ui-vendor';
          if (id.includes('framer-motion')) return 'motion-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          if (id.includes('react')) return 'react-vendor';
          if (id.includes('date-fns')) return 'date-vendor';
          if (id.includes('react')) return 'react-vendor';
        }
      },
    },
  },
},
  }
})
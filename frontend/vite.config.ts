import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import { fetchDynamicRoutes } from "./scripts/fetchDynamicRoutes";

const staticRoutes = [
  '/',
  '/postulation',
  '/blog',
  '/Scr',
  '/about',
  '/properties',
  '/invest',
  '/contact',
  '/services',
  '/services/data-centers',
  '/services/hospitality',
  '/services/healthcare',
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
        hostname: 'https://orchid-immo-web-site.vercel.app/',
        dynamicRoutes: [...staticRoutes, ...dynamicRoutes],
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
      rollupOptions: {
        output: {
          manualChunks: {
            // Sépare les grosses librairies en chunks distincts
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'ui-vendor': ['@radix-ui/react-tooltip', '@radix-ui/react-dialog'],
          },
        },
      },
    },
  }
})
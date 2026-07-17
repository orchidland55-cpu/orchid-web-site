import { defineConfig, ConfigEnv, UserConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import { fetchDynamicRoutes } from "./scripts/fetchDynamicRoutes";

const staticRoutes = [
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

// ── Plugin : transforme le <link rel="stylesheet"> bloquant en preload non-bloquant ──
function deferCss(): Plugin {
  return {
    name: "defer-css",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
        (_match, before, href, after) =>
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'"${before}${after}>` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      );
    },
  };
}

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
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
      mode === 'production' && deferCss(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom"],
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('react-dom'))        return 'react-vendor';
            if (id.includes('/react/'))          return 'react-vendor';
            if (id.includes('@tanstack'))        return 'query-vendor';
            if (id.includes('@radix-ui'))        return 'ui-vendor';
            if (id.includes('lucide-react'))     return 'icons-vendor';
            if (id.includes('date-fns'))         return 'date-vendor';
            if (id.includes('framer-motion'))    return 'animation-vendor';
            if (id.includes('gsap'))             return 'animation-vendor';
            if (id.includes('embla-carousel'))   return 'carousel-vendor';
            if (id.includes('axios'))            return 'http-vendor';
            if (id.includes('zod'))              return 'forms-vendor';
            if (id.includes('react-hook-form'))  return 'forms-vendor';
            if (id.includes('/pages/Admin'))     return 'admin-vendor';
            if (id.includes('/pages/services/')) return 'services-vendor';
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
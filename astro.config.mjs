// @ts-check
/**
 * The Cloudflare build of насвітло: Astro + EmDash on Workers, D1 and R2.
 *
 * It lives beside the Next app rather than replacing it in one go. `site/` is
 * Astro's source directory and holds only what is Astro's own — routes, the
 * document shell, the island runtime and the EmDash content adapter. The
 * components, stylesheets, dictionaries and SEO helpers are the same files the
 * Next app renders (`src/`), so a change on main reaches both builds and the
 * two cannot drift apart while the switch is under way. See docs/CLOUDFLARE.md.
 */
import { fileURLToPath } from "node:url";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { clientIslands } from "./site/islands/vite-plugin.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Build-time flags, inlined the way `next build` inlines them into a
 * prerendered page. They decide what a deployment publishes, so they belong to
 * the build, not to whichever Worker isolate happens to serve the request.
 */
const buildEnv = [
  "FEATURE_GLOSSARY",
  "SITE_INDEXABLE",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_ENV",
];
const define = Object.fromEntries(
  buildEnv.map((k) => [`process.env.${k}`, JSON.stringify(process.env[k])]),
);

export default defineConfig({
  srcDir: "./site",
  publicDir: "./public",
  output: "server",
  adapter: cloudflare(),
  trailingSlash: "never",
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
    }),
  ],
  devToolbar: { enabled: false },
  vite: {
    define,
    plugins: [clientIslands({ root: here("./src") })],
    resolve: {
      alias: [
        // The content boundary: under Astro the repository reads EmDash.
        // First, so the general `@/` rule below does not claim it.
        {
          find: /^@\/content\/repository$/,
          replacement: here("./site/lib/emdash-repository.ts"),
        },
        { find: /^@\//, replacement: here("./src/") },
        { find: /^next\/link$/, replacement: here("./site/shims/link.tsx") },
        { find: /^next\/navigation$/, replacement: here("./site/shims/navigation.ts") },
        { find: /^next\/image$/, replacement: here("./site/shims/image.tsx") },
      ],
      dedupe: ["react", "react-dom"],
    },
  },
});

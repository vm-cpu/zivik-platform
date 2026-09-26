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
import { contentSnapshot } from "./site/content/vite-plugin.mjs";
import { adminLocales } from "./site/emdash/admin-locales.mjs";
import { securityHeaders } from "./src/lib/security-headers.ts";
import { appendFileSync } from "node:fs";

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

/**
 * The Next build's security headers, for Cloudflare's static asset server.
 *
 * Every public page is a prerendered file, and Cloudflare serves files
 * without running the Worker, so the headers go where the asset server reads
 * them: `_headers`. The admin (/_emdash/*) is rendered by the Worker and keeps
 * EmDash's own policy — this CSP would break its editor.
 *
 * HSTS is added here because Vercel sent it on its own and Cloudflare does
 * not; the Next policy relies on that (see src/lib/security-headers.ts).
 */
const headersFile = {
  name: "nsv-security-headers",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const lines = [
        "",
        "/*",
        ...securityHeaders.map((h) => `  ${h.key}: ${h.value}`),
        "  Strict-Transport-Security: max-age=63072000; includeSubDomains",
        "",
      ];
      appendFileSync(new URL("_headers", dir), lines.join("\n"));
    },
  },
};

export default defineConfig({
  srcDir: "./site",
  publicDir: "./public",
  output: "server",
  adapter: cloudflare(),
  trailingSlash: "never",
  /* `/uk/about` is written as uk/about.html, not uk/about/index.html, so the
     static asset server answers the URL Next answers — no slash, no redirect. */
  build: { format: "file" },
  integrations: [
    headersFile,
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [
        {
          id: "nsv-rebuild-on-publish",
          version: "1.0.0",
          entrypoint: here("./site/emdash/rebuild-on-publish.ts"),
          format: "native",
          capabilities: ["content:read"],
        },
      ],
    }),
  ],
  devToolbar: { enabled: false },
  vite: {
    define,
    plugins: [
      clientIslands({ root: here("./src") }),
      contentSnapshot({ snapshot: here("./.emdash/snapshot.json"), root: here(".") }),
      adminLocales({ keep: ["en", "uk"] }),
    ],
    resolve: {
      alias: [
        { find: /^@\//, replacement: here("./src/") },
        { find: /^next\/link$/, replacement: here("./site/shims/link.tsx") },
        { find: /^next\/navigation$/, replacement: here("./site/shims/navigation.ts") },
        { find: /^next\/image$/, replacement: here("./site/shims/image.tsx") },
      ],
      dedupe: ["react", "react-dom"],
    },
  },
});

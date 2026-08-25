import path from "node:path";
import type { NextConfig } from "next";

/**
 * Search engines are kept out until SITE_INDEXABLE=true. Announced on every
 * build: the expensive mistake is not blocking a test site, it is launching
 * one that is still blocked, and a silent flag is how that happens.
 */
const indexable = process.env.SITE_INDEXABLE === "true";
console.log(
  indexable
    ? "  SITE_INDEXABLE=true — this build may be indexed by search engines"
    : "  SITE_INDEXABLE is not set — this build serves noindex to search engines",
);

/**
 * Content-Security-Policy.
 *
 * The note that used to sit here said a real policy "needs per-request
 * nonces, which turns every page dynamic". That was the right worry about the
 * wrong directive. Nonces buy one thing: dropping `'unsafe-inline'` from
 * `script-src`. Everything else a CSP does here — `frame-ancestors`,
 * `base-uri`, `form-action`, `object-src`, and pinning every fetch to this
 * origin — costs nothing and needs no nonce, and the site was shipping none
 * of it.
 *
 * So this is the static policy: strict everywhere it can be, `'unsafe-inline'`
 * only where Next's own output requires it, and every page still prerendered.
 *
 * Why the two loose directives are honest rather than lazy:
 *  - `script-src 'unsafe-inline'` — a prerendered Next page carries 13 inline
 *    `self.__next_f.push(...)` blocks whose contents are the RSC payload, so
 *    they differ per page and per build. Hashing them means regenerating the
 *    header on every build for every route; nonces mean per-request rendering.
 *    Neither is worth it *here*, because there is no injection sink to defend:
 *    no database, no user content, no query parameter that reaches markup, and
 *    the one `dangerouslySetInnerHTML` is escaped JSON-LD (`jsonLdHtml` in
 *    lib/seo.ts). Revisit this the day the archive takes input from anyone.
 *  - `style-src 'unsafe-inline'` — 74 `style=""` attributes on the home page
 *    alone, from React inline styles. `style-src-attr` has no nonce mechanism.
 *
 * What it does buy, all of it real:
 *  - `default-src`/`connect-src`/`img-src`/`font-src 'self'` — this site loads
 *    nothing from anywhere else (fonts are self-hosted by next/font, the map
 *    is inline SVG, the old unpkg/jsdelivr fetches are gone). The policy now
 *    says so, so an injected `<img src=https://…>` beacon cannot exfiltrate.
 *  - `frame-ancestors 'self'` — the modern X-Frame-Options, kept alongside it
 *    for the browsers that only read the old one.
 *  - `base-uri 'self'` — an injected `<base>` cannot silently repoint every
 *    relative script and link on the page at another origin.
 *  - `form-action 'self'` — the site has no forms; if one ever appears by
 *    accident it cannot post off-origin.
 *  - `object-src 'none'`, `frame-src 'none'` — no plugins, no iframes.
 */
const vercelPreview =
  process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";

/**
 * Vercel's preview toolbar (comments, the deployment bar) loads from
 * vercel.live and talks to Pusher. Production must not allow either, and does
 * not — the production HTML references neither — but blocking them on preview
 * would break the review tooling the team uses before launch, and someone
 * would then delete the whole policy to get it back.
 */
const previewSources = vercelPreview
  ? {
      script: " https://vercel.live",
      connect: " https://vercel.live wss://ws-us3.pusher.com",
      frame: " https://vercel.live",
      img: " https://vercel.live https://vercel.com",
    }
  : { script: "", connect: "", frame: "", img: "" };

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${previewSources.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data:${previewSources.img}`,
  "font-src 'self'",
  `connect-src 'self'${previewSources.connect}`,
  "manifest-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  `frame-src ${vercelPreview ? `'self'${previewSources.frame}` : "'none'"}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  /**
   * Pin the Turbopack root to this package.
   *
   * Turbopack finds the root by walking up for a lockfile, and there is a
   * stray `~/package-lock.json` on this machine, so it was picking the home
   * directory. That only printed a warning during `next build`, but in `next
   * dev` started from outside the project it broke module resolution outright
   * — every route 500'd on "Can't resolve
   * next/dist/esm/build/adapter/setup-node-env.external".
   *
   * Pinning it makes the dev server independent of the directory it is
   * launched from, and silences the build warning.
   */
  turbopack: {
    root: path.join(__dirname),
  },

  /**
   * Baseline security headers.
   *
   * Nothing here is exploitable today — the site is static and takes no user
   * input — but this is an archive meant to be cited in filings, and these are
   * the headers a reader's security team expects to find. Vercel already sends
   * HSTS.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Stop browsers second-guessing declared content types.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin to other sites, the full path only to our own —
          // decision-page URLs name the case being read.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nobody needs to frame us. Kept alongside `frame-ancestors` above
          // for the browsers that only read the older header. (The comment
          // that used to sit here said "the map is a same-origin iframe" — it
          // has not been an iframe since EventsMap became inline SVG.)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // No page here uses a camera, a microphone or a location.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Kept out of search until launch. See `isIndexable` in lib/seo.ts
          // for why this is a noindex rather than a robots.txt Disallow.
          ...(indexable
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;

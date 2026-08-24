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
   *
   * No Content-Security-Policy yet: the theme script and the JSON-LD blocks
   * are inlined, so a real policy needs per-request nonces, which turns every
   * page dynamic. That trade is worth its own decision, not a drive-by.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop browsers second-guessing declared content types.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin to other sites, the full path only to our own —
          // decision-page URLs name the case being read.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The map is a same-origin iframe; nobody else needs to frame us.
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

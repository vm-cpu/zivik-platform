import type { Metadata } from "next";
import {
  alternateOpenGraphLocales,
  defaultLocale,
  localeOpenGraph,
  locales,
  type Locale,
} from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Absolute site origin, used for canonical URLs, Open Graph and the sitemap.
 * Explicit NEXT_PUBLIC_SITE_URL wins; on Vercel the project's production
 * domain is the default, so canonicals never leak localhost into production.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * Whether this deployment may be indexed by search engines.
 *
 * Defaults to NO. The archive is still filling — 8 of 39 proceedings have a
 * summary — and a half-built version of a legal reference sits in Google's
 * catalogue for months after you fix it. Set SITE_INDEXABLE=true in the Vercel
 * project when the site is ready to be found.
 *
 * Note the mechanism: robots.txt keeps *allowing* the crawl even while this is
 * false, and the noindex is carried by a header and a meta tag instead.
 * Disallowing would be the intuitive move and the wrong one — a blocked
 * crawler cannot read the noindex, so Google may still list the bare URL it
 * found linked somewhere else.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

/** The site-wide share card, used by every page that has no card of its own. */
export const defaultOgImage = "/og/nasvitlo.png";

/**
 * Real pixel size of the share cards in `public/og/`, measured off the files
 * on disk (all nine PNGs are exactly 1200x630 — `scripts/og-cards.py` renders
 * at 2x and downsamples to this size).
 *
 * These are worth emitting: without og:image:width/height a crawler has to
 * fetch the image before it can decide how to lay the card out, so the first
 * unfurl of a link — the one the reader sees — often falls back to the small
 * square thumbnail. 1200x630 is also what tells Twitter/X the card really is
 * `summary_large_image`.
 */
export const ogImageSize = { width: 1200, height: 630 } as const;

/** An Open Graph image descriptor carrying the card's true dimensions. */
export function ogImage(url: string, alt: string) {
  return {
    url,
    alt,
    width: ogImageSize.width,
    height: ogImageSize.height,
    type: "image/png",
  };
}

/** `hreflang` map pointing each locale at its localized home, plus x-default. */
function languageAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = `/${locale}`;
  languages["x-default"] = `/${defaultLocale}`;
  return languages;
}

/** Metadata for the localized home page: title, description, OG, hreflang. */
export function homeMetadata(locale: Locale, dict: Dictionary): Metadata {
  const { title, description, ogAlt } = dict.meta;
  const path = `/${locale}`;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: path,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [ogImage(defaultOgImage, ogAlt)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

/** `hreflang` map for a page that exists at the same path in every locale. */
export function pathAlternates(path: (locale: Locale) => string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = path(locale);
  languages["x-default"] = path(defaultLocale);
  return languages;
}

/** Metadata for a decision page. */
export function decisionMetadata({
  locale,
  slug,
  title,
  description,
  ogAlt,
  siteName,
  image,
}: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  ogAlt: string;
  siteName: string;
  /** Case-specific share card; falls back to the site card. */
  image?: string;
}): Metadata {
  const path = `/${locale}/cases/${slug}`;
  const og = image ?? defaultOgImage;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: pathAlternates((l) => `/${l}/cases/${slug}`),
    },
    openGraph: {
      type: "article",
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: path,
      siteName,
      title,
      description,
      images: [ogImage(og, ogAlt)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

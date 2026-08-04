import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Absolute site origin, used for canonical URLs, Open Graph and the sitemap. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
      locale,
      url: path,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [{ url: "/og/nasvitlo.png", alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/nasvitlo.png"],
    },
  };
}

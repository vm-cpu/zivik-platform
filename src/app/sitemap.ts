import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  );

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "uk" ? 1 : 0.9,
    alternates: { languages },
  }));
}

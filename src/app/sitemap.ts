import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";
import { registryCases } from "@/content/cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  );

  const homes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "uk" ? 1 : 0.9,
    alternates: { languages: homeLanguages },
  }));

  // One entry per decision page per locale, with hreflang between the pair.
  // The registry is the source of truth for which summaries exist.
  const slugs = registryCases
    .map((c) => c.summarySlug)
    .filter((s): s is string => Boolean(s));

  const cases: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${siteUrl}/${locale}/cases/${slug}`]),
    );
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}/cases/${slug}`,
      changeFrequency: "monthly" as const,
      priority: locale === "uk" ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });

  return [...homes, ...cases];
}

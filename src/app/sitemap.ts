import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";
import { registryCases } from "@/content/cases";
import { summaryLastModified } from "@/content/summaries";

/**
 * Absolute hreflang map for one path shape, including `x-default`.
 *
 * The metadata helpers in `lib/seo.ts` have always emitted x-default; the
 * sitemap built its own map by hand and left it out, so the two disagreed
 * about which locale an unmatched reader should land on.
 */
function languagesFor(path: (locale: string) => string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = `${siteUrl}${path(locale)}`;
  languages["x-default"] = `${siteUrl}${path(defaultLocale)}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = languagesFor((l) => `/${l}`);

  const homes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "uk" ? 1 : 0.9,
    alternates: { languages: homeLanguages },
  }));

  /*
   * The registry is the archive's front door — the full 39 proceedings with
   * filters — and it was missing from the sitemap entirely. It changes
   * whenever a case is added or a summary lands, so it tracks the homepage's
   * cadence rather than a decision page's.
   */
  const registryLanguages = languagesFor((l) => `/${l}/registry`);
  const registry: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}/registry`,
    changeFrequency: "weekly",
    priority: locale === "uk" ? 0.9 : 0.8,
    alternates: { languages: registryLanguages },
  }));

  // One entry per decision page per locale, with hreflang between the pair.
  // The registry is the source of truth for which summaries exist.
  const slugs = registryCases
    .map((c) => c.summarySlug)
    .filter((s): s is string => Boolean(s));

  const cases: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const languages = languagesFor((l) => `/${l}/cases/${slug}`);
    const lastModified = summaryLastModified(slug);
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}/cases/${slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: locale === "uk" ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });

  const teamLanguages = languagesFor((l) => `/${l}/team`);
  const team: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}/team`,
    changeFrequency: "yearly",
    priority: 0.5,
    alternates: { languages: teamLanguages },
  }));

  /* The map page is a second way into the same 39 proceedings — worth
     indexing in its own right, and it changes whenever a site gains a
     summarised decision. */
  const mapLanguages = languagesFor((l) => `/${l}/map`);
  const map: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}/map`,
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: { languages: mapLanguages },
  }));

  return [...homes, ...registry, ...map, ...team, ...cases];
}

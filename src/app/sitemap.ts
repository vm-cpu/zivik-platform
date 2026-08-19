import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getContentRepository } from "@/content/repository";
import { siteUrl } from "@/lib/seo";

/** Every locale of one path, with the hreflang alternates each entry needs. */
function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
  );
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    changeFrequency,
    priority: locale === "uk" ? priority : priority - 0.1,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getContentRepository();
  const [cases, posts] = await Promise.all([repo.getCases(), repo.getPosts()]);

  return [
    ...entry("", "weekly", 1),
    ...entry("/registry", "weekly", 0.9),
    ...entry("/map", "monthly", 0.8),
    ...entry("/blog", "weekly", 0.8),
    ...posts.flatMap((post) => entry(`/blog/${post.slug}`, "yearly", 0.7)),
    ...cases
      .filter((c) => c.summarySlug)
      .flatMap((c) => entry(`/cases/${c.summarySlug}`, "monthly", 0.8)),
  ];
}

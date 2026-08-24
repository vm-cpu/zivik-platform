import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Crawling stays allowed either way: the noindex has to be readable to be
  // obeyed. While the site is private it simply stops handing out a map.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isIndexable ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    host: siteUrl,
  };
}

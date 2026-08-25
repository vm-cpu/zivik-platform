import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Crawling stays allowed either way: the noindex has to be readable to be
  // obeyed. While the site is private it simply stops handing out a map —
  // `app/sitemap.ts` withholds the URLs to match, so the file this line would
  // point at is empty rather than merely unadvertised.
  //
  // No `Host:` line. It was a Yandex-only extension, dropped in 2018, never
  // understood by Google or Bing, and it expected a bare hostname — the value
  // emitted here was a full `scheme://host` URL, which even Yandex rejected.
  // The canonical link on every page is what actually declares the origin.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isIndexable ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}

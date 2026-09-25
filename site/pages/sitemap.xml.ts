/** src/app/sitemap.ts, serialised the way Next serialises it. */
import type { APIRoute } from "astro";
import sitemap from "@/app/sitemap";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async () => {
  const entries = await sitemap();
  const urls = entries.map((e) => {
    const parts = [`<loc>${esc(e.url)}</loc>`];
    for (const [lang, href] of Object.entries(e.alternates?.languages ?? {})) {
      parts.push(`<xhtml:link rel="alternate" hreflang="${esc(lang)}" href="${esc(String(href))}" />`);
    }
    if (e.lastModified) parts.push(`<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`);
    if (e.changeFrequency) parts.push(`<changefreq>${e.changeFrequency}</changefreq>`);
    if (e.priority != null) parts.push(`<priority>${e.priority}</priority>`);
    return `<url>\n${parts.join("\n")}\n</url>`;
  });
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${urls.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
};

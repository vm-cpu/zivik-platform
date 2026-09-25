/** src/app/robots.ts, serialised the way Next serialises it. */
import type { APIRoute } from "astro";
import robots from "@/app/robots";

export const GET: APIRoute = () => {
  const r = robots();
  const lines: string[] = [];
  for (const rule of Array.isArray(r.rules) ? r.rules : [r.rules]) {
    for (const ua of [rule.userAgent ?? "*"].flat()) lines.push(`User-Agent: ${ua}`);
    for (const a of [rule.allow ?? []].flat()) lines.push(`Allow: ${a}`);
    for (const d of [rule.disallow ?? []].flat()) lines.push(`Disallow: ${d}`);
    lines.push("");
  }
  for (const s of [r.sitemap ?? []].flat()) lines.push(`Sitemap: ${s}`);
  return new Response(lines.join("\n").trimEnd() + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

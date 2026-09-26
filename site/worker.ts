import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";
import { defaultLocale, isLocale } from "../src/i18n/config";

export { PluginBridge };

/**
 * What reaches the Worker: the EmDash admin and its API, `/`, and 404s. The
 * public pages are static assets and never get here.
 *
 * Three things are settled before EmDash sees the request:
 *
 *   - `/` → `/uk` or `/en` by Accept-Language. Through EmDash it cost a setup
 *     probe and seven more D1 queries (~660 ms) to answer every visitor who
 *     types the bare domain. It is the same rule site/pages/index.ts states.
 *   - `/_emdash/api/search*` without a session is a 404. EmDash makes search
 *     public for sites that render from D1 at request time; this one searches
 *     a static index, so the endpoint served nobody but could make anyone's
 *     request cost 8–11 s of Worker time and D1 reads. The admin, which does
 *     use it, always carries the session cookie.
 *   - HSTS on everything the Worker answers. `_headers` covers the static
 *     files only; on a custom domain nothing else would add it to the admin.
 */
const HSTS = "max-age=63072000; includeSubDomains";

function localeRedirect(request: Request): Response {
  let locale: string = defaultLocale;
  for (const part of (request.headers.get("accept-language") ?? "").split(",")) {
    const tag = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(tag)) {
      locale = tag;
      break;
    }
  }
  return new Response(null, {
    status: 307,
    headers: {
      location: `/${locale}`,
      /* The answer depends on the reader's language: no shared cache may
         hand one reader's redirect to the next. */
      vary: "Accept-Language",
      "cache-control": "private, no-store",
      "strict-transport-security": HSTS,
    },
  });
}

const hasSession = (request: Request) =>
  /(?:^|;\s*)astro-session=/.test(request.headers.get("cookie") ?? "");

export default {
  ...handler,
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/") return localeRedirect(request);
    if (pathname.startsWith("/_emdash/api/search") && !hasSession(request)) {
      return new Response("Not found", { status: 404, headers: { "strict-transport-security": HSTS } });
    }
    const response = await handler.fetch!(request, env, ctx);
    if (response.headers.has("strict-transport-security") || response.status === 101) return response;
    const out = new Response(response.body, response);
    out.headers.set("strict-transport-security", HSTS);
    return out;
  },
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;

import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Next 16 "proxy" (formerly middleware). Redirects the bare root `/` to a
 * locale-prefixed path, preferring the visitor's `Accept-Language`, falling
 * back to `defaultLocale`.
 *
 * Scope is intentionally narrow (`matcher: ["/"]`) so localized pages
 * (`/uk`, `/en`) and the not-yet-migrated routes (`/reader`, `/atlas`, …) are
 * left untouched. Widen the matcher when those routes move under `[locale]`.
 */
function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const tag = part.split(";")[0].trim().slice(0, 2).toLowerCase();
      if (isLocale(tag)) return tag;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};

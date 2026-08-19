import type { Locale } from "@/i18n/config";

/** Long-form date for the active locale, e.g. "17 серпня 2026". */
export function formatDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    locale === "uk" ? "uk-UA" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
}

/** Whole days elapsed between `sinceIso` (UTC midnight) and now. */
export function daysSince(sinceIso: string, now = Date.now()): number {
  const start = Date.parse(`${sinceIso}T00:00:00Z`);
  return Math.max(0, Math.floor((now - start) / 86_400_000));
}

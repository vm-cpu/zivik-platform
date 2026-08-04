/**
 * i18n configuration — single source of truth for supported locales.
 *
 * Locales are exposed as URL prefixes (`/uk`, `/en`) by `src/proxy.ts` and the
 * `app/[locale]` route segment. Keep this list and `defaultLocale` in sync with
 * the dictionaries in `src/i18n/dictionaries/`.
 */

export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uk";

/** Narrows an arbitrary string to a supported `Locale`. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Human-readable language names, keyed by locale (for the language switcher). */
export const localeNames: Record<Locale, string> = {
  uk: "Українська",
  en: "English",
};

/** Short labels shown in the header UA / EN switcher. */
export const localeShortNames: Record<Locale, string> = {
  uk: "UA",
  en: "EN",
};

/** BCP-47 tags for the `<html lang>` attribute and `hreflang` alternates. */
export const localeHtmlLang: Record<Locale, string> = {
  uk: "uk",
  en: "en",
};

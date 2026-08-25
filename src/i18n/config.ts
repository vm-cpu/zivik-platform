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

/**
 * Open Graph locales, keyed by locale.
 *
 * `og:locale` is not BCP-47 and not the same string as `<html lang>`: the
 * Open Graph protocol specifies `language_TERRITORY` with an underscore, and
 * Facebook's crawler validates the value against a fixed list of supported
 * locales — a bare "uk" or "en" is dropped and the default (`en_US`) is
 * assumed, which is how a Ukrainian page ends up announced as American.
 *
 * Territories chosen deliberately:
 *   uk → uk_UA  Ukrainian is only listed for Ukraine; there is no other
 *               candidate territory.
 *   en → en_GB  The English copy is written in British spelling throughout
 *               ("analysed", "summarised", "defence", "Research Centre",
 *               "licence"), the archive's subject matter is European fora
 *               (ECtHR in Strasbourg, ICJ in The Hague), and the readership
 *               it is written for is European rather than American. en_GB is
 *               on Facebook's supported list, so it survives validation.
 */
export const localeOpenGraph: Record<Locale, string> = {
  uk: "uk_UA",
  en: "en_GB",
};

/**
 * The other locales' `og:locale` values, for `og:locale:alternate` — this is
 * how a share card says "the same page also exists in that language".
 */
export function alternateOpenGraphLocales(locale: Locale): string[] {
  return locales.filter((l) => l !== locale).map((l) => localeOpenGraph[l]);
}

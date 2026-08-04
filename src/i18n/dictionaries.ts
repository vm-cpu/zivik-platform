import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/uk";

/**
 * Lazily loads the UI dictionary for a locale. Dictionaries are code-split, so
 * a page only ships the strings for its active locale.
 */
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import("./dictionaries/uk").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

export type { Dictionary };

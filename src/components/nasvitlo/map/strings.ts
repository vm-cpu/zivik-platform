import type { Dictionary } from "@/i18n/dictionaries";

/** Every string the map UI needs, taken straight from the locale dictionary. */
export type MapStrings = Dictionary["mapSection"];

/** Fills `{name}` placeholders, e.g. counter: "{shown} з {total} подій". */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/**
 * "провадження" or "проваджень" — Ukrainian needs the genitive plural from five
 * upwards (2 провадження, 5 проваджень), English only needs a final -s. Both
 * fall out of the same rule: the few-form covers 1–4, the many-form the rest.
 */
export function proceedings(count: number, t: MapStrings): string {
  const lastTwo = count % 100;
  const last = count % 10;
  const few = last >= 1 && last <= 4 && !(lastTwo >= 11 && lastTwo <= 14);
  return few ? t.proceedingsFew : t.proceedingsMany;
}

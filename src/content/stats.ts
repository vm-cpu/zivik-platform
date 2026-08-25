import type { Stat } from "./types";

/**
 * Headline figures.
 *
 * Nothing renders these at the moment: the content brief takes the tile row
 * off the home page. The data stays because it is content, not layout, and
 * the repository still serves it — if the figures return somewhere, this is
 * where they come from.
 */
export const stats: Stat[] = [
  { value: "39", label: { uk: "проваджень", en: "proceedings" }, gilt: true },
  { value: "12", label: { uk: "інстанцій", en: "institutions" } },
];

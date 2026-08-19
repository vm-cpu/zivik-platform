import type { Stat } from "./types";

/**
 * Headline figures shown in the intro band under the hero.
 *
 * Proceedings and instances come from the dataset; the third figure is the
 * running length of the war, counted from 20 February 2014 — the start of
 * Russia's armed aggression as fixed in Ukrainian law. Change `sinceIso` to
 * `2022-02-24` if the full-scale invasion should be the reference point.
 */
export const stats: Stat[] = [
  { value: "39", label: { uk: "проваджень", en: "proceedings" }, gilt: true },
  { value: "12", label: { uk: "інстанцій", en: "institutions" } },
  {
    value: "",
    label: { uk: "днів війни", en: "days of war" },
    live: "warDays",
    sinceIso: "2014-02-20",
  },
];

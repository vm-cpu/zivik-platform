import type { Stat } from "./types";

/** Headline figures shown in the intro band under the hero (from the dataset). */
export const stats: Stat[] = [
  { value: "39", label: { uk: "проваджень", en: "proceedings" }, gilt: true },
  { value: "12", label: { uk: "інстанцій", en: "institutions" } },
  { value: "6", label: { uk: "ордери ICC", en: "ICC warrants" } },
  {
    value: "32",
    label: { uk: "держави-інтервенти", en: "intervening states" },
  },
];

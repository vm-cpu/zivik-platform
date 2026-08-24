import type { Stat } from "./types";

/**
 * Headline figures shown in the intro band under the hero.
 *
 * The ICC-warrant and intervening-state counts used to sit here; the content
 * brief takes them out — they are facts about two particular cases, not about
 * the archive — and puts the war's duration in their place.
 *
 * The duration counts from 20 February 2014. That is the date Ukrainian law
 * ("Про забезпечення прав і свобод громадян та правовий режим на тимчасово
 * окупованій території України") fixes as the start of the temporary
 * occupation, and the date Ukraine's second Article 12(3) declaration gives
 * the ICC jurisdiction from. It is also the period this archive covers: the
 * earliest proceedings in the registry are about 2014, not 2022.
 */
export const stats: Stat[] = [
  { value: "39", label: { uk: "проваджень", en: "proceedings" }, gilt: true },
  { value: "12", label: { uk: "інстанцій", en: "institutions" } },
  {
    since: "2014-02-20",
    label: { uk: "триває війна", en: "of war" },
  },
];

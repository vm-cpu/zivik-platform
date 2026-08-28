/**
 * Content models for the насвітло archive.
 *
 * Backed today by typed files (`src/content/*.ts`); a `PayloadRepository` will
 * later return the same shapes from the CMS, so components never change. Every
 * human-facing string is `Localized` so content is authored per language.
 * Official case citations are single strings (identical across locales).
 */
import type { Locale } from "@/i18n/config";

/** A value provided in every supported locale, e.g. `{ uk: "Гаага", en: "The Hague" }`. */
export type Localized<T = string> = Record<Locale, T>;

/** Resolve a `Localized` value for the active locale. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/**
 * Where the proceedings stand — the first of the two tag dimensions.
 *
 * It replaced a single `CaseStatusKey` — decided / progress / warrant /
 * settled / enforcement / frozen / rejected — which mixed procedural posture
 * with disposition ("progress" and "warrant" answer different questions), so a
 * row could only ever carry one of the two facts. That key and the field that
 * held it are gone: they had survived the split as a `statusKey` on all
 * thirty-nine records that no surface read and no comparator sorted on, and
 * every value it held is recoverable from `stage`, `outcome` and `status`.
 *
 * Every key here is a phrase the source `status` text actually uses; a case
 * whose record does not fix a stage carries none.
 */
export type CaseStageKey =
  | "preliminary" // «попередній етап»
  | "investigation" // «розслідування»
  | "merits" // «розгляд по суті»
  | "satisfaction" // «очікує сатисфакції»
  | "appeal" // «оскаржується»
  | "remitted" // «повернуто на новий розгляд»
  | "enforcement" // «виконання»
  | "suspended" // «призупинено»
  | "frozen" // «заморожено»
  | "upcoming" // «до арбітражу» / «до суду»
  | "concluded"; // the record states a final disposition

/**
 * What the court, tribunal or prosecutor actually issued — the second tag
 * dimension. Absent where the record names no act.
 */
export type CaseOutcomeKey =
  | "judgment" // «рішення винесено»
  | "award" // «остаточне рішення» (arbitration)
  | "verdict" // «вирок»
  | "liability" // «відповідальність встановлена»
  | "warrant" // «ордер видано»
  | "order" // «процедурні накази» (an ICJ/arbitral order, never «ордер»)
  | "upheld" // «арбітраж залишено»
  | "settlement" // «врегульовано»
  | "rejected"; // «відхилено»

/**
 * The order the stages are offered and sorted in — the life-cycle, not an
 * alphabet, so "by stage" reads as a proceeding moving through a court.
 *
 * Here rather than in a component because two surfaces need the same answer:
 * the filter list the server builds in `registry/page.tsx` and the comparator
 * the client sorts with in `RegistryTable`. They each carried a private copy
 * of this array and of `OUTCOME_ORDER` below — identical, and one edit away
 * from disagreeing, which would have shown up as a filter listing the stages
 * in one order while the table sorted them in another.
 */
export const STAGE_ORDER: readonly CaseStageKey[] = [
  "upcoming",
  "preliminary",
  "investigation",
  "merits",
  "satisfaction",
  "appeal",
  "remitted",
  "enforcement",
  "suspended",
  "frozen",
  "concluded",
] as const;

/** Weight of the act, heaviest first. Same two consumers as `STAGE_ORDER`. */
export const OUTCOME_ORDER: readonly CaseOutcomeKey[] = [
  "judgment",
  "award",
  "verdict",
  "liability",
  "upheld",
  "warrant",
  "order",
  "settlement",
  "rejected",
] as const;

/**
 * A date whose precision is part of the fact.
 *
 * The archive records a bare year for most proceedings and an exact day only
 * where a document fixes one. Widening a year into `YYYY-01-01` would invent a
 * date and corrupt any sort built on it, so the two are different shapes and a
 * consumer has to decide what to do with each.
 */
export type CaseDate =
  | { precision: "day"; iso: string; year: number }
  | { precision: "year"; year: number };

export type InstitutionCategory =
  | "international"
  | "arbitration"
  | "national"
  | "executive";

/** A court, tribunal or body that hears cases against Russia. */
export interface Institution {
  /** Stable slug, e.g. `"ecthr"`. */
  id: string;
  /** Abbreviation shown as the badge — may differ by locale (ЄСПЛ ↔ ECtHR). */
  abbr: Localized;
  name: Localized;
  /** Seat city, or null for national/EU groupings. */
  seat: Localized | null;
  category: InstitutionCategory;
  /** Whether this institution appears in the homepage registry (Phase 1). */
  phase1: boolean;
  order: number;
}

/** A single case in the registry. */
export interface RegistryCase {
  id: string;
  /* `num` — the row number from "Cases for the platform.xlsx" — was here and
     is gone. It addressed a spreadsheet, not a proceeding; `id` is what every
     route, link and filter on the site uses. */
  /** References `Institution.id`. */
  institutionId: string;
  /** Official citation — identical in both locales. */
  name: string;
  /**
   * The same case, said in Ukrainian.
   *
   * Not a translation of the citation and not a replacement for it: the
   * caption is what the case is filed as and it does not change language. This
   * is the line a Ukrainian reader needs beside it, because the surfaces that
   * list these rows are Ukrainian and the rows are not — the map's «Які саме»
   * block put twenty-two English arbitration styles, forty words apiece, into
   * a card whose every other word was Ukrainian.
   *
   * Ukrainian only, and optional. A row whose caption is already Ukrainian
   * needs nothing, and the English locale never shows this: there the citation
   * is in the reader's own language and a second line would be a repetition.
   *
   * NEEDS THE OWNER'S REVIEW where a name had to be rendered rather than
   * copied — the company names in the PCA arbitrations are transliterated back
   * from the English caption and the statutory Ukrainian name may differ, and
   * the ICC warrants are given as the first and last name the Court's own
   * warrants use, without the patronymic.
   */
  nameUk?: string;
  type: Localized;
  /** Procedural posture. Omitted where the record does not fix one. */
  stage?: CaseStageKey;
  /** What the forum issued. Omitted where the record names no act. */
  outcome?: CaseOutcomeKey;
  /** Full status wording. */
  status: Localized;
  /** Year the proceeding was commenced (docket year), not the decision year. */
  year: number | null;
  /**
   * Date of the operative decision, where the record fixes one on this row.
   * For the summarised cases the date comes from the summary's `judgment.date`
   * instead, so it is never transcribed twice; nothing sets this today.
   */
  decidedOn?: CaseDate;
  /**
   * Amount at stake in USD — the sum claimed, not the sum awarded.
   *
   * That is what the field is labelled as everywhere it renders («Сума у
   * спорі» / "Amount in dispute"), and it is the only meaning that works
   * across all thirty-nine rows: thirty-one of them have no award to state.
   *
   * TWO ROWS DISAGREE WITH THAT AND NEED THE OWNER. `pca-28` (DTEK) holds
   * 207,800,000, which is exactly the sum awarded — its own write-up records
   * the claim as ≥ USD 421,198,000. `pca-23` (Oschadbank) holds 1,100,000,000,
   * which is the award of 1,111,300,729 rounded. Neither claim figure can be
   * sourced from this repository for both rows, so nothing was changed: a
   * registry that sorts and filters on this column must not have two of its
   * rows quietly measuring something else, and picking a number to make the
   * column consistent would be worse than the inconsistency.
   */
  amountUsd: number | null;
  /** Short context / docket reference. */
  note: Localized;
  /**
   * Page count of the decision, if known — four of the thirty-nine.
   *
   * It has a surface now: `components/cases/CasePending.tsx` prints it as
   * «Обсяг рішення» on the page of a proceeding that has no write-up yet,
   * where how long the unread document is turns out to be worth saying. That
   * covers one of the four (pca-20); the other three — icj-1, icj-2, ecthr-5
   * — carry a summary, and there the figure the page prints is
   * `judgment.pages`, a different field. The checker holds the two together
   * where a row has both.
   */
  pages: number | null;
  /** Link to the decision or case page. */
  decisionUrl: string | null;
  /**
   * What is actually at the other end of `decisionUrl`.
   *
   * The button offering it says "Документ суду", and for a while everything it
   * pointed at was one. It cannot stay that way: of the seventeen records that
   * had no link, only some can be given the decision itself. Five of the
   * Crimea arbitrations keep their awards confidential and the most the
   * tribunal has published is a press release; two proceedings do not exist
   * yet and the only public account is the claimant's own notice; one is
   * traceable solely through a case database; one is known only from the
   * national broadcaster because the prosecution's page is unreachable.
   *
   * Those are all worth linking and none of them is a court document. The kind
   * travels with the link so the label can say what the reader is about to
   * open, rather than promising a judgment and delivering a press release.
   *
   * Omitted where the link is the decision or the forum's own case page, which
   * is what the default label already describes.
   */
  decisionUrlKind?:
    | "press-release"
    | "case-page"
    | "party"
    | "database"
    | "report";
  /** Slug of the on-site decision page, when a summary has been published. */
  summarySlug?: string;
  /** True once a summary/timeline/documents exist ("lit" vs merely registered). */
  lit: boolean;
}

/** A headline statistic in the intro band. */
export interface Stat {
  value: string;
  label: Localized;
  gilt?: boolean;
}

/** A partner organisation. */
export interface Partner {
  id: string;
  name: Localized;
  logo?: string;
  url?: string;
}

/**
 * One outbound link inside the about prose.
 *
 * `text` is a literal substring of one of the paragraphs, not a separate
 * label: the sentence names the document — «резолюція «Територіальна
 * цілісність України»» — and the name itself is what the reader clicks. A
 * `text` that no paragraph contains renders as nothing, which is why
 * `checkAbout` in content/about.ts fails the build on one.
 */
export interface AboutLink {
  text: string;
  href: string;
}

/** "About the library" prose, per locale. */
export interface AboutContent {
  title: Localized;
  paragraphs: Localized<string[]>;
  /** Optional; absent means the paragraphs are plain text. */
  links?: Localized<AboutLink[]>;
}

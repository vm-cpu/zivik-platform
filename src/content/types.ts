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

/** Normalised case status driving the chip colour/label (source status is free text). */
export type CaseStatusKey =
  | "decided"
  | "progress"
  | "warrant"
  | "settled"
  | "enforcement"
  | "frozen"
  | "rejected";

/**
 * Where the proceedings stand — the first of the two tag dimensions.
 *
 * `CaseStatusKey` above mixed procedural posture with disposition ("progress"
 * and "warrant" answer different questions), so a row could only ever carry
 * one of the two facts. Every key here is a phrase the source `status` text
 * actually uses; a case whose record does not fix a stage carries none.
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
  /** Sequence number from the source table (null for the umbrella ICC situation). */
  num: number | null;
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
  /** Normalised status for the chip. */
  statusKey: CaseStatusKey;
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
  /** Amount at stake in USD, if applicable. */
  amountUsd: number | null;
  /** Short context / docket reference. */
  note: Localized;
  /** Page count of the decision, if known. */
  pages: number | null;
  /** Link to the decision or case page. */
  decisionUrl: string | null;
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

/** "About the library" prose, per locale. */
export interface AboutContent {
  title: Localized;
  paragraphs: Localized<string[]>;
}

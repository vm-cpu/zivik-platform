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

/** Geographic point as `[longitude, latitude]` (d3-geo order). */
export type LonLat = [number, number];

/** Normalised case status driving the chip colour/label (source status is free text). */
export type CaseStatusKey =
  | "decided"
  | "progress"
  | "warrant"
  | "settled"
  | "enforcement"
  | "frozen"
  | "rejected";

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
  type: Localized;
  /** Normalised status for the chip. */
  statusKey: CaseStatusKey;
  /** Full status wording. */
  status: Localized;
  year: number | null;
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

/** A court location on the events map (a hub city may host several seats). */
export interface CourtHub {
  id: string;
  city: Localized;
  coord: LonLat;
  seats: Array<{ abbr: string; name: Localized }>;
}

/** An event on the map, linked to the courts that hear it. */
export interface MapEvent {
  id: string;
  coord: LonLat;
  category: "hr" | "war" | "asset";
  size: number;
  tag?: Localized;
  eyebrow: Localized;
  title: Localized;
  note: Localized;
  hubs: string[];
  forum: Localized;
  cases: Localized;
  fresh?: boolean;
  freshLabel?: Localized;
  featured?: boolean;
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

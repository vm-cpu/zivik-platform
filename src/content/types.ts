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

/**
 * A seat city on the events map. One city can host several institutions (The
 * Hague holds the ICJ, the ICC, the PCA and the Dutch courts), so the seats and
 * the case counts shown on the map are derived from `institutionIds` — never
 * typed out a second time, and never able to drift from the registry.
 */
export interface CourtHub {
  id: string;
  city: Localized;
  coord: LonLat;
  /** References `Institution.id`. */
  institutionIds: string[];
}

/** Category of an alleged violation; drives the marker colour and the filter. */
export type MapEventCategory = "hr" | "war" | "asset";

/**
 * An alleged violation pinned to the place it happened. `caseIds` is the whole
 * link to the law: the courts it connects to, the lines drawn on the map and
 * the "read the decision" links are all resolved from those cases, so a case
 * added to the registry shows up on the map without editing anything here.
 */
export interface MapEvent {
  id: string;
  coord: LonLat;
  category: MapEventCategory;
  /** Relative marker weight, 1 (minor) to 3 (defining). */
  weight: 1 | 2 | 3;
  /** Date or period line above the title, e.g. "17.07.2014". */
  eyebrow: Localized;
  title: Localized;
  note: Localized;
  /** References `RegistryCase.id`. */
  caseIds: string[];
  /** Opens selected when the map first loads (at most one). */
  featured?: boolean;
}

/** A headline statistic in the intro band. */
export interface Stat {
  value: string;
  label: Localized;
  gilt?: boolean;
  /**
   * Marks a figure that must be counted, not authored. `warDays` renders the
   * days elapsed since `sinceIso` and keeps ticking in the browser, so a
   * statically built page never shows a stale number.
   */
  live?: "warDays";
  /** Start date (ISO) for a `live` figure. */
  sinceIso?: string;
}

/** A member of the project team. */
export interface TeamMember {
  id: string;
  name: Localized;
  /** Role as it should read in each language (UA titles differ from the EN ones). */
  role: Localized;
  /**
   * Portrait under `/public/team/` (e.g. `/team/olha-denkovych.jpg`). Optional:
   * the section renders as a plain masthead until the photos arrive, and
   * switches to portraits as soon as they do.
   */
  photo?: string;
  order: number;
}

/** A partner organisation. */
export interface Partner {
  id: string;
  name: Localized;
  logo?: string;
  url?: string;
}

/** A blog entry. Bodies are plain paragraphs until the CMS supplies rich text. */
export interface Post {
  id: string;
  /** URL segment, shared across locales: `/uk/blog/<slug>`. */
  slug: string;
  /** Publication date, ISO `YYYY-MM-DD`. */
  date: string;
  title: Localized;
  /** One- or two-sentence teaser for the index and for `<meta description>`. */
  excerpt: Localized;
  body: Localized<string[]>;
  /** Optional byline; omit for institutional posts. */
  author?: Localized;
  /** Optional short kicker, e.g. "Аналітика" / "Analysis". */
  kicker?: Localized;
}

/** "About the library" prose, per locale. */
export interface AboutContent {
  title: Localized;
  paragraphs: Localized<string[]>;
}

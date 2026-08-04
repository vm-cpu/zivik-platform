/**
 * Content models for the насвітло archive.
 *
 * These are the shapes the UI consumes. Today they are backed by typed files
 * (`src/content/*.ts`); later a `PayloadRepository` will return the same shapes
 * from the CMS, so components never change. Every human-facing string is
 * `Localized` so content is authored per language.
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

export type CaseStatus = "decided" | "progress" | "warrant" | "queued";

export type EventCategory = "hr" | "war" | "asset";

/** A court / instance that hears cases (registry accordion group). */
export interface Court {
  /** Stable slug, e.g. `"ecthr"`. */
  id: string;
  /** Abbreviation shown as the badge — differs by locale (ЄСПЛ ↔ ECtHR). */
  abbr: Localized;
  /** Full name, e.g. "Європейський суд з прав людини". */
  name: Localized;
  /** Seat city, e.g. "Страсбург". */
  seat: Localized;
  /** Total number of cases before this court. */
  total: number;
  /** How many have been fully processed ("lit"). */
  analysed: number;
  /** Sort order in the registry. */
  order: number;
}

/** A single case in the registry. */
export interface RegistryCase {
  id: string;
  /** References `Court.id`. */
  courtId: string;
  title: Localized;
  note: Localized;
  status: CaseStatus;
  /** Display date or range, e.g. "09.07.2025" or "2022 →". */
  date: string;
  /** Whether the case has a summary/timeline/documents ("lit" vs queued). */
  lit: boolean;
}

/** A court location on the events map (a hub city may host several seats). */
export interface CourtHub {
  id: string;
  city: Localized;
  coord: LonLat;
  /** [abbr, full name] pairs of the courts seated here. */
  seats: Array<{ abbr: string; name: Localized }>;
}

/** An event on the map, linked to the courts that hear it. */
export interface MapEvent {
  id: string;
  coord: LonLat;
  category: EventCategory;
  /** Pin size in px. */
  size: number;
  tag?: Localized;
  eyebrow: Localized;
  title: Localized;
  note: Localized;
  /** References `CourtHub.id`. */
  hubs: string[];
  forum: Localized;
  cases: Localized;
  fresh?: boolean;
  freshLabel?: Localized;
  /** Open the popup by default (used for the featured event). */
  featured?: boolean;
}

/** A headline statistic in the intro band. */
export interface Stat {
  value: string;
  label: Localized;
  /** Render the number in the gold accent. */
  gilt?: boolean;
}

/** A partner organisation. */
export interface Partner {
  id: string;
  name: Localized;
  /** Path under `/public/logos/partners/`, if a real logo exists yet. */
  logo?: string;
  url?: string;
}

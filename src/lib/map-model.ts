/**
 * Builds the events map's view model on the server.
 *
 * The map's job is to get a reader from "this happened" to "this is the court
 * that ruled on it, and here is the decision". That link is resolved here,
 * once, from the registry — so the client component holds no case knowledge and
 * cannot show a court that isn't actually hearing something.
 */
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getContentRepository, type ContentRepository } from "@/content/repository";
import {
  pick,
  type CaseStatusKey,
  type LonLat,
  type MapEventCategory,
  type PlacePrecision,
} from "@/content/types";

/** One proceeding as the map panel shows it. */
export interface MapCaseView {
  id: string;
  courtId: string;
  courtAbbr: string;
  courtName: string;
  /** Official citation, exactly as in the registry. */
  name: string;
  status: string;
  statusKey: CaseStatusKey;
  year: number | null;
  /** On-site summary page, when one has been published. */
  summaryHref: string | null;
  /** The court's own text of the decision. */
  decisionUrl: string | null;
  lit: boolean;
}

/** What the marker's coordinate means, ready to render. */
export interface MapPlaceView {
  label: string;
  precision: PlacePrecision;
  /** Where the place comes from: a proceeding on the site, or an outside source. */
  sourceLabel: string | null;
  sourceHref: string | null;
}

export interface MapEventView {
  id: string;
  coord: LonLat;
  place: MapPlaceView;
  category: MapEventCategory;
  weight: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  note: string;
  cases: MapCaseView[];
  /** Seat cities the cases are heard in — the lines drawn from this pin. */
  hubIds: string[];
  /** Forums with no pin on the map (ICAO in Montreal), named in the panel. */
  offMapForums: string[];
  /** How many of the cases already have a summary on the site. */
  litCount: number;
  featured: boolean;
}

export interface MapHubView {
  id: string;
  city: string;
  coord: LonLat;
  seats: Array<{ id: string; abbr: string; name: string }>;
  caseCount: number;
  /** Registry, pre-filtered to this city's courts. */
  registryHref: string;
}

export interface MapModel {
  events: MapEventView[];
  hubs: MapHubView[];
  /** Cases reachable only through a courthouse, not through any pinned event. */
  unmappedCount: number;
  totalCases: number;
}

/** Category labels/colours are UI chrome, so they live in the dictionary. */
export function categoryLabel(
  category: MapEventCategory,
  dict: Dictionary,
): string {
  return dict.mapSection.categories[category];
}

export async function buildMapModel(
  locale: Locale,
  repo: ContentRepository = getContentRepository(),
): Promise<MapModel> {
  const [events, hubs, cases, institutions] = await Promise.all([
    repo.getMapEvents(),
    repo.getCourtHubs(),
    repo.getCases(),
    repo.getInstitutions(),
  ]);

  const caseById = new Map(cases.map((c) => [c.id, c]));
  const institutionById = new Map(institutions.map((i) => [i.id, i]));
  /** institution id → hub id, for turning a case into a line on the map. */
  const hubByInstitution = new Map<string, string>();
  for (const hub of hubs) {
    for (const id of hub.institutionIds) hubByInstitution.set(id, hub.id);
  }

  const mappedCaseIds = new Set<string>();

  const eventViews: MapEventView[] = events.map((event) => {
    const hubIds: string[] = [];
    const offMapForums: string[] = [];

    const resolved: MapCaseView[] = event.caseIds.flatMap((caseId) => {
      const c = caseById.get(caseId);
      // A dangling id is a content error, not a runtime one: skip it rather
      // than draw a line to nowhere.
      if (!c) return [];
      mappedCaseIds.add(c.id);

      const institution = institutionById.get(c.institutionId);
      const hubId = hubByInstitution.get(c.institutionId);
      if (hubId && !hubIds.includes(hubId)) hubIds.push(hubId);
      if (!hubId && institution) {
        const label = pick(institution.abbr, locale);
        if (!offMapForums.includes(label)) offMapForums.push(label);
      }

      return [
        {
          id: c.id,
          courtId: c.institutionId,
          courtAbbr: institution ? pick(institution.abbr, locale) : c.institutionId,
          courtName: institution ? pick(institution.name, locale) : c.institutionId,
          name: c.name,
          status: pick(c.status, locale),
          statusKey: c.statusKey,
          year: c.year,
          summaryHref: c.summarySlug ? `/${locale}/cases/${c.summarySlug}` : null,
          decisionUrl: c.decisionUrl,
          lit: c.lit,
        },
      ];
    });

    // Analysed cases first, then by year — the reader should meet the
    // decisions we can actually explain before the queued ones.
    resolved.sort((a, b) => {
      if (a.lit !== b.lit) return a.lit ? -1 : 1;
      return (b.year ?? 0) - (a.year ?? 0);
    });

    // Prefer the proceeding that fixes the place: it is the strongest basis we
    // can show, and it links to the decision itself.
    const basisCase = event.place.sourceCaseId
      ? caseById.get(event.place.sourceCaseId)
      : undefined;
    const basisInstitution = basisCase
      ? institutionById.get(basisCase.institutionId)
      : undefined;

    const place: MapPlaceView = {
      label: pick(event.place.label, locale),
      precision: event.place.precision,
      sourceLabel: basisCase
        ? `${basisInstitution ? pick(basisInstitution.abbr, locale) : basisCase.institutionId} — ${basisCase.name}`
        : event.place.source
          ? pick(event.place.source.label, locale)
          : null,
      sourceHref: basisCase
        ? (basisCase.summarySlug
            ? `/${locale}/cases/${basisCase.summarySlug}`
            : basisCase.decisionUrl)
        : (event.place.source?.url ?? null),
    };

    return {
      id: event.id,
      coord: event.coord,
      place,
      category: event.category,
      weight: event.weight,
      eyebrow: pick(event.eyebrow, locale),
      title: pick(event.title, locale),
      note: pick(event.note, locale),
      cases: resolved,
      hubIds,
      offMapForums,
      litCount: resolved.filter((c) => c.lit).length,
      featured: Boolean(event.featured),
    };
  });

  const hubViews: MapHubView[] = hubs.map((hub) => ({
    id: hub.id,
    city: pick(hub.city, locale),
    coord: hub.coord,
    seats: hub.institutionIds.flatMap((id) => {
      const institution = institutionById.get(id);
      return institution
        ? [
            {
              id,
              abbr: pick(institution.abbr, locale),
              name: pick(institution.name, locale),
            },
          ]
        : [];
    }),
    caseCount: cases.filter((c) => hub.institutionIds.includes(c.institutionId))
      .length,
    registryHref: `/${locale}/registry?court=${hub.institutionIds[0]}`,
  }));

  return {
    events: eventViews,
    hubs: hubViews,
    unmappedCount: cases.length - mappedCaseIds.size,
    totalCases: cases.length,
  };
}

import { MAP_EVENTS, MAP_COURTS } from "./map";
import { registryCases } from "./cases";
import { SUMMARIES } from "./summaries";
import { pick } from "./types";
import type { Locale } from "@/i18n/config";

/**
 * Map event → the decisions it leads to.
 *
 * `summaries/index.ts` already refuses to build when the registry and the
 * pages disagree; this does the same for the map. A slug that no longer has a
 * page would otherwise ship as a link to a 404, and the map is the one place
 * on the site where a reader clicks without having read a case name first.
 */
{
  const missing = MAP_EVENTS.flatMap((e) =>
    (e.cases ?? []).filter((slug) => !(slug in SUMMARIES)).map((slug) => `${e.key} → ${slug}`),
  );
  if (missing.length) {
    throw new Error(
      `map.ts links to decisions that do not exist:\n  ${missing.join("\n  ")}`,
    );
  }
}

/**
 * Every registry institution must be seated in exactly one city on the map.
 *
 * The map draws six places where harm happened; the archive holds 39
 * proceedings, and before this the ten heard by the Dutch courts, the ICAO
 * Council, the ICC arbitration court, Lithuania and the EU appeared nowhere.
 * Now a court answers for its own caseload — which is only true while every
 * institution has a seat, so the build checks it.
 */
{
  const seated = MAP_COURTS.flatMap((c) => c.institutionIds);
  const dupes = seated.filter((id, i) => seated.indexOf(id) !== i);
  const orphans = [...new Set(registryCases.map((c) => c.institutionId))].filter(
    (id) => !seated.includes(id),
  );
  if (orphans.length || dupes.length) {
    throw new Error(
      [
        orphans.length && `institutions with no seat on the map: ${orphans.join(", ")}`,
        dupes.length && `institutions seated twice: ${dupes.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

export interface MapCaseLink {
  slug: string;
  title: string;
  forum: string;
}

/** Resolved once per render, on the server, so the client gets one language. */
export function caseLinksFor(eventKey: string, locale: Locale): MapCaseLink[] {
  const event = MAP_EVENTS.find((e) => e.key === eventKey);
  return (event?.cases ?? []).map((slug) => {
    const s = SUMMARIES[slug];
    return {
      slug,
      // `title` is optional on DecisionSummary; the masthead parties are
      // what the case is filed as, so they stand in when it is absent.
      title: s.title ? pick(s.title, locale) : s.masthead.parties,
      // Forum is institution + seat; the row shows the institution alone,
      // since the seat is already what the marker's line points at.
      forum: s.forum ? pick(s.forum.institution, locale) : "",
    };
  });
}

/** What a court hears, from the registry rather than from the six map sites. */
export function courtCaseloadFor(courtKey: string, locale: Locale) {
  const court = MAP_COURTS.find((c) => c.key === courtKey);
  const cases = registryCases.filter((c) =>
    (court?.institutionIds ?? []).includes(c.institutionId),
  );
  return {
    total: cases.length,
    /** The ones a reader can actually open. */
    written: cases
      .filter((c) => c.summarySlug && c.summarySlug in SUMMARIES)
      .map((c) => {
        const s = SUMMARIES[c.summarySlug as string];
        return {
          slug: c.summarySlug as string,
          title: s.title ? pick(s.title, locale) : s.masthead.parties,
        };
      }),
    /**
     * The rest, by name. A card that said «2 провадження у бібліотеці» and
     * then «ці провадження не привʼязані до жодного з шести місць» told the
     * reader a number and a negative and left them asking what Stockholm was
     * doing on the map at all. Naming them answers it: two Naftogaz–Gazprom
     * arbitrations, an asset immobilisation, an extradition. The registry's
     * own name and docket, nothing composed here.
     */
    listed: cases
      .filter((c) => !(c.summarySlug && c.summarySlug in SUMMARIES))
      .map((c) => ({ id: c.id, name: c.name, note: pick(c.note, locale) })),
  };
}

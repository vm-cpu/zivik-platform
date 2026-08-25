import { MAP_EVENTS } from "./map";
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

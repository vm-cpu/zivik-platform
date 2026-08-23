import type { DecisionSummary } from "./types";
import { registryCases } from "@/content/cases";
import { icjCerdIcsft } from "./icj-cerd-icsft";
import { icjGenocide } from "./icj-genocide";
import { oschadbank } from "./oschadbank";
import { iccUkraine } from "./icc-ukraine";
import { dtekKrymenergo } from "./dtek-krymenergo";
import { echrUkraineNetherlands } from "./echr-ukraine-netherlands";
import { finlandTorden } from "./finland-torden";
import { hagueMh17 } from "./hague-mh17";

/**
 * Slug → decision summary: the one list of pages that exist. The page
 * template renders from it, the sitemap enumerates it — one place to add a
 * case, one place for both consumers to see it.
 */
export const SUMMARIES: Record<string, DecisionSummary> = {
  "icj-cerd-icsft": icjCerdIcsft,
  "icj-genocide": icjGenocide,
  oschadbank: oschadbank,
  "icc-ukraine": iccUkraine,
  "dtek-krymenergo": dtekKrymenergo,
  "echr-ukraine-netherlands": echrUkraineNetherlands,
  "finland-torden": finlandTorden,
  "hague-mh17": hagueMh17,
};

/**
 * The registry (`cases.ts`) links cases by `summarySlug`; SUMMARIES is what
 * actually renders. A typo on either side used to build green and 404 in
 * production — so this module refuses to build while they disagree.
 */
{
  const linked = registryCases
    .map((c) => c.summarySlug)
    .filter((x): x is string => Boolean(x));
  const orphanLinks = linked.filter((slug) => !(slug in SUMMARIES));
  const orphanPages = Object.entries(SUMMARIES).filter(
    ([, s]) => !registryCases.some((c) => c.id === s.caseId),
  );
  const unlinkedPages = Object.keys(SUMMARIES).filter((slug) => !linked.includes(slug));
  if (orphanLinks.length || orphanPages.length || unlinkedPages.length) {
    throw new Error(
      `Registry ↔ SUMMARIES out of sync. ` +
        `summarySlug without a page: [${orphanLinks}]; ` +
        `page whose caseId is not in the registry: [${orphanPages.map(([k]) => k)}]; ` +
        `page no registry row links to: [${unlinkedPages}]`,
    );
  }
}

/** Freshness of a page: its context-verification date, else the decision date. */
export function summaryLastModified(slug: string): string | undefined {
  const s = SUMMARIES[slug];
  return s?.asOf ?? s?.judgment.date;
}

import { MAP_EVENTS, MAP_COURTS } from "./map";
import { registryCases } from "./cases";
import { SUMMARIES } from "./summaries";
import { pick } from "./types";
import type { Locale } from "@/i18n/config";
import type { CaseStageKey } from "./types";

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
  /**
   * Where the proceeding stands, and what is at stake in it.
   *
   * The map counted rows and said nothing about consequences: every card gave
   * a number of proceedings and none of them gave a figure or a posture, while
   * the registry beside it carries both on every row. The largest award in the
   * collection — $1.1bn in Oschadbank — appeared nowhere on the map at all.
   *
   * `stage` is the registry's own key, resolved to a label by the render site,
   * which has the dictionary. `amount` is already formatted: the sign in the
   * source encodes which way the money ran, and that is not something a tag
   * can caption honestly, so this is the magnitude and the label calls it the
   * sum in dispute — the same wording, from the same reasoning, as the pending
   * case page.
   */
  stage?: CaseStageKey;
  amount?: string;
}

/**
 * Amount at stake, short. See `MapCaseLink`.
 *
 * Compact rather than the grouped figure the pending case page prints. That
 * page sets the amount as a field in a definition list with the width of the
 * page behind it; here it is a tag inside a 300px card, and «1 100 000 000
 * USD» is thirteen digits and a currency across a column that also has to hold
 * the name of the case. `compact` gives «1,1 млрд $» and "$1.1B" — the same
 * number, at the precision a tag can carry.
 *
 * The magnitude, not the signed value: the sign in the source encodes which
 * way the money ran — the gas sales arbitration is recorded as −2.02bn — and
 * that is not something a tag can caption honestly, so the label calls it the
 * sum in dispute and leaves the direction to the case.
 */
function money(amountUsd: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.abs(amountUsd));
}

/** The registry row a summary was written from, if the registry has one. */
const rowFor = (slug: string) => registryCases.find((c) => c.summarySlug === slug);

/** Resolved once per render, on the server, so the client gets one language. */
export function caseLinksFor(eventKey: string, locale: Locale): MapCaseLink[] {
  const event = MAP_EVENTS.find((e) => e.key === eventKey);
  return (event?.cases ?? []).map((slug) => {
    const s = SUMMARIES[slug];
    const row = rowFor(slug);
    return {
      slug,
      stage: row?.stage,
      amount: row?.amountUsd != null ? money(row.amountUsd, locale) : undefined,
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
    /**
     * The registry institutions this seat stands for, so a card can hand the
     * reader the rest of the caseload instead of printing it. `/registry`
     * opens filtered on `?court=`, and takes several ids separated by commas —
     * The Hague alone seats four (ICJ, ICC, PCA, the Dutch courts).
     */
    courtIds: court?.institutionIds ?? [],
    total: cases.length,
    /** The ones a reader can actually open. */
    written: cases
      .filter((c) => c.summarySlug && c.summarySlug in SUMMARIES)
      .map((c) => {
        const s = SUMMARIES[c.summarySlug as string];
        return {
          slug: c.summarySlug as string,
          title: s.title ? pick(s.title, locale) : s.masthead.parties,
          stage: c.stage,
          amount: c.amountUsd != null ? money(c.amountUsd, locale) : undefined,
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
      .map((c) => ({
        id: c.id,
        name: c.name,
        note: pick(c.note, locale),
        stage: c.stage,
        amount: c.amountUsd != null ? money(c.amountUsd, locale) : undefined,
      })),
  };
}

/**
 * The library's glossary, gathered from the decisions that use it.
 *
 * Every write-up carries its own `glossary` — the terms a reader of *that*
 * decision needs. Fifty-four entries across the eight, fifty distinct terms.
 * This assembles them into one dictionary and, for each term, keeps the trail
 * back to the decisions it came from.
 *
 * ── One term, sometimes two definitions, and that is the point ─────────────
 * Four terms appear in more than one write-up, and none of the four is a
 * duplicate. They are the same words doing different work in different forums:
 *
 *   «Hors de combat» — in the ECtHR case, "the wounded, prisoners, those who
 *   laid down arms; killing or torturing them breaches both IHL and the
 *   Convention"; in the Finnish criminal case, "the wounded and those who
 *   surrendered; killing them is wilful killing under the Geneva Conventions".
 *
 *   «ДНР» / «ЛНР» — under CERD/ICSFT, "self-proclaimed entities in eastern
 *   Ukraine, supported by Russia"; in the Genocide case, "…recognised by
 *   Russia on 21 February 2022".
 *
 * Merging those into one definition would throw away the only interesting
 * thing about them. So a term keeps every reading it has, each attributed to
 * the decision it belongs to. A reader who wants to know what a word means
 * gets the answer; a reader who wants to know how a word is *used* gets the
 * comparison, which is what a legal dictionary is for.
 *
 * Built at module scope from `SUMMARIES`, so the page is static and adding a
 * write-up adds its terms with no second place to edit.
 */
import { SUMMARIES } from "@/content/summaries";
import type { Locale } from "@/i18n/config";
import { pick, type Localized } from "@/content/types";

/** One decision's reading of a term. */
export interface GlossarySense {
  /** Summary slug — the decision this definition is taken from. */
  slug: string;
  /** That decision's display title, for the link. */
  caseTitle: Localized;
  /** The forum that decided it, for the eyebrow on the link. */
  forum: Localized;
  def: Localized;
}

/** One headword. */
export interface GlossaryEntry {
  /** Stable key, derived from the Ukrainian headword. Used in URLs. */
  id: string;
  term: Localized;
  /** One per decision that defines it, in the order the decisions are listed. */
  senses: GlossarySense[];
}

/**
 * The letter a term files under, per locale.
 *
 * Terms mix scripts — «ДІД (BIT)» beside "Hors de combat" — so the index has
 * to hold both alphabets at once rather than pretending the collection is
 * Cyrillic. Quotation marks and guillemets are stripped first: «ДНР» files
 * under Д, not under «.
 */
export function initialOf(term: string): string {
  const ch = sortKey(term).charAt(0).toUpperCase();
  return /[\p{L}]/u.test(ch) ? ch : "#";
}

/**
 * What a headword files under.
 *
 * Leading punctuation is stripped before sorting, not only before indexing.
 * Sorting the raw string put «ДНР» / «ЛНР» and every other guillemetted term
 * at the head of the list — ahead of А — because the guillemet sorts before
 * any letter, so the page opened Д, П, Р, А… while its own alphabet ran in
 * order. The index and the order have to be computed from the same string.
 */
export function sortKey(term: string): string {
  return term.replace(/^[«»"'“„\s(]+/, "");
}

/** A url-safe id. Cyrillic survives percent-encoding; this keeps it readable. */
function idOf(uk: string): string {
  return uk
    .toLowerCase()
    .replace(/[«»"'“„]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

function build(): GlossaryEntry[] {
  const byTerm = new Map<string, GlossaryEntry>();

  for (const [slug, summary] of Object.entries(SUMMARIES)) {
    const caseTitle: Localized = summary.title ?? {
      uk: summary.masthead.parties,
      en: summary.masthead.parties,
    };
    const forum: Localized = summary.forum?.institution ?? {
      uk: "Міжнародний суд ООН",
      en: "International Court of Justice",
    };

    for (const g of summary.glossary) {
      /* Keyed on the Ukrainian headword. The English is carried along but is
         not the key: two decisions can render the same Ukrainian term with
         slightly different English and they are still one headword. */
      const key = g.term.uk.trim().toLowerCase();
      let entry = byTerm.get(key);
      if (!entry) {
        entry = { id: idOf(g.term.uk), term: g.term, senses: [] };
        byTerm.set(key, entry);
      }
      entry.senses.push({ slug, caseTitle, forum, def: g.def });
    }
  }

  return [...byTerm.values()];
}

/** Every headword, unsorted — the page sorts per locale. */
export const GLOSSARY: GlossaryEntry[] = build();

/**
 * Sorted for a locale, using that locale's own collation.
 *
 * `localeCompare` with the Ukrainian locale puts Cyrillic in Ukrainian order
 * (і, ї, ґ where they belong, not where their code points fall) and sorts the
 * Latin headwords into the same list rather than into a second one.
 */
export function glossaryFor(locale: Locale): GlossaryEntry[] {
  const tag = locale === "uk" ? "uk" : "en";
  return [...GLOSSARY].sort((a, b) =>
    sortKey(pick(a.term, locale)).localeCompare(
      sortKey(pick(b.term, locale)),
      tag,
      { sensitivity: "base" },
    ),
  );
}

/** The letters actually in use, in the same collation, for the index. */
export function initialsFor(locale: Locale): string[] {
  const tag = locale === "uk" ? "uk" : "en";
  const seen = new Set(
    glossaryFor(locale).map((e) => initialOf(pick(e.term, locale))),
  );
  return [...seen].sort((a, b) => a.localeCompare(b, tag));
}

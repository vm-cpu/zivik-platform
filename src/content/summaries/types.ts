/**
 * Decision-summary content model.
 *
 * The prose is authored elsewhere (the source .docx) and ingested VERBATIM into
 * `*.verbatim.json` — never edited by hand. A sibling module adds a thin
 * visualization layer (facts, timeline, verdict matrix, theatres) whose every
 * value is traceable to a statement in that same verbatim text. Components read
 * `DecisionSummary`; a future Payload collection will return the same shape.
 */

/** One block of the verbatim summary, tagged with its structural role. */
export type SummaryBlockKind =
  | "lead" // opening paragraph
  | "h2" // numbered top-level heading
  | "h3" // sub-heading
  | "h4" // (a)/(b)/(c) label
  | "p" // body paragraph
  | "dispositif" // an operative finding in the Court's disposition
  | "findings" // a multi-part findings table (newline-separated blocks)
  | "link"; // a source / further-reading URL

export interface SummaryBlock {
  kind: SummaryBlockKind;
  text: string;
}

/** Raw verbatim payload as ingested from the .docx (shape of the JSON file). */
export interface VerbatimSummary {
  id: string;
  caseId: string;
  masthead: { official: string; parties: string; judgment: string };
  /** Source-language body (English — the language of the judgment). */
  blocks: SummaryBlock[];
  /** Ukrainian translation of the body (draft, pending legal review). */
  blocksUk?: SummaryBlock[];
}

import type { Localized } from "@/content/types";

/** A headline metric tile for the outcome dashboard. */
export interface Stat {
  value: string;
  label: Localized;
}

/** A single key/value fact for the "at a glance" instrument. */
export interface GlanceFact {
  label: Localized;
  value: Localized;
}

/** A dated event for the timeline instrument. */
export interface TimelineEvent {
  date: Localized;
  label: Localized;
  kind?: "filing" | "order" | "judgment" | "context";
}

/** One row of the verdict matrix — how the Court disposed of a claim. */
export interface Verdict {
  track: "ICSFT" | "CERD" | "Provisional measures";
  claim: Localized;
  outcome: "violation" | "no-violation";
}

/** A geographic theatre the case concerns, anchored to the map. */
export interface Theatre {
  place: Localized;
  treaty: string;
  /** Map marker key in `ukraine-map.json` this theatre highlights. */
  markerKeys: string[];
  summary: Localized;
}

/** A treaty the case turns on, linked to its official text. */
export interface Instrument {
  abbr: string;
  name: Localized;
  year: number;
  /** Official published text of the convention. */
  url: string;
}

/** The judgment itself, on the court's own site. */
export interface JudgmentSource {
  court: Localized;
  /** Direct link to the judgment document (PDF). */
  url: string;
  /** The court's case-overview page. */
  caseUrl: string;
  pages: number;
}

/** Plain-language framing for non-lawyers. */
export interface PlainLanguage {
  /** 2–3 sentence "what this is and how it ended", in everyday words. */
  tldr: Localized;
  /** Practical significance — why a non-lawyer should care. */
  whyMatters: Localized;
}

/** A glossary term with a plain definition. */
export interface GlossaryTerm {
  term: Localized;
  def: Localized;
}

/** An actor in the case, explained in one line. */
export interface WhoEntry {
  name: Localized;
  role: Localized;
  kind: "party" | "court" | "actor";
}

/** A plain-language question and answer. */
export interface FaqEntry {
  q: Localized;
  a: Localized;
}

/** A pointer to a related case. */
export interface RelatedCase {
  label: Localized;
  note: Localized;
  href: string;
}

/** A doctrinal ruling the Court settled on a point of law. */
export interface Interpretation {
  term: Localized;
  ruling: Localized;
}

/** A provisional measure from the interim Order and its compliance finding. */
export interface ProvisionalMeasure {
  measure: Localized;
  order: "violated" | "complied";
  note?: Localized;
}

/** A cited commentary or analysis, with bibliographic metadata. */
export interface Citation {
  url: string;
  title: string;
  authors: string;
  publication: string;
  date: string;
  /** "blog post" | "journal article" | "news/insight" | "preprint/repository" */
  type: string;
}

/** Everything a decision page renders. */
export interface DecisionSummary extends VerbatimSummary {
  plain: PlainLanguage;
  glossary: GlossaryTerm[];
  whoIsWho: WhoEntry[];
  faq: FaqEntry[];
  related: RelatedCase[];
  judgment: JudgmentSource;
  instruments: Instrument[];
  stats: Stat[];
  glance: GlanceFact[];
  timeline: TimelineEvent[];
  verdicts: Verdict[];
  interpretations: Interpretation[];
  provisionalMeasures: ProvisionalMeasure[];
  theatres: Theatre[];
  sources: Citation[];
}

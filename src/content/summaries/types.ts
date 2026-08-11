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
  blocks: SummaryBlock[];
}

/** A single key/value fact for the "at a glance" instrument. */
export interface GlanceFact {
  label: string;
  value: string;
}

/** A dated event for the timeline instrument. */
export interface TimelineEvent {
  date: string;
  label: string;
  kind?: "filing" | "order" | "judgment" | "context";
}

/** One row of the verdict matrix — how the Court disposed of a claim. */
export interface Verdict {
  track: "ICSFT" | "CERD" | "Provisional measures";
  claim: string;
  outcome: "violation" | "no-violation";
}

/** A geographic theatre the case concerns. */
export interface Theatre {
  place: string;
  treaty: string;
  summary: string;
}

/** Everything a decision page renders. */
export interface DecisionSummary extends VerbatimSummary {
  glance: GlanceFact[];
  timeline: TimelineEvent[];
  verdicts: Verdict[];
  theatres: Theatre[];
}

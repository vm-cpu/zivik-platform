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
  /** A bare numeral reads the same in both locales; anything with a word in
   *  it ("$1.1B" / "$1,1 млрд") must be localized. */
  value: string | Localized;
  label: Localized;
  /** Give this tile the accent treatment — one per dashboard. */
  em?: boolean;
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
  /**
   * Optional filter group for the interactive timeline (e.g. "arbitration",
   * "french-courts"). Events without a track render in every filter.
   */
  track?: string;
  /** One sentence of detail, revealed when the reader opens the entry. */
  note?: Localized;
  /** Sort key, ISO 8601 — the visible `date` may be a range or a month. */
  iso?: string;
}

/** A named filter for the interactive timeline. */
export interface TimelineTrack {
  id: string;
  label: Localized;
}

/**
 * How a claim was disposed of. `violation`/`no-violation` are the court-style
 * pair; `granted`/`rejected`/`not-decided` fit an arbitral dispositif, where a
 * tribunal may uphold jurisdiction, reject an objection, or leave alternative
 * claims undecided for judicial economy.
 */
export type Outcome =
  | "violation"
  | "no-violation"
  | "granted"
  | "rejected"
  | "not-decided";

/** One row of the verdict matrix — how the court or tribunal disposed of a claim. */
export interface Verdict {
  /**
   * Grouping key, e.g. a treaty ("CERD") or a stage ("Jurisdiction"). Where it
   * matches an `Instrument.abbr` the heading links to the official text.
   */
  track: string;
  /** Display form of the track, when the key is not a proper name. */
  trackLabel?: Localized;
  claim: Localized;
  outcome: Outcome;
}

/** One measured quantity in the "what was taken" instrument. */
export interface Metric {
  label: Localized;
  /** Localize anything a locale writes differently ("16.5%" / "16,5%"). */
  value: string | Localized;
  /** Share of a whole, 0–100 — draws a bar instead of a plain figure. */
  percent?: number;
  /** Countable units — draws one mark per unit (capped in the component). */
  count?: number;
  note?: Localized;
}

/** A sum of money the decision turns on, optionally split into parts. */
export interface MoneyFigure {
  label: Localized;
  /** Display value, already formatted ("≈ $1.11 billion"). */
  display: string;
  /** Magnitude in a single unit (USD), used to scale the bars. */
  amount: number;
  parts?: { label: Localized; display: string; amount: number }[];
  /** Render as an open-ended / estimated bar rather than a solid one. */
  estimated?: boolean;
  note?: Localized;
}

/** A body whose conduct was attributed to the respondent State. */
export interface AttributionNode {
  actor: Localized;
  /** The rule relied on, e.g. "ILC art. 4". */
  basis: string;
  basisNote: Localized;
  did: Localized;
}

/** One vote in an operative clause: a majority against a minority. */
export interface Vote {
  for: number;
  against: number;
  /** What this vote covered, when one claim was voted on more than once. */
  scope?: Localized;
}

/** A jurisdictional objection and how it fared. */
export interface Objection {
  ground: Localized;
  /** Latin tag, e.g. "ratione temporis". */
  latin?: string;
  objection: Localized;
  outcome: "rejected" | "upheld";
  reasoning: Localized;
  /** How the bench divided, where the dispositif records a vote. */
  votes?: Vote[];
}

/** One charge on an arrest warrant, tied to its Rome Statute article. */
export interface Charge {
  /** Statute article, e.g. "8(2)(a)(vii)". */
  art: string;
  label: Localized;
  /** "war-crime" | "crime-against-humanity" — sets the chip colour. */
  kind: "war-crime" | "cah";
}

/** One suspect on a warrant of arrest. */
export interface WarrantPerson {
  name: Localized;
  role: Localized;
  born?: string;
  charges: Charge[];
  /** Modes of individual responsibility, e.g. "25(3)(a)". */
  modes: { art: string; label: Localized }[];
  /** Rung of the chain of command this person sits on (index into `rungs`). */
  rung?: number;
}

/** One wave of warrants issued the same day on one theory of the case. */
export interface WarrantWave {
  date: Localized;
  iso: string;
  theme: Localized;
  /** What the wave is about, in one sentence. */
  summary: Localized;
  persons: WarrantPerson[];
  /** The Court's announcement of this wave. */
  url: string;
}

/** One step in the life of a decision after it was rendered. */
export interface Stage {
  year: string;
  title: Localized;
  note: Localized;
  /** Did this step keep the decision standing? */
  standing: "yes" | "no";
}

/** A geographic theatre the case concerns, anchored to the map. */
export interface Theatre {
  place: Localized;
  /** Short over-title tag; localize it when it is a word, not an acronym. */
  treaty: string | Localized;
  /** Map marker key in `ukraine-map.json` this theatre highlights. */
  markerKeys: string[];
  summary: Localized;
  /** Nudge the label off a collision with the seat, a city or a neighbour. */
  labelDx?: number;
  labelDy?: number;
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
  /** Length of the published text, where it is known. */
  pages?: number;
  /** Delivery date as ISO 8601 (YYYY-MM-DD) — used in structured data. */
  date: string;
  /** Label for the primary action, when "read the judgment" does not fit. */
  readLabel?: Localized;
  /** Label for the secondary action (the institution's case file). */
  fileLabel?: Localized;
}

/** The institution that decided, and where it sat — shown in the masthead. */
export interface Forum {
  /** Institution, e.g. "Permanent Court of Arbitration". */
  institution: Localized;
  /** Seat of the proceedings, e.g. "Paris". */
  seat: Localized;
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

/**
 * Everything a decision page renders.
 *
 * The required fields are the ones every decision has: prose, parties, a
 * dispositif, a date. The optional ones are instruments a particular decision
 * earns — an inter-State judgment brings provisional measures and treaty
 * theatres; an investment award brings money, attribution and a set-aside
 * history. A page renders only the instruments its case actually fills.
 */
export interface DecisionSummary extends VerbatimSummary {
  /**
   * Localized display title for the masthead H1 and page metadata. The
   * verbatim masthead stays English (the language of the record); the H1 is
   * chrome, and a UA reader should not lose the page's headline. `en`
   * normally repeats the verbatim parties line.
   */
  title?: Localized;
  /**
   * Date the page's context layer was last verified against its sources
   * (ISO 8601). For live dockets — an ICC situation, an enforcement stage —
   * it renders next to the out-of-record figures and feeds `dateModified` in
   * the structured data.
   */
  asOf?: string;
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
  sources: Citation[];

  /** Institution and seat; defaults to the ICJ in The Hague when absent. */
  forum?: Forum;
  /** Heading for the verdict matrix, when "what the Court found" is wrong. */
  verdictsHeading?: Localized;
  /** Heading for the map, when neither "two theatres" nor the seat fits. */
  theatresHeading?: Localized;
  /** Filters for the timeline. Absent → a plain, unfiltered timeline. */
  timelineTracks?: TimelineTrack[];
  provisionalMeasures?: ProvisionalMeasure[];
  theatres?: Theatre[];
  /**
   * Map framing: which marker is the seat, and where the reach line points.
   * Defaults to The Hague → Kyiv. The labels come from `forum`.
   */
  mapFocus?: { forumKey: string; reachTo?: string };
  takings?: { heading: Localized; note?: Localized; metrics: Metric[] };
  attribution?: { respondent: Localized; note: Localized; nodes: AttributionNode[] };
  amounts?: { note?: Localized; figures: MoneyFigure[] };
  objections?: {
    heading: Localized;
    note: Localized;
    items: Objection[];
    /** Judges sitting, so a vote reads as a proportion of the bench. */
    benchSize?: number;
  };
  afterlife?: { heading: Localized; note: Localized; stages: Stage[] };
  /**
   * Warrants of arrest — the core instrument of an ICC page. `waves` group the
   * suspects by issuance date and theory of the case; `rungs`, when present,
   * name the levels of the chain of command and turn the wall into a ladder:
   * one spine of power, each suspect pinned to their rung, coloured by wave.
   */
  warrants?: {
    heading: Localized;
    note: Localized;
    waves: WarrantWave[];
    rungs?: Localized[];
  };
}

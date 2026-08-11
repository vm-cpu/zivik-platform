import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./icj-cerd-icsft.verbatim.json";

/**
 * ICSFT & CERD (Ukraine v. Russian Federation), ICJ Judgment of 31 January 2024.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source .docx.
 * The fields below add a visualization layer — facts, timeline, verdicts and
 * theatres — each of which restates something already stated in that prose:
 *   • the timeline dates all appear in the text (Crimea 2014, filing 2017,
 *     the 19 April 2017 Order, the 31 January 2024 Judgment);
 *   • the verdict matrix mirrors the operative findings in "4. LEGAL
 *     CONSEQUENCES" (the dispositif);
 *   • the theatres restate the two factual tracks (eastern Ukraine → ICSFT,
 *     Crimea → CERD).
 */
export const icjCerdIcsft: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),

  glance: [
    { label: "Applicant", value: "Ukraine" },
    { label: "Respondent", value: "Russian Federation" },
    { label: "Court", value: "International Court of Justice" },
    { label: "Seat", value: "The Hague" },
    { label: "General List", value: "No. 166" },
    { label: "Instruments", value: "ICSFT (1999) · CERD (1965)" },
    { label: "Judgment", value: "31 January 2024" },
    { label: "Length", value: "213 pages" },
  ],

  timeline: [
    {
      date: "Early 2014",
      label: "Russian Federation takes control of the Crimean peninsula",
      kind: "context",
    },
    {
      date: "2017",
      label: "Ukraine institutes proceedings before the Court",
      kind: "filing",
    },
    {
      date: "19 Apr 2017",
      label: "Order indicating provisional measures",
      kind: "order",
    },
    {
      date: "31 Jan 2024",
      label: "Judgment on the merits",
      kind: "judgment",
    },
  ],

  verdicts: [
    { track: "ICSFT", claim: "Art. 9(1) — failure to investigate", outcome: "violation" },
    { track: "ICSFT", claim: "All other submissions", outcome: "no-violation" },
    {
      track: "CERD",
      claim: "Arts. 2(1)(a) & 5(e)(v) — Ukrainian-language education",
      outcome: "violation",
    },
    { track: "CERD", claim: "All other submissions", outcome: "no-violation" },
    {
      track: "Provisional measures",
      claim: "Maintaining the ban on the Mejlis",
      outcome: "violation",
    },
    {
      track: "Provisional measures",
      claim: "Aggravating / extending the dispute",
      outcome: "violation",
    },
    { track: "Provisional measures", claim: "All other submissions", outcome: "no-violation" },
  ],

  theatres: [
    {
      place: "Eastern Ukraine",
      treaty: "ICSFT",
      summary:
        "Alleged financing of armed groups linked to the “DPR” and “LPR” — terrorism-financing track.",
    },
    {
      place: "Crimea",
      treaty: "CERD",
      summary:
        "Alleged campaign of racial discrimination against Crimean Tatars and ethnic Ukrainians.",
    },
  ],
};

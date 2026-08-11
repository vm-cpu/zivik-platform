import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./icj-cerd-icsft.verbatim.json";

/**
 * ICSFT & CERD (Ukraine v. Russian Federation), ICJ Judgment of 31 January 2024.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source .docx
 * (English — the language of the judgment). The fields below add a localized
 * visualization layer — stats, facts, timeline, verdicts and theatres — whose
 * every value restates something already in that prose:
 *   • timeline dates all appear in the text (Crimea 2014, filing 2017, the
 *     19 April 2017 Order, the 31 January 2024 Judgment);
 *   • the verdict matrix mirrors the operative findings in "4. LEGAL
 *     CONSEQUENCES" (the dispositif) — four violations, the rest rejected;
 *   • the theatres restate the two factual tracks (eastern Ukraine → ICSFT,
 *     Crimea → CERD) and anchor them to the map.
 * Short chrome strings are localized UA/EN; the body prose stays English.
 */
export const icjCerdIcsft: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),

  stats: [
    { value: "2", label: { uk: "конвенції", en: "conventions" } },
    { value: "4", label: { uk: "порушення", en: "violations found" } },
    { value: "7", label: { uk: "років розгляду", en: "years to judgment" } },
    { value: "213", label: { uk: "сторінок", en: "pages" } },
  ],

  glance: [
    { label: { uk: "Заявник", en: "Applicant" }, value: { uk: "Україна", en: "Ukraine" } },
    {
      label: { uk: "Відповідач", en: "Respondent" },
      value: { uk: "Російська Федерація", en: "Russian Federation" },
    },
    {
      label: { uk: "Суд", en: "Court" },
      value: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
    },
    { label: { uk: "Місце", en: "Seat" }, value: { uk: "Гаага", en: "The Hague" } },
    { label: { uk: "Загальний список", en: "General List" }, value: { uk: "№ 166", en: "No. 166" } },
    {
      label: { uk: "Рішення", en: "Judgment" },
      value: { uk: "31 січня 2024", en: "31 January 2024" },
    },
  ],

  timeline: [
    {
      date: { uk: "поч. 2014", en: "Early 2014" },
      label: {
        uk: "РФ встановлює контроль над Кримським півостровом",
        en: "Russian Federation takes control of the Crimean peninsula",
      },
      kind: "context",
    },
    {
      date: { uk: "2017", en: "2017" },
      label: {
        uk: "Україна подає позов до Суду",
        en: "Ukraine institutes proceedings before the Court",
      },
      kind: "filing",
    },
    {
      date: { uk: "19 квіт. 2017", en: "19 Apr 2017" },
      label: {
        uk: "Наказ про тимчасові заходи",
        en: "Order indicating provisional measures",
      },
      kind: "order",
    },
    {
      date: { uk: "31 січ. 2024", en: "31 Jan 2024" },
      label: { uk: "Рішення по суті", en: "Judgment on the merits" },
      kind: "judgment",
    },
  ],

  verdicts: [
    {
      track: "ICSFT",
      claim: { uk: "Ст. 9(1) — нерозслідування", en: "Art. 9(1) — failure to investigate" },
      outcome: "violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: {
        uk: "Ст. 2(1)(a) і 5(e)(v) — освіта українською",
        en: "Arts. 2(1)(a) & 5(e)(v) — Ukrainian-language education",
      },
      outcome: "violation",
    },
    {
      track: "CERD",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
    },
    {
      track: "Provisional measures",
      claim: { uk: "Збереження заборони Меджлісу", en: "Maintaining the ban on the Mejlis" },
      outcome: "violation",
    },
    {
      track: "Provisional measures",
      claim: { uk: "Загострення спору", en: "Aggravating / extending the dispute" },
      outcome: "violation",
    },
    {
      track: "Provisional measures",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
    },
  ],

  theatres: [
    {
      place: { uk: "Східна Україна", en: "Eastern Ukraine" },
      treaty: "ICSFT",
      markerKeys: ["donetsk", "luhansk"],
      summary: {
        uk: "Ймовірне фінансування збройних груп «ДНР» і «ЛНР» — трек фінансування тероризму.",
        en: "Alleged financing of armed groups linked to the “DPR” and “LPR” — terrorism-financing track.",
      },
    },
    {
      place: { uk: "Крим", en: "Crimea" },
      treaty: "CERD",
      markerKeys: ["crimea"],
      summary: {
        uk: "Ймовірна кампанія расової дискримінації проти кримських татар і етнічних українців.",
        en: "Alleged campaign of racial discrimination against Crimean Tatars and ethnic Ukrainians.",
      },
    },
  ],
};

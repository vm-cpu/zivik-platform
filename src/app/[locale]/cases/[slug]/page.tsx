import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decisionMetadata, jsonLdHtml, siteUrl } from "@/lib/seo";
import { foreignLang, isLocale, type Locale } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import TermSearch from "@/components/cases/TermSearch";
import CaseToc from "@/components/cases/CaseToc";
import ToTop from "@/components/cases/ToTop";
import { markTerms, type TermRef } from "@/content/mark-terms";
import TermTooltips from "@/components/cases/TermTooltips";
import CaseTimeline from "@/components/cases/CaseTimeline";
import MoneyBars from "@/components/cases/MoneyBars";
import AttributionTree from "@/components/cases/AttributionTree";
import ObjectionCards from "@/components/cases/ObjectionCards";
import TakingsGrid from "@/components/cases/TakingsGrid";
import VerdictMatrix from "@/components/cases/VerdictMatrix";
import AfterlifeStrip from "@/components/cases/AfterlifeStrip";
import WarrantWall from "@/components/cases/WarrantWall";
import CaseMap from "@/components/cases/CaseMap";
import { registryCases } from "@/content/cases";
import CasePending, { pendingMetadata } from "@/components/cases/CasePending";
import "./pending.css";
import { SUMMARIES } from "@/content/summaries";
import { sortKey, idOf } from "@/content/glossary";
import { glossaryEnabled } from "@/lib/flags";
import type { Localized } from "@/content/types";
import type {
  DecisionSummary,
  Outcome,
  SummaryBlock,
  Theatre,
} from "@/content/summaries/types";
import atlas from "@/content/europe-map.json";
// One stylesheet per concern, imported in cascade order — the 2000-line
// monolith was where parallel sessions collided. Order matters: it must
// reproduce the original file's cascade exactly.
import "../case/00-base.css";
import "../case/10-bands.css";
import "../case/20-dashboard.css";
import "../case/30-paper.css";
import "../case/40-instruments.css";
import "../case/50-responsive.css";
import "../case/60-warrants.css";
import "../case/70-chrome.css";
import "../case/80-page.css";


/** Localized chrome labels (the summary body stays in its source language). */
const T = {
  /* The row of counters used to be headed «Огляд» / "Overview", and the chip
     that led here said the same. Review: «Розділ "ОГЛЯД" я б назвала "ЯКЩО
     КОРОТКО"» — so `inShort` is the chip now, and it points at the paragraph
     a reader would call the overview. What is left over the counters is a row
     of figures, and says so; naming it «Якщо коротко» too would have printed
     the same heading twice in one screen. */
  /* Heading for `DecisionSummary.glance` — the docket facts. Distinct from
     `inShort` ("Якщо коротко"), which heads the plain-language tldr: one is a
     ledger of identifiers, the other is a paragraph. */
  glanceH: { uk: "Картка справи", en: "Case at a glance" },
  timeline: { uk: "Хронологія", en: "Timeline" },
  tracks: { uk: "Два театри", en: "Two theatres" },
  found: { uk: "Що встановив Суд", en: "What the Court found" },
  /* «Порушено», not «Порушення»: the column answers what the forum did with
     the claim, and every other answer in it is a participle — «Відхилено»,
     «Не встановлено». A noun among them read as a different kind of answer. */
  violation: { uk: "Порушено", en: "Violation found" },
  noViolation: { uk: "Немає", en: "No violation" },
  /* The scorecard's noun has to agree with the number printed in front of it,
     and the number depends on what kind of dispositif this is. Three
     Ukrainian forms; English reads the same three keys. */
  ofTotal: { uk: "з", en: "of" },
  /* The catch-all clauses, said once under the heading instead of three times
     in the table. */
  restRejected: { uk: "решту вимог відхилено", en: "all other submissions rejected" },
  /* Used where the index lists the rejected claims itself, so the line can
     count them instead of gesturing at them. No noun after the figure: the
     genitive it would need changes with the number in Ukrainian («з 2
     вимог», «з 21 вимоги») and the column head already says what a row is. */
  restCounted: { uk: "відхилено", en: "rejected" },
  /* Not every claim the forum did not uphold was rejected, and this line used
     to call them all rejected. On icj-genocide submissions (c) and (d) were
     held ADMISSIBLE and then found to be outside the Court's jurisdiction, so
     «2 відхилено» under the heading contradicted the two rows below it — the
     same untruth the owner caught in the rows themselves: «"Not decided" не
     коректне формулювання». Counted apart, with the word that is true of both
     senses of `not-decided`: the tribunal that reaches its answer on other
     grounds and the court that finds it has no power to answer at all both
     leave the claim undecided. */
  restUndecided: { uk: "залишено без вирішення", en: "left undecided" },
  /* The control over the folded half of the index. It names the number, so
     a reader sees what is behind it before deciding to open it. */
  showRejected: { uk: "Показати решту вимог", en: "Show the other claims" },
  hideRejected: { uk: "Згорнути", en: "Collapse" },
  sortedBy: { uk: "Сортувати", en: "Sort" },
  /* Spoken, not drawn: the arrow is hidden from a screen reader, so the
     direction has to be in the control's name. */
  sortAsc: { uk: "зараз за зростанням", en: "currently ascending" },
  sortDesc: { uk: "зараз за спаданням", en: "currently descending" },
  violationWord: {
    uk: { one: "порушення", few: "порушення", many: "порушень" },
    en: { one: "violation", few: "violations", many: "violations" },
  },
  convictionWord: {
    uk: { one: "засудження", few: "засудження", many: "засуджень" },
    en: { one: "conviction", few: "convictions", many: "convictions" },
  },
  grantedWord: {
    uk: { one: "вимогу задоволено", few: "вимоги задоволено", many: "вимог задоволено" },
    en: { one: "claim upheld", few: "claims upheld", many: "claims upheld" },
  },
  sources: { uk: "Джерела та коментарі", en: "Sources and commentary" },
  back: { uk: "До бібліотеки", en: "Back to the library" },
  readJudgment: { uk: "Читати рішення", en: "Read the judgment" },
  caseFile: { uk: "Справа на сайті Суду", en: "Case file at the Court" },
  keyRulings: { uk: "Ключові тлумачення", en: "Key rulings on the law" },
  provMeasures: { uk: "Тимчасові заходи", en: "Provisional measures" },
  /* `provSub` used to live here, hardcoded to "Наказ від 19 квітня 2017" /
     "Order of 19 April 2017" — right for icj-cerd-icsft and for nothing else.
     It is now `DecisionSummary.provisionalMeasuresOrder`, and index.ts refuses
     to build a summary that has the instrument without naming its Order. */
  orderBreached: { uk: "Наказ порушено", en: "Order breached" },
  orderComplied: { uk: "Дотримано", en: "Complied" },
  inShort: { uk: "Якщо коротко", en: "In short" },
  whyMatters: { uk: "Чому це важливо", en: "Why it matters" },
  onThisPage: { uk: "На цій сторінці", en: "On this page" },
  /* The two sides of a finding, as column captions. «Твердила» and not
     «стверджує»: the argument was made, the Court has since answered it. */
  claimed: { uk: "Сторона твердила", en: "The party argued" },
  courtPosition: { uk: "Позиція Суду", en: "The Court's position" },
  /* The measure a limb of an order required, set beside the argument and
     the answer as the third thing in the exchange. */
  ordered: { uk: "Наказано", en: "Ordered" },
  /* The index's column heads. Named for what each column holds: the provision
     the claim was made under, the claim, and what the forum did with it. */
  /* «Підстава», not «Стаття»: the column holds the instrument or the order a
     claim was made under — ICSFT, CERD, the Order on provisional measures —
     and the article itself is in the claim beside it. It was «Стаття», which
     promised one thing and held another. */
  ixArticle: { uk: "Підстава", en: "Basis" },
  ixClaim: { uk: "Вимога", en: "Claim" },
  ixResult: { uk: "Результат", en: "Result" },
  progress: { uk: "Прогрес читання", en: "Reading progress" },
  glossaryH: { uk: "Словник", en: "Glossary" },

  /* The theatre map's text alternative. It was the literal string "Map of
     Europe" — English on a Ukrainian page, so a Ukrainian voice spoke it
     phonetically, and it said nothing about what the drawing shows. The
     legend under the map already carries the seat and the places as text;
     this says what kind of drawing they belong to. */
  mapAlt: {
    uk: "Мапа Європи: місце розгляду справи та території, яких вона стосується — перелічені під мапою",
    en: "Map of Europe: the seat of the proceedings and the territories concerned — listed below the map",
  },

  // Outcomes beyond the court-style violation / no-violation pair.
  granted: { uk: "Задоволено", en: "Upheld" },
  rejected: { uk: "Відхилено", en: "Rejected" },
  notDecided: { uk: "Не розглядалося", en: "Not decided" },
  convicted: { uk: "Засуджено", en: "Convicted" },
  acquitted: { uk: "Виправдано", en: "Acquitted" },

  // Instruments an arbitral award earns.
  allEvents: { uk: "Усе", en: "All" },
  /* The name of the filter row itself. It used to be labelled with
     `allEvents`, so the group announced itself as «Усе» — the name of the
     first control inside it, not of the set. */
  trackFilter: { uk: "Фільтр за напрямом", en: "Filter by track" },
  openDetail: { uk: "Показати деталі", en: "Show detail" },
  /* That the marks on the theatre map answer. Only rendered where the case has
     more than one theatre — with a single one there is nothing to tell apart,
     and the sentence would be an instruction for its own sake. */
  mapPick: {
    uk: "Натисніть позначку або рядок — засвітиться те саме місце.",
    en: "Press a mark or a line — the same place lights up.",
  },
  /* The year rail. It was `aria-hidden` decoration and read as decoration: a
     row of dots placed by year, so ten events in 2022 stacked into one mark
     and the reader saw four dots for twenty events. Placed by date and
     pressable, it is the index of the chronology under it. */
  railLabel: { uk: "Перейти до події за датою", en: "Jump to an event by date" },
  amountsH: { uk: "Суми", en: "Amounts" },
  shareOf: { uk: "від суми", en: "of the total" },
  /* Not `shareOf`: that one belongs to sums of money and reads «від суми».
     This names a counted whole — «9,5% з 19 546+». */
  ofWhole: { uk: "з", en: "of" },
  attributionH: { uk: "Чия поведінка — це поведінка держави", en: "Whose conduct counts as the State's" },
  objectionLbl: { uk: "Заперечення", en: "Objection" },
  rulingLbl: { uk: "Рішення суду", en: "Ruling" },
  objRejected: { uk: "Відхилено", en: "Rejected" },
  objUpheld: { uk: "Прийнято", en: "Upheld" },
  standing: { uk: "Рішення чинне", en: "Award stands" },
  notStanding: { uk: "Рішення скасовано", en: "Award annulled" },
  /* «Місце розгляду», not «Місце арбітражу». This is the default heading for
     the map band on any case that names one theatre and authors no heading of
     its own — and it was rendering on ICJ CERD/ICSFT, which is not an
     arbitration. The two locales did not agree either: the English has always
     read the neutral "Seat". */
  seatLabel: { uk: "Місце розгляду", en: "Seat" },

  // Warrant wall.
  chargesLbl: { uk: "Звинувачення", en: "Charges" },
  modesLbl: { uk: "Форма відповідальності", en: "Mode of responsibility" },
  announcementLbl: { uk: "Повідомлення Суду", en: "The Court's announcement" },
  warCrimeLbl: { uk: "Воєнний злочин", en: "War crime" },
  cahLbl: { uk: "Злочин проти людяності", en: "Crime against humanity" },
  asOf: { uk: "станом на", en: "as of" },

  // Page-level navigation and the reader's-guide band.
  navAria: { uk: "Розділи сторінки", en: "Page sections" },
  /* `navWarrants` («Ордери»), `navAnatomy` («Розбір рішення») and
     `navRulings` («Тлумачення») stood here: four rail words for bands headed
     something else on the page. The rail reads each band's own heading now —
     see `theatresLabel` and `machineryLabel`. */
  toTop: { uk: "Нагору", en: "Top" },
  toChronology: { uk: "До цієї дати в хронології", en: "To this date in the chronology" },
  ofLargest: { uk: "від найбільшої суми тут", en: "of the largest sum here" },
  /* `floored` stood here — a sentence on any bar the minimum width had to
     widen. It was written when a small bar was a stub alone on the ground and
     nothing else on the row said how small the sum was. Both of those are
     answered now: the bar sits in a rail that is the largest figure on the
     page, and the share is printed beside it to two decimal places. What was
     left was nine words of apology, in the brightest colour in the block,
     under a figure that was already legible. */
  /* Only printed when a dot field runs past what it can draw. */
  dotCap: {
    uk: "На полі показано перші {n} позначок.",
    en: "The field draws the first {n} marks.",
  },
  /* The chip has to name the band it lands on. It said «Що варто знати» /
     "What to know" and landed on a band headed «Хто є хто» / "Who's who" — a
     reader clicking for a primer got a cast list. The band's own heading is
     the label now; the glossary underneath it, which was silently annexed to
     this destination, gets its own entry below. */
  navGlossary: { uk: "Словник", en: "Glossary" },
  termsSearch: { uk: "Знайти термін…", en: "Find a term…" },
  termsSearchLabel: { uk: "Пошук у словнику справи", en: "Search this case's terms" },
  termsClear: { uk: "Очистити пошук", en: "Clear search" },
  termsEmpty: {
    uk: "Такого терміна тут немає. Спробуйте словник бібліотеки — там усі.",
    en: "No such term here. Try the library's glossary — it has them all.",
  },
  glossaryAll: {
    uk: "Ці терміни у словнику бібліотеки",
    en: "These terms in the library's glossary",
  },
  /* «Самері» was a transliteration of "summary" standing as a section name
     on a Ukrainian page. Review: «розділ "САМЕРІ" … замінила б на "ПОВНИЙ
     ОГЛЯД"». */
  navFulltext: { uk: "Повний огляд", en: "Full summary" },
  officialH: { uk: "Офіційні документи Суду", en: "Official court documents" },
  commentaryH: { uk: "Дослідження та коментарі", en: "Research and commentary" },
  updated: { uk: "оновлено", en: "updated" },
} as const;

/**
 * Ukrainian agreement: 1 порушення, 2–4 порушення, 5+ порушень, with the teens
 * taking the "many" form and 21 taking "one". English keeps a singular and a
 * plural and reads the same three keys. Same shape as the registry's helper —
 * copied rather than imported, because the two surfaces do not share a module.
 */

/** The order the groups are read in: the sides, then the forum, then the rest.
 *  Fixed, so the band has the same shape on every case. */


/** Chrome label for each way a claim can be disposed of. */
const OUTCOME_LABEL: Record<Outcome, Localized> = {
  violation: T.violation,
  "no-violation": T.noViolation,
  granted: T.granted,
  rejected: T.rejected,
  "not-decided": T.notDecided,
  convicted: T.convicted,
  acquitted: T.acquitted,
};

const TYPE_LABEL: Record<string, { uk: string; en: string }> = {
  "blog post": { uk: "допис у блозі", en: "blog post" },
  "journal article": { uk: "стаття в журналі", en: "journal article" },
  /* Was «аналітика» alone, which under the masthead's new source caption read
     as a claim that a Ukrainska Pravda news report was analysis. The English
     side already carried both halves. */
  "news/insight": { uk: "новини / аналітика", en: "news / insight" },
  "preprint/repository": { uk: "препринт / репозиторій", en: "preprint / repository" },
  "official/ICC": { uk: "офіційний документ МКС", en: "ICC official document" },
  "official/award": { uk: "текст рішення", en: "award text" },
  /* A national court's own judgment — dtek-krymenergo cites the Hague Court
     of Appeal's. Without an entry here the fallback printed the raw key,
     "official/court", into the kind chip beside the citation. */
  "official/court": { uk: "рішення суду", en: "court judgment" },
  "official/treaty": { uk: "текст договору", en: "treaty text" },
  "official/filing": { uk: "процесуальний документ", en: "court filing" },
};

/**
 * One atlas for every map on this site.
 *
 * The decision pages used to carry their own — a hand-maintained
 * ukraine-map.json with no generator, its own Mercator and its own vocabulary
 * of markers — which meant every fact about the ground had to be fixed twice.
 * It was: Crimea sat outside the country's outline on that one until today,
 * and the lit territories had to be projected into its frame separately. The
 * events map's atlas already carried Ukraine with Crimea, the oblast mesh, the
 * two named grounds and every seat; it now also carries the three points these
 * pages needed and it did not have. `EXTRA_MK`, which existed to patch
 * Helsinki into the old atlas by hand, is gone with it.
 */
const MK = atlas.markers as Record<string, number[]>;
const MAP_AREAS = (atlas as { areas?: Record<string, string> }).areas ?? {};

const mapContext = atlas.context;
/**
 * Named pieces of ground a theatre can be about — see `areas` on `Theatre`.
 * "country" is the outline itself and is not in here; drawing it twice would
 * put two strokes on one coast.
 */

/**
 * Nothing this page can draw may fall outside the country it belongs to.
 *
 * The old atlas drew a Ukraine that stopped at the Perekop isthmus and put its
 * own markers for the peninsula on bare background, outside the country they
 * belong to — on an archive whose largest award is compensation for property
 * taken in Crimea. This atlas has never had that problem, and the check stays
 * so that it cannot acquire one: a comment does not fail a build.
 */
{
  const nums = atlas.ukraine.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let y1 = -Infinity;
  for (let i = 1; i < nums.length; i += 2) y1 = Math.max(y1, nums[i]);
  const south = Math.max(
    ...(["crimea", "simferopol"] as const).map((k) => MK[k]?.[1] ?? -Infinity),
  );
  if (!(y1 >= south)) {
    throw new Error(
      `europe-map.json draws Ukraine down to y=${y1} and puts a marker at ` +
        `y=${south}: Crimea is outside the outline.`,
    );
  }
  for (const key of ["crimea", "east"]) {
    if (!(key in MAP_AREAS)) {
      throw new Error(`europe-map.json has no area "${key}" — a theatre naming it would light nothing.`);
    }
  }
}

/** A search snippet is cut off around here. */
const META_MAX = 160;

/**
 * The description a search result shows.
 *
 * `pick(summary.plain.tldr, locale)` used to be handed to `description`
 * verbatim, and the tldr is a three-to-four-sentence paragraph: every decision
 * page's snippet ran 300–496 characters and broke off mid-sentence. A summary
 * that has authored a `metaDesc` gets it (index.ts enforces the limit). The
 * rest fall back to the tldr's opening sentence — which is always "what this
 * case is and how it ended" — and only if that too is over the limit is it cut,
 * at a word boundary, with a visible ellipsis rather than the engine's silent
 * one.
 */
function shortDescription(summary: DecisionSummary, locale: Locale): string {
  if (summary.metaDesc) return pick(summary.metaDesc, locale);
  const tldr = pick(summary.plain.tldr, locale).trim();
  const first = /^[^.!?]*[.!?]/.exec(tldr)?.[0]?.trim() ?? tldr;
  if (first.length <= META_MAX) return first;
  const cut = first.slice(0, META_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * What a link in the masthead actually points at, and who published it.
 *
 * `judgment.url` and `judgment.caseUrl` are normally the court's own document
 * and its own case page, and the template captions the first with
 * `judgment.court`. On finland-torden they are an EJIL:Talk! analysis and a
 * Ukrainska Pravda report — the Helsinki District Court's judgment is not
 * published anywhere — so the page captioned a blog post with the name of a
 * court and told search engines, through `isBasedOn` and `about.url`, that the
 * court had authored a news article. The registry row for that case has said
 * `decisionUrl: null` all along.
 *
 * A summary declares the mismatch with `urlType` / `caseUrlType`, in the same
 * vocabulary `Citation.type` uses. The publisher is not a second field to keep
 * in step: it is read out of the `sources` list, which already carries this
 * exact URL with its publication and date.
 */
function linkProvenance(
  url: string,
  type: string | undefined,
  sources: DecisionSummary["sources"],
  locale: Locale,
): { official: boolean; caption?: string } {
  if (!type) return { official: true };
  const cited = sources.find((s) => s.url === url);
  const kind = pick(TYPE_LABEL[type] ?? { uk: type, en: type }, locale);
  const publisher = cited?.publication;
  return { official: false, caption: publisher ? `${publisher} · ${kind}` : kind };
}

/**
 * Europe-context map: where the case was decided, and the ground it is about.
 *
 * The forum defaults to the ICJ in The Hague with its reach drawn to Kyiv. An
 * arbitration overrides both — Oschadbank was seated in Paris, and the line
 * that matters runs from the seat to Crimea, the territory whose assets were
 * taken. Marker positions come from the same projection as the base map.
 */
function TheatreMap({
  theatres,
  locale,
  forum,
}: {
  theatres: Theatre[];
  locale: Locale;
  forum: {
    key: string;
    name: Localized;
    caption: Localized;
    reachTo: string;
  };
}) {
  /* Everything resolved here, on the server: `CaseMap` is a client component
     and its props are serialized into the payload, so a {uk, en} pair would
     ship both languages to every reader — and the atlas would ship whole
     rather than the handful of paths this case actually draws. */
  const seat = MK[forum.key] ?? MK.hague;
  const marks: [number, number][] = [
    [seat[0], seat[1]],
    ...theatres.flatMap((t) =>
      t.markerKeys.map((k) => MK[k]).filter(Boolean).map((p) => [p[0], p[1]] as [number, number]),
    ),
  ];
  /**
   * The frame, from the case's own marks rather than from a constant.
   *
   * The old atlas had one fixed window and one summary overriding it by hand —
   * finland-torden, whose seat is Helsinki and which therefore did not fit the
   * frame everything else used. Derived, every case frames itself: Oschadbank
   * reaches from Paris to Crimea, Finland from Helsinki to Luhansk, and
   * neither needs a number written into the content.
   *
   * MARGIN is in projection units and is what a mark needs to clear its own
   * halo — 40 units — plus its name, which is HTML and so is measured in
   * pixels rather than units; 90 covers it at every width this band is read
   * at. The aspect is the band's: wide-format, and the projection is 2.6:1, so
   * 2.2 keeps a frame that holds Europe's west and Ukraine's east from
   * becoming a letterbox.
   */
  const MARGIN = 90;
  /* 2.6 rather than 2.2, which is the projection's own ratio and a shorter
     band: at 1000px wide the drawing is 385px tall against the 455 it was, and
     the section stops taking a screen of its own inside an article. */
  const ASPECT = 2.6;
  const x0 = Math.min(...marks.map((p) => p[0])) - MARGIN;
  const x1 = Math.max(...marks.map((p) => p[0])) + MARGIN;
  const y0 = Math.min(...marks.map((p) => p[1])) - MARGIN;
  const y1 = Math.max(...marks.map((p) => p[1])) + MARGIN;
  const w0 = Math.max(x1 - x0, (y1 - y0) * ASPECT);

  /* The key stands on the drawing's left, so the frame gives up the strip it
     stands on rather than letting the block cover a mark — the same
     reservation the map's own page makes with --emap-safe-left, and the reason
     it can be a block on the map at all instead of a caption under it.

     It is a fraction rather than a number of units because the block is
     measured in pixels and the frame in projection units: 348 of the band's
     1000px is the 316 the block ends at, a 16px gap, and the 16 more that the
     nearest mark's own hit target reaches back — at 332 the seat sat exactly
     on the edge and three pixels of its target were under the block.

     Only the shortfall is added. Every one of these frames already carries
     MARGIN of open water west of the forum — on a case whose seat sits at the
     left edge that is 90 units of the frame's width, and the reservation costs
     the drawing 12.5% of its scale on the widest case rather than the 33% a
     full strip would. Every forum on the shelf sits in western Europe and
     every theatre in Ukraine, so the strip is water on all of them. */
  const KEY_STRIP = 348 / 1000;
  const left0 = Math.max(0, ((x0 + x1) / 2 - w0 / 2 - x0) * -1 + MARGIN);
  const extra = Math.max(0, (KEY_STRIP * w0 - left0) / (1 - KEY_STRIP));
  const w = w0 + extra;
  const h = w / ASPECT;
  /* The strip is taken off the left only, so the frame's centre moves west by
     exactly what was added rather than the marks sliding out of it. */
  const fx = (x0 + x1) / 2 - w0 / 2 - (w - w0);
  const frame = `${Math.round(fx * 10) / 10} ${Math.round(((y0 + y1) / 2 - h / 2) * 10) / 10} ${Math.round(w * 10) / 10} ${Math.round(h * 10) / 10}`;
  return (
    <CaseMap
      frame={frame}
      /* What was added, as a fraction of the frame that now carries it. The
         stylesheet crops exactly this much back off on a phone, where the key
         is below the drawing and the strip is nothing but water — leaving the
         margin the forum had before the reservation rather than putting it on
         the frame's edge. */
      strip={Math.round((extra / w) * 10000) / 10000}
      /* Projection units per CSS pixel at the band's full 1000px. The marks
         are sized from the events map in pixels — measured there, not guessed
         — and every case frames itself, so a radius written in units comes out
         a different size on each of the eight. This is what turns one back
         into the other. */
      unit={Math.round((w / 1000) * 1000) / 1000}
      context={mapContext}
      uaPath={atlas.ukraine}
      regions={atlas.regions}
      seat={{
        name: pick(forum.name, locale),
        caption: pick(forum.caption, locale),
        at: [seat[0], seat[1]],
      }}
      reach={(() => {
        /* The far end has to be a mark. `reachTo` names a place, and on three
           of the eight cases that place is Kyiv — which the drawing named as a
           reference point and no longer does, because it was the one thing on
           the map that looked like a mark and answered nothing. A line drawn
           to it now ends in open country. So the setting is honoured only when
           it names ground some theatre actually stands on; otherwise the reach
           ends where the case is about, which is what it was always for. */
        const drawn = new Set(theatres.flatMap((t) => t.markerKeys));
        const key =
          drawn.has(forum.reachTo) && MK[forum.reachTo]
            ? forum.reachTo
            : theatres[0]?.markerKeys.find((k) => MK[k]);
        const r = (key ? MK[key] : undefined) ?? seat;
        return [r[0], r[1]];
      })()}
      /* A beam to each theatre, not only to the first. This case reaches
         eastern Ukraine under the ICSFT and Crimea under CERD, and the
         drawing was connecting the Court to one of them. */
      reaches={theatres
        .flatMap((t, i) => {
          /* One beam per place, not per theatre. Five oblasts carry the
             warrants for the deportation of children and the drawing
             connected the Court to the first of them, so four of the five
             places the case is about had no line to The Hague at all.
             Owner: «не вистачає пунктирів з усіх точок».

             A theatre whose ground is an area keeps its single beam: it has
             one ground, and five lines into the same country would draw a
             fan at nothing. */
          const keys =
            t.ground === "area" ? t.markerKeys.slice(0, 1) : t.markerKeys;
          return keys
            .map((k) => MK[k])
            .filter(Boolean)
            .map((at) => ({ id: `t${i}`, at: [at[0], at[1]] as [number, number] }));
        })}
      theatres={theatres.map((t, i) => ({
        id: `t${i}`,
        place: pick(t.place, locale),
        tag: typeof t.tag === "string" ? t.tag : pick(t.tag, locale),
        summary: pick(t.summary, locale),
        pts: t.markerKeys
          .map((k) => MK[k])
          .filter(Boolean)
          .map((p) => [p[0], p[1]] as [number, number]),
        /* Resolved here with everything else: the component is a client one
           and a {uk, en} pair would ship both languages of every name. */
        ptNames: t.markerNames?.map((n) => ({
          label: pick(n.label, locale),
          dx: n.dx,
          dy: n.dy,
        })),
        ground: t.ground,
        areas: (t.areas ?? [])
          .map((k) => (k === "country" ? atlas.ukraine : MAP_AREAS[k]))
          .filter(Boolean),
        labelDx: t.labelDx,
        labelDy: t.labelDy,
      }))}
      labels={{
        alt: pick(T.mapAlt, locale),
        seatRole: pick(T.seatLabel, locale),
        pick: pick(T.mapPick, locale),
      }}
    />
  );
}

/** Render one findings-table cell: verbatim text, sub-headings pulled out. */
function Findings({
  text,
  mark,
  claimLabel,
  positionLabel,
  heads,
  outcomes,
  locale,
}: {
  text: string;
  /** The name of each enumerated finding, where the record gives them. */
  heads?: string[];
  /** How each finding in this block went, in the order the heads appear. */
  outcomes?: Outcome[];
  locale: Locale;
  /** «Україна твердила» / «Позиція Суду» — the two columns' captions. */
  claimLabel: string;
  positionLabel: string;
  /** Wraps the first appearance of each glossary term. Identity, when the
      page has no glossary to mark against. */
  mark: (s: string) => React.ReactNode;
}) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  /* The design reads a finding as three things: what it is about, what the
     applicant argued, and what the forum held — the last set apart, on its
     own ground, behind a gold rule. Our blocks already carry exactly those
     three: a lead line naming the track and the article, then the argument,
     then a paragraph opening «Позиція Суду:».

     A block carries AS MANY findings as it has head lines, and this took
     only the first. «Висновки за ICSFT» holds four and «Висновки за CERD»
     holds eight, so eleven of this decision's twelve findings had no heading
     on the page at all: their heads were left in the running text and their
     arguments and holdings were poured into one pair, one column of
     everything Ukraine said and one of everything the Court said, four and
     eight findings deep. A reader could not see what had been decided
     separately, which is also why the page could not say which claims were
     rejected.

     The track prefix comes off each head — the section it sits in has
     already said ICSFT or CERD — and the position's own opening words come
     off its paragraph, because the column is labelled with them. */
  /* A block that enumerates rather than argues.
   *
   * Four of the eight decisions record their findings as a list the author
   * already numbered — the ECtHR's ten violations «– порушення статті 2 —
   * …», MH17's two charges «1. … 2. …», Finland's five counts, DTEK's four
   * grounds — and every one of them rendered as an undifferentiated run of
   * lines. Measured across the archive: of the twelve findings blocks that
   * name no findings, eight carry an enumerator on every single line, and
   * those eight are these four decisions in two languages.
   *
   * So nothing is marked and nothing is guessed: the list is set as the
   * list the author wrote, and the enumerator comes off because the list
   * does that job now — the same reason «по-перше» came off the elements of
   * the CERD definition.
   */
  const ENUM = /^\s*(?:[–—-]\s+|(\d{1,2})[.)]\s+)/;

  const HEAD = /^(ICSFT|CERD)\s*[-–—]\s*/;
  const POS = /^(The Court['’]s position:|Позиція Суду:)\s*/;
  /* Every line in a block that draws voices carries one, and data-check
     fails the build if any does not. An unmarked line used to fall through
     to the party, which is how five paragraphs of the Court's reasoning
     came to be printed under «Сторона твердила» — the reader was changed
     and the marks it reads were not re-checked. Silence is no longer an
     answer the data can give. */
  const PARTY = /^(The party argued:|Сторона твердила:)\s*/;
  if (!lines.some((l) => HEAD.test(l)) && lines.length > 1 && lines.every((l) => ENUM.test(l))) {
    /* Numbered where the author numbered, bulleted where the author
       dashed: the count is his, and on MH17 and Finland those numbers are
       the charges' own. */
    const numbered = /^\s*\d/.test(lines[0]);
    const items = lines.map((l) => l.replace(ENUM, ""));
    /* An enumerated finding carries its answer beside it, where the record
       gives one.

       The device this archive uses for a finding — a head, a result chip,
       the exchange under them — was reachable by one decision out of eight,
       because the renderer decided what a head was by looking for the
       literal strings «ICSFT —» and «CERD —». Four decisions record their
       findings as a list the author numbered himself: the ECtHR's ten
       violations by article, MH17's two charges, Finland's five counts,
       DTEK's four objections. None could say how any single one went.

       What they needed was never the head. Every one of those lines opens
       with its own subject — «порушення статті 2 — …», «Умисне вбивство.
       …» — so a head above it would print the first three words twice, and
       this page has spent the day removing exactly that. What was missing is
       the answer: which of the five counts convicted, which of the four
       objections fell. So the chip goes on the line, and the words stay the
       author's.

       `heads` stays for the case this does not cover — a list whose lines do
       not name themselves — and is simply absent here. */
    if (outcomes && outcomes.length === items.length) {
      const Tag = numbered ? "ol" : "ul";
      return (
        <Tag className="findings f-list f-list-out">
          {items.map((t, i) => (
            <li key={i}>
              <span className="fl-text">
                {heads?.[i] ? <b className="fl-head">{heads[i]}</b> : null}
                {mark(t)}
              </span>
              <span className="v-out h4-out" data-o={outcomes[i]}>
                {pick(OUTCOME_LABEL[outcomes[i]], locale)}
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    return numbered ? (
      <ol className="findings f-list">
        {items.map((t, i) => (
          <li key={i}>{mark(t)}</li>
        ))}
      </ol>
    ) : (
      <ul className="findings f-list">
        {items.map((t, i) => (
          <li key={i}>{mark(t)}</li>
        ))}
      </ul>
    );
  }

  const parts: { head?: string; body: string[] }[] = [];
  for (const l of lines) {
    if (HEAD.test(l)) parts.push({ head: l.replace(HEAD, ""), body: [] });
    else {
      if (parts.length === 0) parts.push({ body: [] });
      parts[parts.length - 1].body.push(l);
    }
  }
  return (
    <div className="findings">
      {parts.map((part, n) => {
        /* An exchange, not a seam. Most findings are argued once and
           answered once, but «Правоохоронні заходи» is argued, answered,
           argued again and answered four times over, and taking the first
           marker as a cut would have put Ukraine's own third paragraph
           inside the Court's column. So the lines are walked and every
           change of voice opens a block: the same rule gives the ordinary
           finding exactly what it had, and gives this one the back-and-
           forth it is. */
        const turns: { court: boolean; lines: string[] }[] = [];
        for (const l of part.body) {
          const court = POS.test(l);
          if (turns.length === 0 || turns[turns.length - 1].court !== court) {
            turns.push({ court, lines: [] });
          }
          turns[turns.length - 1].lines.push(l.replace(POS, "").replace(PARTY, ""));
        }
        const spoken = turns.some((t) => t.court);
        const outcome = outcomes?.[n];
        return (
          <div className="finding" key={n}>
            {part.head && (
              <div className="f-row">
                <h3 className="f-head">{part.head}</h3>
                {outcome && (
                  <span className="v-out h4-out" data-o={outcome}>
                    {pick(OUTCOME_LABEL[outcome], locale)}
                  </span>
                )}
              </div>
            )}
            {/* Where the write-up records no seam between the argument and
                the holding, there is no pair to draw: the eight CERD
                findings run the Court's reasoning and the party's case in
                and out of each other, and cutting them in two would put
                sentences in a column that does not own them. One column,
                and the heading and its answer above it. */}
            {!spoken ? (
              /* Nothing marks where the Court starts: prose, as written. */
              part.body.map((l, i) => (
                <p className="body" key={i}>
                  {mark(l)}
                </p>
              ))
            ) : (
              <div className="pair pair-turns">
                {turns.map((t, i) => (
                  <div className={t.court ? "rule" : "claim"} key={i}>
                    {/* The caption only where the voice changes to it a
                        first time — a four-turn exchange does not need
                        «Позиція Суду» printed over every answer. */}
                    {turns.findIndex((x) => x.court === t.court) === i && (
                      <div className="lbl-c">{t.court ? positionLabel : claimLabel}</div>
                    )}
                    {t.lines.map((l, k) => (
                      <BoxPara key={k} text={l} mark={mark} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A numbered part of the write-up, introduced the way every section is.
 *
 * The write-up numbers its own parts — «1. ФАКТИЧНІ ОБСТАВИНИ» — and the
 * number is inside the heading string, because that is how the court's text
 * numbers them. The design sets it beside the heading instead: large, light
 * and gold. It counts the parts; it is not a word of the title, and a screen
 * reader announcing "one dot фактичні обставини" was reading a layout
 * decision aloud — so the numeral is hidden from it and the heading keeps
 * its own words.
 *
 * Only a leading «N.» or «N)» comes off. A heading that opens with a year —
 * and several across the archive do — keeps it, because there the number is
 * the heading.
 */
function PartHead({ text, id }: { text: string; id?: string }) {
  const m = /^(\d{1,2})[.)]\s+(.*)$/.exec(text);
  return (
    <div className="sec-h">
      {m && (
        <span className="sec-n" aria-hidden="true">
          {m[1]}
        </span>
      )}
      <h2 id={id}>{m ? m[2] : text}</h2>
    </div>
  );
}

/* ── A quotation and the paragraph of the judgment it comes from ──────────
   Measured before it was written, over all 400 paragraphs in the archive:
   20 paragraphs open with a quotation mark and close with one, and all 20
   are verbatim quotations — a quoted paragraph is a quoted paragraph, which
   is punctuation rather than meaning. 12 of them are introduced by a
   paragraph ending «… (§ 391):», and in all 12 the citation belongs to the
   quotation below rather than to the sentence it sits in.

   That is the opposite result to the topic-phrase rule this page rejected
   (18 hits, 4 of them right), and it is why this one ships. */
/* Roman, because the aspects of a subject-matter are numbered that way in
   the judgments themselves, and because the page already spends arabic
   numerals on the parts of the write-up. Four is more than any decision in
   the archive needs; past it the count falls back to a figure. */
const ROMAN = ["I", "II", "III", "IV"];

const QUOTED = /^[«"“][\s\S]*[»"”][.,;]?$/;
const TRAILING_CITE = /\s*\(\s*§+[^)]*\)\s*(:?)\s*$/;

/**
 * Take the quotation that starts at `start`, with whatever introduced it.
 *
 * Returns the nodes and the index after them, or null if nothing here is a
 * quotation. Used twice: in the reading column, and inside the half of a
 * pair where the Court answers.
 */
function takeQuotation(
  body: SummaryBlock[],
  start: number,
  mark: (s: string) => React.ReactNode,
): { nodes: React.ReactNode[]; next: number } | null {
  const b = body[start];
  if (!b || (b.kind !== "p" && b.kind !== "lead")) return null;
  const cited = TRAILING_CITE.exec(b.text);
  const quotesAt =
    cited && QUOTED.test(body[start + 1]?.text ?? "")
      ? start + 1
      : QUOTED.test(b.text)
        ? start
        : -1;
  if (quotesAt === -1) return null;
  const nodes: React.ReactNode[] = [];
  let i = start;
  if (quotesAt > start) {
    /* The citation comes off the lead-in: it was pointing at the quotation,
       not arguing in the sentence. What is left keeps every word and its own
       colon. */
    const lead = b.text.replace(TRAILING_CITE, cited![1] ? ":" : "").trim();
    nodes.push(
      /^\S+:$/.test(lead) ? (
        /* A lead-in that is one word — «Висновок:» — is a caption on the
           quotation, not a paragraph standing alone above it. */
        <div className="lbl-c qt-lbl" key={`ql-${start}`}>
          {lead.replace(/:$/, "")}
        </div>
      ) : (
        <p className="body" key={`ql-${start}`}>
          {mark(lead)}
        </p>
      ),
    );
    i = start + 1;
  }
  /* Consecutive quotations under one lead-in are one quotation in two
     paragraphs — §§ 397-398 is quoted that way — so they share a block and a
     citation rather than each getting a rule of its own. */
  const run: string[] = [];
  while ((body[i]?.kind === "p" || body[i]?.kind === "lead") && QUOTED.test(body[i]?.text ?? "")) {
    run.push(body[i].text);
    i += 1;
  }
  const cite = cited?.[0]
    .replace(/[():\s]+$/, "")
    .replace(/^[\s(]+/, "")
    .trim();
  nodes.push(
    <blockquote className="qt" key={`qt-${start}`}>
      {run.map((t, k) => (
        <p key={k}>{t}</p>
      ))}
      {cite && <cite className="qt-cite">{cite}</cite>}
    </blockquote>,
  );
  return { nodes, next: i };
}

/* ── A holding that enumerates its own elements ───────────────────────────
   «…складається з двох елементів: по-перше, …; і по-друге, …». The author
   numbered them; running them together in one paragraph makes a reader
   count a definition instead of reading it, and the definition of racial
   discrimination under CERD Article 1(1) is the one a whole band of
   findings then turns on.

   Measured over all 652 paragraphs in the archive: four carry both
   markers, and all four are genuine two-element enumerations. Split at the
   author's own words and nothing else.

   The words that do the counting come off, because the list now counts:
   «1. по-перше, …» says it twice. Nothing else is touched, and the items
   keep their lower case — they are clauses of the sentence above them, and
   two of the four open inside a quotation, where a capital would be the
   Court's word altered. */
const ELEMENTS =
  /^([\s\S]*?:)\s*(?:по-перше|first(?:ly)?)[,\s]\s*([\s\S]+?)[;.]?\s*(?:і\s+|and\s+)?(?:по-друге|second(?:ly)?)[,\s]\s*([\s\S]+)$/i;

/* A paragraph inside a box that opens by naming what it is about —
   «Доступ до освіти українською мовою: …». Two of the Court's paragraphs on
   education do this, and run four lines each, so the reader meets two
   findings in one column with the only thing telling them apart buried in
   the first six words.

   Scoped to the inside of a box and applied after the voice marker comes
   off, which is what keeps it honest: measured over all 806 lines in the
   archive the shape matches 58 times, and all but a handful of those are
   the structural markers this page has already consumed by the time the
   text gets here. What is left is labels. */
const BOX_LEAD = /^([^:»"”]{6,48}):\s+(\S[\s\S]+)$/;

function BoxPara({ text, mark }: { text: string; mark: (s: string) => React.ReactNode }) {
  const m = BOX_LEAD.exec(text);
  if (m && m[1].split(/\s+/).length <= 6 && !/^[«"“]/.test(m[2])) {
    return (
      <>
        <div className="lbl-c box-lead">{m[1]}</div>
        <p>{mark(m[2])}</p>
      </>
    );
  }
  return <p>{mark(text)}</p>;
}

function HoldingText({ text, mark }: { text: string; mark: (s: string) => React.ReactNode }) {
  const m = ELEMENTS.exec(text);
  if (!m) return <BoxPara text={text} mark={mark} />;
  return (
    <>
      <p>{mark(m[1])}</p>
      <ol className="els">
        <li>{mark(m[2])}</li>
        <li>{mark(m[3])}</li>
      </ol>
    </>
  );
}

/** Render one verbatim block in reading order. */
function Block({
  block,
  mark,
  claimLabel,
  positionLabel,
  locale,
}: {
  block: SummaryBlock;
  locale: Locale;
  mark: (s: string) => React.ReactNode;
  /* The two captions a finding's columns carry. Passed down rather than
     read here: this renderer has no locale of its own. */
  claimLabel: string;
  positionLabel: string;
}) {
  switch (block.kind) {
    case "lead":
      return <p className="lead">{mark(block.text)}</p>;
    case "h2":
      return <PartHead text={block.text} />;
    case "h3":
      return <h3>{block.text}</h3>;
    case "h4":
      return <h4>{block.text}</h4>;
    case "subject":
      return <p className="body">{mark(block.text)}</p>;
    case "note":
      return (
        <aside className="nb">
          <p>{mark(block.text)}</p>
        </aside>
      );
    case "position":
      /* What the forum held, on its own ground behind a gold edge — the same
         treatment the right-hand half of a finding gets, because it is the
         same thing said outside a pair. */
      return (
        <div className="rule">
          <div className="lbl-c">{positionLabel}</div>
          <HoldingText text={block.text} mark={mark} />
        </div>
      );
    case "claim":
      /* A claim that no heading names — grouped claims never reach here, the
         walk below pairs them with the h3 above each one. */
      return (
        <div className="pair pair-turns">
          <div className="claim">
            <div className="lbl-c">{claimLabel}</div>
            <p>{mark(block.text)}</p>
          </div>
        </div>
      );
    case "findings":
      return (
        <Findings
          text={block.text}
          mark={mark}
          claimLabel={claimLabel}
          positionLabel={positionLabel}
          heads={block.heads}
          outcomes={block.outcomes}
          locale={locale}
        />
      );
    case "link":
      return null;
    case "dispositif":
      // Everything tagged dispositif is an operative clause except the framing
      // lines ("For the foregoing reasons…", "The Court," / "However…") —
      // detecting the frame is robust across courts; detecting the clause
      // openers was not (ICJ "Finds…", PCA "That…", DTEK "Tribunal has…").
      // Left unmarked on purpose: these are the court's operative words, in
      // the order it ordered them, quoted here to be quoted onward.
      return /^(For the foregoing|However|The Court,|З наведених|Проте|Суд,)/.test(block.text) ? (
        <p>{block.text}</p>
      ) : (
        <p className="disp">{block.text}</p>
      );
    default: {
      /* Two shapes the write-up already has, drawn as the design draws them.
         Neither rewrites a word: the text is cut at punctuation the author
         put there, and what moves is where the pieces sit.

         1. A paragraph that opens by naming which instrument it is about —
            «Стосовно ICSFT …», "With regard to the ICSFT, …". The design
            lifts that opening into a gold caption over the paragraph, which
            is what it does: it labels the paragraph rather than being part
            of its argument. The remainder keeps every word and gains a
            capital, because it is now the start of the sentence. */
      const scope = /^(Стосовно|With regard to)\s+(?:the\s+)?(ICSFT|CERD)[,]?\s+([\s\S]+)$/.exec(
        block.text,
      );
      if (scope) {
        const rest = scope[3];
        return (
          <>
            <div className="lbl-c scope-l">{`${scope[1]} ${scope[2]}`}</div>
            <p className="body">{mark(rest.charAt(0).toUpperCase() + rest.slice(1))}</p>
          </>
        );
      }
      /* 2. A paragraph that announces a list and then runs it into prose —
            «…такі конкретні категорії дій: a; b; c.» The semicolons are the
            author's own; the design sets what is between them as the list it
            already is, behind a rule, under the sentence that announced it.

            Three items at least, so an ordinary sentence with a colon and
            one semicolon in it is left alone. */
      const listed = /^([^:]{8,}?:)\s*([\s\S]+;[\s\S]+;[\s\S]+)$/.exec(block.text);
      if (listed) {
        const items = listed[2]
          .split(";")
          .map((x) => x.trim())
          /* The serial conjunction before the last item belongs to the
             sentence the list was, not to the item. Nothing else is touched:
             the words, their order and the author's own semicolons stand. */
          .map((x, i, a) => (i === a.length - 1 ? x.replace(/^(та|і|й|and)\s+/i, "") : x))
          .filter(Boolean)
          /* The semicolons go back on. Setting the items as a list does not
             make them sentence fragments — they are still the clauses of the
             sentence the paragraph is, and the design keeps the author's
             punctuation visible; the last item already carries the full stop
             the source ended on. */
          .map((x, i, a) => (i === a.length - 1 ? x : `${x};`));
        if (items.length >= 3) {
          return (
            <div className="listed">
              <div className="listed-h">{listed[1].replace(/:$/, "")}</div>
              <ul>
                {items.map((x, i) => (
                  <li key={i}>{mark(x)}</li>
                ))}
              </ul>
            </div>
          );
        }
      }
      return <p className="body">{mark(block.text)}</p>;
    }
  }
}

/**
 * Every proceeding in the registry is addressable, not only the eight with a
 * summary. The other thirty-one were inert rows with no URL, so nothing could
 * link to them and the fifteen official court documents recorded against them
 * appeared nowhere on the site. Registry ids and summary slugs do not collide
 * — checked below — so one route serves both.
 */
export function generateStaticParams() {
  const slugs = Object.keys(SUMMARIES);
  /* `partOf` records are acts within another proceeding — the six ICC
     warrants inside ICC-01/22 — so they get no page. Their substance is the
     warrant wall on the parent's write-up, in fuller form than a pending
     page could carry, and a second page per warrant would have been the same
     facts at a dead end. */
  const pending = registryCases
    .filter((c) => !c.summarySlug && !c.partOf)
    .map((c) => c.id);
  const clash = pending.filter((id) => slugs.includes(id));
  if (clash.length) {
    throw new Error(`registry id collides with a summary slug: ${clash.join(", ")}`);
  }
  return [...slugs, ...pending].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const summary = SUMMARIES[slug];
  const dict = await getDictionary(locale);
  if (!summary) return pendingMetadata({ slug, locale, dict });
  const parties = summary.title
    ? pick(summary.title, locale)
    : summary.masthead.parties.replace(/^\(|\)$/g, "");
  return decisionMetadata({
    locale,
    slug,
    title: `${parties} — ${pick(summary.judgment.court, locale)}`,
    description: shortDescription(summary, locale),
    ogAlt: dict.meta.ogAlt,
    siteName: dict.brand.wordmark,
    image: `/og/cases/${slug}.png`,
  });
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const summary = SUMMARIES[slug];
  const dict = await getDictionary(locale);
  // Registry ids without a summary render the pending page; anything else 404s.
  if (!summary) return <CasePending slug={slug} locale={locale} dict={dict} />;

  const { masthead, judgment, instruments, timeline, verdicts, sources } = summary;
  const { interpretations, plain } = summary;
  /* Alphabetical, in the reader's own collation, and sorted here rather than
     in the band: the term chips at the head of the verbatim text link to
     `#term-N`, and the band renders the same array, so both have to number
     the same list. Sorting once, on the server, keeps the anchors in the HTML
     and keeps the two in step.

     `sortKey` strips leading guillemets before comparing — «ДНР» files under Д,
     not under «, which is the same rule the dictionary page uses. */
  const glossary = [...summary.glossary].sort((a, b) =>
    sortKey(pick(a.term, locale)).localeCompare(
      sortKey(pick(b.term, locale)),
      locale === "uk" ? "uk" : "en",
      { sensitivity: "base" },
    ),
  );
  /* The terms this decision defines, pointed at their entry in the dictionary.
     The definition travels with the mark, so a reader never has to leave the
     sentence to find out what a word means. */
  /* Empty on a build without the dictionary, which `markTerms` already treats
     as "leave the prose alone" — the alternative is a verbatim summary shot
     through with links to a 404. */
  const termRefs: TermRef[] = glossaryEnabled
    ? glossary.map((g) => ({
        id: idOf(g.term.uk),
        term: pick(g.term, locale),
        def: pick(g.def, locale),
        href: `/${locale}/glossary#${idOf(g.term.uk)}`,
      }))
    : [];

  /* Where a verdict's track is also a moment in the chronology.

     Two of the eight decisions key their tracks to something else on the page.
     The ICC's tracks are the dates its warrants issued — "17.03.2023" — and
     every one of those dates is an entry in the chronology below. Nothing is
     inferred here: the two are joined only when the same day appears on both
     sides, so a page whose tracks are articles or defendants simply gets no
     link rather than a guessed one. */
  const chronoIsos = new Set(
    (summary.timeline ?? []).map((e) => e.iso).filter((x): x is string => !!x),
  );
  const chronoAnchor = (track: string): string | undefined => {
    const m = track.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return undefined;
    const iso = `${m[3]}-${m[2]}-${m[1]}`;
    return chronoIsos.has(iso) ? `#ev-${iso}` : undefined;
  };

  const { theatres = [], provisionalMeasures = [], timelineTracks = [], glance = [] } = summary;
  const { takings, attribution, amounts, objections, afterlife, warrants } = summary;
  /* What the forum decided, and what happened to it afterwards. Two runs,
     two scales: drawn together, the €87 million attached in France read as a
     fraction of a dollar award it is not denominated in, and the caption had
     to say «у євро — поза шкалою» about the very bar it was drawing. */
  const awarded = (amounts?.figures ?? []).filter((f) => !f.after);
  const afterAward = (amounts?.figures ?? []).filter((f) => f.after);
  const parties = summary.title
    ? pick(summary.title, locale)
    : masthead.parties.replace(/^\(|\)$/g, "");
  /* The masthead's two verbatim lines, in the reader's language where the
     summary carries a rendering. `masthead` itself is untouched — the citation
     below is assembled from it and has to reproduce the caption as published. */
  /* The title, and the sides set apart from it.

     Every inter-State case here files itself as a subject followed by the
     parties in brackets — «…расової дискримінації (Україна проти Російської
     Федерації)». The design sets the two in different type: the subject as
     the heading, the parties under it in italic gold, one object read in two
     voices rather than one long line broken wherever it happens to break.

     Split off the *trailing* parenthetical only, and only when it closes the
     string: «Ситуація в Україні (ICC-01/22)» is a docket, not a pair of
     parties, but it is the same shape — so this does not try to tell them
     apart. It sets whatever the record puts in that position apart from the
     subject, which is what the line is for on every page that has one, and a
     record with no bracket keeps its title whole. */
  /* A phase may follow the parties: «…(Україна проти Російської Федерації).
     Попередні заперечення». It belongs with them and not with the subject —
     it says which of a docket's several judgments this page is, which is the
     same kind of fact as who the parties are, and set in the heading it would
     read as part of the Convention's name. So the split takes the LAST
     parenthetical, and whatever trails it goes into the same small line.
     `[^()]*$` keeps that tail bracket-free, so a title ending in its
     parenthetical still matches with an empty tail and is unchanged. */
  const partiesMatch = /^(.*)\s*\(([^()]*)\)([^()]*)$/.exec(parties);
  const titleMain = partiesMatch ? partiesMatch[1].trimEnd() : parties;
  const titleSides = partiesMatch ? partiesMatch[2] : null;
  const titleTail = partiesMatch ? partiesMatch[3].trimEnd() : "";
  const officialLine =
    (locale === "uk" ? summary.mastheadUk?.official : null) ?? masthead.official;
  const judgmentLine =
    (locale === "uk" ? summary.mastheadUk?.judgment : null) ?? masthead.judgment;

  // Institution and seat: the ICJ in The Hague unless the summary says otherwise.
  const forum = summary.forum ?? {
    institution: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
    seat: { uk: "Гаага", en: "The Hague" },
  };
  const mapForum = {
    key: summary.mapFocus?.forumKey ?? "hague",
    name: forum.seat,
    caption: forum.institution,
    reachTo: summary.mapFocus?.reachTo ?? "kyiv",
  };
  /*
   * What the two masthead links actually are. Both are the court's own
   * documents unless the summary says otherwise; when neither is, the page
   * carries a notice saying so, because that is what the registry row says.
   */
  const readSrc = linkProvenance(judgment.url, judgment.urlType, sources, locale);
  const fileSrc = linkProvenance(judgment.caseUrl, judgment.caseUrlType, sources, locale);


  // Body in the reader's language; English is the source of truth.
  const rawBlocks = locale === "uk" && summary.blocksUk ? summary.blocksUk : summary.blocks;
  const isSourcesHeading = (b: SummaryBlock) =>
    b.kind === "h2" && /^\s*(Researches|Дослідження)/.test(b.text);
  const body = rawBlocks.filter((b) => b.kind !== "link" && !isSourcesHeading(b));
  const violations = verdicts.filter((v) => v.outcome === "violation").length;

  /** Official-text URL for a verdict track, when one exists. Only acronym
   *  (string) abbrs double as verdict track keys. */
  const trackUrl = (track: string): string | undefined =>
    instruments.find((i) => typeof i.abbr === "string" && i.abbr === track)?.url;
  /* `pagesLabel` stood here — «PDF, 139 с.» under «Читати рішення». The
     review took the page count off the dashboard and then off the button:
     «Забрати цифру про те, що рішення має 139 сторінок». `judgment.pages`
     stays in the data and still feeds the pending page's «Обсяг рішення». */
  /*
   * The scorecard counts what the dispositif is mostly made of. An inter-State
   * judgment turns on breaches, so it counts violations. An arbitral award
   * turns on what was granted — counting its single expropriation finding as
   * "1 of 9" would badly understate an award the claimant won outright.
   *
   * A criminal judgment turns on convictions, and that branch did not exist:
   * the Outcome union gained convicted/acquitted, OUTCOME_LABEL and the chip
   * colours were updated, this counter was not. So it fell through to the
   * inter-State branch and printed Petrovsky's life sentence as "0 порушення
   * з 3", and MH17's three convictions in absentia as "0 порушення з 4" — a
   * legal archive stating, in red, that nothing was found. The noun agrees
   * with the number as well; "0 порушення" was not Ukrainian either.
   */
  const granted = verdicts.filter((v) => v.outcome === "granted").length;
  const convictions = verdicts.filter((v) => v.outcome === "convicted").length;
  /* The third element is which colour the figure may wear. Red on this site
     means a finding of breach, and a conviction is one; relief granted is not,
     however large. The count was painted --pred on all three branches, which
     on paper is a dark cherry nobody read as a semantic and on the panel's
     dark ground is --brand-breach, which everybody would. */
  /* The dispositif's catch-all clauses come out of the index: «Інші вимоги ·
     Відхилено» is not a claim and carried nothing a reader could act on,
     while taking a row's worth of attention from the findings around it. It
     is said under the heading instead. */
  const findings = verdicts.filter((v) => !v.residual);
  const hasResidual = verdicts.length !== findings.length;
  /* How many of the rows the index draws are claims the forum did not
     uphold — the figure the summary line counts. */
  const notUpheld = (v: (typeof findings)[number]) =>
    v.outcome !== "violation" && v.outcome !== "convicted" && v.outcome !== "granted";
  /* Rejected and undecided are counted apart. Lumped together under the word
     «відхилено» the line stated, of every `not-decided` row, something the
     forum did not do — see `restUndecided`. */
  const rejectedShown = findings.filter(
    (v) => notUpheld(v) && v.outcome !== "not-decided",
  ).length;
  const undecidedShown = findings.filter((v) => v.outcome === "not-decided").length;
  const [decided, decidedForms, decidedKind] =
    convictions > 0
      ? ([convictions, T.convictionWord, "breach"] as const)
      : granted > 0
        ? ([granted, T.grantedWord, "relief"] as const)
        : ([violations, T.violationWord, "breach"] as const);
  const decidedLabel = plural(decided, decidedForms[locale], locale);

  /** Resolve a Localized pair for this render's locale (client-prop hygiene:
   *  client components receive plain strings, never both languages). */
  const L = (x: { uk: string; en: string }) => pick(x, locale);

  // Bands of the page, in reading order — the sticky nav names each one.
  const hasMachinery = Boolean(summary.warrants || attribution || objections || afterlife);
  /* Which ground each band stands on, computed rather than fixed.
   *
   * The alternation used to be written into each band's own rule, which is
   * only correct if every band renders. They do not: the machinery, the
   * provisional measures and the map are all conditional. On icj-cerd-icsft
   * there is no machinery band, so `.pmeas`
   * (paper-2) fell straight onto `.chron` (paper-2), the two merged into one
   * slab and their paddings stacked into a screen of empty ground.
   *
   * The map is skipped rather than counted: it is a dark island, and what
   * matters is that the paper bands either side of it keep alternating past
   * it. */
  /* Which bands this decision shows. `summary.bands === "four"` is one
     page's own setting — see the note on `bands` in summaries/types.ts — and
     everything below reads it: the chip row, the ground alternation and each
     removable section. Nothing here is a template rule; the template still
     knows how to draw all of them. */
  const FOUR = new Set(["fulltext", "chronology", "theatres", "sec-sources"]);
  /* `hideSections` names the bands this decision drops one by one, where
     `bands` is all-or-four. Both gates run: a section shows when the
     whitelist lets it through AND the blacklist does not name it. */
  const hidden = new Set<string>(summary.hideSections ?? []);
  const shows = (id: string) =>
    (summary.bands !== "four" || FOUR.has(id)) && !hidden.has(id);
  /* The alternation walks bands by their class name; `hideSections` names
     them by their section id. This is the join, and it is the whole of it —
     a band the blacklist removes has to leave the run, or the two paper
     grounds either side of the gap come out the same and merge into one
     slab. Bands with no listable section (`readzone`, `chron`, `srcs`) map
     to ids the blacklist's type does not admit, so they can never be hit. */
  const BAND_SECTION: Record<string, string> = {
    chron: "chronology",
    readzone: "fulltext",
    refs: "rulings",
    pmeas: "measures",
    machinery: "machinery",
    terms: "glossary",
    srcs: "sec-sources",
  };
  const showBand = (name: string) =>
    (summary.bands !== "four" || ["readzone", "chron", "srcs"].includes(name)) &&
    !hidden.has(BAND_SECTION[name]);

  const bands: Array<[string, boolean]> = [
    /* In page order. The chronology moved above the write-up, so it takes
       the first paper ground and everything below it steps down one. */
    ["chron", true],
    ["readzone", true],
    ["refs", interpretations.length > 0],
    ["pmeas", provisionalMeasures.length > 0],
    ["machinery", hasMachinery],
    ["terms", glossaryEnabled],
    ["srcs", sources.length > 0],
  ];
  const ground: Record<string, "p" | "p2"> = {};
  let alt = 0;
  for (const [name, shown] of bands) {
    if (!shown || !showBand(name)) continue;
    /* The dashboard above these is --brand-night now, so there is no parity to
     * carry on from — the run simply starts on paper, which is also what makes
     * the dashboard an island: whichever of the conditional bands render,
     * `refs` is always first and always light. */
    ground[name] = alt % 2 === 0 ? "p" : "p2";
    alt++;
  }

  /* Where it was decided and what ground it is about — drawn inside the
     write-up, directly after the part that describes that ground, rather
     than as a dark island four bands below it. Part 1 is where the two
     theatres are named: eastern Ukraine under the ICSFT, Crimea under
     CERD, which is exactly what the drawing shows.

     `data-lit` puts the same drawing on paper. It was a night band because
     it stood between paper bands and needed to be its own thing; inside the
     article it is a figure in a column of text, and a dark slab there reads
     as an interruption. Every colour it needs is measured — see the light
     map tokens in globals.css. */
  /* The scale, in figures from outside the court.

     A band of its own. It sat under the index of what the forum decided and
     read as part of the decision — and it is precisely about what the
     decision does not contain: «Ордери кількість не називають». It also had
     no entry in the contents and no heading the rail could see, so a reader
     looking for the numbers could not find them.

     Where it stands depends on what the page is about. With warrants it
     follows them, answering the silence they leave about quantities. Without
     them — Oschadbank — it belongs at the top, because there it is not an
     answer to anything but the ground of the claim itself: the same subject as
     part 2 of the
     write-up, «Фактичні обставини». Owner: «і порядок теж». */
  const scaleBand = shows("scale") && takings && (
        <section
          className="machinery scale-band"
          data-ground={ground["machinery"]}
          id="scale"
          data-navsec
          aria-label={pick(takings.heading, locale)}
        >
          <div className="rail machinery-stack">
            {takings && (
              <div>
                <div className="sec-h">
                  <h2>{pick(takings.heading, locale)}</h2>
                </div>
                {/* The argument the figures are evidence for, at reading size
                    and before them. It used to close the band in caption
                    grey. */}
                {takings.lead && <p className="takings-lead">{pick(takings.lead, locale)}</p>}
                <TakingsGrid
                  metrics={takings.metrics.map((m) => ({
                    label: L(m.label),
                    value: typeof m.value === "string" ? m.value : L(m.value),
                    percent: m.percent,
                    restLabel: m.restLabel && L(m.restLabel),
                    count: m.count,
                    group: m.group && L(m.group),
                    partOfAbove: m.partOfAbove,
                    note: m.note && L(m.note),
                    alt: m.alt && { label: L(m.alt.label), value: L(m.alt.value) },
                  }))}
                  locale={locale}
                  labels={{ andMore: pick(T.dotCap, locale), shareOf: pick(T.ofWhole, locale) }}
                  /* Inside the grid, in the cell beside the last figure —
                     it used to hang under the whole band with the right
                     half of that row empty. */
                  note={
                    takings.note && (
                      <>
                        {pick(takings.note, locale)}
                        {summary.asOf && (
                          <span className="asof">
                            {" "}
                            · {pick(T.asOf, locale)}{" "}
                            {new Date(summary.asOf + "T00:00:00Z").toLocaleDateString(
                              locale === "uk" ? "uk-UA" : "en-GB",
                              { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
                            )}
                          </span>
                        )}
                      </>
                    )
                  }
                />
              </div>
            )}
          </div>
        </section>
      );

  /* The rail says what the band says.
   *
   * The map band prints «Два театри» when there is more than one theatre and
   * «Місце розгляду» when there is one, but the rail only ever knew the
   * second of those — so on every multi-theatre decision a reader clicked
   * «Місце розгляду» and landed on a band headed «ДВА ТЕАТРИ». One
   * expression now, read by the band, its aria-label and both rail entries;
   * the branch cannot go out of step with itself. */
  const theatresLabel = pick(
    summary.theatresHeading ?? (theatres.length > 1 ? T.tracks : T.seatLabel),
    locale,
  );
  /* The machinery band's own heading, whichever of its three shapes renders.
     It was `T.navWarrants` («Ордери») and `T.navAnatomy` («Розбір рішення») —
     two rail words for four different headings, none of which said either. */
  const machineryLabel = warrants
    ? pick(warrants.heading, locale)
    : attribution
      ? pick(T.attributionH, locale)
      : objections
        ? pick(objections.heading, locale)
        : "";

  const theatreBand =
    theatres.length > 0 ? (
      <section
        className="mapband"
        id="theatres"
        /* Always lit. The light palette and the inline position travelled
           together for one release because they arrived together, and they
           are two different things: the drawing is light because a night
           palette on a light page is not a map, and it sits inside the
           write-up only where part 1 is what it shows. Owner: «карти треба
           поробити світлими». */
        data-lit=""
        data-navsec
        aria-label={theatresLabel}
      >
        <h2 className="lbl">{theatresLabel}</h2>
        <TheatreMap theatres={theatres} locale={locale} forum={mapForum} />
      </section>
    ) : null;

  const pageSections = [
    { id: "overview", label: pick(T.inShort, locale) },
    /* The index, second — the design puts what the forum held directly after
       the summary, before the write-up that explains it. It had no entry at
       all: the band carried no id, so the one table on the page a reader
       comes back to was the one thing the contents could not reach. */
    /* The map first, where the band now is: it answers «де це було», and the
       case card above it has just named the seat. */
    ...(!summary.mapInline && theatres.length > 0
      ? [{ id: "theatres", label: theatresLabel }]
      : []),
    ...(shows("score") && verdicts.length > 0
      ? [{ id: "found", label: pick(summary.verdictsHeading ?? T.found, locale) }]
      : []),
    /* And the figures, where they are on a decision with no warrants: the
       ground of the claim, before the chronology. */
    ...(takings && !summary.warrants
      ? [{ id: "scale", label: pick(takings.heading, locale) }]
      : []),
    /* Between the index and the write-up, where the band now is. */
    { id: "chronology", label: pick(T.timeline, locale) },
    /* The summary leads now — review: «самері я б можливо перенесла на
       початок і дала відразу після розділу ЯКЩО КОРОТКО. А потім би вже йшли
       вкладки про тлумачення, тимчасові заходи тощо». */
    /* The write-up's own parts, each with its sub-headings under it —
       «Повний огляд» as one entry was a link to eleven thousand pixels of
       text with no map of what is in them. The ids are the ones the article
       stamps as it renders: sec-N per part in order, sub-N per h3 in order,
       counted the same way here. */
    ...(() => {
      let h2n = 0;
      let h3n = 0;
      const parts: { id: string; label: string; children?: { id: string; label: string }[] }[] =
        [];
      for (const b of body) {
        if (b.kind === "h2") {
          parts.push({
            id: `sec-${h2n++}`,
            label: b.text.replace(/^(\d{1,2})[.)]\s+/, ""),
            children: [],
          });
        } else if (b.kind === "h3") {
          /* Counted whether or not it is listed: the article stamps sub-N on
             every h3 as it renders, so skipping one here would slide every
             id after it onto the wrong heading. */
          const id = `sub-${h3n++}`;
          const label = b.nav === undefined ? b.text : b.nav;
          if (label !== false && parts.length > 0) {
            parts[parts.length - 1].children!.push({ id, label });
          }
        }
      }
      /* The map is drawn between part 1 and part 2, so the rail says so —
         a chip whose position does not match the page sends a reader past
         the thing they were looking for. */
      const listed: typeof parts = [];
      parts.forEach((p, n) => {
        listed.push(p);
        if (n === 0 && summary.mapInline && theatres.length > 0) {
          listed.push({ id: "theatres", label: theatresLabel });
        }
      });
      return listed.map((p) => ({
        id: p.id,
        label: p.label,
        children: p.children && p.children.length > 0 ? p.children : undefined,
      }));
    })(),
    /* This list is the page's order, and the sticky bar is drawn from it — so
       it moves when the bands move. Rulings and measures now follow the
       dispositif directly; the chronology and the map fall in behind the
       machinery. */
    /* Guarded with the band: a chip pointing at a section that does not
       render scrolls a reader to nothing. */
    ...(interpretations.length > 0
      ? [{ id: "rulings", label: pick(T.keyRulings, locale) }]
      : []),
    ...(provisionalMeasures.length > 0
      ? [{ id: "measures", label: pick(T.provMeasures, locale) }]
      : []),
    /* Order follows the page, and the page's order depends on which machinery
       band carries the id. With warrants it is the warrants band, which comes
       first and the figures follow it; without them `#machinery` is the
       attribution band, which renders *after* the figures. Listed the other
       way round on Oschadbank, the rail sent a reader past the band they had
       just asked for. */
    ...(hasMachinery && summary.warrants
      ? [{ id: "machinery", label: machineryLabel }]
      : []),
    ...(takings && summary.warrants
      ? [{ id: "scale", label: pick(takings.heading, locale) }]
      : []),
    /* Two blocks in one band on Oschadbank — whose conduct, then the
       objections — so the second gets a child entry rather than the band
       taking a collective name neither heading uses. It already carries
       `#objections`; the rail just never pointed at it. */
    ...((attribution || objections) && !summary.warrants
      ? [
          {
            id: "machinery",
            label: machineryLabel,
            children:
              attribution && objections
                ? [{ id: "objections", label: pick(objections.heading, locale) }]
                : undefined,
          },
        ]
      : []),
    /* What happened to the award afterwards — its own band now. */
    ...(afterlife ? [{ id: "after", label: pick(afterlife.heading, locale) }] : []),
    ...(glossaryEnabled
      ? [{ id: "glossary", label: pick(T.navGlossary, locale) }]
      : []),
    ...(sources.length > 0 ? [{ id: "sec-sources", label: pick(T.sources, locale) }] : []),
  ];
  /* The chip row shows the bands this decision actually renders. */
  const sections = pageSections.filter((x) => shows(x.id));

  /**
   * Structured data. This archive exists to be cited — by journalists, in
   * filings, and increasingly by search and AI agents reading the page rather
   * than looking at it. Three graphs: what this document is and what it is
   * based on, the questions it answers, and where it sits in the site.
   */
  const pageUrl = `${siteUrl}/${locale}/cases/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${parties} — ${pick(judgment.court, locale)}`,
        description: pick(plain.tldr, locale),
        inLanguage: locale,
        url: pageUrl,
        datePublished: judgment.date,
        ...(summary.asOf ? { dateModified: summary.asOf } : {}),
        /*
         * The decision itself is a court document, not legislation; the
         * treaties it applies stay Legislation in `mentions` below.
         *
         * `url` here is a claim that the court published its decision at that
         * address, and `isBasedOn` a claim that this article is based on the
         * document there. Both used to be emitted unconditionally, so
         * finland-torden told every crawler that the Helsinki District Court
         * had authored a Ukrainska Pravda article and that this page was
         * based on an EJIL:Talk! blog post. A URL is attached only when the
         * summary vouches for it as the court's own; the commentary and the
         * reporting are still published, under `citation`, as what they are.
         */
        about: {
          "@type": "CreativeWork",
          name: masthead.official,
          creator: { "@type": "Organization", name: pick(judgment.court, locale) },
          datePublished: judgment.date,
          ...(fileSrc.official
            ? { url: judgment.caseUrl }
            : readSrc.official
              ? { url: judgment.url }
              : {}),
        },
        ...(readSrc.official ? { isBasedOn: judgment.url } : {}),
        publisher: {
          "@type": "Organization",
          name: dict.footer.org,
          url: siteUrl,
        },
        citation: sources.map((s) => ({
          "@type": "CreativeWork",
          name: s.title,
          url: s.url,
        })),
        mentions: instruments.map((i) => ({
          "@type": "Legislation",
          name: pick(i.name, locale),
          alternateName: typeof i.abbr === "string" ? i.abbr : pick(i.abbr, locale),
          url: i.url,
        })),
      },
      /* The FAQPage graph stood here and went out with the band it described.
         Structured data states what a page shows; the questions are no longer
         on it, and a graph promising answers a reader cannot find is the kind
         of claim this archive exists not to make. `summary.faq` is still in
         the data — see the note on the band. */
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: dict.brand.wordmark,
            item: `${siteUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.nav.decisions,
            item: `${siteUrl}/${locale}/registry`,
          },
          { "@type": "ListItem", position: 3, name: parties },
        ],
      },
    ],
  };

  return (
    <div className="page casepage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(jsonLd)}
      />

      {/* The content region. There was none: the skip link pointed at
          #overview — the dashboard, past the h1 and the case caption — and a
          screen reader had no main landmark on any of the eight pages. */}
      <main id="content" tabIndex={-1}>

      {/* 1 — Masthead. The band is full-bleed; the rail sits inside it, like
          every other band on the page. Merging the two capped the dark ground
          at the rail's 1180px and left paper down both edges on a wide screen. */}
      <header className="mast">
        <div className="rail">
        {/* The registry page, not the home page's preview of it: a reader
            leaving a decision wants the full 39 with the filters. */}
        <Link href={`/${locale}/registry`} className="backlink">
          ← {pick(T.back, locale)}
        </Link>
        <div className="eyebrow">
          <span>{pick(forum.institution, locale)}</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <span>{pick(forum.seat, locale)}</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          {/* Ukrainian where the summary carries a rendering. The verbatim
              line is the decision's own — "AWARD OF 26 NOVEMBER 2018" — and it
              stood between «ПАРИЖ» and «24 ХВ ЧИТАННЯ», the one English
              fragment in a Ukrainian eyebrow. `masthead` still holds it and the
              citation block still prints it; see `mastheadUk` in
              summaries/types.ts. */}
          <span lang={foreignLang(judgmentLine, locale)}>{judgmentLine}</span>
          {/* «Забрати кількість хвилин для читання» (review). It was an
              estimate the page made about its own reader — words ÷ 180 — on a
              masthead whose other parts are facts of the docket. */}
          {summary.asOf && (
            <>
              <span className="dot" aria-hidden="true">
            ·
          </span>
              <span className="readtime">
                {pick(T.updated, locale)}{" "}
                {new Date(summary.asOf + "T00:00:00Z").toLocaleDateString(
                  locale === "uk" ? "uk-UA" : "en-GB",
                  { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" },
                )}
              </span>
            </>
          )}
        </div>
        {/* Latin-script case names on a Ukrainian page need their own lang,
            or a Ukrainian voice reads them phonetically. See foreignLang(). */}
        {/* One size for every title, however long: the heading takes the
            rail's full width now, so a long official name needs neither a
            smaller step nor an attribute saying it is long. See
            `.casepage .official` in 10-bands.css. */}
        {/* The sides sit inside the heading, not under it. They are part of
            the case's name — «…расової дискримінації (Україна проти
            Російської Федерації)» is one caption — so splitting them into a
            paragraph of their own would take them out of the h1 and out of
            the document outline with it. A block-level span keeps the name
            whole for a screen reader and lets the subject and the parties be
            set in two voices for the eye. */}
        <h1 className="official" lang={foreignLang(titleMain, locale)}>
          {titleMain}
          {titleSides && (
            <span className="sides" lang={foreignLang(titleSides + titleTail, locale)}>
              ({titleSides}){titleTail}
            </span>
          )}
        </h1>
        {/* The caption the decision files itself under, where it is not the
            title again. The design's own page has no such line because on
            that decision the two are the same string and the guard below
            suppresses it — on MH17 it is the docket and the ECLI, and it is
            the only place the page prints them. Restored after the row below
            replaced the block it used to sit in. */}
        {officialLine !== parties && (
          <p className="fullname" lang={foreignLang(officialLine, locale)}>
            {officialLine}
          </p>
        )}
        {/* One row under a hairline: the instruments the case runs on, then
            the two ways out to the court's own documents.

            They were three objects — a line of instruments, then two filled
            pills the width of buttons — and the pills carried a second line
            of caption apiece naming the body behind the link. The design
            makes all of it one register: the instrument is its abbreviation
            and its year, the way out is a word and an arrow. A filled button
            promises an action; these are references, and a reference that
            looks like a submit button is a reference that has been oversold.

            The caption the primary pill carried is gone with it. It named
            the body at the other end — and where that body is not the court
            whose page this is, the link's own text now says so. */}
        <div className="hero-meta">
          {instruments.map((inst) => (
            <span className="hm-inst" key={inst.url}>
              <a href={inst.url} target="_blank" rel="noopener noreferrer" title={pick(inst.name, locale)}>
                {typeof inst.abbr === "string" ? inst.abbr : pick(inst.abbr, locale)}
              </a>
              <i>{inst.year}</i>
            </span>
          ))}
          <a className="hm-cta" href={judgment.url} target="_blank" rel="noopener noreferrer">
            {pick(judgment.readLabel ?? T.readJudgment, locale)}
            <span aria-hidden="true">↗</span>
          </a>
          <a className="hm-cta hm-cta-2" href={judgment.caseUrl} target="_blank" rel="noopener noreferrer">
            {pick(judgment.fileLabel ?? T.caseFile, locale)}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        </div>
      </header>

      {/* 1a — Sticky page navigation: every band, not just the article */}
      {/* Escape closes a term definition — the one thing the CSS-only
          tooltips cannot do for themselves. Renders nothing. */}
      {termRefs.length > 0 && <TermTooltips />}

      <ToTop label={pick(T.toTop, locale)} />

      {/* Everything below the masthead is one light canvas with a column of
          contents beside it, rather than a stack of full-bleed bands with the
          page's map floating over them. See `.casepage .shell`. */}
      <div className="shell">
        <CaseToc
          items={sections}
          title={pick(T.onThisPage, locale)}
          ariaLabel={pick(T.navAria, locale)}
        />
        <div className="shell-main">

      {/* 1b — Plain-language lede */}
      {shows("overview") && (
        <section className="lede" id="overview" data-navsec>
          <div className="rail">
            {/* The section says its own name in a heading now, over a rule,
                the way every other section on the page does. It used to
                carry the name as a small gold label above the text and no
                heading at all — which left the page's first section outside
                its own outline. */}
            <div className="sec-h">
              <h2>{pick(T.inShort, locale)}</h2>
            </div>
            <div className="lede-grid">
              <p className="body">{pick(plain.tldr, locale)}</p>
              {/* Not a heading of its own: this is an aside about the
                  section beside it, and the gold rule down its left is what
                  says so. */}
              <aside className="why">
                <div className="lbl-c">{pick(T.whyMatters, locale)}</div>
                <p>{pick(plain.whyMatters, locale)}</p>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* 2 — Dashboard: one column of full-width instruments */}
      {shows("dash") && (
        <section className="dash">
          <div className="rail dash-stack">
            {/* The docket facts, then the figures. `glance` is authored on all
                eight summaries — 57 facts — and rendered nowhere until now. */}
            {glance.length > 0 && (
              <div>
                {/* `lbl-onpaper` again: the docket card stayed on paper when
                    the band split, and the plain `.lbl` is the dark-ground
                    label. */}
                {/* The docket, as a list of pairs on hairlines.

                    It was `GlanceFacts`, a bordered instrument with its own
                    card grid; the design sets the same facts as rows in the
                    reading column, which is what they are — a label and a
                    value, read down. A gold caption rather than a heading:
                    the card is apparatus for the section above it, not a
                    part of the document in its own right. */}
                <div className="lbl-c glance-h">{pick(T.glanceH, locale)}</div>
                <div className="rows">
                  {glance.map((g, i) => (
                    <div className="row" key={i}>
                      <span className="row-k">{pick(g.label, locale)}</span>
                      <span className="row-v">{pick(g.value, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* «У цифрах» is gone — there is no such section in the design.

                It was three tiles: a count of the conventions, of the
                violations found, of the years to judgment. Every one of them
                is said again within a screen of where it stood — the
                violations by the index below, which lists them; the years by
                the case card above, which carries the filing and the
                judgment; the conventions by the masthead, which names both.
                A figure the page states three times is a figure the reader
                has to reconcile three times.

                `stats` stays in the data and in the type. It is authored on
                all eight write-ups, it is checked, and it is the kind of
                thing a future surface — a registry row, a card on the map —
                can ask for. What has gone is this page asking for it. */}

          </div>
        </section>
      )}

      {/* 2a — Where it was decided and what ground it is about.

          It used to stand second from the bottom, after everything. On this
          archive the map answers «де це було», and that question is asked on
          the 350th pixel: the case card names the seat — Париж, Гаага — and
          the next thing a reader wants is why a court there is hearing about
          Crimea. Owner: «і порядок теж». Decisions that draw the map inside
          the write-up keep it there. */}
      {!summary.mapInline && theatreBand}

      {/* 2b — The holding and the sums, on the night ground.

          One band was tried first: the docket facts, the figures, the
          dispositif and the money all on --brand-night together. It put a
          280px light band between a 569px masthead and 2,566px of dark, which
          is 1.1% of the page — not a band separating two scenes but a slot cut
          in a dark field, and no amount of softening the light answered it.

          Split here instead. The card and the counters stay on paper, where
          they were; what goes dark is the part that earns it — what the forum
          held, and what it cost. The dark scene now has paper above it and
          paper below, which is the rule, and the summary above is no longer
          squeezed between two dark expanses. */}
      {/* The accessible name is the heading the section actually prints. It
          said «Що встановив Суд» while the h2 inside it said «Аргументи
          України», so the contents rail and a screen reader announced two
          different sections. */}
      {shows("score") && (
        <section
          className="score"
          id="found"
          data-navsec
          aria-label={pick(summary.verdictsHeading ?? T.found, locale)}
        >
          <div className="rail dash-stack">
            <div className="vpanel">
              <div className="sec-h">
                <h2>{pick(summary.verdictsHeading ?? T.found, locale)}</h2>
                {/* «4 порушення · решту вимог відхилено». It read «4
                    порушення з 7», and the seven were clauses of the
                    dispositif, not claims: a reader took it for "of seven
                    claims the Court upheld four", which is not what happened
                    — Ukraine made many, and most were rejected. */}
                <span className="sec-sum" data-of={decidedKind}>
                  <b>
                    {decided} {decidedLabel}
                  </b>
                  {/* The index used to say «решту вимог відхилено» because
                      it listed nothing but the breaches. Where it lists the
                      rejected claims too, it counts them. */}
                  {rejectedShown > 0 && (
                    <>
                      {" "}
                      · {rejectedShown} {pick(T.restCounted, locale)}
                    </>
                  )}
                  {undecidedShown > 0 && (
                    <>
                      {" "}
                      · {undecidedShown} {pick(T.restUndecided, locale)}
                    </>
                  )}
                  {rejectedShown === 0 && undecidedShown === 0 && hasResidual && (
                    <> · {pick(T.restRejected, locale)}</>
                  )}
                </span>
              </div>
              {/* Column heads. Three tracks of very different content — a
                  citation, a sentence and a verdict — and without them the
                  first row has to teach the reader what each one is. Hidden
                  where the columns are, below 700px, because there they are
                  heads of nothing. */}
              {/* The column heads moved into the matrix: two of them are
                  its sort controls now, and a control cannot live outside
                  the thing it controls. */}
              <VerdictMatrix
                rows={findings.map((v, i) => {
                  const url = trackUrl(v.track);
                  const inHref = chronoAnchor(v.track);
                  return {
                    /* The track key doubles as an instrument abbr where one
                       exists, and that is the form the official-text link is
                       labelled with; everywhere else the display form wins. */
                    track: url
                      ? v.track
                      : v.trackLabel
                        ? pick(v.trackLabel, locale)
                        : v.track,
                    stage: v.trackStage ? pick(v.trackStage, locale) : undefined,
                    href: url,
                    inHref: url ? undefined : inHref,
                    claimHref: v.inAnchor ? `#${v.inAnchor}` : undefined,
                    inLabel: pick(T.toChronology, locale),
                    /* Against the list actually drawn, not the record behind
                       it: with the catch-all clauses filtered out, the row that
                       opens a run is the first of that run among the findings. */
                    opensTrack: i === 0 || findings[i - 1].track !== v.track,
                    outcome: v.outcome,
                    /* The row's own word where the record gives one — see
                       `outcomeLabel` in summaries/types.ts. */
                    outcomeLabel: pick(v.outcomeLabel ?? OUTCOME_LABEL[v.outcome], locale),
                    ownLabel: v.outcomeLabel !== undefined,
                    claim: pick(v.claim, locale),
                  };
                })}
                /* Offered only where there is something to fold: a table of
                   nothing but breaches has no second half. */
                trackless={summary.verdictsTrackless}
                head={{
                  track: pick(summary.verdictsTrackHeading ?? T.ixArticle, locale),
                  claim: pick(T.ixClaim, locale),
                  outcome: pick(T.ixResult, locale),
                  sortedBy: pick(T.sortedBy, locale),
                  asc: pick(T.sortAsc, locale),
                  desc: pick(T.sortDesc, locale),
                }}
                fold={
                  rejectedShown > 0
                    ? {
                        show: pick(T.showRejected, locale),
                        hide: pick(T.hideRejected, locale),
                      }
                    : undefined
                }
              />
            </div>
            {amounts && awarded.length > 0 && (
              <div>
                <h2 className="lbl">{pick(T.amountsH, locale)}</h2>
                <MoneyBars
                  figures={awarded.map((f) => ({
                    label: L(f.label),
                    display: typeof f.display === "string" ? f.display : L(f.display),
                    amount: f.amount,
                    currency: f.currency,
                    estimated: f.estimated,
                    note: f.note && L(f.note),
                    parts: f.parts?.map((pt) => ({
                      label: L(pt.label),
                      display: typeof pt.display === "string" ? pt.display : L(pt.display),
                      amount: pt.amount,
                    })),
                  }))}
                  shareLabel={pick(T.shareOf, locale)}
                  ofLargestLabel={pick(T.ofLargest, locale)}
                  locale={locale}
                />
                {/* The note that stood here — «Росія не сплатила рішення
                    добровільно, тому стягнення відбувається через арешт її
                    державних активів за кордоном» — is about enforcement, so
                    it went down with the two figures that are. */}
              </div>
            )}

          </div>
        </section>
      )}

      {/* The chronology stands here, between what the Court found and
          why — not after the write-up, where a reader learned when the
          case happened only once they had read why it came out as it
          did. It is orientation, the same kind of thing as the docket
          card above it: the answer, then the shape of the time it took,
          then the reasoning. Owner: «чи не варто хронологію підняти
          вище?» */}

      {!summary.warrants && scaleBand}

      {/* 2t — Chronology. Its own band, its own heading: it used to be the
          tail of the dashboard, below the money bars, under a <div> label. */}
      <section className="chron" data-ground={ground["chron"]} id="chronology" data-navsec aria-label={pick(T.timeline, locale)}>
        <div className="rail">
          <div className="sec-h">
            <h2>{pick(T.timeline, locale)}</h2>
          </div>
          <CaseTimeline
            events={timeline.map((e) => ({
              date: L(e.date),
              label: L(e.label),
              note: e.note && L(e.note),
              kind: e.kind,
              track: e.track,
              iso: e.iso,
            }))}
            tracks={timelineTracks.map((t) => ({ id: t.id, label: L(t.label) }))}
            labels={{
              all: pick(T.allEvents, locale),
              trackFilter: pick(T.trackFilter, locale),
              openDetail: pick(T.openDetail, locale),
              railLabel: pick(T.railLabel, locale),
            }}
          />
        </div>
      </section>

      {/* 4 — Verbatim summary. The page bar is the only navigation. */}
      <section className="readzone" data-ground={ground["readzone"]} id="fulltext" data-navsec aria-label={pick(T.navFulltext, locale)}>
        <div className="rail">
          <article className="read">
            {/* The band's own heading. It had none while the chip above said
                «Самері» and the band opened on «1. ФАКТИЧНІ ОБСТАВИНИ» — a
                reader who pressed the chip landed on a numbered heading from
                inside the document with nothing saying what they had reached.
                Now that the chip says «Повний огляд», the band says it too. */}
            {/* No head over the write-up. Its parts carry their own —
                «1 Фактичні обставини» and the rest — and a band label above
                them was a second title for the same thing, with the hairline
                `.lbl` trails off every label it draws. Owner: «повний огляд?
                зайвий заголовок. Зайва смуга.» The contents still names the
                parts, which is where that label's job went. */}
            {/* The «Терміни в цьому тексті» chip row is gone. It listed the
                decision's headwords above the verbatim and linked each to the
                glossary band below — which made sense while the terms were
                only defined at the foot of the page. They are marked in the
                prose itself now, each carrying its definition where the reader
                meets the word, so the row was a table of contents for
                something the text already does. */}
        {(() => {
          let h2i = 0;
          let h3i = 0;
          /* The determinations under a heading are a sequence — three
             questions the Court settled before it could decide anything —
             and they were three bold lines that could have been in any
             order. Counted within their own heading, so the count restarts
             wherever a new run begins. */
          let d = 0;
          /* One set for the whole article, filled as the blocks are walked in
             reading order, so "first occurrence" means first on the page and
             not first in each paragraph. The map callback runs eagerly, here,
             rather than inside each Block — leaving the mutation to React's
             render order would make the result depend on when React chose to
             call the component. */
          const used = new Set<string>();
          const mark = (t: string) => markTerms(t, termRefs, used);
          /* Walked rather than mapped, because one shape spans more than one
             block: a run of [h3, claim] units is a single row of boxes on a
             hairline grid. «Вимоги України за ICSFT» and «…за CERD» are the
             same question asked of two instruments, and the answer to that
             is read across, not down — stacked as heading-and-paragraph they
             are only read in turn.

             The h3 keeps its `sub-N` anchor inside the box: the contents
             still lists it, and the counter still advances in reading order,
             so the ids match the walk that builds the contents above. */
          const out: React.ReactNode[] = [];
          for (let i = 0; i < body.length; i++) {
            const b = body[i];
            if (b.kind === "h2") {
              /* Between part 1 and part 2: part 1 names the two theatres and
                 the drawing is what they look like. */
              if (h2i === 1 && summary.mapInline && theatreBand) {
                out.push(<div key={`map-${i}`}>{theatreBand}</div>);
              }
              out.push(<PartHead key={i} id={`sec-${h2i++}`} text={b.text} />);
              continue;
            }
            if (
              (b.kind === "h3" && body[i + 1]?.kind === "claim") ||
              (b.kind === "subject" && body[i + 1]?.kind === "h3" && body[i + 2]?.kind === "claim")
            ) {
              const units: {
                head: string;
                id: string;
                text: string;
                subject?: string;
                instrument?: string;
                place?: string;
                at: number;
              }[] = [];
              for (;;) {
                const sub = body[i]?.kind === "subject" ? body[i].text : undefined;
                const h = sub ? i + 1 : i;
                if (!(body[h]?.kind === "h3" && body[h + 1]?.kind === "claim")) break;
                units.push({
                  subject: sub,
                  instrument: body[i]?.kind === "subject" ? body[i].instrument : undefined,
                  place: body[i]?.kind === "subject" ? body[i].place : undefined,
                  head: body[h].text,
                  id: `sub-${h3i++}`,
                  text: body[h + 1].text,
                  at: i,
                });
                i = h + 2;
              }
              i -= 1;
              out.push(
                /* Every column carries the same four things, so they sit on
                   four shared rows: the hairline under the question and the
                   label under it line up across the pair instead of landing
                   wherever each column's own text happens to end. Only when
                   every column has all four — otherwise there is nothing to
                   line up and the rows would put things on each other's
                   tracks. */
                <div
                  className={units.every((u) => u.subject) ? "pair pair-rows" : "pair"}
                  key={`pair-${units[0].at}`}
                >
                  {units.map((u, k) => (
                    <div className="claim" key={u.at}>
                      {u.subject && (
                        <div className="c-head">
                          {/* The numeral counts the aspects, so it is a
                              layout device and not a word of the heading —
                              hidden from a screen reader for the same reason
                              the part numerals are. */}
                          <span className="c-num" aria-hidden="true">
                            {ROMAN[k] ?? String(k + 1)}
                          </span>
                          {u.instrument && <span className="c-inst">{u.instrument}</span>}
                          {u.place && <span className="c-place">{u.place}</span>}
                        </div>
                      )}
                      {u.subject && <p className="c-sub">{mark(u.subject)}</p>}
                      <div className="lbl-c" id={u.id}>
                        {u.head}
                      </div>
                      <p>{mark(u.text)}</p>
                    </div>
                  ))}
                </div>,
              );
              continue;
            }
            /* An argument the Court then answers in its own quoted words.
               A claim with a heading of its own was already paired above;
               this is the other shape the write-up uses — the argument, then
               the Court, running down the page. The design sets that as two
               halves side by side, and the Court's half keeps the
               quotations and their paragraph numbers. */
            if (b.kind === "claim") {
              const right: React.ReactNode[] = [];
              let j = i + 1;
              /* The answer is whatever the write-up records next: the
                 Court's own words quoted, or its holding in the write-up's
                 words, or both. «Доктрина «чистих рук»» is the second kind
                 and read as two loose boxes until this took it too. */
              for (;;) {
                if (body[j]?.kind === "position") {
                  right.push(
                    <div key={`p-${j}`} className="rule-p">
                      <HoldingText text={body[j].text} mark={mark} />
                    </div>,
                  );
                  j += 1;
                  continue;
                }
                const q = takeQuotation(body, j, mark);
                if (!q) break;
                right.push(...q.nodes);
                j = q.next;
              }
              if (right.length > 0) {
                out.push(
                  <div className="pair pair-turns" key={`cp-${i}`}>
                    <div className="claim">
                      <div className="lbl-c">{pick(T.claimed, locale)}</div>
                      <p>{mark(b.text)}</p>
                    </div>
                    <div className="rule">
                      <div className="lbl-c">{pick(T.courtPosition, locale)}</div>
                      {right}
                    </div>
                  </div>,
                );
                i = j - 1;
                continue;
              }
            }
            {
              const q = takeQuotation(body, i, mark);
              if (q) {
                out.push(
                  <div className="qt-group" key={`qg-${i}`}>
                    {q.nodes}
                  </div>,
                );
                i = q.next - 1;
                continue;
              }
            }
            if (b.kind === "position") {
              /* A holding that runs to more than one paragraph is one
                 holding. Rendered block by block each paragraph got its own
                 box and its own «Позиція Суду», so the Court appeared to
                 answer the same point twice. */
              const run: string[] = [];
              const at = i;
              while (body[i]?.kind === "position") {
                run.push(body[i].text);
                i += 1;
              }
              i -= 1;
              out.push(
                <div className="rule" key={`pos-${at}`}>
                  <div className="lbl-c">{pick(T.courtPosition, locale)}</div>
                  {run.map((t, k) => (
                    <HoldingText key={k} text={t} mark={mark} />
                  ))}
                </div>,
              );
              continue;
            }
            if (b.kind === "h4" && !b.outcome) {
              d += 1;
              out.push(
                <div className="d-head" key={i}>
                  {/* Counts, does not name — hidden from a screen reader
                      like every other numeral on this page. */}
                  <span className="d-num" aria-hidden="true">
                    {d}
                  </span>
                  <h4>{b.text}</h4>
                </div>,
              );
              continue;
            }
            if (b.kind === "h4" && b.outcome) {
              /* The heading carries the answer, in the word and the chip the
                 index at the top of the page already uses for it. */
              out.push(
                <div className="h4-row" key={i}>
                  <h4>{b.text}</h4>
                  <span className="v-out h4-out" data-o={b.outcome}>
                    {pick(OUTCOME_LABEL[b.outcome], locale)}
                  </span>
                </div>,
              );
              /* What this limb required, as the first turn of the exchange:
                 ordered, argued, answered. It was a line of its own between
                 the heading and the box, belonging to neither. */
              if (b.measure) {
                out.push(
                  <div className="pair pair-turns ordered" key={`m-${i}`}>
                    <div className="claim">
                      <div className="lbl-c">{pick(T.ordered, locale)}</div>
                      <p>{b.measure}</p>
                    </div>
                  </div>,
                );
              }
              continue;
            }
            if (b.kind === "note") {
              /* Ours, not the Court's. */
              out.push(
                <aside className="nb" key={i}>
                  <p>{mark(b.text)}</p>
                </aside>,
              );
              continue;
            }
            if (b.kind === "h3") {
              d = 0;
              /* Anchored like the parts, because the contents lists them:
                 the design nests a write-up's own sub-headings under the
                 part they belong to. */
              out.push(
                <h3 key={i} id={`sub-${h3i++}`}>
                  {b.text}
                </h3>,
              );
              continue;
            }
            out.push(
              <Block
                key={i}
                block={b}
                locale={locale}
                mark={mark}
                claimLabel={pick(T.claimed, locale)}
                positionLabel={pick(T.courtPosition, locale)}
              />,
            );
          }
          return out;
        })()}
          </article>
        </div>
      </section>

      {/* The two halves of the holding, together.

          The dispositif is band three — it says how each claim was disposed
          of. `interpretations` says what the Court held the law to *mean*,
          which is the half that goes into a filing, and it used to sit four
          bands below with a dark map, a timeline and the machinery between
          them. A reader scrolling from the dispositif for the ratio hit
          scenery. The context that explains the holding now follows it
          instead of interrupting it: rulings, measures, machinery, then the
          chronology, then the map.

          The grounds re-alternate with it — `.refs` takes --paper and
          `.pmeas` --paper2 — so the run reads dark, p, p2, p, p2, dark, p:
          the dashboard and the map are each a dark island with paper on both
          sides, which is what DESIGN.md requires of them. */
      }
      {/* 2b — Reference: doctrine and the interim order, on paper */}
      {shows("rulings") && interpretations.length > 0 && (
        <section className="refs" data-ground={ground["refs"]} id="rulings" data-navsec aria-label={pick(T.keyRulings, locale)}>
          <div className="rail">
            <div className="sec-h">
              <h2>{pick(T.keyRulings, locale)}</h2>
            </div>
            {/* A definition list, because that is what these are: a doctrine
                and what the Court held it to mean. They were cards — a white
                box with a serif headline over grey prose, which is the shape of
                an article teaser and not of a holding.

                Deliberately unnumbered. On most of these pages the entries do
                follow the order the reasoning runs in — jurisdiction before
                merits — but nothing in the data says so, `interpretations` is
                authored as a set, and a numeral would assert a sequence the
                content does not have. */}
            <dl className="rulings">
              {interpretations.map((it, i) => (
                <div key={i} className="ruling">
                  {/* The same register the Court's own determinations take in
                      the write-up: a numeral that counts, the name, and a
                      hairline that takes whatever width is left. Owner:
                      «застосуй дизайн… такий як ми використовували для
                      визначень в попередньому рішенні». */}
                  <dt>
                    {/* Counts, does not name — hidden from a screen reader
                        like every other numeral on this page. */}
                    <span className="d-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="d-term">{pick(it.term, locale)}</span>
                  </dt>
                  <dd>{pick(it.ruling, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* How the Court read the law and whether its interim orders were obeyed
          are different subjects; they were sharing one section and one nav
          entry, so the second was invisible. */}
      {shows("measures") && provisionalMeasures.length > 0 && (
        <section className="pmeas" data-ground={ground["pmeas"]} id="measures" data-navsec aria-label={pick(T.provMeasures, locale)}>
          <div className="rail">
            <div className="sec-h">
              <h2>
              {pick(T.provMeasures, locale)}
              {summary.provisionalMeasuresOrder && (
                <em className="lbl-sub">{pick(summary.provisionalMeasuresOrder, locale)}</em>
              )}
            </h2>
            </div>
            <ul className="pmeasures">
              {provisionalMeasures.map((m, i) => (
                <li key={i} data-order={m.order}>
                  <div className="pm-head">
                    <span className="pm-measure">{pick(m.measure, locale)}</span>
                    <span className="pm-flag">
                      {m.order === "violated"
                        ? pick(T.orderBreached, locale)
                        : pick(T.orderComplied, locale)}
                    </span>
                  </div>
                  {m.note && <p className="pm-note">{pick(m.note, locale)}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 2w — The warrants, wave by wave (ICC situation pages) */}
      {shows("machinery") && warrants && (
        <section className="machinery" data-ground={ground["machinery"]} id="machinery" data-navsec
          aria-label={machineryLabel}>
          <div className="rail machinery-stack">
            <div>
              <div className="sec-h">
                <h2>{pick(warrants.heading, locale)}</h2>
              </div>
              <p className="mach-note">{pick(warrants.note, locale)}</p>
              <WarrantWall
                waves={warrants.waves.map((w) => ({
                  line: w.line,
                  date: L(w.date),
                  iso: w.iso,
                  theme: L(w.theme),
                  summary: L(w.summary),
                  url: w.url,
                  persons: w.persons.map((per) => ({
                    name: L(per.name),
                    role: L(per.role),
                    born: per.born,
                    rung: per.rung,
                    charges: per.charges.map((c) => ({
                      art: c.art,
                      label: L(c.label),
                      kind: c.kind,
                    })),
                    modes: per.modes.map((m) => ({ art: m.art, label: L(m.label) })),
                  })),
                }))}
                rungs={warrants.rungs?.map(L)}
                lines={warrants.lines?.map((ln) => ({
                  key: ln.key,
                  label: L(ln.label),
                  summary: L(ln.summary),
                }))}
                labels={{
                  charges: pick(T.chargesLbl, locale),
                  modes: pick(T.modesLbl, locale),
                  announcement: pick(T.announcementLbl, locale),
                  warCrime: pick(T.warCrimeLbl, locale),
                  cah: pick(T.cahLbl, locale),
                  art: locale === "uk" ? "ст." : "art.",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {summary.warrants && scaleBand}

      {/* 2c — Machinery of the award: whose conduct, and the objections.
          What followed the award is a band of its own below — those are three
          different moments, and they were one band: the objections belong to
          the jurisdictional phase *before* the merits, attribution to the
          reasoning *inside* the award, and the French rounds to what happened
          *after* it. Owner: «роби всі три». */}
      {shows("machinery") && (attribution || objections) && (
        <section className="machinery" data-ground={ground["machinery"]} id={warrants ? undefined : "machinery"} data-navsec
          aria-label={machineryLabel}>
          <div className="rail machinery-stack">
            {attribution && (
              <div>
                <div className="sec-h">
                  <h2>{pick(T.attributionH, locale)}</h2>
                </div>
                <p className="mach-note">{pick(attribution.note, locale)}</p>
                <AttributionTree
                  respondent={pick(attribution.respondent, locale)}
                  nodes={attribution.nodes.map((n) => ({
                    actor: L(n.actor),
                    basis: n.basis,
                    basisNote: L(n.basisNote),
                    did: L(n.did),
                  }))}
                  routes={(attribution.routes ?? []).map((r) => ({
                    basis: r.basis,
                    label: L(r.label),
                  }))}
                />
              </div>
            )}

            {objections && (
              <div id="objections">
                <div className="sec-h">
                  <h2>{pick(objections.heading, locale)}</h2>
                </div>
                <p className="mach-note">{pick(objections.note, locale)}</p>
                <ObjectionCards
                  items={objections.items.map((o) => ({
                    ground: L(o.ground),
                    latin: o.latin,
                    objection: L(o.objection),
                    outcome: o.outcome,
                    reasoning: L(o.reasoning),
                    votes: o.votes?.map((v) => ({
                      for: v.for,
                      against: v.against,
                      scope: v.scope && L(v.scope),
                    })),
                  }))}
                  benchSize={objections.benchSize}
                  labels={{
                    objection: pick(T.objectionLbl, locale),
                    ruling: pick(T.rulingLbl, locale),
                    rejected: pick(T.objRejected, locale),
                    upheld: pick(T.objUpheld, locale),
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}


      {/* 2d — What happened to the award afterwards: the rounds in the French
          courts, what it is worth today and what has actually been taken. */}
      {shows("machinery") && afterlife && (
        <section
          className="machinery after-band"
          data-ground={ground["machinery"]}
          id="after"
          data-navsec
          aria-label={pick(afterlife.heading, locale)}
        >
          <div className="rail machinery-stack">
            {afterlife && (
              <div>
                <div className="sec-h">
                  <h2>{pick(afterlife.heading, locale)}</h2>
                </div>
                <p className="mach-note">{pick(afterlife.note, locale)}</p>
                <AfterlifeStrip
                  stages={afterlife.stages}
                  locale={locale}
                  labels={{
                    standing: pick(T.standing, locale),
                    notStanding: pick(T.notStanding, locale),
                  }}
                />
                {/* What the award is worth today and what has actually been
                    taken — the two figures the tribunal did not decide. They
                    stood under «Що вирішив арбітраж»; this is the band that
                    tells their story. Owner: «чи це дійсно те що вирішив
                    суд?» — no. */}
                {amounts && afterAward.length > 0 && (
                  <div className="af-sums">
                    <MoneyBars
                      figures={afterAward.map((f) => ({
                        label: L(f.label),
                        display: typeof f.display === "string" ? f.display : L(f.display),
                        amount: f.amount,
                        currency: f.currency,
                        estimated: f.estimated,
                        note: f.note && L(f.note),
                        parts: f.parts?.map((pt) => ({
                          label: L(pt.label),
                          display: typeof pt.display === "string" ? pt.display : L(pt.display),
                          amount: pt.amount,
                        })),
                      }))}
                      shareLabel={pick(T.shareOf, locale)}
                      ofLargestLabel={pick(T.ofLargest, locale)}
                      locale={locale}
                    />
                    {amounts.note && (
                      <p className="dash-note">{pick(amounts.note, locale)}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}


      {/* 2m — Where it was decided and what ground it is about.
          A wide-format band of its own: the drawing runs edge to edge and only
          the heading and legend keep the gutter, the way the events map does
          on the home page. Inside .dash-stack it was a 1036px picture in the
          middle of the reading column, letterboxed down to 821px of drawing. */}
      {/* id, data-navsec and a nav entry. It had none of the three: the
          biggest band on the page, and the navigation did not admit it
          existed. */}

      {/* 3 — Reader's guide.

          Two sections, not two columns. They were side by side inside one
          band, 336px and 788px wide, under byte-identical 11px gold uppercase
          headings, and the roster's own role label was set in exactly that
          same style — so the band offered a reader three headings and no way
          to tell a cast list from a dictionary. They are different objects
          and they now have different shapes: the roster is a grid of cards
          across the full rail, each led by a kind chip; the glossary is a
          ruled dictionary poured into two columns. Different grounds, too. */}
      {/* «Хто є хто» stood here and is gone.

          Review: «Забрати учасників» and, on a screenshot of the whole band,
          «Цей підрозділ забрати». Taking the «Учасники» group out left two
          groups — the parties and the court — and those are the first three
          rows of «Картка справи» a screen above: «Заявник — Україна»,
          «Відповідач — Російська Федерація», «Суд — Міжнародний суд ООН».
          A band whose whole content is a restatement of the table over it is
          not a band. `summary.whoIsWho` stays in the data, unread, the way
          `faq` does. */}

      {/* Its own id and its own nav entry. It had neither, so it was reached
          only by scrolling past «Хто є хто» — and the chip that was supposed
          to lead here was pointing at that band instead. */}
      {/* This band is the library's glossary, filtered to one decision.

          The fifty headwords in the archive were only ever reachable through
          whichever decision happened to define them, so a reader who wanted to
          know what «hors de combat» means had to already know which case to
          open. They have a page of their own now, and the link below is this
          band's own contents on it — same terms, plus the other decisions'
          readings of the four words that two courts define differently. */}
      {shows("glossary") && glossaryEnabled && (
        <section className="terms" data-ground={ground["terms"]} id="glossary" data-navsec aria-label={pick(T.glossaryH, locale)}>
          <div className="rail">
            <div className="sec-h">
              <h2>{pick(T.glossaryH, locale)}</h2>
            </div>
            <TermSearch
              terms={glossary.map((g) => ({
                term: pick(g.term, locale),
                def: pick(g.def, locale),
              }))}
              placeholder={pick(T.termsSearch, locale)}
              label={pick(T.termsSearchLabel, locale)}
              clear={pick(T.termsClear, locale)}
              empty={pick(T.termsEmpty, locale)}
            />
            <p className="terms-more">
              <Link href={`/${locale}/glossary?case=${slug}`}>
                {pick(T.glossaryAll, locale)} →
              </Link>
            </p>
          </div>
        </section>
      )}


      {/* «Забрати Часті запитання» (review). The band was an accordion of
          four questions — «То Україна виграла?», «Що буде далі?» — written
          for the page rather than drawn from the decision, in a register
          the archive does not use anywhere else. `summary.faq` stays in the
          data, unread by any surface — the band is gone, and so are the
          FAQPage graph and the search index's «Часті запитання» section,
          because both described text that is no longer on the page. */}

      {/* The apparatus, at the foot of the page.

          It used to be the tail of the verbatim band — one `.readzone`
          holding the summary, the sources and the citation. Moving the
          summary up to follow the lede (review: «самері я б перенесла на
          початок») would have dragged the sources into the middle of the
          page with it, and the review is explicit that the sources stay
          («ЗАЛИШАТИ ХРОНОЛОГІЮ, МІСЦЕ РОЗГЛЯДУ, ОГЛЯД ТА ДЖЕРЕЛА»). So the
          band is split in two: same shell, same `.read` measure, its own
          place in the alternation. */}
      {sources.length > 0 && (
        <section className="readzone" data-ground={ground["srcs"]} aria-label={pick(T.sources, locale)}>
          <div className="rail">
            <article className="read">
          {sources.length > 0 && (
            <>
              <div className="sec-h">
                <h2 id="sec-sources" className="srcs-h2">{pick(T.sources, locale)}</h2>
              </div>
              {(() => {
                // A 45-item wall is unusable: split the court's own record from
                // the commentary, numbering the two lists continuously.
                const official = sources.filter((s) => s.type.startsWith("official"));
                const commentary = sources.filter((s) => !s.type.startsWith("official"));
                const renderList = (items: typeof sources, start: number) => (
                  <ol className="sources" start={start} style={{ counterReset: `cite ${start - 1}` }}>
                    {items.map((s, i) => {
                      // Who, where and when make one quiet line; what kind of
                      // source it is gets its own mark. In an archive meant to be
                      // cited, the gap between the court's own record and a blog
                      // post is the first thing a reader needs, and it used to be
                      // the last word of a four-part grey string.
                      const meta = [s.authors, s.publication, s.date].filter(Boolean);
                      const kind = pick(
                        TYPE_LABEL[s.type] ?? { uk: s.type, en: s.type },
                        locale,
                      );
                      return (
                        <li key={i}>
                          <div className="cite-body">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              lang={foreignLang(s.title, locale)}
                            >
                              {s.title}
                            </a>
                            {meta.length > 0 && (
                              /* Author, publisher and date, and on most rows all
                                 three are English \u2014 "International Criminal
                                 Court \u00b7 9 April 2014". The title above already
                                 reads in its own language because it is a link
                                 to it; this line was the one left for a
                                 Ukrainian voice to guess at. */
                              <span
                                className="cite-meta"
                                lang={foreignLang(meta.join(" "), locale)}
                              >
                                {meta.join(" \u00b7 ")}
                              </span>
                            )}
                          </div>
                          <span
                            className="cite-kind"
                            data-official={s.type.startsWith("official") ? "yes" : "no"}
                          >
                            {kind}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                );
                if (official.length === 0 || commentary.length === 0)
                  return renderList(sources, 1);
                return (
                  <>
                    <h3 className="sources-h">{pick(T.officialH, locale)}</h3>
                    {renderList(official, 1)}
                    <h3 className="sources-h">{pick(T.commentaryH, locale)}</h3>
                    {renderList(commentary, official.length + 1)}
                  </>
                );
              })()}
            </>
          )}

              {/* «Як цитувати» is gone — owner's instruction, every page.

                  It was a formatted citation with a copy button at the foot
                  of the sources. What it produced, a reader can assemble from
                  what is already on the page: the case name, the forum, the
                  date of the decision and this page's own address. An
                  apparatus block that re-states four facts in one order is a
                  fifth place for them to drift out of agreement. */}
            </article>
          </div>
        </section>
      )}

      {/* «Пов'язані рішення» is gone — owner's instruction, every decision:
          «забери з усіх рішень секцію Пов'язані рішення».

          It was a grid of cards at the foot of every page pointing at
          neighbouring cases. The library already answers that question in
          the place a reader asks it — /registry filters the whole docket by
          court, ground and date — and the write-up links a neighbouring
          decision inline wherever it actually bears on the argument. A band
          that guesses at the same relations per page is a third list to keep
          in agreement with those two.

          `summary.related` stays in the data, unread, the way `whoIsWho` and
          `faq` do; the band comes back by restoring this block. Its anchor
          leaves the search index with it — a hit on #related would scroll to
          nothing. */}
        </div>
      </div>
      </main>
    </div>
  );
}

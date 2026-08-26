import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decisionMetadata, jsonLdHtml, siteUrl } from "@/lib/seo";
import { foreignLang, isLocale, type Locale } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import PageNav from "@/components/cases/PageNav";
import CaseTimeline from "@/components/cases/CaseTimeline";
import MoneyBars from "@/components/cases/MoneyBars";
import AttributionTree from "@/components/cases/AttributionTree";
import ObjectionCards from "@/components/cases/ObjectionCards";
import TakingsGrid from "@/components/cases/TakingsGrid";
import AfterlifeStrip from "@/components/cases/AfterlifeStrip";
import WarrantWall from "@/components/cases/WarrantWall";
import GlanceFacts from "@/components/cases/GlanceFacts";
import CaseMap from "@/components/cases/CaseMap";
import { registryCases } from "@/content/cases";
import CasePending, { pendingMetadata } from "@/components/cases/CasePending";
import "./pending.css";
import { SUMMARIES } from "@/content/summaries";
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


/** Localized chrome labels (the summary body stays in its source language). */
const T = {
  overview: { uk: "Огляд", en: "Overview" },
  /* Heading for `DecisionSummary.glance` — the docket facts. Distinct from
     `inShort` ("Якщо коротко"), which heads the plain-language tldr: one is a
     ledger of identifiers, the other is a paragraph. */
  glanceH: { uk: "Картка справи", en: "Case at a glance" },
  timeline: { uk: "Хронологія", en: "Timeline" },
  tracks: { uk: "Два театри", en: "Two theatres" },
  found: { uk: "Що встановив Суд", en: "What the Court found" },
  violation: { uk: "Порушення", en: "Violation" },
  noViolation: { uk: "Немає", en: "No violation" },
  /* The scorecard's noun has to agree with the number printed in front of it,
     and the number depends on what kind of dispositif this is. Three
     Ukrainian forms; English reads the same three keys. */
  ofTotal: { uk: "з", en: "of" },
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
  pagesPdf: { uk: "PDF, {n} с.", en: "PDF, {n} pp." },
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
  progress: { uk: "Прогрес читання", en: "Reading progress" },
  minRead: { uk: "{n} хв читання", en: "{n} min read" },
  glossaryH: { uk: "Словник", en: "Glossary" },
  whoH: { uk: "Хто є хто", en: "Who's who" },
  /* What each actor IS. It used to be carried only by a gold left border on
     the court, which is not a label a reader can read. */
  whoKindParty: { uk: "Сторона", en: "Party" },
  whoKindCourt: { uk: "Суд", en: "Court" },
  whoKindActor: { uk: "Учасник", en: "Actor" },
  faqH: { uk: "Часті запитання", en: "Common questions" },
  relatedH: { uk: "Пов'язані рішення", en: "Related decisions" },
  fullSummary: { uk: "Повне самері", en: "Full summary" },

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
  attributionH: { uk: "Чия поведінка — це поведінка держави", en: "Whose conduct counts as the State's" },
  objectionLbl: { uk: "Заперечення", en: "Objection" },
  rulingLbl: { uk: "Рішення суду", en: "Ruling" },
  objRejected: { uk: "Відхилено", en: "Rejected" },
  objUpheld: { uk: "Прийнято", en: "Upheld" },
  standing: { uk: "Рішення чинне", en: "Award stands" },
  notStanding: { uk: "Рішення скасовано", en: "Award annulled" },
  seatLabel: { uk: "Місце арбітражу", en: "Seat" },

  // Warrant wall.
  chargesLbl: { uk: "Звинувачення", en: "Charges" },
  modesLbl: { uk: "Форма відповідальності", en: "Mode of responsibility" },
  announcementLbl: { uk: "Повідомлення Суду", en: "The Court's announcement" },
  warCrimeLbl: { uk: "Воєнний злочин", en: "War crime" },
  cahLbl: { uk: "Злочин проти людяності", en: "Crime against humanity" },
  asOf: { uk: "станом на", en: "as of" },

  // Page-level navigation and the reader's-guide band.
  navAria: { uk: "Розділи сторінки", en: "Page sections" },
  navWarrants: { uk: "Ордери", en: "Warrants" },
  navAnatomy: { uk: "Розбір рішення", en: "Anatomy" },
  navRulings: { uk: "Тлумачення", en: "Key rulings" },
  navHandbook: { uk: "Що варто знати", en: "What to know" },
  navFulltext: { uk: "Самері", en: "Summary" },
  navSources: { uk: "Джерела", en: "Sources" },
  officialH: { uk: "Офіційні документи Суду", en: "Official court documents" },
  commentaryH: { uk: "Дослідження та коментарі", en: "Research and commentary" },
  updated: { uk: "оновлено", en: "updated" },
  termsInText: { uk: "Терміни в цьому тексті", en: "Terms in this text" },
} as const;

/**
 * Ukrainian agreement: 1 порушення, 2–4 порушення, 5+ порушень, with the teens
 * taking the "many" form and 21 taking "one". English keeps a singular and a
 * plural and reads the same three keys. Same shape as the registry's helper —
 * copied rather than imported, because the two surfaces do not share a module.
 */
/** What each entry in the cast list is. */
const WHO_KIND: Record<"party" | "court" | "actor", Localized> = {
  party: T.whoKindParty,
  court: T.whoKindCourt,
  actor: T.whoKindActor,
};

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
      context={mapContext}
      uaPath={atlas.ukraine}
      regions={atlas.regions}
      seat={{
        name: pick(forum.name, locale),
        caption: pick(forum.caption, locale),
        at: [seat[0], seat[1]],
      }}
      reach={(() => {
        const r = MK[forum.reachTo] ?? MK.kyiv;
        return [r[0], r[1]];
      })()}
      kyiv={{
        label: locale === "uk" ? "Київ" : "Kyiv",
        at: [MK.kyiv[0], MK.kyiv[1]],
      }}
      theatres={theatres.map((t, i) => ({
        id: `t${i}`,
        place: pick(t.place, locale),
        tag: typeof t.tag === "string" ? t.tag : pick(t.tag, locale),
        summary: pick(t.summary, locale),
        pts: t.markerKeys
          .map((k) => MK[k])
          .filter(Boolean)
          .map((p) => [p[0], p[1]] as [number, number]),
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
function Findings({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="findings">
      {lines.map((line, i) => {
        if (/^(ICSFT|CERD)\s*[-–—]/.test(line)) {
          return (
            <p key={i} className="sub">
              {line}
            </p>
          );
        }
        const m = line.match(/^(The Court['’]s position:|Позиція Суду:)(.*)$/);
        if (m) {
          return (
            <p key={i}>
              <span className="pos">{m[1]}</span>
              {m[2]}
            </p>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

/** Render one verbatim block in reading order. */
function Block({ block }: { block: SummaryBlock }) {
  switch (block.kind) {
    case "lead":
      return <p className="lead">{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "h4":
      return <h4>{block.text}</h4>;
    case "findings":
      return <Findings text={block.text} />;
    case "link":
      return null;
    case "dispositif":
      // Everything tagged dispositif is an operative clause except the framing
      // lines ("For the foregoing reasons…", "The Court," / "However…") —
      // detecting the frame is robust across courts; detecting the clause
      // openers was not (ICJ "Finds…", PCA "That…", DTEK "Tribunal has…").
      return /^(For the foregoing|However|The Court,|З наведених|Проте|Суд,)/.test(block.text) ? (
        <p>{block.text}</p>
      ) : (
        <p className="disp">{block.text}</p>
      );
    default:
      return <p>{block.text}</p>;
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
  const pending = registryCases.filter((c) => !c.summarySlug).map((c) => c.id);
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

  const { masthead, judgment, instruments, stats, timeline, verdicts, sources } = summary;
  const { interpretations, plain, glossary, whoIsWho, faq, related } = summary;
  const { theatres = [], provisionalMeasures = [], timelineTracks = [], glance = [] } = summary;
  const { takings, attribution, amounts, objections, afterlife, warrants } = summary;
  const parties = summary.title
    ? pick(summary.title, locale)
    : masthead.parties.replace(/^\(|\)$/g, "");

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

  // Reading-time estimate and table of contents from the body headings.
  const words = body.map((b) => b.text).join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  const readTime = pick(T.minRead, locale).replace("{n}", String(minutes));
  const sections = body
    .filter((b) => b.kind === "h2")
    .map((b, i) => ({ id: `sec-${i}`, text: b.text.trim() }));

  /** Official-text URL for a verdict track, when one exists. Only acronym
   *  (string) abbrs double as verdict track keys. */
  const trackUrl = (track: string): string | undefined =>
    instruments.find((i) => typeof i.abbr === "string" && i.abbr === track)?.url;
  const pagesLabel = judgment.pages
    ? pick(T.pagesPdf, locale).replace("{n}", String(judgment.pages))
    : null;
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
  const [decided, decidedForms] =
    convictions > 0
      ? ([convictions, T.convictionWord] as const)
      : granted > 0
        ? ([granted, T.grantedWord] as const)
        : ([violations, T.violationWord] as const);
  const decidedLabel = `${plural(decided, decidedForms[locale], locale)} ${pick(T.ofTotal, locale)}`;

  /** Resolve a Localized pair for this render's locale (client-prop hygiene:
   *  client components receive plain strings, never both languages). */
  const L = (x: { uk: string; en: string }) => pick(x, locale);

  // Bands of the page, in reading order — the sticky nav names each one.
  const hasMachinery = Boolean(summary.warrants || attribution || objections || afterlife);
  const pageSections = [
    { id: "overview", label: pick(T.overview, locale) },
    { id: "chronology", label: pick(T.timeline, locale) },
    ...(hasMachinery
      ? [
          {
            id: "machinery",
            label: pick(summary.warrants ? T.navWarrants : T.navAnatomy, locale),
          },
        ]
      : []),
    { id: "rulings", label: pick(T.navRulings, locale) },
    ...(provisionalMeasures.length > 0
      ? [{ id: "measures", label: pick(T.provMeasures, locale) }]
      : []),
    { id: "handbook", label: pick(T.navHandbook, locale) },
    { id: "fulltext", label: pick(T.navFulltext, locale) },
    ...(sources.length > 0 ? [{ id: "sec-sources", label: pick(T.navSources, locale) }] : []),
    ...(faq.length > 0 ? [{ id: "questions", label: pick(T.faqH, locale) }] : []),
    ...(related.length > 0 ? [{ id: "related", label: pick(T.relatedH, locale) }] : []),
  ];

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
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: pick(f.q, locale),
          acceptedAnswer: { "@type": "Answer", text: pick(f.a, locale) },
        })),
      },
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
          <span>{masthead.judgment}</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <span className="readtime">{readTime}</span>
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
        <h1 className="official" lang={foreignLang(parties, locale)}>
          {parties}
        </h1>
        <p className="parties">
          {instruments.map((inst, i) => (
            <span key={inst.url}>
              {i > 0 && <span className="sep"> · </span>}
              <a href={inst.url} target="_blank" rel="noopener noreferrer" title={pick(inst.name, locale)}>
                {typeof inst.abbr === "string" ? inst.abbr : pick(inst.abbr, locale)}
              </a>{" "}
              ({inst.year})
            </span>
          ))}
        </p>
        <p className="fullname">{masthead.official}</p>

        <div className="actions">
          {/* The sub-label says who stands behind the document at the other
              end. It was always `judgment.court`, which is right when the link
              is the court's own text and a false attribution when it is not:
              finland-torden's primary button read "Окружний суд Гельсінкі"
              under a link to EJIL:Talk!. */}
          <a className="btn btn-primary" href={judgment.url} target="_blank" rel="noopener noreferrer">
            {pick(judgment.readLabel ?? T.readJudgment, locale)}
            <em>
              {readSrc.caption ?? pick(judgment.court, locale)}
              {pagesLabel ? ` · ${pagesLabel}` : ""}
            </em>
          </a>
          <a className="btn btn-ghost" href={judgment.caseUrl} target="_blank" rel="noopener noreferrer">
            {pick(judgment.fileLabel ?? T.caseFile, locale)}
            {fileSrc.caption && <em>{fileSrc.caption}</em>}
          </a>
        </div>
        </div>
      </header>

      {/* 1a — Sticky page navigation: every band, not just the article */}
      <PageNav sections={pageSections} ariaLabel={pick(T.navAria, locale)} />

      {/* 1c — What this text is. Above the plain-language lede, because the
          lede is written from the same provisional summary the notice is
          about; a reader meets the caveat before the first sentence they
          might quote. Nothing renders on a page whose flags set no notice. */}

      {/* 1b — Plain-language lede */}
      <section className="lede">
        <div className="rail lede-grid">
          <div className="tldr">
            <div className="lbl-light">{pick(T.inShort, locale)}</div>
            <p>{pick(plain.tldr, locale)}</p>
          </div>
          <aside className="why">
            <div className="lbl-light">{pick(T.whyMatters, locale)}</div>
            <p>{pick(plain.whyMatters, locale)}</p>
          </aside>
        </div>
      </section>

      {/* 2 — Dashboard: one column of full-width instruments */}
      <section className="dash" id="overview" data-navsec aria-label={pick(T.overview, locale)}>
        <div className="rail dash-stack">
          {/* The docket facts, then the figures. `glance` is authored on all
              eight summaries — 48 facts — and rendered nowhere until now. */}
          {glance.length > 0 && (
            <div>
              <h2 className="lbl lbl-onpaper">{pick(T.glanceH, locale)}</h2>
              <GlanceFacts
                facts={glance.map((g) => ({
                  label: pick(g.label, locale),
                  value: pick(g.value, locale),
                }))}
              />
            </div>
          )}

          <div>
            <h2 className="lbl lbl-onpaper">{pick(T.overview, locale)}</h2>
            <div className="kpis">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="kpi"
                  data-em={s.em || s.label.en === "violations found" ? "1" : undefined}
                >
                  <b>{typeof s.value === "string" ? s.value : pick(s.value, locale)}</b>
                  <span>{pick(s.label, locale)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="score-head">
              <h2>{pick(summary.verdictsHeading ?? T.found, locale)}</h2>
              <span className="score-count">
                <b>{decided}</b> {decidedLabel} {verdicts.length}
              </span>
            </div>
            <ul className="verdicts">
                {verdicts.map((v, i) => {
                  const prev = verdicts[i - 1];
                  const showTrack = !prev || prev.track !== v.track;
                  const url = trackUrl(v.track);
                  return (
                    <li key={i}>
                      {showTrack &&
                        (url ? (
                          <a
                            className="v-track v-track-link"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {v.track} ↗
                          </a>
                        ) : (
                          <span className="v-track">
                            {v.trackLabel ? pick(v.trackLabel, locale) : v.track}
                          </span>
                        ))}
                      <span className="v-claim">{pick(v.claim, locale)}</span>
                      <span className="v-out" data-o={v.outcome}>
                        {pick(OUTCOME_LABEL[v.outcome], locale)}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>

          {takings && (
            <div>
              <div className="lbl lbl-onpaper">{pick(takings.heading, locale)}</div>
              <TakingsGrid metrics={takings.metrics} locale={locale} />
              {takings.note && (
                <p className="dash-note">
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
                </p>
              )}
            </div>
          )}

          {amounts && (
            <div>
              <div className="lbl lbl-onpaper">{pick(T.amountsH, locale)}</div>
              <MoneyBars
                figures={amounts.figures.map((f) => ({
                  label: L(f.label),
                  display: typeof f.display === "string" ? f.display : L(f.display),
                  amount: f.amount,
                  estimated: f.estimated,
                  note: f.note && L(f.note),
                  parts: f.parts?.map((pt) => ({
                    label: L(pt.label),
                    display: typeof pt.display === "string" ? pt.display : L(pt.display),
                    amount: pt.amount,
                  })),
                }))}
                shareLabel={pick(T.shareOf, locale)}
              />
              {amounts.note && <p className="dash-note">{pick(amounts.note, locale)}</p>}
            </div>
          )}

        </div>
      </section>

      {/* 2m — Where it was decided and what ground it is about.
          A wide-format band of its own: the drawing runs edge to edge and only
          the heading and legend keep the gutter, the way the events map does
          on the home page. Inside .dash-stack it was a 1036px picture in the
          middle of the reading column, letterboxed down to 821px of drawing. */}
      {theatres.length > 0 && (
        <section className="mapband" aria-label={pick(summary.theatresHeading ?? T.seatLabel, locale)}>
          <h2 className="lbl">
            {pick(
              summary.theatresHeading ??
                (theatres.length > 1 ? T.tracks : T.seatLabel),
              locale,
            )}
          </h2>
          <TheatreMap
            theatres={theatres}
            locale={locale}
            forum={mapForum}
          />
        </section>
      )}

      {/* 2t — Chronology. Its own band, its own heading: it used to be the
          tail of the dashboard, below the money bars, under a <div> label. */}
      <section className="chron" id="chronology" data-navsec aria-label={pick(T.timeline, locale)}>
        <div className="rail">
          <h2 className="lbl lbl-onpaper">{pick(T.timeline, locale)}</h2>
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
              openDetail: pick(T.openDetail, locale),
              railLabel: pick(T.railLabel, locale),
            }}
          />
        </div>
      </section>

      {/* 2w — The warrants, wave by wave (ICC situation pages) */}
      {warrants && (
        <section className="machinery" id="machinery" data-navsec
          aria-label={pick(summary.warrants ? T.navWarrants : T.navAnatomy, locale)}>
          <div className="rail machinery-stack">
            <div>
              <div className="lbl lbl-onpaper">{pick(warrants.heading, locale)}</div>
              <p className="mach-note">{pick(warrants.note, locale)}</p>
              <WarrantWall
                waves={warrants.waves.map((w) => ({
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

      {/* 2c — Machinery of the award: attribution, objections, what followed */}
      {(attribution || objections || afterlife) && (
        <section className="machinery" id={warrants ? undefined : "machinery"} data-navsec
          aria-label={pick(T.navAnatomy, locale)}>
          <div className="rail machinery-stack">
            {attribution && (
              <div>
                <div className="lbl lbl-onpaper">{pick(T.attributionH, locale)}</div>
                <p className="mach-note">{pick(attribution.note, locale)}</p>
                <AttributionTree
                  respondent={pick(attribution.respondent, locale)}
                  nodes={attribution.nodes.map((n) => ({
                    actor: L(n.actor),
                    basis: n.basis,
                    basisNote: L(n.basisNote),
                    did: L(n.did),
                  }))}
                />
              </div>
            )}

            {objections && (
              <div>
                <div className="lbl lbl-onpaper">{pick(objections.heading, locale)}</div>
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

            {afterlife && (
              <div>
                <div className="lbl lbl-onpaper">{pick(afterlife.heading, locale)}</div>
                <p className="mach-note">{pick(afterlife.note, locale)}</p>
                <AfterlifeStrip
                  stages={afterlife.stages}
                  locale={locale}
                  labels={{
                    standing: pick(T.standing, locale),
                    notStanding: pick(T.notStanding, locale),
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2b — Reference: doctrine and the interim order, on paper */}
      <section className="refs" id="rulings" data-navsec aria-label={pick(T.navRulings, locale)}>
        <div className="rail">
          <div className="lbl lbl-onpaper">{pick(T.keyRulings, locale)}</div>
          <div className="rulings-grid">
            {interpretations.map((it, i) => (
              <div key={i} className="ruling">
                <b>{pick(it.term, locale)}</b>
                <p>{pick(it.ruling, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Court read the law and whether its interim orders were obeyed
          are different subjects; they were sharing one section and one nav
          entry, so the second was invisible. */}
      {provisionalMeasures.length > 0 && (
        <section className="pmeas" id="measures" data-navsec aria-label={pick(T.provMeasures, locale)}>
          <div className="rail">
            <div className="lbl lbl-onpaper">
              {pick(T.provMeasures, locale)}
              {summary.provisionalMeasuresOrder && (
                <em className="lbl-sub">{pick(summary.provisionalMeasuresOrder, locale)}</em>
              )}
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

      {/* 3 — Reader's guide.

          Two sections, not two columns. They were side by side inside one
          band, 336px and 788px wide, under byte-identical 11px gold uppercase
          headings, and the roster's own role label was set in exactly that
          same style — so the band offered a reader three headings and no way
          to tell a cast list from a dictionary. They are different objects
          and they now have different shapes: the roster is a grid of cards
          across the full rail, each led by a kind chip; the glossary is a
          ruled dictionary poured into two columns. Different grounds, too. */}
      <section className="aids" id="handbook" data-navsec aria-label={pick(T.whoH, locale)}>
        <div className="rail">
          <h2 className="lbl lbl-onpaper">{pick(T.whoH, locale)}</h2>
          <ul className="who">
            {whoIsWho.map((w, i) => (
              <li key={i} data-kind={w.kind}>
                <span className="who-kind">{pick(WHO_KIND[w.kind], locale)}</span>
                <b>{pick(w.name, locale)}</b>
                <span className="who-role">{pick(w.role, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="terms" aria-label={pick(T.glossaryH, locale)}>
        <div className="rail">
          <h2 className="lbl lbl-onpaper">{pick(T.glossaryH, locale)}</h2>
          <dl className="glossary">
            {glossary.map((g, i) => (
              <div key={i} id={`term-${i}`}>
                <dt>{pick(g.term, locale)}</dt>
                <dd>{pick(g.def, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 4 — Verbatim summary. The page bar is the only navigation. */}
      <section className="readzone" id="fulltext" data-navsec aria-label={pick(T.navFulltext, locale)}>
        <div className="rail">
          <article className="read">
            {/* The same caveat, again, at the head of the text it is about —
                the page nav lets a reader jump straight here and skip the
                band under the masthead. */}
            {glossary.length > 0 && (
              <nav className="termchips" aria-label={pick(T.termsInText, locale)}>
                <span className="termchips-lbl">{pick(T.termsInText, locale)}:</span>
                {glossary.map((g, i) => (
                  <a key={i} href={`#term-${i}`}>
                    {pick(g.term, locale)}
                  </a>
                ))}
              </nav>
            )}
        {(() => {
          let h2i = 0;
          return body.map((b, i) =>
            b.kind === "h2" ? (
              <h2 id={`sec-${h2i++}`} key={i}>
                {b.text}
              </h2>
            ) : (
              <Block key={i} block={b} />
            ),
          );
        })()}

        {sources.length > 0 && (
          <>
            <h2 id="sec-sources" className="srcs-h2">{pick(T.sources, locale)}</h2>
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
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.title}
                          </a>
                          {meta.length > 0 && (
                            <span className="cite-meta">{meta.join(" \u00b7 ")}</span>
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
          </article>
        </div>
      </section>

      {/*
        Two separate things, so two sections. Questions are read — an accordion
        at reading width. Neighbouring decisions are navigation — cards you
        click. They were one grid, which made the second look like more prose.
      */}
      {faq.length > 0 && (
        <section className="qa" id="questions" aria-label={pick(T.faqH, locale)}>
          <div className="rail">
            <div className="lbl lbl-onpaper">{pick(T.faqH, locale)}</div>
            <div className="qa-list">
              {faq.map((f, i) => (
                <details key={i} open>
                  <summary>{pick(f.q, locale)}</summary>
                  <p>{pick(f.a, locale)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="neighbours" id="related" aria-label={pick(T.relatedH, locale)}>
          <div className="rail">
            <div className="lbl lbl-onpaper">{pick(T.relatedH, locale)}</div>
            <ul className="nb-grid">
              {related.map((r, i) => {
                // The note is "court · detail"; the court leads the card so the
                // set can be scanned by forum. I tried the generated share
                // cards here first — at 240px their headline is illegible and
                // repeats the title underneath, for 130kB each.
                const note = pick(r.note, locale);
                const [forum, ...rest] = note.split("·").map((x) => x.trim());
                return (
                  <li key={i}>
                    <a href={`/${locale}${r.href}`}>
                      <span className="nb-forum">{forum}</span>
                      <b>{pick(r.label, locale)}</b>
                      {rest.length > 0 && (
                        <span className="nb-note">{rest.join(" · ")}</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
      </main>
    </div>
  );
}

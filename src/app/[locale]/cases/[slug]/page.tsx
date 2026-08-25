import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decisionMetadata, siteUrl } from "@/lib/seo";
import { isLocale, type Locale } from "@/i18n/config";
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
import uaMap from "@/content/summaries/ukraine-map.json";
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
  back: { uk: "До реєстру", en: "Back to registry" },
  readJudgment: { uk: "Читати рішення", en: "Read the judgment" },
  caseFile: { uk: "Справа на сайті Суду", en: "Case file at the Court" },
  pagesPdf: { uk: "PDF, {n} с.", en: "PDF, {n} pp." },
  keyRulings: { uk: "Ключові тлумачення", en: "Key rulings on the law" },
  provMeasures: { uk: "Тимчасові заходи", en: "Provisional measures" },
  provSub: { uk: "Наказ від 19 квітня 2017", en: "Order of 19 April 2017" },
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

  // Outcomes beyond the court-style violation / no-violation pair.
  granted: { uk: "Задоволено", en: "Upheld" },
  rejected: { uk: "Відхилено", en: "Rejected" },
  notDecided: { uk: "Не розглядалося", en: "Not decided" },
  convicted: { uk: "Засуджено", en: "Convicted" },
  acquitted: { uk: "Виправдано", en: "Acquitted" },

  // Instruments an arbitral award earns.
  allEvents: { uk: "Усе", en: "All" },
  openDetail: { uk: "Показати деталі", en: "Show detail" },
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
  provisionalNote: {
    uk: "Текст самері — попередня версія: вкладку в робочому документі ще не фіналізовано. Після фіналізації текст на цій сторінці буде оновлено.",
    en: "The summary text is a preliminary version: its tab in the working document is not yet finalized. This page will be updated when it is.",
  },
  translationNote: {
    uk: "Український переклад — чернетка, очікує юридичної вичитки; мовою запису є англійська.",
    en: "The Ukrainian translation is a draft pending legal review; English is the language of record.",
  },

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
function plural(n: number, forms: { one: string; few: string; many: string }) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms.many;
  const mod10 = n % 10;
  if (mod10 === 1) return forms.one;
  if (mod10 >= 2 && mod10 <= 4) return forms.few;
  return forms.many;
}

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
  "news/insight": { uk: "аналітика", en: "news / insight" },
  "preprint/repository": { uk: "препринт / репозиторій", en: "preprint / repository" },
  "official/ICC": { uk: "офіційний документ МКС", en: "ICC official document" },
  "official/award": { uk: "текст рішення", en: "award text" },
  "official/treaty": { uk: "текст договору", en: "treaty text" },
  "official/filing": { uk: "процесуальний документ", en: "court filing" },
};

/**
 * Markers the atlas does not carry, in the atlas's own projection.
 *
 * ukraine-map.json is owned by another process, so these live here instead of
 * in the asset. They are fitted, not guessed: the asset is a Mercator
 * projection, and a least-squares fit over its four unambiguous city markers
 * (hague, kyiv, donetsk, luhansk) recovers it as
 *
 *   x = 1449.14 · λ + (−44.24)              λ, φ in radians
 *   y = 1746.36 − 1449.14 · ln(tan(π/4 + φ/2))
 *
 * which reproduces those four to within 1.5px and the two approximate
 * region markers (paris, simferopol) to within 7px. Helsinki
 * (60.1699 N, 24.9384 E) therefore lands at (586.5, −170.7) — 171px above the
 * default 0 0 1000 560 frame, which is why a summary that uses it has to widen
 * the frame with `mapViewBox`.
 */
const EXTRA_MK: Record<string, number[]> = {
  helsinki: [586.5, -170.7],
};

const MK: Record<string, number[]> = {
  ...(uaMap.markers as Record<string, number[]>),
  ...EXTRA_MK,
};

const mapContext = (uaMap as { context?: string[] }).context ?? [];

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
  viewBox,
}: {
  theatres: Theatre[];
  locale: Locale;
  forum: {
    key: string;
    name: Localized;
    caption: Localized;
    reachTo: string;
  };
  /** Per-summary frame override. Omitted, every page keeps the atlas frame. */
  viewBox?: string;
}) {
  const frame = viewBox ?? uaMap.viewBox;
  const [vw0, vh0, vw, vh] = frame.split(" ").map(Number);
  const seat = MK[forum.key] ?? MK.hague;
  const reach = MK[forum.reachTo] ?? MK.kyiv;
  return (
    <div className="map-wrap">
      <svg className="map" viewBox={frame} role="img" aria-label="Map of Europe">
        <defs>
          <clipPath id="mapclip">
            <rect x={vw0} y={vh0} width={vw} height={vh} />
          </clipPath>
        </defs>
        <g clipPath="url(#mapclip)">
          {mapContext.map((d, i) => (
            <path key={i} className="ctx" d={d} />
          ))}
          <path className="ua-fill" d={uaMap.path} />

          {/* the forum's reach: seat → the ground in dispute */}
          <line className="reach" x1={seat[0]} y1={seat[1]} x2={reach[0]} y2={reach[1]} />

          {/* the seat of the proceedings */}
          <g>
            <circle className="mk-court" cx={seat[0]} cy={seat[1]} r={10} />
            <text className="mk-treaty" x={seat[0] + 18} y={seat[1] - 8}>
              {pick(forum.name, locale)}
            </text>
            <text className="mk-city-label" x={seat[0] + 18} y={seat[1] + 18}>
              {pick(forum.caption, locale)}
            </text>
          </g>

          {/* Kyiv reference */}
          <circle className="mk-city" cx={MK.kyiv[0]} cy={MK.kyiv[1]} r={7} />
          <text className="mk-city-label" x={MK.kyiv[0] + 14} y={MK.kyiv[1] - 8}>
            {locale === "uk" ? "Київ" : "Kyiv"}
          </text>

          {theatres.map((t) => {
            const pts = t.markerKeys.map((k) => MK[k]).filter(Boolean);
            const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
            const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
            // keep centred labels inside the 0..1000 viewBox
            const lx = Math.min(Math.max(cx + (t.labelDx ?? 0), 130), 860);
            return (
              <g key={pick(t.place, locale)}>
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle className="zone-halo" cx={p[0]} cy={p[1]} r={40} />
                    <circle className="zone" cx={p[0]} cy={p[1]} r={9} />
                  </g>
                ))}
                <text className="mk-treaty" x={lx} y={cy - 84 + (t.labelDy ?? 0)} textAnchor="middle">
                  {typeof t.tag === "string" ? t.tag : pick(t.tag, locale)}
                </text>
                <text className="mk-label" x={lx} y={cy - 56 + (t.labelDy ?? 0)} textAnchor="middle">
                  {pick(t.place, locale)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="map-legend">
        <span>
          <i className="lg-court" />
          {pick(forum.name, locale)} — {pick(forum.caption, locale)}
        </span>
        {theatres.map((t, i) => {
          const tag = typeof t.tag === "string" ? t.tag : pick(t.tag, locale);
          return (
            <span key={i}>
              <i />
              {pick(t.place, locale)} — <b>{tag}</b>
            </span>
          );
        })}
      </div>
    </div>
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
    description: pick(summary.plain.tldr, locale),
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
  const { theatres = [], provisionalMeasures = [], timelineTracks = [] } = summary;
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
  const decidedLabel = `${plural(decided, decidedForms[locale])} ${pick(T.ofTotal, locale)}`;

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
        // The decision itself is a court document, not legislation; the
        // treaties it applies stay Legislation in `mentions` below.
        about: {
          "@type": "CreativeWork",
          name: masthead.official,
          creator: { "@type": "Organization", name: pick(judgment.court, locale) },
          datePublished: judgment.date,
          url: judgment.caseUrl ?? judgment.url,
        },
        isBasedOn: judgment.url,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The content region. There was none: the skip link pointed at
          #overview — the dashboard, past the h1 and the case caption — and a
          screen reader had no main landmark on any of the eight pages. */}
      <main id="content">

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
        <h1 className="official">{parties}</h1>
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
          <a className="btn btn-primary" href={judgment.url} target="_blank" rel="noopener noreferrer">
            {pick(judgment.readLabel ?? T.readJudgment, locale)}
            <em>
              {pick(judgment.court, locale)}
              {pagesLabel ? ` · ${pagesLabel}` : ""}
            </em>
          </a>
          <a className="btn btn-ghost" href={judgment.caseUrl} target="_blank" rel="noopener noreferrer">
            {pick(judgment.fileLabel ?? T.caseFile, locale)}
          </a>
        </div>
        </div>
      </header>

      {/* 1a — Sticky page navigation: every band, not just the article */}
      <PageNav sections={pageSections} ariaLabel={pick(T.navAria, locale)} />

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
          <div>
            <h2 className="lbl">{pick(T.overview, locale)}</h2>
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
              <div className="lbl">{pick(takings.heading, locale)}</div>
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
              <div className="lbl">{pick(T.amountsH, locale)}</div>
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
            viewBox={summary.mapViewBox}
          />
        </section>
      )}

      {/* 2t — Chronology. Its own band, its own heading: it used to be the
          tail of the dashboard, below the money bars, under a <div> label. */}
      <section className="chron" id="chronology" data-navsec aria-label={pick(T.timeline, locale)}>
        <div className="rail">
          <h2 className="lbl">{pick(T.timeline, locale)}</h2>
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
              <em className="lbl-sub">{pick(T.provSub, locale)}</em>
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

      {/* 3 — Reader's guide: the reference layer, ahead of the long read.
          Grouped by use: the question-and-answer column (common questions,
          related decisions) beside the reference column (who's who, glossary). */}
      <section className="aids" id="handbook" data-navsec aria-label={pick(T.navHandbook, locale)}>
        <div className="rail">
          {/* No label above the two column headings: "Довідник / Хто є хто /
              Словник" was three levels of naming for one lookup panel. The nav
              names the section; the columns name themselves. */}
          <div className="aids-grid">
              {/* Who's who is a cast list: what each actor is, who they are,
                  what they did. The glossary below is a dictionary. They used
                  to be the same bold-name-plus-grey-line pair poured into one
                  two-column flow, which is why they read as one panel twice. */}
              <div className="aid aid-who">
                <h2 className="lbl">{pick(T.whoH, locale)}</h2>
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

              <div className="aid aid-glossary">
                <h2 className="lbl">{pick(T.glossaryH, locale)}</h2>
                <dl className="glossary">
                  {glossary.map((g, i) => (
                    <div key={i} id={`term-${i}`}>
                      <dt>{pick(g.term, locale)}</dt>
                      <dd>{pick(g.def, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
          </div>
        </div>
      </section>

      {/* 4 — Verbatim summary. The page bar is the only navigation. */}
      <section className="readzone" id="fulltext" data-navsec aria-label={pick(T.navFulltext, locale)}>
        <div className="rail">
          <article className="read">
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
            <h2 id="sec-sources">{pick(T.sources, locale)}</h2>
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
                <details key={i} open={i === 0}>
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

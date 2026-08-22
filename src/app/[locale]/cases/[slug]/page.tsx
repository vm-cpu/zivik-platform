import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decisionMetadata, siteUrl } from "@/lib/seo";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import PageNav from "@/components/cases/PageNav";
import CaseTimeline from "@/components/cases/CaseTimeline";
import MoneyBars from "@/components/cases/MoneyBars";
import AttributionTree from "@/components/cases/AttributionTree";
import ObjectionCards from "@/components/cases/ObjectionCards";
import TakingsGrid from "@/components/cases/TakingsGrid";
import AfterlifeStrip from "@/components/cases/AfterlifeStrip";
import WarrantWall from "@/components/cases/WarrantWall";
import { icjCerdIcsft } from "@/content/summaries/icj-cerd-icsft";
import { icjGenocide } from "@/content/summaries/icj-genocide";
import { oschadbank } from "@/content/summaries/oschadbank";
import { iccUkraine } from "@/content/summaries/icc-ukraine";
import type { Localized } from "@/content/types";
import type {
  DecisionSummary,
  Outcome,
  SummaryBlock,
  Theatre,
} from "@/content/summaries/types";
import uaMap from "@/content/summaries/ukraine-map.json";
import "../case.css";

/** Slug → decision summary. Grows as summaries are ingested. */
const SUMMARIES: Record<string, DecisionSummary> = {
  "icj-cerd-icsft": icjCerdIcsft,
  "icj-genocide": icjGenocide,
  oschadbank: oschadbank,
  "icc-ukraine": iccUkraine,
};

/** Localized chrome labels (the summary body stays in its source language). */
const T = {
  overview: { uk: "Огляд", en: "Overview" },
  timeline: { uk: "Хронологія", en: "Timeline" },
  tracks: { uk: "Два театри", en: "Two theatres" },
  found: { uk: "Що встановив Суд", en: "What the Court found" },
  violation: { uk: "Порушення", en: "Violation" },
  noViolation: { uk: "Немає", en: "No violation" },
  violationsOf: { uk: "порушення з", en: "violations of" },
  sources: { uk: "Джерела та коментарі", en: "Researches and other materials" },
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
  faqH: { uk: "Часті запитання", en: "Common questions" },
  relatedH: { uk: "Пов'язані рішення", en: "Related decisions" },
  fullSummary: { uk: "Повне самері", en: "Full summary" },

  // Outcomes beyond the court-style violation / no-violation pair.
  granted: { uk: "Задоволено", en: "Upheld" },
  rejected: { uk: "Відхилено", en: "Rejected" },
  notDecided: { uk: "Не розглядалося", en: "Not decided" },
  grantedOf: { uk: "задоволено з", en: "granted of" },

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
  navHandbook: { uk: "Довідник", en: "Reader's guide" },
  navFulltext: { uk: "Самері", en: "Summary" },
  navSources: { uk: "Джерела", en: "Sources" },
  officialH: { uk: "Офіційні документи Суду", en: "Official court documents" },
  commentaryH: { uk: "Дослідження та коментарі", en: "Research and commentary" },
  updated: { uk: "оновлено", en: "updated" },
} as const;

/** Chrome label for each way a claim can be disposed of. */
const OUTCOME_LABEL: Record<Outcome, Localized> = {
  violation: T.violation,
  "no-violation": T.noViolation,
  granted: T.granted,
  rejected: T.rejected,
  "not-decided": T.notDecided,
};

const TYPE_LABEL: Record<string, { uk: string; en: string }> = {
  "blog post": { uk: "допис у блозі", en: "blog post" },
  "journal article": { uk: "стаття в журналі", en: "journal article" },
  "news/insight": { uk: "аналітика", en: "news / insight" },
  "preprint/repository": { uk: "препринт / репозиторій", en: "preprint / repository" },
  "official/ICC": { uk: "офіційний документ МКС", en: "ICC official document" },
};

const MK = uaMap.markers as Record<string, number[]>;

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
  const [vw0, vh0, vw, vh] = uaMap.viewBox.split(" ").map(Number);
  const seat = MK[forum.key] ?? MK.hague;
  const reach = MK[forum.reachTo] ?? MK.kyiv;
  return (
    <div className="map-wrap">
      <svg className="map" viewBox={uaMap.viewBox} role="img" aria-label="Map of Europe">
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
                  {typeof t.treaty === "string" ? t.treaty : pick(t.treaty, locale)}
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
          const tag = typeof t.treaty === "string" ? t.treaty : pick(t.treaty, locale);
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
      // Operative items open with Finds/Rejects (EN), Встановлює/Відхиляє (UK)
      // or, in an arbitral dispositif, "That the Respondent shall…"; the
      // framing lines ("The Court," / "However…") stay plain paragraphs.
      return /^(Finds|Rejects|That |Встановлює|Відхиляє|Що )/.test(block.text) ? (
        <p className="disp">{block.text}</p>
      ) : (
        <p>{block.text}</p>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export function generateStaticParams() {
  return Object.keys(SUMMARIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const summary = SUMMARIES[slug];
  if (!isLocale(locale) || !summary) return {};
  const dict = await getDictionary(locale);
  const parties = summary.masthead.parties.replace(/^\(|\)$/g, "");
  return decisionMetadata({
    locale,
    slug,
    title: `${parties} — ${pick(summary.judgment.court, locale)}`,
    description: pick(summary.plain.tldr, locale),
    ogAlt: dict.meta.ogAlt,
    siteName: dict.brand.wordmark,
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
  if (!summary) notFound();

  const dict = await getDictionary(locale);
  const { masthead, judgment, instruments, stats, timeline, verdicts, sources } = summary;
  const { interpretations, plain, glossary, whoIsWho, faq, related } = summary;
  const { theatres = [], provisionalMeasures = [], timelineTracks = [] } = summary;
  const { takings, attribution, amounts, objections, afterlife, warrants } = summary;
  const parties = masthead.parties.replace(/^\(|\)$/g, "");

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

  /** Official-text URL for a verdict track, when one exists. */
  const trackUrl = (track: string): string | undefined =>
    instruments.find((i) => i.abbr === track)?.url;
  const pagesLabel = judgment.pages
    ? pick(T.pagesPdf, locale).replace("{n}", String(judgment.pages))
    : null;
  /*
   * The scorecard counts what the dispositif is mostly made of. An inter-State
   * judgment turns on breaches, so it counts violations. An arbitral award
   * turns on what was granted — counting its single expropriation finding as
   * "1 of 9" would badly understate an award the claimant won outright.
   */
  const granted = verdicts.filter((v) => v.outcome === "granted").length;
  const decided = granted > 0 ? granted : violations;
  const decidedLabel = granted > 0 ? pick(T.grantedOf, locale) : pick(T.violationsOf, locale);

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
    { id: "handbook", label: pick(T.navHandbook, locale) },
    { id: "fulltext", label: pick(T.navFulltext, locale) },
    ...(sources.length > 0 ? [{ id: "sec-sources", label: pick(T.navSources, locale) }] : []),
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
        about: {
          "@type": "Legislation",
          name: masthead.official,
          legislationJurisdiction: pick(judgment.court, locale),
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
          alternateName: i.abbr,
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
            item: `${siteUrl}/${locale}#registry`,
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
      <Header locale={locale} dict={dict} />

      {/* 1 — Masthead. The band is full-bleed; the rail sits inside it, like
          every other band on the page. Merging the two capped the dark ground
          at the rail's 1180px and left paper down both edges on a wide screen. */}
      <header className="mast">
        <div className="rail">
        <Link href={`/${locale}#registry`} className="backlink">
          ← {pick(T.back, locale)}
        </Link>
        <div className="eyebrow">
          <span>{pick(forum.institution, locale)}</span>
          <span className="dot">·</span>
          <span>{pick(forum.seat, locale)}</span>
          <span className="dot">·</span>
          <span>{masthead.judgment}</span>
          <span className="dot">·</span>
          <span className="readtime">{readTime}</span>
          {summary.asOf && (
            <>
              <span className="dot">·</span>
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
            <span key={inst.abbr}>
              {i > 0 && <span className="sep"> · </span>}
              <a href={inst.url} target="_blank" rel="noopener noreferrer" title={pick(inst.name, locale)}>
                {inst.abbr}
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
      <section className="dash" id="overview" data-navsec>
        <div className="rail dash-stack">
          <div>
            <div className="lbl">{pick(T.overview, locale)}</div>
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

          {theatres.length > 0 && (
            <div>
              <div className="lbl">
                {pick(
                  summary.theatresHeading ??
                    (theatres.length > 1 ? T.tracks : T.seatLabel),
                  locale,
                )}
              </div>
              <TheatreMap theatres={theatres} locale={locale} forum={mapForum} />
            </div>
          )}

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
                figures={amounts.figures}
                locale={locale}
                shareLabel={pick(T.shareOf, locale)}
              />
              {amounts.note && <p className="dash-note">{pick(amounts.note, locale)}</p>}
            </div>
          )}

          <div id="chronology" data-navsec>
            <div className="lbl">{pick(T.timeline, locale)}</div>
            <CaseTimeline
              events={timeline}
              tracks={timelineTracks}
              locale={locale}
              labels={{
                all: pick(T.allEvents, locale),
                openDetail: pick(T.openDetail, locale),
              }}
            />
          </div>
        </div>
      </section>

      {/* 2w — The warrants, wave by wave (ICC situation pages) */}
      {warrants && (
        <section className="machinery" id="machinery" data-navsec>
          <div className="rail machinery-stack">
            <div>
              <div className="lbl lbl-onpaper">{pick(warrants.heading, locale)}</div>
              <p className="mach-note">{pick(warrants.note, locale)}</p>
              <WarrantWall
                waves={warrants.waves}
                rungs={warrants.rungs}
                locale={locale}
                labels={{
                  charges: pick(T.chargesLbl, locale),
                  modes: pick(T.modesLbl, locale),
                  announcement: pick(T.announcementLbl, locale),
                  warCrime: pick(T.warCrimeLbl, locale),
                  cah: pick(T.cahLbl, locale),
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 2c — Machinery of the award: attribution, objections, what followed */}
      {(attribution || objections || afterlife) && (
        <section className="machinery" id={warrants ? undefined : "machinery"} data-navsec>
          <div className="rail machinery-stack">
            {attribution && (
              <div>
                <div className="lbl lbl-onpaper">{pick(T.attributionH, locale)}</div>
                <p className="mach-note">{pick(attribution.note, locale)}</p>
                <AttributionTree
                  respondent={pick(attribution.respondent, locale)}
                  nodes={attribution.nodes}
                  locale={locale}
                />
              </div>
            )}

            {objections && (
              <div>
                <div className="lbl lbl-onpaper">{pick(objections.heading, locale)}</div>
                <p className="mach-note">{pick(objections.note, locale)}</p>
                <ObjectionCards
                  items={objections.items}
                  locale={locale}
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
      <section className="refs" id="rulings" data-navsec>
        <div className="rail refs-grid" data-single={provisionalMeasures.length ? "no" : "yes"}>
          <div>
            <div className="lbl lbl-onpaper">{pick(T.keyRulings, locale)}</div>
            {interpretations.map((it, i) => (
              <div key={i} className="ruling">
                <b>{pick(it.term, locale)}</b>
                <p>{pick(it.ruling, locale)}</p>
              </div>
            ))}
          </div>

          {provisionalMeasures.length > 0 && (
            <div>
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
          )}
        </div>
      </section>

      {/* 3 — Reader's guide: the reference layer, ahead of the long read.
          Grouped by use: the question-and-answer column (common questions,
          related decisions) beside the reference column (who's who, glossary). */}
      <section className="aids" id="handbook" data-navsec>
        <div className="rail">
          <div className="lbl lbl-onpaper">{pick(T.navHandbook, locale)}</div>
          <div className="aids-grid">
              <div className="aid">
                <div className="lbl">{pick(T.faqH, locale)}</div>
                <div className="faq">
                  {faq.map((f, i) => (
                    <details key={i} open={i === 0}>
                      <summary>{pick(f.q, locale)}</summary>
                      <p>{pick(f.a, locale)}</p>
                    </details>
                  ))}
                </div>
              </div>

              <div className="aid">
                <div className="lbl">{pick(T.relatedH, locale)}</div>
                <ul className="related">
                  {related.map((r, i) => (
                    <li key={i}>
                      <a href={`/${locale}${r.href}`}>
                        <b>{pick(r.label, locale)}</b>
                        <span>{pick(r.note, locale)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aid">
                <div className="lbl">{pick(T.whoH, locale)}</div>
                <ul className="who">
                  {whoIsWho.map((w, i) => (
                    <li key={i} data-kind={w.kind}>
                      <b>{pick(w.name, locale)}</b>
                      <span>{pick(w.role, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="aid">
                <div className="lbl">{pick(T.glossaryH, locale)}</div>
                <dl className="glossary">
                  {glossary.map((g, i) => (
                    <div key={i}>
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
      <section className="readzone" id="fulltext" data-navsec>
        <div className="rail">
          <article className="read">
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
                <ol className="sources" start={start}>
                  {items.map((s, i) => {
                    const meta = [
                      s.authors,
                      s.publication,
                      s.date,
                      pick(TYPE_LABEL[s.type] ?? { uk: s.type, en: s.type }, locale),
                    ].filter(Boolean);
                    return (
                      <li key={i}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.title}
                        </a>
                        <span className="cite-meta">{meta.join(" · ")}</span>
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

      <Footer dict={dict} />
    </div>
  );
}

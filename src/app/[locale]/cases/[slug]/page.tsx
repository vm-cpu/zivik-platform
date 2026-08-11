import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import { icjCerdIcsft } from "@/content/summaries/icj-cerd-icsft";
import type { DecisionSummary, SummaryBlock, Theatre } from "@/content/summaries/types";
import uaMap from "@/content/summaries/ukraine-map.json";
import "../case.css";

/** Slug → decision summary. One entry today; grows as summaries are ingested. */
const SUMMARIES: Record<string, DecisionSummary> = {
  "icj-cerd-icsft": icjCerdIcsft,
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
} as const;

const TYPE_LABEL: Record<string, { uk: string; en: string }> = {
  "blog post": { uk: "допис у блозі", en: "blog post" },
  "journal article": { uk: "стаття в журналі", en: "journal article" },
  "news/insight": { uk: "аналітика", en: "news / insight" },
  "preprint/repository": { uk: "препринт / репозиторій", en: "preprint / repository" },
};

const MK = uaMap.markers as Record<string, [number, number]>;

/** The lit map of Ukraine with the case's treaty theatres highlighted. */
function TheatreMap({ theatres, locale }: { theatres: Theatre[]; locale: Locale }) {
  return (
    <div className="map-wrap">
      <svg className="map" viewBox={uaMap.viewBox} role="img" aria-label="Map of Ukraine">
        <path className="ua-fill" d={uaMap.path} />

        {/* Kyiv reference */}
        <circle className="mk-city" cx={MK.kyiv[0]} cy={MK.kyiv[1]} r={4.5} />
        <text className="mk-city-label" x={MK.kyiv[0] + 12} y={MK.kyiv[1] + 4}>
          {locale === "uk" ? "Київ" : "Kyiv"}
        </text>

        {theatres.map((t) => {
          const pts = t.markerKeys.map((k) => MK[k]).filter(Boolean);
          const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
          const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
          return (
            <g key={t.treaty}>
              {pts.map((p, i) => (
                <g key={i}>
                  <circle className="zone-halo" cx={p[0]} cy={p[1]} r={54} />
                  <circle className="zone" cx={p[0]} cy={p[1]} r={7} />
                </g>
              ))}
              <text className="mk-treaty" x={cx} y={cy - 66} textAnchor="middle">
                {t.treaty}
              </text>
              <text className="mk-label" x={cx} y={cy - 50} textAnchor="middle">
                {pick(t.place, locale)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="map-legend">
        {theatres.map((t) => (
          <span key={t.treaty}>
            <i />
            {pick(t.place, locale)} — <b>{t.treaty}</b>
          </span>
        ))}
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
      // Operative items open with Finds/Rejects (EN) or Встановлює/Відхиляє (UK);
      // the framing lines ("The Court," / "However…") stay plain paragraphs.
      return /^(Finds|Rejects|Встановлює|Відхиляє)/.test(block.text) ? (
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
  const { masthead, judgment, instruments, stats, timeline, verdicts, theatres, sources } = summary;
  const parties = masthead.parties.replace(/^\(|\)$/g, "");
  // Body in the reader's language; English is the source of truth.
  const rawBlocks = locale === "uk" && summary.blocksUk ? summary.blocksUk : summary.blocks;
  const isSourcesHeading = (b: SummaryBlock) =>
    b.kind === "h2" && /^\s*(Researches|Дослідження)/.test(b.text);
  const body = rawBlocks.filter((b) => b.kind !== "link" && !isSourcesHeading(b));
  const violations = verdicts.filter((v) => v.outcome === "violation").length;

  /** Official-text URL for a verdict track, when one exists. */
  const trackUrl = (track: string): string | undefined =>
    instruments.find((i) => i.abbr === track)?.url;
  const pagesLabel = pick(T.pagesPdf, locale).replace("{n}", String(judgment.pages));

  return (
    <div className="page casepage">
      <Header locale={locale} dict={dict} />

      {/* 1 — Masthead */}
      <header className="mast">
        <Link href={`/${locale}#registry`} className="backlink">
          ← {pick(T.back, locale)}
        </Link>
        <div className="eyebrow">
          <span>{pick({ uk: "Міжнародний суд ООН", en: "International Court of Justice" }, locale)}</span>
          <span>{pick({ uk: "Гаага", en: "The Hague" }, locale)}</span>
          <span>{masthead.judgment}</span>
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
            {pick(T.readJudgment, locale)}
            <em>{pick(judgment.court, locale)} · {pagesLabel}</em>
          </a>
          <a className="btn btn-ghost" href={judgment.caseUrl} target="_blank" rel="noopener noreferrer">
            {pick(T.caseFile, locale)}
          </a>
        </div>
      </header>

      {/* 2 — Dashboard */}
      <section className="dash">
        <div className="dash-inner">
          <div>
            <div className="lbl">{pick(T.overview, locale)}</div>
            <div className="kpis">
              {stats.map((s, i) => (
                <div key={i} className="kpi" data-em={s.label.en === "violations found" ? "1" : undefined}>
                  <b>{s.value}</b>
                  <span>{pick(s.label, locale)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-grid">
            <div className="panel">
              <div className="lbl">{pick(T.tracks, locale)}</div>
              <TheatreMap theatres={theatres} locale={locale} />
            </div>

            <div className="panel">
              <div className="score-head">
                <h3>{pick(T.found, locale)}</h3>
                <b>
                  {violations} {pick(T.violationsOf, locale)} {verdicts.length}
                </b>
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
                          <span className="v-track">{v.track}</span>
                        ))}
                      <span className="v-claim">{pick(v.claim, locale)}</span>
                      <span className="v-out" data-o={v.outcome}>
                        {v.outcome === "violation"
                          ? pick(T.violation, locale)
                          : pick(T.noViolation, locale)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <div className="lbl">{pick(T.timeline, locale)}</div>
            <div className="timeline">
              {timeline.map((e, i) => (
                <div key={i} className="tl" data-kind={e.kind}>
                  <div className="tl-date">{pick(e.date, locale)}</div>
                  <p className="tl-label">{pick(e.label, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Verbatim summary */}
      <article className="read">
        {body.map((b, i) => (
          <Block key={i} block={b} />
        ))}

        {sources.length > 0 && (
          <>
            <h2>{pick(T.sources, locale)}</h2>
            <ol className="sources">
              {sources.map((s, i) => {
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
          </>
        )}
      </article>

      <Footer dict={dict} />
    </div>
  );
}

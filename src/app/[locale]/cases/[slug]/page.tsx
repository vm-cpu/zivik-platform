import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import ShareBar from "@/components/nasvitlo/ShareBar";
import SideToc from "@/components/nasvitlo/SideToc";
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
} as const;

const TYPE_LABEL: Record<string, { uk: string; en: string }> = {
  "blog post": { uk: "допис у блозі", en: "blog post" },
  "journal article": { uk: "стаття в журналі", en: "journal article" },
  "news/insight": { uk: "аналітика", en: "news / insight" },
  "preprint/repository": { uk: "препринт / репозиторій", en: "preprint / repository" },
};

const MK = uaMap.markers as Record<string, number[]>;

const mapContext = (uaMap as { context?: string[] }).context ?? [];

/** Europe-context map: the court in The Hague, Kyiv, and the two treaty theatres. */
function TheatreMap({ theatres, locale }: { theatres: Theatre[]; locale: Locale }) {
  const [vw0, vh0, vw, vh] = uaMap.viewBox.split(" ").map(Number);
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

          {/* the court's reach: The Hague → Kyiv */}
          <line
            className="reach"
            x1={MK.hague[0]}
            y1={MK.hague[1]}
            x2={MK.kyiv[0]}
            y2={MK.kyiv[1]}
          />

          {/* The Hague — the court */}
          <g>
            <circle className="mk-court" cx={MK.hague[0]} cy={MK.hague[1]} r={10} />
            <text className="mk-treaty" x={MK.hague[0] + 18} y={MK.hague[1] - 8}>
              {locale === "uk" ? "ГААГА" : "THE HAGUE"}
            </text>
            <text className="mk-city-label" x={MK.hague[0] + 18} y={MK.hague[1] + 18}>
              {pick({ uk: "Міжнародний суд ООН", en: "Int’l Court of Justice" }, locale)}
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
            const lx = Math.min(Math.max(cx, 130), 860);
            return (
              <g key={t.treaty}>
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle className="zone-halo" cx={p[0]} cy={p[1]} r={40} />
                    <circle className="zone" cx={p[0]} cy={p[1]} r={9} />
                  </g>
                ))}
                <text className="mk-treaty" x={lx} y={cy - 84} textAnchor="middle">
                  {t.treaty}
                </text>
                <text className="mk-label" x={lx} y={cy - 56} textAnchor="middle">
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
          {pick({ uk: "Гаага — суд", en: "The Hague — court" }, locale)}
        </span>
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
  const { interpretations, provisionalMeasures, plain, glossary, whoIsWho, faq, related } = summary;
  const parties = masthead.parties.replace(/^\(|\)$/g, "");
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
  const tocSections = [
    ...sections,
    ...(sources.length > 0
      ? [{ id: "sec-sources", text: pick(T.sources, locale) }]
      : []),
  ];

  /** Official-text URL for a verdict track, when one exists. */
  const trackUrl = (track: string): string | undefined =>
    instruments.find((i) => i.abbr === track)?.url;
  const pagesLabel = pick(T.pagesPdf, locale).replace("{n}", String(judgment.pages));

  return (
    <div className="page casepage">
      <Header locale={locale} dict={dict} />

      {/* 1 — Masthead */}
      <header className="mast rail">
        <Link href={`/${locale}#registry`} className="backlink">
          ← {pick(T.back, locale)}
        </Link>
        <div className="eyebrow">
          <span>{pick({ uk: "Міжнародний суд ООН", en: "International Court of Justice" }, locale)}</span>
          <span className="dot">·</span>
          <span>{pick({ uk: "Гаага", en: "The Hague" }, locale)}</span>
          <span className="dot">·</span>
          <span>{masthead.judgment}</span>
          <span className="dot">·</span>
          <span className="readtime">{readTime}</span>
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
      <section className="dash">
        <div className="rail dash-stack">
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

          <div>
            <div className="lbl">{pick(T.tracks, locale)}</div>
            <TheatreMap theatres={theatres} locale={locale} />
          </div>

          <div>
            <div className="score-head">
              <h2>{pick(T.found, locale)}</h2>
              <span className="score-count">
                <b>{violations}</b> {pick(T.violationsOf, locale)} {verdicts.length}
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

      {/* 2b — Reference: doctrine and the interim order, on paper */}
      <section className="refs">
        <div className="rail refs-grid">
          <div>
            <div className="lbl lbl-onpaper">{pick(T.keyRulings, locale)}</div>
            {interpretations.map((it, i) => (
              <div key={i} className="ruling">
                <b>{pick(it.term, locale)}</b>
                <p>{pick(it.ruling, locale)}</p>
              </div>
            ))}
          </div>

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
        </div>
      </section>

      {/* 3 — Verbatim summary, with the sticky side nav */}
      <section className="readzone">
        <div className="rail readzone-grid">
          <SideToc
            sections={tocSections}
            title={pick(T.onThisPage, locale)}
            readTime={readTime}
            progressLabel={pick(T.progress, locale)}
          />

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
        </div>
      </section>

      {/* 4 — Reader aids */}
      <section className="aids">
        <div className="rail aids-grid">
          <div className="aids-col">
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

          <div className="aids-col">
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
          </div>
        </div>
      </section>

      {/* 5 — Share, standing on its own */}
      <section className="sharezone">
        <div className="rail">
          <ShareBar
            locale={locale}
            title={parties}
            citation={`${masthead.official} (${parties}), ${judgment.court[locale]}, ${masthead.judgment}.`}
          />
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import { icjCerdIcsft } from "@/content/summaries/icj-cerd-icsft";
import type { DecisionSummary, SummaryBlock } from "@/content/summaries/types";
import "../case.css";

/** Slug → decision summary. One entry today; grows as summaries are ingested. */
const SUMMARIES: Record<string, DecisionSummary> = {
  "icj-cerd-icsft": icjCerdIcsft,
};

/** Render one findings-table cell: verbatim text, sub-headings pulled out. */
function Findings({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="findings">
      {lines.map((line, i) => {
        const isSub = /^(ICSFT|CERD)\s*[-–]/.test(line);
        if (isSub) {
          return (
            <p key={i} className="sub">
              {line}
            </p>
          );
        }
        const m = line.match(/^(The Court['’]s position:)(.*)$/);
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

/** Render the verbatim block stream in reading order. */
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
      return null; // sources are collected and rendered together at the end
    case "dispositif": {
      // Operative items begin "Finds"/"Rejects"; the framing lines don't.
      const operative = /^(Finds|Rejects)\b/.test(block.text);
      return operative ? (
        <p className="disp">{block.text}</p>
      ) : (
        <p>{block.text}</p>
      );
    }
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
  const { masthead, glance, timeline, verdicts, theatres, blocks } = summary;
  const parties = masthead.parties.replace(/^\(|\)$/g, "");
  const sources = blocks.filter((b) => b.kind === "link");
  const sourcesHeading =
    blocks.find((b) => b.kind === "h2" && /^Researches/.test(b.text))?.text ??
    "Researches and other materials";
  // Reading stream: everything except the sources (rendered on their own below).
  const body = blocks.filter(
    (b) => b.kind !== "link" && !(b.kind === "h2" && /^Researches/.test(b.text)),
  );

  return (
    <div className="page casepage">
      <Header locale={locale} dict={dict} />

      {/* 1 — Masthead */}
      <header className="mast">
        <Link href={`/${locale}#registry`} className="backlink">
          ← {dict.nav.decisions}
        </Link>
        <div className="eyebrow">
          <span>International Court of Justice</span>
          <span>The Hague</span>
          <span>{masthead.judgment}</span>
        </div>
        <h1 className="official">{parties}</h1>
        <p className="parties">ICSFT (1999) · CERD (1965)</p>
        <p className="fullname">{masthead.official}</p>

        <dl className="glance">
          {glance.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* 2 — Instruments */}
      <section className="band">
        <div className="band-inner">
          <div>
            <div className="instr-head">
              <b>Timeline</b>
              <span />
            </div>
            <div className="timeline">
              {timeline.map((e) => (
                <div key={e.date} className="tl" data-kind={e.kind}>
                  <div className="tl-date">{e.date}</div>
                  <p className="tl-label">{e.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="two">
            <div>
              <div className="instr-head">
                <b>Two tracks</b>
                <span />
              </div>
              {theatres.map((t) => (
                <div key={t.place} className="theatre">
                  <h4>
                    {t.place}
                    <span className="tag">{t.treaty}</span>
                  </h4>
                  <p>{t.summary}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="instr-head">
                <b>What the Court found</b>
                <span />
              </div>
              <ul className="verdicts">
                {verdicts.map((v, i) => (
                  <li key={i}>
                    <span className="v-track">{v.track}</span>
                    <span className="v-claim">{v.claim}</span>
                    <span className="v-out" data-o={v.outcome}>
                      {v.outcome === "violation" ? "Violation" : "No violation"}
                    </span>
                  </li>
                ))}
              </ul>
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
            <h2>{sourcesHeading}</h2>
            <div className="sources">
              {sources.map((s, i) => (
                <a key={i} href={s.text} target="_blank" rel="noopener noreferrer">
                  {s.text}
                </a>
              ))}
            </div>
          </>
        )}
      </article>

      <Footer dict={dict} />
    </div>
  );
}

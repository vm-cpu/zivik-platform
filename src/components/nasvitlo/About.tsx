import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type AboutContent } from "@/content/types";

/**
 * "About the Library" — main text plus a marginalia side-rail (law-journal
 * layout), so the section carries content instead of empty space.
 */
export default function About({
  locale,
  dict,
  about,
  totalCases,
  institutionCount,
}: {
  locale: Locale;
  dict: Dictionary;
  about: AboutContent;
  totalCases: number;
  institutionCount: number;
}) {
  const paragraphs = pick(about.paragraphs, locale);
  const rail = dict.aboutRail;

  const facts: Array<{ k: string; v: string; num?: boolean }> = [
    { k: rail.scope, v: rail.scopeVal },
    { k: rail.proceedings, v: String(totalCases), num: true },
    { k: rail.institutions, v: String(institutionCount), num: true },
    { k: rail.audience, v: rail.audienceVal },
  ];

  return (
    <div
      id="about"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "50px 28px",
        background: "var(--surface)",
        borderTop: "1px solid var(--rule)",
        scrollMarginTop: 16,
      }}
    >
      <div className="lbl">
        <span>{pick(about.title, locale)}</span>
      </div>
      <div className="nsv-about-grid">
        <div className="nsv-about-main">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontFamily: i === 0 ? "'Charis SIL',serif" : undefined,
                fontSize: i === 0 ? 18 : 14.5,
                lineHeight: i === 0 ? 1.6 : 1.75,
                color: i === 0 ? "var(--ink)" : "var(--ink2)",
              }}
            >
              {text}
            </p>
          ))}
        </div>
        <aside className="nsv-rail">
          <div className="rk">{rail.title}</div>
          {facts.map((f) => (
            <div className="ri" key={f.k}>
              <span className="rl">{f.k}</span>
              <span className={f.num ? "rv num" : "rv"}>{f.v}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type AboutContent } from "@/content/types";

/**
 * "About the Library" — main text plus a marginalia side-rail (law-journal
 * layout), so the section carries content instead of empty space.
 */
export default function About({
  locale,
  about,
}: {
  locale: Locale;
  dict: Dictionary;
  about: AboutContent;
  totalCases: number;
  institutionCount: number;
}) {
  const paragraphs = pick(about.paragraphs, locale);

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
      <div className="nsv-about-main">
        {paragraphs.map((text, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              /* All prose, so one face and one size. The opening paragraph
                 used to lead at 18px in the display serif with the rest at
                 14.5 — a step and a half of difference reads as an accident
                 rather than a hierarchy. It leads by colour instead. */
              fontSize: 16,
              lineHeight: 1.65,
              color: i === 0 ? "var(--ink)" : "var(--ink2)",
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

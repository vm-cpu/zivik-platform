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
        {/* All prose of one rank, so one face, one size and one colour —
            set together on `.nsv-about-main p` in home.css. The opening
            paragraph used to lead at 18px in the display serif, then by
            colour (--ink, 17.57:1, against --ink2's 7.78:1 for the rest);
            both read as an accident rather than a hierarchy in a section
            whose text is all the same rank. Emphasis is the eyebrow's and
            the button's job. */}
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </div>
  );
}

import { type Locale } from "@/i18n/config";
import { pick, type AboutContent } from "@/content/types";

/** "About the Library" — the project's mission text (bilingual). */
export default function About({
  locale,
  about,
}: {
  locale: Locale;
  about: AboutContent;
}) {
  const paragraphs = pick(about.paragraphs, locale);

  return (
    <div
      id="about"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "46px 28px",
        background: "var(--surface)",
        borderTop: "1px solid var(--rule)",
        scrollMarginTop: 16,
      }}
    >
      <div className="lbl">
        <span>{pick(about.title, locale)}</span>
      </div>
      <div
        style={{
          maxWidth: 760,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {paragraphs.map((text, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              fontFamily: i === 0 ? "'Charis SIL',serif" : undefined,
              fontSize: i === 0 ? 17 : 14.5,
              lineHeight: i === 0 ? 1.65 : 1.75,
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

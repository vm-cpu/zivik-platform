import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Intro sentence + the headline figures. */
export default function Intro({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        padding: "40px 28px 34px",
        background: "var(--paper)",
        borderTop: "3px solid var(--brand-gold-mark)",
      }}
    >
      <div
        className="nsv-intro"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 40,
          marginBottom: 28,
        }}
      >
        <p
          style={{
            fontFamily: "var(--brand-font-body),sans-serif",
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--ink)",
            margin: 0,
            /* 560px measured a two-line sentence. The scope statement that
               replaced it is 310 characters — at 560 it stacked to six lines
               at 52 per line, a column too narrow for 19px type. */
            maxWidth: 780,
          }}
        >
          {dict.intro.text}
        </p>
        <a className="btn btn-o" href={`/${locale}/about`} style={{ flex: "none" }}>
          {dict.intro.about}
        </a>
      </div>


    </div>
  );
}

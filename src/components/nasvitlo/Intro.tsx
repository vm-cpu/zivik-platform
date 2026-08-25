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
            fontFamily: "var(--brand-font-display),serif",
            fontSize: 19,
            lineHeight: 1.5,
            color: "var(--ink)",
            margin: 0,
            maxWidth: 560,
          }}
        >
          {dict.intro.text}
        </p>
        <a className="btn btn-o" href={`/${locale}#about`} style={{ flex: "none" }}>
          {dict.intro.about}
        </a>
      </div>


    </div>
  );
}

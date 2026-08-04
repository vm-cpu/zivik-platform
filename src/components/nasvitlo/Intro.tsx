import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type Stat } from "@/content/types";

/** Intro sentence + the four headline figures. */
export default function Intro({
  locale,
  dict,
  stats,
}: {
  locale: Locale;
  dict: Dictionary;
  stats: Stat[];
}) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        padding: "40px 28px 34px",
        background: "var(--paper)",
        borderTop: "3px solid #C79A3C",
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
            fontFamily: "'Charis SIL',serif",
            fontSize: 19,
            lineHeight: 1.5,
            color: "var(--ink)",
            margin: 0,
            maxWidth: 560,
          }}
        >
          {dict.intro.text}
        </p>
        <a className="btn btn-o" href="#" style={{ flex: "none" }}>
          {dict.intro.about}
        </a>
      </div>

      <div
        className="nsv-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 1,
          background: "var(--rule)",
          border: "1px solid var(--rule)",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.value + pick(stat.label, locale)}
            style={{ background: "var(--surface)", padding: "22px 24px" }}
          >
            <div
              style={{
                fontFamily: "'Charis SIL',serif",
                fontSize: 38,
                lineHeight: 1,
                color: stat.gilt ? "var(--gold)" : "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                font: "600 10px 'Fira Sans'",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--faint)",
                marginTop: 6,
              }}
            >
              {pick(stat.label, locale)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

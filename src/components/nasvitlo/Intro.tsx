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
        <a className="btn btn-o" href="#" style={{ flex: "none" }}>
          {dict.intro.about}
        </a>
      </div>

      {/* Editorial figure line — hairline-separated numerals, not a KPI grid. */}
      <div className="nsv-statline">
        {stats.map((stat) => (
          <div key={stat.value + pick(stat.label, locale)} className="stat">
            <span className="num">{stat.value}</span>
            <span className="cap">{pick(stat.label, locale)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

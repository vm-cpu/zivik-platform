import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SinceCounter from "./SinceCounter";
import { pick, type Stat } from "@/content/types";

/** Intro sentence + the headline figures. */
/**
 * Whole years and months since a date, computed on the server so the tile is
 * never blank and a reader without JavaScript still sees a figure.
 * <SinceCounter> recomputes it in the browser: this value is baked in at build
 * time and the archive can go weeks between deploys.
 */
function elapsed(since: string): { years: number; months: number } {
  const start = new Date(since);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12 };
}

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
        <a className="btn btn-o" href={`/${locale}#about`} style={{ flex: "none" }}>
          {dict.intro.about}
        </a>
      </div>

      {/* Editorial figure line — hairline-separated numerals, not a KPI grid. */}
      <div className="nsv-statline">
        {stats.map((stat) => (
          <div key={(stat.value ?? stat.since) + pick(stat.label, locale)} className="stat">
            <span className="num">
              {stat.since ? (
                <SinceCounter
                  since={stat.since}
                  initialYears={elapsed(stat.since).years}
                  initialMonths={elapsed(stat.since).months}
                  unitYears={locale === "uk" ? "р." : "yr"}
                  unitMonths={locale === "uk" ? "міс." : "mo"}
                />
              ) : (
                stat.value
              )}
            </span>
            <span className="cap">{pick(stat.label, locale)}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SinceCounter from "./SinceCounter";
import { pick, type Stat } from "@/content/types";
import type { Institution } from "@/content/types";

/** Intro sentence + the headline figures. */
/**
 * Years and months since a date, computed on the server so the tile is never
 * blank and a reader without JavaScript still sees a figure. <SinceCounter>
 * recomputes it in the browser, because this value is baked in at build time
 * and this archive can go weeks between deploys.
 */
function elapsed(since: string, locale: Locale): string {
  const start = new Date(since);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = locale === "uk" ? "р." : "yr";
  const m = locale === "uk" ? "міс." : "mo";
  return rest === 0 ? `${years} ${y}` : `${years} ${y} ${rest} ${m}`;
}

export default function Intro({
  locale,
  dict,
  stats,
  institutions,
}: {
  locale: Locale;
  dict: Dictionary;
  stats: Stat[];
  institutions: Institution[];
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
                  initial={elapsed(stat.since, locale)}
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

      {/*
        The forums, as a list. This was a 240-character sentence inside the
        hero, centred and set at 14px — the most detailed text on the page in
        the smallest type, with no left edge to scan down. It reads from the
        same institutions the registry does, so it cannot drift out of date.
      */}
      <div className="nsv-forums">
        <div className="nsv-forums-head">
          <span className="nsv-forums-label">{dict.forums.label}</span>
          <p>{dict.forums.note}</p>
        </div>
        <ul>
          {institutions.map((i) => (
            <li key={i.id}>
              <span className="fx-abbr">{pick(i.abbr, locale)}</span>
              <span className="fx-name">{pick(i.name, locale)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

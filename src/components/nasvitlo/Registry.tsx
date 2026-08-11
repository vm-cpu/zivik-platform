import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  pick,
  type CaseStatusKey,
  type Institution,
  type RegistryCase,
} from "@/content/types";

const CHIP_CLASS: Record<CaseStatusKey, string> = {
  decided: "st-decided",
  progress: "st-progress",
  warrant: "st-warrant",
  settled: "st-enforce",
  enforcement: "st-enforce",
  frozen: "st-enforce",
  rejected: "st-progress",
};

/** Statuses that read as "still moving" get an arrow after the year. */
const ONGOING: ReadonlySet<CaseStatusKey> = new Set(["progress", "warrant"]);

function fmt(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (out, [key, value]) => out.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/** Registry of Phase-1 courts and their cases, as a lit/queued accordion. */
export default function Registry({
  locale,
  dict,
  institutions,
  casesByInstitution,
  totalCases,
  analysedCases,
}: {
  locale: Locale;
  dict: Dictionary;
  institutions: Institution[];
  casesByInstitution: Map<string, RegistryCase[]>;
  totalCases: number;
  analysedCases: number;
}) {
  const pct = totalCases ? Math.round((analysedCases / totalCases) * 100) : 0;

  const caseDate = (c: RegistryCase) => {
    if (c.year == null) return "—";
    return ONGOING.has(c.statusKey) ? `${c.year} →` : String(c.year);
  };

  return (
    <>
      <div
        id="registry"
        style={{
          position: "relative",
          zIndex: 3,
          padding: "34px 28px 22px",
          background: "var(--paper)",
          borderTop: "1px solid var(--rule)",
          scrollMarginTop: 16,
        }}
      >
        <div className="lbl">
          <span>{dict.registry.label}</span>
        </div>
        <div
          className="nsv-sechead"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 31, marginBottom: 9 }}>
              {dict.registry.heading}
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--ink2)",
                margin: 0,
              }}
            >
              {dict.registry.description}
            </p>
          </div>
          <a className="btn btn-o" href="#" style={{ flex: "none" }}>
            {fmt(dict.registry.fullRegistry, { count: totalCases })}
          </a>
        </div>
      </div>

      <div
        className="regprog"
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "15px 28px",
          background: "var(--paper2)",
          borderTop: "1px solid var(--rule)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ font: "600 12.5px var(--brand-font-body)", color: "var(--ink)" }}>
            {dict.registry.processed}{" "}
            <b
              style={{
                fontFamily: "var(--brand-font-display),serif",
                fontSize: 17,
                fontWeight: 400,
              }}
            >
              {analysedCases}
            </b>{" "}
            {dict.registry.of} {totalCases}
          </span>
          <span
            style={{
              position: "relative",
              display: "block",
              width: 190,
              height: 5,
              borderRadius: 3,
              background: "var(--rule)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${pct}%`,
                background: "linear-gradient(90deg,#C79A3C,#E3BC6A)",
                boxShadow: "0 0 9px rgba(199,154,60,.6)",
              }}
            />
          </span>
          <span style={{ fontSize: 12, color: "var(--faint)" }}>
            {dict.registry.queuedRest}
          </span>
        </div>
        <label className="swonly">
          <input type="checkbox" />
          {fmt(dict.registry.onlyAnalysed, { count: analysedCases })}
        </label>
      </div>

      <div className="acc" style={{ position: "relative", zIndex: 3 }}>
        {institutions.map((inst, index) => {
          const cases = casesByInstitution.get(inst.id) ?? [];
          const analysed = cases.filter((c) => c.lit).length;
          const seat = inst.seat ? pick(inst.seat, locale) : null;
          return (
            <details
              key={inst.id}
              open={index === 0}
              data-lit={analysed > 0 ? "1" : undefined}
            >
              <summary>
                <span className="ab">{pick(inst.abbr, locale)}</span>
                <span className="fn">
                  {pick(inst.name, locale)}
                  {seat ? <i> · {seat}</i> : null}
                </span>
                <span className="cn">{cases.length}</span>
                <span className="prog">
                  {cases.map((_, i) => (
                    <i key={i} className={i < analysed ? "on" : undefined} />
                  ))}
                </span>
                <span className="cv" />
              </summary>
              <div className="body">
                {cases.map((c) => (
                  <a
                    key={c.id}
                    className={`arow ${c.lit ? "lit" : "dim"}`}
                    href={c.decisionUrl ?? undefined}
                    target={c.decisionUrl ? "_blank" : undefined}
                    rel={c.decisionUrl ? "noopener noreferrer" : undefined}
                  >
                    <span className="mk" />
                    <span>
                      <span className="at">{c.name}</span>
                      <span className="an">{pick(c.note, locale)}</span>
                    </span>
                    <span className={`chip ${CHIP_CLASS[c.statusKey]}`}>
                      {dict.registry.status[c.statusKey]}
                    </span>
                    <span className="ad">{caseDate(c)}</span>
                  </a>
                ))}
                <a className="more">
                  {fmt(dict.registry.allCases, {
                    count: cases.length,
                    court: pick(inst.abbr, locale),
                  })}
                </a>
              </div>
            </details>
          );
        })}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "16px 28px 34px",
          background: "var(--paper)",
        }}
      >
        <div className="legend">
          <span>
            <i
              style={{
                background: "#C79A3C",
                boxShadow: "0 0 7px rgba(199,154,60,.8)",
              }}
            />
            {dict.registry.legendLit}
          </span>
          <span>
            <i
              style={{
                background: "transparent",
                border: "1.5px solid var(--faint)",
              }}
            />
            {dict.registry.legendQueued}
          </span>
        </div>
      </div>
    </>
  );
}

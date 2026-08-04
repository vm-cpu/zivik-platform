import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  pick,
  type CaseStatus,
  type Court,
  type RegistryCase,
} from "@/content/types";

const CHIP_CLASS: Record<Exclude<CaseStatus, "queued">, string> = {
  decided: "st-decided",
  progress: "st-progress",
  warrant: "st-warrant",
};

function fmt(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (out, [key, value]) => out.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/** Registry of courts and their cases, as a lit/queued accordion. */
export default function Registry({
  locale,
  dict,
  courts,
  casesByCourt,
}: {
  locale: Locale;
  dict: Dictionary;
  courts: Court[];
  casesByCourt: Map<string, RegistryCase[]>;
}) {
  const total = courts.reduce((sum, c) => sum + c.total, 0);
  const analysed = courts.reduce((sum, c) => sum + c.analysed, 0);
  const pct = total ? Math.round((analysed / total) * 100) : 0;

  const statusLabel: Record<Exclude<CaseStatus, "queued">, string> = {
    decided: dict.registry.statusDecided,
    progress: dict.registry.statusProgress,
    warrant: dict.registry.statusWarrant,
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
            {fmt(dict.registry.fullRegistry, { count: total })}
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
          <span
            style={{ font: "600 12.5px 'Fira Sans'", color: "var(--ink)" }}
          >
            {dict.registry.processed}{" "}
            <b
              style={{
                fontFamily: "'Charis SIL',serif",
                fontSize: 17,
                fontWeight: 400,
              }}
            >
              {analysed}
            </b>{" "}
            {dict.registry.of} {total}
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
          {fmt(dict.registry.onlyAnalysed, { count: analysed })}
        </label>
      </div>

      <div className="acc" style={{ position: "relative", zIndex: 3 }}>
        {courts.map((court, index) => {
          const cases = casesByCourt.get(court.id) ?? [];
          const dots = Array.from({ length: court.total });
          return (
            <details
              key={court.id}
              open={index === 0}
              data-lit={court.analysed > 0 ? "1" : undefined}
            >
              <summary>
                <span className="ab">{pick(court.abbr, locale)}</span>
                <span className="fn">
                  {pick(court.name, locale)}{" "}
                  <i>· {pick(court.seat, locale)}</i>
                </span>
                <span className="cn">{court.total}</span>
                <span className="prog">
                  {dots.map((_, i) => (
                    <i key={i} className={i < court.analysed ? "on" : undefined} />
                  ))}
                </span>
                <span className="cv" />
              </summary>
              <div className="body">
                {cases.map((c) => (
                  <a key={c.id} className={`arow ${c.lit ? "lit" : "dim"}`}>
                    <span className="mk" />
                    <span>
                      <span className="at">{pick(c.title, locale)}</span>
                      <span className="an">{pick(c.note, locale)}</span>
                    </span>
                    {c.status === "queued" ? (
                      <span className="queued">
                        {dict.registry.statusQueued}
                      </span>
                    ) : (
                      <span className={`chip ${CHIP_CLASS[c.status]}`}>
                        {statusLabel[c.status]}
                      </span>
                    )}
                    <span className="ad">{c.date}</span>
                  </a>
                ))}
                <a className="more">
                  {fmt(dict.registry.allCases, {
                    count: court.total,
                    court: pick(court.abbr, locale),
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

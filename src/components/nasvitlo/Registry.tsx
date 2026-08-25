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

/**
 * Ukrainian agreement: 1 справа, 2–4 справи, 5+ справ, with the teens taking
 * the "many" form and 21 taking "one". English keeps a singular and a plural
 * and reads the same three keys.
 */
function plural(n: number, forms: { one: string; few: string; many: string }) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms.many;
  const mod10 = n % 10;
  if (mod10 === 1) return forms.one;
  if (mod10 >= 2 && mod10 <= 4) return forms.few;
  return forms.many;
}

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
          <a
            className="btn btn-o"
            href={`/${locale}/registry`}
            style={{ flex: "none" }}
          >
            {fmt(dict.registry.fullRegistry, { count: totalCases })}
          </a>
        </div>
      </div>

        {/* The "8 of 39 processed" strip and its progress bar are gone: the
           brief takes the counts off this page, and a half-full bar over a
           registry reads as an apology for it. */}

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
                {cases.map((c) => {
                  // Only ever navigate to our own decision pages — never to
                  // external PDFs. Cases without a published summary are inert.
                  const href = c.summarySlug
                    ? `/${locale}/cases/${c.summarySlug}`
                    : undefined;
                  return (
                  <a
                    key={c.id}
                    className={`arow ${c.lit ? "lit" : "dim"}${href ? "" : " inert"}`}
                    href={href}
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
                  );
                })}
                {/* This had no href, so it was not clickable and not
                    focusable — it only looked like a link. */}
                <a className="more" href={`/${locale}/registry?court=${inst.id}`}>
                  {fmt(dict.registry.allCases, {
                    count: cases.length,
                    cases: plural(cases.length, dict.registry.caseWord),
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
                background: "var(--brand-gold-mark)",
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

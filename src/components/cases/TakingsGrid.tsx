import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Metric } from "@/content/summaries/types";

/**
 * The size of the loss, in three registers.
 *
 * A countable metric becomes one mark per unit — 294 outlets read as a field,
 * not as a number. A share becomes a bar against the whole market. Everything
 * else stays a figure with its caption. Server-rendered: nothing here needs to
 * react to the reader.
 */
export default function TakingsGrid({
  metrics,
  locale,
}: {
  metrics: Metric[];
  locale: Locale;
}) {
  return (
    <div className="takings">
      {metrics.map((m, i) => (
        <div key={i} className="taking" data-shape={m.count ? "grid" : m.percent ? "bar" : "plain"}>
          <div className="taking-head">
            <span className="taking-label">{pick(m.label, locale)}</span>
            <b className="taking-value">
              {typeof m.value === "string" ? m.value : pick(m.value, locale)}
            </b>
          </div>

          {m.count && (
            <div className="dotfield" aria-hidden="true">
              {Array.from({ length: Math.min(m.count, 400) }, (_, d) => (
                <i key={d} />
              ))}
            </div>
          )}

          {m.percent !== undefined && (
            <div className="taking-bar">
              <i style={{ width: `${m.percent}%` }} />
            </div>
          )}

          {m.note && <p className="taking-note">{pick(m.note, locale)}</p>}
        </div>
      ))}
    </div>
  );
}

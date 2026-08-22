"use client";

import { useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { MoneyFigure } from "@/content/summaries/types";

/**
 * The money in the award, drawn to one shared scale.
 *
 * Every bar is measured against the largest figure on the page, so the reader
 * sees the relationship the numbers alone hide: what was recovered so far is a
 * sliver of what was ordered. Composite figures split into their heads of loss;
 * clicking a segment names it and gives its share. An `estimated` figure is
 * hatched rather than solid, because "more than" is not a measurement.
 */
export default function MoneyBars({
  figures,
  locale,
  shareLabel,
}: {
  figures: MoneyFigure[];
  locale: Locale;
  shareLabel: string;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const scale = Math.max(...figures.map((f) => f.amount));

  return (
    <div className="money">
      {figures.map((f, i) => {
        const width = (f.amount / scale) * 100;
        return (
          <div key={i} className="money-row">
            <div className="money-head">
              <span className="money-label">{pick(f.label, locale)}</span>
              <b className="money-value">{typeof f.display === "string" ? f.display : pick(f.display, locale)}</b>
            </div>

            <div
              className="money-bar"
              data-estimated={f.estimated ? "yes" : "no"}
              style={{ width: `${Math.max(width, 1.2)}%` }}
            >
              {f.parts?.map((p, j) => {
                const key = `${i}-${j}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className="money-seg"
                    data-seg={j}
                    data-on={picked === key ? "yes" : "no"}
                    style={{ flexGrow: p.amount }}
                    aria-label={`${pick(p.label, locale)} — ${p.display}`}
                    onClick={() => setPicked(picked === key ? null : key)}
                  />
                );
              })}
            </div>

            {f.parts && (
              <ul className="money-key">
                {f.parts.map((p, j) => {
                  const key = `${i}-${j}`;
                  const share = Math.round((p.amount / f.amount) * 100);
                  return (
                    <li key={key} data-on={picked === key ? "yes" : "no"}>
                      <button type="button" onClick={() => setPicked(picked === key ? null : key)}>
                        <i data-seg={j} />
                        {pick(p.label, locale)} — <b>{typeof p.display === "string" ? p.display : pick(p.display, locale)}</b>
                        {picked === key && (
                          <em>
                            {" "}
                            · {share}% {shareLabel}
                          </em>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {f.note && <p className="money-note">{pick(f.note, locale)}</p>}
          </div>
        );
      })}
    </div>
  );
}

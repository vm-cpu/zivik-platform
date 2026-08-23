"use client";

import { useState } from "react";

/**
 * The money in the award, drawn to one shared scale. Props arrive
 * locale-resolved (see CaseTimeline for why).
 */
export interface MoneyFigureR {
  label: string;
  display: string;
  amount: number;
  parts?: { label: string; display: string; amount: number }[];
  estimated?: boolean;
  note?: string;
}

export default function MoneyBars({
  figures,
  shareLabel,
}: {
  figures: MoneyFigureR[];
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
              <span className="money-label">{f.label}</span>
              <b className="money-value">{f.display}</b>
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
                    aria-label={`${p.label} — ${p.display}`}
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
                        {p.label} — <b>{p.display}</b>
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

            {f.note && <p className="money-note">{f.note}</p>}
          </div>
        );
      })}
    </div>
  );
}

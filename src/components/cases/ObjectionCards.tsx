"use client";

import { useState } from "react";

/**
 * Jurisdiction objections, argument beside ruling.
 *
 * Each card starts on the objection — the case as the respondent put it — and
 * turns to the ruling on tap. Keeping the two on one surface is the point: a
 * reader who only ever sees the outcome cannot tell how close the argument
 * was. Props arrive locale-resolved (see CaseTimeline for why).
 */
export interface ObjectionR {
  ground: string;
  latin?: string;
  objection: string;
  outcome: "rejected" | "upheld";
  reasoning: string;
  votes?: { for: number; against: number; scope?: string }[];
}

export default function ObjectionCards({
  items,
  labels,
  benchSize = 0,
}: {
  items: ObjectionR[];
  labels: { objection: string; rejected: string; upheld: string; ruling: string };
  /** Judges sitting. With a bench, a vote draws as seats won of seats sitting. */
  benchSize?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ol className="objections">
      {items.map((o, i) => {
        const isOpen = open === i;
        return (
          <li key={i} data-outcome={o.outcome} data-on={isOpen ? "yes" : "no"}>
            <button
              type="button"
              className="obj-card"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="obj-head">
                <span className="obj-n">{i + 1}</span>
                <span className="obj-ground">{o.ground}</span>
                {o.latin && <em className="obj-latin">{o.latin}</em>}
              </span>

              <span className="obj-body">
                <span className="obj-lbl">{labels.objection}</span>
                {o.objection}
              </span>

              <span className="obj-verdict">
                {o.outcome === "rejected" ? labels.rejected : labels.upheld}
                <i aria-hidden="true" />
              </span>

              {benchSize > 0 && o.votes && o.votes.length > 0 && (
                <span className="obj-votes">
                  {o.votes.map((v, j) => (
                    <span key={j} className="obj-vote">
                      <span
                        className="obj-bench"
                        style={{ width: `${benchSize * 8 - 2}px` }}
                        aria-hidden="true"
                      >
                        <i style={{ width: `${v.for * 8 - 2}px` }} />
                      </span>
                      <span className="obj-tally">
                        {v.for}–{v.against}
                        {v.scope && <em> {v.scope}</em>}
                      </span>
                    </span>
                  ))}
                </span>
              )}

              {isOpen && (
                <span className="obj-reason">
                  <span className="obj-lbl">{labels.ruling}</span>
                  {o.reasoning}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

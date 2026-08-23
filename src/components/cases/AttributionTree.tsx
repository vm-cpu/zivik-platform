"use client";

import { useState } from "react";

/**
 * Whose conduct counts as the State's. Props arrive locale-resolved
 * (see CaseTimeline for why).
 */
export interface AttributionNodeR {
  actor: string;
  basis: string;
  basisNote: string;
  did: string;
}

export default function AttributionTree({
  respondent,
  nodes,
}: {
  respondent: string;
  nodes: AttributionNodeR[];
}) {
  const [open, setOpen] = useState(0);

  return (
    <div className="attr">
      <div className="attr-root">{respondent}</div>
      <div className="attr-stem" aria-hidden="true" />

      <ul className="attr-branches">
        {nodes.map((n, i) => (
          <li key={i} data-on={open === i ? "yes" : "no"}>
            <button
              type="button"
              className="attr-node"
              aria-expanded={open === i}
              onClick={() => setOpen(i)}
            >
              <span className="attr-basis">
                {n.basis} · {n.basisNote}
              </span>
              <span className="attr-actor">{n.actor}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="attr-did">{nodes[open].did}</p>
    </div>
  );
}

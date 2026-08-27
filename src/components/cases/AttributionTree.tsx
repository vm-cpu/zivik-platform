"use client";

import { useState } from "react";

/**
 * Whose conduct counts as the State's.
 *
 * Props arrive locale-resolved (see CaseTimeline for why).
 *
 * One branch is always open, unlike the warrant ladder next door where nothing
 * is selected until a reader asks. The difference is what the closed state
 * would say: an unselected ladder is a list of names, which is still an answer,
 * while this block closed is a root, some branches and a blank — the sentence
 * under it is the whole point of the drawing, so the drawing opens on one.
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

  /* An empty list would have gone straight through `nodes[open].did` below and
     taken the whole page down with it. Nothing renders it empty today; nothing
     stopped it either. */
  if (nodes.length === 0) return null;
  const shown = nodes[Math.min(open, nodes.length - 1)];

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
              aria-controls="attr-did"
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

      {/* Named and pointed at, so the branch buttons announce that they change
          this paragraph rather than leading somewhere. aria-live because the
          text under a reader's selection is replaced in place. */}
      <p className="attr-did" id="attr-did" aria-live="polite">
        {shown.did}
      </p>
    </div>
  );
}

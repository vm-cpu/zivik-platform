"use client";

import { useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { AttributionNode } from "@/content/summaries/types";

/**
 * Whose conduct counts as the State's.
 *
 * Attribution is the hinge of this award: five different bodies acted, and the
 * tribunal had to tie each one back to Russia before any of it could be a
 * treaty breach. The tree draws that single question — one respondent, five
 * branches, each labelled with the rule it hangs on. Selecting a branch shows
 * what that body actually did.
 */
export default function AttributionTree({
  respondent,
  nodes,
  locale,
}: {
  respondent: string;
  nodes: AttributionNode[];
  locale: Locale;
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
                {n.basis} · {pick(n.basisNote, locale)}
              </span>
              <span className="attr-actor">{pick(n.actor, locale)}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="attr-did">{pick(nodes[open].did, locale)}</p>
    </div>
  );
}

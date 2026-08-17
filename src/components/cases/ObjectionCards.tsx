"use client";

import { useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Objection } from "@/content/summaries/types";

/**
 * Jurisdiction objections, argument beside ruling.
 *
 * Each card starts on the objection — the case as the respondent put it — and
 * turns to the ruling on tap. Keeping the two on one surface is the point: a
 * reader who only ever sees the outcome cannot tell how close the argument was.
 */
export default function ObjectionCards({
  items,
  locale,
  labels,
}: {
  items: Objection[];
  locale: Locale;
  labels: { objection: string; rejected: string; upheld: string; ruling: string };
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
                <span className="obj-ground">{pick(o.ground, locale)}</span>
                {o.latin && <em className="obj-latin">{o.latin}</em>}
              </span>

              <span className="obj-body">
                <span className="obj-lbl">{labels.objection}</span>
                {pick(o.objection, locale)}
              </span>

              <span className="obj-verdict">
                {o.outcome === "rejected" ? labels.rejected : labels.upheld}
                <i aria-hidden="true" />
              </span>

              {isOpen && (
                <span className="obj-reason">
                  <span className="obj-lbl">{labels.ruling}</span>
                  {pick(o.reasoning, locale)}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

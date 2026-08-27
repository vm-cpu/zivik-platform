"use client";

import { useEffect, useRef, useState } from "react";
import type { Outcome } from "@/content/summaries/types";

/** One line of the dispositif, already resolved to the reader's language. */
export interface VerdictRow {
  /** Article, treaty, stage or defendant the claim was brought under. */
  track: string;
  /** Official text of the instrument, where the track names one. */
  href?: string;
  /**
   * A place on this page instead — the chronology entry for this track.
   *
   * Two of the eight decisions key their tracks to something the page already
   * holds: the ICC's tracks are the dates its warrants issued, and every one
   * of them is also an entry in the chronology below. Where that join exists
   * in the data it is offered; where it does not, nothing is invented.
   */
  inHref?: string;
  /** What the inward link is, for anyone who cannot see where it points. */
  inLabel?: string;
  /** First claim under this track — the only row that prints the track. */
  opensTrack: boolean;
  outcome: Outcome;
  outcomeLabel: string;
  claim: string;
}

/**
 * How each claim was disposed of.
 *
 * ── Why this is not the ledger it replaces ─────────────────────────────────
 * The block was a light-paper ledger with the track as a full-width heading
 * above each run of claims. That shape is built for a dispositif where one
 * article carries several claims, and eighteen of this archive's twenty-eight
 * tracks carry exactly one. On the ECtHR judgment every track does, so it
 * rendered a heading, a rule, one row and 150px of air, eight times over —
 * three screens to say that Ukraine won on all eight. The track is a cell of
 * the row now, printed on the row that opens a run and left empty under it, so
 * a one-claim track costs one line and a four-claim track still reads as one
 * group.
 *
 * ── The reveal ─────────────────────────────────────────────────────────────
 * The rows arrive in order, 45ms apart, the first time the block is scrolled
 * into view. A dispositif is read out item by item in court and this is the
 * same gesture; it is also the only way to see, before reading a word, that
 * the outcome column is eight of the same finding. It is not decoration and it
 * does not repeat: an atrocity docket that replays an animation every time it
 * scrolls past is performing.
 *
 * Three ways it can end up with everything visible, which is the only state
 * this component is allowed to fail into:
 *   - Reduced motion, or a browser with no IntersectionObserver — shown at
 *     once, with no transition.
 *   - The observer never speaks (a throttled tab, a restore into the
 *     background, a pipeline that is not running) — a two-second timer draws
 *     the rows anyway. Text that is silently never revealed is a far worse
 *     failure than no animation.
 *   - No scripting at all. `data-shown="no"` is in the prerendered HTML, so
 *     the stylesheet only hides a row inside `@media (scripting: enabled)`;
 *     with JS off, or in a browser that does not know the feature, the rows
 *     are simply visible. Doing it the other way round — visible in the HTML,
 *     hidden on mount — costs a flash of the whole block on every load.
 *
 * Both live paths go through one timer: setting state straight from the body
 * of an effect cascades a second render before paint, so the immediate case is
 * scheduled at zero delay and lands on the next tick. Same reason as
 * `TakingsGrid`.
 */
export default function VerdictMatrix({ rows }: { rows: VerdictRow[] }) {
  const list = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = list.current;
    if (!el) return;

    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined";

    let io: IntersectionObserver | null = null;
    const settle = window.setTimeout(
      () => {
        setShown(true);
        io?.disconnect();
      },
      still ? 0 : 2000,
    );

    if (!still) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setShown(true);
            io?.disconnect();
          }
        },
        /* A low threshold on purpose: the panel is taller than a phone
           viewport on the arbitrations, so a fraction that a short block
           reaches easily would never be met and the rows would wait for the
           failsafe. */
        { threshold: 0.05 },
      );
      io.observe(el);
    }

    return () => {
      window.clearTimeout(settle);
      io?.disconnect();
    };
  }, []);

  return (
    <ul className="verdicts" ref={list} data-shown={shown ? "yes" : "no"}>
      {rows.map((r, i) => (
        <li
          key={i}
          data-run={r.opensTrack ? "start" : "cont"}
          /* Capped so a nine-row dispositif still finishes inside a second.
             Past the cap the tail arrives together, which is what the reader
             wants by then anyway. */
          style={{ transitionDelay: `${Math.min(i * 45, 360)}ms` }}
        >
          {/* Three shapes, and the arrow is the tell. An outward link leaves
              for the instrument's official text and says so with ↗; an inward
              one moves the reader down this same page to the moment the track
              names, and an arrow that means "new tab" would be a lie on it. */}
          {r.opensTrack &&
            (r.href ? (
              <a
                className="v-track v-track-link"
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.track} ↗
              </a>
            ) : r.inHref ? (
              <a
                className="v-track v-track-link v-track-in"
                href={r.inHref}
                title={r.inLabel}
              >
                {r.track} ↓
              </a>
            ) : (
              <span className="v-track">{r.track}</span>
            ))}
          {/* Outcome before claim, and the claim starts where its own outcome
              ends. The two used to sit at opposite edges of a 1180px rail,
              which put most of a screen of nothing between a sentence and the
              word that answers it. The row reads as a sentence in this order
              either way: «Порушення — право на життя». */}
          <span className="v-out" data-o={r.outcome}>
            {r.outcomeLabel}
          </span>
          <span className="v-claim">{r.claim}</span>
        </li>
      ))}
    </ul>
  );
}

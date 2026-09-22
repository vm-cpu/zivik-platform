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
export default function VerdictMatrix({
  rows,
  fold,
}: {
  rows: VerdictRow[];
  /**
   * Fold the rows the forum did not uphold behind a control.
   *
   * Sixteen claims is the truth of this case and too long to be the first
   * thing on the page: what the Court found is four lines, and what it
   * rejected is twelve. Folded, the table answers the first question at a
   * glance and the second on one press — and the control says how many are
   * behind it, so nothing is hidden, only put one step away.
   *
   * Absent, every row shows. A dispositif of eight upheld claims has
   * nothing to fold.
   */
  fold?: { show: string; hide: string };
}) {
  const list = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);
  const [all, setAll] = useState(false);
  const kept = (r: VerdictRow) =>
    r.outcome === "violation" || r.outcome === "convicted" || r.outcome === "granted";
  const folding = Boolean(fold) && rows.some(kept) && !rows.every(kept);
  /* The track cell prints on the row that opens a run, and folding changes
     which row that is — with the rest hidden, «CERD» would sit on a row in
     the middle of the table and the first CERD row would have an empty
     first cell. Recomputed over what is actually drawn. */
  const drawn = (folding && !all ? rows.filter(kept) : rows).map((r, i, a) => ({
    ...r,
    opensTrack: i === 0 || a[i - 1].track !== r.track,
  }));

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
    <>
    <ul className="verdicts" ref={list} data-shown={shown ? "yes" : "no"}>
      {drawn.map((r, i) => (
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
          {/* The article on every row, not only on the first of its run.

              The column was printed once per track and left blank on the
              rows under it — and a table whose first cell is empty is a
              table a reader cannot read: «Інші вимоги · Відхилено» with
              nothing saying what it is other than. The link, though, is
              offered once: the row that opens a run carries the way out to
              the instrument's own text, and repeating that on every row
              would be three identical links to the same document.

              Owner: «а де стаття? чому там пусто?» */}
          {r.opensTrack ? (
            r.href ? (
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
            )
          ) : (
            <span className="v-track v-track-cont">{r.track}</span>
          )}
          {/* Article, claim, result — the order the design reads them in and
              the order a dispositif is written in. It was outcome first,
              because the row used to run the full 1180px rail and the two
              ends of a sentence sat a screen apart. The row is a table now:
              three tracks, the result in a fixed column at the right, and
              nothing between them to cross. */}
          <span className="v-claim">{r.claim}</span>
          <span className="v-out" data-o={r.outcome}>
            {r.outcomeLabel}
          </span>
        </li>
      ))}
    </ul>
      {folding && (
        <button type="button" className="v-fold" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? fold!.hide : fold!.show}
        </button>
      )}
    </>
  );
}

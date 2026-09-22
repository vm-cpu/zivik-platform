"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  head,
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
  /**
   * The column heads, which are also the sort controls.
   *
   * Sixteen claims is enough that a reader arrives with a question the
   * record's own order does not answer — «what did it reject under CERD»,
   * «show me the breaches together». Two of the three columns can answer
   * it: the ground a claim was brought under, and how it went. The claim
   * itself sorts by nothing anyone would ask for.
   *
   * Three states, and the third is the record's own order — a table that
   * cannot be put back is a table a reader has to reload to trust.
   */
  head?: { track: string; claim: string; outcome: string; sortedBy: string };
}) {
  const list = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);
  const [all, setAll] = useState(false);
  const [sort, setSort] = useState<{ by: "track" | "outcome"; dir: 1 | -1 } | null>(null);
  /* The control does not move when it is pressed.
   *
   * It is the table's last row, so opening twelve rows above it pushed it
   * twelve rows down — out from under the cursor mid-press, and far enough
   * that closing it again meant scrolling to find it. The page is scrolled
   * by however far the button travelled, so it stays exactly where it was
   * and the way back is under the finger that opened it.
   *
   * Owner: «при натисканні на розгорнути — відбувається скачок і він
   * опускається вниз. І щоб згорнути треба прогортати вниз».
   */
  const foldRef = useRef<HTMLButtonElement>(null);
  const anchor = useRef<number | null>(null);
  useLayoutEffect(() => {
    const was = anchor.current;
    anchor.current = null;
    if (was === null || !foldRef.current) return;
    const now = foldRef.current.getBoundingClientRect().top;
    if (now !== was) window.scrollBy(0, now - was);
  }, [all]);
  /* Breaches first when sorted by result: the question is always which
     ones, never which ones were not. */
  const RANK: Record<string, number> = {
    violation: 0,
    convicted: 0,
    granted: 0,
    rejected: 1,
    "no-violation": 1,
    acquitted: 1,
    "not-decided": 2,
  };
  const kept = (r: VerdictRow) =>
    r.outcome === "violation" || r.outcome === "convicted" || r.outcome === "granted";
  const folding = Boolean(fold) && rows.some(kept) && !rows.every(kept);
  /* The track cell prints on the row that opens a run, and folding changes
     which row that is — with the rest hidden, «CERD» would sit on a row in
     the middle of the table and the first CERD row would have an empty
     first cell. Recomputed over what is actually drawn. */
  const shownRows = folding && !all ? rows.filter(kept) : rows;
  const ordered = sort
    ? [...shownRows].sort((a, b) => {
        const v =
          sort.by === "track"
            ? a.track.localeCompare(b.track)
            : (RANK[a.outcome] ?? 3) - (RANK[b.outcome] ?? 3) ||
              a.outcomeLabel.localeCompare(b.outcomeLabel);
        return v * sort.dir;
      })
    : shownRows;
  /* The track cell prints on the row that opens a run, and both folding and
     sorting change which row that is — left alone, «CERD» would sit on a
     row in the middle of the table and the first CERD row would open with
     an empty first cell. Recomputed over what is actually drawn. */
  const drawn = ordered.map((r, i, a) => ({
    ...r,
    opensTrack: i === 0 || a[i - 1].track !== r.track,
  }));
  const press = (by: "track" | "outcome") =>
    setSort((s) => (s?.by !== by ? { by, dir: 1 } : s.dir === 1 ? { by, dir: -1 } : null));
  const aria = (by: "track" | "outcome") =>
    sort?.by === by ? (sort.dir === 1 ? ("ascending" as const) : ("descending" as const)) : ("none" as const);

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
      {head && (
        <div className="ix-head" role="row">
          <button
            type="button"
            className="ix-sort"
            role="columnheader"
            aria-sort={aria("track")}
            onClick={() => press("track")}
          >
            {head.track}
            <i aria-hidden="true">{sort?.by === "track" ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</i>
          </button>
          <span role="columnheader">{head.claim}</span>
          <button
            type="button"
            className="ix-sort ix-sort-e"
            role="columnheader"
            aria-sort={aria("outcome")}
            onClick={() => press("outcome")}
          >
            {head.outcome}
            <i aria-hidden="true">{sort?.by === "outcome" ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</i>
          </button>
        </div>
      )}
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
        /* The last row of the table rather than a button under it: the
           index already has a shape, and the way into the rest of it is
           the next line down, not a second object. */
        <button
          type="button"
          className="v-fold"
          ref={foldRef}
          aria-expanded={all}
          onClick={() => {
            anchor.current = foldRef.current?.getBoundingClientRect().top ?? null;
            setAll(!all);
          }}
        >
          <span className="v-fold-t">{all ? fold!.hide : fold!.show}</span>
          <span className="v-fold-n">
            {all ? "" : rows.filter((r) => !kept(r)).length}
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}
    </>
  );
}

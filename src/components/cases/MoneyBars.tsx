"use client";

import { useState } from "react";

/**
 * The money in the award, drawn to one shared scale.
 *
 * Props arrive locale-resolved (see CaseTimeline for why).
 *
 * ── Two things the drawing has to admit ────────────────────────────────────
 *
 * **The floor distorts.** A bar narrower than a hairline is not a bar, so a
 * figure gets at least 1.2% of the rail whatever its true share. On the DTEK
 * page the smallest sum is 0.26% of the largest and is therefore drawn some
 * four times too wide. That is a defensible compromise for legibility and an
 * indefensible one to make silently, in a graphic about money: every figure
 * now prints its share of the largest as text, so the number is the record and
 * the bar is only an aid to it, and a bar that had to be widened says so.
 *
 * And every bar is drawn inside its rail rather than alone on the ground. A
 * floored bar was a gold stub in the dark with a red line under it saying not
 * to trust its width: nothing to compare it to, so it read as a fault rather
 * than as a small sum. The rail is the largest figure on the page, drawn full
 * width and unlit, and the stub sitting at the left end of it is legible as
 * what it is — 0.26% of that.
 *
 * **The segments are not controls.** Each part of a split bar used to be its
 * own button, duplicating the entry for that part in the key below — two focus
 * stops for one fact, and on Oschadbank the smallest part is 2.6% of the sum,
 * which draws as roughly seventeen pixels of clickable target. The segments are
 * the picture now; the key is where a reader points.
 */
export interface MoneyFigureR {
  label: string;
  display: string;
  amount: number;
  /** The unit `amount` is in; anything but the scale's own is left undrawn. */
  currency?: string;
  parts?: { label: string; display: string; amount: number }[];
  estimated?: boolean;
  note?: string;
}

export default function MoneyBars({
  figures,
  shareLabel,
  ofLargestLabel,
  flooredLabel,
  locale,
}: {
  figures: MoneyFigureR[];
  shareLabel: string;
  /** "від найбільшої суми" — what every bar is drawn against. */
  ofLargestLabel: string;
  /** Said on a bar the floor had to widen. */
  flooredLabel: string;
  locale: string;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  /* The scale belongs to one currency — the one the largest figure is in,
     which on every page here is the award's own. A figure in another cannot be
     drawn against it: the French seizure is in euros, and a euro magnitude on
     a dollar bar is a comparison nobody made. It used to be drawn anyway, with
     a note calling the bar "indicative"; then it acquired a printed
     percentage, which is the same error with a decimal place on it. Now it
     simply is not drawn.

     Declared before `scale`, which reads them. Written the other way round
     this threw "Cannot access 'l' before initialization" at prerender — a
     const is not hoisted, and the build is where that surfaced. */
  const scaleCurrency =
    figures.reduce((a, b) => (b.amount > a.amount ? b : a), figures[0])
      ?.currency ?? "USD";
  const onScale = (f: MoneyFigureR) => (f.currency ?? "USD") === scaleCurrency;
  const scale = Math.max(...figures.filter(onScale).map((f) => f.amount));

  const FLOOR = 1.2;

  /* A bar shows its split only if the *narrowest* part of it is wide enough to
     be read as a part.

     The gate used to be on the bar: at least 15% of the rail and it could
     divide. But what goes wrong is never the bar's width, it is the smallest
     segment's — and that depends on how lopsided the split is. Oschadbank's
     principal is 74% of its rail and passed easily, while the third of its
     three heads is 2.6% of the sum: measured on the built page at 375px, a
     242px bar cut into 128, 104 and 6 pixels. Six pixels is thinner than the
     DTEK bar this gate was written to catch.

     So the test is the narrowest part as a share of the rail, and the
     threshold is the share that part needs to clear about 8px of drawing. That
     depends on the window, which a page rendered once cannot know — the rail
     measures 327px at 375px of viewport and 900px at 1000px — so the decision
     is made in two halves. Anything under 1% never divides: 8px would need a
     900px rail and no window makes that bar legible. Between 1% and 2.5% the
     bar divides and is marked `data-thin`, and the stylesheet collapses it
     back to solid below 900px of viewport, where the same segment would be
     six pixels. Oschadbank's principal splits 47/49/2.6 and lives in that
     band: three parts on a desktop, one solid bar on a phone.

     Where the gate closes the key underneath still carries every part with its
     figure and its share, which is where a reader was going to read them
     anyway. */
  const SEG_MIN = 1;
  const SEG_WIDE = 2.5;
  const pct = (n: number) =>
    n.toLocaleString(locale === "uk" ? "uk-UA" : "en-GB", {
      maximumFractionDigits: n < 1 ? 2 : 1,
    });

  return (
    <div className="money">
      {figures.map((f, i) => {
        const drawn = onScale(f);
        const width = (f.amount / scale) * 100;
        const floored = drawn && width < FLOOR;
        const parts = f.parts ?? [];
        const narrowest = parts.length
          ? (Math.min(...parts.map((p) => p.amount)) / scale) * 100
          : 0;
        const segmented = drawn && parts.length > 1 && narrowest >= SEG_MIN;
        /* Drawn here, solid on a narrow window — the stylesheet decides. */
        const thin = segmented && narrowest < SEG_WIDE;
        return (
          <div key={i} className="money-row">
            <div className="money-head">
              <span className="money-label">{f.label}</span>
              <b className="money-value">{f.display}</b>
            </div>

            {/* The rail is the largest figure on the page. Every bar is drawn
                inside it, so a small sum reads as a small sum rather than as a
                stub of unknown meaning. */}
            {drawn && (
            <div className="money-rail">
              <div
                className="money-bar"
                data-estimated={f.estimated ? "yes" : "no"}
                data-floored={floored ? "yes" : "no"}
                data-thin={thin ? "yes" : "no"}
                style={{ width: `${Math.max(width, FLOOR)}%` }}
              >
                {segmented &&
                  parts.map((p, j) => (
                  /* A picture, not a control — the key below is where a reader
                     points. As buttons these duplicated every key entry and,
                     for a part worth 2.6% of its sum, offered a target about
                     seventeen pixels wide. */
                  <i
                    key={`${i}-${j}`}
                    className="money-seg"
                    data-seg={j}
                    data-on={picked === `${i}-${j}` ? "yes" : "no"}
                    style={{ flexGrow: p.amount }}
                  />
                  ))}
              </div>
            </div>
            )}

            {/* The share, in words, for every figure on the scale and without
                being asked.
                The bar is drawn against the largest sum on the page and cannot
                be read to two decimal places by eye; on a page about money the
                number has to be legible, not inferred from a length. */}
            {drawn && (
              <p className="money-share">
                {pct(width)}% {ofLargestLabel}
                {floored && <em> · {flooredLabel}</em>}
              </p>
            )}

            {parts.length > 0 && (
              <ul
                className="money-key"
                data-solid={segmented ? "no" : "yes"}
                data-thin={thin ? "yes" : "no"}
              >
                {parts.map((p, j) => {
                  const key = `${i}-${j}`;
                  const share = Math.round((p.amount / f.amount) * 100);
                  return (
                    <li key={key} data-on={picked === key ? "yes" : "no"}>
                      <button type="button" onClick={() => setPicked(picked === key ? null : key)}>
                        {/* The swatch wears its segment's weave only while
                            that segment is on the bar. On an unsegmented bar
                            the weaves named nothing a reader could find, and
                            the entry still says its figure and its share. */}
                        <i data-seg={segmented ? j : undefined} />
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

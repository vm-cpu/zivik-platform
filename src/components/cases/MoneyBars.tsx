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

  /* Below this share of the rail a bar cannot show a split.

     DTEK's costs are 2.6% of the largest sum on its page — about 23px — and
     inside that the two parts divide 13/87, so the smaller one is three pixels
     and the weave that distinguishes them is noise at that size. The bar draws
     solid instead and the key underneath carries both parts with their
     figures, which is where a reader was going to read them anyway. */
  const SEG_MIN = 15;
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
        const segmented = drawn && width >= SEG_MIN;
        return (
          <div key={i} className="money-row">
            <div className="money-head">
              <span className="money-label">{f.label}</span>
              <b className="money-value">{f.display}</b>
            </div>

            {drawn && (
            <div
              className="money-bar"
              data-estimated={f.estimated ? "yes" : "no"}
              data-floored={floored ? "yes" : "no"}
              style={{ width: `${Math.max(width, FLOOR)}%` }}
            >
              {segmented &&
                f.parts?.map((p, j) => (
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

"use client";

import { useEffect, useRef, useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Metric } from "@/content/summaries/types";

/**
 * The size of the loss, in three registers.
 *
 * A countable metric becomes one mark per unit — 294 outlets read as a field,
 * not as a number. A share becomes a bar against the whole. Everything else
 * stays a figure with its caption.
 *
 * ── What the bar is for ────────────────────────────────────────────────────
 * It used to fill the share in gold and leave the rest as an empty track. On
 * this page the share is the 9.5% of deported children who have come home,
 * and gold is the colour this system gives to something recovered — so the
 * band read as a small gain against nothing, when the finding is the nine in
 * ten still held. The remainder now carries the page's own red — the colour
 * every other breach on it wears — and its own label, so both sides of the
 * proportion are stated.
 *
 * The fill grows from nothing the first time the bar is scrolled into view.
 * That is the whole of the motion here, and it is not decoration: a share
 * this small is easier to feel as it is drawn than as a printed percentage.
 * A reader who has asked for reduced motion gets the bar at full width with
 * no animation at all.
 */
export default function TakingsGrid({
  metrics,
  locale,
  labels,
}: {
  metrics: Metric[];
  locale: Locale;
  /** "of which" and the over-cap note for a dot field too large to draw. */
  labels?: { andMore?: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setShown(true);
      return;
    }

    /* Once. A bar that re-draws every time it re-enters the viewport turns a
       fact into an ornament the reader has to sit through again. */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    /* The bar must never be left at nought.

       Its width is driven by this state, so anything that stops the observer
       firing — a browser that throttles it, a tab restored in the background,
       a rendering pipeline that is not running — would leave a reader looking
       at an empty track and reading it as "none returned". That is a worse
       failure than having no animation at all, and it is silent. After two
       seconds the bar draws whether or not the observer has spoken. */
    const failsafe = window.setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  /* 9,5% in Ukrainian, 9.5% in English. The figure was printed straight out of
     the number, so the one percentage on the page that the component wrote
     itself was the only one not following the locale. */
  const pct = (n: number) =>
    n.toLocaleString(locale === "uk" ? "uk-UA" : "en-GB", {
      maximumFractionDigits: 1,
    });

  /* The dot field draws one mark per unit, which cannot go on for ever. When
     the count is over the cap the field is drawn to the cap and says so —
     silently truncating would make the marks a lie about the number printed
     directly above them. */
  const CAP = 400;

  return (
    <div className="takings" ref={root} data-shown={shown ? "yes" : "no"}>
      {metrics.map((m, i) => (
        <div
          key={i}
          className="taking"
          /* `!== undefined` on both, for the reason given at the dot field
             below: a metric of nought is a finding, and truthiness filed it
             under the wrong shape while the field itself rendered. */
          data-shape={
            m.count !== undefined
              ? "grid"
              : m.percent !== undefined
                ? "bar"
                : "plain"
          }
        >
          <div className="taking-head">
            <span className="taking-label">{pick(m.label, locale)}</span>
            <b className="taking-value">
              {typeof m.value === "string" ? m.value : pick(m.value, locale)}
            </b>
          </div>

          {/* `!== undefined`, not truthiness — the sibling `percent` test two
              blocks down already gets this right. A metric recorded as
              `count: 0` (nought of something, which is a finding) rendered a
              bare "0" into the tile instead of an empty dot field. */}
          {m.count !== undefined && (
            <>
              <div className="dotfield" aria-hidden="true">
                {Array.from({ length: Math.min(m.count, CAP) }, (_, d) => (
                  <i key={d} style={{ transitionDelay: `${Math.min(d * 4, 900)}ms` }} />
                ))}
              </div>
              {m.count > CAP && labels?.andMore && (
                <p className="taking-capped">
                  {labels.andMore.replace("{n}", String(CAP))}
                </p>
              )}
            </>
          )}

          {m.percent !== undefined && (
            <>
              <div
                className="taking-bar"
                role="img"
                aria-label={`${pick(m.label, locale)}: ${pct(m.percent)}%`}
              >
                <i style={{ width: shown ? `${m.percent}%` : "0%" }} />
              </div>
              {m.restLabel && (
                <p className="taking-split">
                  <span className="ts-share">{pct(m.percent)}%</span>
                  <span className="ts-rest">{pick(m.restLabel, locale)}</span>
                </p>
              )}
            </>
          )}

          {m.note && <p className="taking-note">{pick(m.note, locale)}</p>}
        </div>
      ))}
    </div>
  );
}

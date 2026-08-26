"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./theatre-legend.css";
import "./case-map.css";

/**
 * The decision page's map, as an instrument.
 *
 * It was a picture: the seat, a dashed line, one or two zones, and a legend
 * underneath carrying the sentence that says what happened at each. Nothing
 * answered. The reader could see that a case reaches from The Hague to the
 * east of Ukraine and could not ask the map which of two theatres a sentence
 * belonged to — on `icj-cerd-icsft` there are two, ICSFT in the east and CERD
 * in Crimea, and the only way to pair a mark with its sentence was to match
 * the words by eye.
 *
 * It is not the events map. That component is fitted to its own projection in
 * several load-bearing places — the «Україна» framing is a hardcoded rect in
 * those units, the label sides and the crowding maths are measured against
 * that atlas, and its data model is a site with a caseload and a list of
 * decisions. A case has one forum and one or two theatres and no caseload.
 * What carries over is the language: a mark is a button, selecting one lights
 * the relation and quietens the rest, the legend is the other end of the same
 * control, and nothing is selected until the reader selects it.
 *
 * Props arrive locale-resolved: this is a client component, and its props are
 * serialized into the page payload.
 */
export interface CaseMapTheatre {
  id: string;
  place: string;
  tag: string;
  summary?: string;
  /** Marker positions in the frame's own units. */
  pts: [number, number][];
  /** The ground this theatre is about, already resolved to path strings. */
  areas?: string[];
  labelDx?: number;
  labelDy?: number;
}

export default function CaseMap({
  frame,
  context,
  uaPath,
  regions,
  seat,
  reach,
  kyiv,
  theatres,
  labels,
}: {
  frame: string;
  context: string[];
  uaPath: string;
  /** Ukraine's internal oblast boundaries, as one mesh. */
  regions?: string;
  seat: { name: string; caption: string; at: [number, number] };
  reach: [number, number];
  kyiv: { label: string; at: [number, number] };
  theatres: CaseMapTheatre[];
  labels: { alt: string; seatRole: string; pick: string };
}) {
  const [sel, setSel] = useState<string | null>(null);
  const [rov, setRov] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [vx, vy, vw, vh] = frame.split(" ").map(Number);
  /** A point in the frame, as a percentage of it — see the labels below. */
  const at = (x: number, y: number) => ({
    left: `${((x - vx) / vw) * 100}%`,
    top: `${((y - vy) / vh) * 100}%`,
  });

  /* Every mark, in the order the keyboard walks them: the seat first, because
     that is where the case is heard, then the theatres in authored order. */
  const order = ["seat", ...theatres.map((t) => t.id)];
  const rovKey = rov && order.includes(rov) ? rov : order[0];

  const go = useCallback((key: string) => {
    setRov(key);
    svgRef.current
      ?.querySelector<SVGGraphicsElement>(`[data-mk="${CSS.escape(key)}"]`)
      ?.focus?.();
  }, []);

  const onKey = (
    ev: { key: string; repeat: boolean; preventDefault: () => void },
    key: string,
  ) => {
    if (ev.repeat) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      setSel((s) => (s === key ? null : key));
      return;
    }
    const by =
      ev.key === "ArrowRight" || ev.key === "ArrowDown"
        ? 1
        : ev.key === "ArrowLeft" || ev.key === "ArrowUp"
          ? -1
          : 0;
    if (!by || order.length < 2) return;
    ev.preventDefault();
    const i = order.indexOf(key);
    go(order[(i + by + order.length) % order.length]);
  };

  /* A selection is a view of the map, and Escape puts a view away. */
  useEffect(() => {
    if (!sel) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [sel]);

  const state = (key: string) =>
    sel === null ? "rest" : sel === key ? "on" : "off";

  return (
    <div className="map-wrap" data-sel={sel ?? "none"}>
      <div className="map-plot">
        <svg
          ref={svgRef}
          className="map"
          viewBox={frame}
          /* A group of controls while the marks answer — the same distinction
             the events map draws. There is no state here in which they do not:
             this drawing has at most three of them and they never crowd. */
          role="group"
          aria-label={labels.alt}
        >
          <defs>
            <clipPath id="mapclip">
              <rect x={vx} y={vy} width={vw} height={vh} />
            </clipPath>
          </defs>
          <g clipPath="url(#mapclip)">
            {context.map((d, i) => (
              <path key={i} className="ctx" d={d} />
            ))}
            <path className="ua-fill" d={uaPath} />
            {/* The oblasts, as the lines between them. The decision maps never
                had these — the atlas that carried them was the other one — and
                they are what lets a reader see that Crimea is a piece of this
                country rather than a neighbour of it. Clipped to the outline,
                because the mesh is 10m and the outline 110m and where an
                internal line runs out to meet the coast the two disagree by a
                pixel. */}
            {regions && (
              <path className="ua-regions" d={regions} clipPath="url(#mapclip)" />
            )}

            {/* The ground each theatre is about, under every mark. */}
            {theatres.flatMap((t) =>
              (t.areas ?? []).map((d, i) => (
                <path
                  key={`${t.id}-${i}`}
                  className="zone-area"
                  data-state={state(t.id)}
                  d={d}
                />
              )),
            )}

            {/* The forum's reach: seat → the ground in dispute. It lights
                whichever end the reader picked, because it is the one relation
                this drawing has. */}
            <line
              className="reach"
              data-state={sel === null ? "rest" : "on"}
              x1={seat.at[0]}
              y1={seat.at[1]}
              x2={reach[0]}
              y2={reach[1]}
            />

            <g className="mk-seat" data-state={state("seat")}>
              <circle className="mk-court" cx={seat.at[0]} cy={seat.at[1]} r={10} />
              <circle
                className="mk-hit"
                data-mk="seat"
                cx={seat.at[0]}
                cy={seat.at[1]}
                role="button"
                tabIndex={rovKey === "seat" ? 0 : -1}
                aria-label={`${seat.name} — ${seat.caption}`}
                aria-pressed={sel === "seat"}
                onFocus={() => setRov("seat")}
                onClick={() => setSel((s) => (s === "seat" ? null : "seat"))}
                onKeyDown={(ev) => onKey(ev, "seat")}
              />
            </g>

            <circle className="mk-city" cx={kyiv.at[0]} cy={kyiv.at[1]} r={7} />

            {theatres.map((t) => (
              <g key={t.id} className="mk-zone" data-state={state(t.id)}>
                {t.pts.map((p, i) => (
                  <g key={i}>
                    <circle className="zone-halo" cx={p[0]} cy={p[1]} r={40} />
                    <circle className="zone" cx={p[0]} cy={p[1]} r={9} />
                  </g>
                ))}
                {/* One target per theatre, on its first mark: two dots eight
                    units apart cannot each carry a 24px circle without one
                    swallowing the other's centre, and they are one thing. */}
                <circle
                  className="mk-hit"
                  data-mk={t.id}
                  cx={t.pts[0][0]}
                  cy={t.pts[0][1]}
                  role="button"
                  tabIndex={rovKey === t.id ? 0 : -1}
                  aria-label={`${t.place} — ${t.tag}`}
                  aria-pressed={sel === t.id}
                  onFocus={() => setRov(t.id)}
                  onClick={() => setSel((s) => (s === t.id ? null : t.id))}
                  onKeyDown={(ev) => onKey(ev, t.id)}
                />
              </g>
            ))}
          </g>
        </svg>

        {/* The names, in HTML over the drawing: SVG measures a font in user
            units, so the same declaration rendered 23 CSS pixels at 1440 and 6
            at 375. `aria-hidden`, because every one of them is already the
            accessible name of the mark it sits beside. */}
        <div className="map-labels" aria-hidden="true">
          <span className="ml-seat" data-state={state("seat")} style={at(...seat.at)}>
            <b>{seat.name}</b>
            <i>{seat.caption}</i>
          </span>
          <span className="ml-city" style={at(...kyiv.at)}>
            {kyiv.label}
          </span>
          {theatres.map((t) => {
            const cx = t.pts.reduce((s, p) => s + p[0], 0) / t.pts.length;
            const cy = t.pts.reduce((s, p) => s + p[1], 0) / t.pts.length;
            const p = at(cx + (t.labelDx ?? 0), cy + (t.labelDy ?? 0));
            /* Held inside the frame: a zone on the eastern border centres its
               name past the right edge, and an HTML label does not clip. */
            const left = Math.min(Math.max(parseFloat(p.left), 13), 87);
            return (
              <span
                key={t.id}
                className="ml-zone"
                data-state={state(t.id)}
                style={{ ...p, left: `${left}%` }}
              >
                <i>{t.tag}</i>
                <b>{t.place}</b>
              </span>
            );
          })}
        </div>
      </div>

      {/* The legend is the other end of the same control. It carried the one
          sentence that says what happened at each place and had no way to tell
          the reader which mark that sentence belongs to; now pressing either
          lights both. */}
      <div className="map-legend">
        <button
          type="button"
          className="lg-seat"
          data-state={state("seat")}
          aria-pressed={sel === "seat"}
          onClick={() => setSel((s) => (s === "seat" ? null : "seat"))}
        >
          <i className="lg-court" />
          <span className="lg-place">
            {seat.name} — {seat.caption}
          </span>
        </button>
        {theatres.map((t) => (
          <button
            key={t.id}
            type="button"
            className="lg-theatre"
            data-state={state(t.id)}
            aria-pressed={sel === t.id}
            onClick={() => setSel((s) => (s === t.id ? null : t.id))}
          >
            <i />
            <span className="lg-place">
              {t.place} — <b>{t.tag}</b>
            </span>
            {t.summary && <span className="lg-note">{t.summary}</span>}
          </button>
        ))}
        {/* That the marks answer at all. One line, and only where there is
            more than one thing to tell apart. */}
        {theatres.length > 1 && <p className="lg-how">{labels.pick}</p>}
      </div>
    </div>
  );
}

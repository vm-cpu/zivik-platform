"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { EventCategory } from "@/content/map";
import "./events-map.css";

/**
 * The events map: where the harm happened, and which courts are hearing it.
 *
 * Replaces an <iframe> onto a self-contained d3 page. That page fetched d3,
 * topojson-client and the world geometry from two CDNs on every homepage view,
 * carried its own copy of the webfonts, and had its labels hardcoded in
 * Ukrainian — so the English homepage showed a Ukrainian map and none of the
 * text was visible to a search engine.
 *
 * Geometry is projected at build time (scripts/europe-map.mjs), so this is
 * plain SVG: no map library ships to the reader, and the whole thing is in the
 * page's own DOM, themed by the page's own tokens.
 *
 * Props arrive locale-resolved. This is a client component, so its props are
 * serialized into the payload — passing {uk, en} pairs would ship both
 * languages to every reader.
 */
export interface MapEventR {
  key: string;
  category: EventCategory;
  size: number;
  when: string;
  title: string;
  note: string;
  courts: string[];
  forums: string;
  count: string;
  open?: boolean;
  /** Decisions this site leads to. Empty means nothing is summarised yet. */
  cases: { slug: string; title: string; forum: string }[];
}
export interface MapCourtR {
  key: string;
  city: string;
  seats: string;
  /** Where it sits on the drawing; absent when the city is off the frame. */
  offMap?: boolean;
  labelDy?: number;
  /** What the registry says this court is hearing, and which of it is readable. */
  caseload: { total: number; written: { slug: string; title: string }[] };
}
export interface MapGeometry {
  viewBox: string;
  context: string[];
  ukraine: string;
  /**
   * Ukraine's internal oblast boundaries, as one mesh of open polylines — the
   * edges two of the 27 admin-1 units share, and nothing else. See the note in
   * scripts/europe-map.mjs for why this is a mesh and not 27 outlines.
   */
  regions: string;
  markers: Record<string, number[]>;
}

/**
 * Which way a site's label leans off its marker.
 *
 * Pure layout, so it lives with the renderer rather than in the content file:
 * it answers a question about pixels, and it would have to change if the frame
 * or a marker moved. Measured in the close framing at 1440px, where the drawing
 * renders 1420px wide and one unit of the projection is 2.78px:
 *
 *   MH17 and eastern Ukraine are 16.9 units apart — 47px — so one goes up and
 *   the other right. Crimea and the Kerch strait are 31.7 apart on a near-
 *   horizontal line, so they go opposite ways. Energy sits due west of
 *   Mariupol, 48.6 apart, and takes the west side; Mariupol drops below,
 *   clear of the Sea of Azov coast where its own halo already sits.
 *
 * The offsets themselves are not here: a label is placed just outside its
 * marker's halo, which is drawn in projection units, plus a gap measured in
 * screen pixels. Both parts are computed below, so the placement holds at any
 * zoom instead of being tuned for one.
 */
const LABEL_SIDE: Record<string, "left" | "right" | "above" | "below"> = {
  crimea: "left",
  kerch: "right",
  energy: "left",
  mariupol: "below",
  mh17: "right",
  donbas: "above",
};

/**
 * A marker label, derived from the site's own date tag.
 *
 * NEEDS THE OWNER'S REVIEW — see the note on `when` in src/content/map.ts.
 * Every tag but one reads "<noun> · <date>", and that noun is the shortest
 * true name the archive already gives the site: Окупація / Occupation,
 * Затримання / Seizure, Схід / The east, Енергетика / Energy, MH17. The sixth
 * has no noun — its tag is bare "2022" — so that is what it says. Nothing here
 * is invented: a label a reader could mistake for a place name we assigned
 * would be worse than a date.
 *
 * The full title is never far: it is in the card the marker opens and in the
 * list of six below the drawing, at 15px.
 */
const shortLabel = (when: string) => when.split("·")[0].trim();

/**
 * Below this many CSS pixels per projection unit, the labels are not drawn.
 *
 * The tightest pair on the map is MH17 and eastern Ukraine at 16.9 units. At
 * 2.6px per unit that is 44px between the two markers, which is what the
 * placement above needs to keep two labels apart; below it they touch. The
 * threshold is on the rendered scale rather than on a framing or a breakpoint
 * because that is the thing legibility actually depends on — the wide framing
 * at 1440px gives 1.18px per unit and the close one 2.78, and a phone in the
 * close framing gives 0.76, so the same rule covers all three without naming
 * any of them.
 */
const LABEL_MIN_SCALE = 2.6;

/** Keep a frame inside the projection: never wider than it, never outside it. */
function clamp(
  v: { x: number; y: number; w: number; h: number },
  full: { x: number; y: number; w: number; h: number },
) {
  const w = Math.min(v.w, full.w);
  const h = Math.min(v.h, full.h);
  return {
    w,
    h,
    x: Math.min(Math.max(v.x, full.x), full.x + full.w - w),
    y: Math.min(Math.max(v.y, full.y), full.y + full.h - h),
  };
}

export default function EventsMap({
  geo,
  events,
  courts,
  labels,
  locale,
  variant = "full",
}: {
  geo: MapGeometry;
  events: MapEventR[];
  courts: MapCourtR[];
  labels: {
    alt: string;
    close: string;
    courtsSeat: string;
    /** The two states a site can be in: written up, or not yet. */
    legendLit: string;
    legendUnlit: string;
    court: string;
    /** Heading above the decision links inside a card. */
    reads: string;
    /** Shown where a site has no summarised decision yet. */
    pending: string;
    /** Marker-size key: a bigger dot means more proceedings. */
    sizeKey: string;
    /** Legend group headings. */
    legendWhat: string;
    legendHow: string;
    /** What the dashed line means. */
    legendLine: string;
    /** Heading over the sites a selected court hears. */
    courtHears: string;
    /** "{n} proceedings in the registry" — the court's own caseload. */
    caseload: string;
    /** The two framings. */
    zoomLabel: string;
    zoomWide: string;
    zoomClose: string;
    zoomIn: string;
    zoomOut: string;
  };
  locale: string;
  /**
   * "band" is the home page: the drawing, a card when a dot is picked, and a
   * key to the three colours. Nothing else — the seat list, the how-to-read
   * column and the row of six site cards belong on the map's own page, where
   * there is room to read them.
   */
  variant?: "band" | "full";
}) {
  /**
   * One selection, of either kind. Sites and courts are two ends of the same
   * relation, so selecting one must clear the other — holding both would light
   * two different sets of lines at once and mean nothing.
   */
  const [sel, setSel] = useState<{ kind: "site" | "court"; key: string } | null>(
    () => {
      const first = events.find((e) => e.open)?.key;
      return first ? { kind: "site", key: first } : null;
    },
  );

  /**
   * The selection lives in the URL so a card can be linked to.
   *
   * Written with history.replaceState rather than useSearchParams: on a
   * prerendered route that hook pushes the client tree up to the nearest
   * Suspense boundary into client-side rendering, and the whole point of
   * replacing the old iframe was that this map's text ships in the HTML.
   */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const site = q.get("site");
    const court = q.get("court");
    if (site && events.some((e) => e.key === site)) setSel({ kind: "site", key: site });
    else if (court && courts.some((c) => c.key === court)) setSel({ kind: "court", key: court });
    // events/courts are stable per render of the server component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useCallback((next: { kind: "site" | "court"; key: string } | null) => {
    setSel(next);
    const q = new URLSearchParams(window.location.search);
    q.delete("site");
    q.delete("court");
    if (next) q.set(next.kind, next.key);
    const qs = q.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
    );
  }, []);

  const toggleSite = (key: string) =>
    select(sel?.kind === "site" && sel.key === key ? null : { kind: "site", key });
  const toggleCourt = (key: string) =>
    select(sel?.kind === "court" && sel.key === key ? null : { kind: "court", key });


  /**
   * Two framings of the same projection.
   *
   * Wide is the argument the map makes: the distance between where the harm
   * happened and where it is being weighed. But Ukraine is 24% of that frame,
   * and inside it MH17 and eastern Ukraine sit 20px apart on a 1440px screen —
   * their haloes overlap and the hit targets nearly touch. Close reframes on
   * the sites at x2.35, which opens that gap to 47px. Nothing is reprojected;
   * only the viewBox changes.
   */
  /**
   * The frame, as numbers rather than two strings. Two named framings were not
   * enough: between them the sites still crowd each other, and a reader who
   * wants one corner of the Donbas had no way to get there. Zoom and pan are
   * arithmetic on the viewBox — no library, no reprojection.
   *
   * The wheel is deliberately not bound. On the home page the map is a band
   * inside a long document, and a map that swallows the scroll wheel traps the
   * reader mid-page. Buttons, drag and double-click instead.
   */
  const FULL = useMemo(() => {
    const [x, y, w, h] = geo.viewBox.split(" ").map(Number);
    return { x, y, w, h };
  }, [geo.viewBox]);
  const CLOSE = useMemo(() => clamp({ x: 556, y: 234, w: 511, h: 213 }, FULL), [FULL]);
  const MIN_W = 120; // about x10; past this the projection's own rounding shows
  const [view, setView] = useState(FULL);
  const close = view.w <= CLOSE.w + 1;

  /** Scale about a point in viewBox units, holding that point still. */
  const zoomBy = useCallback(
    (factor: number, ax?: number, ay?: number) =>
      setView((v) => {
        const w = Math.min(FULL.w, Math.max(MIN_W, v.w * factor));
        const h = w * (FULL.h / FULL.w);
        const px = ax ?? v.x + v.w / 2;
        const py = ay ?? v.y + v.h / 2;
        return clamp(
          { w, h, x: px - ((px - v.x) / v.w) * w, y: py - ((py - v.y) / v.h) * h },
          FULL,
        );
      }),
    [FULL],
  );
  /**
   * Below 640px the markers are decoration, not controls — see the note in
   * events-map.css. pointer-events alone would leave them in the tab order and
   * still announced as buttons, so the DOM has to agree with the stylesheet.
   */
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setCoarse(mq.matches);
    sync();
    // Both, deliberately: the MediaQueryList change event does not fire in
    // every environment that changes the viewport, and a stale value here
    // leaves ten circles announced as buttons that no longer accept a tap.
    // setCoarse with an unchanged value is a no-op, so the overlap is free.
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);
  const viewBox = `${view.x} ${view.y} ${view.w} ${view.h}`;

  /** Pointer position in viewBox units — what both drag and double-click need. */
  const svgRef = useRef<SVGSVGElement | null>(null);
  const atPointer = useCallback(
    (ev: { clientX: number; clientY: number }) => {
      const el = svgRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: view.x + ((ev.clientX - r.left) / r.width) * view.w,
        y: view.y + ((ev.clientY - r.top) / r.height) * view.h,
      };
    },
    [view],
  );

  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  /**
   * How many CSS pixels one projection unit currently renders as.
   *
   * The labels are the only thing on the drawing that must not scale with the
   * zoom: a country outline is still a country outline at half size, but 11px
   * of Charis SIL at half size is 5.5px, which nobody reads. So they are sized
   * and offset in real pixels, converted back into projection units through
   * this number — which means measuring the element, since the scale depends on
   * the container width as much as on the viewBox. Zero until the effect runs,
   * and zero suppresses the labels, so nothing is drawn at the wrong size
   * during hydration.
   */
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // preserveAspectRatio picks one scale for both axes: "meet" fits the
      // viewBox inside the box, "slice" fills it.
      const fit = variant === "full" ? Math.max : Math.min;
      setScale(fit(r.width / view.w, r.height / view.h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, variant]);
  /** One CSS pixel, in projection units. */
  const px = scale > 0 ? 1 / scale : 0;
  const labelled = scale >= LABEL_MIN_SCALE;

  const at = (key: string) => geo.markers[key] ?? [0, 0];
  const selected = sel?.kind === "site" ? events.find((e) => e.key === sel.key) ?? null : null;
  const selectedCourt =
    sel?.kind === "court" ? courts.find((c) => c.key === sel.key) ?? null : null;

  /** Sites heard at the selected court — what a court selection is *for*. */
  const courtSites = useMemo(
    () => (selectedCourt ? events.filter((e) => e.courts.includes(selectedCourt.key)) : []),
    [selectedCourt, events],
  );

  const isLit = (e: MapEventR) =>
    sel?.kind === "site" ? sel.key === e.key : sel?.kind === "court" ? e.courts.includes(sel.key) : false;

  return (
    <div className="emap" data-variant={variant}>
      <div className="emap-figure">
        {/* Not a pan-and-zoom rig: two named framings, because there are only
            two questions — how far the courts are, and which site is which. */}
        <div className="emap-zoom" role="group" aria-label={labels.zoomLabel}>
          <button
            type="button"
            aria-pressed={!close}
            onClick={() => setView(FULL)}
          >
            {labels.zoomWide}
          </button>
          <button
            type="button"
            aria-pressed={close}
            onClick={() => setView(CLOSE)}
          >
            {labels.zoomClose}
          </button>
          <button
            type="button"
            className="emap-zoom-step"
            aria-label={labels.zoomOut}
            onClick={() => zoomBy(1 / 0.7)}
            disabled={view.w >= FULL.w}
          >
            −
          </button>
          <button
            type="button"
            className="emap-zoom-step"
            aria-label={labels.zoomIn}
            onClick={() => zoomBy(0.7)}
            disabled={view.w <= MIN_W}
          >
            +
          </button>
        </div>
      <svg
          ref={svgRef}
          className="emap-svg"
          data-dragging={dragging ? "yes" : undefined}
          viewBox={viewBox}
          preserveAspectRatio={variant === "full" ? "xMidYMid slice" : "xMidYMid meet"}
          role="img"
          aria-label={labels.alt}
          onPointerDown={(ev) => {
            // Only the ground drags; the markers are buttons.
            if ((ev.target as Element).closest("[role='button']")) return;
            drag.current = { id: ev.pointerId, x: ev.clientX, y: ev.clientY };
            ev.currentTarget.setPointerCapture(ev.pointerId);
            setDragging(true);
          }}
          onPointerMove={(ev) => {
            const d = drag.current;
            if (!d || d.id !== ev.pointerId) return;
            const r = ev.currentTarget.getBoundingClientRect();
            const dx = ((ev.clientX - d.x) / r.width) * view.w;
            const dy = ((ev.clientY - d.y) / r.height) * view.h;
            drag.current = { ...d, x: ev.clientX, y: ev.clientY };
            setView((v) => clamp({ ...v, x: v.x - dx, y: v.y - dy }, FULL));
          }}
          onPointerUp={(ev) => {
            if (drag.current?.id === ev.pointerId) {
              drag.current = null;
              setDragging(false);
            }
          }}
          onPointerCancel={() => {
            drag.current = null;
            setDragging(false);
          }}
          onWheel={
            variant === "full"
              ? (ev) => {
                  // Only where the map owns the viewport. In the home band this
                  // would swallow the page scroll and trap the reader mid-page.
                  const p = atPointer(ev);
                  zoomBy(ev.deltaY > 0 ? 1.12 : 1 / 1.12, p?.x, p?.y);
                }
              : undefined
          }
          onDoubleClick={(ev) => {
            const p = atPointer(ev);
            zoomBy(0.6, p?.x, p?.y);
          }}
      >
        {/* Base geography is decoration: the information is in the markers,
            which are listed as real text below for anyone not reading pixels. */}
        <g aria-hidden="true">
          {/* The oblast mesh is clipped to the outline it belongs inside. The
              boundaries come from Natural Earth at 10m and the outline from a
              110m atlas, so where an internal line runs out to meet the coast
              the two disagree by a pixel or two — 21 of the mesh's 1063 points
              fall marginally outside. Clipping is cheaper and more honest than
              pretending two sources at different scales agree. */}
          <defs>
            <clipPath id="emap-ua-clip">
              <path d={geo.ukraine} />
            </clipPath>
          </defs>
          {geo.context.map((d, i) => (
            <path key={i} className="emap-ctx" d={d} />
          ))}
          <path className="emap-ua" d={geo.ukraine} />
          {/* The 27 regions, as the lines between them. Six unlabelled dots
              inside a blank country said nothing about where anything was;
              the oblasts are the frame a Ukrainian reader already has, and a
              foreign one can at least see that Crimea is a piece of this
              country and not a neighbour of it. Quieter than the outer border
              by a wide margin — that stroke is the shape that matters. */}
          <path className="emap-regions" d={geo.regions} clipPath="url(#emap-ua-clip)" />

          {/* Reach lines: from each site to the courts hearing it. Drawn
              before the markers so they pass under, not over. */}
          {events.map((e) =>
            e.courts.map((c) => {
              const [x1, y1] = at(e.key);
              const [x2, y2] = at(c);
              return (
                <line
                  key={`${e.key}-${c}`}
                  className="emap-reach"
                    /* A court selection lights only the lines that end at
                       that court: picking The Hague must not light Crimea's
                       line to Strasbourg just because Crimea is also heard in
                       The Hague. */
                    data-on={
                      (sel?.kind === "site"
                        ? sel.key === e.key
                        : sel?.kind === "court"
                          ? sel.key === c
                          : false)
                        ? "yes"
                        : "no"
                    }
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
              );
            }),
          )}

          </g>

          {/* Courts were decoration inside the aria-hidden group: a circle and
              a label, answering to nothing and invisible to a screen reader.
              The map's subject is the relation between a place where harm
              happened and a court weighing it, and only one end of it could be
              interrogated. Selecting a court lights every site it hears. */}
          {courts.filter((c) => !c.offMap).map((c) => {
            const [x, y] = at(c.key);
            const on = sel?.kind === "court" && sel.key === c.key;
            return (
              <g key={c.key} className="emap-court" data-on={on ? "yes" : "no"}>
                <circle
                  className="emap-court-hit"
                  cx={x}
                  cy={y}
                  r={13}
                  role={coarse ? undefined : "button"}
                  aria-hidden={coarse || undefined}
                  tabIndex={coarse ? -1 : 0}
                  aria-label={coarse ? undefined : c.city}
                  aria-pressed={coarse ? undefined : on}
                  onClick={() => toggleCourt(c.key)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      toggleCourt(c.key);
                    }
                  }}
                />
                <circle className="emap-court-dot" cx={x} cy={y} r={5} />
                <text x={x + 12} y={y + 4 + (c.labelDy ?? 0)}>
                  {c.city}
                </text>
              </g>
            );
          })}

        {/* Markers are buttons: keyboard-reachable, and each one names the
            site it stands for. The old map answered only to the mouse. */}
        {events.map((e) => {
          const [x, y] = at(e.key);
          const side = LABEL_SIDE[e.key] ?? "right";
          return (
              <g
                key={e.key}
                className="emap-site"
                data-on={isLit(e) ? "yes" : "no"}
                data-lit={e.cases.length > 0 ? "yes" : "no"}
              >
              <circle className="emap-halo" cx={x} cy={y} r={e.size / 2} />
                {/* The drawn dot is r=6, which renders 14.4px wide on a
                    1440px screen — under the 24px minimum target size. The
                    interaction sits on its own circle so the drawing keeps
                    the scale it wants. */}
              <circle
                  className="emap-hit"
                cx={x}
                cy={y}
                  r={11}
                role={coarse ? undefined : "button"}
                aria-hidden={coarse || undefined}
                aria-label={coarse ? undefined : e.title}
                  aria-pressed={sel?.kind === "site" && sel.key === e.key}
                  data-on={isLit(e) ? "yes" : "no"}
                  tabIndex={coarse ? -1 : 0}
                  onClick={() => toggleSite(e.key)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      toggleSite(e.key);
                    }
                  }}
              />
                <circle className="emap-dot" cx={x} cy={y} r={6} />
                {/* The name, once the drawing is big enough to hold it. The
                    label clears the marker's own halo — drawn in projection
                    units, so it grows with the zoom — plus a 5px gap and an
                    11px face, both of which do not. */}
                {labelled && (
                  <text
                    className="emap-site-label"
                    aria-hidden="true"
                    x={
                      side === "left"
                        ? x - e.size / 2 - 5 * px
                        : side === "right"
                          ? x + e.size / 2 + 5 * px
                          : x
                    }
                    y={
                      side === "above"
                        ? y - e.size / 2 - 5 * px
                        : side === "below"
                          ? y + e.size / 2 + 5 * px + 8.5 * px
                          : y + 3.8 * px
                    }
                    textAnchor={
                      side === "left" ? "end" : side === "right" ? "start" : "middle"
                    }
                    fontSize={11 * px}
                    strokeWidth={2.6 * px}
                  >
                    {shortLabel(e.when)}
                  </text>
                )}
            </g>
          );
        })}
      </svg>

      {/* Clicking a dot changes a panel that can be 800px away. Without a
          live region a screen-reader user hears nothing at all. */}
      <div className="emap-live" aria-live="polite" aria-atomic="true">
      {selected && (
        <div className="emap-card">
          <button
            type="button"
            className="emap-close"
            aria-label={labels.close}
            onClick={() => select(null)}
          >
            ×
          </button>
          <div className="emap-when">{selected.when}</div>
          <div className="emap-title">{selected.title}</div>
          <p className="emap-note">{selected.note}</p>
          <div className="emap-forums">{selected.forums}</div>
          <div className="emap-count">{selected.count}</div>

          {/* The point of the map. Until now a reader could see that MH17 is
              heard in Strasbourg and The Hague and had no way to reach either
              decision from here. */}
          {selected.cases.length > 0 ? (
            <div className="emap-reads">
              <div className="emap-reads-h">{labels.reads}</div>
              <ul>
                {selected.cases.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${locale}/cases/${c.slug}`}>
                      <span className="emap-read-t">{c.title}</span>
                      {c.forum && <span className="emap-read-f">{c.forum}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="emap-pending">{labels.pending}</p>
          )}
        </div>
      )}

      {/* A court selection answers the reverse question: not "who is hearing
          this?" but "what is this court hearing?" */}
      {selectedCourt && (
        <div className="emap-card emap-card-court">
          <button
            type="button"
            className="emap-close"
            aria-label={labels.close}
            onClick={() => select(null)}
          >
            ×
          </button>
            {/* The court leads and the city locates it, mirroring the event
                card where the date tag sits above and the event is the heading.
                This opened with the legend's own wording ("the courts sit in")
                and put the city where the name belongs. */}
            <div className="emap-when">{selectedCourt.city}</div>
            <div className="emap-title emap-court-name">{selectedCourt.seats}</div>
            {/* What the registry says this court is hearing. The map draws six
                places where harm happened; the archive holds 39 proceedings,
                and the ten heard by the Dutch courts, the ICAO Council, the
                ICC arbitration court, Lithuania and the EU were tied to none
                of those six places, so they appeared nowhere at all. */}
            <p className="emap-caseload">
              {labels.caseload.replace("{n}", String(selectedCourt.caseload.total))}
            </p>
            {selectedCourt.caseload.written.length > 0 && (
              <div className="emap-reads">
                <div className="emap-reads-h">{labels.reads}</div>
                <ul>
                  {selectedCourt.caseload.written.map((w) => (
                    <li key={w.slug}>
                      <Link href={`/${locale}/cases/${w.slug}`}>
                        <span className="emap-read-t">{w.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div className="emap-reads">
            <div className="emap-reads-h">{labels.courtHears}</div>
            <ul>
              {courtSites.map((e) => (
                <li key={e.key}>
                  <button
                    type="button"
                    className="emap-court-site"
                        onClick={() => toggleSite(e.key)}
                  >
                    <span className="emap-read-t">{e.title}</span>
                    <span className="emap-read-f">{e.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      </div>
      </div>

      {/*
        The same content as text. The iframe version was invisible to search
        engines and to anyone not using a pointing device; this list is the
        map's actual payload, and on a narrow screen it is the whole map.
      */}
      <ul className="emap-list" data-variant={variant}>
        {events.map((e) => (
          <li key={e.key}>
            <button
              type="button"
              onClick={() => toggleSite(e.key)}
              aria-pressed={sel?.kind === "site" && sel.key === e.key}
            >
              <span className="emap-li-when">{e.when}</span>
              <span className="emap-li-title">{e.title}</span>
              <span className="emap-li-forums">{e.forums}</span>
              <span className="emap-li-count">{e.count}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* A legend that draws the marks instead of naming them. Every glyph
          below is the same shape the map uses, at the same size, so the reader
          matches by sight rather than by reading a colour word. */}
      <div className="emap-legend" data-variant={variant}>
        <div className="emap-leg-group">
          <h3>{labels.legendWhat}</h3>
          <ul>
            <li className="emap-key">
              <svg viewBox="0 0 22 22" aria-hidden="true">
                <circle className="k-halo" cx="11" cy="11" r="9" />
                <circle className="k-lit" cx="11" cy="11" r="5" />
              </svg>
              {labels.legendLit}
            </li>
            <li className="emap-key">
              <svg viewBox="0 0 22 22" aria-hidden="true">
                <circle className="k-unlit" cx="11" cy="11" r="5" />
              </svg>
              {labels.legendUnlit}
            </li>
            <li className="emap-key">
              <svg viewBox="0 0 22 22" aria-hidden="true">
                <circle className="k-court" cx="11" cy="11" r="5.5" />
              </svg>
              {labels.court}
            </li>
          </ul>
        </div>

        {variant === "full" && (
          <div className="emap-leg-group">
            <h3>{labels.legendHow}</h3>
            <ul>
              <li className="emap-key">
                <svg viewBox="0 0 22 22" aria-hidden="true">
                  <line className="k-line" x1="1" y1="11" x2="21" y2="11" />
                </svg>
                {labels.legendLine}
              </li>
              <li className="emap-key">
                <svg viewBox="0 0 22 22" aria-hidden="true">
                  <circle className="k-lit" cx="5" cy="11" r="3" />
                  <circle className="k-lit" cx="15" cy="11" r="6" />
                </svg>
                {labels.sizeKey}
              </li>
            </ul>
          </div>
        )}

        {variant === "full" && (
          <div className="emap-leg-group emap-leg-seats">
            <h3>{labels.courtsSeat}</h3>
            <ul>
              {courts.map((c) => (
                <li key={c.key}>
                  <button type="button" onClick={() => toggleCourt(c.key)}>
                    <span className="emap-seat-city">{c.city}</span>
                    <span className="emap-seat-list">{c.seats}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

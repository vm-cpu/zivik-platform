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
  /**
   * The city is off the projection's frame, so it has no point in
   * europe-map.json and is docked against the frame's edge instead.
   */
  offMap?: boolean;
  /**
   * Where an off-map city really projects to. Outside the frame by
   * definition — it is the bearing that matters, not the position.
   */
  offAt?: { x: number; y: number };
  /**
   * Short names — the abbreviations the citations use — shown under the city
   * once the court lights up. `courtBadges` in src/content/map.ts derives
   * them; they are required rather than optional so that a render site which
   * forgets them fails the type-check instead of quietly labelling nothing.
   */
  badges: string[];
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

/**
 * Hit targets, in projection units, once the scale is known.
 *
 * 24 CSS pixels is the floor, and the drawing no longer has one fixed scale to
 * meet it at: the frame follows the container's shape now, so the same r=11
 * that rendered 26.4px on a 1440px home band renders 16.8px on a 1000×650
 * window. So the radius is whatever 24px works out to — but no smaller than it
 * was, and no larger than the closest pair can bear. MH17 and eastern Ukraine
 * sit 16.9 units apart, and a circle wider than that would swallow its
 * neighbour's centre: the top one would always win, and a target you cannot
 * aim at is worse than a small one. The court seats are further apart — The
 * Hague and Brussels, the tightest, are 32 — so they can grow further.
 */
/**
 * A label's size in projection units, so it renders at `want` CSS pixels.
 *
 * The court labels were the one thing on the drawing still measured in
 * projection units, which meant their size was whatever the framing happened
 * to give them: 12.6px on the map's own page when it filled the viewport by
 * cropping, 7.6px once it stopped cropping, and 3.2px on a phone. `cap` is the
 * floor of that trade — past it the label would be larger than the country it
 * names, so it stops growing and shrinks with the drawing instead.
 */
const labelSize = (want: number, cap: number, px: number) =>
  Math.min(cap, want * (px || 1));

const hitR = (min: number, max: number, px: number) =>
  // 12.4 rather than 12: a circle asked for exactly 24px measures 23.9 once
  // the browser has rounded its box, and 24 is a floor, not a target.
  Math.min(max, Math.max(min, 12.4 * (px || 1)));

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

/** The element, and the strip of it each floating panel has spoken for. */
interface Box {
  w: number;
  h: number;
  t: number;
  r: number;
  b: number;
  l: number;
}

/** How far in the reader may zoom. Past this the projection's rounding shows. */
const MIN_W = 120;

/**
 * The viewBox that puts `content` where the reader can actually reach it.
 *
 * Two bugs came out of one assumption — that the drawing may use every pixel
 * of its box.
 *
 *   The map's own page filled the viewport with `preserveAspectRatio: slice`,
 *   which crops whatever does not fit the container's shape. On a 1000×900
 *   window that cropped the west: The Hague — the ICJ, the ICC, the PCA and
 *   the MH17 trial court — and Paris, which holds the largest award in the
 *   collection, were both outside the frame with no way to reach them.
 *
 *   And the panels that float over the drawing — the masthead, the info card,
 *   the framing buttons — sat on top of markers. The card covered four of the
 *   six sites until it moved; the masthead still covered Stockholm, which
 *   could not be clicked at any width between 900 and 1000px.
 *
 * So the frame is computed rather than declared. It always takes the
 * container's own aspect ratio, which means `meet` and `slice` agree and
 * nothing is ever cropped; and `content` is fitted into the box *minus* the
 * strips the panels have claimed, so a marker never lands under one. The
 * frame still covers the whole element — the projection is drawn far past the
 * 1200×460 window (the atlas runs -2658…3162 across), so what the panels sit
 * on is more of Europe, not a black bar.
 */
function fitView(
  content: { x: number; y: number; w: number; h: number },
  box: Box,
) {
  if (!(box.w > 0) || !(box.h > 0)) return content;
  const uw = Math.max(1, box.w - box.l - box.r);
  const uh = Math.max(1, box.h - box.t - box.b);
  const s = Math.min(uw / content.w, uh / content.h);
  return {
    w: box.w / s,
    h: box.h / s,
    x: content.x + content.w / 2 - (box.l + uw / 2) / s,
    y: content.y + content.h / 2 - (box.t + uh / 2) / s,
  };
}

/**
 * Where the reader has zoomed to, as a ratio and a centre rather than a rect.
 *
 * The frame changes shape whenever the container does, so a stored rect goes
 * stale: it was fitted to a window that no longer exists. A ratio and a centre
 * survive the change — the view is derived from whatever the frame is now.
 */
type Nav = { z: number; cx: number; cy: number } | null;

function viewFrom(nav: Nav, full: { x: number; y: number; w: number; h: number }) {
  if (!nav) return full;
  const w = Math.min(full.w, Math.max(MIN_W, full.w * nav.z));
  const h = w * (full.h / full.w);
  return clamp({ w, h, x: nav.cx - w / 2, y: nav.cy - h / 2 }, full);
}

/** A view rect, back as the ratio and centre the state holds. */
const navOf = (v: { x: number; y: number; w: number; h: number }, fullW: number): Nav => ({
  z: v.w / fullW,
  cx: v.x + v.w / 2,
  cy: v.y + v.h / 2,
});

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
    // Same trade as CaseTimeline: one extra render buys a selection that
    // survives a reload and can be shared as a link. The query string is only
    // legible in the browser — useSearchParams would pull this prerendered
    // page into client rendering to learn it a render earlier.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (site && events.some((e) => e.key === site)) setSel({ kind: "site", key: site });
    else if (court && courts.some((c) => c.key === court)) setSel({ kind: "court", key: court });
    /* eslint-enable react-hooks/set-state-in-effect */
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
  const BASE = useMemo(() => {
    const [x, y, w, h] = geo.viewBox.split(" ").map(Number);
    return { x, y, w, h };
  }, [geo.viewBox]);
  /**
   * Measured, not assumed: the element's size and the strips the floating
   * panels have claimed, which the stylesheets declare as --emap-safe-* so the
   * file that knows where a panel sits is the file that reserves room for it.
   */
  const [box, setBox] = useState<Box>({ w: 0, h: 0, t: 0, r: 0, b: 0, l: 0 });
  const FULL = useMemo(() => fitView(BASE, box), [BASE, box]);
  const CLOSE = useMemo(
    () => clamp(fitView({ x: 556, y: 234, w: 511, h: 213 }, box), FULL),
    [box, FULL],
  );
  const [nav, setNav] = useState<Nav>(null);
  const view = useMemo(() => viewFrom(nav, FULL), [nav, FULL]);
  const close = view.w <= CLOSE.w + 1;

  /** Scale about a point in viewBox units, holding that point still. */
  const zoomBy = useCallback(
    (factor: number, ax?: number, ay?: number) =>
      setNav((prev) => {
        const v = viewFrom(prev, FULL);
        const w = Math.min(FULL.w, Math.max(MIN_W, v.w * factor));
        const h = w * (FULL.h / FULL.w);
        const px = ax ?? v.x + v.w / 2;
        const py = ay ?? v.y + v.h / 2;
        return navOf(
          clamp(
            { w, h, x: px - ((px - v.x) / v.w) * w, y: py - ((py - v.y) / v.h) * h },
            FULL,
          ),
          FULL.w,
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
    const sync = () => {
      // A width of zero is not a small screen — it is a browser that has not
      // laid the page out yet (a background tab, a hidden frame, a tab
      // restored on startup). Believing it made every marker inert, and
      // because nothing resizes afterwards there was no second event to bring
      // the map back: the drawing sat there looking interactive and answered
      // no clicks at all.
      const w = window.innerWidth;
      setCoarse(w > 0 ? w <= 640 : false);
    };
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
  /** Carries the reserved strips as padding so they resolve to pixels. */
  const safeRef = useRef<HTMLSpanElement | null>(null);
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
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // The reserved strips come from the stylesheet, so a panel is declared
      // once, where it is positioned, instead of being a number in here that
      // nobody updates when the panel moves. They are read off the padding of
      // a hidden sentinel rather than from the custom properties directly:
      // getComputedStyle hands back an unregistered custom property as the
      // tokens it was written with, so `max(0px, 436px - 35.2%)` would come
      // back as that string. As padding it comes back resolved, in pixels,
      // against the figure's own width — which is what lets the reserve be a
      // function of the width instead of one number for every screen.
      const cs = getComputedStyle(safeRef.current ?? el);
      const safe = (side: string) =>
        Math.max(0, parseFloat(cs.getPropertyValue(`padding-${side}`)) || 0);
      setBox((prev) => {
        const next = {
          w: r.width,
          h: r.height,
          t: safe("top"),
          r: safe("right"),
          b: safe("bottom"),
          l: safe("left"),
        };
        return prev.w === next.w &&
          prev.h === next.h &&
          prev.t === next.t &&
          prev.r === next.r &&
          prev.b === next.b &&
          prev.l === next.l
          ? prev
          : next;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // A media query can change the reserved strips without changing the
    // element's size — the masthead stops floating below 900px — and a
    // ResizeObserver never fires for that.
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  /**
   * One number, because the frame now carries the container's own aspect
   * ratio: `meet` and `slice` resolve to the same scale, and neither crops.
   */
  const scale = box.w > 0 && view.w > 0 ? box.w / view.w : 0;
  /** One CSS pixel, in projection units. */
  const px = scale > 0 ? 1 / scale : 0;
  const labelled = scale >= LABEL_MIN_SCALE;
  /**
   * Court badges are sized in real pixels rather than projection units, like
   * the site labels and unlike the city names beside them, so the answer to a
   * click is legible at the framing the reader is actually in. They are held
   * back only where the markers themselves are: below 640px the drawing is not
   * the interface and nine cities are 3px apart.
   */
  const badged = !coarse && scale > 0;
  /** The city labels, in projection units, aiming at 11 CSS pixels. */
  const cityF = labelSize(11, 14, px);

  const at = (key: string) => geo.markers[key] ?? [0, 0];
  const selected = sel?.kind === "site" ? events.find((e) => e.key === sel.key) ?? null : null;
  const selectedCourt =
    sel?.kind === "court" ? courts.find((c) => c.key === sel.key) ?? null : null;

  /** Sites heard at the selected court — what a court selection is *for*. */
  const courtSites = useMemo(
    () => (selectedCourt ? events.filter((e) => e.courts.includes(selectedCourt.key)) : []),
    [selectedCourt, events],
  );

  /**
   * The two ends of one relation.
   *
   * A selection used to light its own marker and leave the other end alone: a
   * court's ring only warmed when the court itself was picked, so clicking a
   * site told you nothing about who is hearing it — which is the single thing
   * this drawing exists to say. `on` is what the reader picked; `rel` is the
   * far end of every line running out of it, and both are lit.
   */
  const relCourts = new Set(selected?.courts ?? []);
  const relSites = new Set(courtSites.map((e) => e.key));

  /**
   * Where a court sits. Almost always its point in europe-map.json; for a city
   * off the frame, the nearest place on the frame's edge along the bearing of
   * the real one, so the line to it runs the right way and stops at the border
   * instead of disappearing into a corner. The margin is in CSS pixels, so the
   * marker hugs the edge by the same amount however far the reader has zoomed.
   */
  const dockMargin = 26 * (px || 1);
  const courtXY: Record<string, [number, number]> = {};
  for (const c of courts) {
    if (c.offMap && c.offAt) {
      courtXY[c.key] = [
        Math.min(Math.max(c.offAt.x, view.x + dockMargin), view.x + view.w - dockMargin),
        Math.min(Math.max(c.offAt.y, view.y + dockMargin), view.y + view.h - dockMargin),
      ];
    } else {
      const [x, y] = at(c.key);
      courtXY[c.key] = [x, y];
    }
  }

  return (
    <div className="emap" data-variant={variant} data-coarse={coarse ? "yes" : "no"}>
      <div className="emap-figure">
        {/* Not drawn and not reachable: it exists so the stylesheet can state
            how much of the drawing each floating panel has taken, in any CSS
            the stylesheet likes, and have it come back as pixels. */}
        <span className="emap-safe" ref={safeRef} aria-hidden="true" />
        {/* Not a pan-and-zoom rig: two named framings, because there are only
            two questions — how far the courts are, and which site is which. */}
        <div className="emap-zoom" role="group" aria-label={labels.zoomLabel}>
          <button
            type="button"
            aria-pressed={!close}
            onClick={() => setNav(null)}
          >
            {labels.zoomWide}
          </button>
          <button
            type="button"
            aria-pressed={close}
            onClick={() => setNav(navOf(CLOSE, FULL.w))}
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
          /* The frame is built to the container's aspect ratio, so meet and
             slice are the same fit — and meet cannot crop during the one
             render before the element has been measured. */
          preserveAspectRatio="xMidYMid meet"
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
            setNav((prev) => {
              const v = viewFrom(prev, FULL);
              return navOf(clamp({ ...v, x: v.x - dx, y: v.y - dy }, FULL), FULL.w);
            });
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
              const [x2, y2] = courtXY[c] ?? at(c);
              /* A court selection lights only the lines that end at that
                 court: picking The Hague must not light Crimea's line to
                 Strasbourg just because Crimea is also heard in The Hague. */
              const on =
                sel?.kind === "site"
                  ? sel.key === e.key
                  : sel?.kind === "court"
                    ? sel.key === c
                    : false;
              return (
                <g key={`${e.key}-${c}`} data-pair={`${e.key}-${c}`}>
                  <line
                    className="emap-reach"
                    data-on={on ? "yes" : "no"}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  />
                  {/* The light itself: one short bright segment that runs the
                      length of the line, from the place where the harm
                      happened to the court weighing it, and is gone. It is
                      always drawn from the site outwards, whichever end the
                      reader picked, because that is the direction the case
                      travelled. pathLength normalises every line to 100, so a
                      run to Strasbourg and a run to Montreal take the same
                      time however far apart they are, and the dash figures
                      below are constants rather than nine measurements. */}
                  <line
                    className="emap-glint"
                    data-on={on ? "yes" : "no"}
                    pathLength={100}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  />
                </g>
              );
            }),
          )}

          </g>

          {/* Courts were decoration inside the aria-hidden group: a circle and
              a label, answering to nothing and invisible to a screen reader.
              The map's subject is the relation between a place where harm
              happened and a court weighing it, and only one end of it could be
              interrogated. Selecting a court lights every site it hears. */}
          {courts.map((c) => {
            const [x, y] = courtXY[c.key] ?? at(c.key);
            const on = sel?.kind === "court" && sel.key === c.key;
            const rel = relCourts.has(c.key);
            /* An off-map city gets a bearing as well as a place: the chevron
               and the tail point at where it really is and run off the
               picture, so a marker pinned to the border does not read as a
               city sitting in the Atlantic. */
            const off = c.offMap && c.offAt ? c.offAt : null;
            const bx = off ? off.x - x : 0;
            const by = off ? off.y - y : 0;
            const bl = Math.hypot(bx, by) || 1;
            return (
              <g
                key={c.key}
                className="emap-court"
                data-key={c.key}
                data-on={on ? "yes" : "no"}
                data-rel={rel ? "yes" : "no"}
                data-off={off ? "yes" : "no"}
              >
                {off && (
                  <>
                    <line
                      className="emap-court-tail"
                      x1={x}
                      y1={y}
                      x2={x + (bx / bl) * view.w}
                      y2={y + (by / bl) * view.w}
                    />
                    <path
                      className="emap-court-bearing"
                      d="M0,-4.5 L5,0 L0,4.5"
                      transform={`translate(${x + (bx / bl) * 13} ${y + (by / bl) * 13}) rotate(${(Math.atan2(by, bx) * 180) / Math.PI})`}
                    />
                  </>
                )}
                <circle
                  className="emap-court-hit"
                  cx={x}
                  cy={y}
                  r={hitR(13, 19, px)}
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
                <text
                  x={x + 12}
                  y={y + 0.4 * cityF + (c.labelDy ?? 0)}
                  fontSize={cityF}
                >
                  {c.city}
                </text>
                {/* The court's own name, at its city, once it is lit. Not
                    always: The Hague alone seats four institutions and the
                    names run to sixty characters, so every city named at once
                    would bury the drawing. Only the abbreviations the
                    citations use, and only while the reader is looking at
                    that relation. */}
                {(on || rel) && badged && c.badges.length > 0 && (
                  <text
                    className="emap-court-abbr"
                    aria-hidden="true"
                    x={x + 12}
                    y={y + 0.4 * cityF + (c.labelDy ?? 0) + 1.15 * cityF}
                    fontSize={labelSize(9.5, 12.5, px)}
                    strokeWidth={2.6 * px}
                  >
                    {c.badges.join(" · ")}
                  </text>
                )}
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
                data-key={e.key}
                data-on={sel?.kind === "site" && sel.key === e.key ? "yes" : "no"}
                data-rel={relSites.has(e.key) ? "yes" : "no"}
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
                  r={hitR(11, 16, px)}
                role={coarse ? undefined : "button"}
                aria-hidden={coarse || undefined}
                aria-label={coarse ? undefined : e.title}
                  aria-pressed={sel?.kind === "site" && sel.key === e.key}
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
          </ul>
        </div>

        {/* On the home band the second group renders too: without it the reader
            sees three site marks and no key to the rings the courts are drawn
            as, which are half the picture. */}
        <div className="emap-leg-group">
            <h3>{labels.legendHow}</h3>
            <ul>
            <li className="emap-key">
              <svg viewBox="0 0 22 22" aria-hidden="true">
                <circle className="k-court" cx="11" cy="11" r="5.5" />
              </svg>
              {labels.court}
            </li>
              <li className="emap-key">
                <svg viewBox="0 0 22 22" aria-hidden="true">
                  <line className="k-line" x1="1" y1="11" x2="21" y2="11" />
                </svg>
                {labels.legendLine}
              </li>
              {variant === "full" && (
                <li className="emap-key">
                  <svg viewBox="0 0 22 22" aria-hidden="true">
                    <circle className="k-lit" cx="5" cy="11" r="3" />
                    <circle className="k-lit" cx="15" cy="11" r="6" />
                  </svg>
                  {labels.sizeKey}
                </li>
              )}
            </ul>
          </div>


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

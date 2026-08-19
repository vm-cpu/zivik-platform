"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import { zoom as d3zoom, zoomIdentity, type ZoomTransform } from "d3-zoom";
import type { MapEventView, MapHubView } from "@/lib/map-model";
import { proceedings, type MapStrings } from "./strings";

type FeatureCollection = Parameters<ReturnType<typeof geoPath>>[0] & {
  features: unknown[];
};

/**
 * The window the projection is fitted to — the corners of what the map has to
 * hold: Paris in the west, Helsinki in the north, the Donbas in the east and
 * Crimea in the south. Kept tight so Ukraine reads at a useful size instead of
 * floating in empty Atlantic.
 */
const FRAME: GeoJSON.MultiPoint = {
  type: "MultiPoint",
  coordinates: [
    [1.4, 60.7],
    [39.8, 43.9],
  ],
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export interface MapCanvasHandle {
  zoomBy: (factor: number) => void;
  reset: () => void;
}

/**
 * The map surface: geography, the dotted lines from each violation to the
 * courts hearing it, and the markers.
 *
 * Geography is drawn inside a zoomable group; markers are positioned by
 * applying the same transform by hand, so a pin stays the same size on screen
 * however far the reader zooms in.
 */
export default function MapCanvas({
  events,
  hubs,
  activeHubIds,
  selected,
  onSelect,
  onZoomChange,
  t,
  registerHandle,
}: {
  events: MapEventView[];
  hubs: MapHubView[];
  /** Hubs connected to at least one visible event; the rest are dimmed. */
  activeHubIds: Set<string>;
  selected: { kind: "event" | "hub"; id: string } | null;
  onSelect: (selection: { kind: "event" | "hub"; id: string } | null) => void;
  onZoomChange?: (scale: number) => void;
  t: MapStrings;
  registerHandle?: (handle: MapCanvasHandle | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [geo, setGeo] = useState<{
    europe: FeatureCollection;
    ukraine: FeatureCollection;
  } | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);

  // Geometry is fetched rather than bundled: 41 KB that the rest of the page
  // never needs, and the map sits below the fold on the home page.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/data/europe.geo.json").then((r) => r.json()),
      fetch("/data/ukraine.geo.json").then((r) => r.json()),
    ])
      .then(([europe, ukraine]) => {
        if (!cancelled) setGeo({ europe, ukraine });
      })
      .catch(() => {
        /* leave the skeleton in place; the list beside the map still works */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Measure straight away rather than waiting on the observer: a
  // ResizeObserver's first callback is only delivered on the next frame, and a
  // page that isn't painting (background tab, offscreen pane) may not get one
  // at all — which used to leave the map as a permanent skeleton.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize((prev) => {
        const next = { width: Math.round(width), height: Math.round(height) };
        return prev.width === next.width && prev.height === next.height
          ? prev
          : next;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { width, height } = size;

  const projection = useMemo(() => {
    if (width < 40 || height < 40) return null;
    return geoMercator().fitExtent(
      [
        [26, 22],
        [width - 26, height - 22],
      ],
      FRAME,
    );
  }, [width, height]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  /** Projected screen position of a lon/lat, after the current zoom transform. */
  const place = useCallback(
    (coord: [number, number]): [number, number] | null => {
      if (!projection) return null;
      const p = projection(coord);
      if (!p) return null;
      return [transform.applyX(p[0]), transform.applyY(p[1])];
    },
    [projection, transform],
  );

  // Wheel/drag/pinch zoom. Attached imperatively because d3-zoom owns the
  // gesture state; React only mirrors the resulting transform.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !width || !height) return;
    const behaviour = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        setTransform(event.transform);
        onZoomChange?.(event.transform.k);
      });
    const selection = select(svg);
    selection.call(behaviour).on("dblclick.zoom", null);

    if (registerHandle) {
      // No d3-transition: the buttons apply the transform directly, and CSS
      // handles what little motion the map should have.
      registerHandle({
        zoomBy: (factor) => behaviour.scaleBy(selection, factor),
        reset: () => behaviour.transform(selection, zoomIdentity),
      });
    }
    return () => {
      selection.on(".zoom", null);
      registerHandle?.(null);
    };
  }, [width, height, onZoomChange, registerHandle]);

  const hubById = useMemo(
    () => new Map(hubs.map((hub) => [hub.id, hub])),
    [hubs],
  );

  const ready = Boolean(geo && path && projection);

  return (
    <div className="nsvmap-canvas" ref={wrapRef}>
      {!ready ? <div className="nsvmap-skeleton">{t.loading}</div> : null}
      <svg
        ref={svgRef}
        className="nsvmap-svg"
        viewBox={`0 0 ${width || 1} ${height || 1}`}
        role="application"
        aria-label={t.heading}
      >
        {ready && geo && path ? (
          <>
            {/* geography — one transformed group, hairlines kept hairline */}
            <g
              transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
            >
              <g className="nsvmap-land">
                {(geo.europe.features as GeoJSON.Feature[]).map((feature, i) => (
                  <path key={i} d={path(feature) ?? undefined} />
                ))}
              </g>
              {(geo.ukraine.features as GeoJSON.Feature[]).map((feature, i) => (
                <path key={i} className="nsvmap-ukr" d={path(feature) ?? undefined} />
              ))}

              {/* a dotted line per event→court pair */}
              {events.flatMap((event) =>
                event.hubIds.flatMap((hubId) => {
                  const hub = hubById.get(hubId);
                  if (!hub) return [];
                  const d = path({
                    type: "LineString",
                    coordinates: [event.coord, hub.coord],
                  } as GeoJSON.LineString);
                  const hot =
                    selected?.kind === "event"
                      ? selected.id === event.id
                      : selected?.kind === "hub" && selected.id === hubId;
                  return [
                    <path
                      key={`${event.id}-${hubId}`}
                      className={`nsvmap-link${hot ? " is-hot" : ""}`}
                      d={d ?? undefined}
                    />,
                  ];
                }),
              )}
            </g>

            {/* courts */}
            {hubs.map((hub) => {
              const at = place(hub.coord);
              if (!at) return null;
              const isActive = activeHubIds.has(hub.id);
              const isSelected = selected?.kind === "hub" && selected.id === hub.id;
              return (
                <g
                  key={hub.id}
                  className={`nsvmap-hub${isActive ? " is-active" : ""}${isSelected ? " is-selected" : ""}`}
                  transform={`translate(${at[0]},${at[1]})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${hub.city} — ${hub.caseCount} ${proceedings(hub.caseCount, t)} ${t.inLibrary}`}
                  aria-pressed={isSelected}
                  onClick={() =>
                    onSelect(isSelected ? null : { kind: "hub", id: hub.id })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(isSelected ? null : { kind: "hub", id: hub.id });
                    }
                  }}
                >
                  <title>
                    {`${hub.city} — ${hub.caseCount} ${proceedings(hub.caseCount, t)} ${t.inLibrary}`}
                  </title>
                  <rect
                    className="nsvmap-hub-mark"
                    x={-5}
                    y={-5}
                    width={10}
                    height={10}
                    transform="rotate(45)"
                  />
                  <text className="nsvmap-hub-label" x={11} y={4}>
                    {hub.city}
                  </text>
                </g>
              );
            })}

            {/* violations */}
            {[...events]
              .sort((a, b) => {
                const aOn = selected?.kind === "event" && selected.id === a.id;
                const bOn = selected?.kind === "event" && selected.id === b.id;
                return Number(aOn) - Number(bOn);
              })
              .map((event) => {
              const at = place(event.coord);
              if (!at) return null;
              const isSelected =
                selected?.kind === "event" && selected.id === event.id;
              const radius = 4.5 + event.weight * 1.9;
              const isArea = event.place.precision === "area";
              return (
                <g
                  key={event.id}
                  className={`nsvmap-event cat-${event.category}${isSelected ? " is-selected" : ""}${isArea ? " is-area" : ""}`}
                  transform={`translate(${at[0]},${at[1]})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${event.title} — ${event.cases.length} ${proceedings(event.cases.length, t)}`}
                  aria-pressed={isSelected}
                  onClick={() =>
                    onSelect(isSelected ? null : { kind: "event", id: event.id })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(isSelected ? null : { kind: "event", id: event.id });
                    }
                  }}
                >
                  <title>
                    {`${event.title} · ${event.place.label} — ${event.cases.length} ${proceedings(event.cases.length, t)}`}
                  </title>
                  {isSelected ? (
                    <circle className="nsvmap-event-ring" r={radius + 7} />
                  ) : null}
                  {isArea ? (
                    <circle className="nsvmap-event-area" r={radius + 6} />
                  ) : null}
                  <circle className="nsvmap-event-halo" r={radius + 3} />
                  <circle className="nsvmap-event-mark" r={radius} />
                  <text className="nsvmap-event-count" y={3.5}>
                    {event.cases.length}
                  </text>
                </g>
              );
            })}
          </>
        ) : null}
      </svg>
    </div>
  );
}

"use client";

import { useState } from "react";
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
}
export interface MapGeometry {
  viewBox: string;
  context: string[];
  ukraine: string;
  markers: Record<string, number[]>;
}

export default function EventsMap({
  geo,
  events,
  courts,
  labels,
  locale,
}: {
  geo: MapGeometry;
  events: MapEventR[];
  courts: MapCourtR[];
  labels: {
    alt: string;
    close: string;
    courtsSeat: string;
    categories: { hr: string; war: string; asset: string };
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
  };
  locale: string;
}) {
  const [active, setActive] = useState<string | null>(
    events.find((e) => e.open)?.key ?? null,
  );
  const at = (key: string) => geo.markers[key] ?? [0, 0];
  const selected = events.find((e) => e.key === active) ?? null;

  return (
    <div className="emap">
      <div className="emap-figure">
      <svg
        className="emap-svg"
        viewBox={geo.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={labels.alt}
      >
        {/* Base geography is decoration: the information is in the markers,
            which are listed as real text below for anyone not reading pixels. */}
        <g aria-hidden="true">
          {geo.context.map((d, i) => (
            <path key={i} className="emap-ctx" d={d} />
          ))}
          <path className="emap-ua" d={geo.ukraine} />

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
                  data-on={active === e.key ? "yes" : "no"}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
              );
            }),
          )}

          {courts.map((c) => {
            const [x, y] = at(c.key);
            return (
              <g key={c.key} className="emap-court">
                <circle cx={x} cy={y} r={5} />
                <text x={x + 12} y={y + 4}>
                  {c.city}
                </text>
              </g>
            );
          })}
        </g>

        {/* Markers are buttons: keyboard-reachable, and each one names the
            site it stands for. The old map answered only to the mouse. */}
        {events.map((e) => {
          const [x, y] = at(e.key);
          return (
            <g key={e.key} className="emap-site" data-cat={e.category}>
              <circle className="emap-halo" cx={x} cy={y} r={e.size / 2} />
              <circle
                className="emap-dot"
                cx={x}
                cy={y}
                r={6}
                role="button"
                tabIndex={0}
                aria-label={e.title}
                aria-pressed={active === e.key}
                data-on={active === e.key ? "yes" : "no"}
                onClick={() => setActive(active === e.key ? null : e.key)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setActive(active === e.key ? null : e.key);
                  }
                }}
              />
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="emap-card" data-cat={selected.category}>
          <button
            type="button"
            className="emap-close"
            aria-label={labels.close}
            onClick={() => setActive(null)}
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
      </div>

      {/*
        The same content as text. The iframe version was invisible to search
        engines and to anyone not using a pointing device; this list is the
        map's actual payload, and on a narrow screen it is the whole map.
      */}
      <ul className="emap-list">
        {events.map((e) => (
          <li key={e.key} data-cat={e.category}>
            <button
              type="button"
              onClick={() => setActive(active === e.key ? null : e.key)}
              aria-pressed={active === e.key}
            >
              <span className="emap-li-when">{e.when}</span>
              <span className="emap-li-title">{e.title}</span>
              <span className="emap-li-forums">{e.forums}</span>
              <span className="emap-li-count">{e.count}</span>
              <span
                className="emap-li-reads"
                data-empty={e.cases.length === 0 ? "" : undefined}
              >
                {e.cases.length > 0 ? `${labels.reads} · ${e.cases.length}` : labels.pending}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* The legend named the four colours and stopped there, which left the
          three things a reader has to decode unexplained: the dashed line, the
          size of a dot, and what a city on the rim is. The court seats were a
          `title` tooltip — invisible on a touch screen and to a screen reader
          — so they are written out. */}
      <div className="emap-legend">
        <div className="emap-leg-group">
          <h3>{labels.legendWhat}</h3>
          <ul>
            {(["hr", "war", "asset"] as const).map((cat) => (
              <li key={cat} className="emap-key" data-cat={cat}>
                <i />
                {labels.categories[cat]}
              </li>
            ))}
          </ul>
        </div>

        <div className="emap-leg-group">
          <h3>{labels.legendHow}</h3>
          <ul>
            <li className="emap-key emap-key-court">
              <i />
              {labels.court}
            </li>
            <li className="emap-key emap-key-line">
              <i />
              {labels.legendLine}
            </li>
            <li className="emap-key emap-key-size">
              <i>
                <b />
                <b />
              </i>
              {labels.sizeKey}
            </li>
          </ul>
        </div>

        <div className="emap-leg-group emap-leg-seats">
          <h3>{labels.courtsSeat}</h3>
          <ul>
            {courts.map((c) => (
              <li key={c.key}>
                <span className="emap-seat-city">{c.city}</span>
                <span className="emap-seat-list">{c.seats}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

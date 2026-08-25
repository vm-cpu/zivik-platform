"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
    /** Heading over the sites a selected court hears. */
    courtHears: string;
  };
  locale: string;
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
  /** Categories currently shown. Empty set is not reachable — see toggle(). */
  const [shown, setShown] = useState<Set<EventCategory>>(
    () => new Set(["hr", "war", "asset"] as const),
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

  /** Last category standing stays on: an empty map is a dead end, not a filter. */
  const toggleCategory = (cat: EventCategory) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev;
        next.delete(cat);
      } else next.add(cat);
      return next;
    });

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
  const isHidden = (e: MapEventR) => !shown.has(e.category);

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
                    /* A court selection lights only the lines that end at
                       that court: picking The Hague must not light Crimea's
                       line to Strasbourg just because Crimea is also heard in
                       The Hague. */
                    data-on={
                      !isHidden(e) &&
                      (sel?.kind === "site"
                        ? sel.key === e.key
                        : sel?.kind === "court"
                          ? sel.key === c
                          : false)
                        ? "yes"
                        : "no"
                    }
                    data-off={isHidden(e) ? "" : undefined}
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
          {courts.map((c) => {
            const [x, y] = at(c.key);
            const on = sel?.kind === "court" && sel.key === c.key;
            return (
              <g key={c.key} className="emap-court" data-on={on ? "yes" : "no"}>
                <circle
                  className="emap-court-hit"
                  cx={x}
                  cy={y}
                  r={13}
                  role="button"
                  tabIndex={0}
                  aria-label={c.city}
                  aria-pressed={on}
                  onClick={() => toggleCourt(c.key)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      toggleCourt(c.key);
                    }
                  }}
                />
                <circle className="emap-court-dot" cx={x} cy={y} r={5} />
                <text x={x + 12} y={y + 4}>
                  {c.city}
                </text>
              </g>
            );
          })}

        {/* Markers are buttons: keyboard-reachable, and each one names the
            site it stands for. The old map answered only to the mouse. */}
        {events.map((e) => {
          const [x, y] = at(e.key);
          return (
              <g
                key={e.key}
                className="emap-site"
                data-cat={e.category}
                data-on={isLit(e) ? "yes" : "no"}
                data-off={isHidden(e) ? "" : undefined}
              >
              <circle className="emap-halo" cx={x} cy={y} r={e.size / 2} />
              <circle
                className="emap-dot"
                cx={x}
                cy={y}
                r={6}
                role="button"
                aria-label={e.title}
                  aria-pressed={sel?.kind === "site" && sel.key === e.key}
                  data-on={isLit(e) ? "yes" : "no"}
                  tabIndex={isHidden(e) ? -1 : 0}
                  onClick={() => !isHidden(e) && toggleSite(e.key)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      if (!isHidden(e)) toggleSite(e.key);
                    }
                  }}
              />
            </g>
          );
        })}
      </svg>

      {/* Clicking a dot changes a panel that can be 800px away. Without a
          live region a screen-reader user hears nothing at all. */}
      <div className="emap-live" aria-live="polite" aria-atomic="true">
      {selected && (
        <div className="emap-card" data-cat={selected.category}>
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
          <div className="emap-when">{labels.courtsSeat}</div>
          <div className="emap-title">{selectedCourt.city}</div>
          <p className="emap-seats-full">{selectedCourt.seats}</p>
          <div className="emap-reads">
            <div className="emap-reads-h">{labels.courtHears}</div>
            <ul>
              {courtSites.map((e) => (
                <li key={e.key}>
                  <button
                    type="button"
                    className="emap-court-site"
                    data-cat={e.category}
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
      <ul className="emap-list">
        {events.map((e) => (
          <li key={e.key} data-cat={e.category}>
            <button
              type="button"
              onClick={() => toggleSite(e.key)}
              aria-pressed={sel?.kind === "site" && sel.key === e.key}
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
            {/* The legend named the categories; now it filters by them. The
                last one standing cannot be switched off — an empty map is a
                dead end, not a filter. */}
            {(["hr", "war", "asset"] as const).map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className="emap-key emap-key-btn"
                  data-cat={cat}
                  aria-pressed={shown.has(cat)}
                  onClick={() => toggleCategory(cat)}
                >
                  <i />
                  {labels.categories[cat]}
                </button>
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

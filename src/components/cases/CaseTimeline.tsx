"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * The case history as an instrument: a year rail, a filter per track, and rows
 * that open for detail.
 *
 * Props arrive locale-resolved: this is a client component, and its props are
 * serialized into the page payload — passing the raw {uk, en} pairs shipped
 * both languages to every reader and leaked the other locale into the HTML.
 * The server template picks the strings; this component just renders them.
 */
export interface TimelineEventR {
  date: string;
  label: string;
  note?: string;
  kind?: string;
  track?: string;
  /** Sort key, ISO 8601 — the visible `date` may be a range or a month. */
  iso?: string;
}
export interface TimelineTrackR {
  id: string;
  label: string;
}

export default function CaseTimeline({
  events,
  tracks = [],
  labels,
}: {
  events: TimelineEventR[];
  tracks?: TimelineTrackR[];
  labels: { all: string; openDetail: string };
}) {
  const [active, setActive] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  // The chosen filter lives in the hash (#chronology:warrants), so a filtered
  // view survives reload and can be shared as a link.
  useEffect(() => {
    const m = window.location.hash.match(/^#chronology:(\w[\w-]*)$/);
    if (m && tracks.some((t) => t.id === m[1])) setActive(m[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pickTrack = (id: string) => {
    setActive(id);
    const hash = id === "all" ? "#chronology" : `#chronology:${id}`;
    window.history.replaceState(null, "", hash);
  };

  const shown = useMemo(
    () =>
      events
        .filter((e) => active === "all" || !e.track || e.track === active)
        // The rail places its dots from `iso`, but the list printed the array
        // in authoring order — so oschadbank showed 24 July 2025 above 1 July,
        // a chronology out of chronological order. Sorting here fixes it for
        // every page and cannot be undone by the next person to append an
        // event. Entries without `iso` keep their authored position relative
        // to each other and sort last, since they carry no date to place.
        .map((e, i) => ({ e, i }))
        .sort((a, b) =>
          a.e.iso && b.e.iso
            ? a.e.iso.localeCompare(b.e.iso) || a.i - b.i
            : a.e.iso
              ? -1
              : b.e.iso
                ? 1
                : a.i - b.i,
        )
        .map(({ e }) => e),
    [events, active],
  );

  // Year rail: place a dot per event on a linear time axis.
  const years = events
    .map((e) => (e.iso ? Number(e.iso.slice(0, 4)) : null))
    .filter((y): y is number => y !== null);
  const min = years.length ? Math.min(...years) : 0;
  const max = years.length ? Math.max(...years) : 0;
  const span = Math.max(1, max - min);
  const ticks = years.length
    ? Array.from({ length: Math.floor((max - min) / 5) + 1 }, (_, i) => min + i * 5).filter(
        (y) => y > min,
      )
    : [];

  const trackLabel = (id?: string) => (id ? tracks.find((t) => t.id === id)?.label : undefined);

  return (
    // data-tracks drives the row grid: with no tracks at all there is no
    // track column to reserve, and the event text takes the width the track
    // column would have had. See .ctl-row in 40-instruments.css.
    <div className="ctl" data-tracks={tracks.length > 0 ? "yes" : "no"}>
      {tracks.length > 0 && (
        <div className="ctl-filters" role="tablist" aria-label={labels.all}>
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            data-on={active === "all" ? "yes" : "no"}
            onClick={() => pickTrack("all")}
          >
            {labels.all}
          </button>
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              data-on={active === t.id ? "yes" : "no"}
              data-track={t.id}
              onClick={() => pickTrack(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {years.length > 1 && (
        <div className="ctl-rail" aria-hidden="true">
          <div className="ctl-rail-line" />
          {events.map((e, i) => {
            if (!e.iso) return null;
            const y = Number(e.iso.slice(0, 4));
            const dim = active !== "all" && e.track && e.track !== active;
            return (
              <i
                key={i}
                className="ctl-dot"
                data-track={e.track}
                data-dim={dim ? "yes" : "no"}
                style={{ left: `${((y - min) / span) * 100}%` }}
              />
            );
          })}
          {ticks.map((y) => (
            <span key={y} className="ctl-tick" style={{ left: `${((y - min) / span) * 100}%` }}>
              {y}
            </span>
          ))}
        </div>
      )}

      <ul className="ctl-list">
        {shown.map((e) => {
          const idx = events.indexOf(e);
          const isOpen = open === idx;
          const label = trackLabel(e.track);
          return (
            <li key={idx} data-kind={e.kind} data-track={e.track}>
              {e.note ? (
                <button
                  type="button"
                  className="ctl-row"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : idx)}
                  title={labels.openDetail}
                >
                  <span className="ctl-date">{e.date}</span>
                  {label && <span className="ctl-track">{label}</span>}
                  <span className="ctl-label">{e.label}</span>
                  <span className="ctl-more" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              ) : (
                <div className="ctl-row ctl-row-static">
                  <span className="ctl-date">{e.date}</span>
                  {label && <span className="ctl-track">{label}</span>}
                  <span className="ctl-label">{e.label}</span>
                </div>
              )}
              {e.note && isOpen && <p className="ctl-note">{e.note}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

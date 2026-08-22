"use client";

import { useMemo, useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { TimelineEvent, TimelineTrack } from "@/content/summaries/types";

/**
 * The case history as an instrument: a year rail, a filter per track, and rows
 * that open for detail.
 *
 * A dispute like this one runs on four clocks at once — the facts, the
 * arbitration, the set-aside litigation at the seat, and enforcement — and a
 * flat list hides that. Filtering by track lets a reader follow one clock;
 * "all" shows how they interleave. Events without a `track` (or a summary with
 * no `tracks` at all) always show, so the plain timeline still works.
 */
export default function CaseTimeline({
  events,
  tracks = [],
  locale,
  labels,
}: {
  events: TimelineEvent[];
  tracks?: TimelineTrack[];
  locale: Locale;
  labels: { all: string; openDetail: string };
}) {
  const [active, setActive] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(
    () => events.filter((e) => active === "all" || !e.track || e.track === active),
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

  const trackLabel = (id?: string) =>
    id ? (tracks.find((t) => t.id === id)?.label ?? null) : null;

  return (
    <div className="ctl">
      {tracks.length > 0 && (
        <div className="ctl-filters" role="tablist" aria-label={labels.all}>
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            data-on={active === "all" ? "yes" : "no"}
            onClick={() => setActive("all")}
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
              onClick={() => setActive(t.id)}
            >
              {pick(t.label, locale)}
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
            <span
              key={y}
              className="ctl-tick"
              style={{ left: `${((y - min) / span) * 100}%` }}
            >
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
                  <span className="ctl-date">{pick(e.date, locale)}</span>
                  {label && <span className="ctl-track">{pick(label, locale)}</span>}
                  <span className="ctl-label">{pick(e.label, locale)}</span>
                  <span className="ctl-more" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              ) : (
                <div className="ctl-row ctl-row-static">
                  <span className="ctl-date">{pick(e.date, locale)}</span>
                  {label && <span className="ctl-track">{pick(label, locale)}</span>}
                  <span className="ctl-label">{pick(e.label, locale)}</span>
                </div>
              )}
              {e.note && isOpen && <p className="ctl-note">{pick(e.note, locale)}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

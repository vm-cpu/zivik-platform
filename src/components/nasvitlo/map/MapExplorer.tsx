"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MapEventCategory } from "@/content/types";
import type { MapEventView, MapHubView, MapModel } from "@/lib/map-model";
import MapCanvas, { type MapCanvasHandle } from "./MapCanvas";
import { fill, proceedings, type MapStrings } from "./strings";
import "./map-explorer.css";

const CATEGORIES: MapEventCategory[] = ["hr", "war", "asset"];

type Selection = { kind: "event" | "hub"; id: string } | null;

/**
 * The events map with everything a reader can do to it: filter by kind of
 * violation, by court, or down to what we have already written up; select a
 * violation to see the proceedings it produced; select a courthouse to see what
 * it hears. Every proceeding shown is a link into the library or to the court's
 * own text.
 *
 * `variant="teaser"` is the home-page cut: map, legend and a compact card. The
 * full page adds the filter bar, the list beside the map and URL state.
 */
export default function MapExplorer({
  model,
  t,
  registryHref,
  fullMapHref,
  variant = "full",
}: {
  model: MapModel;
  t: MapStrings;
  registryHref: string;
  /** Teaser only: where "full map →" goes. */
  fullMapHref?: string;
  variant?: "teaser" | "full";
}) {
  const full = variant === "full";

  const [categories, setCategories] = useState<Set<MapEventCategory>>(
    () => new Set(CATEGORIES),
  );
  const [forumId, setForumId] = useState<string | null>(null);
  const [onlyAnalysed, setOnlyAnalysed] = useState(false);
  const [selected, setSelected] = useState<Selection>(() => {
    const featured = model.events.find((e) => e.featured);
    return featured ? { kind: "event", id: featured.id } : null;
  });
  /** Guards the URL sync below until the incoming `?event=` has been applied. */
  const linkApplied = useRef(false);
  const canvasRef = useRef<MapCanvasHandle | null>(null);
  const registerHandle = useCallback((handle: MapCanvasHandle | null) => {
    canvasRef.current = handle;
  }, []);

  const visibleEvents = useMemo(
    () =>
      model.events.filter(
        (event) =>
          categories.has(event.category) &&
          (forumId === null || event.hubIds.includes(forumId)) &&
          (!onlyAnalysed || event.litCount > 0),
      ),
    [model.events, categories, forumId, onlyAnalysed],
  );

  const activeHubIds = useMemo(
    () => new Set(visibleEvents.flatMap((event) => event.hubIds)),
    [visibleEvents],
  );

  // A courthouse with no pinned violation would be a dead-end filter — its
  // cases are still reachable by clicking the marker itself.
  const filterableHubs = useMemo(() => {
    const withEvents = new Set(model.events.flatMap((event) => event.hubIds));
    return model.hubs.filter((hub) => withEvents.has(hub.id));
  }, [model.events, model.hubs]);

  // A selection that the filters just hid would leave the panel describing
  // something invisible, so drop it.
  useEffect(() => {
    if (
      selected?.kind === "event" &&
      !visibleEvents.some((event) => event.id === selected.id)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing a selection the filters just hid
      setSelected(null);
    }
  }, [selected, visibleEvents]);

  // A shared link like /uk/map?event=mh17 opens on that violation. The query
  // string is deliberately read after mount, not during render: the page is
  // prerendered without it, so applying it any earlier would either make the
  // route dynamic or break hydration.
  useEffect(() => {
    if (!full) {
      linkApplied.current = true;
      return;
    }
    const wanted = new URLSearchParams(window.location.search).get("event");
    if (wanted && model.events.some((e) => e.id === wanted)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL state, see above
      setSelected({ kind: "event", id: wanted });
    }
    linkApplied.current = true;
  }, [full, model.events]);

  // Keep the selected violation in the URL so a view can be linked to.
  useEffect(() => {
    if (!full || !linkApplied.current) return;
    const url = new URL(window.location.href);
    if (selected?.kind === "event") url.searchParams.set("event", selected.id);
    else url.searchParams.delete("event");
    window.history.replaceState(null, "", url);
  }, [selected, full]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedEvent =
    selected?.kind === "event"
      ? (model.events.find((e) => e.id === selected.id) ?? null)
      : null;
  const selectedHub =
    selected?.kind === "hub"
      ? (model.hubs.find((h) => h.id === selected.id) ?? null)
      : null;

  const toggleCategory = (category: MapEventCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      // Never let the reader filter everything away to an empty map.
      if (next.has(category) && next.size > 1) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const filtersTouched =
    categories.size !== CATEGORIES.length || forumId !== null || onlyAnalysed;

  const resetFilters = () => {
    setCategories(new Set(CATEGORIES));
    setForumId(null);
    setOnlyAnalysed(false);
  };

  return (
    <div className={`nsvmap${full ? " is-full" : " is-teaser"}`}>
      {full ? (
        <div className="nsvmap-toolbar">
          <div className="nsvmap-chips" role="group" aria-label={t.filterCategory}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`nsvmap-chip cat-${category}`}
                aria-pressed={categories.has(category)}
                onClick={() => toggleCategory(category)}
              >
                <i />
                {t.categories[category]}
              </button>
            ))}
          </div>

          <label className="nsvmap-select">
            <span>{t.filterForum}</span>
            <select
              value={forumId ?? ""}
              onChange={(e) => setForumId(e.target.value || null)}
            >
              <option value="">{t.allForums}</option>
              {filterableHubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.city}
                </option>
              ))}
            </select>
          </label>

          <label className="nsvmap-switch">
            <input
              type="checkbox"
              checked={onlyAnalysed}
              onChange={(e) => setOnlyAnalysed(e.target.checked)}
            />
            <i />
            <span>{t.onlyAnalysed}</span>
          </label>

          <span className="nsvmap-count" aria-live="polite">
            {fill(t.counter, {
              shown: visibleEvents.length,
              total: model.events.length,
            })}
          </span>

          {filtersTouched ? (
            <button type="button" className="nsvmap-reset" onClick={resetFilters}>
              {t.reset}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="nsvmap-stage">
        <div className="nsvmap-mapcol">
          <MapCanvas
            events={visibleEvents}
            hubs={model.hubs}
            activeHubIds={activeHubIds}
            selected={selected}
            onSelect={setSelected}
            t={t}
            registerHandle={registerHandle}
          />

          <div className="nsvmap-controls">
            <button
              type="button"
              onClick={() => canvasRef.current?.zoomBy(1.5)}
              aria-label={t.zoomIn}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => canvasRef.current?.zoomBy(1 / 1.5)}
              aria-label={t.zoomOut}
            >
              −
            </button>
            <button
              type="button"
              className="wide"
              onClick={() => canvasRef.current?.reset()}
            >
              {t.zoomReset}
            </button>
          </div>

          <div className="nsvmap-legend">
            {CATEGORIES.map((category) => (
              <span key={category} className={`nsvmap-key cat-${category}`}>
                <i className="dot" />
                {t.categories[category]}
              </span>
            ))}
            <span className="nsvmap-key is-court">
              <i className="dia" />
              {t.legendCourt}
            </span>
          </div>
        </div>

        <aside className="nsvmap-side">
          {selectedEvent ? (
            <EventPanel
              event={selectedEvent}
              hubs={model.hubs}
              t={t}
              registryHref={registryHref}
              onClose={() => setSelected(null)}
              showBack={full}
              maxCases={full ? undefined : 4}
              moreHref={
                fullMapHref ? `${fullMapHref}?event=${selectedEvent.id}` : undefined
              }
            />
          ) : selectedHub ? (
            <HubPanel
              hub={selectedHub}
              t={t}
              onClose={() => setSelected(null)}
              showBack={full}
            />
          ) : full ? (
            <div className="nsvmap-list-wrap">
              <div className="nsvmap-list-head">{t.listTitle}</div>
              {visibleEvents.length === 0 ? (
                <p className="nsvmap-empty">{t.empty}</p>
              ) : (
                <ul className="nsvmap-list">
                  {visibleEvents.map((event) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        className={`nsvmap-listitem cat-${event.category}`}
                        onClick={() => setSelected({ kind: "event", id: event.id })}
                      >
                        <span className="ey">{event.eyebrow}</span>
                        <span className="ti">{event.title}</span>
                        <span className="me">
                          {event.cases.length} {proceedings(event.cases.length, t)}
                          {event.litCount > 0 ? (
                            <b>
                              {" · "}
                              {event.litCount} {t.litBadge}
                            </b>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="nsvmap-note">
                {fill(t.unmapped, { n: model.unmappedCount })}
              </p>
              <Link className="nsvmap-alllink" href={registryHref}>
                {t.inRegistry}
              </Link>
            </div>
          ) : (
            <p className="nsvmap-hint">{t.hint}</p>
          )}
        </aside>
      </div>

      {!full && fullMapHref ? (
        <Link className="nsvmap-fulllink" href={fullMapHref}>
          {t.fullMap}
        </Link>
      ) : null}
    </div>
  );
}

/** A violation: what happened, and every proceeding assessing it. */
function EventPanel({
  event,
  hubs,
  t,
  registryHref,
  onClose,
  showBack,
  maxCases,
  moreHref,
}: {
  event: MapEventView;
  hubs: MapHubView[];
  t: MapStrings;
  registryHref: string;
  onClose: () => void;
  showBack: boolean;
  /** Teaser only: how many proceedings to show before linking to the full map. */
  maxCases?: number;
  moreHref?: string;
}) {
  const cityNames = event.hubIds.flatMap((id) => {
    const hub = hubs.find((h) => h.id === id);
    return hub ? [hub.city] : [];
  });
  const shown =
    maxCases === undefined ? event.cases : event.cases.slice(0, maxCases);
  const hidden = event.cases.length - shown.length;

  return (
    <div className={`nsvmap-panel cat-${event.category}`}>
      <div className="nsvmap-panel-head">
        <span className="ey">{event.eyebrow}</span>
        <button type="button" className="cls" onClick={onClose}>
          {showBack ? `← ${t.listTitle}` : t.close}
        </button>
      </div>
      <h3>{event.title}</h3>
      <p className="nsvmap-panel-note">{event.note}</p>

      <div className="nsvmap-forums">
        {cityNames.join(" · ")}
        {event.offMapForums.length > 0 ? (
          <span className="off">
            {" · "}
            {t.offMap}: {event.offMapForums.join(", ")}
          </span>
        ) : null}
      </div>

      <div className="nsvmap-place">
        <span className="k">{t.placeHead}</span>
        <span className="v">
          {event.place.label}
          {event.place.precision === "area" ? (
            <em> · {t.placeArea}</em>
          ) : null}
        </span>
        {event.place.sourceLabel ? (
          <span className="src">
            {t.placeBasis}:{" "}
            {event.place.sourceHref ? (
              event.place.sourceHref.startsWith("/") ? (
                <Link href={event.place.sourceHref}>{event.place.sourceLabel}</Link>
              ) : (
                <a
                  href={event.place.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {event.place.sourceLabel}
                </a>
              )
            ) : (
              event.place.sourceLabel
            )}
          </span>
        ) : null}
      </div>

      <div className="nsvmap-cases-head">
        {t.proceedings} · {event.cases.length}
      </div>
      <ul className="nsvmap-cases">
        {shown.map((c) => (
          <li key={c.id} className={c.lit ? "is-lit" : undefined}>
            <div className="row">
              <span className="court">{c.courtAbbr}</span>
              <span className={`chip st-${c.statusKey}`}>{c.status}</span>
              {c.year ? <span className="year">{c.year}</span> : null}
            </div>
            <div className="name" title={c.name}>
              {c.name}
            </div>
            <div className="links">
              {c.summaryHref ? (
                <Link className="primary" href={c.summaryHref}>
                  {t.summaryLink} →
                </Link>
              ) : null}
              {c.decisionUrl ? (
                <a
                  href={c.decisionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.decisionLink} ↗
                </a>
              ) : !c.summaryHref ? (
                <span className="muted">{t.noDocument}</span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {hidden > 0 && moreHref ? (
        <Link className="nsvmap-alllink" href={moreHref}>
          {`+ ${hidden} ${proceedings(hidden, t)} →`}
        </Link>
      ) : (
        <Link className="nsvmap-alllink" href={registryHref}>
          {t.inRegistry}
        </Link>
      )}
    </div>
  );
}

/** A courthouse: which courts sit here and how much of the library they hold. */
function HubPanel({
  hub,
  t,
  onClose,
  showBack,
}: {
  hub: MapHubView;
  t: MapStrings;
  onClose: () => void;
  showBack: boolean;
}) {
  return (
    <div className="nsvmap-panel is-hub">
      <div className="nsvmap-panel-head">
        <span className="ey">{t.seatsTitle}</span>
        <button type="button" className="cls" onClick={onClose}>
          {showBack ? `← ${t.listTitle}` : t.close}
        </button>
      </div>
      <h3>{hub.city}</h3>
      <ul className="nsvmap-seats">
        {hub.seats.map((seat) => (
          <li key={seat.id}>
            <b>{seat.abbr}</b>
            <span>{seat.name}</span>
          </li>
        ))}
      </ul>
      <div className="nsvmap-hubcount">
        <b>{hub.caseCount}</b> {proceedings(hub.caseCount, t)} {t.inLibrary}
      </div>
      <Link className="nsvmap-alllink" href={hub.registryHref}>
        {t.hubRegistry}
      </Link>
    </div>
  );
}

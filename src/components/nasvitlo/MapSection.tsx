import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MAP_EVENTS, MAP_COURTS } from "@/content/map";
import { caseLinksFor } from "@/content/map-links";
import Link from "next/link";
import geo from "@/content/europe-map.json";
import EventsMap from "./EventsMap";

/**
 * Events map band. Geometry is projected at build time and rendered as plain
 * SVG by <EventsMap>; strings are resolved here, on the server, so the client
 * component never receives both languages.
 */
export default function MapSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div
      id="map"
      className="nsv-mapband"
      style={{
        position: "relative",
        zIndex: 3,
        /* No side padding: the drawing runs edge to edge and only the heading
           is inset. The measure cap in home.css skips this band. */
        padding: "10px 0 40px",
        background: "var(--paper)",
        scrollMarginTop: 16,
      }}
    >
      <div
        className="nsv-sechead"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 18,
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.mapSection.label}</span>
          </div>
          <h2 style={{ fontSize: 27, margin: "0 0 8px" }}>
            {dict.mapSection.heading}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "var(--ink2)",
              margin: 0,
              maxWidth: 520,
            }}
          >
            {dict.mapSection.description}
          </p>
        </div>
        <Link href={`/${locale}/map`} className="nsv-map-full">
          {dict.mapSection.fullMap}
        </Link>
      </div>
      <div className="nsv-map">
        <EventsMap
          geo={geo}
          events={MAP_EVENTS.map((e) => ({
            key: e.key,
            category: e.category,
            size: e.size,
            when: pick(e.when, locale),
            title: pick(e.title, locale),
            note: pick(e.note, locale),
            courts: e.courts,
            forums: pick(e.forums, locale),
            count: pick(e.count, locale),
            open: e.open,
            cases: caseLinksFor(e.key, locale),
          }))}
          courts={MAP_COURTS.map((c) => ({
            key: c.key,
            city: pick(c.city, locale),
            seats: c.seats
              .map((s) => (s.abbr ? `${s.abbr} — ${pick(s.name, locale)}` : pick(s.name, locale)))
              .join(" · "),
          }))}
          labels={{
            alt: dict.mapSection.heading,
            close: dict.mapSection.close,
            courtsSeat: dict.mapSection.courtsSeat,
            court: dict.mapSection.legendCourt,
            legendLit: dict.mapSection.legendLit,
            legendUnlit: dict.mapSection.legendUnlit,
            reads: dict.mapSection.reads,
            pending: dict.mapSection.pending,
            sizeKey: dict.mapSection.sizeKey,
            legendWhat: dict.mapSection.legendWhat,
            legendHow: dict.mapSection.legendHow,
            legendLine: dict.mapSection.legendLine,
            courtHears: dict.mapSection.courtHears,
            zoomLabel: dict.mapSection.zoomLabel,
            zoomWide: dict.mapSection.zoomWide,
            zoomClose: dict.mapSection.zoomClose,
            zoomIn: dict.mapSection.zoomIn,
            zoomOut: dict.mapSection.zoomOut,
          }}
          locale={locale}
          variant="band"
        />
      </div>
    </div>
  );
}

import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  MAP_EVENTS,
  MAP_COURTS,
  courtMarks,
  markerSize,
  MAP_COURT_NO_SITES,
  seatsLine,
} from "@/content/map";
import { caseLinksFor, courtCaseloadFor } from "@/content/map-links";
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

/**
 * The registry's stage key as the word the registry uses for it.
 *
 * Resolved here rather than in `map-links.ts`: the labels live in the
 * dictionary and this is the surface that already has one. A key the
 * dictionary does not carry is dropped rather than printed raw.
 */
const stageWord = (k: string | undefined) =>
  k && k in dict.registry.stage
    ? (dict.registry.stage as Record<string, string>)[k]
    : undefined;

  return (
    <div
      id="map"
      className="nsv-mapband"
      style={{
        position: "relative",
        zIndex: 3,
        /* No side padding: the drawing runs edge to edge and only the heading
           is inset. The measure cap in home.css skips this band.

           No bottom padding either: those 40px were empty ground between the
           map and the quote below it, and because both bands are near-black
           (measured 1.007:1 apart) the space read as one continuous void
           rather than as two sections meeting. The quote band now opens with
           a lit seam instead. */
        /* No padding at all above 900px: the heading becomes a panel floating
           over the drawing (see home.css), so the map starts at the band's
           top edge the way it does on the map's own page. */
        padding: 0,
        /* The band is the map. A paper heading over a black drawing read as
             two things stacked; now the whole section is one dark object and
             the heading sits inside it. */
          background: "var(--brand-night)",
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
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.mapSection.label}</span>
          </div>
          <h2 style={{ margin: "0 0 8px" }}>
            {dict.mapSection.heading}
          </h2>
          <p
            /* No colour here: the band is dark, and an inline colour beats
               the stylesheet that knows that. home.css sets the whole heading
               for the dark ground. */
            style={{
              fontSize: "var(--t-sm)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 520,
            }}
          >
            {dict.mapSection.description}
          </p>
          {/* What the drawing carries. It is a second, quieter line rather
              than a clause on the one above: the sentence above says what the
              marks mean, this one says which cases are on the map at all, and
              a reader who wants only one of those answers should not have to
              read past the other. */}
          <p className="nsv-mapscope">{dict.mapSection.scope}</p>
        </div>
        <Link href={`/${locale}/map`} className="nsv-map-full">
          {dict.mapSection.fullMap}
        </Link>
      </div>
      <div className="nsv-map">
        <EventsMap
          /* The far ring is not in this object at all any more — it is a file
             the component asks for the first time a reader asks for the
             Atlantic framing. That is what lets the band offer the framing:
             the geometry used to be withheld here to keep 17.5 kB gzipped of
             North America off the home page, and withholding it withheld the
             framing with it. */
          geo={geo}
          events={MAP_EVENTS.map((e) => ({
            key: e.key,
            size: markerSize(e.weight),
            total: e.weight,
            when: pick(e.when, locale),
            title: pick(e.title, locale),
            note: pick(e.note, locale),
            area: e.area,
            courts: e.courts,
            forums: pick(e.forums, locale),
            count: pick(e.count, locale),
            linksOutsideCount: e.linksOutsideCount,
            cases: caseLinksFor(e.key, locale).map((c) => ({
              ...c,
              stage: stageWord(c.stage),
            })),
          }))}
          courts={MAP_COURTS.map((c) => ({
            key: c.key,
            city: pick(c.city, locale),
            offMap: c.offMap,
            labelDy: c.labelDy,
            caseload: (() => {
              const cl = courtCaseloadFor(c.key, locale);
              return {
                ...cl,
                written: cl.written.map((w) => ({ ...w, stage: stageWord(w.stage) })),
                listed: cl.listed.map((l) => ({ ...l, stage: stageWord(l.stage) })),
              };
            })(),
            seats: seatsLine(c, locale),
            ...courtMarks(c, locale),
          }))}
          labels={{
            alt: dict.mapSection.heading,
            close: dict.mapSection.close,
            moveCard: dict.mapSection.moveCard,
            courtsSeat: dict.mapSection.courtsSeat,
            court: dict.mapSection.legendCourt,
            legendLit: dict.mapSection.legendLit,
            legendUnlit: dict.mapSection.legendUnlit,
            reads: dict.mapSection.reads,
            writtenOf: dict.mapSection.writtenOf,
            writtenBehind: dict.mapSection.writtenBehind,
            allInRegistry: dict.mapSection.allInRegistry,
            pending: dict.mapSection.pending,
            amountLabel: dict.mapSection.amountLabel,
            legendTitle: dict.mapSection.legendTitle,
            placesTitle: dict.mapSection.placesTitle,
            legendWhat: dict.mapSection.legendWhat,
            legendHow: dict.mapSection.legendHow,
            legendLine: dict.mapSection.legendLine,
            legendOffMap: dict.mapSection.legendOffMap,
            legendRegions: dict.mapSection.legendRegions,
            legendArea: dict.mapSection.legendArea,
            legendPick: dict.mapSection.legendPick,
            courtHears: dict.mapSection.courtHears,
            inLibrary: dict.mapSection.inLibrary,
            courtNoSites: {
              one: pick(MAP_COURT_NO_SITES.one, locale),
              many: pick(MAP_COURT_NO_SITES.many, locale),
            },
            caseload: dict.mapSection.caseload,
            caseloadWord: dict.mapSection.caseloadWord,
            zoomLabel: dict.mapSection.zoomLabel,
            zoomWide: dict.mapSection.zoomWide,
            zoomClose: dict.mapSection.zoomClose,
            zoomAtlantic: dict.mapSection.zoomAtlantic,
            zoomReset: dict.mapSection.zoomReset,
            zoomIn: dict.mapSection.zoomIn,
            zoomOut: dict.mapSection.zoomOut,
            wheelHint: dict.mapSection.wheelHint,
            overview: dict.mapSection.overview,
            openFull: dict.mapSection.openFull,
            closeFull: dict.mapSection.closeFull,
          }}
          locale={locale}
          variant="band"
        />
      </div>
    </div>
  );
}

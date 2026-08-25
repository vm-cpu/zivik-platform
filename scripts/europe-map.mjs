/**
 * Regenerate the events map geometry.
 *
 * Outputs src/content/europe-map.json: country outlines already projected to
 * SVG path strings, plus one projected point per marker. Run from the repo
 * root when the frame, the size or the marker list changes:
 *
 *     node scripts/europe-map.mjs
 *
 * Why pre-project instead of doing it in the browser, as the old
 * public/nasvitlo/map-dark.html did:
 *
 *   - That page pulled d3 and topojson-client from unpkg and the country
 *     geometry from jsdelivr — three third-party requests on every homepage
 *     view, three parties learning every reader's IP, and three ways for the
 *     map to simply not appear on a network that blocks a CDN.
 *   - Its projection was fitted to the live container size, so the geometry
 *     could not be computed ahead of time. A fixed viewBox plus SVG's own
 *     scaling gives the same responsive result with none of the JavaScript.
 *   - Text inside an <iframe> is invisible to search engines and could not be
 *     translated, so the English homepage embedded a Ukrainian map.
 *
 * The output is committed, like scripts/og-cards.py's cards: the build stays
 * offline and deterministic.
 */
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/content/europe-map.json");

/** Fixed drawing surface. The SVG scales to its container through viewBox. */
const W = 1200;
const H = 460;

/**
 * The corners the projection must contain — the same seven points the old map
 * used, so the framing readers know does not shift: the North Sea, southern
 * Sweden, the Alps, the Volga bend, Poland, the Black Sea and the Donbas.
 */
const FRAME = {
  type: "MultiPoint",
  coordinates: [
    [3, 51.5],
    [19, 59.6],
    [8, 48],
    [40, 49],
    [22, 52],
    [33, 44.5],
    [38.6, 48],
  ],
};

/** Every point the map draws, as [longitude, latitude]. */
const POINTS = {
  // seats of the courts
  hague: [4.3, 52.08],
  strasbourg: [7.75, 48.58],
  hamburg: [9.99, 53.55],
  stockholm: [18.07, 59.33],
  // Two more seats the map was missing. Both are where a decision already in
  // the collection was actually made: the Oschadbank arbitration — the largest
  // award here at $1.1bn — sat in Paris, and Finland tried Petrovsky in the
  // Helsinki District Court under universal jurisdiction. Taken from the
  // `forum.seat` each summary already declares, not assigned by hand.
  paris: [2.35, 48.86],
  helsinki: [24.94, 60.17],
  // Added with their court entries in map.ts but not here, so both projected
  // to [0, 0] and piled up in the frame's top-left corner.
  vilnius: [25.28, 54.69],
  brussels: [4.35, 50.85],
  // the ground the cases are about
  crimea: [34.55, 45.15],
  kerch: [36.5, 45.3],
  mh17: [38.63, 48.05],
  donbas: [37.9, 48.55],
  energy: [34.6, 47.5],
  mariupol: [37.55, 47.1],
  kyiv: [30.52, 50.45],
};

const ATLAS =
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

const round = (n) => Math.round(n * 10) / 10;

const topo = await (await fetch(ATLAS)).json();
const countries = feature(topo, topo.objects.countries);

const projection = geoMercator().fitExtent(
  [
    [34, 28],
    [W - 34, H - 30],
  ],
  FRAME,
);
/*
 * One decimal place. The atlas carries far more precision than a 1200px-wide
 * drawing can show, and every digit of it ends up inlined in the homepage's
 * HTML: at full precision the country outlines alone were 175 kB of path data.
 */
const path = geoPath(projection).digits(1);

/** Does this shape land anywhere inside the drawing at all? */
const visible = (f) => {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  return x1 > -20 && x0 < W + 20 && y1 > -20 && y0 < H + 20;
};

/** Ukraine is drawn on top of the rest, so it is split out here. */
const isUkraine = (f) => f.properties?.name === "Ukraine";

// Most of the world is nowhere near this frame; drawing it costs bytes and
// shows nothing.
const context = countries.features
  .filter((f) => !isUkraine(f) && visible(f))
  .map((f) => path(f))
  .filter(Boolean);

const ukraine = countries.features.filter(isUkraine).map((f) => path(f))[0];

if (!ukraine) throw new Error("Ukraine not found in the atlas — check the property name");

const markers = Object.fromEntries(
  Object.entries(POINTS).map(([key, lonLat]) => {
    const xy = projection(lonLat);
    if (!xy) throw new Error(`${key} falls outside the projection`);
    return [key, [round(xy[0]), round(xy[1])]];
  }),
);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      _generated: "scripts/europe-map.mjs — do not edit by hand",
      viewBox: `0 0 ${W} ${H}`,
      context,
      ukraine,
      markers,
    },
    null,
    1,
  ) + "\n",
);

console.log(
  `wrote ${OUT}\n  ${context.length} country paths, ${Object.keys(markers).length} markers`,
);

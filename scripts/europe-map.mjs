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

/**
 * Crimea and Sevastopol, as Ukraine.
 *
 * The world atlas this script draws from assigns them to Russia: the Ukraine
 * outline it returns stops at the Perekop isthmus, and the peninsula came out
 * in the same colour as the surrounding foreign context. On an archive whose
 * subject is the occupation — a dozen of its proceedings are Crimean
 * expropriations — that is not a cartographic quibble.
 *
 * Coordinates are Natural Earth's own admin-1 units UA-43 and UA-40, whose ISO
 * codes are Ukrainian even in the datasets that file them under Russia. Two
 * polygons, 91 points, rounded to three decimals (about 100 m — far finer than
 * a 1200-unit frame resolves). Embedded rather than fetched so the build does
 * not depend on a second network source.
 */
const CRIMEA = [[[[33.746,44.402],[33.852,44.432],[33.806,44.527],[33.713,44.582],[33.709,44.666],[33.611,44.721],[33.675,44.792],[33.588,44.842],[33.612,44.908],[33.601,44.981],[33.555,45.098],[33.392,45.188],[33.262,45.171],[33.187,45.195],[32.919,45.348],[32.773,45.359],[32.611,45.328],[32.552,45.35],[32.508,45.404],[32.828,45.593],[33.142,45.749],[33.28,45.765],[33.466,45.838],[33.665,45.947],[33.637,46.033],[33.594,46.096],[33.654,46.146],[33.66,46.22],[33.807,46.208],[34.027,46.107],[34.128,46.09],[34.224,46.101],[34.354,46.062],[34.45,45.966],[34.523,45.977],[34.687,45.977],[34.794,45.892],[34.8,45.791],[34.946,45.729],[35.002,45.733],[35.023,45.701],[35.26,45.447],[35.374,45.354],[35.458,45.316],[35.558,45.311],[35.751,45.389],[35.833,45.402],[36.013,45.372],[36.077,45.424],[36.171,45.453],[36.29,45.457],[36.427,45.433],[36.575,45.394],[36.514,45.304],[36.451,45.232],[36.428,45.153],[36.393,45.065],[36.23,45.026],[36.055,45.031],[35.87,45.005],[35.804,45.04],[35.759,45.071],[35.678,45.102],[35.57,45.119],[35.473,45.098],[35.358,44.978],[35.155,44.896],[35.088,44.803],[34.888,44.824],[34.717,44.807],[34.47,44.722],[34.282,44.538],[34.074,44.424],[33.91,44.388],[33.756,44.399],[33.746,44.402]]],[[[33.588,44.842],[33.675,44.792],[33.611,44.721],[33.709,44.666],[33.713,44.582],[33.806,44.527],[33.852,44.432],[33.746,44.402],[33.733,44.407],[33.656,44.433],[33.451,44.554],[33.463,44.597],[33.491,44.619],[33.53,44.681],[33.588,44.842]]]];

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

const atlasUkraine = countries.features.filter(isUkraine).map((f) => path(f))[0];

/**
 * The outline the atlas returns stops at the Perekop isthmus. Appending the
 * peninsula's own subpaths to the same `d` makes one shape, so the fill is
 * continuous and the stroke traces the whole coast — Crimea is drawn as
 * Ukraine, not merely coloured like it.
 */
const crimeaPath = path({
  type: "Feature",
  geometry: { type: "MultiPolygon", coordinates: CRIMEA },
  properties: {},
});
const ukraine = `${atlasUkraine} ${crimeaPath}`;

if (!atlasUkraine) throw new Error("Ukraine not found in the atlas — check the property name");
if (!crimeaPath) throw new Error("Crimea did not project — the map must not ship without it");

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
  `wrote ${OUT}\n  ${context.length} country paths, ${Object.keys(markers).length} markers` +
    `\n  Ukraine outline includes Crimea and Sevastopol`,
);

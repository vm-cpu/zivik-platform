/**
 * Regenerate the events map geometry.
 *
 * Outputs src/content/europe-map.json: country outlines already projected to
 * SVG path strings, the mesh of Ukraine's internal oblast boundaries, and one
 * projected point per marker. Run from the repo root when the frame, the size
 * or the marker list changes:
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

/**
 * Ukraine's 27 first-level units — 24 oblasts, the Autonomous Republic of
 * Crimea, Sevastopol and the city of Kyiv.
 *
 * Source: Natural Earth 10m admin-1 (`ne_10m_admin_1_states_provinces`), taken
 * from the project's own repository at nvkelso/natural-earth-vector. Natural
 * Earth is public domain — "no permission needed" — so it can be redistributed
 * inside the committed output with attribution given here rather than in the
 * page.
 *
 * The 50m file at the same path is no use: it carries only Crimea and
 * Sevastopol for Ukraine and files both under Russia. The 10m file has all 27,
 * and files Crimea and Sevastopol under Russia too — `admin` reads "Russia" for
 * UA-43 and UA-40 — but its own `iso_3166_2` codes are Ukrainian, which is what
 * the filter below selects on. That is the same discrepancy, and the same fix,
 * as the CRIMEA constant above.
 *
 * The download is 40.7 MB. That is fine for a script run by hand whose output
 * is committed, and nothing but this script ever sees it.
 */
const ADMIN1 =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson";

/**
 * How far a simplified internal boundary may stray from the real one, in units
 * of the 1200-wide drawing. Ukraine is 291 units across here, so 0.35 is about
 * 1/830th of the country's width — under half a pixel at the framings the map
 * actually offers, and the reason the region layer costs 12 kB instead of the
 * 233 kB the raw 10m geometry projects to.
 */
const REGION_TOLERANCE = 0.35;

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

/**
 * The two windows the context layer is generated for.
 *
 * NEAR is the 1200 x 460 drawing itself, plus a 20-unit skirt — the frame the
 * viewBox declares and the two original framings live inside.
 *
 * WIDE is the Atlantic framing added later: the reader can now put Montreal,
 * where the ICAO Council sits, beside Europe. The projection already reaches
 * that far — Montreal lands at (-936.9, 407.1) on a frame that runs 0…1200 —
 * so the framing was only ever a viewBox question. But the context layer was
 * generated for NEAR, so zooming out showed an ocean where North America is.
 *
 * The numbers are the widest view the component can be driven to, measured
 * rather than guessed: `EventsMap` fits the span from Montreal to Ukraine's
 * eastern edge into the element minus the strips the floating panels claim,
 * and the tallest result across the widths the site is read at — a 1000px
 * window on the map's own page, where the element is nearly square and the fit
 * is bound by the width — is about 2400 x 1990 units centred near (200, -20).
 * These bounds cover that with room to spare, and panning is clamped inside
 * the same rect, so nothing the reader can reach falls outside them.
 *
 * NOTHING ABOUT THE PROJECTION CHANGES. fitExtent, FRAME, W, H and the marker
 * list are exactly as they were, so `ukraine`, `regions`, `markers` and
 * `viewBox` regenerate byte-identical and Europe's framing does not move. Only
 * `context` grows — and it grows by appending, so its first entries are the
 * same strings in the same order they have always been.
 */
const NEAR = { x0: -20, y0: -20, x1: W + 20, y1: H + 20 };
const WIDE = { x0: -1030, y0: -1060, x1: 1430, y1: 1030 };

/** Does this shape land anywhere inside the given window at all? */
const within = (f, b) => {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  return x1 > b.x0 && x0 < b.x1 && y1 > b.y0 && y0 < b.y1;
};

/** Ukraine is drawn on top of the rest, so it is split out here. */
const isUkraine = (f) => f.properties?.name === "Ukraine";

// Most of the world is nowhere near even the wide window; drawing it costs
// bytes and shows nothing. The near ring is emitted first and unchanged, so
// the committed output grows at the end rather than being reshuffled.
const rest = countries.features.filter((f) => !isUkraine(f));
const nearRing = rest.filter((f) => within(f, NEAR));
const farRing = rest.filter((f) => !within(f, NEAR) && within(f, WIDE));
const context = [...nearRing, ...farRing].map((f) => path(f)).filter(Boolean);

/**
 * The Atlantic framing exists to show one thing, and it must not ship without
 * it — the same guard, and the same reasoning, as Crimea below.
 */
for (const name of ["Canada", "United States of America"]) {
  if (!farRing.some((f) => f.properties?.name === name)) {
    throw new Error(`${name} did not project — the Atlantic framing must not ship without it`);
  }
}

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

/* ---------------------------------------------------------------------------
 * The oblasts, as internal boundaries only.
 *
 * Not 27 outlines. Every unit's outline includes its share of the national
 * border and the coast, so drawing them whole would trace Ukraine's edge 27
 * times — in 10m detail, on top of a 110m outline that disagrees with it by a
 * pixel or two, and in competition with the one stroke on this map that has to
 * win. Instead every edge is counted: an edge two units share is internal and
 * is kept, an edge only one unit owns is the country's own edge and is dropped.
 *
 * Natural Earth's admin-1 topology is exact here — 20 084 directed edges reduce
 * to 11 539 distinct ones, 8 545 of them shared by precisely two units and none
 * by three — so this needs no tolerance and no snapping.
 * ------------------------------------------------------------------------- */

/** Vertex identity. Natural Earth's coordinates match exactly across units. */
const vkey = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
const ekey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

const admin1 = await (await fetch(ADMIN1)).json();
/**
 * `iso_3166_2`, not `admin`: the latter says "Russia" for Crimea and
 * Sevastopol. Their codes are UA-43 and UA-40 in the same record.
 */
const oblasts = admin1.features.filter((f) =>
  String(f.properties?.iso_3166_2 ?? "").startsWith("UA-"),
);
if (oblasts.length !== 27) {
  throw new Error(`expected Ukraine's 27 admin-1 units, got ${oblasts.length}`);
}
for (const code of ["UA-43", "UA-40"]) {
  if (!oblasts.some((f) => f.properties.iso_3166_2 === code)) {
    throw new Error(`${code} missing — the map must not ship without Crimea`);
  }
}

const rings = [];
for (const f of oblasts) {
  const polys =
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) rings.push(ring);
}

const shareCount = new Map();
for (const ring of rings) {
  for (let i = 0; i + 1 < ring.length; i++) {
    const k = ekey(vkey(ring[i]), vkey(ring[i + 1]));
    shareCount.set(k, (shareCount.get(k) ?? 0) + 1);
  }
}

/** Adjacency over the internal edges only. */
const nodes = new Map();
const taken = new Set();
for (const ring of rings) {
  for (let i = 0; i + 1 < ring.length; i++) {
    const a = vkey(ring[i]);
    const b = vkey(ring[i + 1]);
    const k = ekey(a, b);
    if (shareCount.get(k) !== 2 || taken.has(k)) continue;
    taken.add(k);
    if (!nodes.has(a)) nodes.set(a, { pt: ring[i], nbrs: new Set() });
    if (!nodes.has(b)) nodes.set(b, { pt: ring[i + 1], nbrs: new Set() });
    nodes.get(a).nbrs.add(b);
    nodes.get(b).nbrs.add(a);
  }
}

/**
 * Chain the edges into the longest runs that do not fork, so the output is a
 * handful of polylines rather than 8 545 two-point stubs. Junctions (where
 * three oblasts meet) and loose ends are started from first; anything left over
 * is a closed ring — the Kyiv city boundary, for one, which is an enclave.
 */
const walked = new Set();
const chains = [];
const walkFrom = (start) => {
  for (const first of nodes.get(start).nbrs) {
    if (walked.has(ekey(start, first))) continue;
    walked.add(ekey(start, first));
    const chain = [nodes.get(start).pt, nodes.get(first).pt];
    let prev = start;
    let cur = first;
    while (nodes.get(cur).nbrs.size === 2) {
      const next = [...nodes.get(cur).nbrs].find((n) => n !== prev);
      if (next === undefined || walked.has(ekey(cur, next))) break;
      walked.add(ekey(cur, next));
      chain.push(nodes.get(next).pt);
      prev = cur;
      cur = next;
    }
    chains.push(chain);
  }
};
for (const [k, n] of nodes) if (n.nbrs.size !== 2) walkFrom(k);
for (const k of nodes.keys()) walkFrom(k);

/**
 * Douglas–Peucker, applied once per chain *after* projection so the tolerance
 * is in the units the drawing is measured in. Once, not once per oblast: a
 * shared boundary simplified twice from two sides would come apart and show as
 * a double line.
 */
const simplify = (pts, tol) => {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    if (j <= i + 1) continue;
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[j];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    let far = -1;
    let at = -1;
    for (let m = i + 1; m < j; m++) {
      const [px, py] = pts[m];
      let d;
      if (len2 === 0) d = Math.hypot(px - x1, py - y1);
      else {
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
        d = Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
      }
      if (d > far) {
        far = d;
        at = m;
      }
    }
    if (far > tol) {
      keep[at] = 1;
      stack.push([i, at], [at, j]);
    }
  }
  return pts.filter((_, i) => keep[i]);
};

let regionPoints = 0;
const regions = chains
  .map((chain) => {
    const projected = chain.map((p) => projection(p)).filter(Boolean);
    if (projected.length < 2) return "";
    const pts = simplify(projected, REGION_TOLERANCE)
      .map((p) => [round(p[0]), round(p[1])])
      // Rounding to a tenth collapses neighbours the tolerance already kept.
      .filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
    if (pts.length < 2) return "";
    regionPoints += pts.length;
    return `M${pts.map((p) => `${p[0]},${p[1]}`).join("L")}`;
  })
  .filter(Boolean)
  .join("");

if (!regions) throw new Error("the oblast mesh came out empty");

/**
 * Deliberately not in POINTS: Montreal.
 *
 * It projects to (-936.9, 407.1), which is off the 0…1200 frame, and
 * `src/content/map.ts` carries that as the ICAO Council's `offAt`. Adding it
 * here would put a fifteenth entry in `markers` — a field the map's other
 * consumers and this file's own regeneration check both treat as fixed — for
 * no gain: `offAt` is the projected point, and the drawing reads it directly.
 * Recompute it with `projection([-73.5673, 45.5017])` if the frame ever moves.
 */

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
      regions,
      markers,
    },
    null,
    1,
  ) + "\n",
);

console.log(
  `wrote ${OUT}\n  ${context.length} country paths` +
    ` (${nearRing.length} inside the frame, ${farRing.length} for the Atlantic framing),` +
    ` ${Object.keys(markers).length} markers` +
    `\n  Ukraine outline includes Crimea and Sevastopol` +
    `\n  ${oblasts.length} admin-1 units → ${chains.length} internal boundary chains,` +
    ` ${regionPoints} points, ${regions.length} chars`,
);

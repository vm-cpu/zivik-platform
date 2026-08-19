/**
 * Builds the events map's country geometry.
 *
 * Reads Natural Earth 110m country borders (via the `world-atlas` dev
 * dependency), keeps only the countries visible in the map's window, and writes
 * two GeoJSON files to `public/data/`:
 *
 *   europe.geo.json   — every other country, drawn as the quiet ground
 *   ukraine.geo.json  — Ukraine alone, drawn highlighted on top
 *
 * Splitting them means the component never filters at runtime. Re-run after
 * changing the window:  node scripts/build-map-geometry.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as topojson from "topojson-client";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Map window: western Europe through western Russia, Baltic down to the Black Sea. */
const WINDOW = { west: -12, east: 50, south: 33, north: 66 };
const UKRAINE_ID = "804";

const topo = JSON.parse(
  readFileSync(resolve(root, "node_modules/world-atlas/countries-110m.json"), "utf8"),
);
const all = topojson.feature(topo, topo.objects.countries).features;

/** True when any part of the geometry falls inside the window. */
function intersectsWindow(feature) {
  const coords = [];
  const walk = (node) => {
    if (typeof node[0] === "number") coords.push(node);
    else node.forEach(walk);
  };
  walk(feature.geometry.coordinates);
  return coords.some(
    ([lon, lat]) =>
      lon >= WINDOW.west &&
      lon <= WINDOW.east &&
      lat >= WINDOW.south &&
      lat <= WINDOW.north,
  );
}

/** Drop coordinate precision — 2 decimals is ~1km, far finer than 110m data. */
function round(node) {
  if (typeof node[0] === "number") {
    return [Math.round(node[0] * 100) / 100, Math.round(node[1] * 100) / 100];
  }
  return node.map(round);
}

function slim(features) {
  return {
    type: "FeatureCollection",
    features: features.map((f) => ({
      type: "Feature",
      id: f.id,
      properties: {},
      geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
    })),
  };
}

const visible = all.filter(intersectsWindow);
const ukraine = visible.filter((f) => String(f.id) === UKRAINE_ID);
const others = visible.filter((f) => String(f.id) !== UKRAINE_ID);

if (ukraine.length === 0) throw new Error("Ukraine not found in the source topology");

mkdirSync(resolve(root, "public/data"), { recursive: true });
for (const [name, features] of [
  ["europe", others],
  ["ukraine", ukraine],
]) {
  const file = resolve(root, `public/data/${name}.geo.json`);
  const json = JSON.stringify(slim(features));
  writeFileSync(file, json);
  console.log(`${name}.geo.json — ${features.length} features, ${(json.length / 1024).toFixed(1)} KB`);
}

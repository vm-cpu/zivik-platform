/**
 * Audits the events map's coordinates.
 *
 * A law library should be able to say where every point on its map comes from.
 * This lists each violation with the precision claimed for its coordinate and
 * the source behind it, and exits non-zero if any event has neither a
 * proceeding nor an outside source to stand on.
 *
 *   node scripts/check-map-places.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

const mapSrc = read("src/content/map.ts");
const casesSrc = read("src/content/cases.ts");

const caseIds = new Set([...casesSrc.matchAll(/\n    id: "([^"]+)"/g)].map((m) => m[1]));

/** Each event block, from its id to the next id (or the end of the array). */
const blocks = [...mapSrc.matchAll(/\n    id: "([^"]+)",\n    coord:([\s\S]*?)(?=\n    id: "|\n\];)/g)];

let problems = 0;
const rows = [];

for (const [, id, body] of blocks) {
  // The place label, not the source label: take the first one inside `place:`.
  const placeBlock = body.match(/place: \{([\s\S]*?)\n    \},/)?.[1] ?? "";
  const label = placeBlock.match(/uk: "([^"]+)"/)?.[1] ?? "—";
  const precision = body.match(/precision: "([^"]+)"/)?.[1] ?? null;
  const sourceCaseId = body.match(/sourceCaseId: "([^"]+)"/)?.[1] ?? null;
  const hasSource = /source: \{/.test(body);
  const cited = [...body.matchAll(/"((?:icj|ecthr|icc|itlos|icao|scc|pca|nl|fi|lt|eu)[a-z-]*-?[a-z0-9]*)"/g)];

  if (!precision) {
    console.error(`✗ ${id}: no precision declared`);
    problems++;
  }
  if (!sourceCaseId && !hasSource) {
    console.error(`✗ ${id}: coordinate has no stated basis`);
    problems++;
  }
  if (sourceCaseId && !caseIds.has(sourceCaseId)) {
    console.error(`✗ ${id}: sourceCaseId "${sourceCaseId}" is not in the registry`);
    problems++;
  }
  for (const [, ref] of cited) {
    if (!caseIds.has(ref) && ref !== sourceCaseId) {
      // Only ids that look like case references are checked; hub ids and
      // institution ids live elsewhere and are validated by the type system.
      if (/^(icj|ecthr|icc|itlos|icao|scc|pca|nl|fi|lt|eu)-/.test(ref)) {
        console.error(`✗ ${id}: caseId "${ref}" is not in the registry`);
        problems++;
      }
    }
  }

  rows.push({ id, precision: precision ?? "—", basis: sourceCaseId ?? (hasSource ? "external" : "—"), label });
}

console.log("");
for (const r of rows) {
  const flag = r.precision === "area" ? "◇" : "●";
  console.log(`${flag} ${r.id.padEnd(15)} ${r.precision.padEnd(11)} ${r.basis.padEnd(12)} ${r.label}`);
}
console.log(`\n● exact point   ◇ area, no single point   —   ${rows.length} events`);

if (problems > 0) {
  console.error(`\n${problems} problem(s) found.`);
  process.exit(1);
}

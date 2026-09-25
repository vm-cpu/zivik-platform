/**
 * Snapshot the published content out of EmDash, for the build.
 *
 *   npm run cf:pull              from the deployed D1 database (--remote)
 *   npm run cf:pull -- --local   from the local dev database
 *
 * Reads every collection described in site/content/collections.ts — only
 * entries whose status is `published` (a saved draft lives in `revisions`
 * and never touches these columns) — turns each row back into the value the
 * file in src/content exports, and writes `.emdash/snapshot.json`. The build
 * then compiles those values in place of the files' own (site/content/
 * vite-plugin.mjs), so the site is exactly what editors last published.
 *
 * A database EmDash has not set up yet — no tables, or no published entry in
 * any collection — yields no snapshot, and the build falls back to the files.
 * That is the first deploy: the site goes up from the files, and the admin
 * imports the same files as its starting content (npm run cf:content seed).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { COLLECTIONS, POSITION, fromRow, type Row } from "../../site/content/collections";

const DB = "nasvitlo";
const OUT = resolve(".emdash/snapshot.json");
const local = process.argv.includes("--local");

function query(sql: string): Row[][] {
  let out: string;
  try {
    out = execFileSync(
      "npx",
      ["wrangler", "d1", "execute", DB, local ? "--local" : "--remote", "--json", "--command", sql],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 256 * 1024 * 1024 },
    );
  } catch (err) {
    const e = err as { stderr?: string; stdout?: string };
    /* The token Workers Builds generates can deploy but cannot read D1. */
    throw new Error(
      `cf:pull: could not read ${local ? "local" : "remote"} D1 "${DB}".\n` +
        (local
          ? ""
          : "If this is Workers Builds: give the build's API token D1 access — My Profile → " +
            "API Tokens → the Workers Builds token → add Account · D1 · Edit. See docs/CLOUDFLARE.md.\n") +
        (e.stderr || e.stdout || String(err)),
    );
  }
  const results = JSON.parse(out) as { results: Row[]; success: boolean }[];
  return results.map((r) => r.results);
}

function tables(): Set<string> {
  const [rows] = query("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'ec_%'");
  return new Set(rows.map((r) => String(r.name)));
}

const present = tables();
const missing = COLLECTIONS.filter((c) => !present.has(`ec_${c.slug}`)).map((c) => c.slug);
if (missing.length === COLLECTIONS.length) {
  rmSync(OUT, { force: true });
  console.warn(`  cf:pull: EmDash has not set up ${DB} yet — building from src/content.`);
  process.exit(0);
}
if (missing.length) {
  throw new Error(
    `cf:pull: ${DB} has no table for ${missing.join(", ")}. The schema in the database is behind ` +
      "site/content/collections.ts — add the collection in the admin (or re-seed) before building.",
  );
}

const statements = COLLECTIONS.map((c) => {
  const order = c.shape === "array" ? `${POSITION}, slug` : "slug";
  return `SELECT * FROM "ec_${c.slug}" WHERE status = 'published' AND deleted_at IS NULL ORDER BY ${order}`;
});
const results = query(statements.join(";\n"));

const collections: Record<string, unknown> = {};
let total = 0;
COLLECTIONS.forEach((spec, i) => {
  const rows = results[i] ?? [];
  total += rows.length;
  const values = rows.map((r) => [String(r.slug), fromRow(spec, r)] as const);
  switch (spec.shape) {
    case "array":
      collections[spec.slug] = values.map(([, v]) => v);
      break;
    case "record":
      collections[spec.slug] = Object.fromEntries(values);
      break;
    case "single":
      if (values.length !== 1) {
        throw new Error(`cf:pull: ${spec.slug} must have exactly one published entry, found ${values.length}`);
      }
      collections[spec.slug] = values[0][1];
      break;
  }
  console.log(`  ${spec.slug}: ${rows.length}`);
});

if (total === 0) {
  rmSync(OUT, { force: true });
  console.warn(`  cf:pull: nothing is published in ${DB} yet — building from src/content.`);
  process.exit(0);
}

const snapshot = {
  source: local ? "local" : "remote",
  pulledAt: new Date().toISOString(),
  bindings: COLLECTIONS.map((c) => ({ collection: c.slug, shape: c.shape, ...c.source })),
  collections,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot));
console.log(`  cf:pull: ${total} published entries from ${local ? "local" : "remote"} ${DB} → ${OUT}`);

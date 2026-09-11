#!/usr/bin/env node
/**
 * Does this build actually match its flags?
 *
 * `FEATURE_GLOSSARY` is read in seven places — the route, the decision-page
 * band, the page bar, the inline term marks, the search index, the nav and the
 * sitemap. Six of seven is not a hidden glossary; it is a hidden glossary with
 * a dead link into it, and the way you find out is a reader hitting a 404 on
 * the production archive.
 *
 * That class of mistake cannot be caught by reading the source, because the
 * source is correct in both states — the conditional is right there. It can
 * only be caught by looking at what the build emitted. So this runs after
 * `next build` and reads the prerendered HTML.
 *
 * Run it with the same environment the build had:
 *   npm run build && npm run verify
 *   FEATURE_GLOSSARY=true npm run build && FEATURE_GLOSSARY=true npm run verify
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, ".next/server/app");

if (!existsSync(OUT)) {
  console.error("verify: no build found at .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const on = process.env.FEATURE_GLOSSARY === "true";

/** Every prerendered document in the build. */
function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...htmlFiles(path));
    else if (name.endsWith(".html")) out.push(path);
  }
  return out;
}

const pages = htmlFiles(OUT);
const problems = [];

/* The glossary's own routes are excluded from the link scan: when the flag is
   off they are the 404 page, and a 404 page is allowed to sit at that path —
   what matters is that nothing else points at it. */
const isGlossaryRoute = (p) => /\/(uk|en)\/glossary\.html$/.test(p);

/** A link into the dictionary, from anywhere — nav, footer, prose, page bar. */
const LINK = /href="\/(?:uk|en)\/glossary(?:[#?][^"]*)?"/g;
/** The decision-page band. */
const BAND = /id="glossary"/;

for (const path of pages) {
  const html = readFileSync(path, "utf8");
  const rel = relative(ROOT, path);
  if (isGlossaryRoute(path)) continue;

  const links = html.match(LINK) ?? [];
  if (!on && links.length) {
    problems.push(`${rel}: ${links.length} link(s) to the glossary in a build that hides it — ${[...new Set(links)].join(", ")}`);
  }
  if (!on && BAND.test(html)) {
    problems.push(`${rel}: the «Словник» band rendered in a build that hides it`);
  }
}

/* The route itself: 404 when hidden, a real page when published. Next records
   the prerendered status beside the HTML. */
for (const locale of ["uk", "en"]) {
  const meta = join(OUT, locale, "glossary.meta");
  if (!existsSync(meta)) {
    problems.push(`${locale}/glossary.meta missing — the route did not prerender`);
    continue;
  }
  const status = JSON.parse(readFileSync(meta, "utf8")).status ?? 200;
  if (!on && status !== 404) {
    problems.push(`/${locale}/glossary returns ${status} in a build that hides the glossary — expected 404`);
  }
  if (on && status !== 200) {
    problems.push(`/${locale}/glossary returns ${status} in a build that publishes it — expected 200`);
  }
}

/* Published builds get the opposite check: a flag that is on but wired to
   nothing looks identical to a flag that is off, and staging would quietly
   stop showing the thing it exists to show. */
if (on) {
  const anyLink = pages.some(
    (p) => !isGlossaryRoute(p) && LINK.test(readFileSync(p, "utf8")),
  );
  if (!anyLink) problems.push("FEATURE_GLOSSARY=true but nothing in the build links to the glossary");
}

if (problems.length) {
  console.error(`verify: build does not match FEATURE_GLOSSARY=${on ? "true" : "unset"}\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  on
    ? `verify: clean. Glossary published — route 200, linked from the build, ${pages.length} pages scanned.`
    : `verify: clean. Glossary hidden — route 404, no links, no band, ${pages.length} pages scanned.`,
);

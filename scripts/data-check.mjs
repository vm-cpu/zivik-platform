/**
 * Internal consistency of the archive's own record.
 *
 *     node scripts/data-check.mjs
 *
 * ── What this can and cannot tell you ──────────────────────────────────────
 * It checks the record against ITSELF: that `lit` and `summarySlug` agree,
 * that a docket year is not in the future, that a proceeding recorded as
 * concluded names what concluded it, that an act the record names has a
 * document behind it, that no id or slug is used twice, that a stage does not
 * contradict the status text it was derived from, and that an amount is
 * plausibly denominated.
 *
 * It CANNOT tell you whether any of it is true. Whether ICJ GL 182 really was
 * decided on 2 February 2024, whether the Naftogaz award really was 4.63bn,
 * whether the ICC warrant really names those articles of the Rome Statute —
 * none of that is in this file's reach. Those are checks against the courts'
 * own documents, one case at a time, and a green run here says nothing about
 * them.
 */
import { readFileSync } from "node:fs";

const cases = readFileSync("src/content/cases.ts", "utf8");
const TODAY = "2026-08-26";

/* crude but sufficient: split on the record boundary the file actually uses */
const records = cases
  .split(/\n  \{\n/)
  .slice(1)
  .map((r) => r.split(/\n  \},?/)[0]);

const field = (r, name) => {
  const m = r.match(new RegExp(`^\\s*${name}:\\s*(.+?),?\\s*$`, "m"));
  return m ? m[1].replace(/,$/, "") : null;
};
const strField = (r, name) => {
  const v = field(r, name);
  if (!v) return null;
  const m = v.match(/^"(.*)"$/);
  return m ? m[1] : v;
};
const uk = (r, name) => {
  const m = r.match(new RegExp(`${name}:\\s*\\{[^}]*uk:\\s*"([^"]*)"`, "s"));
  return m ? m[1] : null;
};

const issues = [];
const flag = (id, kind, msg) => issues.push({ id, kind, msg });

const ids = new Set();
const slugs = new Set();

for (const r of records) {
  const id = strField(r, "id");
  if (!id) continue;
  if (ids.has(id)) flag(id, "duplicate-id", "two records share this id");
  ids.add(id);

  const stage = strField(r, "stage");
  const outcome = strField(r, "outcome");
  const status = uk(r, "status") ?? "";
  const year = field(r, "year");
  const lit = field(r, "lit") === "true";
  const slug = strField(r, "summarySlug");
  const url = strField(r, "decisionUrl");
  const amount = field(r, "amountUsd");

  if (slug) {
    if (slugs.has(slug)) flag(id, "duplicate-slug", `slug ${slug} used twice`);
    slugs.add(slug);
  }

  // 1. lit and summarySlug must agree — one says "there is a write-up", the
  //    other is the write-up.
  if (lit && !slug) flag(id, "lit-no-summary", "lit: true with no summarySlug");
  if (!lit && slug) flag(id, "summary-not-lit", `summarySlug ${slug} but lit: false`);

  // 2. a docket year in the future is a typo, not a fact
  if (year && year !== "null" && Number(year) > Number(TODAY.slice(0, 4)))
    flag(id, "future-year", `year ${year} is after ${TODAY}`);

  // 3. the free-text status and the two keyed dimensions have to agree.
  //    These are the phrases DESIGN-level comments say each key stands for.
  const says = {
    concluded: /рішення винесено|врегульован|завершен|відхилен|вирок|остаточне|залишено/i,
    merits: /по суті/i,
    investigation: /розслідуванн/i,
    preliminary: /попередн/i,
    enforcement: /виконанн/i,
    satisfaction: /сатисфакц/i,
    appeal: /оскаржу/i,
    frozen: /заморож/i,
    suspended: /призупин/i,
    upcoming: /до розгляду|до арбітражу|до суду/i,
  };
  if (stage && says[stage] && !says[stage].test(status))
    flag(id, "stage-vs-status", `stage "${stage}" but status reads «${status}»`);

  /* `outcome` is deliberately NOT checked against the free-text status, and
     the first draft of this file was wrong to try. The two answer different
     questions by design — ecthr-5 carries outcome "judgment" (the Court
     delivered one) with status «Очікує сатисфакції» (just satisfaction is
     still pending), and both are true at once. That is the whole reason the
     single `statusKey` was split into `stage` + `outcome`. A checker that
     demands they echo each other is checking for the bug the model was
     rewritten to remove. */

  // 4. an act was issued but nothing links to it
  if (outcome && !url)
    flag(id, "act-no-document", `outcome "${outcome}" with decisionUrl: null`);

  // 5. a concluded proceeding that names no act at all
  if (stage === "concluded" && !outcome)
    flag(id, "concluded-no-outcome", "stage concluded with no outcome");

  // 6. amounts: sign and magnitude sanity
  if (amount && amount !== "null") {
    const n = Number(amount);
    if (!Number.isFinite(n)) flag(id, "amount-unparseable", amount);
    else if (Math.abs(n) < 1000)
      flag(id, "amount-suspicious", `${n} — is this dollars or millions?`);
  }
}

/* every summary file must have a row, and vice versa */
const index = readFileSync("src/content/summaries/index.ts", "utf8");
const summaryKeys = [...index.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*[A-Za-z_]/gm)].map(
  (m) => m[1],
);
for (const s of slugs)
  if (summaryKeys.length && !summaryKeys.includes(s))
    flag(s, "slug-no-file", "summarySlug has no entry in summaries/index.ts");

console.log(`checked ${ids.size} records, ${slugs.size} with write-ups\n`);
if (!issues.length) {
  console.log("no internal contradictions found.");
} else {
  const by = new Map();
  for (const i of issues) {
    if (!by.has(i.kind)) by.set(i.kind, []);
    by.get(i.kind).push(i);
  }
  for (const [kind, list] of [...by].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`── ${kind} (${list.length})`);
    for (const i of list) console.log(`   ${i.id}: ${i.msg}`);
    console.log("");
  }
}

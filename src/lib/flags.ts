/**
 * Build-time feature flags.
 *
 * One flag so far, and the shape is deliberate: these are read at build, not
 * at request. Every page on this site is prerendered, and a flag consulted per
 * request would turn whichever route reads it dynamic — the thing the registry
 * page in particular cannot afford (its rows vanish from the static HTML the
 * moment that page stops being prerendered). A build-time constant keeps the
 * whole site static and makes staging and production two different builds of
 * the same commit, which is what they should be.
 */

/**
 * Whether the glossary is part of this deployment.
 *
 * Defaults to NO, and the default is the point. The reviewers' objection to
 * the glossary is not that it looks unfinished — it is that fifty definitions
 * of legal terms were generated rather than quoted, on an archive that invites
 * readers to cite it. Until each headword carries a verbatim definition and
 * its source, the entries are a liability in production and a work in progress
 * on staging.
 *
 * Opt-in rather than opt-out, following SITE_INDEXABLE in `lib/seo.ts`, and
 * for the same reason: the expensive mistake is the one a forgotten
 * environment variable makes for you. Unset on production means the glossary
 * stays hidden; someone has to type FEATURE_GLOSSARY=true to publish it.
 *
 * Server-only, with no NEXT_PUBLIC_ prefix — nothing in a client bundle reads
 * it. `Header` is a client component and does need it, so the layout passes it
 * down as a prop; there is exactly one `<Header>` in the tree, so that costs
 * one line rather than a flag baked into every page's payload.
 *
 * What it controls, all of it — and because the source reads correctly in
 * both states, the wiring is checked against the emitted HTML instead:
 * `npm run build && npm run verify` fails if a link, the band or the route
 * disagrees with the flag (scripts/flag-check.mjs):
 *  - the /[locale]/glossary route, which 404s when off;
 *  - the «Словник» band on every decision page, and its chip in the page bar;
 *  - the inline term marks in the verbatim summaries — these link into the
 *    glossary, so leaving them would scatter dead links through the prose;
 *  - the glossary section of the search index behind the library page;
 *  - the header nav item, the footer link and the sitemap entries.
 */
export const glossaryEnabled = process.env.FEATURE_GLOSSARY === "true";

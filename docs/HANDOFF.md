# Handoff spec — насвітло

**Stack:** Next 16 (App Router, RSC) · React 19 · plain CSS with custom
properties (no CSS-in-JS, no Tailwind classes in components) · `next/font`
self-hosted faces.

**Source of this spec:** there is no Figma file — the design lives in the
codebase. Every number below was **measured from the running application**, not
transcribed from a mockup, so it is what a developer will actually see. Where a
state is undefined, this document says so rather than inventing one: an
unspecified state is a state each developer will guess differently.

Read alongside [DESIGN.md](DESIGN.md), which holds the *rules*; this file holds
the *measurements*.

---

## 1. Layout

| Property | Value | Notes |
| --- | --- | --- |
| Rail max-width | `1180px` | `--measure` |
| Rail gutter | `clamp(24px, 5vw, 72px)` | `--gutter` |
| Reading measure | `680px` | ~65 characters |

**One rail.** Every full-bleed band wraps its content in `.rail`. Masthead,
lede, dashboard and reading column must share one left edge at every viewport
width — verify by measuring `.rail` left offsets; they must all be equal.

### Breakpoints — ⚠️ needs a decision

The site currently uses **seven ad-hoc breakpoints**: 480, 720, 760, 820, 880,
1000, 1024px. There is no scale, so a developer adding a component has no
correct answer to "which breakpoint do I use?".

**Proposed scale** (not yet applied — see §8):

| Token | Width | Use |
| --- | --- | --- |
| `--bp-sm` | 480px | phone, single column |
| `--bp-md` | 768px | tablet, nav collapses |
| `--bp-lg` | 1024px | desktop, side rails appear |
| `--bp-xl` | 1280px | wide, fluid gutters max out |

Existing values map: 480→sm · 720/760/820/880→md · 1000/1024→lg.

---

## 2. Design tokens

Full table in [DESIGN.md](DESIGN.md#colour). Summary of what components consume:

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--brand-red` | `#7f1716` | `#d9564b` | primary CTA, breach indicator |
| `--brand-gold` | `#8a6e4b` | `#d9ab5e` | labels, structure, section rules |
| `--brand-surface` | `#ffffff` | `#201c18` | cards |
| `--brand-paper` | `#fbfbfa` | `#14120f` | page ground |
| `--brand-ink` | `#1a1917` | `#f4f1ea` | primary text |
| `--space-1…24` | 4–96px | — | step number × 4 = px |
| `--r-xs…pill` | 6/10/14/20/28/999px | — | see the mapping below |
| `--dur` | `180ms` | — | interaction transitions |

**Never hardcode a hex.** Literals do not follow the theme; that is how two
accents ended up at 2.7:1 contrast in dark mode.

### Radius mapping — which component gets which step

The scale says what radii *exist*; this says which one each component *takes*.
Without it, cards were built at both 14px and 20px.

| Role | Token | px |
| --- | --- | --- |
| Button, chip, badge, toggle, progress bar | `--r-pill` | 999 |
| Card, panel, callout, findings block | `--r-md` | 14 |
| List row, small control | `--r-sm` | 10 |
| Large surface, modal, media frame | `--r-lg` | 20 |
| Illustration (lamp, scales, map markers) | — | bespoke geometry, deliberately off-scale |

---

## 3. Components

Measured from the decision page in dark mode.

| Component | Padding | Radius | Type | Gap | Notes |
| --- | --- | --- | --- | --- | --- |
| `.btn-primary` | `16px 24px` | pill | 14px/700 | 4px | cherry fill, `--shadow-md`, optional `<em>` subtitle |
| `.btn-ghost` | `16px 24px` | pill | 14px/700 | 4px | 1px hairline border, transparent fill |
| `.kpi` | `24px` | 14px | value 34–46px display / label 12px | 8px | sits on the always-dark dashboard |
| `.ruling` | `20px 24px` | 14px | title 22.5px | — | `--shadow-sm` |
| `.faq details` | `16px 20px` | 14px | summary 15.5px | — | native `<details>`, `+`/`−` marker |
| `.related a` | `16px 20px` | 14px | 15.5px | 4px | lifts 2px on hover |
| `.pmeasures li` | `20px 24px` | 14px | 15.5px | — | 3px left stripe via `::before` |
| `.chip` | `4px 10px` | pill | 10px/700, `0.07em`, uppercase | 5px | 4 status variants |
| `.sidetoc a` | `8px 0 8px 16px` | — | 15.5px | 12px | active item takes `--pred` + left rule |

### Variants

| Component | Variants |
| --- | --- |
| Button | `primary` (cherry fill) · `ghost` (hairline) · `.btn-o` on home (outline) |
| Chip | `st-decided` green · `st-progress` amber · `st-warrant` cherry · `st-enforce` blue |
| Verdict indicator | `violation` (cherry dot + glow) · `no-violation` (hollow ring, muted) |
| Timeline node | `context` · `filing` · `order` (gold ring) · `judgment` (cherry fill + glow) |

---

## 4. States and interactions

| Element | State | Behaviour |
| --- | --- | --- |
| Button | hover | `translateY(-1px)`, `--dur --ease` |
| Button ghost | hover | border and text → `--gold` |
| Card (link) | hover | `translateY(-2px)`, shadow `sm → md` |
| Accordion row | hover | background → `--paper-2`, top rule fades |
| FAQ | open/closed | native `<details>`; marker `+` ⇄ `−` |
| Side nav item | active | scrollspy sets `data-active="yes"` → cherry text + left rule |
| Theme toggle | pressed | `aria-pressed` flips; lamp icon lit ⇄ out |
| Copy button | success | label → "Скопійовано" for 2000ms, then reverts |
| Any control | focus-visible | 2px `--brand-red` outline, 3px offset; gold on dark scenes |

### ⚠️ States that do not exist

A developer adding a form or an async view has nothing to copy. These must be
specified before that work starts:

| Missing | Where it will first be needed |
| --- | --- |
| `:disabled` | **not defined anywhere on the site** — buttons, inputs, selects |
| Loading / skeleton | registry filtering, any future async fetch |
| Error | the newsletter form (currently two placeholder `<a href="#">`) |
| Success / validation | same form |
| Focus-within on grouped inputs | registry filter bar |

---

## 5. Responsive behaviour

| Breakpoint | Change |
| --- | --- |
| ≥1024px | side navigation becomes a sticky rail; fluid gutters open toward 72px |
| <1024px | side nav collapses to a sticky bar under the header |
| <880px | primary nav hides, burger + drawer take over |
| <820px | dashboard grid (map + scorecard) stacks to one column |
| <760px | KPI strip reflows to two columns; timeline stacks |
| <480px | KPI strip to one column; buttons go full-width |

**Verify at every width:** `document.documentElement.scrollWidth` must never
exceed `window.innerWidth`. Horizontal overflow has regressed twice here, both
times from a full-bleed element using `100vw` (which includes the scrollbar) —
use `width: 100%` on a full-bleed band instead.

---

## 6. Content and edge cases

| Case | Handling |
| --- | --- |
| Registry: no filter matches | ✅ implemented — `.reg-empty` with heading + body copy |
| Case title (long) | `text-wrap: balance`, `max-width: 18ch`, clamps 32→68px |
| Body prose | `max-width: 680px`; verbatim judgment text is **never truncated or edited** |
| Map theatre labels | clamped to the 0–1000 viewBox so they cannot clip at the edge |
| Missing summary | case links fall back to the court's own PDF (`summarySlug` absent) |
| Ukrainian vs English | UA strings run ~15% longer — test the nav and KPI labels in UA first |
| Clipboard unavailable | `navigator.clipboard` may reject on http/older browsers — currently unhandled |

**Verbatim rule:** judgment prose is ingested from the source `.docx` into
`*.verbatim.json` and rendered unmodified. Never "tidy" it — no re-wrapping, no
smart quotes, no ellipsis. Only the chrome around it is translated.

---

## 7. Motion

| Element | Trigger | Animation | Duration | Easing |
| --- | --- | --- | --- | --- |
| Button / card | hover | translate + shadow | `--dur` 180ms | `--ease` |
| Theme switch | click | token cross-fade | 180ms | `--ease` |
| Lamp scene | toggle | background + glow | 550ms | ease |
| Accordion | open | native disclosure | browser default | — |
| Copy feedback | click | label swap, 2000ms hold | — | — |

All motion is suppressed under `prefers-reduced-motion: reduce` (global rule).

⚠️ **Drift:** twelve distinct durations exist in CSS (0.15s, 0.2s, 0.4s, 0.5s,
0.55s, 0.6s, 0.8s, 1s, 1.1s, 2.1s…) and most predate `--dur`. Interaction
feedback should use `--dur`; the long ones belong to the lamp/scales
illustrations and may stay bespoke.

---

## 8. Accessibility

**Implemented:** one global `:focus-visible` ring (2px, 3px offset, gold on
dark grounds) · `prefers-reduced-motion` honoured · AA contrast verified in both
themes, lowest pair 4.79:1 · `aria-label` ×9 · `aria-expanded` on burger and
disclosure · `aria-pressed` on the theme toggle · `aria-valuenow/min/max` on the
progress meter · `role` ×2 · `aria-hidden` on decorative SVG · `hreflang` on
every localized route.

**Keyboard:** Tab order follows DOM order — header → language → theme → nav →
content → side nav → footer. `<details>` and the burger are native buttons, so
Enter/Space work without handlers. No custom key handling exists anywhere
(`onKeyDown` count: 0), which is correct while every control stays native.

### ⚠️ Gaps

| Gap | Impact |
| --- | --- |
| ShareBar "copied" feedback is visual only | screen reader users get no confirmation — needs `aria-live="polite"` |
| No skip-to-content link | keyboard users traverse the whole header on every page |
| No `:disabled` styling | a disabled control will look enabled |
| Newsletter links are `href="#"` | announced as links that go nowhere |

---

## 9. Priority for the next developer

1. **Add `:disabled`** to buttons, inputs and selects — the only state with no
   definition at all, and the next form will need it.
2. **Add `aria-live` to ShareBar** and a skip link. Both are small.
3. **Adopt the breakpoint scale** in §1 and retire the seven ad-hoc widths.
4. **Point interaction transitions at `--dur`**; leave illustration timings.
5. Extend `--t-*` and `--space-*` to `home.css` and `registry.css` — they are
   adopted on the decision page only (see the design-system audit).

---

## Addendum (2026-08): the decision-page instrument system

Everything above measured the site as of the first decision page. Since
then the decision template grew an instrument system (warrant ladder,
objection cards with bench votes, money bars, filterable timeline, unified
page navigation with a vertical rail ≥1440px) and the monolithic `case.css`
was split into `cases/case/*.css`, imported in cascade order. The rules,
the component inventory and the content contract now live in
[ARCHITECTURE.md](ARCHITECTURE.md#decision-pages-one-template-optional-instruments-added-2026-08)
— measurements in this file still hold where the components they describe
survive, but treat ARCHITECTURE.md as current where the two disagree.
Closed since this handoff: `:disabled` styling (site-wide), the skip link,
and the Share bar (removed with its `aria-live` gap).

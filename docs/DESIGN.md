# насвітло — design system

**Character:** *Lamplit court record.* A legal archive that reads like an
editorial publication — near-neutral paper, cherry and gold from the UCU
brandbook, a serif that belongs in a law report, and monospace for the
machinery of a judgment. Serious without being funereal; contemporary without
chasing consumer-product trends.

**Audience:** young lawyers, human-rights defenders, journalists. They cite us
in filings and articles, they read on phones, and they are allergic to anything
that treats atrocity lightly. Institutional credibility is the brief.

This file is the contract. Change values **here and in `globals.css` only** —
never in a component or a section stylesheet.

---

## 1. Foundations

### Colour

The single source of truth is `:root` in `src/app/globals.css`. Everything else
reads `var(--brand-*)`.

**The site has one theme.** There was a dark variant that flipped these tokens
under `prefers-color-scheme` and a `[data-theme]` override; it is gone, along
with the lamp-shaped toggle that drove it. `color-scheme: light` is pinned on
`:root` so a dark-OS browser does not repaint scrollbars and form controls
against a light page. The "Dark" column below is kept only where a token still
has a lit counterpart used on the dark scenes — the lamp stage, the map, the
court mastheads — which are dark in the design, not in a theme.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--brand-red` | `#7f1716` | `#d9564b` | UCU cherry, Pantone 7624 C. Primary accent |
| `--brand-red-dark` | `#5c100f` | — | pressed / hover |
| `--brand-cherry` | `#c23b32` | — | lit accent on dark scenes |
| `--brand-gold` | `#8a6e4b` | `#d9ab5e` | ink gold, Pantone 874 C |
| `--brand-gold-lit` | `#e6b65c` | — | luminous gold in dark / glow |
| `--brand-paper` | `#fbfbfa` | `#14120f` | page ground |
| `--brand-paper-2` | `#f4f4f2` | `#1a1714` | recessed band |
| `--brand-surface` | `#ffffff` | `#201c18` | cards, rows |
| `--brand-ink` | `#1a1917` | `#f4f1ea` | primary text |
| `--brand-ink-2` | `#55524d` | `#c2bab0` | secondary text |
| `--brand-faint` | `#8a8681` | `#8f877d` | muted, captions |
| `--brand-rule` | `#e7e5e1` | `#322c26` | hairline dividers |
| `--brand-seam` | `#c6c0b6` | — | the edge between two full-bleed paper bands |
| `--brand-night` | `#17110f` | — | scenes that are dark by design |
| `--brand-forum` | `#3b5468` | — | which court — on paper. Never an outcome |
| `--brand-forum-lit` | `#8fb3c0` | — | the same, on the night grounds |

**Rules**

- **Colour means one thing at a time, and the three meanings do not trade
  places.** The palette held only two hues — red in seven shades, gold in
  eight — so every distinction the site drew competed for the same ink: the
  outcome of a claim, the kind of a chronology entry, whether an award still
  stands, and which court decided it. A reader could learn on one page that
  gold means relief granted and meet it on the next naming a forum.

  | hue | says | examples |
  |---|---|---|
  | red | a breach, a conviction, a loss | `violation`, `convicted`, the unreturned share of a proportion |
  | gold | relief, a finding in someone's favour, the archive's own structure | `granted`, rules, labels, the drawn share |
  | forum | which institution — **and nothing else** | the court in a library row, on a glossary definition's trail back, in a pending page's eyebrow |

  The forum hue is deliberately close in weight to the other two (1.4 against
  gold, 1.3 against red on paper) so that a newcomer does not shout over the
  colours that carry the findings. Because it never states a verdict, it can
  sit beside one without confusion. Do not reach for it to mark anything else.

- **Never introduce a hex in a component or section file.** If a value is
  missing, add a token. One documented exception: the lamp illustration in
  `home.css` (`.lmp`, `.pj`) mixes its own highlights — brass, glass, the cone
  of light — against each other rather than against the page, and is repainted
  as a unit if it is ever repainted. Nothing else.
  This rule exists because literals drift: `--pgold`/`--pred` ended up at 3.3:1
  and 2.7:1 on the dark ground, and `--brand-faint` and `--brand-faint-dark`
  each shipped below AA on every ground they were named for.
- **Red means a finding of breach.** Not decoration, not emphasis, not section
  furniture. Everything structural is gold; prose is ink or cream. Red used
  decoratively is what made the decision page unreadable.
- **No beige.** The neutrals carry only a whisper of warmth; the cherry and
  gold carry all the colour.
- Every foreground/background pair must clear **WCAG AA** (4.5:1 for text).
  Current floor in dark mode is 4.79:1.

### Typography

Brandbook faces, self-hosted via `next/font` (never a CDN `<link>` — it swaps
mid-render).

- `--brand-font-display` — **Charis SIL**. Headings, case titles, standfirsts,
  pull quotes.
- `--brand-font-body` — **Fira Sans**. UI, prose, labels.
- `--brand-font-mono` — **IBM Plex Mono**. The machinery: docket meta, dates,
  paragraph refs (§ 392), counters, citations, track labels.

**Italic is a fourth and fifth token, not a style of the first two.**
`next/font` emits the cross product of the weights and styles it is given, so
one call for four Fira weights in both styles preloads eight italic files on
every page. The site sets italic in four rules — the decision masthead's
parties line, the home pull quote's case name, the chronology's context labels
and `.obj-latin` — at Charis 400 and Fira 400 and 500. Everything else that
computes to italic is an empty `<i>` used as a bar, a dot or a legend swatch
and draws no glyph. So the italics are loaded separately, at those weights
only, as `--brand-font-display-italic` and `--brand-font-body-italic`.

**A rule that goes italic names one of those two.** A family that has no
italic face does not fall through to the next family in the stack — it answers
with a skewed roman, which looks like an italic until it is measured. Setting
one string in both styles at 16px gives 150.6px against 161.9px in Charis, and
that difference is the test.

**Scale** (defined per surface as `--t-*`; the decision page is canonical).
Steps sit ~1.11–1.14 apart through the UI/prose range and open up at the top so
display type reads as a different register, not just bigger body text.

| Token | Size | Use |
| --- | --- | --- |
| `--t-micro` | 11px | uppercase labels |
| `--t-cap` | 12.5px | captions, citations |
| `--t-sm` | 14px | secondary prose |
| `--t-ui` | = `--t-sm` (14px) | UI rows, list items. Kept as an alias: four
  steps inside four and a half pixels read as carelessness, not hierarchy |
| `--t-body` | 16px | long-form reading, in the body face — the serif and the
  extra pixel and a half belong to headings, case names and figures |
| `--t-lead` | 20px | standfirst |
| `--t-h3` | 22.5px | card titles |
| `--t-h2` | `clamp(23px, 2.4vw, 29px)` | section headings |
| `--t-h1` | `clamp(32px, 5vw, 68px)` | display |

- **Never go below 14px** for anything a reader must read. The page previously
  ran 12–13.5px and felt cramped.
- Reading measure is **80 characters** (`.read { max-width: 660px }`). Fira
  Sans setting Ukrainian at 16px runs **8.26px per character**.

  **How to measure it.** This line has been wrong four times and every wrong
  version used a shortcut. Dividing the column by an average glyph advance
  depends on which glyphs you average — alphabet or prose, spaces counted or
  not — and produced 8.04, 9.1 and 9.4px for the same face at the same size.
  Dividing a paragraph's characters by its line count is no better: the last
  line is partial but counts as whole, so every paragraph reads short.

  Measure it exactly instead. Walk a `Range` character by character over a
  paragraph's text node, group the characters into line boxes by the rounded
  `top` of each rect, discard each paragraph's final partial line, and average
  what is left. Twenty-seven full lines of this page's own prose give 8.26px
  per character, and that number is not an estimate — it is what the browser
  did.

  The history: 680px, called 60–70, actually 85. Then 560px — 68, and against
  a 1180px rail it read starved. Then 620px, called 77 and later 66, actually
  75, and the owner still read it as narrow twice. 660px is 80: wider, and
  still short of the 85 the first version was corrected away from.
- Uppercase labels get `letter-spacing: 0.14em`; display gets `-0.028em`.
- Slogans follow the brandbook: Charis SIL, uppercase, wide tracking.

### Spacing

A 4px grid. **The step number is the multiple of 4**, so `--space-6` is 24px
and there is nothing to memorise.

| Token | px | | Token | px |
| --- | --- | --- | --- | --- |
| `--space-1` | 4 | | `--space-8` | 32 |
| `--space-2` | 8 | | `--space-10` | 40 |
| `--space-3` | 12 | | `--space-12` | 48 |
| `--space-4` | 16 | | `--space-14` | 56 |
| `--space-5` | 20 | | `--space-16` | 64 |
| `--space-6` | 24 | | `--space-24` | 96 |
| `--space-7` | 28 | | | |

- **Snap to the nearest step.** If a value seems to need something in between,
  the layout is usually the problem, not the scale.
- **Fluid gutters stay in `clamp()`.** A scale governs rhythm, not responsive
  ranges — `padding-block: clamp(32px, 4vw, 56px)` is correct as written.
- Before this scale existed the site used **42 distinct spacing values, half of
  them off any grid** (3, 7, 9, 15, 22, 26, 34, 54…). Every gap was a fresh
  guess, which is exactly the drift a system is supposed to prevent.

### Shape & depth

| Token | Value |
| --- | --- |
| `--r-xs` … `--r-xl` | 6 / 10 / 14 / 20 / 28px |
| `--r-pill` | 999px — buttons, chips |
| `--shadow-sm/md/lg` | layered, low-opacity; deeper set in dark |

**Which component takes which step.** The scale above says what radii exist;
this says which one each component gets. Without this half, cards were built at
both 14px and 20px and both were "correct".

| Role | Token | px |
| --- | --- | --- |
| Button, chip, badge, toggle, progress bar | `--r-pill` | 999 |
| Card, panel, callout, findings block | `--r-md` | 14 |
| List row, small control | `--r-sm` | 10 |
| Large surface, modal, media frame | `--r-lg` | 20 |
| Illustration (lamp, scales, map markers) | — | bespoke, deliberately off-scale |

**Rule:** cards are **radius + soft elevation**, not a 1px rectangle. Hairlines
are for true dividers only. Full-bleed structural bands stay square — the
softness lives in the components, not the page architecture. Corners of 2–3px
are forbidden: they read as neither sharp nor round.

### Motion

`--ease` `cubic-bezier(.4,0,.2,1)` · `--ease-out` `cubic-bezier(.16,1,.3,1)` ·
`--dur` `180ms`. All motion is suppressed under `prefers-reduced-motion`.

---

## 2. Layout

- **One rail.** Every band uses `.rail`
  (`max-width: 1180px; margin-inline: auto; padding-inline: clamp(24px,5vw,72px)`).
  Masthead, lede, dashboard and reading column must share one left edge at every
  width. Mixing an inset band with a centred one is the bug that made the page
  look misaligned.
- Full-bleed bands alternate ground (`--brand-paper` ⇄ `--brand-paper-2`) to
  segment the page instead of drawing boxes — **and every band also carries a
  1px `--brand-seam` edge.** The alternation alone cannot be relied on:
  `--brand-paper` against `--brand-paper-2` is 1.06:1, and half the bands on a
  decision page are conditional, so the parity flips and two same-ground
  sections meet whenever one of them is absent. `--brand-rule` is a divider
  *inside* a component (1.22:1 on paper) and is not this.
- **Dark grounds do not alternate — they are islands.** The dark half of the
  palette has no room to layer: `--brand-night` against pure black is 1.12:1,
  so the whole range below the page's darkest ground is worth one eighth of a
  contrast step, and `--brand-night-2` sits 1.07:1 above it. Two dark bands in
  a row read as one field whatever values they take. A dark scene therefore
  gets paper on both sides. The decision page had four consecutive dark bands
  — masthead, dashboard, map, chronology, 4359px of it at 1440 — and the fix
  was to move the two that are not scenes onto paper, not to recolour them.
  The scenes that stay dark are the ones named above: the lamp stage, the map,
  the court mastheads.
- Instruments are **full width in one column**. Two dense columns of unrelated
  content read as clutter.

---

### Stylesheet scope

| Stylesheet | Loaded on | Rule |
| --- | --- | --- |
| `globals.css` | everything | tokens, focus ring, motion baseline |
| `[locale]/shared.css` | every localized page | **only** genuinely cross-surface primitives (the status badge) |
| `[locale]/home.css` | the home page | imported by `page.tsx`, not the layout |
| `cases/case.css` | decision pages | every rule scoped under `.casepage` |
| `registry/registry.css` | the registry | scoped |
| `nasvitlo/header.css` | wherever `<Header>` renders | owns its own chrome |

**A surface's stylesheet is imported by that surface, never by the layout.**
`home.css` used to load from `[locale]/layout.tsx`, which put **399 unscoped
rules on the registry and decision pages too**. That is not hypothetical: its
global `.btn { border: 2px solid var(--red) }` reached the decision page's
primary call to action, so the button wore a 2px border in the exact colour
this system reserves for a finding of breach — plus uppercase and letter
spacing it never asked for.

If two surfaces need the same rule, it moves to `shared.css` and is deleted
from both. Two definitions of one class name is always a bug in waiting.

## 3. Components

- **Header** owns its chrome (`components/nasvitlo/header.css`) so any page
  that renders it gets the responsive collapse and the drawer. It is rendered
  once, in the locale layout, with one ground on every page — it used to be
  transparent over the home page's lamp and `#14100e` on the decision pages,
  which is three different headers on one site.
- **Light is the site's semantics, not a switch.** There is no theme toggle.
  A decision that has been written up glows — a filled gold dot with a halo, in
  the registry and on the map alike — and one still in preparation is a hollow
  ring. Selecting a marker turns its light up rather than drawing a box round
  it.
- **Side nav** (`PageNav`, `components/cases/PageNav.tsx`) is sticky with
  scrollspy, collapsing to a sticky bar
  under 1000px.
- **Buttons** are pills; primary is cherry with elevation, ghost is a hairline
  that warms to gold on hover.
- **Cards** lift 2px on hover where they are links.

---

## 4. Enforcement

    npm run design    # this document, checked
    npm run check     # design + tsc + eslint

`scripts/design-lint.mjs` reads the scale out of `globals.css` — it cannot
drift from the system it enforces — and fails the run on a font size off the
`--t-*` steps, a padding/margin/gap off the 4px grid, a colour literal outside
`globals.css`, or a `fontSize` set inline in JSX.

This exists because everything above was already written down and largely
ignored. An audit on 26 August 2026 measured 94 hard-coded font sizes producing
**26 distinct sizes on a nine-step scale**, 151 off-grid spacing values, 13
colour literals, and three sibling headings of the same rank at 31px, 27px and
26px — set as inline React styles, where no stylesheet could reach them. None
of that was visible to anyone reading the code file by file.

Three things are not violations, and the linter knows it: authored
illustrations (the lamp, the projector, the map) keep their own register;
`@media print` wants real black on real white; and lengths under 8px are
hairlines and optical nudges rather than rhythm. Anything else that genuinely
has no token wants a token in `globals.css` — not an exception. The escape
hatch, `/* design-lint-ignore <rule>: <reason> */`, needs a reason to parse at
all, and there are exactly two in the repository: the lamp's clearance above
the wordmark, and a padding measured against the width of the map's zoom
control.

---

## 5. Non-negotiables

- **Accessibility.** One `:focus-visible` ring covers every control, switching
  to lamp gold on dark scenes. AA contrast everywhere. Reduced motion honoured.
- **Citability.** Decision pages carry metadata, canonical, hreflang and JSON-LD
  (`Article` + `FAQPage` + `BreadcrumbList`). This archive exists to be quoted.
- **Weight.** Ship lean: the map is baked to SVG at build time from a coarse
  atlas rather than pulling a runtime library. No CDN dependencies — the CSP and
  the preview sandbox both block them.
- **Bilingual.** Every human-facing string is `Localized`. Verbatim judgment
  prose stays in its source language; the chrome around it is translated.

## 6. Deliberately rejected

Gamification, dopamine palettes, maximalism, collage, retrofuturism, 3D/WebGL,
AI chatbots and voice UI. They fight the subject matter — this is a record of a
war — or add weight without payoff. Full neo-brutalism (0px, hairlines, zero
shadow) was considered and declined: our peers in legal tech read as calm and
institutional, and that is what earns a citation.

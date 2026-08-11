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
reads `var(--brand-*)`. Dark mode flips these same tokens, so the whole site
follows without any component owning a dark variant.

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
| `--brand-night` | `#17110f` | — | scenes dark in *both* themes |

**Rules**

- **Never introduce a hex in a component or section file.** If a value is
  missing, add a token. Literals do not follow the theme — that is exactly how
  `--pgold`/`--pred` ended up at 3.3:1 and 2.7:1 on the dark ground.
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

**Scale** (defined per surface as `--t-*`; the decision page is canonical).
Steps sit ~1.11–1.14 apart through the UI/prose range and open up at the top so
display type reads as a different register, not just bigger body text.

| Token | Size | Use |
| --- | --- | --- |
| `--t-micro` | 11px | uppercase labels |
| `--t-cap` | 12.5px | captions, citations |
| `--t-sm` | 14px | secondary prose |
| `--t-ui` | 15.5px | UI rows, list items |
| `--t-body` | 17.5px | long-form reading |
| `--t-lead` | 20px | standfirst |
| `--t-h3` | 22.5px | card titles |
| `--t-h2` | `clamp(23px, 2.4vw, 29px)` | section headings |
| `--t-h1` | `clamp(32px, 5vw, 68px)` | display |

- **Never go below 14px** for anything a reader must read. The page previously
  ran 12–13.5px and felt cramped.
- Reading measure stays **60–70 characters** (`.read { max-width: 680px }`).
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
- Full-bleed bands alternate ground (`--brand-paper` ⇄ `--brand-paper-2` ⇄
  `--brand-night`) to segment the page instead of drawing boxes.
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
  that renders it gets the responsive collapse and the drawer. Pages without
  the lamp backdrop set `--nsv-header-bg`.
- **Theme toggle** is a lamp that is lit or out — the site's own metaphor, not
  a generic sun/moon. Applied before first paint by an inline script.
- **Side nav** (`SideToc`) is sticky with scrollspy, collapsing to a sticky bar
  under 1000px.
- **Buttons** are pills; primary is cherry with elevation, ghost is a hairline
  that warms to gold on hover.
- **Cards** lift 2px on hover where they are links.

---

## 4. Non-negotiables

- **Accessibility.** One `:focus-visible` ring covers every control, switching
  to lamp gold on dark scenes. AA contrast everywhere. Reduced motion honoured.
- **Citability.** Decision pages carry metadata, canonical, hreflang and JSON-LD
  (`Article` + `FAQPage` + `BreadcrumbList`). This archive exists to be quoted.
- **Weight.** Ship lean: the map is baked to SVG at build time from a coarse
  atlas rather than pulling a runtime library. No CDN dependencies — the CSP and
  the preview sandbox both block them.
- **Bilingual.** Every human-facing string is `Localized`. Verbatim judgment
  prose stays in its source language; the chrome around it is translated.

## 5. Deliberately rejected

Gamification, dopamine palettes, maximalism, collage, retrofuturism, 3D/WebGL,
AI chatbots and voice UI. They fight the subject matter — this is a record of a
war — or add weight without payoff. Full neo-brutalism (0px, hairlines, zero
shadow) was considered and declined: our peers in legal tech read as calm and
institutional, and that is what earns a citation.

# Архітектура zivik-platform (насвітло)

Довідник рішень щодо структури проєкту. Оновлюйте при змінах.

## Стек

- **Next.js 16** (App Router, React 19) — ⚠️ ця версія має ламкі зміни; перед кодом
  дивіться `node_modules/next/dist/docs/`. Middleware тут називається **`proxy.ts`**.
- **TypeScript** (`strict`), **Tailwind CSS v4** (дизайн-токени в `globals.css`).
- **i18n**: URL-локалі `/uk`, `/en` через `src/proxy.ts` + сегмент `app/[locale]`.
- **Карта**: `d3-geo` + `topojson-client` + дані `world-atlas` (React-компонент, без CDN/iframe).
- **Контент/адмінка**: **Payload CMS** (+ `@payloadcms/db-postgres`) — підключається за
  інтерфейсом `ContentRepository` без переписування UI. Ставиться на Node LTS.
- **Форми**: `react-hook-form` + `zod`. **Іконки**: `lucide-react`.
- **Шрифти**: Fira Sans через `next/font`; Charis SIL — self-host (`next/font/local`).

## Структура тек

```
src/
  proxy.ts                 # редірект / -> /uk, визначення локалі
  app/
    layout.tsx             # кореневий layout (html/body, база)
    [locale]/              # локалізовані сторінки
      layout.tsx           # словник, метадані (hreflang/canonical), <html lang>
      page.tsx             # головна: композиція секцій
    sitemap.ts, robots.ts  # SEO
    globals.css            # токени (палітра насвітла) + tailwind
  i18n/
    config.ts              # locales, defaultLocale, Locale
    dictionaries.ts        # getDictionary, hasLocale
    dictionaries/{uk,en}.ts
  content/                 # ДАНІ (сьогодні файли, завтра Payload)
    types.ts               # моделі: Court, RegistryCase, MapEvent, Partner...
    *.ts                   # дані
    repository.ts          # ContentRepository (інтерфейс) + fileRepository
  components/
    nasvitlo/*             # секції головної
    ui/*                   # спільні примітиви (Button, Chip, Card)
  lib/                     # seo.ts, утиліти
```

## Куди класти матеріали

| Тип | Місце |
|---|---|
| Логотипи бренду/партнерів, favicon, OG | `public/logos/`, `public/logos/partners/`, `public/og/` |
| Публічні документи (PDF рішень) | `public/documents/` |
| Шрифти (self-host) | `public/fonts/` |
| Двомовні описи (суди, справи, події) | `src/content/*.ts` (дані, не в компонентах) |
| Оригінали досліджень (.docx/.pdf) | поза `public/` (тека «zivik materials») |

Коли зʼявиться Payload — медіа вантажаться через адмінку в колекцію `media`,
описи стають полями колекцій. `public/` + `src/content/` — їхні «попередники».

## Дизайн-напрям (bespoke, не «ШІ-вигляд»)

Естетика — **редакційна / друкована** (правничий журнал), а не generic-компонентна.

- Наскрізна **метафора світла** (лампа лишається): «освітлене» vs «у черзі», сутінки→світло.
- Сильна типо-ієрархія: display-серіф (Charis SIL) vs body-санс (Fira Sans), small-caps eyebrows.
- **Мікротипографіка**: правильні лапки/тире, нерозривні пробіли, `tabular-nums` для дат/чисел,
  висяча пунктуація. Розглянути `typograf` для українського тексту.
- Верстка: CSS Grid + **container queries** (`@container`) + fluid type (`clamp()`), навмисна асиметрія.
- Hairline-бордюри, гострі кути (radius ~2px), тепла паперова палітра — **без** rounded-2xl/тіней/градієнтів.
- **Headless-примітиви** (`@radix-ui/react-*` або `react-aria-components`) — доступність без generic-вигляду;
  стилізуються власними токенами в `components/ui/*`.
- Анімація привʼязана до метафори (scroll-driven / `motion`), з повагою до `prefers-reduced-motion`.
- Власні data-viz (`d3`/`visx`) замість стокових ілюстрацій.

## Двомовність (i18n)

- Кожна мова — окрема адреса (`/uk/...`, `/en/...`) для SEO та `hreflang`.
- UI-рядки: `src/i18n/dictionaries/`. Доменні описи: `src/content/` з полями на мову.
- Дефолт — `uk`; `proxy.ts` редіректить `/` та шляхи без локалі.

## SEO

- `generateMetadata` на локаль: `title`/`description`, Open Graph, Twitter,
  `alternates` (canonical + `hreflang` між `/uk` і `/en`).
- `app/sitemap.ts`, `app/robots.ts`, JSON-LD (структуровані дані), правильний `<html lang>`.

## Середовище розробки

- `next dev`/`next build` **не стартують на Node 23** (зависають). Потрібен **Node 22 LTS**
  (закріплено у `.node-version`). Тут встановлено keg-only через Homebrew:
  `brew install node@22`. Запуск, не змінюючи глобальний node:
  ```bash
  export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
  npm run dev
  ```
  (або додайте цей рядок у `~/.zshrc`). Ця машина дуже повільна: старт ~95с,
  перша компіляція роуту ~2хв, далі — миттєво (кеш).
- Стороннє попередження про «workspace root»: є зайвий `~/package-lock.json`.
  Прибрати його або задати `turbopack.root` у `next.config.ts`.

## Наступні кроки

1. Перенести головну на `app/[locale]` + компоненти (адаптив, 2 мови).
2. Карту переписати на `d3-geo` React-компонент.
3. Підняти Payload CMS (Node LTS) + БД, реалізувати `PayloadRepository`.
4. Мігрувати `/reader`, `/atlas` під локалі.
5. Тести (Vitest + Playwright), CI (GitHub Actions).

---

## Decision pages: one template, optional instruments (added 2026-08)

Every decision page renders from `src/app/[locale]/cases/[slug]/page.tsx`.
There is no per-case page code: a case is a data module in
`src/content/summaries/<slug>.ts` that fills only the instruments it has.
`src/content/summaries/index.ts` is the single slug→summary map — the page
template and the sitemap both read it, and it throws at build time if the
registry (`cases.ts` `summarySlug`) and the map disagree.

A summary is two layers with a hard boundary:

- **Verbatim** (`<slug>.verbatim.json`, mirrored 1:1 by `<slug>.uk.json` —
  draft translations pending legal review): the source doc's tab, ingested
  unedited, quirks and all. Four tabs (DTEK, ECHR, Finland, Hague) were
  ingested before the doc marked them finalized; re-ingest when it does.
- **Visualization** (`<slug>.ts`): everything else. Every value either
  restates the verbatim or carries a citation in `sources`; the research
  trail per case lives in `docs/research/<slug>-sources.md`. `asOf` stamps
  when the context layer was last verified and feeds `dateModified` and the
  sitemap's `lastModified`.

Optional instruments → sections (each renders only if its field is set):
`warrants` (ICC ladder of command), `objections` (+`benchSize` for bench
votes), `attribution`, `afterlife`, `amounts`, `takings`,
`provisionalMeasures`, `theatres` (+`mapFocus` for the seat and reach line),
`timelineTracks` (filterable timeline; filter persists as
`#chronology:<track>`). Outcomes cover courts (violation pair), arbitration
(granted/rejected/not-decided) and criminal verdicts (convicted/acquitted).

Client-prop hygiene: the interactive components under `src/components/cases/`
take **locale-resolved strings**, never `{uk, en}` pairs — client props
serialize into the page payload, and raw pairs shipped both languages to
every reader. The template resolves with `pick()` at the call site.

Share cards: `scripts/og-cards.py` regenerates `public/og/` (site card +
one per case). The legal verification checklist source is
`docs/verification/checklist.html`.

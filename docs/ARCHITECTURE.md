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

- `next dev`/`next build` **не стартують на Node 23** (зависають). Використовуйте
  **Node 20/22 LTS** (`nvm install 20 && nvm use 20`). Перевірка тут велася статично.

## Наступні кроки

1. Перенести головну на `app/[locale]` + компоненти (адаптив, 2 мови).
2. Карту переписати на `d3-geo` React-компонент.
3. Підняти Payload CMS (Node LTS) + БД, реалізувати `PayloadRepository`.
4. Мігрувати `/reader`, `/atlas` під локалі.
5. Тести (Vitest + Playwright), CI (GitHub Actions).

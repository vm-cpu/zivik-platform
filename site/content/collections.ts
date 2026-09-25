/**
 * The archive's content model in EmDash, and the two-way mapping between an
 * EmDash row and the value `src/content/*.ts` exports.
 *
 * One description per collection drives three things:
 *   - the EmDash schema (`seedSchema`) — the collections and fields editors
 *     see in /_emdash/admin;
 *   - the seed (`toRow`) — today's file content, imported into EmDash;
 *   - the build snapshot (`fromRow`) — published rows, turned back into
 *     exactly the value the file exports, so every consumer, derivation and
 *     build-time check in src/content keeps working unchanged.
 *
 * The round trip is checked: `npm run cf:content -- --check` asserts that
 * `fromRow(toRow(x))` deep-equals `x` for every record. A field added to a
 * type in src/content/types.ts and not described here fails that check
 * instead of quietly disappearing from the Cloudflare build.
 *
 * Bilingual strings (`Localized`) become a pair of fields, `name_uk` and
 * `name_en`, side by side in one entry. EmDash's own i18n (a row per locale)
 * is not used: nearly every record here mixes translated text with facts
 * that must not differ between languages — an amount, a docket year, a
 * status — and a row per locale would make every such fact editable twice.
 * It would also force the Ukrainian pages off their `/uk` prefix.
 */

export type FieldType =
  | "string"
  | "text"
  | "url"
  | "integer"
  | "number"
  | "boolean"
  | "select"
  | "json";

/** One property of the exported value, stored as one field (or two, if localized). */
export interface Prop {
  /** Property name on the exported value. */
  path: string;
  /** Admin label. */
  label: string;
  type: FieldType;
  /** `{ uk, en }` in the value, `<slug>_uk` + `<slug>_en` in EmDash. */
  localized?: boolean;
  /** Field slug in EmDash; defaults to `path` in snake_case. */
  slug?: string;
  required?: boolean;
  /** The value may be an explicit `null` (as opposed to absent). */
  nullable?: boolean;
  options?: readonly string[];
  /** For `text`: an array of paragraphs, stored as text separated by blank lines. */
  paragraphs?: boolean;
  /** Admin help text. */
  help?: string;
}

export interface CollectionSpec {
  /** EmDash collection slug. */
  slug: string;
  label: string;
  labelSingular: string;
  /** How the value is exported: an ordered array, a record keyed by slug, or one object. */
  shape: "array" | "record" | "single";
  /** Where the value lives today — the snapshot replaces this export's initializer. */
  source: { file: string; export: string };
  /** The entry slug for a value (array/single shapes). */
  key?: (value: Record<string, unknown>, index: number) => string;
  /** Field slug shown as the entry's title in the admin list. */
  titleField: string;
  /** Admin sidebar folder. */
  group: string;
  props: Prop[];
  /**
   * A field that exists only to make the admin list readable. Written by the
   * seed; never read back, so editing it changes nothing on the site.
   */
  listLabel?: (value: Record<string, unknown>, key: string) => string;
}

/** Slug of the `listLabel` field, and of the array-order field. */
export const LIST_LABEL = "list_label";
export const POSITION = "position";

const snake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
export const slugOf = (p: Prop) => p.slug ?? snake(p.path);

type L = { uk: string; en: string };

const GROUP_LIBRARY = "Бібліотека";
const GROUP_MAP = "Мапа";
const GROUP_SITE = "Сайт";

const STAGES = [
  "upcoming",
  "preliminary",
  "investigation",
  "merits",
  "satisfaction",
  "appeal",
  "remitted",
  "enforcement",
  "suspended",
  "frozen",
  "concluded",
] as const;
const OUTCOMES = ["judgment", "award", "verdict", "liability", "upheld", "warrant", "procedural"] as const;

export const COLLECTIONS: CollectionSpec[] = [
  {
    slug: "institutions",
    label: "Інституції",
    labelSingular: "Інституція",
    shape: "array",
    source: { file: "src/content/institutions.ts", export: "institutions" },
    key: (v) => String(v.id),
    titleField: "name_uk",
    group: GROUP_LIBRARY,
    props: [
      { path: "id", label: "Ідентифікатор", type: "string", required: true, slug: "key" },
      { path: "abbr", label: "Абревіатура", type: "string", localized: true, required: true },
      { path: "name", label: "Назва", type: "string", localized: true, required: true },
      { path: "seat", label: "Місто", type: "string", localized: true, nullable: true },
      {
        path: "category",
        label: "Категорія",
        type: "select",
        options: ["international", "arbitration", "national", "executive"],
        required: true,
      },
      { path: "phase1", label: "У реєстрі на головній (фаза 1)", type: "boolean" },
      { path: "order", label: "Порядок", type: "integer", required: true, slug: "rank" },
    ],
  },
  {
    slug: "cases",
    label: "Провадження",
    labelSingular: "Провадження",
    shape: "array",
    source: { file: "src/content/cases.ts", export: "registryCases" },
    key: (v) => String(v.id),
    titleField: LIST_LABEL,
    group: GROUP_LIBRARY,
    listLabel: (v) => String(v.nameUk ?? v.nameShort ?? v.name),
    props: [
      { path: "id", label: "Ідентифікатор", type: "string", required: true, slug: "key" },
      { path: "institutionId", label: "Інституція (id)", type: "string", required: true },
      { path: "partOf", label: "Частина провадження (id)", type: "string" },
      { path: "actName", label: "Назва акту в рядку батьківського провадження", type: "string", localized: true },
      { path: "name", label: "Офіційна назва (цитування)", type: "text", required: true },
      { path: "nameShort", label: "Коротка назва", type: "string" },
      { path: "nameUk", label: "Назва українською", type: "string" },
      { path: "type", label: "Тип", type: "string", localized: true, required: true },
      { path: "stage", label: "Стадія", type: "select", options: STAGES },
      { path: "outcome", label: "Результат", type: "select", options: OUTCOMES },
      { path: "status", label: "Статус", type: "text", localized: true, required: true },
      { path: "year", label: "Рік початку", type: "integer", nullable: true },
      {
        path: "decidedOn",
        label: "Дата рішення",
        type: "json",
        help: '{"precision":"day","iso":"2024-01-31","year":2024} або {"precision":"year","year":2024}',
      },
      { path: "amountUsd", label: "Сума у спорі, USD", type: "number", nullable: true },
      { path: "note", label: "Примітка", type: "text", localized: true, required: true },
      { path: "pages", label: "Сторінок у рішенні", type: "integer", nullable: true },
      { path: "decisionUrl", label: "Посилання на рішення", type: "url", nullable: true },
      {
        path: "decisionUrlKind",
        label: "Що за посиланням",
        type: "select",
        options: ["press-release", "case-page", "party", "database", "report"],
      },
      { path: "summarySlug", label: "Огляд (slug)", type: "string" },
      { path: "lit", label: "Опрацьовано («освітлено»)", type: "boolean" },
    ],
  },
  {
    slug: "partners",
    label: "Партнери",
    labelSingular: "Партнер",
    shape: "array",
    source: { file: "src/content/partners.ts", export: "partners" },
    key: (v) => String(v.id),
    titleField: "name_uk",
    group: GROUP_SITE,
    props: [
      { path: "id", label: "Ідентифікатор", type: "string", required: true, slug: "key" },
      { path: "name", label: "Назва", type: "string", localized: true, required: true },
      { path: "blurb", label: "Хто це", type: "text", localized: true },
      { path: "logo", label: "Логотип (шлях у /public)", type: "string" },
      { path: "url", label: "Сайт", type: "url" },
    ],
  },
  {
    slug: "team",
    label: "Команда",
    labelSingular: "Учасник команди",
    shape: "array",
    source: { file: "src/content/team.ts", export: "team" },
    key: (v) =>
      (v.name as L).en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    titleField: "name_uk",
    group: GROUP_SITE,
    props: [
      { path: "name", label: "Ім'я", type: "string", localized: true, required: true },
      {
        path: "role",
        label: "Роль",
        type: "string",
        localized: true,
        required: true,
        help: "Англійська роль — ключ групи на /about (див. teamGroups у src/content/team.ts).",
      },
      { path: "photo", label: "Фото (шлях у /public/team)", type: "string" },
    ],
  },
  {
    slug: "about",
    label: "Про проєкт",
    labelSingular: "Про проєкт",
    shape: "single",
    source: { file: "src/content/about.ts", export: "about" },
    key: () => "about",
    titleField: "title_uk",
    group: GROUP_SITE,
    props: [
      { path: "title", label: "Заголовок", type: "string", localized: true, required: true },
      {
        path: "paragraphs",
        label: "Абзаци",
        type: "text",
        localized: true,
        paragraphs: true,
        required: true,
        help: "Абзаци розділяються порожнім рядком.",
      },
      {
        path: "links",
        label: "Посилання в тексті",
        type: "json",
        help: '{"uk":[{"text":"точний фрагмент абзацу","href":"https://…"}],"en":[…]}',
      },
    ],
  },
  {
    slug: "map_events",
    label: "Мапа: події",
    labelSingular: "Подія на мапі",
    shape: "array",
    source: { file: "src/content/map.ts", export: "MAP_EVENTS" },
    key: (v) => String(v.key),
    titleField: "title_uk",
    group: GROUP_MAP,
    props: [
      { path: "key", label: "Ідентифікатор", type: "string", required: true },
      { path: "area", label: "Територія", type: "select", options: ["country", "crimea", "east"] },
      { path: "weight", label: "Вага (розмір маркера)", type: "number", required: true },
      { path: "when", label: "Коли", type: "string", localized: true, required: true },
      { path: "title", label: "Заголовок", type: "string", localized: true, required: true },
      { path: "note", label: "Опис", type: "text", localized: true, required: true },
      { path: "courts", label: "Суди (ключі MAP_COURTS)", type: "json", required: true },
      { path: "forums", label: "Форуми", type: "text", localized: true, required: true },
      { path: "count", label: "Скільки", type: "string", localized: true, required: true },
      { path: "cases", label: "Огляди (slug)", type: "json" },
      { path: "linksOutsideCount", label: "Посилання виходять за межі лічильника", type: "boolean" },
    ],
  },
  {
    slug: "map_courts",
    label: "Мапа: суди",
    labelSingular: "Суд на мапі",
    shape: "array",
    source: { file: "src/content/map.ts", export: "MAP_COURTS" },
    key: (v) => String(v.key),
    titleField: "city_uk",
    group: GROUP_MAP,
    props: [
      { path: "key", label: "Ідентифікатор", type: "string", required: true },
      { path: "city", label: "Місто", type: "string", localized: true, required: true },
      { path: "at", label: "«У місті»", type: "string", localized: true, required: true },
      { path: "institutionIds", label: "Інституції (id)", type: "json", required: true },
      { path: "seats", label: "Суди в цьому місті", type: "json", required: true },
      { path: "offMap", label: "Поза рамкою мапи", type: "boolean" },
      { path: "offAt", label: "Напрям поза рамкою", type: "json" },
      { path: "labelDy", label: "Зсув підпису", type: "number" },
    ],
  },
  {
    slug: "map_countries",
    label: "Мапа: країни",
    labelSingular: "Країна на мапі",
    shape: "array",
    source: { file: "src/content/map.ts", export: "MAP_COUNTRIES" },
    key: (v) => String(v.key).toLowerCase(),
    titleField: "name_uk",
    group: GROUP_MAP,
    props: [
      { path: "key", label: "Ідентифікатор (назва в europe-map.json)", type: "string", required: true },
      { path: "name", label: "Назва", type: "string", localized: true, required: true },
      { path: "at", label: "«У країні»", type: "string", localized: true, required: true },
      { path: "courts", label: "Суди (ключі MAP_COURTS)", type: "json", required: true },
    ],
  },
  {
    slug: "summaries",
    label: "Огляди рішень",
    labelSingular: "Огляд рішення",
    shape: "record",
    source: { file: "src/content/summaries/index.ts", export: "SUMMARIES" },
    titleField: LIST_LABEL,
    group: GROUP_LIBRARY,
    listLabel: (v, key) => (v.title as L | undefined)?.uk ?? key,
    props: [
      {
        path: "",
        slug: "document",
        label: "Огляд (JSON)",
        type: "json",
        required: true,
        help: "Уся структура огляду — див. DecisionSummary у src/content/summaries/types.ts.",
      },
    ],
  },
];

/* ─── Row ⇄ value ──────────────────────────────────────────────────────── */

export type Row = Record<string, unknown>;

function encode(p: Prop, v: unknown): unknown {
  if (v === undefined || v === null) return null;
  if (p.type === "json") return v;
  if (p.paragraphs) return (v as string[]).join("\n\n");
  return v;
}

function decode(p: Prop, v: unknown): unknown {
  if (v === undefined || v === null || v === "") return p.nullable ? null : undefined;
  switch (p.type) {
    case "json":
      return typeof v === "string" ? JSON.parse(v) : v;
    case "boolean":
      return v === true || v === 1 || v === "1" || v === "true";
    case "integer":
    case "number":
      return typeof v === "number" ? v : Number(v);
    default:
      return p.paragraphs ? String(v).split(/\n\s*\n/) : v;
  }
}

/** The exported value → the fields of an EmDash entry. */
export function toRow(spec: CollectionSpec, value: Record<string, unknown>): Row {
  const row: Row = {};
  for (const p of spec.props) {
    const slug = slugOf(p);
    if (p.path === "") {
      row[slug] = value;
      continue;
    }
    const v = value[p.path];
    if (p.localized) {
      const l = v as L | null | undefined;
      row[`${slug}_uk`] = encode(p, l?.uk);
      row[`${slug}_en`] = encode(p, l?.en);
    } else {
      row[slug] = encode(p, v);
    }
  }
  return row;
}

/** An EmDash entry's fields → the value the file would have exported. */
export function fromRow(spec: CollectionSpec, row: Row): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const p of spec.props) {
    const slug = slugOf(p);
    if (p.path === "") return decode(p, row[slug]) as Record<string, unknown>;
    let v: unknown;
    if (p.localized) {
      const a = decode(p, row[`${slug}_uk`]);
      const b = decode(p, row[`${slug}_en`]);
      v = a == null && b == null ? (p.nullable ? null : undefined) : { uk: a, en: b };
    } else {
      v = decode(p, row[slug]);
    }
    if (v !== undefined) out[p.path] = v;
  }
  return out;
}

/** EmDash seed field definitions for a collection. */
export function seedFields(spec: CollectionSpec) {
  const fields: Record<string, unknown>[] = [];
  if (spec.listLabel) {
    fields.push({
      slug: LIST_LABEL,
      label: "Назва в списку адмінки",
      type: "string",
      options: { helpText: "Лише для списку в адмінці; на сайт не впливає." },
    });
  }
  if (spec.shape === "array") {
    fields.push({
      slug: POSITION,
      label: "Позиція в списку",
      type: "integer",
      required: true,
      indexed: true,
      options: { helpText: "Порядок, у якому записи йдуть на сайті (менше — вище)." },
    });
  }
  for (const p of spec.props) {
    const base = {
      type: p.type,
      ...(p.options ? { validation: { options: [...p.options] } } : {}),
      ...(p.help ? { options: { helpText: p.help } } : {}),
    };
    const slug = slugOf(p);
    if (p.localized) {
      fields.push({ slug: `${slug}_uk`, label: `${p.label} (UA)`, required: !!p.required, searchable: p.type !== "json", ...base });
      fields.push({ slug: `${slug}_en`, label: `${p.label} (EN)`, required: !!p.required, searchable: p.type !== "json", ...base });
    } else {
      fields.push({ slug, label: p.label, required: !!p.required, ...base });
    }
  }
  return fields;
}

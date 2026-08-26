"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { defaultLocale, foreignLang, isLocale } from "@/i18n/config";
import { plural, type PluralForms } from "@/i18n/plural";
import type { CaseDate, CaseOutcomeKey, CaseStageKey } from "@/content/types";

/* ============================================================================
   Search normalisation.

   Thirty-nine rows in memory: a well-chosen set of fields plus normalisation
   beats a search library, and leaves the matching auditable. Lower-case, strip
   combining marks (so "Одеса" and "Одеса" agree however they were typed), turn
   every punctuation run into a space — that is what makes "36958/21", "ICJ GL
   182" and "PCA 2015-07" behave as ordinary token queries.
   ========================================================================== */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // ʼ / ' / ’ are the same apostrophe to a reader typing "об'єкти".
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Cheap Latin ⇄ Cyrillic tolerance. Only pairs the record already contains in
 * both scripts — a reader typing «Гаага» must reach English-titled rows, and a
 * reader typing "ECHR" must reach rows filed under «ЄСПЛ». This expands the
 * *query*, never the data, so nothing here can put a word into the archive.
 */
const ALIASES: ReadonlyArray<readonly string[]> = [
  ["espl", "yespl", "ecthr", "echr", "єспл"].map(norm),
  ["mks", "мкс", "icc"].map(norm),
  ["ms oon", "мс оон", "icj"].map(norm),
  ["gaaga", "гаага", "hague"].map(norm),
  ["strasburg", "страсбург", "strasbourg"].map(norm),
  ["krym", "крим", "crimea"].map(norm),
  ["naftogaz", "нафтогаз"].map(norm),
  ["gazprom", "газпром"].map(norm),
  ["oschadbank", "ощадбанк"].map(norm),
  ["ukraina", "україна", "ukraine"].map(norm),
  ["rosiia", "росія", "russia"].map(norm),
];

/** Every spelling a token should also be tried under. */
function expand(token: string): string[] {
  const group = ALIASES.find((g) => g.includes(token));
  return group ? [...group] : [token];
}

/**
 * Tokens match at the start of a word, so "naftog" still finds Naftogaz but
 * "art" does not find "quartz". The haystack is already a space-separated
 * normalised string, so a leading space is all the boundary needed.
 */
function hits(hay: string, token: string): boolean {
  return expand(token).some((v) => ` ${hay}`.includes(` ${v}`));
}

/* ============================================================================
   Row model
   ========================================================================== */

/** One case, already localized to plain strings on the server. */
export interface RegRow {
  id: string;
  courtId: string;
  /** Abbreviation in the active locale — the visible court cell. */
  court: string;
  /** Sort position of the institution, so "by court" follows the archive. */
  courtOrder: number;
  name: string;
  note: string;
  /** Procedural posture; null where the record does not fix one. */
  stage: CaseStageKey | null;
  stageLabel: string | null;
  /** What the forum issued; null where the record names no act. */
  outcome: CaseOutcomeKey | null;
  outcomeLabel: string | null;
  /** Full status wording, in the active locale. */
  status: string;
  /** Year the proceeding was commenced. */
  year: number | null;
  /**
   * Decision date where the record fixes an exact day. A year-only record
   * cannot produce one — a bare year stays in `year`, and is never widened
   * into 1 January, which would be a fabricated fact and a corrupted sort.
   */
  decided: Extract<CaseDate, { precision: "day" }> | null;
  /** `decided`, already formatted for the locale. */
  decidedLabel: string | null;
  lit: boolean;
  /** Summary slug where one exists — the key into the content index. */
  slug: string | null;
  /** Whether the record holds a link to a court document for this row. */
  hasDoc: boolean;
  /** Subject-matter field, as a stable key and as a label in the locale. */
  fieldKey: string;
  fieldLabel: string;
  /** Decision page, when a summary is published. Otherwise `/cases/{id}`. */
  href: string | null;
  /** Raw searchable text, grouped so a match can say where it came from. */
  find: {
    /** Case name and note — the two fields the row shows. */
    visible: string;
    /** Institution abbreviation, name and seat, in *both* locales. */
    court: string;
    /** Free-text status plus both tag labels, in both locales. */
    status: string;
    /** Subject-matter type, in both locales. */
    type: string;
    /** Years and dates as digits. */
    date: string;
  };
}

type FindGroup = keyof RegRow["find"];
const HIDDEN_GROUPS: FindGroup[] = ["court", "status", "type", "date"];

/* ============================================================================
   Content search — the write-ups, not just the row.

   The index is built at build time (`content/search-index.ts`); everything
   here is the read side. The shape is deliberately dumb: a sorted array of
   truncated term keys, and for each key a string of two-character postings
   (case index, then section index, both base 36). Nothing is parsed until a
   reader types.
   ========================================================================== */

/** What the server hands over. Kept structural so the type is not imported
 *  from a module that would drag the summaries into the client graph. */
export interface ContentIndexProp {
  /** Summary slugs, in posting order. */
  cases: string[];
  /** Section ids and their labels, in posting order. */
  sections: Array<{ id: string; label: string }>;
  /** Sorted term prefixes → concatenated postings. */
  terms: Record<string, string>;
  /** Characters kept per term. A query token is truncated the same way. */
  prefix: number;
}

/** Index of the first key that is >= `needle`, over a sorted array. */
function lowerBound(keys: string[], needle: string): number {
  let lo = 0;
  let hi = keys.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (keys[mid] < needle) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Sections that carry one query token, as case index → set of section indices.
 *
 * A token is truncated to the index's prefix length and then matched as a
 * PREFIX over the key set, which is what makes a short query behave: three
 * letters reach every term that starts with them. A token at or past the
 * prefix length can only match its own key, because no key is longer than the
 * prefix — so one code path covers both.
 */
function tokenHits(
  idx: ContentIndexProp,
  keys: string[],
  token: string,
): Map<number, Set<number>> {
  const out = new Map<number, Set<number>>();
  for (const variant of expand(token)) {
    const needle = variant.slice(0, idx.prefix);
    if (!needle) continue;
    for (let i = lowerBound(keys, needle); i < keys.length; i++) {
      const key = keys[i];
      if (!key.startsWith(needle)) break;
      const postings = idx.terms[key];
      for (let j = 0; j + 1 < postings.length; j += 2) {
        const ci = parseInt(postings[j], 36);
        const si = parseInt(postings[j + 1], 36);
        let set = out.get(ci);
        if (!set) out.set(ci, (set = new Set()));
        set.add(si);
      }
    }
  }
  return out;
}

/**
 * Which cases carry EVERY token somewhere in their write-up, and which of
 * their sections to point the reader at.
 *
 * Two levels of AND, and the difference matters. A case qualifies when each
 * token appears somewhere in it — that is what puts the row in the table. The
 * sections named on the row are the ones where every token appears *together*,
 * because that is the screen the reader wants; when the tokens are scattered
 * across different sections there is no such screen, so the union is named
 * instead and the reader is told the truth by being given more than one place
 * to look.
 */
function contentMatches(
  idx: ContentIndexProp,
  keys: string[],
  tokens: string[],
): Map<number, number[]> {
  const out = new Map<number, number[]>();
  if (tokens.length === 0) return out;
  const perToken = tokens.map((t) => tokenHits(idx, keys, t));
  const first = perToken[0];
  for (const [ci, sections] of first) {
    if (!perToken.every((m) => m.has(ci))) continue;
    let together = [...sections];
    for (const m of perToken.slice(1)) {
      const other = m.get(ci)!;
      together = together.filter((si) => other.has(si));
    }
    if (together.length === 0) {
      const union = new Set<number>();
      for (const m of perToken) for (const si of m.get(ci)!) union.add(si);
      together = [...union];
    }
    out.set(ci, together.sort((a, b) => a - b));
  }
  return out;
}

/* ============================================================================
   Sorting
   ========================================================================== */

export type SortKey =
  | "year"
  | "decided"
  | "court"
  | "stage"
  | "outcome"
  | "readable"
  | "name";
type SortDir = "asc" | "desc";

/** Procedural order, so "by stage" reads as a life-cycle, not an alphabet. */
const STAGE_ORDER: CaseStageKey[] = [
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
];

/** Weight of the act, heaviest first. */
const OUTCOME_ORDER: CaseOutcomeKey[] = [
  "judgment",
  "award",
  "verdict",
  "liability",
  "upheld",
  "warrant",
  "order",
  "settlement",
  "rejected",
];

/** Absent dimensions rank after every present one, in either direction. */
function rank<T>(order: T[], value: T | null): number {
  if (value == null) return order.length;
  const i = order.indexOf(value);
  return i < 0 ? order.length : i;
}

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

/**
 * Every axis is a *primary* key only. The tail below runs after it, so equal
 * values never shuffle between renders and a second dimension is always doing
 * useful work: court, then most recent, then name, then id. That is the
 * "multiple parameters" the registry needed — several axes to choose from,
 * each with a fixed, meaningful secondary and a total tie-break.
 */
function tail(a: RegRow, b: RegRow): number {
  return (
    a.courtOrder - b.courtOrder ||
    (b.year ?? -Infinity) - (a.year ?? -Infinity) ||
    a.name.localeCompare(b.name) ||
    a.id.localeCompare(b.id)
  );
}

function compare(a: RegRow, b: RegRow, { key, dir }: SortState): number {
  const sign = dir === "asc" ? 1 : -1;
  let primary = 0;
  switch (key) {
    case "year":
      primary = (a.year ?? -Infinity) - (b.year ?? -Infinity);
      break;
    case "decided": {
      // A row with no decision date has nothing to sort by: it goes last in
      // both directions rather than pretending to be the oldest or the newest.
      if (!a.decided && !b.decided) return tail(a, b);
      if (!a.decided) return 1;
      if (!b.decided) return -1;
      primary = a.decided.iso.localeCompare(b.decided.iso);
      break;
    }
    case "court":
      primary = a.courtOrder - b.courtOrder;
      break;
    case "stage":
      primary = rank(STAGE_ORDER, a.stage) - rank(STAGE_ORDER, b.stage);
      break;
    case "outcome":
      primary = rank(OUTCOME_ORDER, a.outcome) - rank(OUTCOME_ORDER, b.outcome);
      break;
    case "readable":
      primary = Number(a.lit) - Number(b.lit);
      break;
    case "name":
      primary = a.name.localeCompare(b.name);
      break;
  }
  return primary * sign || tail(a, b);
}

/* ============================================================================
   Labels
   ========================================================================== */

/**
 * Moved to `@/i18n/plural`, and re-exported here so `registry/page.tsx` keeps
 * importing it from where it always has. It was defined in this file and
 * needed in three: the map's court caseload was the surface that went without,
 * and printed «1 проваджень» on six of nine courts because of it.
 */
export { plural };
export type { PluralForms };

export interface RegistryLabels {
  search: string;
  searchLabel: string;
  /** The grid's own name. It used to borrow `searchLabel`, so the table
   *  announced itself as "Search the registry, table". */
  tableLabel: string;
  courts: string;
  courtsAll: string;
  stages: string;
  stagesAll: string;
  outcomes: string;
  outcomesAll: string;
  /* Subject-matter field. Nine values, and every one of them is already in
     `content/cases.ts` as `type` — an authored vocabulary that covers all
     thirty-nine rows, was searchable and was not filterable. */
  fields: string;
  fieldsAll: string;
  /* What a reader can actually open. Two facts the record already fixes: a
     row has a summary on this site (`lit`), and a row has a link to the
     court's own document (`decisionUrl`). Seventeen of thirty-nine have no
     document link, which is exactly the thing a reader of a legal archive
     wants to filter on before citing. */
  materials: string;
  materialsAll: string;
  matLit: string;
  matDoc: string;
  sort: string;
  sortOpt: Record<string, string>;
  colCourt: string;
  colCase: string;
  /* The tag column used to be called «Теги», which named the widget rather
     than the facts in it. It is two columns now, each named for the dimension
     it carries and each sortable in its own right. */
  colStage: string;
  colOutcome: string;
  colDate: string;
  sortAsc: string;
  sortDesc: string;
  sortNone: string;
  results: PluralForms;
  ofTotal: string;
  combine: string;
  reset: string;
  /** Accessible name of the active-filter list. */
  activeFilters: string;
  /** Verb on each active-filter chip: «Прибрати фільтр: Суди — ЄСПЛ». */
  clearFilter: string;
  clearSearch: string;
  emptyHead: string;
  emptyBody: string;
  matched: string;
  /** Prefix on the line that names which part of a write-up matched. */
  matchedIn: string;
  group: Record<FindGroup, string>;
  decidedOn: string;
  noDate: string;
  stageName: string;
  outcomeName: string;
}

/** The eight axes offered by the sort control, in the order they are listed. */
const SORTS: Array<{ id: string; key: SortKey; dir: SortDir }> = [
  { id: "yearDesc", key: "year", dir: "desc" },
  { id: "yearAsc", key: "year", dir: "asc" },
  { id: "decidedDesc", key: "decided", dir: "desc" },
  { id: "readable", key: "readable", dir: "desc" },
  { id: "court", key: "court", dir: "asc" },
  { id: "stage", key: "stage", dir: "asc" },
  { id: "outcome", key: "outcome", dir: "asc" },
  { id: "name", key: "name", dir: "asc" },
];

/* ============================================================================
   Listbox — a real one.

   A native <select> cannot be styled past its closed state (the open popup is
   the OS's, not the page's) and `<select multiple>` is a scrolling box, not a
   dropdown. So: button + role="listbox", aria-activedescendant, full keyboard.
   ========================================================================== */

interface Opt {
  value: string;
  label: string;
  /** How many of the loaded rows carry this value. */
  count?: number;
}

function Listbox({
  label,
  allLabel,
  options,
  selected,
  onChange,
  multi,
  variant = "filter",
  summaryOverride,
  activeOverride,
}: {
  label: string;
  allLabel: string;
  options: Opt[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi: boolean;
  /**
   * Filtering and ordering are different acts, so they do not wear the same
   * control. A `filter` is an enclosed pill that names its dimension and
   * carries a count when it is narrowing; `sort` is an underlined text control
   * at the other end of the row that shows the order itself.
   */
  variant?: "filter" | "sort";
  /**
   * The sort state can also be set by clicking a column heading, and a heading
   * clicked twice reaches a direction no preset names. The control says what
   * the order actually is rather than falling back to «Спершу нові».
   */
  summaryOverride?: string;
  /**
   * Whether the control counts as "doing something". A filter decides that for
   * itself — anything chosen is narrowing — but every list is in some order,
   * so only the caller knows which order is the default one.
   */
  activeOverride?: boolean;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trigRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ buf: "", at: 0 });

  /* "Усі суди" is an option rather than a second control: one idiom for
     clearing, matching the СКИНУТИ button rather than competing with it.
     Ordering has no "all": every list is in *some* order, and the synthetic
     row listed «Спершу нові» twice — once as the clear-everything row and
     once as the preset that means exactly the same thing. */
  const rows: Opt[] = useMemo(
    () =>
      variant === "sort" ? options : [{ value: "", label: allLabel }, ...options],
    [allLabel, options, variant],
  );

  const chosen = rows.filter((r) => r.value !== "" && selected.includes(r.value));
  /* What the closed control shows. The sort control shows the order; a filter
     shows its own dimension plus a count, because *which* values are chosen is
     spelled out by the removable chips under the toolbar — repeating them
     inside the trigger is what made these read as form fields. */
  const summary =
    variant === "sort"
      ? (summaryOverride ?? chosen[0]?.label ?? allLabel)
      : label;
  const readback =
    variant === "sort"
      ? (summaryOverride ?? chosen[0]?.label ?? allLabel)
      : chosen.length === 0
        ? allLabel
        : chosen.map((c) => c.label).join(", ");
  const on = activeOverride ?? chosen.length > 0;

  const close = useCallback((focusTrigger: boolean) => {
    setOpen(false);
    if (focusTrigger) trigRef.current?.focus();
  }, []);

  const openAt = useCallback(
    (index: number) => {
      setActive(index);
      setOpen(true);
    },
    [],
  );

  // Focus follows the popup so the keyboard never lands on the page body.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      // The popup is about to be unmounted. If it is holding focus, hand it
      // back to the trigger first — otherwise focus falls to <body> and the
      // keyboard user is dropped at the top of the document. The browser still
      // moves focus on to whatever was clicked, when that is focusable.
      const inside = listRef.current?.contains(document.activeElement);
      setOpen(false);
      if (!inside) return;
      trigRef.current?.focus();
      /* …and again after the browser has run mousedown's own default action,
         which overrides the line above. Measured: focus did not fall all the
         way to <body>, but it did land on `main[tabindex="-1"]` — the nearest
         programmatically-focusable ancestor — so the keyboard user was still
         dropped out of the toolbar. Anything the reader actually clicked into
         is a real tab stop (tabIndex >= 0) and keeps the focus it just won. */
      requestAnimationFrame(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body || el.tabIndex < 0) trigRef.current?.focus();
      });
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = (value: string) => {
    if (value === "") {
      onChange([]);
      if (!multi) close(true);
      return;
    }
    if (!multi) {
      onChange([value]);
      close(true);
      return;
    }
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const scrollActive = (index: number) => {
    const el = document.getElementById(`${listId}-${index}`);
    el?.scrollIntoView({ block: "nearest" });
  };

  const move = (index: number) => {
    const next = Math.max(0, Math.min(rows.length - 1, index));
    setActive(next);
    requestAnimationFrame(() => scrollActive(next));
  };

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAt(Math.max(0, rows.findIndex((r) => selected.includes(r.value))));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAt(rows.length - 1);
    }
  };

  const onListKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(active + 1);
        return;
      case "ArrowUp":
        e.preventDefault();
        move(active - 1);
        return;
      case "Home":
        e.preventDefault();
        move(0);
        return;
      case "End":
        e.preventDefault();
        move(rows.length - 1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        toggle(rows[active].value);
        return;
      case "Escape":
        e.preventDefault();
        close(true);
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        break;
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      typed.current.buf =
        now - typed.current.at > 600 ? e.key : typed.current.buf + e.key;
      typed.current.at = now;
      const needle = norm(typed.current.buf);
      const hit = rows.findIndex((r) => norm(r.label).startsWith(needle));
      if (hit >= 0) move(hit);
    }
  };

  return (
    <div className="reg-lb" data-variant={variant} ref={wrapRef}>
      <button
        type="button"
        ref={trigRef}
        className="reg-trig"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${readback}`}
        data-on={on ? "1" : undefined}
        onClick={() =>
          open
            ? close(false)
            : openAt(Math.max(0, rows.findIndex((r) => selected.includes(r.value))))
        }
        onKeyDown={onTriggerKey}
      >
        {variant === "sort" && (
          <span className="ts" aria-hidden="true">
            ↕
          </span>
        )}
        <span className="tv">{summary}</span>
        {/* The count is a numeral, not a colour: a filter that is narrowing
            says so in a way that survives a monochrome screen. */}
        {variant === "filter" && chosen.length > 0 && (
          <span className="tn" aria-hidden="true">
            {chosen.length}
          </span>
        )}
        <span className="tc" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="reg-pop"
          role="listbox"
          id={listId}
          ref={listRef}
          tabIndex={-1}
          aria-label={label}
          aria-multiselectable={multi || undefined}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
        >
          {rows.map((r, i) => {
            const isSel =
              r.value === "" ? selected.length === 0 : selected.includes(r.value);
            return (
              <div
                key={r.value || "__all"}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSel}
                className="reg-opt"
                data-active={i === active ? "1" : undefined}
                data-all={r.value === "" ? "1" : undefined}
                /* Move, not enter. A popup that opens under a pointer parked
                   from an earlier click fires mouseenter on whatever lands
                   beneath it, which threw the keyboard's active option away:
                   measured at 390px, End and Home both landed on whichever
                   row the stationary cursor happened to be over. mousemove
                   only fires when the pointer really moves. */
                onMouseMove={() => setActive(i)}
                onClick={() => toggle(r.value)}
              >
                <span className="ok" aria-hidden="true">
                  {isSel ? "✓" : ""}
                </span>
                <span className="ol">{r.label}</span>
                {r.count != null && (
                  <span className="oc" aria-hidden="true">
                    {r.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Highlighting
   ========================================================================== */

/** Wrap the query's tokens where they occur verbatim in a visible field. */
function highlight(text: string, tokens: string[]): ReactNode {
  if (tokens.length === 0) return text;
  const escaped = tokens
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return text;
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  const re = new RegExp(`^(?:${escaped.join("|")})$`, "i");
  return parts.map((part, i) =>
    re.test(part) ? <mark key={i}>{part}</mark> : part,
  );
}

/* ============================================================================
   The table
   ========================================================================== */

export default function RegistryTable({
  rows,
  courts,
  stages,
  outcomes,
  fields,
  content,
  t,
}: {
  rows: RegRow[];
  courts: Array<{ id: string; abbr: string }>;
  stages: Array<{ key: CaseStageKey; label: string }>;
  outcomes: Array<{ key: CaseOutcomeKey; label: string }>;
  /** Subject-matter values the thirty-nine rows actually carry. */
  fields: Array<{ key: string; label: string }>;
  /** The build-time index over the eight write-ups. */
  content: ContentIndexProp;
  t: RegistryLabels;
}) {
  /* The home page's "Усі N справ ICJ →" links arrive with ?court=<id>, so the
     table opens already filtered instead of dropping the reader into all 39. */
  const params = useSearchParams();
  const initialCourt = params.get("court");
  /* Rows without a summary link to `/[locale]/cases/{id}`, and the row data is
     already localized to strings, so the locale comes off the path this table
     is mounted on (`/uk/registry`) rather than a prop the server would have to
     thread through. */
  const seg = usePathname().split("/")[1];
  const locale = isLocale(seg) ? seg : defaultLocale;

  const [q, setQ] = useState("");
  const [court, setCourt] = useState<string[]>(
    initialCourt && courts.some((c) => c.id === initialCourt) ? [initialCourt] : [],
  );
  const [stage, setStage] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<string[]>([]);
  const [field, setField] = useState<string[]>([]);
  const [material, setMaterial] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState>({ key: "year", dir: "desc" });

  const active =
    q.trim() !== "" ||
    court.length > 0 ||
    stage.length > 0 ||
    outcome.length > 0 ||
    field.length > 0 ||
    material.length > 0 ||
    sort.key !== "year" ||
    sort.dir !== "desc";

  /** Normalise once per row, not once per keystroke per row. */
  const haystacks = useMemo(
    () =>
      new Map(
        rows.map((r) => [
          r.id,
          {
            visible: norm(r.find.visible),
            court: norm(r.find.court),
            status: norm(r.find.status),
            type: norm(r.find.type),
            date: norm(r.find.date),
          } as Record<FindGroup, string>,
        ]),
      ),
    [rows],
  );

  const tokens = useMemo(
    () => norm(q).split(" ").filter(Boolean),
    [q],
  );

  /** The index's own key list, sorted once rather than per keystroke. */
  const termKeys = useMemo(() => Object.keys(content.terms), [content]);

  /** slug → the sections of its write-up that carry the whole query. */
  const inWriteup = useMemo(() => {
    const byIndex = contentMatches(content, termKeys, tokens);
    const out = new Map<string, string[]>();
    for (const [ci, sections] of byIndex) {
      const slug = content.cases[ci];
      if (!slug) continue;
      out.set(
        slug,
        sections.map((si) => content.sections[si]?.id).filter(Boolean) as string[],
      );
    }
    return out;
  }, [content, termKeys, tokens]);

  const view = useMemo(() => {
    const out = rows.filter((r) => {
      // Several values inside one filter mean OR; the filters are ANDed.
      if (court.length && !court.includes(r.courtId)) return false;
      if (stage.length && !(r.stage && stage.includes(r.stage))) return false;
      if (outcome.length && !(r.outcome && outcome.includes(r.outcome)))
        return false;
      if (field.length && !field.includes(r.fieldKey)) return false;
      if (
        material.length &&
        !material.some((m) => (m === "lit" ? r.lit : r.hasDoc))
      )
        return false;
      if (tokens.length === 0) return true;
      const hay = haystacks.get(r.id)!;
      const all = Object.values(hay).join(" ");
      /* Metadata OR content: a row earns its place either because the query
         is in what the row shows, or because it is somewhere in the write-up
         behind it. Before the index existed only the first half was possible,
         and a search for «депортація дітей» returned nothing from an archive
         with a whole ICC page about it. */
      if (tokens.every((tok) => hits(all, tok))) return true;
      return r.slug != null && inWriteup.has(r.slug);
    });
    return out.sort((a, b) => compare(a, b, sort));
  }, [
    rows,
    court,
    stage,
    outcome,
    field,
    material,
    tokens,
    haystacks,
    inWriteup,
    sort,
  ]);

  /** Which hidden fields earned a row its place, when the visible ones did not. */
  const why = useCallback(
    (r: RegRow): string[] => {
      if (tokens.length === 0) return [];
      const hay = haystacks.get(r.id)!;
      const groups = new Set<FindGroup>();
      for (const tok of tokens) {
        if (hits(hay.visible, tok)) continue;
        for (const g of HIDDEN_GROUPS) {
          if (hits(hay[g], tok)) groups.add(g);
        }
      }
      return [...groups].map((g) => t.group[g]);
    },
    [tokens, haystacks, t],
  );

  const reset = () => {
    setQ("");
    setCourt([]);
    setStage([]);
    setOutcome([]);
    setField([]);
    setMaterial([]);
    setSort({ key: "year", dir: "desc" });
  };

  const sortId = SORTS.find((s) => s.key === sort.key && s.dir === sort.dir)?.id;
  const sortOptions: Opt[] = SORTS.map((s) => ({
    value: s.id,
    label: t.sortOpt[s.id],
  }));

  /* A heading clicked twice reverses its axis, and four of those reversals —
     court, name, stage and outcome descending — are states no preset in SORTS
     names. The control used to fall back to its "all" label and claim «Спершу
     нові» while the table was ordered by something else; it now reads the real
     state off the column's own name. */
  const COL: Partial<Record<SortKey, string>> = {
    court: t.colCourt,
    name: t.colCase,
    stage: t.colStage,
    outcome: t.colOutcome,
    year: t.colDate,
  };
  const sortSummary = sortId
    ? undefined
    : `${COL[sort.key] ?? ""} — ${sort.dir === "asc" ? t.sortAsc : t.sortDesc}`;

  /* The active filters, spelled out. A reader who has narrowed to two courts
     can see which two without opening anything, and each chip clears its own
     value in one click — «Скинути» stays the one action that clears
     everything, the search and the ordering included. */
  const courtLabel = (id: string) =>
    courts.find((c) => c.id === id)?.abbr ?? id;
  const chips: Array<{ id: string; dim: string; label: string; clear: () => void }> = [
    ...court.map((v) => ({
      id: `court:${v}`,
      dim: t.courts,
      label: courtLabel(v),
      clear: () => setCourt(court.filter((x) => x !== v)),
    })),
    ...stage.map((v) => ({
      id: `stage:${v}`,
      dim: t.stages,
      label: stages.find((s) => s.key === v)?.label ?? v,
      clear: () => setStage(stage.filter((x) => x !== v)),
    })),
    ...outcome.map((v) => ({
      id: `outcome:${v}`,
      dim: t.outcomes,
      label: outcomes.find((o) => o.key === v)?.label ?? v,
      clear: () => setOutcome(outcome.filter((x) => x !== v)),
    })),
    ...field.map((v) => ({
      id: `field:${v}`,
      dim: t.fields,
      label: fields.find((f) => f.key === v)?.label ?? v,
      clear: () => setField(field.filter((x) => x !== v)),
    })),
    ...material.map((v) => ({
      id: `material:${v}`,
      dim: t.materials,
      label: v === "lit" ? t.matLit : t.matDoc,
      clear: () => setMaterial(material.filter((x) => x !== v)),
    })),
  ];

  /** Clicking a heading takes that axis; clicking it again flips direction. */
  const head = (key: SortKey, defaultDir: SortDir, label: string) => {
    const on = sort.key === key;
    const dir = on ? sort.dir : defaultDir;
    return (
      <div
        role="columnheader"
        aria-sort={on ? (dir === "asc" ? "ascending" : "descending") : "none"}
        className="reg-th"
      >
        <button
          type="button"
          className="reg-sortbtn"
          onClick={() =>
            setSort(
              on
                ? { key, dir: dir === "asc" ? "desc" : "asc" }
                : { key, dir: defaultDir },
            )
          }
        >
          {label}
          <span className="sd" aria-hidden="true">
            {on ? (dir === "asc" ? "▲" : "▼") : "↕"}
          </span>
          <span className="sr-only">
            {on ? (dir === "asc" ? t.sortAsc : t.sortDesc) : t.sortNone}
          </span>
        </button>
      </div>
    );
  };

  const multiCount =
    (court.length > 1 ? 1 : 0) +
    (stage.length > 1 ? 1 : 0) +
    (outcome.length > 1 ? 1 : 0) +
    (field.length > 1 ? 1 : 0) +
    (material.length > 1 ? 1 : 0);

  return (
    <section className="reg-page">
      <div className="reg-toolbar">
        {/* The search is a line of the instrument, not a box sitting next to
            it: a rule under it, a glyph in front of it and the same edge
            colour the pills carry. A boxed field in one idiom beside pills in
            another is what made the toolbar read as a form. */}
        <div className="reg-searchwrap">
          <label className="sr-only" htmlFor="reg-q">
            {t.searchLabel}
          </label>
          <span className="reg-si" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="17" height="17" focusable="false">
              <circle
                cx="6.8"
                cy="6.8"
                r="4.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M10.3 10.3 L14 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id="reg-q"
            className="reg-search"
            type="search"
            placeholder={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q !== "" && (
            <button
              type="button"
              className="reg-x"
              aria-label={t.clearSearch}
              onClick={() => {
                setQ("");
                document.getElementById("reg-q")?.focus();
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
        <div className="reg-filters">
          <Listbox
            label={t.courts}
            allLabel={t.courtsAll}
            multi
            options={courts.map((c) => ({
              value: c.id,
              label: c.abbr,
              count: rows.filter((r) => r.courtId === c.id).length,
            }))}
            selected={court}
            onChange={setCourt}
          />
          <Listbox
            label={t.stages}
            allLabel={t.stagesAll}
            multi
            options={stages.map((s) => ({
              value: s.key,
              label: s.label,
              count: rows.filter((r) => r.stage === s.key).length,
            }))}
            selected={stage}
            onChange={setStage}
          />
          <Listbox
            label={t.outcomes}
            allLabel={t.outcomesAll}
            multi
            options={outcomes.map((o) => ({
              value: o.key,
              label: o.label,
              count: rows.filter((r) => r.outcome === o.key).length,
            }))}
            selected={outcome}
            onChange={setOutcome}
          />
          {/* Subject-matter field. The record has carried it on all thirty-nine
              rows from the beginning — `type` in content/cases.ts — and the
              search already looked in it; only the filter was missing. */}
          <Listbox
            label={t.fields}
            allLabel={t.fieldsAll}
            multi
            options={fields.map((f) => ({
              value: f.key,
              label: f.label,
              count: rows.filter((r) => r.fieldKey === f.key).length,
            }))}
            selected={field}
            onChange={setField}
          />
          {/* What can be opened. Not a taxonomy — two booleans the record
              already fixes, and the two questions a reader about to cite the
              archive asks first. */}
          <Listbox
            label={t.materials}
            allLabel={t.materialsAll}
            multi
            options={[
              { value: "lit", label: t.matLit, count: rows.filter((r) => r.lit).length },
              {
                value: "doc",
                label: t.matDoc,
                count: rows.filter((r) => r.hasDoc).length,
              },
            ]}
            selected={material}
            onChange={setMaterial}
          />
          {/* Ordering is not narrowing, so it does not wear a filter's pill:
              it sits at the far end of the row as an underlined text control.
              It stays on wide screens even though the heading row sorts too —
              two of its axes, the decision date and "ready to read first",
              have no column to click. */}
          <div className="reg-sort">
            <Listbox
              label={t.sort}
              allLabel={t.sortOpt.yearDesc}
              multi={false}
              variant="sort"
              summaryOverride={sortSummary}
              activeOverride={sortId !== "yearDesc"}
              options={sortOptions}
              selected={sortId ? [sortId] : []}
              onChange={(next) => {
                const picked = SORTS.find((s) => s.id === next[0]);
                setSort(
                  picked
                    ? { key: picked.key, dir: picked.dir }
                    : { key: "year", dir: "desc" },
                );
              }}
            />
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="reg-active" aria-label={t.activeFilters}>
          {chips.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="reg-chip"
                aria-label={`${t.clearFilter}: ${c.dim} — ${c.label}`}
                onClick={c.clear}
              >
                <span className="cd" aria-hidden="true">
                  {c.dim}
                </span>
                <span className="cv" aria-hidden="true">
                  {c.label}
                </span>
                <span className="cx" aria-hidden="true">
                  ✕
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="reg-count">
        <p aria-live="polite">
          <b>{view.length}</b> {plural(view.length, t.results, locale)}
          <span className="of"> · {t.ofTotal.replace("{total}", String(rows.length))}</span>
        </p>
        {multiCount > 0 && <p className="reg-combine">{t.combine}</p>}
        {active && (
          <button type="button" className="reg-reset" onClick={reset}>
            {t.reset}
          </button>
        )}
      </div>

      {view.length === 0 ? (
        <div className="reg-empty">
          <p className="eh">{t.emptyHead}</p>
          <p>{t.emptyBody}</p>
          <button type="button" className="reg-reset" onClick={reset}>
            {t.reset}
          </button>
        </div>
      ) : (
        <div className="reg-list" role="table" aria-label={t.tableLabel}>
          <div role="rowgroup" className="reg-thead">
            <div role="row" className="reg-row reg-hrow">
              {head("court", "asc", t.colCourt)}
              {head("name", "asc", t.colCase)}
              {head("stage", "asc", t.colStage)}
              {head("outcome", "asc", t.colOutcome)}
              {head("year", "desc", t.colDate)}
            </div>
          </div>
          <div role="rowgroup">
            {view.map((r) => {
              // Every proceeding is addressable: a summary opens the decision
              // page, the rest open the pending page. The lit/unlit dot, not a
              // dead row, is what says which is which.
              const href = r.href ?? `/${locale}/cases/${r.id}`;
              const reasons = why(r);
              /* Where in the write-up the query landed. A row is a case, but
                 the match may be in a chronology entry three screens down, so
                 each section named here is a link that lands on it. */
              const inDocAll = r.slug ? (inWriteup.get(r.slug) ?? []) : [];
              /* Capped. A one-word query can land in every band of a long
                 write-up — oschadbank matches «крим» in all six — and six
                 links under a table row is a second navigation, not a hint.
                 Four, in page order, and the rest counted rather than
                 dropped silently. */
              const inDoc = inDocAll.slice(0, 4);
              const inDocMore = inDocAll.length - inDoc.length;
              return (
                <div
                  role="row"
                  key={r.id}
                  className={`reg-row reg-drow ${r.lit ? "is-lit" : ""}`}
                >
                  <span role="cell" className="reg-court">
                    <span className="dot" aria-hidden="true" />
                    {r.court}
                  </span>
                  <span role="cell" className="reg-main">
                    {/* The link sits in the case cell and its ::after covers
                        the row, so the whole row stays clickable without a
                        link wrapping table rows. */}
                    {/* `lang` where the row's own text is not the page's
                        language — see foreignLang(). Thirty-five of thirty-
                        nine names are Latin-script, and a Ukrainian voice
                        reading them phonetically is unintelligible. */}
                    <a
                      className="reg-name"
                      href={href}
                      lang={foreignLang(r.name, locale)}
                    >
                      {highlight(r.name, tokens)}
                    </a>
                    {r.note && (
                      <span className="reg-note" lang={foreignLang(r.note, locale)}>
                        {highlight(r.note, tokens)}
                      </span>
                    )}
                    {reasons.length > 0 && (
                      <span className="reg-why">
                        {t.matched} {reasons.join(" · ")}
                      </span>
                    )}
                    {inDoc.length > 0 && (
                      <span className="reg-inwrite">
                        <span className="rw-l">{t.matchedIn}</span>
                        {inDoc.map((id) => (
                          <a key={id} className="rw-s" href={`${href}#${id}`}>
                            {content.sections.find((x) => x.id === id)?.label ?? id}
                          </a>
                        ))}
                        {inDocMore > 0 && (
                          <span className="rw-l">+{inDocMore}</span>
                        )}
                      </span>
                    )}
                    {/* The full status wording sits with the case name rather
                        than in the outcome cell: a row whose record names no
                        act can then leave that cell genuinely empty, and the
                        stacked layout drops it instead of keeping a 1px
                        sliver of it. */}
                    <span className="sr-only">{r.status}</span>
                  </span>
                  {/* Two cells, not one: the stage of the proceedings and the
                      act the forum issued are different facts, each with its
                      own heading and its own aria-sort. The visually-hidden
                      prefix stays on the chip itself, so the dimension is
                      still named below 820px where the heading row is gone. */}
                  <span role="cell" className="reg-tags reg-cstage chip">
                    {r.stageLabel && (
                      <span className="tag tag-stage">
                        <span className="sr-only">{t.stageName}: </span>
                        {r.stageLabel}
                      </span>
                    )}
                  </span>
                  <span role="cell" className="reg-tags reg-coutcome chip">
                    {r.outcomeLabel && (
                      <span className="tag tag-outcome">
                        <span className="sr-only">{t.outcomeName}: </span>
                        {r.outcomeLabel}
                      </span>
                    )}
                  </span>
                  <span role="cell" className="reg-when">
                    <span className="reg-year">{r.year ?? t.noDate}</span>
                    {r.decidedLabel && (
                      <span className="reg-decided">
                        <span className="dl">{t.decidedOn}</span>
                        {"\u00a0"}
                        {r.decidedLabel}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

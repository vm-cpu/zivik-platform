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
import { defaultLocale, isLocale } from "@/i18n/config";
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

export interface PluralForms {
  one: string;
  few: string;
  many: string;
}

const PR = new Map<string, Intl.PluralRules>();

/**
 * Ukrainian agreement has three forms — 1 справа, 2–4 справи, 5+ справ — and
 * the teens all take the "many" one, which is why 11 and 21 disagree.
 * `Intl.PluralRules` is asked rather than hand-rolled, because the hand-rolled
 * version got English wrong in the other direction: n % 10 === 1 made it print
 * "21 case". English resolves to one/other and reads `one` and `many`.
 */
export function plural(n: number, forms: PluralForms, locale: string): string {
  let rules = PR.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    PR.set(locale, rules);
  }
  const category = rules.select(n);
  if (category === "one") return forms.one;
  if (category === "few") return forms.few;
  return forms.many;
}

export interface RegistryLabels {
  search: string;
  searchLabel: string;
  courts: string;
  courtsAll: string;
  stages: string;
  stagesAll: string;
  outcomes: string;
  outcomesAll: string;
  sort: string;
  sortOpt: Record<string, string>;
  colCourt: string;
  colCase: string;
  colTags: string;
  colDate: string;
  sortAsc: string;
  sortDesc: string;
  sortNone: string;
  results: PluralForms;
  ofTotal: string;
  combine: string;
  reset: string;
  emptyHead: string;
  emptyBody: string;
  matched: string;
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
}: {
  label: string;
  allLabel: string;
  options: Opt[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi: boolean;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trigRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ buf: "", at: 0 });

  // "Усі суди" is an option rather than a second control: one idiom for
  // clearing, matching the СКИНУТИ button rather than competing with it.
  const rows: Opt[] = useMemo(
    () => [{ value: "", label: allLabel }, ...options],
    [allLabel, options],
  );

  const chosen = rows.filter((r) => r.value !== "" && selected.includes(r.value));
  const summary =
    chosen.length === 0
      ? allLabel
      : chosen.length === 1
        ? chosen[0].label
        : `${chosen[0].label} +${chosen.length - 1}`;
  const readback =
    chosen.length === 0 ? allLabel : chosen.map((c) => c.label).join(", ");

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
      if (inside) trigRef.current?.focus();
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
    <div className="reg-lb" ref={wrapRef}>
      <button
        type="button"
        ref={trigRef}
        className="reg-trig"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${readback}`}
        data-on={chosen.length > 0 ? "1" : undefined}
        onClick={() =>
          open
            ? close(false)
            : openAt(Math.max(0, rows.findIndex((r) => selected.includes(r.value))))
        }
        onKeyDown={onTriggerKey}
      >
        <span className="tl">{label}</span>
        <span className="tv">{summary}</span>
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
                onMouseEnter={() => setActive(i)}
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
  t,
}: {
  rows: RegRow[];
  courts: Array<{ id: string; abbr: string }>;
  stages: Array<{ key: CaseStageKey; label: string }>;
  outcomes: Array<{ key: CaseOutcomeKey; label: string }>;
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
  const [sort, setSort] = useState<SortState>({ key: "year", dir: "desc" });

  const active =
    q.trim() !== "" ||
    court.length > 0 ||
    stage.length > 0 ||
    outcome.length > 0 ||
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

  const view = useMemo(() => {
    const out = rows.filter((r) => {
      // Several values inside one filter mean OR; the filters are ANDed.
      if (court.length && !court.includes(r.courtId)) return false;
      if (stage.length && !(r.stage && stage.includes(r.stage))) return false;
      if (outcome.length && !(r.outcome && outcome.includes(r.outcome)))
        return false;
      if (tokens.length === 0) return true;
      const hay = haystacks.get(r.id)!;
      const all = Object.values(hay).join(" ");
      return tokens.every((tok) => hits(all, tok));
    });
    return out.sort((a, b) => compare(a, b, sort));
  }, [rows, court, stage, outcome, tokens, haystacks, sort]);

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
    setSort({ key: "year", dir: "desc" });
  };

  const sortId = SORTS.find((s) => s.key === sort.key && s.dir === sort.dir)?.id;
  const sortOptions: Opt[] = SORTS.map((s) => ({
    value: s.id,
    label: t.sortOpt[s.id],
  }));

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
    (outcome.length > 1 ? 1 : 0);

  return (
    <section className="reg-page">
      <div className="reg-toolbar">
        <div className="reg-searchwrap">
          <label className="sr-only" htmlFor="reg-q">
            {t.searchLabel}
          </label>
          <input
            id="reg-q"
            className="reg-search"
            type="search"
            placeholder={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
          <Listbox
            label={t.sort}
            allLabel={t.sortOpt.yearDesc}
            multi={false}
            options={sortOptions}
            selected={sortId && sortId !== "yearDesc" ? [sortId] : []}
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
        <div className="reg-list" role="table" aria-label={t.searchLabel}>
          <div role="rowgroup" className="reg-thead">
            <div role="row" className="reg-row reg-hrow">
              {head("court", "asc", t.colCourt)}
              {head("name", "asc", t.colCase)}
              {head("stage", "asc", t.colTags)}
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
                    <a className="reg-name" href={href}>
                      {highlight(r.name, tokens)}
                    </a>
                    {r.note && (
                      <span className="reg-note">{highlight(r.note, tokens)}</span>
                    )}
                    {reasons.length > 0 && (
                      <span className="reg-why">
                        {t.matched} {reasons.join(" · ")}
                      </span>
                    )}
                  </span>
                  <span role="cell" className="reg-tags chip">
                    {r.stageLabel && (
                      <span className="tag tag-stage">
                        <span className="sr-only">{t.stageName}: </span>
                        {r.stageLabel}
                      </span>
                    )}
                    {r.outcomeLabel && (
                      <span className="tag tag-outcome">
                        <span className="sr-only">{t.outcomeName}: </span>
                        {r.outcomeLabel}
                      </span>
                    )}
                    <span className="sr-only">{r.status}</span>
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

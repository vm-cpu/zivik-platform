"use client";

import { useEffect, useMemo, useState } from "react";
import type { CaseStatusKey } from "@/content/types";

/** Status → the global badge class defined in home.css (.st-*). */
const CHIP_CLASS: Record<CaseStatusKey, string> = {
  decided: "st-decided",
  progress: "st-progress",
  warrant: "st-warrant",
  settled: "st-enforce",
  enforcement: "st-enforce",
  frozen: "st-enforce",
  rejected: "st-progress",
};

const ONGOING: ReadonlySet<CaseStatusKey> = new Set(["progress", "warrant"]);

/** One case, already localized to plain strings on the server. */
export interface RegRow {
  id: string;
  courtId: string;
  court: string;
  name: string;
  note: string;
  statusKey: CaseStatusKey;
  status: string;
  year: number | null;
  lit: boolean;
  href: string | null;
}

export interface RegistryLabels {
  search: string;
  allCourts: string;
  allStatuses: string;
  sortNew: string;
  sortOld: string;
  sortCourt: string;
  results: string;
  reset: string;
  emptyHead: string;
  emptyBody: string;
}

type SortKey = "new" | "old" | "court";

export default function RegistryTable({
  rows,
  courts,
  statuses,
  t,
}: {
  rows: RegRow[];
  courts: Array<{ id: string; abbr: string }>;
  statuses: Array<{ key: CaseStatusKey; label: string }>;
  t: RegistryLabels;
}) {
  const [q, setQ] = useState("");
  const [court, setCourt] = useState("all");

  // `?court=icj` opens the table filtered to that court — this is where the
  // map's courthouse panels land. Read after mount so the page stays static.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("court");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL state, see above
    if (wanted && courts.some((c) => c.id === wanted)) setCourt(wanted);
  }, [courts]);
  const [status, setStatus] = useState<"all" | CaseStatusKey>("all");
  const [sort, setSort] = useState<SortKey>("new");

  const active = q.trim() !== "" || court !== "all" || status !== "all";

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const yr = (r: RegRow) => (r.year == null ? -Infinity : r.year);
    const out = rows.filter((r) => {
      if (court !== "all" && r.courtId !== court) return false;
      if (status !== "all" && r.statusKey !== status) return false;
      if (
        needle &&
        !r.name.toLowerCase().includes(needle) &&
        !r.note.toLowerCase().includes(needle) &&
        !r.court.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "old") return yr(a) - yr(b);
      if (sort === "court") return a.court.localeCompare(b.court) || yr(b) - yr(a);
      return yr(b) - yr(a);
    });
    return out;
  }, [rows, q, court, status, sort]);

  const reset = () => {
    setQ("");
    setCourt("all");
    setStatus("all");
    setSort("new");
  };

  const year = (r: RegRow) => {
    if (r.year == null) return "—";
    return ONGOING.has(r.statusKey) ? `${r.year} →` : String(r.year);
  };

  return (
    <section className="reg-page">
      <div className="reg-toolbar">
        <input
          className="reg-search"
          type="search"
          placeholder={t.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="reg-sel"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          aria-label={t.allCourts}
        >
          <option value="all">{t.allCourts}</option>
          {courts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.abbr}
            </option>
          ))}
        </select>
        <select
          className="reg-sel"
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | CaseStatusKey)}
          aria-label={t.allStatuses}
        >
          <option value="all">{t.allStatuses}</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          className="reg-sel"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label={t.sortNew}
        >
          <option value="new">{t.sortNew}</option>
          <option value="old">{t.sortOld}</option>
          <option value="court">{t.sortCourt}</option>
        </select>
      </div>

      <div className="reg-count">
        <span>
          <b>{view.length}</b> / {rows.length} {t.results}
        </span>
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
        <ul className="reg-list">
          {view.map((r) => {
            const cols = (
              <>
                <span className="reg-court">
                  <span className="dot" />
                  {r.court}
                </span>
                <span className="reg-main">
                  <span className="reg-name">{r.name}</span>
                  {r.note && <span className="reg-note">{r.note}</span>}
                </span>
                <span className={`chip reg-status ${CHIP_CLASS[r.statusKey]}`}>
                  {r.status}
                </span>
                <span className="reg-year">{year(r)}</span>
              </>
            );
            const cls = `reg-row ${r.lit ? "is-lit" : ""}`;
            return (
              <li key={r.id}>
                {r.href ? (
                  <a className={cls} href={r.href}>
                    {cols}
                  </a>
                ) : (
                  <div className={`${cls} is-inert`}>{cols}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

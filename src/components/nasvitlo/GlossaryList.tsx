"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { norm } from "@/components/nasvitlo/RegistryTable";

/**
 * The dictionary's read side: a search line, an alphabet, and the entries.
 *
 * Same two rules the library's table follows, for the same reasons:
 *
 *   - No `useSearchParams`. It bails a statically rendered route out to
 *     client-side rendering, which on the library page emptied the built HTML
 *     of all thirty-nine rows. Fifty headwords and their definitions are the
 *     whole point of this page existing, so they render on the server and the
 *     URL is read from `window.location` after hydration.
 *   - The reader's state goes back into the URL with `replaceState`, so a
 *     filtered view is a link. That is what makes the glossary band on a
 *     decision page work: it is this page with `?case=<slug>` on it.
 */

export interface GlossaryRow {
  id: string;
  term: string;
  initial: string;
  senses: Array<{
    slug: string;
    caseTitle: string;
    forum: string;
    def: string;
    href: string;
  }>;
  /** Everything searchable, both locales, already flattened on the server. */
  find: string;
}

export interface GlossaryLabels {
  search: string;
  searchLabel: string;
  clearSearch: string;
  all: string;
  count: { one: string; few: string; many: string };
  ofTotal: string;
  reset: string;
  emptyHead: string;
  emptyBody: string;
  inCase: string;
  filteredBy: string;
  jumpLabel: string;
}

/** Layout phase on the client, plain effect on the server. */
const useIsomorphic =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function plural(n: number, f: GlossaryLabels["count"], locale: string): string {
  if (locale !== "uk") return n === 1 ? f.one : f.many;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return f.one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return f.few;
  return f.many;
}

export default function GlossaryList({
  rows,
  initials,
  cases,
  locale,
  t,
}: {
  rows: GlossaryRow[];
  initials: string[];
  /** Every decision that contributes a term, for the «у справі» filter. */
  cases: Array<{ slug: string; title: string }>;
  locale: string;
  t: GlossaryLabels;
}) {
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState("");
  const [caseSlug, setCaseSlug] = useState("");

  /* Read the URL once the tree has hydrated — before paint, so a reader
     arriving at ?case=oschadbank never sees all fifty headwords flash past on
     the way to that decision's seven. */
  useIsomorphic(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("case") ?? "";
    const l = p.get("letter") ?? "";
    const query = p.get("q") ?? "";
    if (query) setQ(query);
    if (l && initials.includes(l)) setLetter(l);
    if (c && cases.some((x) => x.slug === c)) setCaseSlug(c);
    // mount only: the URL is the way in, this component owns the state after
  }, []);

  const firstWrite = useRef(true);
  useEffect(() => {
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q);
    if (letter) p.set("letter", letter);
    if (caseSlug) p.set("case", caseSlug);
    const query = p.toString();
    const { pathname, hash } = window.location;
    const next = `${pathname}${query ? `?${query}` : ""}${hash}`;
    if (next !== `${pathname}${window.location.search}${hash}`) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [q, letter, caseSlug]);

  const tokens = useMemo(() => norm(q).split(" ").filter(Boolean), [q]);
  const haystacks = useMemo(
    () => new Map(rows.map((r) => [r.id, norm(r.find)])),
    [rows],
  );

  const view = useMemo(
    () =>
      rows.filter((r) => {
        if (caseSlug && !r.senses.some((s) => s.slug === caseSlug)) return false;
        if (letter && r.initial !== letter) return false;
        if (tokens.length === 0) return true;
        const hay = haystacks.get(r.id)!;
        return tokens.every((tok) => ` ${hay}`.includes(` ${tok}`));
      }),
    [rows, caseSlug, letter, tokens, haystacks],
  );

  /* Which letters can still be reached from where the reader is. A letter that
     leads to an empty page is a dead control, so it is disabled rather than
     quietly returning nothing. */
  const reachable = useMemo(() => {
    const base = rows.filter((r) => {
      if (caseSlug && !r.senses.some((s) => s.slug === caseSlug)) return false;
      if (tokens.length === 0) return true;
      const hay = haystacks.get(r.id)!;
      return tokens.every((tok) => ` ${hay}`.includes(` ${tok}`));
    });
    return new Set(base.map((r) => r.initial));
  }, [rows, caseSlug, tokens, haystacks]);

  const active = q.trim() !== "" || letter !== "" || caseSlug !== "";
  const reset = () => {
    setQ("");
    setLetter("");
    setCaseSlug("");
  };

  const caseTitle = cases.find((c) => c.slug === caseSlug)?.title;

  /* Headwords under their letter, so the page reads as a dictionary rather
     than as a list that happens to be sorted.

     Grouped by letter. Built as a map rather than as runs of adjacent rows:
     `localeCompare` with `sensitivity: "base"` is not a total order — two
     headwords it calls equal keep their input order — so a letter could open,
     close and open again, which gave two <section> elements the same React
     key and a dictionary with П in two places. A map cannot do that. */
  const groups = useMemo(() => {
    const by = new Map<string, GlossaryRow[]>();
    for (const r of view) {
      const list = by.get(r.initial);
      if (list) list.push(r);
      else by.set(r.initial, [r]);
    }
    return [...by.entries()]
      .sort(([a], [b]) => initials.indexOf(a) - initials.indexOf(b))
      .map(([initial, items]) => ({ initial, items }));
  }, [view, initials]);

  return (
    <div className="gl">
      <div className="gl-tools">
        <div className="gl-searchwrap">
          <label className="sr-only" htmlFor="gl-q">
            {t.searchLabel}
          </label>
          <span className="gl-si" aria-hidden="true">
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
            id="gl-q"
            className="gl-search"
            type="search"
            placeholder={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q !== "" && (
            <button
              type="button"
              className="gl-x"
              aria-label={t.clearSearch}
              onClick={() => {
                setQ("");
                document.getElementById("gl-q")?.focus();
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>

        <nav className="gl-index" aria-label={t.jumpLabel}>
          <button
            type="button"
            className="gl-letter"
            data-on={letter === "" ? "1" : undefined}
            onClick={() => setLetter("")}
          >
            {t.all}
          </button>
          {initials.map((l) => (
            <button
              key={l}
              type="button"
              className="gl-letter"
              data-on={letter === l ? "1" : undefined}
              disabled={!reachable.has(l)}
              onClick={() => setLetter(letter === l ? "" : l)}
            >
              {l}
            </button>
          ))}
        </nav>
      </div>

      <div className="gl-count">
        <p aria-live="polite">
          <b>{view.length}</b> {plural(view.length, t.count, locale)}
          <span className="of">
            {" "}
            · {t.ofTotal.replace("{total}", String(rows.length))}
          </span>
        </p>
        {caseTitle && (
          <p className="gl-filterby">
            {t.filteredBy} <b>{caseTitle}</b>
          </p>
        )}
        {active && (
          <button type="button" className="gl-reset" onClick={reset}>
            {t.reset}
          </button>
        )}
      </div>

      {view.length === 0 ? (
        <div className="gl-empty">
          <p className="eh">{t.emptyHead}</p>
          <p>{t.emptyBody}</p>
          <button type="button" className="gl-reset" onClick={reset}>
            {t.reset}
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section className="gl-group" key={g.initial}>
            <h2 className="gl-initial" id={`letter-${g.initial}`}>
              {g.initial}
            </h2>
            <dl className="gl-entries">
              {g.items.map((r) => (
                <div className="gl-entry" key={r.id} id={r.id}>
                  <dt>{r.term}</dt>
                  {r.senses.map((s, i) => (
                    <dd key={i}>
                      <p className="gl-def">{s.def}</p>
                      {/* The trail back. With one sense this names where the
                          definition comes from; with two it is the only thing
                          that makes the pair legible — the same words read
                          differently in a criminal court and in Strasbourg. */}
                      <a className="gl-src" href={s.href}>
                        {/* The space is written, not left to the layout. The
                            two names are separated visually by the flex gap and
                            by the divider the stylesheet draws, neither of which
                            is text — so the link announced itself as one run,
                            «…судСитуація в Україні». */}
                        <span className="gl-src-forum">{s.forum}</span>{" "}
                        <span className="gl-src-title">{s.caseTitle}</span>
                      </a>
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}

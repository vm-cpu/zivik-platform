"use client";

import { useMemo, useState } from "react";
import { norm } from "@/components/nasvitlo/RegistryTable";

/**
 * The glossary band on a decision page: alphabetical, and searchable.
 *
 * The terms used to render in whatever order they were authored, which on a
 * list of a dozen entries means a reader looking for one word reads all of
 * them. Sorted, the band is something you can aim at; with a filter, something
 * you can ask.
 *
 * Deliberately smaller than the dictionary page's control. There is no letter
 * index here — twelve entries do not need an alphabet — and no case filter,
 * because this band is already one case. The way to the rest is the link under
 * the list.
 *
 * The sort happens on the server, so the order is in the HTML and the anchors
 * the verbatim text points at (`#term-N`) are numbered in the same order the
 * reader sees. Only the filtering is client-side.
 */
export interface Term {
  term: string;
  def: string;
}

export default function TermSearch({
  terms,
  placeholder,
  label,
  clear,
  empty,
}: {
  terms: Term[];
  placeholder: string;
  label: string;
  clear: string;
  empty: string;
}) {
  const [q, setQ] = useState("");

  const tokens = useMemo(() => norm(q).split(" ").filter(Boolean), [q]);
  const hay = useMemo(
    () => terms.map((t) => norm(`${t.term} ${t.def}`)),
    [terms],
  );

  /* Indices, not entries: the anchor a term carries is its position in the
     authored (sorted) list, and the verbatim text links to it. Filtering must
     not renumber them. */
  const shown = useMemo(() => {
    if (tokens.length === 0) return terms.map((_, i) => i);
    return terms
      .map((_, i) => i)
      .filter((i) => tokens.every((tok) => ` ${hay[i]}`.includes(` ${tok}`)));
  }, [terms, tokens, hay]);

  return (
    <>
      <div className="terms-search">
        <label className="sr-only" htmlFor="terms-q">
          {label}
        </label>
        <span className="terms-si" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
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
          id="terms-q"
          type="search"
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q !== "" && (
          <button
            type="button"
            className="terms-x"
            aria-label={clear}
            onClick={() => {
              setQ("");
              document.getElementById("terms-q")?.focus();
            }}
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="terms-empty" role="status">
          {empty}
        </p>
      ) : (
        <dl className="glossary">
          {shown.map((i) => (
            <div key={i} id={`term-${i}`}>
              <dt>{terms[i].term}</dt>
              <dd>{terms[i].def}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

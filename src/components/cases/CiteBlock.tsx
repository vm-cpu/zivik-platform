"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The citation, as one thing a reader can take away.
 *
 * This archive exists to be cited — DESIGN.md lists citability among the
 * non-negotiables, and the page honours it for machines: canonical, hreflang,
 * JSON-LD. For a person it did not. The official case name was the quietest
 * text in the masthead, the docket was one row of eleven in the case card, and
 * the date was a fragment in a dot-separated eyebrow. A journalist on deadline
 * retyped four strings from three bands and got one wrong.
 *
 * The parts are the record's own. Title, parties and the act keep the language
 * of the judgment, which is what a citation carries; the forum and the seat
 * follow the reader. Nothing here is authored — every field already existed on
 * the page, three bands apart.
 */
export default function CiteBlock({
  lines,
  citation,
  label,
  copy,
  copied,
  failed,
}: {
  /** What is shown, in reading order. */
  lines: string[];
  /** What lands on the clipboard — the same facts as one line. */
  citation: string;
  label: string;
  copy: string;
  copied: string;
  failed: string;
}) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setState("ok");
    } catch {
      /* A clipboard write can be refused — an insecure origin, a permissions
         policy, a browser that never implemented it. Saying so is better than
         a button that appears to work: the text above is selectable, so the
         reader still has a way through. */
      setState("fail");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2600);
  };

  return (
    <div className="citeas" aria-label={label}>
      <p className="citeas-label">{label}</p>
      {/* Selectable, and the whole citation is one <p> per line so a mouse
          drag over it takes the whole thing rather than the page's chrome. */}
      <div className="citeas-body">
        {lines.map((l, i) => (
          <p key={i} className={i === 0 ? "citeas-title" : "citeas-line"}>
            {l}
          </p>
        ))}
      </div>
      <button type="button" className="citeas-copy" onClick={onCopy}>
        {state === "ok" ? copied : state === "fail" ? failed : copy}
      </button>
      {/* The button's own label changes, which a sighted reader sees; this is
          the same news for anyone who is not watching it. */}
      <span className="sr-only" role="status" aria-live="polite">
        {state === "ok" ? copied : state === "fail" ? failed : ""}
      </span>
    </div>
  );
}

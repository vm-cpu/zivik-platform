"use client";

import { useEffect, useRef, useState } from "react";

export interface PageSection {
  id: string;
  label: string;
}

/**
 * One navigation for the whole decision page.
 *
 * Two renderings of the same scrollspy state. On wide screens it is a
 * vertical rail fixed in the left margin — a spine with a dot per band, the
 * active one lit — which stays with the reader through dark and paper bands
 * alike (the rail carries its own night ground, so it reads on any band).
 * Where the margin is too narrow to hold it, a sticky horizontal bar takes
 * over at the top, scrolling its chips sideways and keeping the active one
 * in view. There is no separate navigation for the summary text: the bands,
 * including the summary and its sources, are the whole map of the page.
 */
export default function PageNav({
  sections,
  ariaLabel,
}: {
  sections: PageSection[];
  ariaLabel: string;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const update = () => {
      const line = window.innerHeight * 0.25;
      let current = els[0];
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el;
        else break;
      }
      setActive(current.id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  // Horizontal mode: keep the active chip visible inside the scrollable row.
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!row || !chip) return;
    const left = chip.offsetLeft - 24;
    const right = chip.offsetLeft + chip.offsetWidth + 24 - row.clientWidth;
    if (row.scrollLeft > left) row.scrollTo({ left, behavior: "smooth" });
    else if (row.scrollLeft < right) row.scrollTo({ left: right, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <nav className="pagenav-v" aria-label={ariaLabel}>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id} data-active={s.id === active ? "yes" : "no"}>
              <a href={`#${s.id}`}>
                <i aria-hidden="true" />
                <b>{String(i + 1).padStart(2, "0")}</b>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav className="pagenav" aria-label={ariaLabel}>
        <div className="rail pagenav-row" ref={rowRef}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-active={s.id === active ? "yes" : "no"}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

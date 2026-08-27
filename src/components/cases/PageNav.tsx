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
  topLabel,
}: {
  sections: PageSection[];
  ariaLabel: string;
  /** "Нагору" — the label on the return-to-top control. */
  topLabel: string;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  /* The decision pages run long — the ECtHR judgment is twelve bands — and
     the way back to the masthead was the scrollbar or a lot of scrolling. The
     control only exists once there is something to return from; offered at the
     top of the page it would be a button that does nothing. */
  const [deep, setDeep] = useState(false);
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
      setDeep(window.scrollY > window.innerHeight * 1.5);
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
    /* globals.css forces `scroll-behavior: auto` under prefers-reduced-motion,
       but that only governs CSS-driven scrolling — a scrollTo() that names
       "smooth" itself animates regardless. Asked directly, so the chip snaps
       for a reader who has said they do not want motion. */
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";
    if (row.scrollLeft > left) row.scrollTo({ left, behavior });
    else if (row.scrollLeft < right) row.scrollTo({ left: right, behavior });
  }, [active]);

  /* Same reasoning as the chip scroll above: scrollTo names its own
     behaviour, so a reader who asked for no motion has to be answered here
     too rather than left to the stylesheet. */
  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <>
      <nav className="pagenav-v" aria-label={ariaLabel}>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id} data-active={s.id === active ? "yes" : "no"}>
              <a href={`#${s.id}`} aria-current={s.id === active ? "true" : undefined}>
                <i aria-hidden="true" />
                <b>{String(i + 1).padStart(2, "0")}</b>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="pagenav-v-top"
          data-show={deep ? "yes" : "no"}
          onClick={toTop}
          tabIndex={deep ? 0 : -1}
          aria-hidden={deep ? undefined : true}
        >
          <span aria-hidden="true">↑</span>
          {topLabel}
        </button>
      </nav>

      <nav className="pagenav" aria-label={ariaLabel}>
        <div className="rail pagenav-row" ref={rowRef}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-active={s.id === active ? "yes" : "no"}
              aria-current={s.id === active ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
          {/* Sticky inside the scrolling row rather than after it: the chips
              overflow and scroll sideways, so a plain last child would drift
              off the end exactly when a reader deep in the page wants it. */}
          <button
            type="button"
            className="pagenav-top"
            data-show={deep ? "yes" : "no"}
            onClick={toTop}
            tabIndex={deep ? 0 : -1}
            aria-hidden={deep ? undefined : true}
          >
            <span aria-hidden="true">↑</span>
            {topLabel}
          </button>
        </div>
      </nav>
    </>
  );
}

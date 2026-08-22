"use client";

import { useEffect, useRef, useState } from "react";

export interface PageSection {
  id: string;
  label: string;
}

/**
 * Sticky navigation for the whole decision page.
 *
 * The side rail navigates the verbatim text only; everything above it — the
 * dashboard, the case instruments, the reader's guide — was reachable by
 * scroll alone. This bar names every band of the page and tracks the reader
 * through all of them (scrollspy), so the reference material is one tap away
 * instead of a discovery at the bottom. On narrow screens the row scrolls
 * horizontally and keeps the active chip in view.
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

  // Keep the active chip visible inside the horizontally scrollable row.
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
    <nav className="pagenav" aria-label={ariaLabel}>
      <div className="rail pagenav-row" ref={rowRef}>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} data-active={s.id === active ? "yes" : "no"}>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

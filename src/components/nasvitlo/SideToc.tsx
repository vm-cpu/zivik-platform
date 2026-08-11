"use client";

import { useEffect, useRef, useState } from "react";

export interface TocSection {
  id: string;
  text: string;
}

/**
 * Sticky side navigation for the decision reading column.
 *
 * Tracks which section is in view (scrollspy) and draws a progress rail beside
 * the list. On narrow screens it collapses into a sticky bar at the top of the
 * article that expands on tap, so the reading column keeps its full width.
 */
export default function SideToc({
  sections,
  title,
  readTime,
  progressLabel,
}: {
  sections: TocSection[];
  title: string;
  readTime: string;
  progressLabel: string;
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const article = headings[0].closest("article");

    const update = () => {
      // Active section: the last heading whose top is above the read line.
      const line = window.innerHeight * 0.3;
      let current = headings[0];
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h;
        else break;
      }
      setActiveId(current.id);

      // Progress through the article body.
      if (article) {
        const { top, height } = article.getBoundingClientRect();
        const scrolled = -top + window.innerHeight * 0.5;
        setProgress(Math.min(1, Math.max(0, scrolled / height)));
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  // Keep the active entry visible inside a scrollable rail.
  useEffect(() => {
    const link = navRef.current?.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    link?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  return (
    <nav
      ref={navRef}
      className="sidetoc"
      data-open={open ? "yes" : "no"}
      aria-label={title}
    >
      <button
        type="button"
        className="sidetoc-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sidetoc-toggle-label">
          <b>{String(activeIndex + 1).padStart(2, "0")}</b>
          {sections[activeIndex]?.text ?? title}
        </span>
        <span className="sidetoc-chev" aria-hidden="true" />
      </button>

      <div className="sidetoc-head">
        <span className="sidetoc-title">{title}</span>
        <span className="sidetoc-time">{readTime}</span>
      </div>

      <ol className="sidetoc-list">
        {sections.map((s, i) => (
          <li key={s.id} data-active={s.id === activeId ? "yes" : "no"}>
            <a href={`#${s.id}`} onClick={() => setOpen(false)}>
              <span className="sidetoc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="sidetoc-text">{s.text}</span>
            </a>
          </li>
        ))}
      </ol>

      <div
        className="sidetoc-progress"
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ transform: `scaleY(${progress})` }} />
      </div>
    </nav>
  );
}

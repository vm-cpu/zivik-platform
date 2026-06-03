"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FilterBar from "@/components/atlas/FilterBar";
import CityList from "@/components/atlas/CityList";
import InfoPanel, { type Selection } from "@/components/atlas/InfoPanel";
import { THEMES } from "@/data/cases";

const AtlasMap = dynamic(() => import("@/components/atlas/AtlasMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#f4efe5" }}
    >
      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--atlas-muted)] text-sm">
        Loading map…
      </span>
    </div>
  ),
});

export default function AtlasPage() {
  const [activeTheme, setActiveTheme] = useState("all");
  const [selection, setSelection] = useState<Selection>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAZ, setSortAZ] = useState(false);

  const handleSelect = useCallback((sel: Selection) => {
    setSelection(sel);
  }, []);

  const filteredCount = THEMES[activeTheme]?.cases.length ?? 41;

  return (
    <div className="h-screen flex flex-col bg-[var(--atlas-bg)] text-[var(--atlas-ink)] overflow-hidden">
      {/* Header */}
      <header className="px-8 py-3.5 flex items-baseline justify-between border-b border-[var(--atlas-rule)]">
        <div className="flex items-baseline gap-1.5">
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-[var(--atlas-ink)] text-lg font-medium tracking-tight"
          >
            caseflows
          </Link>
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[var(--atlas-ink-soft)] ml-2">
            · The Atlas · sheet 01
          </span>
        </div>
        <nav className="flex items-center gap-4 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[var(--atlas-ink-soft)]">
          <Link
            href="/"
            className="hover:text-[var(--atlas-red)] hover:border-b hover:border-[var(--atlas-red)] transition-colors pb-px"
          >
            ← Home
          </Link>
          <Link
            href="/subway"
            className="hover:text-[var(--atlas-red)] hover:border-b hover:border-[var(--atlas-red)] transition-colors pb-px"
          >
            Subway
          </Link>
          <Link
            href="/reader"
            className="hover:text-[var(--atlas-red)] hover:border-b hover:border-[var(--atlas-red)] transition-colors pb-px"
          >
            Reader
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-8 pt-8 pb-5 border-b border-[var(--atlas-ink)]">
        <h1 className="font-[family-name:var(--font-fraunces)] text-[48px] leading-none tracking-tight text-[var(--atlas-ink)] mb-3">
          The{" "}
          <em className="italic text-[var(--atlas-red)]">
            Atlas.
          </em>
        </h1>
        <p className="font-[family-name:var(--font-fraunces)] italic text-[22px] leading-[1.3] text-[var(--atlas-ink)] max-w-[62ch] tracking-tight">
          A map of two geographies —{" "}
          <em className="text-[var(--atlas-red)]">
            where the war was fought,
          </em>{" "}
          and{" "}
          <em className="text-[var(--atlas-red)]">
            where the law has to answer for it.
          </em>
        </p>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.08em] uppercase text-[var(--atlas-gold)] font-medium mt-2.5">
          To the east, what was done. To the west, where the world is being
          asked to account for it.
        </p>
      </section>

      {/* Filter bar */}
      <FilterBar
        activeTheme={activeTheme}
        onThemeChange={(t) => {
          setActiveTheme(t);
          setSelection(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Breadcrumb */}
      <div className="px-8 py-3 flex items-center justify-between border-b border-[var(--atlas-rule)] font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[var(--atlas-muted)]">
        <div>
          <span className="text-[var(--atlas-red)] font-medium">
            {selection
              ? `${selection.type === "forum" ? "Forum" : "Harm"}: ${selection.id}`
              : `All ${filteredCount} cases · 13 court cities · 8 harm sites`}
          </span>
          {selection && (
            <button
              onClick={() => setSelection(null)}
              className="ml-2.5 border-b border-dotted border-[var(--atlas-muted)] pb-px hover:text-[var(--atlas-red)] hover:border-[var(--atlas-red)] transition-colors"
            >
              clear ✕
            </button>
          )}
        </div>
        <div className="text-[var(--atlas-muted)]">
          ↑↓ list ·{" "}
          <kbd className="bg-[var(--atlas-rule)]/20 border border-[var(--atlas-rule)] px-1 py-0.5 rounded-sm text-[10px]">
            esc
          </kbd>{" "}
          reset ·{" "}
          <kbd className="bg-[var(--atlas-rule)]/20 border border-[var(--atlas-rule)] px-1 py-0.5 rounded-sm text-[10px]">
            /
          </kbd>{" "}
          search · scroll/pinch to zoom
        </div>
      </div>

      {/* Main content: 3-panel layout */}
      <div className="flex-1 flex min-h-0 border-y border-[var(--atlas-ink)]">
        {/* Left sidebar: City list */}
        <aside className="w-60 border-r border-[var(--atlas-ink)] flex-shrink-0 overflow-hidden">
          <CityList
            activeTheme={activeTheme}
            selection={selection}
            onSelect={handleSelect}
            searchQuery={searchQuery}
            sortAZ={sortAZ}
            onToggleSort={() => setSortAZ((v) => !v)}
          />
        </aside>

        {/* Center: Map */}
        <div className="flex-1 relative border-r border-[var(--atlas-ink)] p-2 overflow-hidden">
          <AtlasMap
            activeTheme={activeTheme}
            onSelect={handleSelect}
            selection={selection}
          />
          {/* Cartouche overlay */}
          <div className="absolute top-4 right-4 border border-[var(--atlas-ink)] bg-[var(--atlas-bg)] px-4 py-3 pointer-events-none shadow-[1px_1px_0_var(--atlas-ink)]">
            <div className="font-[family-name:var(--font-fraunces)] italic text-[22px] text-[var(--atlas-ink)]">
              Of two geographies
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.08em] uppercase text-[var(--atlas-ink-soft)] mt-1">
              Ukraine v Russia · 2014—2026
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[9px] tracking-[0.08em] text-[var(--atlas-muted)]">
              41 cases · 13 forum cities · 8 sites
            </div>
          </div>
        </div>

        {/* Right sidebar: Info panel */}
        <aside className="w-[340px] flex-shrink-0 overflow-hidden bg-[var(--atlas-bg)]">
          <InfoPanel selection={selection} activeTheme={activeTheme} onSelect={handleSelect} />
        </aside>
      </div>

      {/* Footer */}
      <footer className="px-8 py-4 flex items-center justify-between flex-wrap gap-4 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[var(--atlas-muted)]">
        <span>zivik · the atlas</span>
        <span>41 cases · 13 court cities · 8 harm sites</span>
      </footer>
    </div>
  );
}

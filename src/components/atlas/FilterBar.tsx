"use client";

import { categoryColors, THEMES } from "@/data/cases";

const themeChips: { key: string; label: string; color: string; count: number }[] = [
  { key: "all", label: "all", color: "#8a8270", count: 41 },
  { key: "crimea", label: "Crimea", color: categoryColors.Crimea, count: THEMES.crimea.cases.length },
  { key: "mh17", label: "MH17", color: categoryColors.MH17, count: THEMES.mh17.cases.length },
  { key: "genocide", label: "Genocide", color: categoryColors.Genocide, count: THEMES.genocide.cases.length },
  { key: "children", label: "Children", color: categoryColors.Children, count: THEMES.children.cases.length },
  { key: "strikes", label: "Strikes", color: categoryColors.Strikes, count: THEMES.strikes.cases.length },
  { key: "naval", label: "Naval", color: categoryColors.Naval, count: THEMES.naval.cases.length },
  { key: "gas", label: "Gas", color: categoryColors.Gas, count: THEMES.gas.cases.length },
  { key: "cbr", label: "CBR", color: categoryColors.CBR, count: THEMES.cbr.cases.length },
];

interface FilterBarProps {
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterBar({
  activeTheme,
  onThemeChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const isDirty = activeTheme !== "all" || searchQuery !== "";

  return (
    <div className="grid grid-cols-[1fr_280px_auto] gap-6 items-center px-8 py-3 border-b border-[var(--atlas-rule)]">
      <div className="flex flex-wrap gap-2 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.04em] uppercase items-center">
        <span className="text-[var(--atlas-muted)] mr-1">
          filter
        </span>
        {themeChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onThemeChange(chip.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] border rounded cursor-pointer transition-all select-none ${
              activeTheme === chip.key
                ? "bg-[var(--atlas-ink)] text-[var(--atlas-bg)] border-[var(--atlas-ink)]"
                : "border-[var(--atlas-rule)] text-[var(--atlas-ink)] hover:bg-[var(--atlas-rule)]/40 hover:border-[var(--atlas-ink-soft)] active:bg-[var(--atlas-rule)]/60"
            }`}
          >
            <span
              className="w-[9px] h-[9px] rounded-full shrink-0"
              style={{ background: chip.color }}
            />
            <span>{chip.label}</span>
            <span className="opacity-60">· {chip.count}</span>
          </button>
        ))}
      </div>

      <label className="relative border-b border-[var(--atlas-ink)] py-1.5 pl-6">
        <span className="absolute left-0 top-1.5 font-[family-name:var(--font-fraunces)] text-base text-[var(--atlas-ink-soft)]">
          ⌕
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="search a city, court, or place…"
          className="w-full bg-transparent outline-none font-[family-name:var(--font-newsreader)] text-[15px] text-[var(--atlas-ink)] placeholder:text-[var(--atlas-muted)] placeholder:italic"
          autoComplete="off"
        />
      </label>

      <button
        type="button"
        onClick={() => {
          onThemeChange("all");
          onSearchChange("");
        }}
        className={`font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase px-4 py-2 min-h-[36px] border rounded transition-all ${
          isDirty
            ? "border-[var(--atlas-ink)] text-[var(--atlas-ink)] hover:bg-[var(--atlas-ink)] hover:text-[var(--atlas-bg)] cursor-pointer"
            : "border-[var(--atlas-rule)] text-[var(--atlas-muted)] opacity-40 cursor-default pointer-events-none"
        }`}
      >
        ↻ reset
      </button>
    </div>
  );
}

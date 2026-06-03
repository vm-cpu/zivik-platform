"use client";

import { FORUMS, HARMS, THEMES } from "@/data/cases";
import type { Selection } from "./InfoPanel";

interface CityListProps {
  activeTheme: string;
  selection: Selection;
  onSelect: (sel: Selection) => void;
  searchQuery: string;
  sortAZ: boolean;
  onToggleSort: () => void;
}

export default function CityList({
  activeTheme,
  selection,
  onSelect,
  searchQuery,
  sortAZ,
  onToggleSort,
}: CityListProps) {
  const tc = new Set(THEMES[activeTheme]?.cases ?? THEMES.all.cases);

  const forumCases = (f: (typeof FORUMS)[0]) => {
    if (f.hub && f.forumGroups) {
      return Object.values(f.forumGroups)
        .flatMap((g) => g.cases)
        .filter((id) => tc.has(id));
    }
    return (f.cases ?? []).filter((id) => tc.has(id));
  };
  const harmCases = (h: (typeof HARMS)[0]) =>
    h.related.filter((id) => tc.has(id));

  type CityItem = {
    id: string;
    name: string;
    type: "forum" | "harm";
    sub: string;
    count: number;
  };

  const items: CityItem[] = [
    ...FORUMS.map((f) => ({
      id: f.id,
      name: f.name,
      type: "forum" as const,
      sub: f.sub,
      count: forumCases(f).length,
    })),
    ...HARMS.map((h) => ({
      id: h.id,
      name: h.name,
      type: "harm" as const,
      sub: `${harmCases(h).length} concerned`,
      count: harmCases(h).length,
    })),
  ]
    .filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q)
        );
      }
      return item.count > 0;
    })
    .sort((a, b) =>
      sortAZ ? a.name.localeCompare(b.name) : b.count - a.count
    );

  return (
    <div className="h-full overflow-y-auto bg-[var(--paper-soft,var(--atlas-bg))]">
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-[var(--atlas-rule)] bg-[var(--atlas-bg)] flex items-center justify-between font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-[var(--atlas-muted)]">
        <span>by case count</span>
        <button
          onClick={onToggleSort}
          className={`border-b border-dotted border-[var(--atlas-muted)] pb-px hover:text-[var(--atlas-red)] hover:border-[var(--atlas-red)] transition-colors ${
            sortAZ ? "text-[var(--atlas-red)] border-[var(--atlas-red)]" : ""
          }`}
        >
          A–Z
        </button>
      </div>

      {items.map((item) => {
        const isSelected =
          selection?.type === item.type && selection.id === item.id;

        return (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() =>
              onSelect(
                isSelected
                  ? null
                  : { type: item.type, id: item.id }
              )
            }
            className={`w-full text-left grid grid-cols-[1fr_auto] gap-2 px-4 py-2.5 border-b border-[var(--atlas-rule)]/50 cursor-pointer transition-colors items-baseline ${
              isSelected
                ? "bg-[var(--atlas-ink)] text-[var(--atlas-bg)]"
                : "hover:bg-[var(--atlas-rule)]/20"
            }`}
          >
            <div>
              <span
                className={`font-[family-name:var(--font-fraunces)] text-[15px] font-medium leading-[1.2] tracking-tight ${
                  item.type === "harm"
                    ? isSelected
                      ? "text-[var(--atlas-gold)] italic"
                      : "text-[var(--atlas-red)] italic"
                    : isSelected
                      ? "text-[var(--atlas-bg)]"
                      : "text-[var(--atlas-ink)]"
                }`}
              >
                {item.name}
              </span>
              <span
                className={`block font-[family-name:var(--font-ibm-plex-mono)] text-[9px] tracking-[0.08em] uppercase mt-0.5 ${
                  isSelected
                    ? "text-[var(--atlas-bg)]/70"
                    : "text-[var(--atlas-muted)]"
                }`}
              >
                {item.sub}
              </span>
            </div>
            <span
              className={`font-[family-name:var(--font-ibm-plex-mono)] text-[11px] font-medium ${
                isSelected ? "text-[var(--atlas-bg)]/70" : "text-[var(--atlas-ink)]"
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

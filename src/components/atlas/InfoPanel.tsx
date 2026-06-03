"use client";

import Link from "next/link";
import { cases, FORUMS, HARMS, THEMES, THEME_FRAMES, type ForumCity, type HarmSite } from "@/data/cases";

export type Selection =
  | { type: "forum"; id: string; hagueForum?: string }
  | { type: "harm"; id: string }
  | null;

interface InfoPanelProps {
  selection: Selection;
  activeTheme: string;
  onSelect: (sel: Selection) => void;
}

function formatDate(iso: string) {
  if (!iso || iso.length < 7) return iso || "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  if (iso.length <= 7)
    return d.toLocaleString("en-GB", { month: "short", year: "numeric" });
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InfoPanel({ selection, activeTheme, onSelect }: InfoPanelProps) {
  const tc = new Set(THEMES[activeTheme]?.cases ?? THEMES.all.cases);
  const frame = THEME_FRAMES[activeTheme] ?? THEME_FRAMES.all;

  if (selection?.type === "forum") {
    const forum = FORUMS.find((f) => f.id === selection.id);
    if (!forum) return null;

    let caseIds: number[];
    if (forum.hub && forum.forumGroups) {
      const sub = selection.hagueForum;
      if (sub && sub !== "all" && forum.forumGroups[sub]) {
        caseIds = forum.forumGroups[sub].cases.filter((id) => tc.has(id));
      } else {
        caseIds = Object.values(forum.forumGroups)
          .flatMap((g) => g.cases)
          .filter((id) => tc.has(id));
      }
    } else {
      caseIds = (forum.cases ?? []).filter((id) => tc.has(id));
    }

    const panelCases = cases.filter((c) => caseIds.includes(c.fol));

    return (
      <div className="h-full overflow-y-auto p-6">
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-[var(--atlas-muted)] font-medium mb-2">
          {forum.name} · {panelCases.length} cases
        </p>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[30px] leading-[1.08] tracking-tight text-[var(--atlas-ink)] mb-1">
          {forum.name}
        </h2>
        <p className="font-[family-name:var(--font-newsreader)] italic text-sm text-[var(--atlas-ink-soft)] mb-4">
          {forum.sub}
        </p>

        {forum.hub && forum.forumGroups && (
          <div className="flex flex-wrap gap-0 mb-4 border-y border-[var(--atlas-rule)]">
            <button
              type="button"
              onClick={() => onSelect({ type: "forum", id: forum.id, hagueForum: "all" })}
              className={`px-4 py-2.5 min-h-[36px] text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-[0.08em] uppercase border-r border-[var(--atlas-rule)] transition-colors cursor-pointer ${
                !selection.hagueForum || selection.hagueForum === "all"
                  ? "bg-[var(--atlas-ink)] text-[var(--atlas-bg)]"
                  : "text-[var(--atlas-ink-soft)] hover:bg-[var(--atlas-rule)]/30"
              }`}
            >
              all
            </button>
            {Object.entries(forum.forumGroups).map(([name, group]) => (
              <button
                key={name}
                type="button"
                onClick={() => onSelect({ type: "forum", id: forum.id, hagueForum: name })}
                className={`px-4 py-2.5 min-h-[36px] text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-[0.08em] uppercase border-r border-[var(--atlas-rule)] transition-colors cursor-pointer ${
                  selection.hagueForum === name
                    ? "bg-[var(--atlas-ink)] text-[var(--atlas-bg)]"
                    : "text-[var(--atlas-ink-soft)] hover:bg-[var(--atlas-rule)]/30"
                }`}
              >
                {name}{" "}
                <span className="opacity-70">
                  {group.cases.filter((id) => tc.has(id)).length}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-0 border-t border-[var(--atlas-ink)] border-b border-b-[var(--atlas-rule)] mb-4">
          <div className="py-3 pr-3 border-r border-[var(--atlas-rule)]">
            <div className="font-[family-name:var(--font-fraunces)] text-[30px] leading-none text-[var(--atlas-ink)]">
              {panelCases.length}
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.08em] uppercase text-[var(--atlas-muted)] mt-1">
              cases
            </div>
          </div>
          <div className="py-3 pl-3">
            <div className="font-[family-name:var(--font-fraunces)] text-[30px] leading-none text-[var(--atlas-ink)]">
              {forum.hub
                ? Object.keys(forum.forumGroups!).length
                : 1}
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.08em] uppercase text-[var(--atlas-muted)] mt-1">
              {forum.hub ? "forums" : "forum"}
            </div>
          </div>
        </div>

        {panelCases.map((c) => {
          const inner = (
            <>
              <div className="font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.25] font-medium text-[var(--atlas-ink)]">
                {c.name}
              </div>
              <div className="font-[family-name:var(--font-newsreader)] italic text-[13px] text-[var(--atlas-ink-soft)] mt-0.5">
                {c.italic}
              </div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.06em] text-[var(--atlas-muted)] mt-1 flex gap-2.5 uppercase">
                <span>{c.forumLabel}</span>
                <span>{formatDate(c.filed)}</span>
                <span
                  className={`before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:rounded-full before:mr-1.5 before:align-middle ${
                    c.status === "pending"
                      ? "before:bg-[var(--atlas-red)]"
                      : c.status === "enforcing"
                        ? "before:bg-[var(--atlas-gold)]"
                        : "before:bg-[var(--atlas-ink)]"
                  }`}
                >
                  {c.statusLabel}
                </span>
                {c.amountLbl && (
                  <span className="text-[var(--atlas-gold)] font-medium">
                    {c.amountLbl}
                  </span>
                )}
              </div>
              {c.note && (
                <div className="font-[family-name:var(--font-newsreader)] italic text-[12px] text-[var(--atlas-muted)] mt-1.5">
                  {c.note}
                </div>
              )}
              {c.summaryUrl && (
                <span className="inline-block mt-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.04em] text-[var(--atlas-gold)]">
                  Read summary →
                </span>
              )}
            </>
          );

          return c.summaryUrl ? (
            <Link
              key={c.fol}
              href={c.summaryUrl}
              className="block py-3 border-b border-[var(--atlas-rule)]/50 cursor-pointer hover:pl-2 hover:bg-[var(--atlas-rule)]/10 transition-all"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={c.fol}
              className="py-3 border-b border-[var(--atlas-rule)]/50"
            >
              {inner}
            </div>
          );
        })}
      </div>
    );
  }

  if (selection?.type === "harm") {
    const harm = HARMS.find((h) => h.id === selection.id);
    if (!harm) return null;

    const caseIds = harm.related.filter((id) => tc.has(id));
    const panelCases = cases.filter((c) => caseIds.includes(c.fol));

    return (
      <div className="h-full overflow-y-auto p-6">
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-[var(--atlas-muted)] font-medium mb-2">
          harm site · {panelCases.length} concerned
        </p>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[30px] leading-[1.08] tracking-tight text-[var(--atlas-red)] italic mb-4">
          {harm.name}
        </h2>

        {panelCases.map((c) => (
          <div
            key={c.fol}
            className="py-3 border-b border-[var(--atlas-rule)]/50 cursor-pointer hover:pl-2 transition-all"
          >
            <div className="font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.25] font-medium text-[var(--atlas-ink)]">
              {c.name}
            </div>
            <div className="font-[family-name:var(--font-newsreader)] italic text-[13px] text-[var(--atlas-ink-soft)] mt-0.5">
              {c.italic}
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.06em] text-[var(--atlas-muted)] mt-1 flex gap-2.5 uppercase">
              <span>{c.forumLabel}</span>
              <span>{formatDate(c.filed)}</span>
              {c.amountLbl && (
                <span className="text-[var(--atlas-gold)] font-medium">
                  {c.amountLbl}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: theme overview
  return (
    <div className="h-full overflow-y-auto p-6">
      <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-[var(--atlas-muted)] font-medium mb-2">
        {activeTheme === "all" ? "all themes" : activeTheme} · {tc.size} cases
      </p>

      <h2
        className="font-[family-name:var(--font-fraunces)] text-[30px] leading-[1.08] tracking-tight text-[var(--atlas-ink)] mb-3.5 [&_em]:italic [&_em]:text-[var(--atlas-red)]"
        dangerouslySetInnerHTML={{ __html: frame.head }}
      />

      <p className="font-[family-name:var(--font-newsreader)] text-[15px] leading-[1.55] text-[var(--atlas-ink)] border-l-2 border-[var(--atlas-gold)] pl-3 mb-4">
        {frame.line}
      </p>

      <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.04em] text-[var(--atlas-muted)] py-2.5 border-y border-[var(--atlas-rule)]/50 mb-4">
        <span className="text-[var(--atlas-ink)] font-medium uppercase text-[10px] tracking-[0.06em]">
          click any place →
        </span>{" "}
        The panel will fill with that place&apos;s cases and curated reading.
      </div>

      <div className="grid grid-cols-2 gap-0 border-t border-[var(--atlas-ink)] border-b border-b-[var(--atlas-rule)] mb-4">
        <div className="py-3 pr-3 border-r border-[var(--atlas-rule)]">
          <div className="font-[family-name:var(--font-fraunces)] text-[30px] leading-none text-[var(--atlas-ink)]">
            {tc.size}
          </div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.08em] uppercase text-[var(--atlas-muted)] mt-1">
            cases
          </div>
        </div>
        <div className="py-3 pl-3">
          <div className="font-[family-name:var(--font-fraunces)] text-[30px] leading-none text-[var(--atlas-ink)]">
            21
          </div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.08em] uppercase text-[var(--atlas-muted)] mt-1">
            places
          </div>
        </div>
      </div>

      <div className="p-3.5 border border-[var(--atlas-ink)] bg-[var(--atlas-rule)]/20">
        <h4 className="font-[family-name:var(--font-fraunces)] text-base text-[var(--atlas-ink)] mb-2">
          Legend
        </h4>
        <div className="space-y-1 text-[13px] font-[family-name:var(--font-newsreader)] text-[var(--atlas-ink-soft)]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[var(--atlas-green)] border-[1.5px] border-[var(--atlas-ink)]" />
            Forum city — sized by case count
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full border-[1.5px] border-[var(--atlas-red)] relative after:content-[''] after:absolute after:inset-[3px] after:bg-[var(--atlas-red)] after:rounded-full" />
            Harm site — the place at issue
          </div>
          <div className="italic text-[12px] text-[var(--atlas-muted)] mt-1.5">
            — after Mercator, much abridged.
          </div>
        </div>
      </div>
    </div>
  );
}

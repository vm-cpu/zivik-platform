"use client";

import { useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { WarrantWave } from "@/content/summaries/types";

/**
 * The warrants of arrest, wave by wave.
 *
 * The ICC's Ukraine docket is not one decision but three, each a different
 * theory of the case: the deportation of children (March 2023), the missile
 * campaign against the power grid as flown and sailed (March 2024), and the
 * same campaign at the top of the chain of command (June 2024). The wall keeps
 * that structure: a rail of waves, each holding its suspects. A card opens to
 * the charges — every chip is a Rome Statute article — and each wave links to
 * the Court's own announcement, so the reader can verify against the source.
 */
export default function WarrantWall({
  waves,
  locale,
  labels,
}: {
  waves: WarrantWave[];
  locale: Locale;
  labels: { charges: string; modes: string; announcement: string; warCrime: string; cah: string };
}) {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <div className="warrants">
      {waves.map((w, wi) => (
        <section key={wi} className="wave" data-wave={wi}>
          <header className="wave-head">
            <span className="wave-date">{pick(w.date, locale)}</span>
            <h3 className="wave-theme">{pick(w.theme, locale)}</h3>
            <p className="wave-sum">{pick(w.summary, locale)}</p>
          </header>

          <ul className="wave-people">
            {w.persons.map((p, pi) => {
              const key = `${wi}-${pi}`;
              const isOpen = open === key;
              return (
                <li key={pi} data-on={isOpen ? "yes" : "no"}>
                  <button
                    type="button"
                    className="suspect"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : key)}
                  >
                    <span className="suspect-name">{pick(p.name, locale)}</span>
                    <span className="suspect-role">{pick(p.role, locale)}</span>

                    {isOpen && (
                      <span className="suspect-detail">
                        <span className="suspect-lbl">{labels.charges}</span>
                        <span className="charges">
                          {p.charges.map((c, ci) => (
                            <span key={ci} className="charge" data-kind={c.kind}>
                              <b>{c.kind === "cah" ? labels.cah : labels.warCrime}</b>
                              {pick(c.label, locale)}
                              <em>{locale === "uk" ? "ст." : "art."} {c.art}</em>
                            </span>
                          ))}
                        </span>
                        <span className="suspect-lbl">{labels.modes}</span>
                        <span className="modes">
                          {p.modes.map((m, mi) => (
                            <span key={mi} className="mode">
                              {pick(m.label, locale)}
                              <em> · {locale === "uk" ? "ст." : "art."} {m.art}</em>
                            </span>
                          ))}
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <a className="wave-src" href={w.url} target="_blank" rel="noopener noreferrer">
            {labels.announcement} ↗
          </a>
        </section>
      ))}
    </div>
  );
}

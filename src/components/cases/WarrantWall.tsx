"use client";

import { useState } from "react";
import { pick } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Localized } from "@/content/types";
import type { WarrantWave } from "@/content/summaries/types";

/**
 * The warrants of arrest, drawn as a ladder of command.
 *
 * The strongest fact in this data is not the six names — it is their
 * altitude. The warrants run down an entire vertical of power: head of state,
 * presidential office, Defence Ministry and General Staff, operational
 * commanders. So the instrument is a ladder: one spine, four rungs, each
 * suspect pinned to their rung and coloured by the theory of the case that
 * charged them (the deportation of children, or the campaign against the
 * grid). Selecting a suspect opens the charges — every chip a Rome Statute
 * article — with the Court's own announcement one click away, so each claim
 * stays verifiable at the source.
 *
 * Without `rungs` the component falls back to plain wave sections, so a
 * future situation summary that has no command structure still renders.
 */
export default function WarrantWall({
  waves,
  rungs,
  locale,
  labels,
}: {
  waves: WarrantWave[];
  rungs?: Localized[];
  locale: Locale;
  labels: { charges: string; modes: string; announcement: string; warCrime: string; cah: string };
}) {
  const [open, setOpen] = useState<string>("0-0");

  // Flatten to (wave, person) pairs once; the ladder and the detail share it.
  const flat = waves.flatMap((w, wi) => w.persons.map((p, pi) => ({ w, wi, p, key: `${wi}-${pi}` })));
  const sel = flat.find((f) => f.key === open) ?? flat[0];

  // The detail renders inside the selected suspect's own rung (or wave), so a
  // tap answers where the reader is looking — a single panel at the foot of
  // the ladder opened off-screen and read as a dead click.
  const detail = (
    <div className="wr-detail" data-wave={sel.wi}>
      <div className="wr-detail-head">
        <span className="wr-detail-name">{pick(sel.p.name, locale)}</span>
        <span className="wr-detail-wave">
          {pick(sel.w.theme, locale)} · {pick(sel.w.date, locale)}
        </span>
      </div>
      <p className="wr-detail-role">
        {pick(sel.p.role, locale)}
        {sel.p.born ? ` · ${sel.p.born}` : ""}
      </p>

      <span className="suspect-lbl">{labels.charges}</span>
      <div className="charges">
        {sel.p.charges.map((c, ci) => (
          <span key={ci} className="charge" data-kind={c.kind}>
            <b>{c.kind === "cah" ? labels.cah : labels.warCrime}</b>
            {pick(c.label, locale)}
            <em>
              {locale === "uk" ? "ст." : "art."} {c.art}
            </em>
          </span>
        ))}
      </div>

      <span className="suspect-lbl">{labels.modes}</span>
      <div className="modes">
        {sel.p.modes.map((m, mi) => (
          <span key={mi} className="mode">
            {pick(m.label, locale)}
            <em>
              {" "}
              · {locale === "uk" ? "ст." : "art."} {m.art}
            </em>
          </span>
        ))}
      </div>

      <a className="wave-src" href={sel.w.url} target="_blank" rel="noopener noreferrer">
        {labels.announcement} ↗
      </a>
    </div>
  );

  if (!rungs) {
    // Fallback: plain wave sections (no command structure declared).
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
              {w.persons.map((p, pi) => (
                <li key={pi} data-on={open === `${wi}-${pi}` ? "yes" : "no"}>
                  <button
                    type="button"
                    className="suspect"
                    aria-expanded={open === `${wi}-${pi}`}
                    onClick={() => setOpen(`${wi}-${pi}`)}
                  >
                    <span className="suspect-name">{pick(p.name, locale)}</span>
                    <span className="suspect-role">{pick(p.role, locale)}</span>
                  </button>
                </li>
              ))}
            </ul>
            {sel.wi === wi && detail}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="warrants warrants-ladder">
      {/* legend: one entry per wave, carrying the wave's colour and date */}
      <div className="wr-legend">
        {waves.map((w, wi) => (
          <span key={wi} className="wr-key" data-wave={wi}>
            <i aria-hidden="true" />
            {pick(w.theme, locale)} · {pick(w.date, locale)}
          </span>
        ))}
      </div>

      <div className="ladder">
        <div className="ladder-spine" aria-hidden="true" />
        {rungs.map((r, ri) => {
          const here = flat.filter((f) => (f.p.rung ?? 0) === ri);
          if (here.length === 0) return null;
          return (
            <div key={ri} className="rung">
              <div className="rung-label">
                <b>{String(ri + 1).padStart(2, "0")}</b>
                {pick(r, locale)}
              </div>
              <div className="rung-people">
                {here.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className="wr-node"
                    data-wave={f.wi}
                    data-on={open === f.key ? "yes" : "no"}
                    aria-expanded={open === f.key}
                    onClick={() => setOpen(f.key)}
                  >
                    <span className="wr-node-name">{pick(f.p.name, locale)}</span>
                    <span className="wr-node-role">{pick(f.p.role, locale)}</span>
                    <span className="wr-node-date">{pick(f.w.date, locale)}</span>
                  </button>
                ))}
                {here.some((f) => f.key === sel.key) && detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

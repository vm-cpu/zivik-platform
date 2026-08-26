"use client";

import { useState } from "react";
import "./warrant-wave.css";

/**
 * The warrants of arrest, drawn as a ladder of command.
 *
 * The strongest fact in this data is not the six names — it is their
 * altitude: the warrants run down an entire vertical of power. One spine,
 * named rungs, each suspect pinned to their rung and coloured by the theory
 * of the case that charged them. Selecting a suspect opens the charges in
 * their own rung — every chip a Rome Statute article, the Court's own
 * announcement one click away. Without `rungs` the component falls back to
 * plain wave sections. Props arrive locale-resolved (see CaseTimeline).
 */
export interface WarrantPersonR {
  name: string;
  role: string;
  born?: string;
  rung?: number;
  charges: { art: string; label: string; kind: "war-crime" | "cah" }[];
  modes: { art: string; label: string }[];
}
export interface WarrantWaveR {
  date: string;
  iso: string;
  theme: string;
  summary: string;
  url: string;
  persons: WarrantPersonR[];
}

export default function WarrantWall({
  waves,
  rungs,
  labels,
}: {
  waves: WarrantWaveR[];
  rungs?: string[];
  labels: {
    charges: string;
    modes: string;
    announcement: string;
    warCrime: string;
    cah: string;
    /** "ст." / "art." */
    art: string;
  };
}) {
  const [open, setOpen] = useState<string>("0-0");

  const flat = waves.flatMap((w, wi) => w.persons.map((p, pi) => ({ w, wi, p, key: `${wi}-${pi}` })));
  const sel = flat.find((f) => f.key === open) ?? flat[0];

  const detail = (
    <div className="wr-detail" data-wave={sel.wi}>
      <div className="wr-detail-head">
        <span className="wr-detail-name">{sel.p.name}</span>
        <span className="wr-detail-wave">
          {sel.w.theme} · {sel.w.date}
        </span>
      </div>
      <p className="wr-detail-role">
        {sel.p.role}
        {sel.p.born ? ` · ${sel.p.born}` : ""}
      </p>

      <span className="suspect-lbl">{labels.charges}</span>
      <div className="charges">
        {sel.p.charges.map((c, ci) => (
          <span key={ci} className="charge" data-kind={c.kind}>
            <b>{c.kind === "cah" ? labels.cah : labels.warCrime}</b>
            {c.label}
            <em>
              {labels.art} {c.art}
            </em>
          </span>
        ))}
      </div>

      <span className="suspect-lbl">{labels.modes}</span>
      <div className="modes">
        {sel.p.modes.map((m, mi) => (
          <span key={mi} className="mode">
            {m.label}
            <em>
              {" "}
              · {labels.art} {m.art}
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
    return (
      <div className="warrants">
        {waves.map((w, wi) => (
          <section key={wi} className="wave" data-wave={wi}>
            <header className="wave-head">
              <span className="wave-date">{w.date}</span>
              <h3 className="wave-theme">{w.theme}</h3>
              <p className="wave-sum">{w.summary}</p>
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
                    <span className="suspect-name">{p.name}</span>
                    <span className="suspect-role">{p.role}</span>
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
      {/* The legend is also where each wave says what it is about. `summary`
          is authored on every wave and used to render only in the `!rungs`
          fallback below — and icc-ukraine, the one page with warrants, sets
          `rungs`, so the sentence never appeared: the ladder named three
          waves and explained none of them. */}
      <div className="wr-legend">
        {waves.map((w, wi) => (
          <span key={wi} className="wr-key wr-key-note" data-wave={wi}>
            <i aria-hidden="true" />
            <span className="wr-key-head">
              {w.theme} · {w.date}
            </span>
            <span className="wr-key-sum">{w.summary}</span>
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
                {r}
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
                    <span className="wr-node-name">{f.p.name}</span>
                    <span className="wr-node-role">{f.p.role}</span>
                    <span className="wr-node-date">{f.w.date}</span>
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

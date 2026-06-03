"use client";

import { useState, useRef } from "react";

const COLORS: Record<string, string> = {
  mh17: "#d6452f",
  crimea: "#2f6cd6",
  children: "#d4a045",
  genocide: "#7a4ed6",
  naval: "#2fa898",
  gas: "#5e9c3d",
  strikes: "#e07c2f",
  cbr: "#b8893a",
};

interface Station {
  x: number; y: number; name: string; sub: string;
  hub?: boolean; major?: boolean; harm?: boolean; dotted?: boolean;
}

interface Line {
  id: string; name: string; color: string; stops: string[];
  desc: string; cases: number[];
}

// Spread the Hague hub and Ukraine cluster for readability
const STATIONS: Record<string, Station> = {
  "hague-icj":  { x: 490, y: 340, name: "ICJ",          sub: "World Court",           hub: true, major: true },
  "hague-icc":  { x: 440, y: 370, name: "ICC",          sub: "Criminal Court",        hub: true },
  "hague-pca":  { x: 500, y: 400, name: "PCA",          sub: "Permanent Arbitration", hub: true },
  "hague-hr":   { x: 450, y: 430, name: "Hoge Raad",    sub: "NL Supreme Court",      hub: true },
  "hague-jit":  { x: 400, y: 390, name: "JIT/Schiphol", sub: "NL Criminal",           hub: true },
  strasbourg:   { x: 370, y: 530, name: "Strasbourg",   sub: "ECtHR",                 major: true },
  stockholm:    { x: 700, y: 110, name: "Stockholm",    sub: "SCC Arbitration" },
  helsinki:     { x: 830, y: 120, name: "Helsinki",     sub: "Enforcement / FI Trial" },
  vilnius:     { x: 830, y: 270, name: "Vilnius",      sub: "LT Universal Jurisdiction" },
  frankfurt:   { x: 560, y: 510, name: "Frankfurt",    sub: "OLG · DE Universal" },
  paris:       { x: 280, y: 490, name: "Paris",        sub: "Cour de cassation" },
  london:      { x: 210, y: 370, name: "London",       sub: "UK High Court" },
  hamburg:     { x: 580, y: 260, name: "Hamburg",      sub: "ITLOS" },
  brussels:    { x: 420, y: 470, name: "Brussels",     sub: "Euroclear" },
  geneva:      { x: 440, y: 630, name: "Geneva",       sub: "PCA · Crimea petrol" },
  zurich:      { x: 560, y: 630, name: "Zürich",       sub: "ICC arb · gas transit" },
  bern:        { x: 500, y: 690, name: "Bern",         sub: "Swiss Federal Tribunal" },
  vienna:      { x: 700, y: 540, name: "Vienna",       sub: "Enforcement" },
  icao:        { x: 60,  y: 100, name: "Montreal",     sub: "ICAO Council",           dotted: true },
  // Ukraine harm sites — spread vertically for readability
  crimea:       { x: 1120, y: 620, name: "Crimea",          sub: "occupied 2014",           harm: true, major: true },
  donbas:       { x: 1130, y: 440, name: "Donbas",          sub: "2014– / 2022–",           harm: true, major: true },
  "mh17-site":  { x: 1150, y: 520, name: "Hrabove",         sub: "MH17 · 17.vii.2014",      harm: true },
  kerch:        { x: 1110, y: 670, name: "Kerch Strait",    sub: "naval seizure 2018",      harm: true },
  sokhranivka:  { x: 1120, y: 380, name: "Sokhranivka",     sub: "transit force-majeure",   harm: true },
  bucha:        { x: 1140, y: 330, name: "Bucha + Kyiv",    sub: "occupation 2022",         harm: true },
  kakhovka:     { x: 1100, y: 570, name: "Kakhovka",        sub: "HPP destroyed 2023",      harm: true },
  zaporizhzhia: { x: 1110, y: 490, name: "Zaporizhzhia",    sub: "NPP seized 2022",         harm: true },
  "ru-fin":     { x: 1200, y: 280, name: "Russian state",   sub: "CBR & sanctions",         harm: true, dotted: true },
};

const LINES: Line[] = [
  { id: "mh17",     name: "MH17 Line",             color: COLORS.mh17,     stops: ["mh17-site", "hague-jit", "strasbourg", "icao", "hague-icj"], desc: "From a field in Hrabove to the Schiphol bench, to Strasbourg, to Montreal, to the World Court.", cases: [5, 17, 33, 34, 3] },
  { id: "crimea",   name: "Crimea Awards Line",    color: COLORS.crimea,   stops: ["crimea", "hague-pca", "hague-hr", "paris", "helsinki", "vienna", "london"], desc: "A decade of BIT arbitrations. Awards upheld at the Hoge Raad, enforced across five jurisdictions.", cases: [21, 22, 23, 24, 25, 26, 27, 28, 29, 35, 36, 37, 38] },
  { id: "genocide", name: "Genocide Line",         color: COLORS.genocide, stops: ["donbas", "hague-icj"], desc: "Ukraine asks the ICJ to declare that the Genocide Convention does not justify the war. 32 states intervene.", cases: [1, 2] },
  { id: "children", name: "Children Line",         color: COLORS.children, stops: ["bucha", "hague-icc"], desc: "ICC arrest warrants for deportation of children — Putin and Lvova-Belova.", cases: [9, 10, 11] },
  { id: "strikes",  name: "Strike Campaign Line",  color: COLORS.strikes,  stops: ["zaporizhzhia", "hague-icc"], desc: "Four ICC warrants for the missile campaign against energy infrastructure.", cases: [12, 13, 14, 15] },
  { id: "naval",    name: "Naval Vessels Line",     color: COLORS.naval,    stops: ["kerch", "hamburg", "hague-pca", "strasbourg"], desc: "Three vessels seized at Kerch Strait → ITLOS → PCA → ECtHR.", cases: [6, 16] },
  { id: "gas",      name: "Gas Transit Line",      color: COLORS.gas,      stops: ["sokhranivka", "stockholm", "zurich", "bern"], desc: "Stockholm twice, Zurich after the 2022 force-majeure. Confirmed in Bern, March 2026.", cases: [18, 19, 20] },
  { id: "cbr",      name: "CBR Freeze Line",       color: COLORS.cbr,      stops: ["ru-fin", "brussels"], desc: "€210bn of Russian Central Bank reserves immobilised at Euroclear. Frozen indefinitely.", cases: [41] },
];

function lineToPath(line: Line, lineIndex: number): string {
  const pts = line.stops.map((id) => STATIONS[id]).filter(Boolean);
  if (!pts.length) return "";
  const offset = (lineIndex - 3.5) * 2;
  let path = "";
  pts.forEach((p, i) => {
    const px = p.x + offset, py = p.y + offset;
    if (i === 0) { path += `M ${px} ${py}`; return; }
    const prev = pts[i - 1];
    const prevX = prev.x + offset, prevY = prev.y + offset;
    const dx = px - prevX, dy = py - prevY;
    if (Math.abs(dx) < 40 || Math.abs(dy) < 40) {
      path += ` L ${px} ${py}`;
    } else if (Math.abs(dx) > Math.abs(dy)) {
      path += ` L ${px} ${prevY} L ${px} ${py}`;
    } else {
      path += ` L ${prevX} ${py} L ${px} ${py}`;
    }
  });
  return path;
}

export default function SubwayMap() {
  const [isolated, setIsolated] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; html: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toggle = (id: string) => setIsolated((p) => (p === id ? null : id));

  const showTip = (e: React.MouseEvent, html: string) => {
    setTooltip({ x: e.clientX + 14, y: e.clientY + 14, html });
  };
  const moveTip = (e: React.MouseEvent) => {
    if (tooltip) setTooltip({ ...tooltip, x: e.clientX + 14, y: e.clientY + 14 });
  };
  const hideTip = () => setTooltip(null);

  const stationTip = (e: React.MouseEvent, id: string) => {
    const s = STATIONS[id];
    const matching = LINES.filter((l) => l.stops.includes(id));
    const lines = matching
      .map((l) => `<span style="color:${l.color}">● ${l.name}</span>`)
      .join("<br/>");
    showTip(e, `<strong>${s.name}</strong><br/><em style="color:#bbb">${s.sub}</em>${lines ? "<br/>" + lines : ""}`);
  };

  const lineTip = (e: React.MouseEvent, lineId: string) => {
    const l = LINES.find((x) => x.id === lineId);
    if (!l) return;
    showTip(e, `<strong style="color:${l.color}">● ${l.name}</strong><br/>${l.cases.length} cases · click to isolate`);
  };

  const chips = [
    { id: "mh17", label: "MH17" }, { id: "crimea", label: "Crimea Awards" },
    { id: "genocide", label: "Genocide" }, { id: "children", label: "Children" },
    { id: "strikes", label: "Strikes" }, { id: "naval", label: "Naval" },
    { id: "gas", label: "Gas Transit" }, { id: "cbr", label: "CBR Freeze" },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="py-3.5 border-b border-[#c8c0ac] flex items-center gap-2 flex-wrap font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[#8a8270]">
        <span className="mr-1">isolate a line</span>
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => toggle(chip.id)}
            className={`relative pl-[22px] pr-3 py-2 min-h-[36px] border border-[#c8c0ac] text-[#1c1814] font-medium normal-case tracking-[0.04em] text-[11px] cursor-pointer transition-all rounded-sm hover:bg-[#ece5d3] ${isolated && isolated !== chip.id ? "opacity-40" : ""}`}
          >
            <span className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full" style={{ background: COLORS[chip.id] }} />
            {chip.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsolated(null)}
          className={`relative pl-[22px] pr-3 py-2 min-h-[36px] border border-[#c8c0ac] text-[#1c1814] font-medium normal-case tracking-[0.04em] text-[11px] cursor-pointer transition-all rounded-sm hover:bg-[#ece5d3] ${isolated ? "opacity-40" : ""}`}
        >
          <span className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-[#1c1814]" />
          show all
        </button>
      </div>

      {/* SVG Map */}
      <div className="relative bg-[#f8f5ee] my-2 border border-[#c8c0ac] overflow-hidden">
        <svg ref={svgRef} viewBox="0 0 1320 760" preserveAspectRatio="xMidYMid meet" className="block w-full">
          {/* Background zones */}
          <rect x="1040" y="260" width="260" height="440" rx="4" fill="#e8d8c7" opacity=".3" />
          <line x1="1040" y1="260" x2="1040" y2="700" stroke="#c8c0ac" strokeWidth=".5" strokeDasharray="3 5" />
          <text x="1170" y="720" textAnchor="middle" className="fill-[#c8c0ac]" style={{ fontFamily: "var(--font-fraunces),serif", fontStyle: "italic", fontSize: "14px", letterSpacing: ".15em", textTransform: "uppercase" }}>
            Ukraine
          </text>
          <text x="480" y="190" textAnchor="middle" className="fill-[#c8c0ac]" style={{ fontFamily: "var(--font-fraunces),serif", fontStyle: "italic", fontSize: "14px", letterSpacing: ".15em", textTransform: "uppercase" }}>
            European courts
          </text>

          {/* Lines */}
          {LINES.map((line, i) => (
            <path
              key={line.id}
              d={lineToPath(line, i)}
              fill="none"
              stroke={line.color}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isolated && isolated !== line.id ? 0.08 : 1}
              className="cursor-pointer transition-opacity duration-300"
              onClick={() => toggle(line.id)}
              onMouseEnter={(e) => lineTip(e, line.id)}
              onMouseMove={moveTip}
              onMouseLeave={hideTip}
            />
          ))}

          {/* Harm pins */}
          {Object.entries(STATIONS).filter(([, s]) => s.harm).map(([id, s]) => {
            const labelX = s.x - 14;
            return (
              <g key={id} className="cursor-pointer" onMouseEnter={(e) => stationTip(e, id)} onMouseMove={moveTip} onMouseLeave={hideTip}>
                <rect x={labelX - (s.name.length * 6.5)} y={s.y - 8} width={s.name.length * 6.5 + 4} height={28} rx="2" fill="#f8f5ee" opacity=".85" />
                <circle cx={s.x} cy={s.y} r={s.major ? 7 : 5} fill={COLORS.mh17} stroke="#f8f5ee" strokeWidth={1.5} strokeDasharray={s.dotted ? "3 3" : undefined} />
                <text x={labelX} y={s.y + 4} textAnchor="end" style={{ fontFamily: "var(--font-ibm-plex-mono),monospace", fontSize: "9px", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }} fill={COLORS.mh17}>
                  {s.name}
                </text>
                <text x={labelX} y={s.y + 16} textAnchor="end" style={{ fontFamily: "var(--font-ibm-plex-mono),monospace", fontSize: "8px", letterSpacing: ".06em", textTransform: "uppercase" }} fill="#8a8270">
                  {s.sub}
                </text>
              </g>
            );
          })}

          {/* Court stations */}
          {Object.entries(STATIONS).filter(([, s]) => !s.harm).map(([id, s]) => {
            const r = s.major ? 8 : s.hub ? 6 : 5;
            const lblX = s.x < 200 ? s.x - 12 : s.x + 12;
            const anchor = s.x < 200 ? "end" : "start";
            const textW = Math.max(s.name.length, s.sub.length) * 6.5 + 8;
            const bgX = anchor === "end" ? lblX - textW : lblX - 4;
            return (
              <g key={id} className="cursor-pointer" onMouseEnter={(e) => stationTip(e, id)} onMouseMove={moveTip} onMouseLeave={hideTip}>
                <rect x={bgX} y={s.y - 8} width={textW} height={28} rx="2" fill="#f8f5ee" opacity=".88" />
                <circle cx={s.x} cy={s.y} r={r} fill="#f8f5ee" stroke="#1c1814" strokeWidth={s.major ? 2.5 : s.hub ? 2 : 1.5} strokeDasharray={s.dotted ? "3 3" : undefined} />
                <text x={lblX} y={s.y + 4} textAnchor={anchor} style={{ fontFamily: "var(--font-ibm-plex-mono),system-ui,sans-serif", fontSize: s.major ? "12px" : "10px", fontWeight: s.major ? 700 : 600 }} fill="#1c1814">
                  {s.name}
                </text>
                <text x={lblX} y={s.y + 16} textAnchor={anchor} style={{ fontFamily: "var(--font-ibm-plex-mono),monospace", fontSize: "8px", letterSpacing: ".06em", textTransform: "uppercase" }} fill="#8a8270">
                  {s.sub}
                </text>
              </g>
            );
          })}

          {/* The Hague hub label */}
          <rect x={370} y={295} width={180} height={36} rx="2" fill="#f8f5ee" opacity=".92" />
          <text x={460} y={312} textAnchor="middle" style={{ fontFamily: "var(--font-ibm-plex-mono),system-ui", fontSize: "15px", fontWeight: 700 }} fill="#1c1814">
            The Hague
          </text>
          <text x={460} y={326} textAnchor="middle" style={{ fontFamily: "var(--font-ibm-plex-mono),monospace", fontSize: "9px", letterSpacing: ".06em", textTransform: "uppercase" }} fill="#8a8270">
            megahub · 5 forums
          </text>
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-[#1c1814] text-[#f8f5ee] px-3.5 py-2.5 text-[12px] leading-[1.5] max-w-[280px] rounded-sm shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y, fontFamily: "var(--font-ibm-plex-mono),system-ui" }}
          dangerouslySetInnerHTML={{ __html: tooltip.html }}
        />
      )}

      {/* Lines panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-[#1c1814] border-b border-b-[#c8c0ac] mb-6">
        {LINES.map((line, i) => (
          <button
            key={line.id}
            type="button"
            onClick={() => toggle(line.id)}
            className={`text-left p-5 border-r border-[#c8c0ac] last:border-r-0 hover:bg-[#ece5d3] transition-colors cursor-pointer ${i >= 4 ? "border-t border-t-[#c8c0ac]" : ""} ${isolated === line.id ? "bg-[#ece5d3]" : ""}`}
          >
            <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[#1c1814]">
              <span className="w-3.5 h-3.5 rounded-sm inline-block shrink-0" style={{ background: line.color }} />
              {line.name}
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.06em] uppercase text-[#8a8270] mt-1.5">
              {line.stops.map((s) => STATIONS[s]?.name || s).join(" › ")}
            </div>
            <div className="font-[family-name:var(--font-fraunces)] italic text-[13px] text-[#4a443a] mt-2 leading-[1.45]">
              {line.desc}
            </div>
            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#8a8270] tracking-[0.04em] mt-1.5">
              {line.cases.length} case{line.cases.length === 1 ? "" : "s"}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

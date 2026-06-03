"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FORUMS, HARMS, THEMES, cases } from "@/data/cases";
import type { Selection } from "./InfoPanel";

interface AtlasMapProps {
  activeTheme: string;
  onSelect: (sel: Selection) => void;
  selection: Selection;
}

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

export default function AtlasMap({
  activeTheme,
  onSelect,
  selection,
}: AtlasMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const tc = useMemo(
    () => new Set(THEMES[activeTheme]?.cases ?? THEMES.all.cases),
    [activeTheme]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [50.5, 20],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
    });
    L.control.zoom({ position: "topleft" }).addTo(map);
    L.tileLayer(TILE_URL, { maxZoom: 10, subdomains: "abcd" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const renderMarkers = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    FORUMS.forEach((f) => {
      const ct = f.hub && f.forumGroups
        ? Object.values(f.forumGroups).flatMap((g) => g.cases).filter((id) => tc.has(id)).length
        : (f.cases ?? []).filter((id) => tc.has(id)).length;

      if (ct === 0 && activeTheme !== "all") return;
      const isSelected = selection?.type === "forum" && selection.id === f.id;
      const r = Math.max(6, Math.sqrt(ct) * 4.5);

      const marker = L.circleMarker([f.coord[1], f.coord[0]], {
        radius: r,
        fillColor: isSelected ? "#b8893a" : "#5e7a64",
        color: "#1c1814",
        weight: isSelected ? 2.5 : 1,
        fillOpacity: ct === 0 ? 0.18 : 0.85,
      });
      marker.bindTooltip(
        `<b>${f.name}</b><br/><span style="opacity:.7">${f.sub}</span><br/>${ct} cases`,
        { direction: "top", offset: [0, -r] }
      );
      marker.on("click", () =>
        onSelect(isSelected ? null : { type: "forum", id: f.id })
      );
      marker.addTo(layer);

      if (ct >= 3 || f.major) {
        L.marker([f.coord[1], f.coord[0]], {
          icon: L.divIcon({
            className: "",
            html: `<div style="font-family:var(--font-fraunces),serif;font-style:italic;font-size:${f.major ? "13px" : "11px"};color:#1c1814;white-space:nowrap;pointer-events:none;transform:translate(${r + 4}px,-8px)">${f.name}</div>`,
            iconSize: [0, 0],
          }),
          interactive: false,
        }).addTo(layer);
      }

      if (ct >= 3) {
        L.marker([f.coord[1], f.coord[0]], {
          icon: L.divIcon({
            className: "",
            html: `<span style="background:#5e7a64;color:white;font-size:11px;padding:2px 6px;border-radius:10px;font-family:var(--font-ibm-plex-mono),monospace;pointer-events:none">${ct}</span>`,
            iconSize: [30, 20],
            iconAnchor: [15, 10],
          }),
          interactive: false,
        }).addTo(layer);
      }
    });

    HARMS.forEach((h) => {
      const ct = h.related.filter((id) => tc.has(id)).length;
      if (ct === 0 && activeTheme !== "all") return;
      const isSelected = selection?.type === "harm" && selection.id === h.id;

      const ring = L.circleMarker([h.coord[1], h.coord[0]], {
        radius: 12,
        fillColor: "transparent",
        color: isSelected ? "#b8893a" : "#a83426",
        weight: isSelected ? 2 : 1.2,
        fillOpacity: 0,
        opacity: ct === 0 ? 0.18 : 1,
      });
      const dot = L.circleMarker([h.coord[1], h.coord[0]], {
        radius: 4,
        fillColor: isSelected ? "#b8893a" : "#a83426",
        color: "#f4efe5",
        weight: 1.2,
        fillOpacity: ct === 0 ? 0.18 : 1,
      });

      ring.on("click", () =>
        onSelect(isSelected ? null : { type: "harm", id: h.id })
      );
      dot.on("click", () =>
        onSelect(isSelected ? null : { type: "harm", id: h.id })
      );

      ring.addTo(layer);
      dot.addTo(layer);

      L.marker([h.coord[1], h.coord[0]], {
        icon: L.divIcon({
          className: "",
          html: `<div style="font-family:var(--font-ibm-plex-mono),monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#a83426;white-space:nowrap;pointer-events:none;transform:translate(16px,-6px)">${h.name}</div>`,
          iconSize: [0, 0],
        }),
        interactive: false,
      }).addTo(layer);
    });
  }, [tc, activeTheme, selection, onSelect]);

  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#f4efe5",
        backgroundImage:
          "radial-gradient(rgba(28,24,20,.025) 1px, transparent 1px), radial-gradient(rgba(28,24,20,.012) 1px, transparent 1px)",
        backgroundSize: "4px 4px, 9px 9px",
        backgroundPosition: "0 0, 1px 2px",
      }}
    />
  );
}

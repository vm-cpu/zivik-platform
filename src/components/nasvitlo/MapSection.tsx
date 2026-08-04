import type { Dictionary } from "@/i18n/dictionaries";

const legendItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  font: "500 12px 'Fira Sans'",
  color: "#C9AFA8",
};

/**
 * Events map. Currently embeds the self-contained d3 map via iframe; a native
 * `d3-geo` React component is the planned replacement (see docs/ARCHITECTURE).
 */
export default function MapSection({ dict }: { dict: Dictionary }) {
  return (
    <div
      id="map"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "10px 28px 40px",
        background: "var(--paper)",
        scrollMarginTop: 16,
      }}
    >
      <div
        className="nsv-sechead"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 18,
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.mapSection.label}</span>
          </div>
          <h2 style={{ fontSize: 27, margin: "0 0 8px" }}>
            {dict.mapSection.heading}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "var(--ink2)",
              margin: 0,
              maxWidth: 520,
            }}
          >
            {dict.mapSection.description}
          </p>
        </div>
        <a
          href="#"
          style={{
            font: "700 11px 'Fira Sans'",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--red)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {dict.mapSection.fullMap}
        </a>
      </div>
      <div style={{ background: "#140807", padding: 14, border: "1px solid var(--rule)" }}>
        <div style={{ height: 400, overflow: "hidden" }}>
          <iframe
            src="/nasvitlo/map-dark.html"
            title={dict.mapSection.heading}
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        </div>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 13 }}>
          <span style={legendItem}>
            <i
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#C23B32",
                display: "block",
              }}
            />
            {dict.mapSection.legendEvent}
          </span>
          <span style={legendItem}>
            <i
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#F0DDA8",
                display: "block",
                boxShadow: "0 0 8px rgba(240,221,168,.7)",
              }}
            />
            {dict.mapSection.legendCourt}
          </span>
        </div>
      </div>
    </div>
  );
}

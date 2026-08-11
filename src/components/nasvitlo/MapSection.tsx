import type { Dictionary } from "@/i18n/dictionaries";

const legendItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  font: "500 12px var(--brand-font-body)",
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
            font: "700 11px var(--brand-font-body)",
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
      <div className="nsv-map">
        <div className="nsv-map-frame">
          <iframe
            src="/nasvitlo/map-dark.html"
            title={dict.mapSection.heading}
          />
        </div>
        <div className="nsv-map-legend">
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

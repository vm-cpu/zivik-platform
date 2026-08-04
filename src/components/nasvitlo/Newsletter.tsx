import type { Dictionary } from "@/i18n/dictionaries";

/** Newsletter + support call-to-action band. */
export default function Newsletter({ dict }: { dict: Dictionary }) {
  return (
    <div
      className="nsv-newsletter"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "30px 28px",
        background: "var(--paper2)",
        borderTop: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 28,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Charis SIL',serif",
            fontSize: 22,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          {dict.newsletter.heading}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink2)" }}>
          {dict.newsletter.text}
        </div>
      </div>
      <div className="nsv-news-cta" style={{ display: "flex", gap: 10, flex: "none" }}>
        <a className="btn btn-f" href="#">
          {dict.newsletter.subscribe}
        </a>
        <a className="btn btn-o" href="#">
          {dict.newsletter.support}
        </a>
      </div>
    </div>
  );
}

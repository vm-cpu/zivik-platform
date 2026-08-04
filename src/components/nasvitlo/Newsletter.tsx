import type { Dictionary } from "@/i18n/dictionaries";

/** Quiet newsletter + support sign-off (editorial, not a CTA card). */
export default function Newsletter({ dict }: { dict: Dictionary }) {
  return (
    <div
      className="nsv-newsletter"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "26px 28px",
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
            fontSize: 19,
            color: "var(--ink)",
            marginBottom: 5,
          }}
        >
          {dict.newsletter.heading}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink2)" }}>
          {dict.newsletter.text}
        </div>
      </div>
      <div className="nsv-news-links">
        <a href="#">{dict.newsletter.subscribe} →</a>
        <a href="#">{dict.newsletter.support} →</a>
      </div>
    </div>
  );
}

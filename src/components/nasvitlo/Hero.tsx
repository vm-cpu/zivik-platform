import type { Dictionary } from "@/i18n/dictionaries";

const ctaBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  font: "700 11px var(--brand-font-body)",
  letterSpacing: ".07em",
  textTransform: "uppercase",
  padding: "12px 20px",
  textDecoration: "none",
};

/**
 * Hero with the industrial lamp lighting the wordmark. The lamp fixtures and
 * `.dchain` pull-cord are static markup; <LampShell/> wires the toggle + fade.
 */
export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div
      id="content"
      className="pj"
      style={{
        position: "relative",
        padding: "0 0 60px",
        minHeight: 600,
        overflow: "hidden",
        background: "none",
      }}
    >
      <span className="dcord" />
      <span className="dcollar" />
      <span className="bcone" />
      <span className="bpool" />
      <span className="bshade">
        <i className="gloss" />
      </span>
      <span className="bmouth">
        <i />
      </span>
      <button
        type="button"
        className="dchain"
        aria-pressed={true}
        aria-label={dict.hero.lampLabel}
      >
        <i />
      </button>
      <span className="chint">{dict.hero.chainHint}</span>

      <div
        className="nsv-hero"
        style={{
          position: "relative",
          zIndex: 3,
          padding: "196px 90px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            font: "700 10px var(--brand-font-body)",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--brand-muted-dark)",
            marginBottom: 18,
          }}
        >
          {dict.hero.eyebrow}
        </div>
        <h1
          className="wm"
          style={{ fontSize: 88, letterSpacing: "-.012em", margin: "0 0 24px" }}
        >
          <span className="dim">{dict.brand.wordmark}</span>
          <span className="lit" aria-hidden="true">
            {dict.brand.wordmark}
          </span>
        </h1>
        <p
          style={{
            fontFamily: "var(--brand-font-display),serif",
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--brand-cream)",
            margin: "0 0 12px",
            maxWidth: 520,
          }}
        >
          {dict.hero.lead}
        </p>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--brand-muted-dark)",
            margin: "0 0 32px",
            maxWidth: 430,
          }}
        >
          {dict.hero.sub}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#registry"
            style={{ ...ctaBase, background: "var(--brand-cherry)", color: "#fff" }}
          >
            {dict.hero.ctaRegistry}
          </a>
          <a
            href="#map"
            style={{
              ...ctaBase,
              border: "2px solid rgba(240,221,168,.5)",
              color: "var(--brand-gold-pale)",
            }}
          >
            {dict.hero.ctaMap}
          </a>
        </div>
      </div>
    </div>
  );
}

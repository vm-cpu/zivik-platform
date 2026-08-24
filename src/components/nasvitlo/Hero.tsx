import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Hero with the industrial lamp lighting the wordmark. The lamp fixtures and
 * `.dchain` pull-cord are static markup; <LampShell/> wires the toggle + fade.
 *
 * Order follows the content brief: wordmark, lead, the collection's scope,
 * then the two ways in — and nothing after them. The credit moved out
 * entirely: the footer already names the centre and the faculty, so carrying
 * it here too was three more lines on a first screen that was already dense.
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
          padding: "168px 90px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
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
            margin: "0 0 16px",
            maxWidth: 560,
            textWrap: "balance",
          }}
        >
          {dict.hero.lead}
        </p>
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.65,
            color: "var(--brand-muted-dark)",
            margin: "0 0 34px",
            maxWidth: 620,
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
          <a href="#registry" className="btn btn-lit">
            {dict.hero.ctaRegistry}
          </a>
          <a href="#map" className="btn btn-ghost">
            {dict.hero.ctaMap}
          </a>
        </div>

      </div>
    </div>
  );
}

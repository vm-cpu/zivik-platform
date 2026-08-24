import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Hero with the industrial lamp lighting the wordmark. The lamp fixtures and
 * `.dchain` pull-cord are static markup; <LampShell/> wires the toggle + fade.
 *
 * It holds one statement and two ways in, and nothing else. It used to stack
 * five centred blocks — credit line, wordmark, lead, a 240-character paragraph
 * listing five institutions, then the buttons — which ran to 629px and pushed
 * everything else off a 900px screen. Centred body copy that long has no left
 * edge to return to, and the most detailed text was set smallest. The list of
 * forums moved to <Intro/>, where it is a scannable list instead of a
 * sentence, and the credit line moved below the buttons: it is a credit, and
 * it reads better after the name than before it.
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
            margin: "0 0 34px",
            maxWidth: 560,
            textWrap: "balance",
          }}
        >
          {dict.hero.lead}
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

        {/*
          Provenance, as a signature rather than a caption. It was one
          62-character uppercase line floating alone below the buttons —
          nothing to anchor it, and the two institutions in it read as one
          run-on. For a legal archive provenance is credibility, so it gets a
          rule to sit on and the centre is named before the faculty that
          houses it.
        */}
        <div className="nsv-credit">
          <span className="nsv-credit-rule" aria-hidden="true" />
          <p>
            <span className="cr-lead">{dict.hero.credit}</span>
            <span className="cr-centre">{dict.hero.creditCentre}</span>
            <span className="cr-faculty">{dict.hero.creditFaculty}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

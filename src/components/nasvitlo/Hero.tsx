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
      /* The skip link's landing place. Without it the fragment moves the
         scroll position but leaves document.activeElement on <body>, so a
         screen reader's virtual cursor never follows and "skip to content"
         does nothing for the readers it exists for. */
      tabIndex={-1}
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
          style={{ letterSpacing: "-.012em", margin: "0 0 24px" }}
        >
          <span className="dim">{dict.brand.wordmark}</span>
          <span className="lit" aria-hidden="true">
            {dict.brand.wordmark}
          </span>
        </h1>
        <p
          style={{
            // Prose, so it takes the prose face and size like every other
            // paragraph on the site; the wordmark above carries the display face.
            fontFamily: "var(--brand-font-body),sans-serif",
            fontSize: "var(--t-body)",
            lineHeight: 1.5,
            color: "var(--brand-cream)",
            margin: "0 0 16px",
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

        {/* A colophon, not a sentence. Run on one line the two names read as
            two peers separated by a bullet, when the centre is in fact part of
            the faculty — in Ukrainian they are a genitive chain, so they stack
            and the separator goes. Faculty last and faintest: its mark already
            sits in the top bar, so here it is context, not the headline. */}
        <p className="nsv-credit">
          <span className="cr-label">{dict.hero.credit}</span>
          <span className="cr-centre">{dict.hero.creditCentre}</span>
          <span className="cr-faculty">{dict.hero.creditFaculty}</span>
        </p>

      </div>
    </div>
  );
}

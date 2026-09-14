import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type Partner } from "@/content/types";

/**
 * Restrained partner band (real marks only, hairline-separated).
 *
 * A lead-in, not the whole account: partners have their own page at
 * `/{locale}/partners`, which is where the header nav and the footer point,
 * and this band carries a button to it — the same pattern the About band on
 * the home page already uses. The band used to be the only place partners were
 * shown, which is why the header item pointed at a fragment of /about.
 *
 * ── One partner is a different band ────────────────────────────────────────
 *
 * The layout above is built for a row of marks under a heading, with a link to
 * the rest off on the right. With a single partner it came apart: measured at
 * 1900, the heading ended at 628 and «Усі партнери» began at 1395 — 768 pixels
 * of nothing between them — and under that sat one 218-pixel logo in a band
 * sized for a grid. It read as unfinished, which the owner said in as many
 * words. The button was worse than empty: it led to a page holding the same
 * one partner, which is the duplication the review had already flagged.
 *
 * So below two partners the mark takes the button's place in the head row.
 * Nothing new is introduced — the same heading, the same mark, the same
 * space-between — and the gap closes because something true now fills it.
 * Driven by the count, so the grid and the link come back on their own the day
 * a second partner is added.
 */
export default function Partners({
  locale,
  dict,
  partners,
}: {
  locale: Locale;
  dict: Dictionary;
  partners: Partner[];
}) {
  if (partners.length === 0) return null;
  /* Below two, the band is a line rather than a grid — see the note above. */
  const compact = partners.length < 2;

  /** One partner's mark: the logo and the name under it, or the name alone. */
  const mark = (partner: Partner) => {
    const name = pick(partner.name, locale);
    const inner = partner.logo ? (
      <>
        <Image
          src={partner.logo}
          alt=""
          width={260}
          height={74}
          style={{ maxWidth: "100%", height: "clamp(44px, 5vw, 62px)", width: "auto" }}
        />
        <span className="pmark-name">{name}</span>
      </>
    ) : (
      <span className="pmark-name">{name}</span>
    );
    return partner.url ? (
      <a
        key={partner.id}
        className="pmark"
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    ) : (
      <span key={partner.id} className="pmark">
        {inner}
      </span>
    );
  };

  return (
    <div
      id="partners"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "40px 28px 44px",
        background: "var(--paper)",
        borderTop: "1px solid var(--rule)",
        scrollMarginTop: 16,
      }}
    >
      <div
        className="nsv-sechead"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 22,
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.partners.label}</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--brand-font-display),serif",
              fontWeight: 400,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {dict.partners.heading}
          </h2>
        </div>
        {/* The mark stands where the link stands, when the link would only
            lead to itself. */}
        {compact ? (
          <div className="nsv-partnerrow nsv-partnerrow-inline">
            {partners.map(mark)}
          </div>
        ) : (
          <Link className="nsv-cta nsv-cta-quiet" href={`/${locale}/partners`}>
            {dict.partners.all}
            <span className="nsv-cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        )}
      </div>

      {!compact && (
        <div className="nsv-partnerrow">{partners.map(mark)}</div>
      )}
    </div>
  );
}

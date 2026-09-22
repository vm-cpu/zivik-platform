import Image from "next/image";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type Partner } from "@/content/types";

/**
 * Restrained partner band (real marks only, hairline-separated).
 *
 * The whole account, not a lead-in. Partners had a page of their own at
 * `/{locale}/partners` and a tab in the header pointing at it; both are gone,
 * on the owner's instruction that the partner row belongs on the home page
 * and nowhere else. It was the duplication the review flagged and it was
 * threefold — this band, the same marks again on /about, and a page holding
 * the same marks a third time.
 *
 * So there is no link out of here any more, and nothing conditional on how
 * many partners there are: whatever `content/partners.ts` holds is what this
 * band shows, wherever it is rendered, which is the home page.
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

  /** One partner's mark: the logo alone, or the name where there is no logo.

      The name is not set under a logo any more. ifa's mark spells the
      institute out in full inside the image, so the caption repeated the
      partner's name twice in the same block — owner's instruction to drop
      the duplicate. The name survives as the image's alt text, so screen
      readers and a failed image still name the partner. A partner supplied
      without a logo is still shown by name: that is the only thing there
      is to show. */
  const mark = (partner: Partner) => {
    const name = pick(partner.name, locale);
    const inner = partner.logo ? (
      <Image
        src={partner.logo}
        alt={name}
        width={260}
        height={74}
        style={{ maxWidth: "100%", height: "clamp(44px, 5vw, 62px)", width: "auto" }}
      />
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
        {/* No link out. There is nowhere to go: the partner row lives on the
            home page and only there — owner's decision — and the page this
            used to open held the same marks this band already shows. */}
      </div>

      <div className="nsv-partnerrow">{partners.map(mark)}</div>
    </div>
  );
}

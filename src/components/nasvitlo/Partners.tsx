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
              fontSize: 26,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {dict.partners.heading}
          </h2>
        </div>
        <Link className="nsv-cta nsv-cta-quiet" href={`/${locale}/partners`}>
          {dict.partners.all}
          <span className="nsv-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>

      <div className="nsv-partnerrow">
        {partners.map((partner) => {
          const name = pick(partner.name, locale);
          const inner = partner.logo ? (
            /* 34px was sized for a row of several marks. With one real
               partner the row reads as an afterthought at that height, and
               ifa's wordmark carries small type inside it that needs the
               size to stay legible. */
            <Image
              src={partner.logo}
              alt={name}
              width={260}
              height={74}
              style={{
                maxWidth: "100%",
                height: "clamp(44px, 5vw, 62px)",
                width: "auto",
              }}
            />
          ) : (
            name
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
        })}
      </div>
    </div>
  );
}

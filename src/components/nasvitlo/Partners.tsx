import Image from "next/image";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type Partner } from "@/content/types";

/** Restrained partner row (real marks only, hairline-separated). */
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
        {/* No partners page yet; the full row is directly below. */}
      </div>

      <div className="nsv-partnerrow">
        {partners.map((partner) => {
          const name = pick(partner.name, locale);
          const inner = partner.logo ? (
            <Image
              src={partner.logo}
              alt={name}
              width={120}
              height={40}
              style={{ maxWidth: "100%", height: 34, width: "auto" }}
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

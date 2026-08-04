import Image from "next/image";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type Partner } from "@/content/types";

/** Partner logo grid (text placeholders until real logos arrive). */
export default function Partners({
  locale,
  dict,
  partners,
}: {
  locale: Locale;
  dict: Dictionary;
  partners: Partner[];
}) {
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
          marginBottom: 24,
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.partners.label}</span>
          </div>
          <h2
            style={{
              fontFamily: "'Charis SIL',serif",
              fontWeight: 400,
              fontSize: 26,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {dict.partners.heading}
          </h2>
        </div>
        <a
          href="#"
          style={{
            font: "700 11px 'Fira Sans'",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--red)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {dict.partners.all}
        </a>
      </div>
      <div
        className="nsv-partners"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 1,
          background: "var(--rule)",
          border: "1px solid var(--rule)",
        }}
      >
        {partners.map((partner) => (
          <div
            key={partner.id}
            style={{
              background: "var(--surface)",
              height: 88,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 14,
            }}
          >
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={pick(partner.name, locale)}
                width={120}
                height={48}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <span
                style={{
                  font: "700 11px 'Fira Sans'",
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: "var(--faint)",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {pick(partner.name, locale)}
              </span>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--faint)", margin: "14px 0 0" }}>
        {dict.partners.note}
      </p>
    </div>
  );
}

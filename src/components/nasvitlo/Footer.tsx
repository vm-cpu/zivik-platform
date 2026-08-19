import Link from "next/link";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const colHead: React.CSSProperties = {
  font: "700 10px var(--brand-font-body)",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "var(--brand-gold-pale)",
  marginBottom: 3,
};
const footLink: React.CSSProperties = {
  fontSize: 13,
  color: "var(--brand-muted-dark)",
  textDecoration: "none",
};
const socialBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  border: "1px solid rgba(243,232,226,.2)",
  font: "700 10px var(--brand-font-body)",
  color: "var(--brand-muted-dark)",
  textDecoration: "none",
};

/** Dark site footer: brand, link columns, contacts, legal bar. */
export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const f = dict.footer;
  const home = `/${locale}`;

  /** `href: null` = destination not built yet; renders as plain text, not a dead link. */
  const column = (
    head: string,
    links: Array<{ label: string; href: string | null }>,
  ) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={colHead}>{head}</div>
      {links.map(({ label, href }) =>
        href ? (
          <Link key={label} href={href} style={footLink}>
            {label}
          </Link>
        ) : (
          <span key={label} style={{ ...footLink, opacity: 0.55 }}>
            {label}
          </span>
        ),
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        background: "var(--brand-ink-black)",
        borderTop: "3px solid var(--brand-gold-mark)",
        padding: "44px 28px 0",
      }}
    >
      <div
        className="nsv-foot"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 36,
          paddingBottom: 36,
        }}
      >
        <div>
          <div style={{ marginBottom: 13 }}>
            <span
              style={{
                fontFamily: "var(--brand-font-display),serif",
                fontSize: 24,
                color: "var(--brand-cream-warm)",
                textShadow:
                  "0 0 18px rgba(255,238,196,.55),0 0 44px rgba(240,221,168,.28)",
              }}
            >
              {dict.brand.wordmark}
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--brand-faint-dark)",
              margin: "0 0 16px",
              maxWidth: 280,
            }}
          >
            {f.tagline}
          </p>
          <div
            style={{
              font: "600 10px/1.8 var(--brand-font-body)",
              letterSpacing: ".13em",
              textTransform: "uppercase",
              color: "var(--brand-muted-brown)",
            }}
          >
            {f.org}
            <br />
            {f.faculty}
          </div>
        </div>

        {column(f.colArchive, [
          { label: f.linkRegistry, href: `${home}/registry` },
          { label: f.linkMap, href: `${home}/map` },
          { label: f.linkCourts, href: `${home}#registry` },
          { label: f.linkDocs, href: null },
        ])}
        {column(f.colCenter, [
          { label: f.linkAbout, href: `${home}#about` },
          { label: f.linkTeam, href: `${home}#team` },
          { label: f.linkPartners, href: `${home}#partners` },
          { label: f.linkBlog, href: `${home}/blog` },
        ])}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={colHead}>{f.colContacts}</div>
          <a href={`mailto:${f.email}`} style={footLink}>
            {f.email}
          </a>
          <span style={footLink}>{f.address}</span>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <a href="#" style={socialBox}>
              FB
            </a>
            <a href="#" style={socialBox}>
              X
            </a>
            <a href="#" style={socialBox}>
              IN
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          padding: "16px 0 20px",
          borderTop: "1px solid rgba(243,232,226,.1)",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--brand-muted-brown)" }}>{f.rights}</span>
        <span style={{ display: "flex", gap: 18 }}>
          <a href="#" style={{ fontSize: 11, color: "var(--brand-muted-brown)", textDecoration: "none" }}>
            {f.privacy}
          </a>
          <a href="#" style={{ fontSize: 11, color: "var(--brand-muted-brown)", textDecoration: "none" }}>
            {f.terms}
          </a>
        </span>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Locale } from "@/i18n/config";
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

/** One footer entry. Without `href` there is no page yet, so it renders as
 *  plain text: the column still shows what the archive will hold, but nothing
 *  claims to be clickable when it would only land back on the same page. */
type FootEntry = { label: string; href?: string };

/** Not-yet-a-link. Set apart by colour rather than opacity — dimming the link
 *  colour to 55% took it to 3.53:1, under the AA floor. This token is a
 *  designed value and clears it at 4.62:1 on the footer ground. */
const footPending: React.CSSProperties = {
  fontSize: 13,
  color: "var(--brand-faint-dark)",
};

/** Dark site footer: brand, link columns, contacts, legal bar. */
export default function Footer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const f = dict.footer;
  const column = (head: string, entries: FootEntry[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={colHead}>{head}</div>
      {entries.map(({ label, href }) =>
        href ? (
          <Link key={label} href={href} style={footLink}>
            {label}
          </Link>
        ) : (
          <span key={label} style={footPending}>
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
          { label: f.linkRegistry, href: `/${locale}/registry` },
          { label: f.linkMap, href: `/${locale}#map` },
          { label: f.linkCourts },
          { label: f.linkDocs },
        ])}
        {column(f.colCenter, [
          { label: f.linkAbout, href: `/${locale}#about` },
          { label: f.linkTeam, href: `/${locale}/team` },
          { label: f.linkPartners, href: `/${locale}#partners` },
          { label: f.linkBlog },
        ])}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={colHead}>{f.colContacts}</div>
          <a href={`mailto:${f.email}`} style={footLink}>
            {f.email}
          </a>
          <span style={footLink}>{f.address}</span>
          {/* Social boxes return when there are real accounts to point at.
              Three squares linking to "#" read as a broken footer. */}
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
        {/* --brand-muted-brown is 3.01:1 on this ground — under AA at 11px, so
            the whole legal bar reads in --brand-faint-dark (4.62:1) instead. */}
        <span style={{ fontSize: 11, color: "var(--brand-faint-dark)" }}>{f.rights}</span>
        {/* Plain text until the pages exist. The newsletter sign-off collects
            an address, so a real privacy policy is owed here — a dead link to
            one is the worst of both worlds. */}
        <span style={{ display: "flex", gap: 18 }}>
          <span style={{ fontSize: 11, color: "var(--brand-faint-dark)" }}>
            {f.privacy}
          </span>
          <span style={{ fontSize: 11, color: "var(--brand-faint-dark)" }}>
            {f.terms}
          </span>
        </span>
      </div>
    </div>
  );
}

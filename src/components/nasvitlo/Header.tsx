"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Only what the bar reads.
 *
 * This is a client component, so whatever it takes is serialized into the
 * payload of every page. It used to take the whole `Dictionary` — 4,937 bytes
 * of it — to read ten strings worth 250. Narrowing the prop is the difference,
 * on every one of the site's ninety-odd pages.
 */
export type HeaderDict = Pick<Dictionary, "nav" | "brand">;
import "./header.css";

/** Dark top bar: brand, primary nav (collapses to a menu), language switch. */
export default function Header({
  locale,
  dict,
  /** Where "skip to content" lands. Each surface names the first thing a
   *  reader actually came for — the decision page skips to its overview. */
  skipTo = "#content",
}: {
  locale: Locale;
  dict: HeaderDict;
  skipTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const home = `/${locale}`;

  /* Every item is a page. The menu used to mix pages with fragments of the
     home page (#about, #registry, #partners): from anywhere but the home page
     those ids do not exist, so the item scrolled nowhere and then, once Next
     had navigated, left the reader at the top of the home page instead. The
     archive has real routes for all of them now, so the menu points at routes.
     Partners has no page of its own — it is a band on /about, which is a page,
     so the fragment travels with a real destination rather than instead of
     one. */
  const about = `${home}/about`;
  const nav = [
    // `home` used to be labelled "About us" while pointing at `/uk`, so the
    // menu had no entry for the home page itself and the about section had no
    // link of its own. They are two destinations, so they are two items.
    { label: dict.nav.home, href: home, active: pathname === home },
    { label: dict.nav.about, href: about, active: pathname === about },
    {
      label: dict.nav.decisions,
      href: `${home}/registry`,
      active: pathname === `${home}/registry`,
    },
    // The map has its own page now — full screen, zoom and pan — so the menu
    // points at it rather than at the band on the home page.
    { label: dict.nav.map, href: `${home}/map`, active: pathname === `${home}/map` },
    { label: dict.nav.team, href: `${home}/team`, active: pathname === `${home}/team` },
    { label: dict.nav.partners, href: `${about}#partners`, active: false },
  ];

  /* Same page, other language. Switching used to drop the reader on the home
     page even though the translated page exists — and hreflang was already
     promising search engines the pair. */
  const localeHref = (next: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length && locales.includes(segments[0] as Locale)) {
      segments[0] = next;
      return `/${segments.join("/")}`;
    }
    return `/${next}`;
  };

  return (
    <>
      <a className="nsv-skiplink" href={skipTo}>
        {dict.nav.skip}
      </a>
      <header
        className="nsv-topbar"
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          /* The bar's left gutter is deeper than its right: the faculty mark
             is the first thing on the page and was sitting 30px off the edge,
             tighter than any other left edge on the site. 56px at desktop
             width, easing down to 28px on a phone so the mark keeps its air
             without pushing the language switch off the bar. The footer takes
             the same value on its own left edge — one left edge top and
             bottom, which is the point. */
          padding: "15px 30px 15px clamp(28px, 4vw, 56px)",
          // Dark by default, because that is what the bar is on every surface
          // but one. The home page sets it transparent so the lamp gradient
          // shows through. It used to default the other way, and any page that
          // forgot to set a ground got cream text on paper — 1.16:1 in light
          // theme on the registry.
          /* One bar on every page. It used to be transparent over the home
             page's lamp scene and #14100e on the decision pages — three
             different headers on one site, and one of them a hex literal in a
             component stylesheet, which the design contract forbids. */
          background: "var(--brand-night)",
          borderBottom: "1px solid rgba(243,232,226,.1)",
        }}
      >
        {/* The whole brand cluster is one link home — the convention every
            reader expects of a logo. */}
        <Link
          href={`/${locale}`}
          aria-label={dict.brand.wordmark}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          {/* White Faculty-of-Law mark on the dark bar. eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/fp-logo-white-${locale}.svg`}
            alt={dict.brand.facultyAlt}
            /* 40px until now, which put the faculty's own name — the second
               line of the mark — at the edge of legibility on the dark bar.
               The wordmark beside it is the archive's; this one is the
               institution's, and it carries the credibility.
               Fluid, not a flat 56: the mark is nearly two to one, so 56px
               costs 108px of bar width, and at 375px that was enough to wrap
               the UA / EN switch onto two lines. 46px is the widest the mark
               goes before that happens, and it is still larger than what was
               there. */
            style={{
              height: "clamp(46px, 5vw, 56px)",
              width: "auto",
              display: "block",
            }}
          />
          <span
            style={{
              width: 1,
              height: "clamp(36px, 4vw, 44px)",
              background: "rgba(243,232,226,.16)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--brand-font-display),serif",
              fontSize: "var(--t-lead)",
              color: "var(--brand-gold-pale)",
              lineHeight: 1,
            }}
          >
            {dict.brand.wordmark}
          </span>
        </Link>

        <nav
          className="nsv-nav"
          style={{ display: "flex", gap: 20, font: "500 var(--t-sm) var(--brand-font-body)" }}
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              style={{ color: item.active ? "var(--brand-gold-pale)" : "var(--brand-cream)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ font: "600 var(--t-cap) var(--brand-font-body)", color: "var(--brand-faint-dark)" }}>
            <Link
              href={localeHref("uk")}
              hrefLang="uk"
              aria-current={locale === "uk" ? "true" : undefined}
              style={{
                color: locale === "uk" ? "var(--brand-gold-pale)" : "var(--brand-faint-dark)",
                fontWeight: locale === "uk" ? 700 : 600,
              }}
            >
              UA
            </Link>{" "}
            /{" "}
            <Link
              href={localeHref("en")}
              hrefLang="en"
              aria-current={locale === "en" ? "true" : undefined}
              style={{
                color: locale === "en" ? "var(--brand-gold-pale)" : "var(--brand-faint-dark)",
                fontWeight: locale === "en" ? 700 : 600,
              }}
            >
              EN
            </Link>
          </span>
          <button
            type="button"
            className="nsv-burger"
            aria-label={dict.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div className="nsv-mobnav" data-open={open ? "yes" : "no"}>
        {nav.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}

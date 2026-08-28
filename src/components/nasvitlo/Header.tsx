"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
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
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const home = `/${locale}`;

  /* The drawer is a popup, so Escape has to shut it — and hand the keyboard
     back to the control that opened it, rather than leaving focus inside a
     panel that is now display:none (which drops it on <body>). */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Every item is a page, and now every item is a *whole* page. The menu used
     to mix pages with fragments of the home page (#about, #registry,
     #partners): from anywhere but the home page those ids do not exist, so the
     item scrolled nowhere and then, once Next had navigated, left the reader
     at the top of the home page instead. Partners was the last of them — it
     pointed at `/about#partners`, a band inside another page — and has its own
     route now, so nothing in this menu is a fragment. */
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
    /* Next to the library, because that is what it is drawn from: the fifty
       headwords are gathered out of the decisions, and a reader who wants a
       term rather than a case should not have to find a case first. */
    {
      label: dict.nav.glossary,
      href: `${home}/glossary`,
      active: pathname === `${home}/glossary`,
    },
    // The map has its own page now — full screen, zoom and pan — so the menu
    // points at it rather than at the band on the home page.
    { label: dict.nav.map, href: `${home}/map`, active: pathname === `${home}/map` },
    { label: dict.nav.team, href: `${home}/team`, active: pathname === `${home}/team` },
    {
      label: dict.nav.partners,
      href: `${home}/partners`,
      active: pathname === `${home}/partners`,
    },
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

  /* Two two-letter links measured 15×15 — under the 24×24 floor of WCAG 2.5.8,
     with no larger control anywhere that does the same job. `.nsv-langsw a` in
     header.css gives each one a 24px box without moving the glyphs. The `lang`
     attribute matters as much: "EN" inside a lang="uk" document is spoken with
     Ukrainian phonetics, and `aria-label` names the language in the language
     being offered rather than leaving a bare code.

     Rendered twice — once in the bar, once in the drawer — because below 420px
     the bar cannot hold it: «НаСвітло» ends four pixels from «UA» at 375, and
     at 320 the two were drawn on top of each other. Exactly one of the two is
     displayed at any width; header.css carries the measurements. */
  const langSwitch = (extra?: string) => (
    <span
      className={extra ? `nsv-langsw ${extra}` : "nsv-langsw"}
      style={{ font: "600 var(--t-cap) var(--brand-font-body)", color: "var(--brand-faint-dark)" }}
    >
      <Link
        href={localeHref("uk")}
        hrefLang="uk"
        lang="uk"
        aria-label={localeNames.uk}
        aria-current={locale === "uk" ? "true" : undefined}
        style={{
          color: locale === "uk" ? "var(--brand-gold-pale)" : "var(--brand-faint-dark)",
          fontWeight: locale === "uk" ? 700 : 600,
        }}
      >
        UA
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={localeHref("en")}
        hrefLang="en"
        lang="en"
        aria-label={localeNames.en}
        aria-current={locale === "en" ? "true" : undefined}
        style={{
          color: locale === "en" ? "var(--brand-gold-pale)" : "var(--brand-faint-dark)",
          fontWeight: locale === "en" ? 700 : 600,
        }}
      >
        EN
      </Link>
    </span>
  );

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
          padding: "15px 30px 15px var(--page-gutter)",
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
          /* --brand-cream at 10%, mixed rather than written out: rgba(243,232,226,…)
             is that token's own value spelled as a literal, which is what the
             design contract forbids — it holds still while the token moves. The
             drawer in header.css takes the same hairline. */
          borderBottom:
            "1px solid color-mix(in srgb, var(--brand-cream) 10%, transparent)",
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
          {/* White Faculty-of-Law mark on the dark bar.
              A plain <img>, and `npm run check` will keep warning about it.
              next/image cannot serve this file: ask the optimizer for it and
              it answers 400, "image type is not allowed", because SVG is off
              unless `dangerouslyAllowSVG` is set — which turns the optimizer
              into a same-origin endpoint that will echo arbitrary SVG back as
              an image, and next.config.ts spends fifty lines closing exactly
              that kind of hole. There is nothing to optimize either: the file
              is 13,975 B over the wire, one request, and the mark is a mask,
              not a photograph.
              The intrinsic size is on the tag so the bar does not reflow when
              it arrives. CSS sets the height and leaves the width auto, which
              before these attributes meant a 0px-wide box until the SVG
              landed and then a 107.56px one — measured with the request held
              open — which slid the wordmark 107.6px and the nav 53.1px across
              the bar on every page of the site.
              eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/fp-logo-white-${locale}.svg`}
            alt={dict.brand.facultyAlt}
            width={1917}
            height={998}
            /* 40px, then clamp(46px, 5vw, 56px), and the owner asked for it
               bigger again: the faculty's own name is the second line of the
               mark and it was still the smallest legible thing on the bar.
               The wordmark beside it is the archive's; this one is the
               institution's, and it carries the credibility.

               The ceiling moves and the floor barely does, because they are
               constrained by different things. On a wide screen nothing is
               competing for the bar, so the cap goes 56 → 72px. Below 880px
               the nav is a burger and the bar holds the mark, the wordmark,
               the burger and the UA / EN switch; the mark is nearly two to
               one, so every pixel of height costs two of width, and at 375px
               56px was already enough to wrap the switch onto a second line.
               48px is the floor, one step over what was there.

               Blur is not a size problem and was fixed separately: this is an
               SVG now (public/logos/fp-logo-white-*.svg), not the 131 kB
               fp-logo.webp it used to be, so it is crisp at any height. */
            style={{
              height: "clamp(48px, 6.2vw, 72px)",
              width: "auto",
              display: "block",
            }}
          />
          <span
            style={{
              width: 1,
              /* The divider tracks the mark it divides — about four-fifths of
                 its height, the proportion it had at 46/36. */
              height: "clamp(38px, 5vw, 58px)",
              /* --brand-cream at 16% — the divider between the faculty mark and
                 the wordmark. Mixed from the token, not spelled as a literal. */
              background:
                "color-mix(in srgb, var(--brand-cream) 16%, transparent)",
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
          {langSwitch()}
          <button
            type="button"
            className="nsv-burger"
            ref={burgerRef}
            aria-label={dict.nav.menu}
            aria-expanded={open}
            aria-controls="nsv-mobnav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      {/* A <nav>, not a <div>. `.nsv-nav` above is display:none under 880px and
          this drawer replaces it, so on a phone the site carried no navigation
          landmark at all — the one landmark a screen-reader user jumps to
          first. Only ever one of the two is rendered, so they cannot be
          confused with each other; the label is the one the burger already
          announces. */}
      <nav
        id="nsv-mobnav"
        className="nsv-mobnav"
        aria-label={dict.nav.menu}
        data-open={open ? "yes" : "no"}
      >
        {nav.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        {/* The same switch, for the widths where the bar cannot hold it. Below
            420px it is the only one displayed — header.css shows one and hides
            the other, so a screen reader is never offered two. */}
        {langSwitch("nsv-langsw-drawer")}
      </nav>
    </>
  );
}

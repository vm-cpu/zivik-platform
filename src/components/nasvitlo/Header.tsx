"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import ThemeToggle from "./ThemeToggle";
import "./header.css";

/** Dark top bar: brand, primary nav (collapses to a menu), language switch. */
export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const home = `/${locale}`;

  /* Anchors are absolute, not bare "#registry". As fragments they only worked
     on the home page — on a decision page or the registry those ids do not
     exist, so four of the six items did nothing. Team and Blog are gone until
     the pages exist; a nav item that cannot go anywhere is worse than one
     that is not there. */
  const nav = [
    { label: dict.nav.home, href: home, active: pathname === home },
    { label: dict.nav.decisions, href: `${home}#registry`, active: false },
    { label: dict.nav.map, href: `${home}#map`, active: false },
    { label: dict.nav.partners, href: `${home}#partners`, active: false },
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
      <div
        className="nsv-topbar"
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "15px 30px",
          // Transparent over the homepage lamp gradient; pages without the lamp
          // (e.g. a decision page) set --nsv-header-bg to supply their own dark.
          background: "var(--nsv-header-bg, transparent)",
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
            style={{ height: 40, width: "auto", display: "block" }}
          />
          <span
            style={{
              width: 1,
              height: 36,
              background: "rgba(243,232,226,.16)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--brand-font-display),serif",
              fontSize: 19,
              color: "var(--brand-gold-pale)",
              lineHeight: 1,
            }}
          >
            {dict.brand.wordmark}
          </span>
        </Link>

        <nav
          className="nsv-nav"
          style={{ display: "flex", gap: 20, font: "500 13px var(--brand-font-body)" }}
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ color: item.active ? "var(--brand-gold-pale)" : "var(--brand-cream)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ font: "600 12px var(--brand-font-body)", color: "var(--brand-faint-dark)" }}>
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
          <ThemeToggle
            label={
              locale === "uk"
                ? "Перемкнути світлу або темну тему"
                : "Switch between light and dark theme"
            }
          />
          <button
            type="button"
            className="nsv-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>

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

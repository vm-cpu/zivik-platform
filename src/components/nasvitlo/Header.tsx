"use client";

import { useState } from "react";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
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

  const nav = [
    { label: dict.nav.home, href: `/${locale}`, active: true },
    { label: dict.nav.decisions, href: "#registry" },
    { label: dict.nav.map, href: "#map" },
    { label: dict.nav.team, href: "#" },
    { label: dict.nav.partners, href: "#partners" },
    { label: dict.nav.blog, href: "#" },
  ];

  return (
    <>
      <div
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
        </div>

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
              href="/uk"
              style={{
                color: locale === "uk" ? "var(--brand-gold-pale)" : "var(--brand-faint-dark)",
                fontWeight: locale === "uk" ? 700 : 600,
              }}
            >
              UA
            </Link>{" "}
            /{" "}
            <Link
              href="/en"
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

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Dark top bar: brand, primary nav (collapses to a menu), language switch. */
export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "uk" ? "en" : "uk";

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
          borderBottom: "1px solid rgba(243,232,226,.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              background: "#F5F0E6",
              padding: "5px 8px",
              borderRadius: 3,
              display: "inline-flex",
            }}
          >
            <Image
              src="/logos/fp-logo.webp"
              alt={dict.brand.facultyAlt}
              width={66}
              height={26}
              style={{ height: 26, width: "auto" }}
              priority
            />
          </span>
          <span
            style={{
              width: 1,
              height: 28,
              background: "rgba(243,232,226,.16)",
            }}
          />
          <span
            style={{
              fontFamily: "'Charis SIL',serif",
              fontSize: 19,
              color: "#F0DDA8",
              lineHeight: 1,
            }}
          >
            {dict.brand.wordmark}
          </span>
        </div>

        <nav
          className="nsv-nav"
          style={{ display: "flex", gap: 20, font: "500 13px 'Fira Sans'" }}
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ color: item.active ? "#F0DDA8" : "#F3E8E2" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ font: "600 12px 'Fira Sans'", color: "#8E736C" }}>
            <Link
              href={`/${locale}`}
              style={{
                color: locale === "uk" ? "#F0DDA8" : "#8E736C",
                fontWeight: locale === "uk" ? 700 : 600,
              }}
            >
              UA
            </Link>{" "}
            /{" "}
            <Link
              href={`/${other === "en" ? "en" : "uk"}`}
              style={{
                color: locale === "en" ? "#F0DDA8" : "#8E736C",
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

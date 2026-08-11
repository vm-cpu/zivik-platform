"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

const L = {
  share: { uk: "Поділитися", en: "Share" },
  copyLink: { uk: "Скопіювати посилання", en: "Copy link" },
  copyCite: { uk: "Скопіювати цитату", en: "Copy citation" },
  copied: { uk: "Скопійовано ✓", en: "Copied ✓" },
} as const;

/** Copy the page link or a formatted citation to the clipboard. */
export default function ShareBar({
  locale,
  title,
  citation,
}: {
  locale: Locale;
  title: string;
  citation: string;
}) {
  const [done, setDone] = useState<null | "link" | "cite">(null);

  async function copy(kind: "link" | "cite") {
    const text =
      kind === "link"
        ? typeof window !== "undefined"
          ? window.location.href
          : ""
        : citation;
    try {
      await navigator.clipboard.writeText(text);
      setDone(kind);
      setTimeout(() => setDone(null), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="aid sharebar">
      <div className="lbl">{L.share[locale]}</div>
      <p className="share-title">{title}</p>
      <div className="share-btns">
        <button type="button" onClick={() => copy("link")}>
          {done === "link" ? L.copied[locale] : L.copyLink[locale]}
        </button>
        <button type="button" onClick={() => copy("cite")}>
          {done === "cite" ? L.copied[locale] : L.copyCite[locale]}
        </button>
      </div>
    </div>
  );
}

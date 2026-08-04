"use client";

import { useEffect, useRef } from "react";
import { NASVITLO_CSS } from "./nasvitloStyles";
import { NASVITLO_MARKUP } from "./nasvitloMarkup";

/**
 * Насвітло — homepage.
 *
 * Ported from the Claude Design project "Насвітло - головна.dc.html". The page
 * markup and stylesheet are injected verbatim (see nasvitloMarkup.ts /
 * nasvitloStyles.ts); this component only re-implements the two pieces of
 * interactivity the design runtime provided:
 *   1. the lamp pull-chain (.dchain) toggling the hero light on/off, and
 *   2. the scroll-driven `--lit` fade on the wordmark.
 */
export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lmp = root.querySelector<HTMLElement>(".lmp");
    const chain = root.querySelector<HTMLElement>(".dchain");
    if (!lmp) return;

    let frame = 0;

    const fade = () => {
      const r = lmp.getBoundingClientRect();
      const past = Math.max(0, -r.top);
      const k = Math.max(0, Math.min(1, 1 - past / (r.height * 0.42)));
      lmp.style.setProperty("--lit", k.toFixed(3));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        fade();
      });
    };

    const toggle = () => {
      const on = lmp.getAttribute("data-on") !== "no";
      const next = on ? "no" : "yes";
      lmp.setAttribute("data-on", next);
      chain?.setAttribute("aria-pressed", next === "yes" ? "true" : "false");
    };

    chain?.addEventListener("click", toggle);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    fade();

    return () => {
      chain?.removeEventListener("click", toggle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* Fonts the design depends on. React hoists these <link>s into <head>. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: NASVITLO_CSS }} />
      <div
        ref={rootRef}
        className="nsv-root"
        dangerouslySetInnerHTML={{ __html: NASVITLO_MARKUP }}
      />
    </>
  );
}

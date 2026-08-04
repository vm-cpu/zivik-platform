"use client";

import { useEffect, useRef } from "react";

/**
 * The page-wide "lamp" wrapper. Holds the two interactive behaviours ported
 * from the original design runtime:
 *   1. the pull-chain (`.dchain`, rendered inside <Hero/>) toggles the light,
 *   2. scrolling fades the `--lit` custom property, dimming the wordmark.
 *
 * Everything else on the page renders as static children, so only this small
 * island is a Client Component.
 */
export default function LampShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lmp = ref.current;
    if (!lmp) return;
    const chain = lmp.querySelector<HTMLElement>(".dchain");
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
      const next = lmp.getAttribute("data-on") === "no" ? "yes" : "no";
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
    <div className="lmp" data-on="yes" ref={ref}>
      {children}
    </div>
  );
}

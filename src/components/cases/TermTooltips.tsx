"use client";

import { useEffect } from "react";

/**
 * Escape closes a term's definition.
 *
 * The marks and their notes are pure CSS — hover and focus are states the
 * stylesheet already knows, the definitions are in the HTML, and none of it
 * needs this component to work. One thing does.
 *
 * WCAG 1.4.13 asks three things of content that appears on hover or focus: a
 * reader must be able to move the pointer onto it (the note answers `:hover`
 * as well as the mark does), it must stay until dismissed or the trigger is
 * left (it does), and it must be dismissable **without moving the pointer or
 * the focus**. CSS has no way to hear a key, so that last one needs a few
 * lines of script — and only that one.
 *
 * Escape raises a flag on the page root that the stylesheet reads; the next
 * deliberate act — a pointer moving, any other key — lowers it again, so a
 * reader who dismissed one note is not left with the feature switched off.
 */
export default function TermTooltips() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".casepage");
    if (!root) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        root.dataset.glQuiet = "1";
        return;
      }
      /* Tab, arrows, anything else: the reader is moving again. */
      delete root.dataset.glQuiet;
    };
    const wake = () => {
      delete root.dataset.glQuiet;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", wake, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", wake);
    };
  }, []);

  return null;
}

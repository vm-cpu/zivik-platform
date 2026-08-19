"use client";

import { useEffect, useState } from "react";
import { type Locale } from "@/i18n/config";
import { daysSince } from "@/lib/days";

/**
 * A figure that must not go stale on a statically built page: it renders the
 * server-computed `initial` (so hydration matches) and recounts in the browser.
 */
export default function LiveDays({
  sinceIso,
  initial,
  locale,
}: {
  sinceIso: string;
  initial: number;
  locale: Locale;
}) {
  const [days, setDays] = useState(initial);

  useEffect(() => {
    const tick = () => setDays(daysSince(sinceIso));
    tick();
    // Cheap safety net for a tab left open across midnight.
    const id = window.setInterval(tick, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [sinceIso]);

  return (
    <>{days.toLocaleString(locale === "uk" ? "uk-UA" : "en-US").replace(/ /g, " ")}</>
  );
}

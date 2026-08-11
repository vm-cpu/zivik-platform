"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Read what the no-flash script already decided, so we never disagree with it. */
function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Light/dark switch for the whole site — the lamp metaphor as a real setting.
 *
 * The theme is applied before paint by the inline script in the root layout;
 * this control only flips it and remembers the choice. Until it mounts we
 * render a placeholder of the same size, so the header doesn't shift and the
 * server and client markup agree.
 */
export default function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    // Follow the OS while the visitor hasn't expressed a preference.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("nsv-theme")) setTheme(currentTheme());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("nsv-theme", next);
    } catch {
      /* private mode — the choice just won't persist */
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="nsv-theme"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={theme === null ? undefined : isDark}
      suppressHydrationWarning
    >
      {/* A lamp that is lit or out — the site's own metaphor, not a generic
          sun/moon. Rendered from one path set so the swap is instant. */}
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path className="shade" d="M12 3.5 4.8 12h14.4L12 3.5Z" />
        <path className="stem" d="M12 1.6v1.9" />
        {theme !== null && isDark ? (
          <circle className="bulb" cx="12" cy="14.4" r="1.9" />
        ) : (
          <>
            <circle className="bulb lit" cx="12" cy="14.4" r="1.9" />
            <path className="ray" d="M12 18.4v3.1M7.6 16.6l-2 2.2M16.4 16.6l2 2.2" />
          </>
        )}
      </svg>
    </button>
  );
}

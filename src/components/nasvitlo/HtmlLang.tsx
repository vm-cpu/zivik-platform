"use client";

import { useEffect } from "react";

/**
 * Syncs `<html lang>` with the active locale. The root layout renders a static
 * default `lang`; this keeps it correct on the localized routes without making
 * the whole app dynamic. Renders nothing.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}

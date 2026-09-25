/**
 * `next/link` under Astro: a plain anchor.
 *
 * Next's Link adds client-side navigation and prefetch. Here every page is a
 * full document served from the edge, so a link is a link. Next-only props are
 * dropped rather than passed through as unknown DOM attributes.
 */
import type { AnchorHTMLAttributes, Ref } from "react";

type UrlObject = { pathname?: string; hash?: string; query?: Record<string, string> };

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | UrlObject;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  ref?: Ref<HTMLAnchorElement>;
};

function toHref(href: LinkProps["href"]): string {
  if (typeof href === "string") return href;
  const q = href.query ? `?${new URLSearchParams(href.query)}` : "";
  return `${href.pathname ?? ""}${q}${href.hash ? `#${href.hash}` : ""}`;
}

/** Props Next's Link understands and an <a> does not. */
const NEXT_ONLY = new Set(["prefetch", "replace", "scroll", "shallow", "locale"]);

export default function Link({ href, ...props }: LinkProps) {
  const rest = Object.fromEntries(Object.entries(props).filter(([k]) => !NEXT_ONLY.has(k)));
  return <a href={toHref(href)} {...rest} />;
}

/**
 * Route adapter: runs a Next App Router page module under Astro.
 *
 * A page in src/app is an async function of `{ params }` that returns a React
 * tree, plus an optional `generateMetadata`/`metadata`. This calls both
 * exactly as Next would, layers the page's metadata over the locale layout's
 * (`homeMetadata`), and turns `notFound()` into the locale 404 with its own
 * metadata and a 404 status. The Astro route files stay three lines long, and
 * every page keeps a single implementation shared by both builds.
 */
import type { AstroGlobal } from "astro";
import type { Metadata } from "next";
import { createElement, type ReactNode } from "react";
import { renderIslands } from "../islands/runtime";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { homeMetadata } from "@/lib/seo";
import * as localeNotFound from "@/app/[locale]/not-found";
import { isNotFound, RedirectError } from "../shims/navigation";
import { mergeMetadata } from "./metadata";
import Chrome from "./Chrome";

type Params = Record<string, string | undefined>;

export interface NextPageModule {
  default: (props: { params: Promise<Params>; searchParams?: Promise<Params> }) => ReactNode | Promise<ReactNode>;
  generateMetadata?: (props: { params: Promise<Params> }) => Metadata | Promise<Metadata>;
  metadata?: Metadata;
}

export interface Resolved {
  locale: Locale;
  metadata: Metadata;
  /** The page with its header and footer, rendered. */
  html: string;
}

/**
 * Render to a string before Astro starts the response.
 *
 * `notFound()` is not only called by page functions: CasePending calls it
 * while rendering. Under Next that unwinds to the not-found boundary; here it
 * has to be caught before any byte is sent, or the reader gets a 200 with an
 * empty body. So the whole tree is rendered to completion first, and a 404
 * raised anywhere inside it is still a 404.
 */
function renderPage(locale: Locale, dict: Dictionary, pathname: string, node: ReactNode): Promise<string> {
  return renderIslands(createElement(Chrome, { locale, dict, pathname, node }), pathname);
}

export async function notFoundPage(astro: AstroGlobal, locale: Locale = defaultLocale): Promise<Resolved> {
  astro.response.status = 404;
  const dict = await getDictionary(locale);
  const NotFound = localeNotFound.default as () => ReactNode;
  return {
    locale,
    metadata: mergeMetadata(homeMetadata(locale, dict), localeNotFound.metadata),
    html: await renderPage(locale, dict, astro.url.pathname, createElement(NotFound)),
  };
}

export async function runRoute(
  astro: AstroGlobal,
  page: NextPageModule,
  params: Params = {},
): Promise<Resolved | Response> {
  const raw = params.locale ?? astro.params.locale ?? "";
  if (!isLocale(raw)) return notFoundPage(astro);
  const locale = raw;
  const all = { ...astro.params, ...params, locale };
  const p = () => Promise.resolve(all);

  try {
    const dict = await getDictionary(locale);
    const pageMeta = page.generateMetadata ? await page.generateMetadata({ params: p() }) : page.metadata;
    const node = await page.default({
      params: p(),
      searchParams: Promise.resolve(Object.fromEntries(astro.url.searchParams)),
    });
    const html = await renderPage(locale, dict, astro.url.pathname, node);
    return { locale, metadata: mergeMetadata(homeMetadata(locale, dict), pageMeta), html };
  } catch (err) {
    if (isNotFound(err)) return notFoundPage(astro, locale);
    if (err instanceof RedirectError) return astro.redirect(err.location, err.status as 307 | 308);
    throw err;
  }
}

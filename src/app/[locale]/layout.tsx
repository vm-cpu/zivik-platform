import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isLocale,
  locales,
  localeHtmlLang,
  defaultLocale,
} from "@/i18n/config";
import { IBM_Plex_Mono, Charis_SIL, Fira_Sans } from "next/font/google";
import { getDictionary } from "@/i18n/dictionaries";
import { homeMetadata } from "@/lib/seo";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
// Only cross-surface primitives load for every page. home.css is the home
// page's own stylesheet and is imported there — loading it here put 399
// unscoped rules on the registry and decision pages too.
import "../globals.css";
import "./shared.css";

/**
 * Brand faces, self-hosted by next/font so they are preloaded and shipped with
 * metric-matched fallbacks — no flash of a different face on load (the old
 * <link> to fonts.googleapis.com swapped visibly mid-render).
 *
 * Three, not five. Newsreader and Fraunces came with the starter and were
 * still being downloaded by every visitor although nothing read them: they
 * reached globals.css as --font-serif and --font-display, and no rule and no
 * class ever used either.
 */
const charis = Charis_SIL({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  /* latin-ext dropped: measured across every route in both locales,
     the rendered text contains zero characters in U+0100–024F, and the
     subset was preloaded on all 24 pages regardless. cyrillic-ext stays —
     it carries ґ (U+0491), which appears 23 times. Dropping a subset from
     `subsets` only drops the preload; the @font-face survives, so anything
     in that range would still render, just fetched on demand. */
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-charis",
  display: "swap",
});

const firaSans = Fira_Sans({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  /* latin-ext dropped: measured across every route in both locales,
     the rendered text contains zero characters in U+0100–024F, and the
     subset was preloaded on all 24 pages regardless. cyrillic-ext stays —
     it carries ґ (U+0491), which appears 23 times. Dropping a subset from
     `subsets` only drops the preload; the @font-face survives, so anything
     in that range would still render, just fetched on demand. */
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-fira",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});


type Params = { params: Promise<{ locale: string }> };

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return homeMetadata(locale, dict);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  /**
   * An unknown segment is a 404, but this layout must not be the one to throw
   * it. `/nope` matches `[locale]`, and a notFound() raised in the root layout
   * has no layout left to render in — Next falls back to a bare error document
   * with no `lang`, no fonts and no palette. Every page under this segment
   * already validates the locale, so the throw happens one level down, inside
   * a document this layout has already opened.
   */
  const known = isLocale(locale);
  const safe = known ? locale : defaultLocale;
  const dict = await getDictionary(safe);

  return (
    <html
      /**
       * The root layout, under the [locale] segment — the shape Next documents
       * for internationalisation. It used to sit one level up with `lang`
       * hardcoded to "uk" and a client effect patching it after hydration, so
       * every English page was served declaring Ukrainian to crawlers, to
       * screen readers on first paint, to social unfurlers and to reader
       * modes, none of which run the effect.
       */
      lang={localeHtmlLang[safe]}
      className={`${charis.variable} ${firaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* One header and one footer for the whole locale. Every page used to
            render its own pair, which is how the site ended up with three
            different header grounds and a decision-page skip link that pointed
            somewhere different from every other page. */}
        <div className="nsv-root">
          <Header locale={safe} dict={dict} />
          {children}
          <Footer dict={dict} locale={safe} />
        </div>
      </body>
    </html>
  );
}

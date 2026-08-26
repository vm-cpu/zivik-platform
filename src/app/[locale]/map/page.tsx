import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  siteUrl,
  pathAlternates,
  ogImage,
  defaultOgImage,
} from "@/lib/seo";
import { localeOpenGraph, alternateOpenGraphLocales } from "@/i18n/config";
import { pick } from "@/content/types";
import {
  MAP_EVENTS,
  MAP_COURTS,
  courtMarks,
  markerSize,
  MAP_COURT_NO_SITES,
  seatsLine,
} from "@/content/map";
import { caseLinksFor, courtCaseloadFor } from "@/content/map-links";
import geo from "@/content/europe-map.json";
import EventsMap from "@/components/nasvitlo/EventsMap";
import "./map-page.css";

/**
 * The map on its own page.
 *
 * On the home page the map is one band among a dozen and gets the height a
 * band can spare. Here it has the viewport: the same component, the same data,
 * no second implementation to keep in step.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict.mapSection.pageTitle;
  const description = dict.mapSection.pageLede;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}/map`,
      languages: pathAlternates((l) => `/${l}/map`),
    },
    openGraph: {
      type: "website",
      // Open Graph wants language_TERRITORY; a bare "uk" is ignored.
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: `/${locale}/map`,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [ogImage(defaultOgImage, dict.meta.ogAlt)],
    },
    // A page that sets openGraph and no twitter inherits the layout's card —
    // so this page used to share as the home page, title, text and image.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="page mappage">

      <main id="content" tabIndex={-1}>
        {/* The masthead rides over the drawing rather than pushing it down the
            page: this is the map's own page, so the map gets the viewport. */}
        <div className="mp-stage">
          <header className="mp-mast">
            <Link href={`/${locale}`} className="mp-back">
              ← {dict.mapSection.backHome}
            </Link>
            <h1>{dict.mapSection.pageTitle}</h1>
            <p className="mp-lede">{dict.mapSection.pageLede}</p>
          </header>

          <EventsMap
            geo={geo}
            events={MAP_EVENTS.map((e) => ({
              key: e.key,
              category: e.category,
              size: markerSize(e.weight),
              when: pick(e.when, locale),
              title: pick(e.title, locale),
              note: pick(e.note, locale),
              courts: e.courts,
              forums: pick(e.forums, locale),
              count: pick(e.count, locale),
              open: e.open,
              cases: caseLinksFor(e.key, locale),
            }))}
            courts={MAP_COURTS.map((c) => ({
              key: c.key,
              city: pick(c.city, locale),
              offMap: c.offMap,
              labelDy: c.labelDy,
              caseload: courtCaseloadFor(c.key, locale),
            seats: seatsLine(c, locale),
            ...courtMarks(c, locale),
            }))}
            labels={{
              alt: dict.mapSection.heading,
              close: dict.mapSection.close,
              courtsSeat: dict.mapSection.courtsSeat,
              court: dict.mapSection.legendCourt,
              legendLit: dict.mapSection.legendLit,
              legendUnlit: dict.mapSection.legendUnlit,
              reads: dict.mapSection.reads,
              pending: dict.mapSection.pending,
              sizeKey: dict.mapSection.sizeKey,
              legendWhat: dict.mapSection.legendWhat,
              legendHow: dict.mapSection.legendHow,
              legendLine: dict.mapSection.legendLine,
            courtHears: dict.mapSection.courtHears,
            inLibrary: dict.mapSection.inLibrary,
            courtNoSites: {
              one: pick(MAP_COURT_NO_SITES.one, locale),
              many: pick(MAP_COURT_NO_SITES.many, locale),
            },
            caseload: dict.mapSection.caseload,
            caseloadWord: dict.mapSection.caseloadWord,
            zoomLabel: dict.mapSection.zoomLabel,
            zoomWide: dict.mapSection.zoomWide,
            zoomClose: dict.mapSection.zoomClose,
            zoomAtlantic: dict.mapSection.zoomAtlantic,
            zoomIn: dict.mapSection.zoomIn,
            zoomOut: dict.mapSection.zoomOut,
            wheelHint: dict.mapSection.wheelHint,
            }}
            locale={locale}
          />
        </div>
      </main>
    </div>
  );
}

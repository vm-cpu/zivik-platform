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


/**
 * The registry's stage key as the word the registry uses for it.
 *
 * Resolved here rather than in `map-links.ts`: the labels live in the
 * dictionary and this is the surface that already has one. A key the
 * dictionary does not carry is dropped rather than printed raw.
 */
const stageWord = (k: string | undefined) =>
  k && k in dict.registry.stage
    ? (dict.registry.stage as Record<string, string>)[k]
    : undefined;

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
            {/* The same heading the home band carries, at the user's request:
                one map, one title. The label rule above it comes with it — this
                page had its own wording for the same object. */}
            <div className="lbl">
              <span>{dict.mapSection.label}</span>
            </div>
            <h1>{dict.mapSection.heading}</h1>
            <p className="mp-lede">{dict.mapSection.pageLede}</p>
          </header>

          <EventsMap
            geo={geo}
            events={MAP_EVENTS.map((e) => ({
              key: e.key,
                size: markerSize(e.weight),
            total: e.weight,
              iso: e.iso,
            when: pick(e.when, locale),
              title: pick(e.title, locale),
              note: pick(e.note, locale),
              area: e.area,
              courts: e.courts,
              forums: pick(e.forums, locale),
              count: pick(e.count, locale),
              open: e.open,
              cases: caseLinksFor(e.key, locale).map((c) => ({
              ...c,
              stage: stageWord(c.stage),
            })),
            }))}
            courts={MAP_COURTS.map((c) => ({
              key: c.key,
              city: pick(c.city, locale),
              offMap: c.offMap,
              labelDy: c.labelDy,
              caseload: (() => {
              const cl = courtCaseloadFor(c.key, locale);
              return {
                ...cl,
                written: cl.written.map((w) => ({ ...w, stage: stageWord(w.stage) })),
                listed: cl.listed.map((l) => ({ ...l, stage: stageWord(l.stage) })),
              };
            })(),
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
            writtenOf: dict.mapSection.writtenOf,
            allInRegistry: dict.mapSection.allInRegistry,
              pending: dict.mapSection.pending,
            amountLabel: dict.mapSection.amountLabel,
              sizeKey: dict.mapSection.sizeKey,
              legendWhat: dict.mapSection.legendWhat,
              legendHow: dict.mapSection.legendHow,
              legendLine: dict.mapSection.legendLine,
            legendOffMap: dict.mapSection.legendOffMap,
            legendRegions: dict.mapSection.legendRegions,
            legendArea: dict.mapSection.legendArea,
            legendPick: dict.mapSection.legendPick,
            courtHears: dict.mapSection.courtHears,
            inLibrary: dict.mapSection.inLibrary,
            courtNoSites: {
              one: pick(MAP_COURT_NO_SITES.one, locale),
              many: pick(MAP_COURT_NO_SITES.many, locale),
            },
            caseload: dict.mapSection.caseload,
            caseloadWord: dict.mapSection.caseloadWord,
            railLabel: dict.mapSection.railLabel,
            zoomLabel: dict.mapSection.zoomLabel,
            zoomWide: dict.mapSection.zoomWide,
            zoomClose: dict.mapSection.zoomClose,
            zoomAtlantic: dict.mapSection.zoomAtlantic,
            zoomIn: dict.mapSection.zoomIn,
            zoomOut: dict.mapSection.zoomOut,
            wheelHint: dict.mapSection.wheelHint,
            overview: dict.mapSection.overview,
            openFull: dict.mapSection.openFull,
            closeFull: dict.mapSection.closeFull,
            }}
            locale={locale}
          />
        </div>
      </main>
    </div>
  );
}

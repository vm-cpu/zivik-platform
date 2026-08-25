import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteUrl, pathAlternates } from "@/lib/seo";
import { pick } from "@/content/types";
import { MAP_EVENTS, MAP_COURTS } from "@/content/map";
import { caseLinksFor } from "@/content/map-links";
import geo from "@/content/europe-map.json";
import EventsMap from "@/components/nasvitlo/EventsMap";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
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
      locale,
      url: `/${locale}/map`,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [{ url: "/og/nasvitlo.png", alt: dict.meta.ogAlt }],
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
      <Header locale={locale} dict={dict} />

      <main id="content">
        <header className="mp-mast">
          <Link href={`/${locale}`} className="mp-back">
            ← {dict.mapSection.backHome}
          </Link>
          <h1>{dict.mapSection.pageTitle}</h1>
          <p className="mp-lede">{dict.mapSection.pageLede}</p>
        </header>

        <div className="mp-stage">
          <EventsMap
            geo={geo}
            events={MAP_EVENTS.map((e) => ({
              key: e.key,
              category: e.category,
              size: e.size,
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
              seats: c.seats
                .map((s) => `${s.abbr} — ${pick(s.name, locale)}`)
                .join(" · "),
            }))}
            labels={{
              alt: dict.mapSection.heading,
              close: dict.mapSection.close,
              courtsSeat: dict.mapSection.courtsSeat,
              court: dict.mapSection.legendCourt,
              reads: dict.mapSection.reads,
              pending: dict.mapSection.pending,
              sizeKey: dict.mapSection.sizeKey,
              legendWhat: dict.mapSection.legendWhat,
              legendHow: dict.mapSection.legendHow,
              legendLine: dict.mapSection.legendLine,
            courtHears: dict.mapSection.courtHears,
              categories: {
                hr: dict.mapSection.legendHr,
                war: dict.mapSection.legendWar,
                asset: dict.mapSection.legendAsset,
              },
            }}
            locale={locale}
          />
        </div>
      </main>

      <Footer dict={dict} locale={locale} />
    </div>
  );
}

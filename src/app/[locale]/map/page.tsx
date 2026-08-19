import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  isLocale,
  locales,
  defaultLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import { siteUrl } from "@/lib/seo";
import { buildMapModel } from "@/lib/map-model";
import MapExplorer from "@/components/nasvitlo/map/MapExplorer";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import "./map.css";

/** Page chrome (the map's own labels come from the embedded map). */
const T = {
  title: {
    uk: "Мапа порушень",
    en: "Map of violations",
  },
  lede: {
    uk: "Заявлені порушення — обстріли, депортації, захоплення — та суди, які здійснюють їх правову оцінку. Оберіть подію на мапі, щоб побачити, у якому провадженні вона розглядається.",
    en: "Alleged violations — shelling, deportations, seizures — and the courts assessing them. Select an event on the map to see the proceedings in which it is argued.",
  },
  back: { uk: "← На головну", en: "← Back home" },
  toRegistry: {
    uk: "Бібліотека рішень →",
    en: "Library of decisions →",
  },
} as const;

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
  const path = `/${locale}/map`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/map`;
  languages["x-default"] = `/${defaultLocale}/map`;
  return {
    metadataBase: new URL(siteUrl),
    title: pick(T.title, locale),
    description: pick(T.lede, locale),
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      locale,
      url: path,
      title: pick(T.title, locale),
      description: pick(T.lede, locale),
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const [dict, model] = await Promise.all([
    getDictionary(locale),
    buildMapModel(raw),
  ]);

  return (
    <div className="page mappage">
      <Header locale={locale} dict={dict} />

      <main className="map-wrap">
        <header className="map-mast">
          <Link href={`/${locale}`} className="map-back">
            {pick(T.back, locale)}
          </Link>
          <h1>{pick(T.title, locale)}</h1>
          <p className="map-lede">{pick(T.lede, locale)}</p>
        </header>

        <MapExplorer
          model={model}
          t={dict.mapSection}
          variant="full"
          registryHref={`/${locale}/registry`}
        />

        <div className="map-foot">
          <p className="map-hint">{dict.mapSection.hint}</p>
          <Link href={`/${locale}/registry`} className="map-next">
            {pick(T.toRegistry, locale)}
          </Link>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}

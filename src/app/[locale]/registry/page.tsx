import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  alternateOpenGraphLocales,
  isLocale,
  locales,
  localeOpenGraph,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContentRepository } from "@/content/repository";
import { pick, type CaseStatusKey } from "@/content/types";
import {
  defaultOgImage,
  ogImage,
  pathAlternates,
  siteUrl,
} from "@/lib/seo";
import RegistryTable, {
  type RegRow,
} from "@/components/nasvitlo/RegistryTable";
import "./registry.css";

/** Localized page chrome (the case data itself is localized from content). */
const T = {
  title: { uk: "Реєстр рішень", en: "Case registry" },
  lede: {
    uk: "Усі провадження проти РФ у міжнародних судах, трибуналах та арбітражах — з можливістю фільтрувати за судом і статусом. Опрацьовані справи ведуть до конспекту рішення.",
    en: "Every proceeding against Russia across international courts, tribunals and arbitrations — filter by court and status. Analysed cases link through to a decision summary.",
  },
  // The wordmark is lowercase everywhere, and the English one is "nasvitlo".
  // Team and map both say "Home"/"На головну" — so does this now.
  back: { uk: "← На головну", en: "← Home" },
  search: {
    uk: "Пошук за назвою, судом, контекстом…",
    en: "Search by name, court, context…",
  },
  allCourts: { uk: "Усі суди", en: "All courts" },
  allStatuses: { uk: "Усі статуси", en: "All statuses" },
  sortNew: { uk: "Спершу нові", en: "Newest first" },
  sortOld: { uk: "Спершу давні", en: "Oldest first" },
  sortCourt: { uk: "За судом", en: "By court" },
  results: { uk: "справ", en: "cases" },
  reset: { uk: "Скинути", en: "Reset" },
  emptyHead: { uk: "Нічого не знайдено", en: "Nothing found" },
  emptyBody: {
    uk: "Спробуйте змінити фільтри або пошуковий запит.",
    en: "Try adjusting the filters or the search query.",
  },
  mProceedings: { uk: "проваджень", en: "proceedings" },
  mCourts: { uk: "інстанцій", en: "courts" },
  mAnalysed: { uk: "опрацьовано", en: "analysed" },
} as const;

/** Preferred ordering of status filters (only present ones are shown). */
const STATUS_ORDER: CaseStatusKey[] = [
  "decided",
  "progress",
  "warrant",
  "settled",
  "enforcement",
  "frozen",
  "rejected",
];

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
  const path = `/${locale}/registry`;
  const title = pick(T.title, locale);
  const description = pick(T.lede, locale);
  /*
   * `openGraph` and `twitter` are replaced wholesale, not merged, by the
   * nearest generateMetadata that sets them. This block used to set og:title,
   * og:description, og:url and og:type only — which dropped the layout's
   * og:image and og:site_name — and set no twitter key at all, so the Twitter
   * card fell all the way back to the layout's home-page card: the home
   * title, the home description and the home image on a link to the registry.
   * Same shape as /map and /team, plus the twitter block they are also
   * missing.
   */
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: pathAlternates((l) => `/${l}/registry`),
    },
    openGraph: {
      type: "website",
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: path,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [ogImage(defaultOgImage, dict.meta.ogAlt)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export default async function RegistryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const dict = await getDictionary(locale);
  const repo = getContentRepository();
  const [institutions, cases] = await Promise.all([
    repo.getInstitutions(),
    repo.getCases(),
  ]);

  const instById = new Map(institutions.map((i) => [i.id, i]));

  const rows: RegRow[] = cases.map((c) => {
    const inst = instById.get(c.institutionId);
    return {
      id: c.id,
      courtId: c.institutionId,
      court: inst ? pick(inst.abbr, locale) : c.institutionId,
      name: c.name,
      note: pick(c.note, locale),
      statusKey: c.statusKey,
      status: dict.registry.status[c.statusKey],
      year: c.year,
      lit: c.lit,
      href: c.summarySlug ? `/${locale}/cases/${c.summarySlug}` : null,
    };
  });

  // Court filter options: institutions that actually have cases, in order.
  const withCases = new Set(cases.map((c) => c.institutionId));
  const courts = institutions
    .filter((i) => withCases.has(i.id))
    .map((i) => ({ id: i.id, abbr: pick(i.abbr, locale) }));

  // Status filter options: statuses present in the data, in preferred order.
  const presentStatuses = new Set(cases.map((c) => c.statusKey));
  const statuses = STATUS_ORDER.filter((k) => presentStatuses.has(k)).map(
    (key) => ({ key, label: dict.registry.status[key] }),
  );

  const analysed = cases.filter((c) => c.lit).length;

  return (
    <div className="page registrypage">

      <main id="content" className="reg-wrap">
        <header className="reg-mast">
          <Link href={`/${locale}`} className="reg-back">
            {pick(T.back, locale)}
          </Link>
          <h1>{pick(T.title, locale)}</h1>
          <p className="reg-lede">{pick(T.lede, locale)}</p>
          <div className="reg-meta">
            <div className="m gilt">
              <span className="mv">{cases.length}</span>
              <span className="ml">{pick(T.mProceedings, locale)}</span>
            </div>
            <div className="m">
              <span className="mv">{courts.length}</span>
              <span className="ml">{pick(T.mCourts, locale)}</span>
            </div>
            <div className="m">
              <span className="mv">{analysed}</span>
              <span className="ml">{pick(T.mAnalysed, locale)}</span>
            </div>
          </div>
        </header>

        {/* RegistryTable reads ?court= so the home page can link in
            pre-filtered; useSearchParams needs a boundary for the page to stay
            prerendered. The fallback is never seen in practice — the shell
            around it is static and hydration is immediate. */}
        <Suspense fallback={null}>
        <RegistryTable
          rows={rows}
          courts={courts}
          statuses={statuses}
          t={{
            search: pick(T.search, locale),
            allCourts: pick(T.allCourts, locale),
            allStatuses: pick(T.allStatuses, locale),
            sortNew: pick(T.sortNew, locale),
            sortOld: pick(T.sortOld, locale),
            sortCourt: pick(T.sortCourt, locale),
            results: pick(T.results, locale),
            reset: pick(T.reset, locale),
            emptyHead: pick(T.emptyHead, locale),
            emptyBody: pick(T.emptyBody, locale),
          }}
        />
        </Suspense>
      </main>
    </div>
  );
}

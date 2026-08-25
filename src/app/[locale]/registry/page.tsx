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
import {
  pick,
  type CaseDate,
  type CaseOutcomeKey,
  type CaseStageKey,
  type Localized,
} from "@/content/types";
import { SUMMARIES } from "@/content/summaries";
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
    uk: "Усі провадження проти РФ у міжнародних судах, трибуналах та арбітражах. Кожен рядок має рік відкриття провадження, а де рішення вже ухвалене — його точну дату. Теги розділено на дві осі: етап розгляду і те, що суд ухвалив.",
    en: "Every proceeding against Russia across international courts, tribunals and arbitrations. Each row carries the year the proceeding was opened and, where a decision has been handed down, its exact date. Tags run on two axes: the stage of the proceedings, and what the court issued.",
  },
  // The wordmark is lowercase everywhere, and the English one is "nasvitlo".
  // Team and map both say "Home"/"На головну" — so does this now.
  back: { uk: "← На головну", en: "← Home" },
  search: {
    uk: "Сторона, суд, номер справи, рік, тема…",
    en: "Party, court, docket number, year, subject…",
  },
  searchLabel: { uk: "Пошук у реєстрі", en: "Search the registry" },
  courts: { uk: "Суди", en: "Courts" },
  courtsAll: { uk: "Усі суди", en: "All courts" },
  stages: { uk: "Етап", en: "Stage" },
  stagesAll: { uk: "Усі етапи", en: "All stages" },
  outcomes: { uk: "Ухвалено", en: "Outcome" },
  outcomesAll: { uk: "Будь-яке", en: "Any outcome" },
  sort: { uk: "Порядок", en: "Sort" },
  sortOpt: {
    yearDesc: { uk: "Спершу нові", en: "Newest first" },
    yearAsc: { uk: "Спершу давні", en: "Oldest first" },
    decidedDesc: { uk: "За датою рішення", en: "By decision date" },
    readable: { uk: "Спершу опрацьовані", en: "Ready to read first" },
    court: { uk: "За судом", en: "By court" },
    stage: { uk: "За етапом", en: "By stage" },
    outcome: { uk: "За тим, що ухвалено", en: "By outcome" },
    name: { uk: "За назвою", en: "By name" },
  },
  colCourt: { uk: "Суд", en: "Court" },
  colCase: { uk: "Справа", en: "Case" },
  colTags: { uk: "Теги", en: "Tags" },
  colDate: { uk: "Рік", en: "Year" },
  sortAsc: { uk: "за зростанням", en: "sorted ascending" },
  sortDesc: { uk: "за спаданням", en: "sorted descending" },
  sortNone: { uk: "не сортовано", en: "not sorted" },
  /* Ukrainian counts in three forms, and the teens all take the "many" one,
     which is why 11 and 21 disagree: 1 справа, 2 справи, 5 справ, 11 справ,
     21 справа, 22 справи. */
  results: {
    uk: { one: "справа", few: "справи", many: "справ" },
    en: { one: "case", few: "cases", many: "cases" },
  },
  ofTotal: { uk: "з {total}", en: "of {total}" },
  combine: {
    uk: "Кілька значень в одному фільтрі — будь-яке з них; різні фільтри діють разом.",
    en: "Several values in one filter mean any of them; different filters apply together.",
  },
  reset: { uk: "Скинути", en: "Reset" },
  emptyHead: { uk: "Нічого не знайдено", en: "Nothing found" },
  emptyBody: {
    uk: "Спробуйте змінити фільтри або пошуковий запит.",
    en: "Try adjusting the filters or the search query.",
  },
  matched: { uk: "збіг:", en: "matched:" },
  group: {
    court: { uk: "суд", en: "court" },
    status: { uk: "статус", en: "status" },
    type: { uk: "галузь", en: "field" },
    date: { uk: "дата", en: "date" },
    visible: { uk: "назва", en: "name" },
  },
  decidedOn: { uk: "рішення", en: "decided" },
  noDate: { uk: "—", en: "—" },
  mProceedings: { uk: "проваджень", en: "proceedings" },
  mCourts: { uk: "інстанцій", en: "courts" },
  mAnalysed: { uk: "опрацьовано", en: "analysed" },
} as const;

/** Preferred ordering of the stage filter — the life-cycle, not an alphabet. */
const STAGE_ORDER: CaseStageKey[] = [
  "upcoming",
  "preliminary",
  "investigation",
  "merits",
  "satisfaction",
  "appeal",
  "remitted",
  "enforcement",
  "suspended",
  "frozen",
  "concluded",
];

/** Preferred ordering of the outcome filter — heaviest act first. */
const OUTCOME_ORDER: CaseOutcomeKey[] = [
  "judgment",
  "award",
  "verdict",
  "liability",
  "upheld",
  "warrant",
  "order",
  "settlement",
  "rejected",
];

/**
 * The exact date of a case's operative decision, or null.
 *
 * `cases.ts` records a bare year — the year the proceeding was commenced, which
 * is why it disagrees with the judgment year on every summarised case (ICJ GL
 * 166 was filed in 2017 and decided in 2024). The only precise dates the
 * archive holds are `judgment.date` on the eight published summaries, so those
 * are read straight from the summary rather than transcribed a second time.
 * Nothing here widens a year into a day.
 */
function decisionDate(
  slug: string | undefined,
  explicit: CaseDate | undefined,
): Extract<CaseDate, { precision: "day" }> | null {
  if (explicit?.precision === "day") return explicit;
  const iso = slug ? SUMMARIES[slug]?.judgment.date : undefined;
  if (!iso) return null;
  const year = Number(iso.slice(0, 4));
  return Number.isFinite(year) ? { precision: "day", iso, year } : null;
}

/** «31.01.2024» / «31 Jan 2024» — the day is a fact, so it is shown as one. */
function formatDay(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-");
  return locale === "uk"
    ? `${d}.${m}.${y}`
    : new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
}

/** Both locales of a localized value, for the search haystack. */
function both(v: Localized | null | undefined): string {
  return v ? `${v.uk} ${v.en}` : "";
}

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

  /* Both dictionaries: the row's own labels come from the active locale, but
     the search haystack carries the other language's wording too. */
  const repo = getContentRepository();
  const [dictUk, dictEn, institutions, cases] = await Promise.all([
    getDictionary("uk"),
    getDictionary("en"),
    repo.getInstitutions(),
    repo.getCases(),
  ]);
  const dict = locale === "uk" ? dictUk : dictEn;

  const instById = new Map(institutions.map((i) => [i.id, i]));

  const rows: RegRow[] = cases.map((c) => {
    const inst = instById.get(c.institutionId);
    const decided = decisionDate(c.summarySlug, c.decidedOn);
    const stageLabels = c.stage
      ? { uk: dictUk.registry.stage[c.stage], en: dictEn.registry.stage[c.stage] }
      : null;
    const outcomeLabels = c.outcome
      ? {
          uk: dictUk.registry.outcome[c.outcome],
          en: dictEn.registry.outcome[c.outcome],
        }
      : null;
    return {
      id: c.id,
      courtId: c.institutionId,
      court: inst ? pick(inst.abbr, locale) : c.institutionId,
      courtOrder: inst ? inst.order : Number.MAX_SAFE_INTEGER,
      name: c.name,
      note: pick(c.note, locale),
      stage: c.stage ?? null,
      stageLabel: stageLabels ? pick(stageLabels, locale) : null,
      outcome: c.outcome ?? null,
      outcomeLabel: outcomeLabels ? pick(outcomeLabels, locale) : null,
      status: pick(c.status, locale),
      year: c.year,
      decided,
      decidedLabel: decided ? formatDay(decided.iso, locale) : null,
      lit: c.lit,
      href: c.summarySlug ? `/${locale}/cases/${c.summarySlug}` : null,
      /* Both locales go into every group. Most case names are recorded only in
         English while the interface is Ukrainian, so a reader typing «ЄСПЛ» or
         «Гаага» has to reach an English-titled row through the institution's
         Ukrainian abbreviation and seat — not through the title. */
      find: {
        visible: `${c.name} ${both(c.note)}`,
        court: `${both(inst?.abbr)} ${both(inst?.name)} ${both(inst?.seat)} ${c.institutionId}`,
        status: `${both(c.status)} ${both(stageLabels)} ${both(outcomeLabels)}`,
        type: both(c.type),
        date: `${c.year ?? ""} ${decided ? `${decided.iso} ${decided.year}` : ""}`,
      },
    };
  });

  // Court filter options: institutions that actually have cases, in order.
  const withCases = new Set(cases.map((c) => c.institutionId));
  const courts = institutions
    .filter((i) => withCases.has(i.id))
    .map((i) => ({ id: i.id, abbr: pick(i.abbr, locale) }));

  // Tag filter options: only the values the 39 rows actually carry.
  const presentStages = new Set(cases.map((c) => c.stage));
  const stages = STAGE_ORDER.filter((k) => presentStages.has(k)).map((key) => ({
    key,
    label: dict.registry.stage[key],
  }));
  const presentOutcomes = new Set(cases.map((c) => c.outcome));
  const outcomes = OUTCOME_ORDER.filter((k) => presentOutcomes.has(k)).map(
    (key) => ({ key, label: dict.registry.outcome[key] }),
  );

  const analysed = cases.filter((c) => c.lit).length;

  return (
    <div className="page registrypage">

      <main id="content" tabIndex={-1} className="reg-wrap">
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
          stages={stages}
          outcomes={outcomes}
          t={{
            search: pick(T.search, locale),
            searchLabel: pick(T.searchLabel, locale),
            tableLabel: pick(T.title, locale),
            courts: pick(T.courts, locale),
            courtsAll: pick(T.courtsAll, locale),
            stages: pick(T.stages, locale),
            stagesAll: pick(T.stagesAll, locale),
            outcomes: pick(T.outcomes, locale),
            outcomesAll: pick(T.outcomesAll, locale),
            sort: pick(T.sort, locale),
            sortOpt: Object.fromEntries(
              Object.entries(T.sortOpt).map(([k, v]) => [k, pick(v, locale)]),
            ),
            colCourt: pick(T.colCourt, locale),
            colCase: pick(T.colCase, locale),
            colTags: pick(T.colTags, locale),
            colDate: pick(T.colDate, locale),
            sortAsc: pick(T.sortAsc, locale),
            sortDesc: pick(T.sortDesc, locale),
            sortNone: pick(T.sortNone, locale),
            results: T.results[locale],
            ofTotal: pick(T.ofTotal, locale),
            combine: pick(T.combine, locale),
            reset: pick(T.reset, locale),
            emptyHead: pick(T.emptyHead, locale),
            emptyBody: pick(T.emptyBody, locale),
            matched: pick(T.matched, locale),
            group: {
              visible: pick(T.group.visible, locale),
              court: pick(T.group.court, locale),
              status: pick(T.group.status, locale),
              type: pick(T.group.type, locale),
              date: pick(T.group.date, locale),
            },
            decidedOn: pick(T.decidedOn, locale),
            noDate: pick(T.noDate, locale),
            stageName: dict.registry.stageName,
            outcomeName: dict.registry.outcomeName,
          }}
        />
        </Suspense>
      </main>
    </div>
  );
}

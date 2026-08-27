import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  alternateOpenGraphLocales,
  isLocale,
  locales,
  localeOpenGraph,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import {
  glossaryFor,
  initialOf,
  initialsFor,
} from "@/content/glossary";
import { SUMMARIES } from "@/content/summaries";
import {
  defaultOgImage,
  ogImage,
  pathAlternates,
  siteUrl,
} from "@/lib/seo";
import GlossaryList, {
  type GlossaryRow,
} from "@/components/nasvitlo/GlossaryList";
import "./glossary.css";

/**
 * The library's glossary as a page of its own.
 *
 * Fifty headwords were scattered across eight decision pages, each reachable
 * only by opening the decision that happened to define it — so a reader who
 * wanted to know what «hors de combat» means had to already know which case
 * to look in. Gathered here they become a dictionary, and the four terms that
 * two decisions define differently become the most useful entries on it.
 *
 * The band on a decision page is now this page filtered: «Словник» there links
 * to `/glossary?case=<slug>`, which is the same list narrowed to that
 * decision's terms.
 */
const T = {
  title: { uk: "Словник", en: "Glossary" },
  lede: {
    uk: "Терміни, які трапляються в рішеннях бібліотеки, — з поясненням і посиланням на справу, де термін ужито. Там, де два суди читають слово по-різному, тут стоять обидва прочитання.",
    en: "The terms that appear in the library's decisions, each explained and traced back to the case that uses it. Where two courts read a word differently, both readings stand here.",
  },
  metaDesc: {
    uk: "Словник термінів міжнародного права з рішень проти Росії: пояснення простою мовою і посилання на справу, де термін ужито.",
    en: "A glossary of the international-law terms used in the decisions against Russia, in plain language, each traced to the case that uses it.",
  },
  back: { uk: "← На головну", en: "← Home" },
  search: { uk: "Термін або слово з пояснення…", en: "A term, or a word from a definition…" },
  searchLabel: { uk: "Пошук у словнику", en: "Search the glossary" },
  clearSearch: { uk: "Очистити пошук", en: "Clear search" },
  all: { uk: "Усі", en: "All" },
  jumpLabel: { uk: "Абетковий покажчик", en: "Alphabetical index" },
  /* Ukrainian counts in three forms: 1 термін, 2–4 терміни, 5+ термінів. */
  count: {
    uk: { one: "термін", few: "терміни", many: "термінів" },
    en: { one: "term", few: "terms", many: "terms" },
  },
  ofTotal: { uk: "з {total}", en: "of {total}" },
  reset: { uk: "Скинути", en: "Reset" },
  filteredBy: { uk: "У справі:", en: "In the case:" },
  emptyHead: { uk: "Нічого не знайдено", en: "Nothing found" },
  emptyBody: {
    uk: "Спробуйте інше слово або оберіть іншу літеру.",
    en: "Try another word, or another letter.",
  },
  inCase: { uk: "у справі", en: "in" },
  mTerms: { uk: "термінів", en: "terms" },
  mCases: { uk: "рішень", en: "decisions" },
  /* «З двома прочитаннями» was my phrasing and it did not land — the owner
     had to ask what the tile counted. It counts headwords that more than one
     decision defines, and in all four cases the two courts read the word
     differently. Say the concrete thing. */
  mShared: { uk: "пояснені двома судами", en: "defined by two courts" },
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
  const dict = await getDictionary(locale);
  const path = `/${locale}/glossary`;
  const title = pick(T.title, locale);
  const description = pick(T.metaDesc, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: pathAlternates((l) => `/${l}/glossary`),
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

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const entries = glossaryFor(locale);
  const initials = initialsFor(locale);

  const rows: GlossaryRow[] = entries.map((e) => ({
    id: e.id,
    term: pick(e.term, locale),
    initial: initialOf(pick(e.term, locale)),
    senses: e.senses.map((s) => ({
      slug: s.slug,
      caseTitle: pick(s.caseTitle, locale),
      forum: pick(s.forum, locale),
      def: pick(s.def, locale),
      href: `/${locale}/cases/${s.slug}`,
    })),
    /* Both locales in the haystack, the way the library's table does it: a
       reader who knows a term only in English should still find it on the
       Ukrainian page. */
    find: [
      e.term.uk,
      e.term.en,
      ...e.senses.flatMap((s) => [s.def.uk, s.def.en]),
    ].join(" "),
  }));

  /* Only the decisions that actually contribute a term, in the order the
     summaries are listed. */
  const contributing = new Set(entries.flatMap((e) => e.senses.map((s) => s.slug)));
  const cases = Object.entries(SUMMARIES)
    .filter(([slug]) => contributing.has(slug))
    .map(([slug, s]) => ({
      slug,
      title: s.title ? pick(s.title, locale) : s.masthead.parties,
    }));

  const shared = entries.filter((e) => e.senses.length > 1).length;

  return (
    <div className="page glossarypage">
      <main id="content" tabIndex={-1} className="gl-wrap">
        <header className="gl-mast">
          <Link href={`/${locale}`} className="gl-back">
            {pick(T.back, locale)}
          </Link>
          <h1>{pick(T.title, locale)}</h1>
          <p className="gl-lede">{pick(T.lede, locale)}</p>
          <div className="gl-meta">
            <div className="m gilt">
              <span className="mv">{entries.length}</span>
              <span className="ml">{pick(T.mTerms, locale)}</span>
            </div>
            <div className="m">
              <span className="mv">{cases.length}</span>
              <span className="ml">{pick(T.mCases, locale)}</span>
            </div>
            <div className="m">
              <span className="mv">{shared}</span>
              <span className="ml">{pick(T.mShared, locale)}</span>
            </div>
          </div>
        </header>

        <GlossaryList
          rows={rows}
          initials={initials}
          cases={cases}
          locale={locale}
          t={{
            search: pick(T.search, locale),
            searchLabel: pick(T.searchLabel, locale),
            clearSearch: pick(T.clearSearch, locale),
            all: pick(T.all, locale),
            count: T.count[locale],
            ofTotal: pick(T.ofTotal, locale),
            reset: pick(T.reset, locale),
            emptyHead: pick(T.emptyHead, locale),
            emptyBody: pick(T.emptyBody, locale),
            inCase: pick(T.inCase, locale),
            filteredBy: pick(T.filteredBy, locale),
            jumpLabel: pick(T.jumpLabel, locale),
          }}
        />
      </main>
    </div>
  );
}

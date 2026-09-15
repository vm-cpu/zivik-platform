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
import { getContentRepository } from "@/content/repository";
import {
  OUTCOME_ORDER,
  pick,
  STAGE_ORDER,
  type CaseDate,
  type Localized,
} from "@/content/types";
import { moneyCompact } from "@/content/money";
import { actsOf } from "@/content/cases";
import { plural } from "@/i18n/plural";
import { registryTotal } from "@/content/legal";
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
import { CONTENT_INDEX_PATH, SECTIONS } from "@/content/search-index";
import "./registry.css";

/** Localized page chrome (the case data itself is localized from content). */
const T = {
  title: { uk: "Бібліотека рішень", en: "Library of decisions" },
  /* The standfirst on the page. It runs to 222 characters in Ukrainian and 279
     in English because it does a job on the page — it tells the reader that a
     row's date is the year the proceeding opened, not the year of the
     judgment, and that the tags run on two axes. Both facts stop the table
     from being misread, so neither is cut.
     It used to double as the meta description, which put 279 characters into a
     field that is truncated at about 160. They are two strings now, the way
     /about already splits them. */
  /* Not «Усі провадження». The review's question is the right one — «чи
     правильно буде писати про КОЖНЕ провадження. А якщо ми щось пропустимо?
     Похибка можлива» — and it is the same correction the home band's heading
     already took, where «Кожне провадження проти Росії» became «Провадження
     проти Росії». One proceeding nobody has reached yet makes a claim of
     completeness false, and this page is the one a reader would cite it from.
     What the sentence can say without risk is what the library holds and what
     each row carries. */
  lede: {
    uk: "Провадження проти РФ у міжнародних судах, трибуналах та арбітражах. Кожен рядок має рік відкриття провадження, а де рішення вже ухвалене — його точну дату. Дві окремі колонки кажуть, на якому етапі провадження — стан розгляду — і що саме суд ухвалив — тип рішення.",
    en: "Proceedings against Russia across international courts, tribunals and arbitrations. Each row carries the year the proceeding was opened and, where a decision has been handed down, its exact date. Two separate columns carry the stage of the proceedings and the type of decision the court issued.",
  },
  /* The meta description: about 133 / 147 characters, both inside the ~160 a
     search result shows. Says what the page holds and what can be done with
     it. The figure is `{n}` rather than a literal — it was typed as 39 and
     went stale the moment the six ICC warrants stopped being rows, which is
     the whole argument for `registryTotal` in content/legal.ts. */
  metaDesc: {
    uk: "{n} проваджень проти Росії в міжнародних судах, трибуналах і арбітражах — з фільтрами за судом, станом розгляду і типом рішення.",
    en: "{n} proceedings against Russia before international courts, tribunals and arbitrations, filterable by court, by stage of proceedings and by type of decision.",
  },
  // The wordmark is «НаСвітло» / "NaSvitlo" everywhere — see i18n/dictionaries/uk.ts.
  // Team and map both say "Home"/"На головну" — so does this now.
  back: { uk: "← На головну", en: "← Home" },
  search: {
    uk: "Сторона, суд, номер справи, рік, тема…",
    en: "Party, court, docket number, year, subject…",
  },
  searchLabel: { uk: "Пошук у бібліотеці", en: "Search the library" },
  courts: { uk: "Суди", en: "Courts" },
  courtsAll: { uk: "Усі суди", en: "All courts" },
  /* The filter over a column is named for the column. «Етап» and «Ухвалено»
     named neither the data nor the heading above it; the library calls these
     two dimensions «стан розгляду» and «тип рішення» everywhere now — the
     column heading, the filter, the sort axis and the tag's assistive-
     technology prefix all say the same words. */
  stages: { uk: "Стан розгляду", en: "Stage" },
  stagesAll: { uk: "Будь-який стан", en: "Any stage" },
  outcomes: { uk: "Тип рішення", en: "Decision type" },
  outcomesAll: { uk: "Будь-який тип", en: "Any decision type" },
  /* «Галузь» is the word the pending case page and the search's own group
     label already use for `type`; the filter takes it rather than inventing a
     fifth name for the same column of the record. */
  fields: { uk: "Галузь", en: "Field" },
  fieldsAll: { uk: "Будь-яка галузь", en: "Any field" },
  materials: { uk: "Матеріали", en: "Materials" },
  materialsAll: { uk: "Будь-які матеріали", en: "Any materials" },
  /* The control that folds the five filters away on a phone. See the note in
     RegistryTable for why it exists and why the sort control is not inside
     it. */
  filters: { uk: "Фільтри", en: "Filters" },
  matLit: { uk: "Є огляд", en: "Has a summary" },
  matDoc: { uk: "Є документ суду", en: "Has a court document" },
  /* The link itself, in the wording `dict.pending.official` already uses on
     the page a row without a summary leads to — the reader meets the same
     three words in the list and at the destination. */
  doc: { uk: "Документ суду", en: "The court's document" },
  /* The label the map tag and the pending page already give this figure. It
     is visually hidden here: in the figures column the currency mark says
     what the number is, and a caption on thirteen of thirty-three rows would
     be louder than the years above it. */
  amountName: { uk: "Сума у спорі", en: "Amount in dispute" },
  sort: { uk: "Порядок", en: "Sort" },
  sortOpt: {
    yearDesc: { uk: "Спершу нові", en: "Newest first" },
    yearAsc: { uk: "Спершу давні", en: "Oldest first" },
    decidedDesc: { uk: "За датою рішення", en: "By decision date" },
    readable: { uk: "Спершу опрацьовані", en: "Ready to read first" },
    /* Thirteen rows carry a sum and the largest is five billion; until now
       the figure was in the record and on no surface that lists these cases. */
    amountDesc: { uk: "Найбільші суми", en: "Largest amounts" },
    court: { uk: "За судом", en: "By court" },
    stage: { uk: "За станом розгляду", en: "By stage" },
    outcome: { uk: "За типом рішення", en: "By decision type" },
    name: { uk: "За назвою", en: "By name" },
  },
  colCourt: { uk: "Суд", en: "Court" },
  colCase: { uk: "Справа", en: "Case" },
  /* «Теги» named the widget, not the facts. Two columns now, each named for
     what it holds, and each sortable on its own axis. */
  colStage: { uk: "Стан розгляду", en: "Stage" },
  colOutcome: { uk: "Тип рішення", en: "Decision type" },
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
  /* The acts folded into a proceeding's row. Today that is the ICC's six
     arrest warrants in ICC-01/22: the library counts them — the row says
     «6 ордерів» — and shows them here rather than as six rows of their own.
     Keyed by `outcome`, so the next kind of act that folds has to be named
     before it can appear. */
  actWord: {
    warrant: {
      uk: { one: "ордер", few: "ордери", many: "ордерів" },
      en: { one: "warrant", few: "warrants", many: "warrants" },
    },
  },
  /* Review: «додати вказівку з зірочкою, що це 6, про які публічно відомо».
     The Court does not publish every warrant it issues — some stay under
     seal — so the figure is what is on the public record, not a total. */
  actsNote: {
    uk: "про які відомо публічно",
    en: "those on the public record",
  },
  combine: {
    uk: "Кілька значень в одному фільтрі — будь-яке з них; різні фільтри діють разом.",
    en: "Several values in one filter mean any of them; different filters apply together.",
  },
  reset: { uk: "Скинути", en: "Reset" },
  /* Per-filter clearing and the blanket reset are two different acts and are
     kept apart: a chip drops one value, «Скинути» drops every filter, the
     search box and the ordering with them. */
  activeFilters: { uk: "Активні фільтри", en: "Active filters" },
  clearFilter: { uk: "Прибрати фільтр", en: "Remove filter" },
  clearSearch: { uk: "Очистити пошук", en: "Clear search" },
  emptyHead: { uk: "Нічого не знайдено", en: "Nothing found" },
  emptyBody: {
    uk: "Спробуйте змінити фільтри або пошуковий запит.",
    en: "Try adjusting the filters or the search query.",
  },
  /* The two states the search can be in while it is only half itself.

     The index over the eight write-ups is a file now (`/search-index.json`),
     asked for the moment a reader reaches for the field. Until it lands, a
     query runs against the thirty-three rows and nothing else — which is what
     the library did before the index existed, and which finds «Ощадбанк» but
     not «депортація дітей». A search that answers short without saying so is
     the exact failure the index was built to end, so the count line says
     which half is running rather than letting the reader conclude the archive
     holds nothing. */
  searchLoading: {
    uk: "Пошук поки що лише в рядках — покажчик конспектів ще завантажується.",
    en: "Searching the rows only for now — the write-up index is still loading.",
  },
  searchNoIndex: {
    uk: "Покажчик конспектів не завантажився — пошук лише в рядках.",
    en: "The write-up index did not load — this is searching the rows only.",
  },
  matched: { uk: "збіг:", en: "matched:" },
  /* Distinct from `matched`, which names a hidden field of the *row*. This one
     names a part of the write-up behind the row, and each part is a link. */
  matchedIn: { uk: "в огляді:", en: "in the write-up:" },
  /* The decision page's own bands, in its own words — these labels have to be
     the ones a reader sees on arriving at the anchor, or the link lies about
     where it goes. Copied from `T` and `pageSections` in
     app/[locale]/cases/[slug]/page.tsx.

     One does not travel cleanly: `#machinery` is titled «Ордери» / "Warrants"
     on the ICC page and «Розбір рішення» / "Anatomy" everywhere else, because
     that band renders warrants on one page and attribution/objections on the
     others. The label here is the majority one. Making it exact would mean
     shipping a per-case label table for a single band; it is noted rather than
     built, and it is the only place these two lists differ. */
  section: {
    /* «Якщо коротко», not «Огляд»: the chip on the decision page was renamed
       and now lands on the plain-language paragraph rather than on the row of
       counters. */
    overview: { uk: "Якщо коротко", en: "In short" },
    chronology: { uk: "Хронологія", en: "Timeline" },
    machinery: { uk: "Розбір рішення", en: "Anatomy" },
    rulings: { uk: "Тлумачення", en: "Key rulings" },
    measures: { uk: "Тимчасові заходи", en: "Provisional measures" },
    /* The band at `#handbook` is headed «Хто є хто» / "Who's who" on the
       decision page — it was retitled there when the chip that led to it was
       found promising a primer and delivering a cast list. This copy kept the
       old wording, so a search hit still offered "What to know" and landed on
       "Who's who". */
    handbook: { uk: "Хто є хто", en: "Who's who" },
    /* Its own band since the glossary was split out of the who's-who, and its
       own section here since the index was still filing terms under the one
       above — a term search landed on the cast list. */
    glossary: { uk: "Словник", en: "Glossary" },
    /* `questions` stood here. The band is gone from the decision page, and a
       hit that pointed at #questions would land on nothing; the neighbouring
       decisions it shared that section with now have their own. */
    related: { uk: "Пов'язані рішення", en: "Related decisions" },
    fulltext: { uk: "Повний огляд", en: "Full summary" },
  },
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
  /* Twelve bodies, and one of them — EU / Belgium enforcement measures — is
     not a court: `content/institutions.ts` files it as `executive`. "Courts"
     counted them wrongly and "instances" is a false friend for «інстанція»
     (a court instance is a level of jurisdiction, not an item). "Institutions"
     is the noun `content/institutions.ts` and `content/stats.ts` already use. */
  mInstitutions: { uk: "інстанцій", en: "institutions" },
  mAnalysed: { uk: "опрацьовано", en: "analysed" },
  /* The state of the collection, said in words under the figures.

     Review's instruction: «на сторінці бібліотека додати вказівку конкретну
     про те, що не всі рішення є проаналізовані — бо це зразу не зрозуміло,
     якщо попередньо людина не прочитала розділ про нас». It was not: the page
     printed «8 опрацьовано» beside «39 проваджень» and left the reader to
     draw the conclusion from two numbers. A figure is not a statement, and
     the reader who most needs this one is the reader who arrived here first.

     The sentence itself came off /about in the same review — it was «Стан
     бібліотеки» there — and this is where it was supposed to land. The claim
     it makes is the one content/legal.ts already makes, so the two cannot
     disagree.

     One clause came off it on the way. It read «у бібліотеці та на мапі вони
     позначені як такі», which was true when it was written and had not been
     for some time: the map carried a marker per case then, and it was
     re-conceived as the states whose courts hear these proceedings — no case
     markers, and a legend that names only a court and a forum State. The
     sentence outlived the thing it described, which is what a claim about
     another surface does unless something checks it. Checked here rather than
     assumed: 40 rows in the library, 8 of them marked as written up, a filter
     for them and the words «Огляд у підготовці»; on the map, zero markers.
     So it points at the list under it, which is the surface it is on.

     Shorter than it was, too. The first version ran three ideas through one
     sentence and reached the reader as «дуже дивне формулювання»: it opened
     on the library rather than on the reader's question, and «провадження
     вносимо до неї раніше, ніж встигаємо їх опрацювати» is a process
     described where an outcome was wanted. Two sentences now, each with one
     job — what the marks in the list mean, and what an absence does not
     mean. */
  state: {
    uk: "У списку є провадження без огляду — вони позначені окремо. Бібліотека поповнюється: якщо провадження тут немає, це ще не означає, що його не існує.",
    en: "Some proceedings in the list have no summary yet — they are marked as such. The library is still growing: if a proceeding is not here, that does not mean it does not exist.",
  },
} as const;

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

/**
 * A stable key for a subject-matter value.
 *
 * `cases.ts` records `type` as a localized pair and no key — the nine values
 * are an authored vocabulary, but an unkeyed one. This derives the key
 * mechanically from the English wording rather than inventing a taxonomy
 * beside it, so a filter value cannot drift from the label it filters on and
 * nothing here adds a category the record does not already carry.
 */
function fieldKey(v: Localized): string {
  return v.en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const description = pick(T.metaDesc, locale).replace("{n}", String(registryTotal));
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
    /* Acts folded into this proceeding — see `partOf` in content/types.ts. */
    const actRows = actsOf(c.id);
    const acts = actRows.map((a) => ({
      id: a.id,
      name: a.actName ? pick(a.actName, locale) : (a.nameShort ?? a.name),
      href: a.decisionUrl ?? null,
    }));
    const actText = actRows
      .map((a) => `${a.name} ${a.nameUk ?? ""} ${both(a.actName)} ${both(a.note)}`)
      .join(" ");
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
      /* The heading is the short name where there is one; the full caption
         stays in `find.visible` below, so a claimant who appears only in it is
         still reachable by search. */
      name: c.nameShort ?? c.name,
      nameUk: locale === "uk" ? (c.nameUk ?? "") : "",
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
      slug: c.summarySlug ?? null,
      docUrl: c.decisionUrl,
      amountUsd: c.amountUsd,
      amountLabel:
        c.amountUsd != null ? moneyCompact(c.amountUsd, locale) : null,
      fieldKey: fieldKey(c.type),
      fieldLabel: pick(c.type, locale),
      href: c.summarySlug ? `/${locale}/cases/${c.summarySlug}` : null,
      /* Both locales go into every group. Most case names are recorded only in
         English while the interface is Ukrainian, and until `nameUk` a reader
         typing «Нафтогаз» or «Укренерго» could not reach the row that is about
         it — only the institution's Ukrainian abbreviation and seat were
         searchable, not the title. The Ukrainian line goes into the search
         whatever locale is being read, so a Ukrainian query finds the case on
         the English page too. */
      acts,
      actsLabel: acts.length
        ? `${acts.length} ${plural(acts.length, T.actWord.warrant[locale === "uk" ? "uk" : "en"], locale)}`
        : null,
      actsNote: acts.length ? pick(T.actsNote, locale) : null,
      /* The acts' own text goes into the parent's haystack. Six warrant
         records left the list; a reader typing «Шойгу» still has to land on
         the proceeding that holds his warrant, and the charges paragraph is
         the only place several of the Rome Statute articles are written. */
      find: {
        visible: `${c.name} ${c.nameShort ?? ""} ${c.nameUk ?? ""} ${both(c.note)} ${actText}`,
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

  /* Subject-matter options, in the order the source file lists them: the
     spreadsheet's own order, not an alphabet imposed on top of it. */
  const fields: Array<{ key: string; label: string }> = [];
  const seenFields = new Set<string>();
  for (const c of cases) {
    const key = fieldKey(c.type);
    if (seenFields.has(key)) continue;
    seenFields.add(key);
    fields.push({ key, label: pick(c.type, locale) });
  }

  /* What is left of the content index on this page: eight section labels.

     The postings are language-agnostic — both locales of every field went into
     them — but the page carrying them was not, so the same 24,137 gzipped
     bytes shipped inside /uk/registry and again inside /en/registry, to every
     reader who opened the library and not only to the ones who searched it.
     They are one static file now, fetched once, cached, and shared by both
     locales; the labels stay because they are localized and tiny. */
  const content = {
    sections: SECTIONS.map((id) => ({ id, label: pick(T.section[id], locale) })),
    url: CONTENT_INDEX_PATH,
  };

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
              <span className="ml">{pick(T.mInstitutions, locale)}</span>
            </div>
            <div className="m">
              <span className="mv">{analysed}</span>
              <span className="ml">{pick(T.mAnalysed, locale)}</span>
            </div>
          </div>
          {/* Under the figures, because it is the figures that raise the
              question: 8 of 39 is a fact a reader has to interpret, and this
              is the interpretation. */}
          <p className="reg-state">{pick(T.state, locale)}</p>
        </header>

        {/* No Suspense boundary, and that is the point.

            There used to be one, wrapping this table with `fallback={null}`,
            because `RegistryTable` read the incoming `?court=` through
            `useSearchParams()`. The comment here claimed the fallback was
            never seen. It was seen by every reader and every crawler in
            production: `useSearchParams` bails a statically rendered route
            out to client-side rendering, and the built HTML for this page
            carried an 815-byte <main> — masthead, then a
            BAILOUT_TO_CLIENT_SIDE_RENDERING marker where thirty-three
            proceedings should have been. Dev renders on demand, so the hole
            only existed in the artefact nobody was reading.

            The table now reads the URL after hydration instead (see the
            state block in RegistryTable), so nothing here suspends and the
            whole ledger is in the HTML again. */}
        <RegistryTable
          rows={rows}
          courts={courts}
          stages={stages}
          outcomes={outcomes}
          fields={fields}
          content={content}
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
            fields: pick(T.fields, locale),
            fieldsAll: pick(T.fieldsAll, locale),
            materials: pick(T.materials, locale),
            materialsAll: pick(T.materialsAll, locale),
            matLit: pick(T.matLit, locale),
            matDoc: pick(T.matDoc, locale),
            doc: pick(T.doc, locale),
            amountName: pick(T.amountName, locale),
            filters: pick(T.filters, locale),
            sort: pick(T.sort, locale),
            sortOpt: Object.fromEntries(
              Object.entries(T.sortOpt).map(([k, v]) => [k, pick(v, locale)]),
            ),
            colCourt: pick(T.colCourt, locale),
            colCase: pick(T.colCase, locale),
            colStage: pick(T.colStage, locale),
            colOutcome: pick(T.colOutcome, locale),
            colDate: pick(T.colDate, locale),
            sortAsc: pick(T.sortAsc, locale),
            sortDesc: pick(T.sortDesc, locale),
            sortNone: pick(T.sortNone, locale),
            results: T.results[locale],
            ofTotal: pick(T.ofTotal, locale),
            combine: pick(T.combine, locale),
            reset: pick(T.reset, locale),
            activeFilters: pick(T.activeFilters, locale),
            clearFilter: pick(T.clearFilter, locale),
            clearSearch: pick(T.clearSearch, locale),
            emptyHead: pick(T.emptyHead, locale),
            emptyBody: pick(T.emptyBody, locale),
            searchLoading: pick(T.searchLoading, locale),
            searchNoIndex: pick(T.searchNoIndex, locale),
            matched: pick(T.matched, locale),
            matchedIn: pick(T.matchedIn, locale),
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
      </main>

      {/* No sign-off band here either.

          It was the home page's support ask, brought over so that a reader who
          arrives from a shared filtered link is asked something too. The ask is
          in the top bar on every page now — which is that same reasoning
          carried further — and the band's heading and paragraph are the text
          the owner asked to remove. One ask, one place, one appearance. */}
    </div>
  );
}

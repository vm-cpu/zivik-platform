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
import { pick } from "@/content/types";
import {
  siteUrl,
  pathAlternates,
  ogImage,
  defaultOgImage,
} from "@/lib/seo";
import Partners from "@/components/nasvitlo/Partners";
import "../about.css";

/**
 * "About us" — the page the primary navigation points at.
 *
 * The home page keeps a two-paragraph summary of the same material; this is
 * the full account, and the only place on the site that describes the
 * editorial method. Every statement here is traceable to something in the
 * repository: the library text comes from `content/about.ts` verbatim, the
 * figures are counted off `content/cases.ts`, and the method restates how
 * `content/summaries/` is actually built. Nothing about the Centre's history
 * or funding is asserted, because nothing in the record supports it.
 */
const T = {
  back: { uk: "На головну", en: "Home" },
  title: { uk: "Про нас", en: "About us" },
  lede: {
    uk: "«Насвітло» — бібліотека рішень міжнародних судів і трибуналів, що постали з українських ініціатив притягнути Росію до відповідальності. Проєкт веде Дослідницький центр імені Луї Б. Зона Факультету права УКУ.",
    en: "nasvitlo is a library of decisions of the international courts and tribunals arising from Ukraine's initiatives to hold Russia accountable. It is run by the Louis B. Sohn Research Centre at the UCU Faculty of Law.",
  },
  metaDesc: {
    uk: "Хто веде бібліотеку «насвітло», як готуємо конспекти рішень і в якому стані бібліотека.",
    en: "Who runs the nasvitlo library, how a decision summary is prepared, and how far the library has got.",
  },

  notH: { uk: "Чого тут немає", en: "What you will not find here" },
  not: {
    uk: [
      "Конспект не заміняє рішення. Першоджерелом лишається текст суду, і посилання на нього стоїть на сторінці кожної справи, де документ у відкритому доступі.",
      "Ми не додаємо оцінок, яких немає в самому рішенні. Хронологія, таблиця висновків і цифри на сторінці справи переказують те, що вже сказано в конспекті; якщо якесь значення взяте поза ним — із протоколу чи повідомлення суду, — це зафіксовано в джерелі сторінки.",
      "Це довідкова бібліотека, а не юридична консультація.",
    ],
    en: [
      "A summary does not replace the decision. The court's own text remains the source, and every case page carries a link to it where the document is public.",
      "We add no assessment that is not in the decision itself. The timeline, the table of findings and the figures on a case page restate what the summary already says; where a value comes from outside it — from the court's record or its press release — that is recorded in the page's source.",
      "This is a reference library, not legal advice.",
    ],
  },

  whoH: { uk: "Хто веде проєкт", en: "Who runs the project" },
  who: {
    uk: "Проєкт веде Дослідницький центр імені Луї Б. Зона Факультету права Українського католицького університету, Львів.",
    en: "The project is run by the Louis B. Sohn Research Centre at the Faculty of Law of the Ukrainian Catholic University, Lviv.",
  },
  whoLink: { uk: "Хто працює над бібліотекою", en: "Who works on the library" },

  /* The Centre in its own words. Taken from its page on the faculty site
     (lawmigration.ucu.org.ua/doslidnyczkyj-czentr-luyi-zona), condensed but
     not paraphrased into something it does not say; the English is a
     translation of that Ukrainian, not a separate text. Nothing here is
     inferred — until now this page said nothing about the Centre at all,
     because the repository recorded nothing to say. */
  centre: {
    uk: "Дослідницький центр імені Луї Бруно Зона Факультету права УКУ — експертна платформа з дослідження, осмислення та подолання правових викликів, спричинених війною та повоєнним відновленням України. Центр зʼявився з переконання, що право не може мовчати, коли йдеться про порушення справедливості та гідності людини.",
    en: "The Louis Bruno Sohn Research Centre at the UCU Faculty of Law is an expert platform for researching, making sense of and answering the legal challenges caused by the war and by Ukraine’s post-war recovery. The Centre grew out of a conviction that the law cannot stay silent where justice and human dignity are violated.",
  },
  centre2: {
    uk: "Центр поєднує науковий аналіз із практичними правовими рішеннями: тут проводять дослідження, ведуть публічний діалог і сприяють професійному розвитку правників, готових шукати відповіді на найскладніші виклики свого часу. Ця бібліотека — одна з таких відповідей.",
    en: "The Centre joins scholarly analysis to practical legal work: it conducts research, holds public debate, and supports the professional development of lawyers willing to take on the hardest questions of their time. This library is one of those answers.",
  },
  missionH: { uk: "Місія Центру", en: "The Centre’s mission" },
  mission: {
    uk: [
      "Розвиток національного права України на засадах верховенства права, прав людини та конституційної демократії",
      "Фахове осмислення сучасного стану міжнародного права та викликів, зумовлених досвідом російської агресії проти України",
      "Формування обґрунтованих, ціннісно вкорінених публічних політик",
      "Створення спільноти правників, залучених у формування правових відповідей на виклики війни та складні суспільні трансформації",
    ],
    en: [
      "Developing Ukraine’s national law on the foundations of the rule of law, human rights and constitutional democracy",
      "Expert assessment of the present state of international law and of the challenges thrown up by Russia’s aggression against Ukraine",
      "Shaping public policy that is well-founded and rooted in values",
      "Building a community of lawyers engaged in forming legal answers to the challenges of the war and to difficult social change",
    ],
  },
  /* A direct quotation, so it is attributed and not trimmed mid-thought. */
  voice: {
    uk: "Університет має своєю місією суспільне служіння. Факультет права має це служіння не лише у вихованні правників нової генерації, але й у тому, аби долучатися до процесів трансформації суспільства. Дослідницький центр є тим експертним майданчиком, тим осередком, де будуть формуватися та осмислюватися правові відповіді на виклики, які повʼязані з війною.",
    en: "The university’s mission is service to society. For the Faculty of Law that service lies not only in bringing up a new generation of lawyers, but in taking part in the transformation of society itself. The Research Centre is the expert forum, the place where legal answers to the challenges of the war will be formed and thought through.",
  },
  voiceBy: { uk: "Ольга Денькович", en: "Olha Denkovych" },
  voiceRole: { uk: "керівниця Центру Луї Зона", en: "Head of the Louis Sohn Centre" },

  methodH: {
    uk: "Як рішення потрапляє в бібліотеку",
    en: "How a decision gets into the library",
  },
  methodLede: {
    uk: "Порядок той самий для кожної справи. Ми описуємо його тут, щоб читач міг перевірити нас за першоджерелом, а не повірити на слово.",
    en: "The order is the same for every case. We set it out here so that a reader can check us against the source rather than take our word for it.",
  },
  steps: {
    uk: [
      {
        h: "Спершу картка справи",
        p: "Провадження вносимо до реєстру: суд, реєстраційний номер, рік, стан розгляду, коротка нота про предмет і посилання на документ суду, якщо він оприлюднений. На цьому етапі конспекту ще немає — справа стоїть у черзі, і сторінка про це говорить прямо.",
      },
      {
        h: "Потім конспект",
        p: "Конспект пишуть із тексту рішення окремо від сайту й переносять сюди дослівно. Далі його не редагують вручну: те, що читач бачить у тілі конспекту, — це те, що було написано за рішенням, а не переказ переказу.",
      },
      {
        h: "Навколо конспекту — інструменти",
        p: "Хронологія, таблиця висновків суду, ключові цифри та мапа театрів дій — це шар візуалізації над конспектом. Кожне їхнє значення переказує твердження, яке вже є в тексті конспекту; винятки зазначені поіменно там, де їх узято з іншого документа суду.",
      },
      {
        h: "Мова",
        p: "Рішення цитуємо мовою, якою його ухвалено; перекладаємо все, що навколо. Українські версії конспектів — чернетки, доки не пройдуть правничої вичитки.",
      },
      {
        h: "Перевірка за джерелом",
        p: "На сторінці справи лишаються офіційна назва, дата й посилання на документ суду. Бібліотека існує для того, щоб на неї посилалися, тож перевірка має бути в один клік.",
      },
    ],
    en: [
      {
        h: "First the case record",
        p: "The proceeding goes into the registry: court, docket number, year, stage, a short note on the subject matter, and a link to the court's document where one is public. At this point there is no summary — the case is queued, and the page says so plainly.",
      },
      {
        h: "Then the summary",
        p: "The summary is written from the text of the decision, away from the site, and carried across verbatim. It is not edited by hand afterwards: what a reader sees in the body of a summary is what was written against the decision, not a retelling of a retelling.",
      },
      {
        h: "Instruments around the summary",
        p: "The timeline, the table of the court's findings, the headline figures and the map of theatres are a layer of visualization over the summary. Every value in them restates a statement already in the summary; the exceptions are named where a value is taken from another document of the court.",
      },
      {
        h: "Language",
        p: "A decision is quoted in the language it was handed down in; everything around it is translated. Ukrainian versions of the summaries are drafts until they have passed legal review.",
      },
      {
        h: "Checking against the source",
        p: "Each case page keeps the official case name, the date and the link to the court's document. The library exists to be cited, so checking it should take one click.",
      },
    ],
  },

  stateH: { uk: "Стан бібліотеки", en: "Where the library stands" },
  state: {
    uk: "Сайт працює в тестовому режимі. Реєстр повний, конспекти — ні: справи опрацьовуємо поступово, і кожна, до якої ще не дійшли руки, позначена в реєстрі та на мапі як така.",
    en: "The site is in test mode. The registry is complete; the summaries are not. Cases are written up one at a time, and every case we have not reached yet is marked as such in the registry and on the map.",
  },
  mProceedings: { uk: "проваджень", en: "proceedings" },
  mCourts: { uk: "інстанцій", en: "courts" },
  mAnalysed: { uk: "з конспектом", en: "written up" },
  stateLink: { uk: "Повний реєстр", en: "The full registry" },

  contactH: { uk: "Написати нам", en: "Write to us" },
  contact: {
    uk: "Помітили помилку в конспекті або знаєте про провадження, якого тут немає — напишіть.",
    en: "If you have spotted an error in a summary, or know of a proceeding that is missing, write to us.",
  },
  /* No `as const` here, unlike the team page. Two of these entries are arrays;
     frozen literal types would make the English member unassignable to the
     Ukrainian one and `pick` would stop type-checking. */
};

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
  const path = `/${locale}/about`;
  const title = pick(T.title, locale);
  // Short on purpose: a description over ~160 characters is truncated in the
  // result, and the pages that already do that read as a paragraph cut mid-word.
  const description = pick(T.metaDesc, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: pathAlternates((l) => `/${l}/about`),
    },
    openGraph: {
      type: "website",
      // Open Graph wants language_TERRITORY; a bare "uk" is ignored.
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: path,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [ogImage(defaultOgImage, dict.meta.ogAlt)],
    },
    // A page that sets openGraph and no twitter inherits the layout's card —
    // it would otherwise share as the home page.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const dict = await getDictionary(locale);
  const repo = getContentRepository();
  const [about, cases, institutions, partners] = await Promise.all([
    repo.getAbout(),
    repo.getCases(),
    repo.getInstitutions(),
    repo.getPartners(),
  ]);

  const L = <V,>(x: Record<Locale, V>) => pick(x, locale);

  /* Counted, never written down. The registry page counts the same three
     figures the same way — instances are the institutions that actually have
     a case, not every court in the file. */
  const withCases = new Set(cases.map((c) => c.institutionId));
  const courtCount = institutions.filter((i) => withCases.has(i.id)).length;
  const analysed = cases.filter((c) => c.lit).length;

  return (
    <div className="page aboutpage">
      <main id="content" tabIndex={-1} className="abt-wrap">
        <header className="abt-mast">
          <Link href={`/${locale}`} className="abt-back">
            ← {L(T.back)}
          </Link>
          <h1>{L(T.title)}</h1>
          <p className="abt-lede">{L(T.lede)}</p>
        </header>

        {/* The library's own description, from the content layer, so the
            home page section and this page cannot drift apart. */}
        <section className="abt-sec">
          <h2>{L(about.title)}</h2>
          <div className="abt-prose">
            {L(about.paragraphs).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </section>

        <section className="abt-sec">
          <h2>{L(T.notH)}</h2>
          <ul className="abt-plain">
            {L(T.not).map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </section>

        <section className="abt-sec">
          <h2>{L(T.methodH)}</h2>
          <p className="abt-standfirst">{L(T.methodLede)}</p>
          <ol className="abt-steps">
            {L(T.steps).map((step) => (
              <li key={step.h}>
                <h3>{step.h}</h3>
                <p>{step.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="abt-sec">
          <h2>{L(T.stateH)}</h2>
          <div className="abt-meta">
            <div className="m gilt">
              <span className="mv">{cases.length}</span>
              <span className="ml">{L(T.mProceedings)}</span>
            </div>
            <div className="m">
              <span className="mv">{courtCount}</span>
              <span className="ml">{L(T.mCourts)}</span>
            </div>
            <div className="m">
              <span className="mv">{analysed}</span>
              <span className="ml">{L(T.mAnalysed)}</span>
            </div>
          </div>
          <div className="abt-prose">
            <p>{L(T.state)}</p>
          </div>
          <p className="abt-more">
            <Link href={`/${locale}/registry`}>{L(T.stateLink)} →</Link>
          </p>
        </section>

        <section className="abt-sec">
          <h2>{L(T.whoH)}</h2>
          <div className="abt-prose">
            <p>{L(T.who)}</p>
            <p>{L(T.centre)}</p>
            <p>{L(T.centre2)}</p>
          </div>

          {/* The Centre's mission, in the four points it states itself. */}
          <div className="abt-mission">
            <h3>{L(T.missionH)}</h3>
            <ul>
              {T.mission[locale].map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          <figure className="abt-voice">
            <blockquote>{L(T.voice)}</blockquote>
            <figcaption>
              <b>{L(T.voiceBy)}</b>
              <span>{L(T.voiceRole)}</span>
            </figcaption>
          </figure>

          <p className="abt-addr">{dict.footer.address}</p>
          <p className="abt-more">
            <Link href={`/${locale}/team`}>{L(T.whoLink)} →</Link>
          </p>
        </section>

        {/* The partner row is the shared component, so whatever the content
            layer holds shows up here without this page listing anything. */}
        <div className="abt-partners">
          <Partners locale={locale} dict={dict} partners={partners} />
        </div>

        <section className="abt-sec">
          <h2>{L(T.contactH)}</h2>
          <div className="abt-prose">
            <p>{L(T.contact)}</p>
          </div>
          <p className="abt-more">
            <a href={`mailto:${dict.footer.email}`}>{dict.footer.email} →</a>
          </p>
        </section>
      </main>
    </div>
  );
}

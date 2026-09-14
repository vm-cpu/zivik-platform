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
import { team } from "@/content/team";
import { pick } from "@/content/types";
import { linkAboutProse } from "@/content/about-prose";
import {
  siteUrl,
  pathAlternates,
  ogImage,
  defaultOgImage,
} from "@/lib/seo";
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
  /* «Про проєкт», not «Про нас».
     Owner's edit: the tab and the page are renamed, because what the page is
     about is the project — the people are one section of it now rather than
     the whole subject. `about.title` in the content layer carries the same
     words for the home page's band, which is why the first section below
     lost its own <h2>: the H1 had become a repeat of it. */
  title: { uk: "Про проєкт", en: "About the project" },
  /* No standfirst under the H1. There used to be one, and it said the library
     holds decisions «міжнародних судів і трибуналів, що постали з українських
     ініціатив» — two claims the owner corrected in the same breath: the
     collection covers foreign national courts as well as international ones,
     and not every proceeding in it was brought by Ukraine. `scope`, one
     section below, already says both correctly and at length, so the paragraph
     was removed rather than fixed into a duplicate of the paragraph under it.
     Owner's decision. */
  /* Which courts' practice this library covers. It was the home page's intro
     band, a screen above a section that said nearly the same thing at greater
     length; the user asked for it here and off the home page entirely. Kept in
     this page's own prose rather than in `content/about.ts`, because that file
     feeds the home band too. */
  scope: {
    uk: "Онлайн-бібліотека міжнародної судової практики (Міжнародний суд ООН, ЄСПЛ, МКС, Міжнародний трибунал з морського права, Постійна палата третейського суду) та практики іноземних судів у справах, які порушили Україна та іноземні держави, щоб притягнути Росію до відповідальності за порушення, вчинені під час війни проти України.",
    en: "An online library of international case-law — the International Court of Justice, the ECtHR, the ICC, the International Tribunal for the Law of the Sea, the Permanent Court of Arbitration — and of foreign national courts, in the proceedings brought by Ukraine and by foreign States to hold Russia accountable for violations committed during the war against Ukraine.",
  },

  metaDesc: {
    /* It used to promise the editorial method and the state of the library.
       Both sections have since come off this page — the method for being a
       procedure the project has not settled, the figures for living on the
       library page — so the description advertised two things a visitor
       arriving from a search result would not find. */
    uk: "Хто веде бібліотеку «НаСвітло», що це за проєкт і хто над ним працює.",
    en: "Who runs the NaSvitlo library, what the project is, and who works on it.",
  },

  notH: { uk: "Чого тут немає", en: "What you will not find here" },
  not: {
    uk: [
      "Огляд не заміняє рішення. Першоджерелом лишається текст суду, і посилання на нього стоїть на сторінці кожної справи, де документ у відкритому доступі.",
      "Ми не додаємо оцінок, яких немає в самому рішенні. Хронологія, таблиця висновків і цифри на сторінці справи переказують те, що вже сказано в огляді; якщо якесь значення взяте поза ним — із протоколу чи повідомлення суду, — це зафіксовано в джерелі сторінки.",
      /* «Це довідкова бібліотека, а не юридична консультація» stood here as a
         third bullet. Owner's decision to drop it: the disclaimer belongs in
         content/legal.ts, which carries it, and on a page about editorial
         method it read as a lawyer's footer rather than as one of the two
         genuine limits above it. */
    ],
    en: [
      "A summary does not replace the decision. The court's own text remains the source, and every case page carries a link to it where the document is public.",
      "We add no assessment that is not in the decision itself. The timeline, the table of findings and the figures on a case page restate what the summary already says; where a value comes from outside it — from the court's record or its press release — that is recorded in the page's source.",
    ],
  },

  whoH: { uk: "Хто веде проєкт", en: "Who runs the project" },
  /* Split around the Centre's name so that name can be the link.

     Owner's edit: wherever the Research Centre is named, link out to the
     faculty's site. This sentence is the site's own, unlike `centre` and
     `centre2` below, which are the Centre's description of itself quoted from
     that same site — so the anchor goes here, where a rewrite of the quoted
     description cannot carry it off with it.

     One link, not two. The faculty and the university are named in the same
     breath and both would resolve to the same host; two anchors in one
     sentence would read as two destinations. */
  who: {
    uk: ["Проєкт веде ", "Дослідницький центр імені Луї Б. Зона", " Факультету права Українського католицького університету, Львів."],
    en: ["The project is run by the ", "Louis B. Sohn Research Centre", " at the Faculty of Law of the Ukrainian Catholic University, Lviv."],
  },

  teamH: { uk: "Хто над цим працює", en: "Who works on this" },
  teamLink: { uk: "Сторінка команди", en: "The team page" },

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
  /* Quoted material. «російської агресії» stands here against the site's own
     rule — see the note at the top of i18n/dictionaries/uk.ts — because this
     is the Centre's statement of its own mission in its own words, not the
     library speaking. Do not "unify" it. */
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

  /* ── «Як рішення потрапляє в бібліотеку» — removed, owner's decision ──────
     A five-step account of the editorial method used to stand here. It is
     gone, and it is not to be restored as written. Three separate reasons,
     each one of them sufficient:

       • It fixed a methodology the project has not settled. Step 01 said a
         case enters as a record and step 02 that the summary is written from
         the text of the decision — but where no decision is published, the
         library works from reports of it, which step 02 denied outright.
       • Step 04 called the Ukrainian summaries «чернетки, доки не пройдуть
         правничої вичитки». Publishing a page that calls its own Ukrainian
         text a draft is not a caveat a reader can use.
       • Step 05 promised that checking a summary «має бути в один клік». The
         library links a decision as a whole; it does not link the individual
         paragraphs its summaries cite, so the promise was wider than the
         thing delivered.

     What the block was for — telling a reader that a case can be in the
     library before it is written up — is said in `state` below and on the
     library page itself, in one sentence each, without committing the project
     to a procedure it may change. */

  stateH: { uk: "Стан бібліотеки", en: "Where the library stands" },
  state: {
    /*
     * This used to read «Реєстр повний, огляди — ні» / "The registry is
     * complete; the summaries are not", and it was the only place on the site
     * that said so. Three others say the opposite, one of them on this very
     * page:
     *   • src/content/legal.ts — «Бібліотека наповнюється… Відсутність справи,
     *     документа чи огляду не означає, що провадження не існує» /
     *     "The library is still being filled… The absence of a case, a
     *     document or a summary does not mean that the proceeding does not
     *     exist";
     *   • the dictionaries, registry.description — «Бібліотека поповнюється
     *     поступово» / "The library grows step by step";
     *   • `contact`, eight lines below — «знаєте про провадження, якого тут
     *     немає — напишіть» / "know of a proceeding that is missing, write to
     *     us", which only makes sense if the collection can still grow.
     * Three against one, and the one is the claim a reader is most likely to
     * rely on. So this paragraph moves to the other three.
     *
     * The word «реєстр» is gone from it as well (user decision — see the note
     * at the top of `i18n/dictionaries/uk.ts`). It cannot simply become
     * «бібліотека» twice over, because "neither the library nor the summaries
     * are finished" is a tautology once the library *is* the summaries: the
     * two incomplete things are the list of proceedings and the write-ups.
     */
    uk: "Бібліотека наповнюється. Провадження вносимо до неї раніше, ніж встигаємо їх опрацювати, тому частина справ поки що стоїть без огляду — у бібліотеці та на мапі вони позначені як такі. Відсутність провадження тут не означає, що його не існує.",
    en: "The library is still being filled. Proceedings enter it faster than they can be written up, so some cases stand without a summary for now — they are marked as such in the library and on the map. A proceeding's absence here does not mean it does not exist.",
  },
  mProceedings: { uk: "проваджень", en: "proceedings" },
  /* «Інстанцій» / "institutions", not "courts": this counts the same figure
     the library page counts, and one of the twelve bodies — EU / Belgium
     enforcement measures, filed as `executive` — is not a court. The two
     pages printed the same number under two different nouns. */
  mInstitutions: { uk: "інстанцій", en: "institutions" },
  mAnalysed: { uk: "з оглядом", en: "written up" },
  stateLink: { uk: "Уся бібліотека", en: "The whole library" },

  contactH: { uk: "Написати нам", en: "Write to us" },
  contact: {
    uk: "Помітили помилку в огляді або знаєте про провадження, якого тут немає — напишіть.",
    en: "If you have spotted an error in a summary, or know of a proceeding that is missing, write to us.",
  },
  /* No `as const` here, unlike the team page. Two of these entries are arrays;
     frozen literal types would make the English member unassignable to the
     Ukrainian one and `pick` would stop type-checking. */
};

/**
 * The Centre's page on the Faculty of Law's own site.
 *
 * `lawmigration.ucu.org.ua` is the faculty site — its <title> is «Факультет
 * права УКУ» — and the Centre has a page on it, so one address satisfies both
 * halves of the edit: the link is to the faculty's site, and it lands on the
 * Centre rather than on a home page the reader then has to search.
 *
 * Not `law.ucu.edu.ua`: that host answers 403 to anything that is not a
 * browser, which is not proof it is dead but is enough reason not to make it
 * the one address on this page that leaves the site.
 */
const FACULTY_URL = "https://lawmigration.ucu.org.ua/doslidnyczkyj-czentr-luyi-zona";

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
  /* One fetch, which is all the page still draws from. It used to count three
     figures off the cases and the institutions for «Стан бібліотеки» — that
     section moved to the library page, which counts the same figures from the
     same source — and it used to read the partner list, which is now on the
     home page and only there. */
  const about = await repo.getAbout();

  const L = <V,>(x: Record<Locale, V>) => pick(x, locale);
  /* The citation table travels with the prose — see content/about.ts. */
  const aboutLinks = about.links ? L(about.links) : [];

  return (
    <div className="page aboutpage">
      <main id="content" tabIndex={-1} className="abt-wrap">
        <header className="abt-mast">
          <Link href={`/${locale}`} className="abt-back">
            ← {L(T.back)}
          </Link>
          <h1>{L(T.title)}</h1>
        </header>

        {/* The library's own description, from the content layer, so the
            home page section and this page cannot drift apart. */}
        {/* No <h2> over the opening prose. It used to carry `about.title` —
            «Про проєкт» — which is now the page's own H1, so the two stood one
            above the other saying the same words. The content layer keeps the
            heading because the home page's band still needs it. */}
        <section className="abt-sec">
          <div className="abt-prose">
            <p>{L(T.scope)}</p>
            {L(about.paragraphs).map((text, i) => (
              <p key={i}>{linkAboutProse(text, aboutLinks)}</p>
            ))}
          </div>
        </section>

        {/* ── «Чого тут немає» — removed, owner's decision ──────────────────
            Four statements about what the archive does not do, and three of
            them drew a separate objection in the review: that the summary
            never stands in for the decision (it does, where no text has been
            published and the record is a court's own account of it); that
            nothing is added beyond the ruling; and that every figure is
            sourced to a paragraph, when what the pages link is the decision
            and not its paragraphs. A section that states four disciplines and
            gets three of them wrong is worse than no section.

            Removed rather than corrected because the corrections belong in
            the methodology the archive has yet to write in its own words —
            see the note on «Як рішення потрапляє в бібліотеку» above, which
            came off for the same reason. */}

        {/* ── «Стан бібліотеки» — moved, owner's decision ───────────────────
            Three figures and a line about how much of the archive is written
            up. It belongs where the archive is, not in the page about the
            project: the registry already opens with the same count and the
            same "written up" figure, from the same source, so this was the
            second place a reader could be told — and the review's note is that
            a reader who has not read this page should still meet the fact.

            Removed rather than duplicated. The numbers live on /registry,
            which is where «Бібліотека рішень» goes from every surface. */}

        <section className="abt-sec">
          <h2>{L(T.whoH)}</h2>
          <div className="abt-prose">
            <p>
              {L(T.who)[0]}
              <a href={FACULTY_URL} target="_blank" rel="noopener noreferrer">
                {L(T.who)[1]}
              </a>
              {L(T.who)[2]}
            </p>
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

          {/* The street address used to sit here, directly under Olha
              Denkovych's name. It is the data controller's address and it
              belongs to the privacy notice, which carries it; under a
              quotation about the Centre's mission it read as though the
              speaker were being served with something. Owner's decision.
              content/legal.ts still holds it, and so does the footer. */}
        </section>

        {/* The team, on this page as well as on its own.

            Owner's edit: «Команду продублювати у розділ ПРО НАС». A reader who
            has just been told which institution runs the archive asks who that
            is in practice, and the answer was a link away. It is a roster and
            not a copy of /team: that page gives everyone a portrait and the
            room a portrait needs, and seven of those in the middle of a column
            of prose would bury the two sections after it. Names and roles from
            `content/team.ts`, so the two lists cannot drift apart, and the
            link under them goes to the faces. */}
        <section className="abt-sec">
          <h2>{L(T.teamH)}</h2>
          <ul className="abt-roster">
            {team.map((m) => (
              <li key={m.name.en}>
                <b>{L(m.name)}</b>
                <span>{L(m.role)}</span>
              </li>
            ))}
          </ul>
          <p className="abt-more">
            <Link href={`/${locale}/team`}>{L(T.teamLink)} →</Link>
          </p>
        </section>

        {/* ── The partner row — removed, owner's decision ──────────────────
            «Партнерів залиш лише на головній». The same marks stood on the
            home page, here, and on a page of their own: three places for one
            partner, which is the duplication the review flagged. The home
            page's band is the one that stays; this page and the /partners
            route are where it came off. */}

        <section className="abt-sec">
          <h2>{L(T.contactH)}</h2>
          <div className="abt-prose">
            <p>{L(T.contact)}</p>
          </div>
          {/* The address itself used to be the control — an 11px uppercase
              arrow link, the same treatment as «Повний реєстр» two sections
              above, which made an invitation to write look like navigation.
              The shared CTA pill carries the act; the address stays underneath
              as a fact, for a reader who wants to copy it rather than open a
              mail client. */}
          <p className="abt-action">
            <a className="nsv-cta" href={`mailto:${dict.footer.email}`}>
              {L(T.contactH)}
              <span className="nsv-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </p>
          <p className="abt-addr">{dict.footer.email}</p>
        </section>
      </main>
    </div>
  );
}

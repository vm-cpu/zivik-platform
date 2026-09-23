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
import { team, teamGroups } from "@/content/team";
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
  /* The five courts are out of the sentence and under it, as a row.

     They were a parenthesis of five institutions inside a sixty-word
     sentence — the one genuinely enumerable thing on this page, read as
     prose. A reader scanning for "is my court in here" had to parse a
     subordinate clause to find out. Nothing is added and nothing is
     dropped: the same five, in the same order, from `content/institutions`
     where `phase1` already marks exactly this list, so the row cannot
     drift from the registry the way a hand-typed parenthesis can. The
     sentence keeps every other word it had, including «та практики
     іноземних судів» — the row is the international five and the sentence
     still says the library goes beyond them.

     Their hue is `--brand-forum`, which on this site names an institution
     and never an outcome (DESIGN.md §Colour). Gold here would have read as
     relief granted and red as a finding of breach. */
  scope: {
    uk: "Онлайн-бібліотека міжнародної судової практики та практики іноземних судів у справах, які порушили Україна та іноземні держави, щоб притягнути Росію до відповідальності за порушення, вчинені під час війни проти України.",
    en: "An online library of international case-law and of foreign national courts, in the proceedings brought by Ukraine and by foreign States to hold Russia accountable for violations committed during the war against Ukraine.",
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

  /* ── «Чого тут немає» — removed with its strings ──────────────────────────
     Four statements about what the archive does not do, three of which drew a
     separate objection in the review: that a summary never stands in for the
     decision (it does, where no text has been published and the record is the
     court's own account); that nothing is added beyond the ruling; and that
     every figure is sourced to a paragraph, when what the pages link is the
     decision and not its paragraphs. A section that states four disciplines
     and gets three of them wrong is worse than no section. The strings went
     with the markup rather than sitting here as text nothing renders and a
     translator would keep up to date. */

  /* ── Навіщо, з owner's «Про платформу — опис повний» ─────────────────────
     Три абзаци того документа, які сторінка доти не казала: завдання, що
     його війна поставила перед правом; розпорошеність практики між
     юрисдикціями; і те, задля чого платформа існує — не зберігати справи, а
     давати побачити, як із них складається система.

     Чого з документа тут немає і чому. Перелік судів — ЄСПЛ, МС ООН, МКС,
     МТМП, ППТС, суди іноземних держав — уже стоїть лідом цієї ж сторінки,
     двома екранами вище. Абзац про ширшу місію факультету й Центру теж:
     нижче її розказано конкретніше, чотирма пунктами, і третій переказ
     зробив би з неї тло.

     Англійська — переклад, зроблений тут: документ її не має. */
  whyH: { uk: "Навіщо ця бібліотека", en: "Why this library" },
  why: {
    uk: [
      "Війна Росії проти України поставила перед правом надзвичайне за масштабом завдання — забезпечити відповідальність за численні порушення міжнародного права, захистити права постраждалих та створити правові передумови для відновлення справедливості. Відповіддю стало використання широкого кола міжнародних і національних правових механізмів, і в результаті формується значний та постійно зростаючий масив судової практики.",
      "Водночас ця практика розпорошена між різними юрисдикціями, інституціями та інформаційними ресурсами. Це ускладнює системне відстеження справ, розуміння взаємозв'язків між різними правовими механізмами та використання сформованої практики.",
      "Платформа покликана не лише зберігати інформацію про окремі справи, а й допомагати бачити ширшу картину — як через різні юрисдикції та правові механізми формується багаторівнева система відповідальності та правосуддя у відповідь на війну проти України.",
    ],
    en: [
      "Russia’s war against Ukraine set the law a task of extraordinary scale: to secure accountability for numerous violations of international law, to protect the rights of those harmed, and to build the legal preconditions for restoring justice. The answer has been a wide range of international and national legal mechanisms, and the result is a substantial and constantly growing body of case-law.",
      "That practice, however, is scattered across jurisdictions, institutions and information resources. This makes it harder to follow cases systematically, to understand how the different legal mechanisms relate to one another, and to use what they have established.",
      "The platform is meant not merely to hold information about individual cases but to help a reader see the wider picture: how a multi-level system of accountability and justice is taking shape, across jurisdictions and legal mechanisms, in answer to the war against Ukraine.",
    ],
  },
  /* Дата, з якої все почалося, як подія — з макета власниці. Резолюція
     названа й у прозі нижче; тут вона позначка на часі, а не речення. */
  resDate: { uk: "27 березня 2014", en: "27 March 2014" },
  resText: {
    uk: "Генеральна Асамблея ООН схвалює резолюцію «Територіальна цілісність України»",
    en: "The UN General Assembly adopts the resolution ‘Territorial integrity of Ukraine’",
  },
  resLink: { uk: "A/RES/68/262", en: "A/RES/68/262" },
  forumsH: { uk: "Інстанції в бібліотеці", en: "The forums in the library" },
  forumsNat: { uk: "Іноземні національні суди", en: "Foreign national courts" },
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

  /* A way out to the Centre, asked for: «може ми вигадаємо якийсь елемент —
     кнопку тощо який переводить на сторінку сайту». The page already has the
     element — the arrow link under the roster — so this is that one again
     rather than a new kind of object: a second shape for the same job is how
     a page starts having two of everything. It closes the band that describes
     the Centre, which is where a reader who wants more of it has just been
     told there is more. */
  centreLink: {
    uk: "Сторінка Центру на сайті УКУ",
    en: "The Centre’s page on the UCU site",
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

  /* ── «Стан бібліотеки» — removed with its strings ────────────────────────
     Three figures and a line about how much of the archive is written up. It
     belongs where the archive is: the library page opens with the same count
     and the same "written up" figure, from the same source, so this was the
     second place a reader could be told — and the review's note is that a
     reader who has not read this page should still meet the fact. Removed
     rather than duplicated; the numbers live on /registry, which is where
     «Бібліотека рішень» goes from every surface. */

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
 * It used to be `lawmigration.ucu.org.ua`, chosen because `law.ucu.edu.ua`
 * answered 403 to anything that was not a browser. That reasoning aged badly:
 * the 403 was bot protection, not a dead host, and the migration host has
 * since stopped resolving at all — NXDOMAIN, checked. So the one link that
 * left this page led nowhere, and had for a while.
 *
 * This address is the owner's own: «це посилання на центр луї зона на сайті».
 * It still refuses automated requests — a security-verification interlude
 * rather than an error — which is why it cannot be checked from here and is
 * taken on her word.
 */
const FACULTY_URL = "https://law.ucu.edu.ua/doslidnyczkyj-czentr-luyi-zona";

/* A/RES/68/262 in the UN Digital Library — the same record `content/about.ts`
   links from the prose. Written out rather than read from that table: the
   table is keyed by the phrase it matches in a paragraph, and a marker that
   depended on the wording of a sentence would break the day the sentence is
   edited. The reason this record and not a mirror is in that file. */
const RESOLUTION_URL = "https://digitallibrary.un.org/record/767565";

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
  /* The five international courts the scope sentence used to carry in a
     parenthesis, from `content/institutions.ts` rather than typed out here, so
     the row and the registry cannot disagree.

     `phase1` alone is not that list: it also carries the Dutch and the Finnish
     courts, which are national. The row is the international five, and the
     national ones are gathered under one line after them — the same grouping
     the scope sentence makes when it says «та практики іноземних судів». */
  const institutions = await repo.getInstitutions();
  const forums = institutions.filter((i) => i.phase1 && i.category !== "national");
  const nationals = institutions.filter((i) => i.phase1 && i.category === "national");

  /* Люди, зібрані в групи за посадою.

     Порядок дає `teamGroups`; посада, якої в тій таблиці немає, все одно
     рендериться — власною назвою, у кінці, — щоб додана людина не могла
     зникнути зі сторінки через забуту таблицю. */
  const roleGroups = (() => {
    const byKey = new Map<string, typeof team>();
    for (const m of team) {
      const list = byKey.get(m.role.en);
      if (list) list.push(m);
      else byKey.set(m.role.en, [m]);
    }
    const out: { key: string; label: { uk: string; en: string }; members: typeof team }[] = [];
    for (const g of teamGroups) {
      const members = byKey.get(g.key);
      if (!members) continue;
      byKey.delete(g.key);
      out.push({ key: g.key, label: g.label, members });
    }
    for (const [key, members] of byKey) {
      out.push({ key, label: members[0].role, members });
    }
    return out;
  })();

  const L = <V,>(x: Record<Locale, V>) => pick(x, locale);
  /* The citation table travels with the prose — see content/about.ts. */
  const aboutLinks = about.links ? L(about.links) : [];

  return (
    /* ── The page as a sequence of bands ──────────────────────────────────
       It was one column on white from the masthead to the footer: 672px of
       text down the left of a 1800px window, and nothing at all to the right
       of it. The owner's word for that was a white canvas with a white patch
       beside it, which is exactly what a single column on a single ground
       looks like once the window is wider than the measure.

       So the page is bands now, the way the home page and the decision pages
       already are. Each one runs the full width of the window and carries its
       own ground; what sits inside it is still on the site's one rail, still
       at the measure. The width is used by the bands, not by the paragraphs —
       stretching prose to 1800px would answer the empty space and ruin the
       reading.

       Grounds alternate, and the two dark ones are islands, per DESIGN.md:
       masthead dark, prose on paper, the Centre on paper, the mission
       recessed, the quotation dark, the roster on paper, the contact
       recessed. No two dark bands touch. */
    <div className="page aboutpage">
      <main id="content" tabIndex={-1}>
        {/* The masthead is a dark band, not a line of black type on white.

            The same register the court mastheads and the lamp stage use — the
            grounds DESIGN.md lists as dark — and it is what stops the page
            opening on an empty white field. The scope sentence comes up here
            with it, as the standfirst it always was: it says which courts this
            library covers, which is the first thing a reader of this page
            wants and was previously the fourth paragraph they met. */}
        <header className="abt-band abt-dark abt-mast">
          <div className="abt-in">
            <Link href={`/${locale}`} className="abt-back">
              ← {L(T.back)}
            </Link>
            <h1>{L(T.title)}</h1>
            <p className="abt-lede">{L(T.scope)}</p>
          </div>
        </header>

        {/* The library's own description, from the content layer, so the
            home page section and this page cannot drift apart.

            Дата поруч із текстом, не в шапці. Власниця: «про генеральну
            асамблею поставила поруч з текстом першої секції тексту». Позначка
            стояла впоперек темної шапки під рядом судів — третій об'єкт у
            блоці, який уже ніс заголовок, лід і п'ять інстанцій. Те саме
            речення є в прозі праворуч; збоку воно тепер не повтор, а
            закладка на часі при абзаці, який його розповідає. */}
        <section className="abt-band">
          <div className="abt-in">
            <div className="abt-first">
              <p className="abt-res">
                <time dateTime="2014-03-27">{L(T.resDate)}</time>
                <span>{L(T.resText)}</span>
                <a href={RESOLUTION_URL} target="_blank" rel="noopener noreferrer">
                  {L(T.resLink)} →
                </a>
              </p>
              <div className="abt-prose">
                {L(about.paragraphs).map((text, i) => (
                  <p key={i}>{linkAboutProse(text, aboutLinks)}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Інстанції — власною смугою на папері, не рядком у темній шапці.

            Власниця: «я б інстанції на сторінці про проєкт зробила окремою
            секцією не чорною». У шапці вони були приміткою до ліда; окремою
            смугою вони те, чим є — перелік того, чию практику ця бібліотека
            тримає. */}
        <section className="abt-band abt-recess">
          <div className="abt-in abt-wide">
            <h2>{L(T.forumsH)}</h2>
            <ul className="abt-forums">
              {/* Назва, а під нею абревіатура — порядок макета власниці.
                  Доти абревіатура стояла зверху, як у рядку бібліотеки, де
                  читач уже знає, що таке ICJ. Тут він читає сторінку про
                  проєкт: відповідь на «чи є тут мій суд» — це повна назва, а
                  знак під нею каже, як цей суд зветься далі по сайту. */}
              {forums.map((f) => (
                <li key={f.id}>
                  <span>{L(f.name)}</span>
                  <b>{L(f.abbr)}</b>
                </li>
              ))}
              {/* The national courts as one line, not as two country badges:
                  what the library covers there is foreign national practice,
                  and naming «NL» and «FI» in a row of standing institutions
                  would promise a list that grows a row per country. The
                  registry names them one by one; this says what kind of
                  forum they are. */}
              {nationals.length > 0 && (
                <li className="abt-forums-nat">
                  <span>{L(T.forumsNat)}</span>
                  <b aria-hidden="true">—</b>
                </li>
              )}
            </ul>
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
            gets three of them wrong is worse than no section. */}

        {/* ── «Стан бібліотеки» — moved, owner's decision ───────────────────
            Three figures and a line about how much of the archive is written
            up. It belongs where the archive is: the library page opens with
            the same count from the same source. */}

        <section className="abt-band abt-recess">
          <div className="abt-in">
            <h2>{L(T.whyH)}</h2>
            <div className="abt-prose">
              {L(T.why).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="abt-band">
          <div className="abt-in">
            <h2>{L(T.whoH)}</h2>
            {/* Проза і знак факультету — поруч, не одне під одним.

                Плитка стояла під текстом і на широкому екрані закривала
                смугу поперечною коробкою; власниця: «я хочу щоб вона була
                зліва чи справа від тексту, а не внизу — та зміни дизайн
                цього елемента». Тепер це бічна колонка: рейка 1180, проза
                тримає свої 820, знак займає те, що лишилося праворуч, і
                стоїть на верхній лінії першого абзаца.

                Коробки більше немає. Знак підписаний рядком під собою і
                відбитий волосинкою згори — тим самим знаком, яким ця
                сторінка підписує ряд інстанцій. Вужче за 1000 пікселів
                колонки складаються в одну, і знак стає під прозою, бо 340
                пікселів збоку там уже немає.

                alt порожній: назва факультету всередині знака, а поруч
                написано, куди веде посилання. */}
            <div className="abt-who">
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
              <a
                className="abt-fac"
                href={FACULTY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="abt-fac-mark"
                  src={`/logos/fp-logo-red-${locale}.svg`}
                  alt=""
                  /* Власні розміри на теґу: інакше коробка нульової ширини
                     до приходу файлу, а потім стрибок — те саме, що вже
                     було в шапці сайту. Українська й англійська версії
                     локапу різних пропорцій, тому число залежить від
                     мови. */
                  width={2020}
                  height={locale === "uk" ? 797 : 1079}
                />
                <span className="abt-fac-t">
                  {L(T.centreLink)}
                  <span className="abt-fac-a" aria-hidden="true">
                    {" ↗"}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* The mission, across the width.

            Four points that had been a panel inside the reading column — four
            stacked lines in a box 672px wide, with the rest of the window
            empty beside them. They are four peers, so they are four columns:
            the band is one of the two places on this page where the width is
            actually used for something, and a row of four reads as a set
            where a stack reads as a list that happens to have ended. */}
        <section className="abt-band abt-recess abt-mission">
          <div className="abt-in abt-wide">
            <h2>{L(T.missionH)}</h2>
            <ul>
              {T.mission[locale].map((m, i) => (
                <li key={m}>
                  {/* Лічить, не називає — як номери частин в огляді рішення,
                      і так само схований від читача з екранним диктором. */}
                  <b aria-hidden="true">{String(i + 1).padStart(2, "0")}</b>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The head of the Centre, in her own words, given a band.

            Owner's request: set the quotation apart. It was a paragraph with a
            gold rule down its left side inside the reading column, which is
            how this site marks a citation inside prose — correct for a
            sentence quoted mid-argument, and too quiet for the one place on
            the page where a person speaks. This is the treatment the home
            page gives the Court's words: a dark band, the display face, the
            lit seam across the join, the attribution set apart underneath.

            An island, per DESIGN.md — the recessed mission above it and the
            roster on paper below, so no two dark grounds meet. */}
        <figure className="abt-band abt-dark abt-quote">
          <span className="abt-seam" aria-hidden="true" />
          <div className="abt-in">
            <blockquote>{L(T.voice)}</blockquote>
            <figcaption>
              <b>{L(T.voiceBy)}</b>
              <span>{L(T.voiceRole)}</span>
            </figcaption>
          </div>
        </figure>

        {/* The team, on this page as well as on its own.

            Owner's edit: «Команду продублювати у розділ ПРО НАС». A roster of
            names and roles read off `content/team.ts`, so the two lists cannot
            drift, with the link to the portraits under it. Not a copy of
            /team: that page gives everyone a portrait and the room a portrait
            needs. Across the rail rather than inside the measure — seven
            people in two columns is a long list, and in four it is a masthead. */}
        <section className="abt-band abt-team">
          <div className="abt-in abt-wide">
            {/* Шлях на сторінку команди — в рядку заголовка, як у макеті.
                Доти він стояв під списком із семи людей, тобто читач
                діставав його вже після того, як прочитав усіх. */}
            <div className="abt-h-row">
              <h2>{L(T.teamH)}</h2>
              <Link className="abt-h-link" href={`/${locale}/team`}>
                {L(T.teamLink)} →
              </Link>
            </div>
            {/* За ролями, а не суцільним списком. Власниця: «погрупуй по
                ролях». Сім рядків «ім'я — посада» читалися як реєстр, у
                якому та сама посада повторювалася двічі поспіль і щоразу
                іншим родом; тепер посада сказана раз, над своїми людьми, а
                рядок несе лише ім'я.

                Групування по `role.en`: українська посада гендерована —
                «Старший дослідник» і «Старша дослідниця» — і розвела б
                кожну пару, яку групування й існує, щоб звести. */}
            <div className="abt-roles">
              {roleGroups.map((g) => (
                <div className="abt-role" key={g.key}>
                  <p className="abt-role-h">{L(g.label)}</p>
                  <ul className="abt-roster">
                    {g.members.map((m) => (
                      <li key={m.name.en}>
                        <b>{L(m.name)}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The partner row — removed, owner's decision ──────────────────
            «Партнерів залиш лише на головній». The same marks stood on the
            home page, here, and on a page of their own. */}

        <section className="abt-band abt-recess">
          <div className="abt-in">
            <h2>{L(T.contactH)}</h2>
            <div className="abt-prose">
              <p>{L(T.contact)}</p>
            </div>
            {/* The pill and nothing under it.

                The address used to sit below it in the mono face, as a fact
                for a reader who would rather copy it than open a mail client.
                Owner's decision to take it off, and the page agrees: the
                heading says «Написати нам», the pill says it again and links
                the address, and the address itself said it a third time — and
                the footer of this very page carries the same line under
                «Контакти». Three copies of one address on one screen. */}
            {/* The button says «Написати нам».

                It carried the address itself for a while, on the reasoning
                that a control repeating its own heading names nothing. The
                owner's decision is that the button is a button and should say
                what pressing it does; the address belongs in the footer,
                where it is, and not on the control. The heading above stays
                as the section's name.

                What does not come back is the third copy: the address used to
                sit under this pill as a line of its own as well. */}
            <p className="abt-action">
              <a className="nsv-cta" href={`mailto:${dict.footer.email}`}>
                {L(T.contactH)}
                <span className="nsv-cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

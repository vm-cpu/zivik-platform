import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./icc-ukraine.verbatim.json";
import verbatimUk from "./icc-ukraine.uk.json";

/**
 * Situation in Ukraine, ICC-01/22 — the investigation and the six warrants of
 * arrest issued by Pre-Trial Chamber II (17 March 2023, 5 March 2024,
 * 24 June 2024).
 *
 * ── Verifying this file when icc-cpi.int will not answer ───────────────────
 * The Court's site sits behind a Cloudflare rule that refuses automated
 * fetches, curl and a real browser alike ("Sorry, you have been blocked").
 * The way through is the Internet Archive's captures of the Court's own
 * pages — the ICC's text, not a secondary account of it:
 *
 *     http://archive.org/wayback/available?url=icc-cpi.int/situations/ukraine
 *     curl -sL --compressed "http://web.archive.org/web/<ts>id_/<url>"
 *
 * `--compressed` matters; without it the body comes back as gzip and reads as
 * binary noise. `id_` after the timestamp asks for the original bytes rather
 * than the archive's rewritten page.
 *
 * Checked this way on 27 August 2026, against captures of 25 and 15 August:
 * the situation number, Pre-Trial Chamber II and its three judges, "referred
 * to the ICC by 43 States Parties: March - April 2022", the 21 November 2013
 * scope, all three warrant dates and all six names, and every Rome Statute
 * article cited below — 8(2)(a)(vii), 8(2)(b)(viii), 8(2)(b)(ii), 8(2)(b)(iv),
 * 7(1)(k), 25(3)(a), 25(3)(b), 28(a), 28(b).
 *
 * The two figures that looked like staleness risks are both right, and both
 * were worth checking rather than assuming:
 *   - 125 States Parties. The Assembly's own page, captured 15 August 2026 —
 *     six days before this file's `asOf` — reads "125 countries are States
 *     Parties", its regional breakdown sums to 125 (33+19+20+28+25), and
 *     Hungary is still on the list despite its announced withdrawal.
 *   - Karim Khan led the OTP 2022-2025. The Office's page, captured 23 August
 *     2026, has it "under the leadership of Deputy Prosecutors Mame Mandiaye
 *     Niang and Nazhat Shameem Khan, pending any future decisions". Note the
 *     trap: that second Khan is a different person, from Fiji.
 *
 * Both non-cooperation findings are verified too, and the second was missing
 * from this file entirely. The Assembly's own non-cooperation register lists,
 * for this situation, "Finding under article 87(7) … on the non-compliance by
 * Mongolia … and referral to the Assembly of States Parties", ICC-01/22-90,
 * 24-10-2024. The Tajikistan finding is ICC-01/22-143 of 19 March 2026,
 * referred to the Assembly through the Presidency — it postdates the register
 * capture by eight days, which is why a first pass found no trace of it.
 *
 * "No suspect in custody" is verified too, and by the Court rather than by
 * inference: the defendant page for Vladimir Vladimirovich Putin, captured
 * 21 August 2026 — this file's own `asOf` — carries the status "At large".
 * Only that page has a capture; the other five rest on the same footing, that
 * no case in this situation has reached a trial phase and the Court holds no
 * trials in absentia (article 63(1) of the Statute).
 *
 * Nothing in this file is now unverified.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source
 * document. The visualization layer below follows two rules:
 *
 *  1. Everything inside the warrant wall, the verdict rows and the jurisdiction
 *     timeline restates the verbatim text or an ICC document linked from it.
 *  2. Context the summary does not carry — Mongolia's non-arrest, Ukraine's
 *     ratification mechanics, the scale figures, Russia's retaliation, the
 *     aggression tribunal — is marked as context (`kind: "context"`, or an
 *     explicit caveat in the note) and every item cites its source in
 *     `sources`. The full research trail lives in
 *     docs/research/icc-ukraine-sources.md.
 *
 * An ICC situation page differs from a judgment page: there is no dispositif
 * and no verdict on guilt — a warrant states "reasonable grounds to believe",
 * nothing more. The chrome says so wherever a reader could mistake a warrant
 * for a conviction.
 */
export const iccUkraine: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  asOf: "2026-08-21",

  title: {
    uk: "Ситуація в Україні",
    en: "Situation in Ukraine",
  },
  /* The masthead in Ukrainian — the caption under the title and the line
     in the eyebrow. `masthead` keeps the decision's own English, which is
     what the citation block reproduces; this is what a Ukrainian reader
     sees at the top of the page. See `mastheadUk` in summaries/types.ts. */
  mastheadUk: {
    official:
      "Ситуація в Україні, ICC-01/22 — розслідування та ордери на арешт, видані Палатою попереднього провадження II",
    judgment: "Ордери від 17 березня 2023 · 5 березня 2024 · 24 червня 2024",
  },

  forum: {
    institution: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" },
    seat: { uk: "Гаага", en: "The Hague" },
  },

  /* Search-result description. `plain.tldr` used to serve as this and runs
     three to four sentences, so the snippet was cut off mid-word. */
  metaDesc: {
    uk: "Ситуація в Україні (ICC-01/22): розслідування МКС і шість ордерів на арешт — за депортацію дітей і ракетну кампанію проти енергосистеми.",
    en: "Situation in Ukraine (ICC-01/22): the ICC investigation and six arrest warrants — over the deportation of children and the strikes on the power grid.",
  },

  plain: {
    tldr: {
      uk: "Міжнародний кримінальний суд розслідує воєнні злочини, злочини проти людяності та геноцид на території України з 2013 року. Судді видали шість ордерів на арешт: Путіну і Львовій-Бєловій — за депортацію українських дітей, чотирьом вищим військовим командувачам — за ракетну кампанію проти енергосистеми. Це не вирок: ордер означає обґрунтовану підозру, а судити МКС може лише тих, кого заарештують.",
      en: "The International Criminal Court is investigating war crimes, crimes against humanity and genocide on the territory of Ukraine since 2013. Its judges have issued six arrest warrants: for Putin and Lvova-Belova over the deportation of Ukrainian children, and for four top military commanders over the missile campaign against the power grid. None of this is a verdict: a warrant means reasonable grounds to believe, and the ICC can only try a person it has in custody.",
    },
    whyMatters: {
      uk: "Уперше під ордером МКС — глава держави, що є постійним членом Ради Безпеки ООН. 125 держав-учасниць Римського статуту юридично зобов'язані заарештувати підозрюваних на своїй території. Ордери вже звузили світ для фігурантів і стали правовою основою для повернення депортованих дітей.",
      en: "For the first time, the head of state of a permanent member of the UN Security Council is under an ICC warrant. The 125 States Parties to the Rome Statute are legally bound to arrest the suspects on their territory. The warrants have already shrunk the suspects' world and anchor the legal case for returning the deported children.",
    },
  },

  glossary: [
    {
      term: { uk: "Римський статут", en: "Rome Statute" },
      def: {
        uk: "Договір 1998 року, що заснував МКС. Визначає чотири злочини: геноцид, злочини проти людяності, воєнні злочини та злочин агресії.",
        en: "The 1998 treaty that created the ICC. It defines four crimes: genocide, crimes against humanity, war crimes and the crime of aggression.",
      },
    },
    {
      term: { uk: "Ордер на арешт", en: "Warrant of arrest" },
      def: {
        uk: "Наказ суддів затримати підозрюваного. Видається, коли є «обґрунтовані підстави вважати» причетність до злочину. Це не визнання вини — вирок можливий лише після судового процесу.",
        en: "A judicial order to detain a suspect, issued on \"reasonable grounds to believe\" they are responsible for a crime. It is not a finding of guilt — that can come only after trial.",
      },
    },
    {
      term: { uk: "Палата досудового провадження II", en: "Pre-Trial Chamber II" },
      def: {
        uk: "Колегія суддів МКС, яка на стадії розслідування вирішує, чи видавати ордери та чи достатньо доказів для суду.",
        en: "The ICC bench that, at the investigation stage, decides whether to issue warrants and whether the evidence suffices for trial.",
      },
    },
    {
      term: { uk: "Стаття 12(3)", en: "Article 12(3)" },
      def: {
        uk: "Механізм, яким держава — не член МКС може разово визнати юрисдикцію Суду щодо злочинів на своїй території. Україна скористалася ним двічі — у 2014 і 2015 роках.",
        en: "The mechanism by which a non-member State can accept the Court's jurisdiction over crimes on its territory. Ukraine used it twice, in 2014 and 2015.",
      },
    },
    {
      term: { uk: "Воєнний злочин", en: "War crime" },
      def: {
        uk: "Серйозне порушення законів війни: напади на цивільних і цивільні об'єкти, депортація населення, катування (ст. 8 Статуту).",
        en: "A serious violation of the laws of war: attacks on civilians and civilian objects, deportation, torture (art. 8 of the Statute).",
      },
    },
    {
      term: { uk: "Злочин проти людяності", en: "Crime against humanity" },
      def: {
        uk: "Нелюдські діяння, вчинені в межах широкомасштабного або систематичного нападу на цивільне населення (ст. 7 Статуту).",
        en: "Inhumane acts committed as part of a widespread or systematic attack on a civilian population (art. 7 of the Statute).",
      },
    },
    {
      term: { uk: "Командна відповідальність", en: "Superior responsibility" },
      def: {
        uk: "Стаття 28 Статуту: командир або цивільний керівник відповідає за злочини підлеглих, якщо не запобіг їм і не покарав за них.",
        en: "Article 28 of the Statute: a commander or civilian superior is liable for subordinates' crimes they failed to prevent or punish.",
      },
    },
    {
      term: { uk: "Асамблея держав-учасниць", en: "Assembly of States Parties" },
      def: {
        uk: "«Парламент» МКС — представники всіх 125 держав-членів. Саме їй Суд передає питання про невиконання державою обов'язку арешту.",
        en: "The ICC's \"parliament\" of all 125 member States. Non-compliance with an arrest obligation is referred to it.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" },
      role: {
        uk: "Постійний суд у Гаазі, що судить осіб (не держави) за найтяжчі міжнародні злочини.",
        en: "The permanent court in The Hague that tries individuals — not States — for the gravest international crimes.",
      },
      kind: "court",
    },
    {
      name: { uk: "Офіс Прокурора МКС", en: "Office of the Prosecutor" },
      role: {
        uk: "Веде розслідування ситуації в Україні; у 2022–2025 роках його очолював Карім Хан.",
        en: "Runs the Ukraine investigation; led in 2022–2025 by Karim Khan.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Палата досудового провадження II", en: "Pre-Trial Chamber II" },
      role: {
        uk: "Видала всі шість ордерів і констатувала невиконання обов'язку арешту Монголією (2024) і Таджикистаном (2026).",
        /* Both findings, in both locales. The Ukrainian side named Mongolia and
           Tajikistan; the English side named only Mongolia, so a reader of the
           English page met the second finding in the chronology below without
           ever having been told the Chamber made it. */
        en: "Issued all six warrants and found the failures to arrest by Mongolia (2024) and Tajikistan (2026).",
      },
      kind: "court",
    },
    {
      name: { uk: "Україна", en: "Ukraine" },
      role: {
        uk: "Держава території злочинів. Двічі визнавала юрисдикцію Суду (2014, 2015), з 1 січня 2025 року — 125-та держава-учасниця.",
        en: "The territorial State. It accepted the Court's jurisdiction twice (2014, 2015) and became the 125th State Party on 1 January 2025.",
      },
      kind: "party",
    },
    {
      name: { uk: "Російська Федерація", en: "Russian Federation" },
      role: {
        uk: "Не є учасницею Статуту, юрисдикцію не визнає. У відповідь порушила кримінальні справи проти прокурора та суддів МКС.",
        en: "Not a party to the Statute and rejects the Court's jurisdiction. It responded with criminal cases against the ICC's Prosecutor and judges.",
      },
      kind: "party",
    },
    {
      name: { uk: "Шість підозрюваних", en: "The six suspects" },
      role: {
        uk: "Путін, Львова-Бєлова, Кобилаш, Соколов, Шойгу, Герасимов. Жоден не під вартою; МКС не судить заочно.",
        en: "Putin, Lvova-Belova, Kobylash, Sokolov, Shoigu, Gerasimov. None is in custody; the ICC does not try in absentia.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: {
        uk: "Ордер означає, що Путін уже визнаний винним?",
        en: "Does the warrant mean Putin has been found guilty?",
      },
      a: {
        uk: "Ні. Ордер — це висновок суддів, що є «обґрунтовані підстави вважати» причетність до злочинів. Вина встановлюється лише вироком після повного процесу, а МКС не судить за відсутності обвинуваченого — тож процес можливий тільки після арешту чи добровільної явки.",
        en: "No. A warrant is a judicial finding of \"reasonable grounds to believe\". Guilt can be established only by a judgment after a full trial, and the ICC does not try in absentia — so a trial requires arrest or surrender.",
      },
    },
    {
      q: { uk: "Хто зобов'язаний його заарештувати?", en: "Who is obliged to arrest him?" },
      a: {
        uk: "Усі 125 держав-учасниць Римського статуту, щойно підозрюваний опиниться на їхній території. Практика поки інша, і двічі Суд це зафіксував: у вересні 2024 року Монголія прийняла Путіна без арешту, у жовтні 2025-го — Таджикистан, і щодо обох Палата досудового провадження II ухвалила констатацію за статтею 87(7) з передачею Асамблеї держав-учасниць (ICC-01/22-90 від 24.10.2024 і ICC-01/22-143 від 19.03.2026). До Південної Африки на саміт БРІКС-2023 Путін натомість не поїхав.",
        en: "All 125 States Parties to the Rome Statute, the moment a suspect enters their territory. Practice has lagged: in September 2024 Mongolia hosted Putin without arresting him — Pre-Trial Chamber II found a breach and referred it to the Assembly of States Parties; Tajikistan did the same in October 2025. Putin chose not to travel to South Africa for the 2023 BRICS summit.",
      },
    },
    {
      q: {
        uk: "Чи захищає Путіна імунітет глави держави?",
        en: "Doesn't head-of-state immunity protect Putin?",
      },
      a: {
        uk: "Перед МКС — ні. У рішенні щодо Монголії від 24 жовтня 2024 року Палата підтвердила: персональні імунітети, включно з імунітетом глави держави, не діють перед Судом, і держави-учасниці зобов'язані виконувати ордери незалежно від посади підозрюваного.",
        en: "Not before the ICC. In its Mongolia decision of 24 October 2024 the Chamber reaffirmed that personal immunities, including that of a Head of State, are not opposable before the Court, and States Parties must execute warrants regardless of official capacity.",
      },
    },
    {
      q: { uk: "Про скільки дітей ідеться?", en: "How many children are at stake?" },
      a: {
        uk: "Офіційна українська база «Діти війни» налічує понад 19,5 тисячі депортованих чи примусово переміщених дітей; станом на грудень 2025 року повернути вдалося 1 859. Оцінки омбудсменів сягають 150–300 тисяч. Це дані поза матеріалами Суду — ордери самі кількість не називають.",
        en: "Ukraine's official \"Children of War\" database counts more than 19,500 deported or forcibly transferred children; as of December 2025, 1,859 had been returned. Ombudspersons' estimates run to 150,000–300,000. These are figures from outside the Court's record — the warrants themselves state no number.",
      },
    },
    {
      q: { uk: "Як відповіла Росія?", en: "How has Russia responded?" },
      a: {
        uk: "Дзеркальними переслідуваннями: порушила кримінальні справи проти прокурора Каріма Хана і суддів МКС, а в грудні 2025 року московський суд заочно засудив Хана та вісьмох суддів, включно з президенткою Суду Томоко Аканє, до 3,5–15 років. Спецдоповідачі ООН зажадали припинити ці репресії.",
        en: "With mirror prosecutions: it opened criminal cases against Prosecutor Karim Khan and ICC judges, and in December 2025 a Moscow court sentenced Khan and eight judges — including Court President Tomoko Akane — in absentia to 3.5–15 years. UN Special Rapporteurs have demanded Russia end the reprisals.",
      },
    },
    {
      q: {
        uk: "А хто судитиме за сам напад на Україну?",
        en: "And who will try the invasion itself?",
      },
      a: {
        uk: "Не МКС: щодо злочину агресії його юрисдикція в цій ситуації обмежена, бо Росія не є учасницею Статуту. Цю прогалину закриває Спеціальний трибунал щодо злочину агресії, угоду про який Україна і Рада Європи підписали 25 червня 2025 року.",
        en: "Not the ICC: its jurisdiction over the crime of aggression is blocked here because Russia is not a party to the Statute. That gap is being closed by the Special Tribunal for the Crime of Aggression, whose founding agreement Ukraine and the Council of Europe signed on 25 June 2025.",
      },
    },
  ],

  related: [
    {
      label: {
        uk: "Звинувачення у геноциді (Україна проти РФ)",
        en: "Allegations of Genocide (Ukraine v. Russian Federation)",
      },
      note: { uk: "МС ООН · держави, не особи", en: "ICJ · States, not individuals" },
      href: "/cases/icj-genocide",
    },
    {
      label: {
        uk: "МКБФТ і МКЛРД (Україна проти РФ)",
        en: "ICSFT and CERD (Ukraine v. Russian Federation)",
      },
      note: { uk: "МС ООН · Крим і Донбас", en: "ICJ · Crimea and Donbas" },
      href: "/cases/icj-cerd-icsft",
    },
    {
      label: { uk: "Ощадбанк проти РФ", en: "Oschadbank v. Russian Federation" },
      note: { uk: "PCA · інвестиційний арбітраж", en: "PCA · investment arbitration" },
      href: "/cases/oschadbank",
    },
  ],

  judgment: {
    court: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" },
    url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-vladimir-vladimirovich-putin-and",
    caseUrl: "https://www.icc-cpi.int/ukraine",
    date: "2023-03-17",
    readLabel: { uk: "Заява Суду про перші ордери", en: "The Court on the first warrants" },
    fileLabel: { uk: "Ситуація на сайті МКС", en: "The situation at the ICC" },
  },

  instruments: [
    {
      abbr: "Rome Statute",
      name: {
        uk: "Римський статут Міжнародного кримінального суду",
        en: "Rome Statute of the International Criminal Court",
      },
      year: 1998,
      url: "https://www.icc-cpi.int/sites/default/files/RS-Eng.pdf",
    },
  ],

  stats: [
    { value: "6", label: { uk: "ордерів на арешт", en: "arrest warrants" } },
    { value: "43", label: { uk: "держави передали ситуацію Суду", en: "States referred the situation" } },
    { value: "125", label: { uk: "держав зобов'язані виконати ордери", en: "States bound to execute the warrants" } },
    {
      value: "0",
      label: { uk: "підозрюваних під вартою", en: "suspects in custody" },
      em: true,
    },
  ],

  glance: [
    { label: { uk: "Ситуація", en: "Situation" }, value: { uk: "Україна", en: "Ukraine" } },
    {
      label: { uk: "Орган", en: "Chamber" },
      value: { uk: "Палата досудового провадження II", en: "Pre-Trial Chamber II" },
    },
    { label: { uk: "Місце", en: "Seat" }, value: { uk: "Гаага", en: "The Hague" } },
    { label: { uk: "Номер", en: "Number" }, value: { uk: "ICC-01/22", en: "ICC-01/22" } },
    {
      label: { uk: "Охоплення", en: "Scope" },
      value: {
        uk: "Злочини на території України з 21.11.2013",
        en: "Crimes on Ukraine's territory since 21 Nov 2013",
      },
    },
    {
      label: { uk: "Ордери", en: "Warrants" },
      value: { uk: "17.03.2023 · 05.03.2024 · 24.06.2024", en: "17 Mar 2023 · 5 Mar 2024 · 24 Jun 2024" },
    },
  ],

  timelineTracks: [
    { id: "jurisdiction", label: { uk: "Юрисдикція", en: "Jurisdiction" } },
    { id: "investigation", label: { uk: "Розслідування", en: "Investigation" } },
    { id: "warrants", label: { uk: "Ордери", en: "Warrants" } },
    { id: "cooperation", label: { uk: "Виконання", en: "Enforcement" } },
  ],

  timeline: [
    {
      date: { uk: "9 квіт. 2014", en: "9 Apr 2014" },
      iso: "2014-04-09",
      track: "jurisdiction",
      kind: "filing",
      label: {
        uk: "Перша заява України за ст. 12(3): юрисдикція щодо Майдану",
        en: "Ukraine's first art. 12(3) declaration: the Maidan period",
      },
      note: {
        uk: "Визнала юрисдикцію МКС щодо злочинів на території України з 21 листопада 2013 до 22 лютого 2014 року.",
        en: "Accepted ICC jurisdiction over crimes on Ukrainian territory from 21 November 2013 to 22 February 2014.",
      },
    },
    {
      date: { uk: "8 вер. 2015", en: "8 Sep 2015" },
      iso: "2015-09-08",
      track: "jurisdiction",
      kind: "filing",
      label: {
        uk: "Друга заява: юрисдикція безстроково з 20 лютого 2014",
        en: "Second declaration: open-ended jurisdiction from 20 February 2014",
      },
      note: {
        uk: "Розширила визнання юрисдикції на всі подальші злочини по всій території України.",
        en: "Extended the acceptance to all ongoing crimes throughout the territory of Ukraine.",
      },
    },
    {
      date: { uk: "11 груд. 2020", en: "11 Dec 2020" },
      iso: "2020-12-11",
      track: "investigation",
      kind: "context",
      label: {
        uk: "Попереднє вивчення завершено: є підстави для розслідування",
        en: "Preliminary examination concludes there is a basis to investigate",
      },
      note: {
        uk: "Офіс Прокурора дійшов висновку, що критерії Статуту для відкриття розслідування виконані.",
        en: "The Office of the Prosecutor found the Statute's criteria for an investigation satisfied.",
      },
    },
    {
      date: { uk: "28 лют. 2022", en: "28 Feb 2022" },
      iso: "2022-02-28",
      track: "investigation",
      kind: "order",
      label: {
        uk: "Прокурор оголошує намір відкрити розслідування",
        en: "The Prosecutor announces he will seek an investigation",
      },
      note: {
        uk: "Через чотири дні після початку повномасштабного вторгнення, на основі висновків попереднього вивчення.",
        en: "Four days into the full-scale invasion, on the strength of the preliminary-examination findings.",
      },
    },
    {
      date: { uk: "1–2 бер. 2022", en: "1–2 Mar 2022" },
      iso: "2022-03-01",
      track: "investigation",
      kind: "order",
      label: {
        uk: "39 держав передають ситуацію; розслідування відкрито",
        en: "39 States refer the situation; the investigation opens",
      },
      note: {
        uk: "Звернення Литви і спільне звернення 38 держав дозволили відкрити розслідування без судового дозволу. З Японією, Північною Македонією, Чорногорією та Чилі звернень стало 43.",
        en: "Lithuania's referral and a joint referral by 38 States let the investigation open without judicial authorisation. Japan, North Macedonia, Montenegro and Chile brought the total to 43.",
      },
    },
    {
      date: { uk: "17 бер. 2023", en: "17 Mar 2023" },
      iso: "2023-03-17",
      track: "warrants",
      kind: "judgment",
      label: {
        uk: "Ордери Путіну та Львовій-Бєловій — депортація дітей",
        en: "Warrants for Putin and Lvova-Belova — deportation of children",
      },
      note: {
        uk: "Уперше під ордером МКС — глава держави, що є постійним членом Ради Безпеки ООН; лише вдруге в історії Суду — чинний глава держави (після аль-Башира у 2009 році).",
        en: "The first ICC warrant against the head of state of a permanent Security Council member; only the second ever against a sitting head of state, after Al-Bashir in 2009.",
      },
    },
    {
      date: { uk: "5 бер. 2024", en: "5 Mar 2024" },
      iso: "2024-03-05",
      track: "warrants",
      kind: "judgment",
      label: {
        uk: "Ордери Кобилашу та Соколову — удари по енергосистемі",
        en: "Warrants for Kobylash and Sokolov — strikes on the power grid",
      },
      note: {
        uk: "Командувачі дальньої авіації та Чорноморського флоту — за ракетні удари по українській електроінфраструктурі.",
        en: "The commanders of Long-Range Aviation and of the Black Sea Fleet, over missile strikes against Ukraine's electric infrastructure.",
      },
    },
    {
      date: { uk: "24 черв. 2024", en: "24 Jun 2024" },
      iso: "2024-06-24",
      track: "warrants",
      kind: "judgment",
      label: {
        uk: "Ордери Шойгу та Герасимову — вершина командної вертикалі",
        en: "Warrants for Shoigu and Gerasimov — the top of the chain of command",
      },
      note: {
        uk: "Міністр оборони і начальник Генштабу — за ту саму кампанію проти енергосистеми (щонайменше 10.10.2022 — 09.03.2023).",
        en: "The Defence Minister and the Chief of the General Staff, for the same campaign against the grid (at least 10 Oct 2022 – 9 Mar 2023).",
      },
    },
    {
      date: { uk: "3 вер. 2024", en: "3 Sep 2024" },
      iso: "2024-09-03",
      track: "cooperation",
      kind: "context",
      label: {
        uk: "Монголія приймає Путіна без арешту",
        en: "Mongolia hosts Putin without arresting him",
      },
      note: {
        uk: "Перший візит Путіна до держави-учасниці МКС після видання ордера.",
        en: "Putin's first visit to an ICC State Party after the warrant issued.",
      },
    },
    {
      date: { uk: "24 жовт. 2024", en: "24 Oct 2024" },
      iso: "2024-10-24",
      track: "cooperation",
      kind: "order",
      label: {
        uk: "Палата констатує порушення Монголією обов'язку арешту",
        en: "The Chamber finds Mongolia failed its duty to arrest",
      },
      note: {
        uk: "Питання передано Асамблеї держав-учасниць. Палата підтвердила: імунітет глави держави перед МКС не діє.",
        en: "The matter was referred to the Assembly of States Parties. The Chamber reaffirmed that head-of-state immunity is not opposable before the ICC.",
      },
    },
    {
      date: { uk: "1 січ. 2025", en: "1 Jan 2025" },
      iso: "2025-01-01",
      track: "jurisdiction",
      kind: "judgment",
      label: {
        uk: "Україна — 125-та держава-учасниця Римського статуту",
        en: "Ukraine becomes the 125th State Party to the Rome Statute",
      },
      note: {
        uk: "Ратифікаційну грамоту здано 25 жовтня 2024 року. Україна зробила заяву за ст. 124: сім років не визнає юрисдикцію щодо воєнних злочинів, імовірно вчинених власними громадянами.",
        en: "The instrument of ratification was deposited on 25 October 2024, with an art. 124 declaration: for seven years Ukraine does not accept jurisdiction over war crimes likely committed by its own nationals.",
      },
    },
    {
      date: { uk: "25 черв. 2025", en: "25 Jun 2025" },
      iso: "2025-06-25",
      track: "cooperation",
      kind: "context",
      label: {
        uk: "Підписано угоду про Спецтрибунал щодо злочину агресії",
        en: "The Special Tribunal for the Crime of Aggression is agreed",
      },
      note: {
        uk: "Україна і Рада Європи закривають прогалину: щодо агресії юрисдикція МКС у цій ситуації обмежена, бо РФ не є учасницею Статуту.",
        en: "Ukraine and the Council of Europe close the gap the ICC cannot: its aggression jurisdiction is blocked because Russia is not a party to the Statute.",
      },
    },
    {
      date: { uk: "жовт.–груд. 2025", en: "Oct–Dec 2025" },
      iso: "2025-12-12",
      track: "cooperation",
      kind: "context",
      label: {
        uk: "Таджикистан не виконує ордер; Росія заочно «засуджує» прокурора і суддів МКС",
        en: "Tajikistan fails to arrest; Russia \"sentences\" the ICC's Prosecutor and judges in absentia",
      },
      note: {
        uk: "Путін прибув до Душанбе 9 жовтня 2025 року на саміт СНД; Таджикистан — держава-учасниця Статуту — його не заарештував, пославшись на зобов'язання в межах СНД щодо імунітету глав держав. Того ж кварталу московський суд заочно призначив Каріму Хану та вісьмом суддям МКС від 3,5 до 15 років; спецдоповідачі ООН зажадали припинити репресії.",
        en: "Putin arrived in Dushanbe on 9 October 2025 for a CIS summit; Tajikistan, a State Party, did not arrest him, citing CIS undertakings on head-of-State immunity. In the same quarter a Moscow court handed Karim Khan and eight ICC judges 3.5 to 15 years in absentia; UN Special Rapporteurs demanded the reprisals end.",
      },
    },
    {
      /* The second article 87(7) finding in this situation, and it was missing
         here: the page had Tajikistan's failure to arrest but not the Court's
         response to it, which is the part that carries legal weight. Same
         instrument as the Mongolia finding of 24 October 2024, referred to the
         Assembly the same way — see ICC-01/22-143 and the Presidency's referral
         notice. */
      date: { uk: "19 берез. 2026", en: "19 Mar 2026" },
      iso: "2026-03-19",
      track: "cooperation",
      kind: "order",
      label: {
        uk: "Палата констатує порушення Таджикистаном обов'язку арешту",
        en: "The Chamber finds Tajikistan failed to arrest",
      },
      note: {
        uk: "Палата досудового провадження II за статтею 87(7) Статуту констатувала, що Таджикистан не виконав запит про арешт і передачу Путіна, і передала питання Асамблеї держав-учасниць через Президію Суду (ICC-01/22-143). Друга така констатація в цій ситуації після монгольської.",
        en: "Pre-Trial Chamber II found under article 87(7) that Tajikistan failed to execute the request to arrest and surrender Mr Putin, and referred the matter to the Assembly of States Parties through the Presidency (ICC-01/22-143). The second such finding in this situation after Mongolia's.",
      },
    },
  ],

  verdictsHeading: { uk: "Що вирішила Палата", en: "What the Chamber decided" },

  verdicts: [
    {
      track: "17.03.2023",
      trackLabel: { uk: "Перша хвиля · 17 березня 2023", en: "First wave · 17 March 2023" },
      claim: {
        uk: "Путін і Львова-Бєлова: депортація та незаконне переміщення дітей",
        en: "Putin and Lvova-Belova: deportation and unlawful transfer of children",
      },
      outcome: "granted",
    },
    {
      track: "05.03.2024",
      trackLabel: { uk: "Друга хвиля · 5 березня 2024", en: "Second wave · 5 March 2024" },
      claim: {
        uk: "Кобилаш і Соколов: напади на цивільні об'єкти, надмірна шкода, нелюдські діяння",
        en: "Kobylash and Sokolov: attacks on civilian objects, excessive harm, inhumane acts",
      },
      outcome: "granted",
    },
    {
      track: "24.06.2024",
      trackLabel: { uk: "Третя хвиля · 24 червня 2024", en: "Third wave · 24 June 2024" },
      claim: {
        uk: "Шойгу і Герасимов: ті самі звинувачення на рівні міністра оборони та Генштабу",
        en: "Shoigu and Gerasimov: the same charges at Defence-Ministry and General-Staff level",
      },
      outcome: "granted",
    },
    {
      track: "24.10.2024",
      trackLabel: { uk: "Виконання · 24 жовтня 2024", en: "Enforcement · 24 October 2024" },
      claim: {
        uk: "Монголія порушила обов'язок заарештувати Путіна; імунітет глави держави перед МКС не діє",
        en: "Mongolia breached its duty to arrest Putin; head-of-state immunity is not opposable before the ICC",
      },
      outcome: "violation",
    },
    /* The matrix stopped at Mongolia while the prose, the chronology and the
       takings tile all counted two article 87(7) findings — so the one panel
       that is meant to enumerate what the Chamber decided was the one panel
       that disagreed with the rest of the page. The second finding is
       ICC-01/22-143 of 19 March 2026, "Finding under article 87(7) of the Rome
       Statute on the non-compliance by Tajikistan with the request by the Court
       to cooperate in the arrest and surrender of Vladimir Vladimirovich Putin
       and referral to the Assembly of States Parties" (Pre-Trial Chamber II);
       the Presidency referred it on to the Assembly on 7 May 2026 under
       regulation 109(4). The track is keyed to the day of the finding, which is
       the chronology entry it links down to — not to Putin's 9 October 2025
       visit, which is the non-arrest and not the decision. */
    {
      track: "19.03.2026",
      trackLabel: { uk: "Виконання · 19 березня 2026", en: "Enforcement · 19 March 2026" },
      claim: {
        uk: "Таджикистан не виконав запит про арешт і передачу Путіна; питання передано Асамблеї держав-учасниць",
        en: "Tajikistan failed to execute the request to arrest and surrender Putin; referred to the Assembly of States Parties",
      },
      outcome: "violation",
    },
  ],

  mapFocus: { forumKey: "hague", reachTo: "kyiv" },

  theatres: [
    {
      place: { uk: "Окуповані території", en: "Occupied territories" },
      tag: { uk: "ДІТИ", en: "CHILDREN" },
      markerKeys: ["crimea", "donetsk", "luhansk"],
      areas: ["crimea", "east"],
      // keep the caption clear of the three markers it points at
      summary: {
        uk: "Депортація та незаконне переміщення українських дітей до РФ — перша хвиля ордерів.",
        en: "Deportation and unlawful transfer of Ukrainian children to Russia — the first wave of warrants.",
      },
    },
    {
      place: { uk: "Енергосистема України", en: "Ukraine's power grid" },
      tag: { uk: "ЕНЕРГОСИСТЕМА", en: "POWER GRID" },
      markerKeys: ["kyiv"],
      areas: ["country"],
      // lift the label clear of the Kyiv marker and its city caption
      summary: {
        uk: "Ракетна кампанія проти електроінфраструктури по всій країні — друга і третя хвилі.",
        en: "The missile campaign against electric infrastructure nationwide — the second and third waves.",
      },
    },
  ],

  warrants: {
    heading: { uk: "Шість ордерів — одна вертикаль влади", en: "Six warrants, one vertical of power" },
    rungs: [
      { uk: "Глава держави", en: "Head of state" },
      { uk: "Офіс Президента", en: "Presidential office" },
      { uk: "Міністр оборони і Генштаб", en: "Defence Minister and General Staff" },
      { uk: "Оперативні командувачі", en: "Operational commanders" },
    ],
    note: {
      uk: "Ордери покривають вертикаль командування згори донизу — від верховного головнокомандувача до командувачів авіації та флоту. Колір — лінія звинувачення. Кожен ордер — висновок Палати про «обґрунтовані підстави вважати», не вирок; кожна лінія посилається на офіційне повідомлення Суду.",
      en: "The warrants run down the chain of command — from the commander-in-chief to the commanders of the aviation and the fleet. Colour marks the theory of the case. Each warrant is the Chamber's finding of \"reasonable grounds to believe\", not a verdict; each line links to the Court's own announcement.",
    },
    waves: [
      {
        date: { uk: "17 березня 2023", en: "17 March 2023" },
        iso: "2023-03-17",
        theme: { uk: "Депортація дітей", en: "Deportation of children" },
        summary: {
          uk: "Депортація та незаконне переміщення дітей з окупованих територій України до РФ, щонайменше з 24 лютого 2022 року.",
          en: "Deportation and unlawful transfer of children from occupied areas of Ukraine to Russia, at least from 24 February 2022.",
        },
        url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-vladimir-vladimirovich-putin-and",
        persons: [
          {
            name: { uk: "Владімір Путін", en: "Vladimir Putin" },
            role: { uk: "Президент Російської Федерації", en: "President of the Russian Federation" },
            born: "1952",
            rung: 0,
            charges: [
              {
                art: "8(2)(a)(vii)",
                kind: "war-crime",
                label: { uk: "незаконна депортація населення (дітей)", en: "unlawful deportation of population (children)" },
              },
              {
                art: "8(2)(b)(viii)",
                kind: "war-crime",
                label: { uk: "незаконне переміщення населення (дітей)", en: "unlawful transfer of population (children)" },
              },
            ],
            modes: [
              {
                art: "25(3)(a)",
                label: { uk: "вчинення — особисто, спільно чи через інших", en: "commission — directly, jointly or through others" },
              },
              {
                art: "28(b)",
                label: { uk: "відповідальність керівника за підлеглих", en: "superior responsibility for subordinates" },
              },
            ],
          },
          {
            name: { uk: "Марія Львова-Бєлова", en: "Maria Lvova-Belova" },
            role: {
              uk: "Уповноважена з прав дитини при Президентові РФ",
              en: "Commissioner for Children's Rights in the President's Office",
            },
            born: "1984",
            rung: 1,
            charges: [
              {
                art: "8(2)(a)(vii)",
                kind: "war-crime",
                label: { uk: "незаконна депортація населення (дітей)", en: "unlawful deportation of population (children)" },
              },
              {
                art: "8(2)(b)(viii)",
                kind: "war-crime",
                label: { uk: "незаконне переміщення населення (дітей)", en: "unlawful transfer of population (children)" },
              },
            ],
            modes: [
              {
                art: "25(3)(a)",
                label: { uk: "вчинення — особисто, спільно чи через інших", en: "commission — directly, jointly or through others" },
              },
            ],
          },
        ],
      },
      {
        date: { uk: "5 березня 2024", en: "5 March 2024" },
        iso: "2024-03-05",
        theme: { uk: "Удари по енергосистемі — виконавці", en: "Strikes on the grid — the operators" },
        summary: {
          uk: "Ракетні удари сил під їхнім командуванням по українській електроінфраструктурі.",
          en: "Missile strikes by forces under their command against Ukraine's electric infrastructure.",
        },
        url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-sergei-ivanovich-kobylash-and",
        persons: [
          {
            name: { uk: "Сергій Кобилаш", en: "Sergei Kobylash" },
            role: {
              uk: "Генерал-лейтенант, командувач дальньої авіації",
              en: "Lieutenant General, Commander of Long-Range Aviation",
            },
            born: "1965",
            rung: 3,
            charges: [
              {
                art: "8(2)(b)(ii)",
                kind: "war-crime",
                label: { uk: "спрямування нападів на цивільні об'єкти", en: "directing attacks at civilian objects" },
              },
              {
                art: "8(2)(b)(iv)",
                kind: "war-crime",
                label: { uk: "надмірна випадкова шкода цивільним", en: "excessive incidental harm to civilians" },
              },
              {
                art: "7(1)(k)",
                kind: "cah",
                label: { uk: "нелюдські діяння", en: "inhumane acts" },
              },
            ],
            modes: [
              { art: "25(3)(a)", label: { uk: "вчинення спільно чи через інших", en: "commission jointly or through others" } },
              { art: "25(3)(b)", label: { uk: "віддання наказу", en: "ordering" } },
              { art: "28(a)", label: { uk: "командна відповідальність", en: "command responsibility" } },
            ],
          },
          {
            name: { uk: "Віктор Соколов", en: "Viktor Sokolov" },
            role: { uk: "Адмірал, командувач Чорноморського флоту", en: "Admiral, Commander of the Black Sea Fleet" },
            born: "1962",
            rung: 3,
            charges: [
              {
                art: "8(2)(b)(ii)",
                kind: "war-crime",
                label: { uk: "спрямування нападів на цивільні об'єкти", en: "directing attacks at civilian objects" },
              },
              {
                art: "8(2)(b)(iv)",
                kind: "war-crime",
                label: { uk: "надмірна випадкова шкода цивільним", en: "excessive incidental harm to civilians" },
              },
              {
                art: "7(1)(k)",
                kind: "cah",
                label: { uk: "нелюдські діяння", en: "inhumane acts" },
              },
            ],
            modes: [
              { art: "25(3)(a)", label: { uk: "вчинення спільно чи через інших", en: "commission jointly or through others" } },
              { art: "25(3)(b)", label: { uk: "віддання наказу", en: "ordering" } },
              { art: "28(a)", label: { uk: "командна відповідальність", en: "command responsibility" } },
            ],
          },
        ],
      },
      {
        date: { uk: "24 червня 2024", en: "24 June 2024" },
        iso: "2024-06-24",
        theme: { uk: "Удари по енергосистемі — командна вертикаль", en: "Strikes on the grid — the chain of command" },
        summary: {
          uk: "Та сама кампанія (щонайменше 10.10.2022 — 09.03.2023) на рівні міністра оборони та начальника Генштабу.",
          en: "The same campaign (at least 10 Oct 2022 – 9 Mar 2023) at the level of the Defence Minister and the Chief of the General Staff.",
        },
        url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-sergei-kuzhugetovich-shoigu-and",
        persons: [
          {
            name: { uk: "Сергій Шойгу", en: "Sergei Shoigu" },
            role: { uk: "Міністр оборони РФ на час діянь", en: "Minister of Defence at the time of the conduct" },
            born: "1955",
            rung: 2,
            charges: [
              {
                art: "8(2)(b)(ii)",
                kind: "war-crime",
                label: { uk: "спрямування нападів на цивільні об'єкти", en: "directing attacks at civilian objects" },
              },
              {
                art: "8(2)(b)(iv)",
                kind: "war-crime",
                label: { uk: "надмірна випадкова шкода цивільним", en: "excessive incidental harm to civilians" },
              },
              {
                art: "7(1)(k)",
                kind: "cah",
                label: { uk: "нелюдські діяння", en: "inhumane acts" },
              },
            ],
            modes: [
              { art: "25(3)(a)", label: { uk: "вчинення спільно чи через інших", en: "commission jointly or through others" } },
              { art: "25(3)(b)", label: { uk: "віддання наказу", en: "ordering" } },
              { art: "28", label: { uk: "командна відповідальність", en: "command responsibility" } },
            ],
          },
          {
            name: { uk: "Валерій Герасимов", en: "Valery Gerasimov" },
            role: {
              uk: "Начальник Генштабу ЗС РФ, перший заступник міністра оборони",
              en: "Chief of the General Staff, First Deputy Minister of Defence",
            },
            born: "1955",
            rung: 2,
            charges: [
              {
                art: "8(2)(b)(ii)",
                kind: "war-crime",
                label: { uk: "спрямування нападів на цивільні об'єкти", en: "directing attacks at civilian objects" },
              },
              {
                art: "8(2)(b)(iv)",
                kind: "war-crime",
                label: { uk: "надмірна випадкова шкода цивільним", en: "excessive incidental harm to civilians" },
              },
              {
                art: "7(1)(k)",
                kind: "cah",
                label: { uk: "нелюдські діяння", en: "inhumane acts" },
              },
            ],
            modes: [
              { art: "25(3)(a)", label: { uk: "вчинення спільно чи через інших", en: "commission jointly or through others" } },
              { art: "25(3)(b)", label: { uk: "віддання наказу", en: "ordering" } },
              { art: "28", label: { uk: "командна відповідальність", en: "command responsibility" } },
            ],
          },
        ],
      },
    ],
  },

  takings: {
    heading: { uk: "Масштаб — у цифрах поза Судом", en: "The scale, in figures from outside the Court" },
    note: {
      uk: "Ордери кількість не називають. Ці цифри — з офіційної бази «Діти війни», звітів Human Rights Watch і повідомлень уряду; джерела внизу сторінки. Оцінки омбудсменів щодо дітей сягають 150–300 тисяч.",
      en: "The warrants state no numbers. These figures come from the official \"Children of War\" database, Human Rights Watch and government reporting; sources at the foot of the page. Ombudspersons' estimates for children run to 150,000–300,000.",
    },
    metrics: [
      {
        label: { uk: "Дітей у базі «Діти війни»", en: "Children in the \"Children of War\" database" },
        value: { uk: "19 546+", en: "19,546+" },
        note: { uk: "депортовані або примусово переміщені", en: "deported or forcibly transferred" },
      },
      {
        label: { uk: "Повернуто дітей", en: "Children returned" },
        value: { uk: "1 859", en: "1,859" },
        percent: 9.5,
        restLabel: { uk: "решта — досі ні", en: "the rest — still not" },
        note: { uk: "≈ 9,5% від бази · станом на грудень 2025", en: "≈ 9.5% of the database · as of December 2025" },
      },
      {
        label: { uk: "Людей без світла взимку 2022–23", en: "People without power, winter 2022–23" },
        value: { uk: "≈ 12 млн", en: "≈ 12 million" },
        note: { uk: "наслідок кампанії, за якою видано 4 ордери", en: "the campaign behind four of the warrants" },
      },
      {
        label: { uk: "Держав-учасниць, що не виконали ордер", en: "States Parties that failed to execute" },
        value: "2",
        note: { uk: "Монголія (2024), Таджикистан (2025)", en: "Mongolia (2024), Tajikistan (2025)" },
      },
    ],
  },

  interpretations: [
    {
      term: { uk: "Юрисдикція без членства", en: "Jurisdiction without membership" },
      ruling: {
        uk: "Держава — не учасниця Статуту може визнати юрисдикцію Суду заявою за ст. 12(3). Дві заяви України (2014, 2015) відкрили МКС усі злочини на її території з 21 листопада 2013 року — задовго до ратифікації.",
        en: "A non-party State can accept the Court's jurisdiction by an art. 12(3) declaration. Ukraine's two declarations (2014, 2015) opened its whole territory to the ICC from 21 November 2013 — years before ratification.",
      },
    },
    {
      term: { uk: "Імунітет глави держави", en: "Head-of-state immunity" },
      ruling: {
        uk: "Перед МКС персональні імунітети не діють (ст. 27 Статуту). У рішенні щодо Монголії від 24 жовтня 2024 року Палата підтвердила: обов'язок арешту не залежить від посади підозрюваного.",
        en: "Personal immunities are not opposable before the ICC (art. 27). In the Mongolia decision of 24 October 2024 the Chamber reaffirmed that the duty to arrest does not bend to official capacity.",
      },
    },
    {
      term: { uk: "«Обґрунтовані підстави вважати»", en: "\"Reasonable grounds to believe\"" },
      ruling: {
        uk: "Стандарт доказування для ордера (ст. 58 Статуту) — нижчий за стандарт вироку. Ордер відкриває шлях до арешту й суду, але нічого не вирішує про вину.",
        en: "The evidentiary standard for a warrant (art. 58) — lower than that for conviction. A warrant opens the road to arrest and trial; it decides nothing about guilt.",
      },
    },
    {
      term: { uk: "Дві теорії справи", en: "Two theories of the case" },
      ruling: {
        uk: "Прокуратура будує ситуацію як дві лінії: депортація дітей (політичне керівництво, хвиля 1) і кампанія проти енергосистеми (військова вертикаль — від командувачів до міністра оборони й Генштабу, хвилі 2–3).",
        en: "The Prosecution has built two lines: the deportation of children (the political leadership, wave 1) and the campaign against the grid (the military chain, from operational commanders up to the Defence Minister and General Staff, waves 2–3).",
      },
    },
    {
      term: { uk: "Межа юрисдикції: агресія", en: "The jurisdictional limit: aggression" },
      ruling: {
        uk: "Щодо злочину агресії юрисдикція МКС у цій ситуації обмежена, бо РФ не є учасницею Статуту. Саме тому 25 червня 2025 року Україна і Рада Європи підписали угоду про Спеціальний трибунал щодо злочину агресії.",
        en: "The ICC cannot reach the crime of aggression here, because Russia is not a party to the Statute. That is why Ukraine and the Council of Europe signed the Special Tribunal agreement on 25 June 2025.",
      },
    },
  ],

  sources: [
    // — Official ICC record (the in-text links of the source summary) —
    {
      url: "https://www.icc-cpi.int/itemsDocuments/997/declarationRecognitionJuristiction09-04-2014.pdf",
      title: "Declaration of the Government of Ukraine accepting ICC jurisdiction (9 April 2014)",
      authors: "",
      publication: "International Criminal Court",
      date: "9 April 2014",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/iccdocs/other/Ukraine_Art_12-3_declaration_08092015.pdf",
      title: "Second declaration under article 12(3) (8 September 2015)",
      authors: "",
      publication: "International Criminal Court",
      date: "8 September 2015",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/Pages/item.aspx?name=201211-otp-statement-ukraine",
      title: "OTP statement concluding the preliminary examination of the situation in Ukraine",
      authors: "",
      publication: "International Criminal Court",
      date: "11 December 2020",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/Pages/item.aspx?name=20220228-prosecutor-statement-ukraine",
      title: "Prosecutor's statement on seeking authorisation to open an investigation",
      authors: "Karim A.A. Khan KC",
      publication: "International Criminal Court",
      date: "28 February 2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/Pages/item.aspx?name=2022-prosecutor-statement-referrals-ukraine",
      title: "Prosecutor's statement on the referrals and the opening of the investigation",
      authors: "Karim A.A. Khan KC",
      publication: "International Criminal Court",
      date: "2 March 2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/Pages/item.aspx?name=20220311-prosecutor-statement-ukraine",
      title: "Prosecutor's statement on referrals by Japan and North Macedonia",
      authors: "Karim A.A. Khan KC",
      publication: "International Criminal Court",
      date: "11 March 2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/sites/default/files/2022-04/JAPAN_referral.pdf",
      title: "State Party referral — Japan",
      authors: "",
      publication: "International Criminal Court",
      date: "2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/sites/default/files/2022-04/State-Party-Referral-North-Macedonia.pdf",
      title: "State Party referral — North Macedonia",
      authors: "",
      publication: "International Criminal Court",
      date: "2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/sites/default/files/2022-04/20220321164751497-ukraine-referral-montenegro.pdf",
      title: "State Party referral — Montenegro",
      authors: "",
      publication: "International Criminal Court",
      date: "21 March 2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/sites/default/files/2022-04/20220401-Chile-Letter-to-OTP.PDF",
      title: "State Party referral — Chile",
      authors: "",
      publication: "International Criminal Court",
      date: "1 April 2022",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-vladimir-vladimirovich-putin-and",
      title: "ICC judges issue arrest warrants against Vladimir Putin and Maria Lvova-Belova",
      authors: "",
      publication: "International Criminal Court",
      date: "17 March 2023",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-sergei-ivanovich-kobylash-and",
      title: "ICC judges issue arrest warrants against Sergei Kobylash and Viktor Sokolov",
      authors: "",
      publication: "International Criminal Court",
      date: "5 March 2024",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/situation-ukraine-icc-judges-issue-arrest-warrants-against-sergei-kuzhugetovich-shoigu-and",
      title: "ICC judges issue arrest warrants against Sergei Shoigu and Valery Gerasimov",
      authors: "",
      publication: "International Criminal Court",
      date: "24 June 2024",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/statement-prosecutor-karim-aa-khan-kc-issuance-arrest-warrants-situation-ukraine",
      title: "Statement of the Prosecutor on the issuance of arrest warrants in the Situation in Ukraine",
      authors: "Karim A.A. Khan KC",
      publication: "International Criminal Court",
      date: "2024",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/ukraine-situation-icc-pre-trial-chamber-ii-finds-mongolia-failed-cooperate-arrest-and",
      title: "Pre-Trial Chamber II finds that Mongolia failed to cooperate in the arrest and surrender of Vladimir Putin",
      authors: "",
      publication: "International Criminal Court",
      date: "24 October 2024",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/sites/default/files/CourtRecords/0902ebd1809d1971.pdf",
      title: "Decision on the non-compliance of Mongolia (ICC-01/22, full text)",
      authors: "Pre-Trial Chamber II",
      publication: "International Criminal Court",
      date: "24 October 2024",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/court-record/icc-01/22-143",
      title:
        "Finding under article 87(7) of the Rome Statute on the non-compliance by Tajikistan with the request by the Court to cooperate in the arrest and surrender of Vladimir Vladimirovich Putin and referral to the Assembly of States Parties",
      authors: "Pre-Trial Chamber II",
      publication: "International Criminal Court",
      date: "19 March 2026",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/referral-presidency-international-criminal-court-tajikistans-non-compliance-assembly-states",
      title:
        "Referral by the Presidency of Tajikistan's non-compliance to the Assembly of States Parties",
      authors: "",
      publication: "International Criminal Court",
      date: "7 May 2026",
      type: "official/ICC",
    },
    {
      url: "https://www.icc-cpi.int/news/icc-welcomes-ukraine-new-state-party",
      title: "ICC welcomes Ukraine as a new State Party",
      authors: "",
      publication: "International Criminal Court",
      date: "January 2025",
      type: "official/ICC",
    },
    // — Research and commentary (from the source doc) —
    {
      url: "https://jurfem.com.ua/en/arrest-warrant-for-putin-what-does-it-mean/",
      title: "Arrest Warrant for Putin: What Does It Mean?",
      authors: "",
      publication: "JurFem",
      date: "2023",
      type: "news/insight",
    },
    {
      url: "https://www.theguardian.com/world/2023/mar/17/icc-arrest-warrant-vladimir-putin-explainer",
      title: "What does the ICC arrest warrant for Vladimir Putin mean in reality?",
      authors: "",
      publication: "The Guardian",
      date: "17 March 2023",
      type: "news/insight",
    },
    {
      url: "https://journals.law.harvard.edu/ilj/2023/11/the-iccs-arrest-warrant-against-putin-a-grenade-against-peace-in-ukraine/",
      title: "The ICC's Arrest Warrant Against Putin: A Grenade Against Peace in Ukraine?",
      authors: "Andreas Chorakis",
      publication: "Harvard International Law Journal",
      date: "November 2023",
      type: "journal article",
    },
    {
      url: "https://www.ejiltalk.org/the-putin-south-africa-arrest-warrant-saga-a-tale-of-the-shrinking-world-of-an-accused-war-criminal/",
      title: "The Putin–South Africa Arrest Warrant Saga: A Tale of the Shrinking World of an Accused War Criminal",
      authors: "",
      publication: "EJIL: Talk!",
      date: "18 August 2023",
      type: "blog post",
    },
    {
      url: "https://www.coalitionfortheicc.org/news/tajikistans-failure-arrest-vladimir-putin-undermines-fight-against-impunity",
      title: "Tajikistan's failure to arrest Vladimir Putin undermines the fight against impunity",
      authors: "",
      publication: "Coalition for the International Criminal Court",
      date: "16 October 2025",
      type: "news/insight",
    },
    {
      url: "https://rsilpak.org/2023/putins-arrest-warrant-immunity-and-the-international-criminal-court/",
      title: "Putin's Arrest Warrant, Immunity & the International Criminal Court",
      authors: "",
      publication: "Research Society of International Law",
      date: "2023",
      type: "blog post",
    },
    {
      url: "https://www.justsecurity.org/85529/the-icc-goes-straight-to-the-top-arrest-warrant-issued-for-putin/",
      title: "The ICC Goes Straight to the Top: Arrest Warrant Issued for Putin",
      authors: "Rebecca Hamilton",
      publication: "Just Security",
      date: "17 March 2023",
      type: "blog post",
    },
    {
      url: "https://opiniojuris.org/2023/03/27/putin-arrest-warrant-international-law-and-perceptions-of-double-standards/",
      title: "Putin Arrest Warrant: International Law and Perceptions of Double Standards",
      authors: "Chidi Anselm Odinkalu, Sharon Nakandha",
      publication: "Opinio Juris",
      date: "27 March 2023",
      type: "blog post",
    },
    {
      url: "https://internationallaw.blog/2023/03/24/the-icc-arrest-warrant-against-vladimir-putin-and-the-obligation-to-arrest-an-incumbent-head-of-state-does-immunity-mean-impunity/",
      title: "The ICC Arrest Warrant against Vladimir Putin and the Obligation to Arrest an Incumbent Head of State: Does Immunity Mean Impunity?",
      authors: "",
      publication: "International Law Blog",
      date: "24 March 2023",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/the-icc-arrest-warrants-against-vladimir-putin-and-maria-lvova-belova-an-outline-of-issues/",
      title: "The ICC Arrest Warrants against Vladimir Putin and Maria Lvova-Belova: An Outline of Issues",
      authors: "",
      publication: "EJIL: Talk!",
      date: "2023",
      type: "blog post",
    },
    {
      url: "https://www.theguardian.com/law/2023/may/19/russia-arrest-order-international-criminal-court-prosecutor-karim-khan",
      title: "Russia issues arrest order for ICC prosecutor Karim Khan",
      authors: "",
      publication: "The Guardian",
      date: "19 May 2023",
      type: "news/insight",
    },
    {
      url: "https://ukrainianvictory.org/publications/brief-anniversary-of-the-arrest-warrants-for-putin-and-lvova-belova-for-deportation-of-ukrainian-children-what-did-it-bring-and-what-happens-next/",
      title: "Anniversary of the Arrest Warrants for Putin and Lvova-Belova: What Did It Bring and What Happens Next?",
      authors: "",
      publication: "Ukrainian Victory",
      date: "2024",
      type: "news/insight",
    },
    {
      url: "https://www.justsecurity.org/86079/conferred-jurisdiction-and-the-iccs-putin-and-lvova-belova-warrants/",
      title: "Conferred Jurisdiction and the ICC's Putin and Lvova-Belova Warrants",
      authors: "",
      publication: "Just Security",
      date: "21 April 2023",
      type: "blog post",
    },
    {
      url: "https://opiniojuris.org/2024/03/15/justice-for-victims-of-missile-attacks-in-ukraine-new-icc-arrest-warrants-for-russian-top-military-commanders/",
      title: "Justice for Victims of Missile Attacks in Ukraine: New ICC Arrest Warrants for Russian Top Military Commanders",
      authors: "",
      publication: "Opinio Juris",
      date: "15 March 2024",
      type: "blog post",
    },
    {
      url: "https://www.researchgate.net/publication/371877217_Will_the_International_Criminal_Court_icc_Be_Able_to_Secure_the_Arrest_of_Vladimir_Putin_When_He_Travels_Understanding_State_Cooperation_Through_Other_icc_Non-Arrest_Cases_Against_Malawi_Chad_Nigeria_",
      title: "Will the ICC Be Able to Secure the Arrest of Vladimir Putin When He Travels?",
      authors: "",
      publication: "ResearchGate",
      date: "2023",
      type: "preprint/repository",
    },
    {
      url: "https://www.researchgate.net/publication/388346326_ICC_Jurisdiction_Analysis_of_the_Legalization_of_the_Russian_President's_Arrest_Warrant_in_View_of_International_Law",
      title: "ICC Jurisdiction: Analysis of the Legalization of the Russian President's Arrest Warrant in View of International Law",
      authors: "",
      publication: "ResearchGate",
      date: "2025",
      type: "preprint/repository",
    },
    // — Context added by this page (the research trail) —
    {
      url: "https://www.asil.org/ILIB/icc-finds-mongolia-violated-rome-statute-failing-arrest-putin",
      title: "ICC Finds Mongolia Violated Rome Statute by Failing to Arrest Putin",
      authors: "",
      publication: "ASIL",
      date: "2024",
      type: "news/insight",
    },
    {
      url: "https://www.ejiltalk.org/the-iccs-turn-to-cynical-solipsism-the-ptc-iis-finding-of-mongolias-non-compliance-in-the-case-against-putin/",
      title: "The PTC II's Finding of Mongolia's Non-compliance in the Case against Putin",
      authors: "",
      publication: "EJIL: Talk!",
      date: "2024",
      type: "blog post",
    },
    {
      url: "https://www.coalitionfortheicc.org/ukraine-becomes-125th-ICC-state-party",
      title: "Ukraine becomes the 125th State Party to the ICC Rome Statute",
      authors: "",
      publication: "Coalition for the International Criminal Court",
      date: "1 January 2025",
      type: "news/insight",
    },
    {
      url: "https://brill.com/view/journals/icla/25/6/article-p1040_003.xml",
      title: "Ukraine and Article 124 Rome Statute — a Jurisdictional Dilemma Through the Lens of Selectivity",
      authors: "",
      publication: "International Criminal Law Review",
      date: "2025",
      type: "journal article",
    },
    {
      url: "https://www.usip.org/publications/2023/03/how-iccs-warrant-putin-could-impact-ukraine-war",
      title: "How the ICC's Warrant for Putin Could Impact the Ukraine War",
      authors: "",
      publication: "United States Institute of Peace",
      date: "March 2023",
      type: "news/insight",
    },
    {
      url: "https://www.hrw.org/news/2024/06/26/new-icc-warrants-issued-ukraine-crimes",
      title: "New ICC Warrants Issued for Ukraine Crimes",
      authors: "",
      publication: "Human Rights Watch",
      date: "26 June 2024",
      type: "news/insight",
    },
    {
      url: "https://www.justsecurity.org/97300/icc-warrants-ukraines-power-grid/",
      title: "ICC Arrest Warrants for Russian Attacks on Ukraine's Power Grid",
      authors: "",
      publication: "Just Security",
      date: "2024",
      type: "blog post",
    },
    {
      url: "https://kyivindependent.com/ukraine-says-1-859-abducted-children-have-been-returned-zelenska-tells-paris-summit/",
      title: "Ukraine has brought back 1,859 Russia-abducted children, Zelenska says",
      authors: "",
      publication: "The Kyiv Independent",
      date: "December 2025",
      type: "news/insight",
    },
    {
      url: "https://www.eeas.europa.eu/delegations/vienna-international-organisations/deportation-ukrainian-children-amidst-russia%E2%80%99s-war-aggression-how-ensure-accountability-and-children_en",
      title: "Deportation of Ukrainian Children Amidst Russia's War of Aggression",
      authors: "",
      publication: "European External Action Service",
      date: "2024",
      type: "news/insight",
    },
    {
      url: "https://www.themoscowtimes.com/2025/12/12/russia-jails-icc-judges-prosecutor-in-absentia-over-putin-arrest-warrant-a91419",
      title: "Russia Jails ICC Judges, Prosecutor in Absentia Over Putin Arrest Warrant",
      authors: "",
      publication: "The Moscow Times",
      date: "12 December 2025",
      type: "news/insight",
    },
    {
      url: "https://www.ohchr.org/en/press-releases/2026/02/russia-must-end-reprisals-and-intimidation-icc-prosecutor-and-judges-un",
      title: "Russia must end reprisals and intimidation of ICC Prosecutor and judges: UN Special Rapporteurs",
      authors: "",
      publication: "OHCHR",
      date: "February 2026",
      type: "news/insight",
    },
    {
      url: "https://www.coe.int/en/web/portal/-/ukraine-and-the-council-of-europe-sign-agreement-on-establishing-a-special-tribunal-for-the-crime-of-aggression-against-ukraine",
      title: "Ukraine and the Council of Europe sign the Special Tribunal agreement",
      authors: "",
      publication: "Council of Europe",
      date: "25 June 2025",
      type: "news/insight",
    },
  ],
};

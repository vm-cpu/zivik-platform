import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./icj-genocide.verbatim.json";

/**
 * Allegations of Genocide (Ukraine v. Russian Federation: 32 States
 * intervening), ICJ Judgment on Preliminary Objections of 2 February 2024.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source .docx
 * (English — the language of the judgment). The fields below add a localized
 * visualization layer whose every value restates something already in that
 * prose:
 *   • the timeline dates all appear in "FACTUAL BACKGROUND" (2014, 21, 22 and
 *     26 February 2022) and in the masthead (2 February 2024);
 *   • the objection ledger quotes the six objections as the summary lists them,
 *     and their outcomes as "LEGAL CONSEQUENCES" disposes of them;
 *   • the theatre restates the two oblasts the alleged genocide concerns.
 * Two things are NOT in the summary and are sourced from the Court's own
 * record, because the summary states outcomes without them: the voting tallies
 * and the final two findings (ICJ press release of 2 February 2024), and the
 * date of the intervention Order (5 June 2023).
 */
export const icjGenocide: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),

  plain: {
    tldr: {
      uk: "Росія виправдовувала вторгнення вигаданим «геноцидом на Донбасі». Україна пішла до Міжнародного суду ООН, щоб той офіційно засвідчив: геноциду не було. Суд погодився розглядати саме це — і відхилив п'ять із шести заперечень Росії. Але вимоги визнати незаконними визнання «ДНР/ЛНР» і саму «спецоперацію» Суд розглядати відмовився: це поза межами Конвенції про геноцид.",
      en: "Russia justified its invasion with a fabricated “genocide in Donbas”. Ukraine went to the International Court of Justice to have it put on the record that no genocide occurred. The Court agreed to hear exactly that claim, rejecting five of Russia's six objections. It refused, however, to rule on the recognition of the “DPR/LPR” and on the “special military operation” themselves: those lie outside the Genocide Convention.",
    },
    whyMatters: {
      uk: "Це перша справа в історії Суду, де держава просить визнати, що вона НЕ вчиняла геноциду — щоб вибити ґрунт з-під приводу для війни. Аргумент України підтримали 33 держави, що стало найбільшою участю третіх сторін в історії Суду. Водночас рішення окреслило межу: Конвенція про геноцид не є інструментом для оцінки застосування сили.",
      en: "This is the first case in the Court's history in which a State asks to be declared NOT to have committed genocide — to knock away the stated pretext for a war. Ukraine's argument drew 33 States into the proceedings, the largest third-party participation the Court has seen. The judgment also drew a boundary: the Genocide Convention is not a vehicle for judging the use of force.",
    },
  },

  glossary: [
    {
      term: { uk: "Попередні заперечення", en: "Preliminary objections" },
      def: {
        uk: "Заперечення відповідача проти самої можливості розгляду справи — щодо юрисдикції суду або прийнятності позову. Розглядаються до суті спору.",
        en: "A respondent's challenge to the case being heard at all — to the Court's jurisdiction or the claim's admissibility. Decided before the merits.",
      },
    },
    {
      term: { uk: "Ratione materiae", en: "Ratione materiae" },
      def: {
        uk: "«За предметом»: чи належить спір до кола питань, які регулює конкретний договір. Тут — чи охоплює Конвенція про геноцид застосування сили та визнання держав.",
        en: "“By subject-matter”: whether a dispute falls within what a given treaty governs. Here — whether the Genocide Convention covers the use of force and the recognition of States.",
      },
    },
    {
      term: { uk: "Стаття IX", en: "Article IX" },
      def: {
        uk: "Арбітражне застереження Конвенції про геноцид: воно дозволяє передати спір щодо тлумачення чи застосування Конвенції до Міжнародного суду ООН.",
        en: "The Genocide Convention's compromissory clause: it lets a dispute over the Convention's interpretation or application be brought to the International Court of Justice.",
      },
    },
    {
      term: { uk: "Стаття 63 Статуту Суду", en: "Article 63 of the Statute" },
      def: {
        uk: "Право держави — учасниці договору вступити у справу, де тлумачать цей договір, і подати свої міркування щодо тлумачення.",
        en: "The right of a State party to a convention to intervene in a case construing that convention and put its own reading before the Court.",
      },
    },
    {
      term: { uk: "Декларативне рішення", en: "Declaratory judgment" },
      def: {
        uk: "Рішення, яке лише констатує правове становище (тут — що геноциду не було), без присудження відшкодування чи інших заходів.",
        en: "A judgment that only states the legal position (here — that no genocide occurred), without awarding reparation or other relief.",
      },
    },
    {
      term: { uk: "«ДНР» / «ЛНР»", en: "“DPR” / “LPR”" },
      def: {
        uk: "Самопроголошені утворення на сході України, визнані Росією 21 лютого 2022 року; лапки означають невизнання.",
        en: "Self-proclaimed entities in eastern Ukraine, recognized by Russia on 21 February 2022; quotation marks signal non-recognition.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Україна", en: "Ukraine" },
      role: {
        uk: "Заявник. Просить Суд встановити, що геноциду в Луганській і Донецькій областях не було.",
        en: "Applicant. Asks the Court to find that no genocide was committed in the Luhansk and Donetsk oblasts.",
      },
      kind: "party",
    },
    {
      name: { uk: "Російська Федерація", en: "Russian Federation" },
      role: {
        uk: "Відповідач. Заявила шість попередніх заперечень проти юрисдикції Суду та прийнятності позову.",
        en: "Respondent. Raised six preliminary objections to the Court's jurisdiction and the admissibility of the claim.",
      },
      kind: "party",
    },
    {
      name: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
      role: {
        uk: "Головний судовий орган ООН у Гаазі. Вирішує спори між державами; його рішення остаточні й оскарженню не підлягають.",
        en: "The principal judicial organ of the UN, in The Hague. It settles disputes between States; its judgments are final and without appeal.",
      },
      kind: "court",
    },
    {
      name: { uk: "32 держави, що вступили у справу", en: "32 intervening States" },
      role: {
        uk: "Подали декларації за статтею 63 Статуту з власним тлумаченням Конвенції; декларацію США визнано неприйнятною на цьому етапі.",
        en: "Filed declarations under Article 63 of the Statute setting out their own reading of the Convention; the United States' declaration was found inadmissible at this stage.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: {
        uk: "Суд визнав, що Україна не вчиняла геноциду?",
        en: "Did the Court find that Ukraine committed no genocide?",
      },
      a: {
        uk: "Ще ні. 2 лютого 2024 року Суд вирішив лише, що має право розглядати це питання й що вимога прийнятна. Саме твердження про відсутність геноциду перевірятимуть на наступному етапі — по суті.",
        en: "Not yet. On 2 February 2024 the Court decided only that it may hear the question and that the claim is admissible. Whether no genocide occurred will be examined at the next stage, on the merits.",
      },
    },
    {
      q: {
        uk: "Чому Суд відмовився оцінювати «спецоперацію» і визнання «ДНР/ЛНР»?",
        en: "Why did the Court refuse to assess the “special military operation” and the recognition of the “DPR/LPR”?",
      },
      a: {
        uk: "Бо його юрисдикція тут походить лише зі статті IX Конвенції про геноцид. Застосування сили й визнання держав, як зазначив Суд, лежать поза Конвенцією й регулюються іншими нормами міжнародного права.",
        en: "Because its jurisdiction here comes only from Article IX of the Genocide Convention. The use of force and the recognition of States, the Court held, lie outside the Convention and are governed by other rules of international law.",
      },
    },
    {
      q: {
        uk: "Що означає «п'ять заперечень відхилено, одне задоволено»?",
        en: "What does “five objections rejected, one upheld” mean?",
      },
      a: {
        uk: "Росія намагалася зупинити справу шістьма способами. П'ять спроб Суд відкинув — справа живе. Одна спрацювала: задоволене друге заперечення відсікло від розгляду вимоги (c) і (d) Меморандуму України.",
        en: "Russia tried six ways to stop the case. Five failed — the case survives. One worked: the second objection, upheld, cut submissions (c) and (d) of Ukraine's Memorial out of the case.",
      },
    },
    {
      q: {
        uk: "Навіщо у справу вступили 33 держави?",
        en: "Why did 33 States intervene?",
      },
      a: {
        uk: "Стаття 63 Статуту дозволяє учасникам договору подати своє тлумачення. Держави підтримали позицію, що недобросовісне посилання на Конвенцію як привід для сили є зловживанням нею.",
        en: "Article 63 of the Statute lets parties to a convention put their own construction before the Court. These States supported the reading that invoking the Convention in bad faith, as a pretext for force, is an abuse of it.",
      },
    },
  ],

  related: [
    {
      label: {
        uk: "ICSFT і CERD (Україна проти Росії)",
        en: "ICSFT and CERD (Ukraine v. Russian Federation)",
      },
      note: {
        uk: "Рішення по суті від 31 січня 2024 — за день до цього. Крим і Донбас, два інші договори.",
        en: "Judgment on the merits of 31 January 2024 — the day before this one. Crimea and Donbas, under two other treaties.",
      },
      href: "/cases/icj-cerd-icsft",
    },
  ],

  judgment: {
    court: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
    url: "https://www.icj-cij.org/sites/default/files/case-related/182/182-20240202-jud-01-00-en.pdf",
    caseUrl: "https://www.icj-cij.org/case/182",
    pages: 70,
  },

  instruments: [
    {
      abbr: "Genocide Convention",
      name: {
        uk: "Конвенція про запобігання злочину геноциду та покарання за нього",
        en: "Convention on the Prevention and Punishment of the Crime of Genocide",
      },
      year: 1948,
      url: "https://treaties.un.org/doc/Treaties/1951/01/19510112%2008-12%20PM/Ch_IV_1p.pdf",
    },
  ],

  stats: [
    { value: "6", label: { uk: "заперечень Росії", en: "objections by Russia" } },
    { value: "5", label: { uk: "відхилено", en: "rejected" } },
    { value: "1", label: { uk: "задоволено", en: "upheld" } },
    { value: "32", label: { uk: "держави у справі", en: "States intervening" } },
  ],

  glance: [
    {
      label: { uk: "Позов подано", en: "Application filed" },
      value: { uk: "26 лютого 2022", en: "26 February 2022" },
    },
    {
      label: { uk: "Підстава юрисдикції", en: "Basis of jurisdiction" },
      value: { uk: "Стаття IX Конвенції про геноцид", en: "Article IX, Genocide Convention" },
    },
    {
      label: { uk: "Що йде далі по суті", en: "What proceeds to the merits" },
      value: { uk: "Вимога (b) Меморандуму", en: "Submission (b) of the Memorial" },
    },
    {
      label: { uk: "Що відсічено", en: "What was cut" },
      value: { uk: "Вимоги (c) і (d)", en: "Submissions (c) and (d)" },
    },
  ],

  timeline: [
    {
      date: { uk: "Весна 2014", en: "Spring 2014" },
      label: {
        uk: "На Донбасі починається збройний конфлікт між силами України та формуваннями, пов'язаними з «ДНР» і «ЛНР».",
        en: "Armed conflict begins in Donbas between Ukrainian forces and forces linked to the “DPR” and “LPR”.",
      },
      kind: "context",
    },
    {
      date: { uk: "21 лютого 2022", en: "21 February 2022" },
      label: {
        uk: "Росія визнає «ДНР» і «ЛНР» незалежними державами, посилаючись на нібито триваючі напади на громади Донбасу.",
        en: "Russia recognizes the “DPR” and “LPR” as independent States, citing continuing attacks against the Donbas communities.",
      },
      kind: "context",
    },
    {
      date: { uk: "22 лютого 2022", en: "22 February 2022" },
      label: {
        uk: "Підписано два «договори про дружбу, співробітництво і взаємну допомогу»; того ж дня «ДНР» і «ЛНР» просять у Росії військової допомоги.",
        en: "Two “Treaties on Friendship, Cooperation and Mutual Assistance” are concluded; the same day the “DPR” and “LPR” request military assistance from Russia.",
      },
      kind: "context",
    },
    {
      date: { uk: "26 лютого 2022", en: "26 February 2022" },
      label: {
        uk: "МЗС України спростовує звинувачення в геноциді; за кілька годин Україна подає позов і запит про тимчасові заходи.",
        en: "Ukraine's Ministry of Foreign Affairs denounces the genocide allegations; hours later Ukraine files its Application and a request for provisional measures.",
      },
      kind: "filing",
    },
    {
      date: { uk: "5 червня 2023", en: "5 June 2023" },
      label: {
        uk: "Суд визнає прийнятними декларації про вступ у справу 32 держав на стадії попередніх заперечень.",
        en: "The Court finds the declarations of intervention of 32 States admissible at the preliminary objections stage.",
      },
      kind: "order",
    },
    {
      date: { uk: "2 лютого 2024", en: "2 February 2024" },
      label: {
        uk: "Рішення щодо попередніх заперечень: юрисдикція щодо вимоги (b) є, вимоги (c) і (d) — поза межами Конвенції.",
        en: "Judgment on preliminary objections: jurisdiction over submission (b); submissions (c) and (d) fall outside the Convention.",
      },
      kind: "judgment",
    },
  ],

  verdicts: [],

  benchSize: 16,

  objections: [
    {
      n: "1",
      claim:
        "the Court lacks jurisdiction as there was no dispute between the Parties under the Genocide Convention at the time of the filing of the Application",
      outcome: "rejected",
      votes: [{ for: 15, against: 1 }],
    },
    {
      n: "2",
      claim: "the Court lacks jurisdiction ratione materiae",
      outcome: "upheld",
      votes: [
        {
          for: 12,
          against: 4,
          scope: { uk: "щодо вимог (c) і (d)", en: "as to submissions (c) and (d)" },
        },
      ],
    },
    {
      n: "3",
      claim:
        "Ukraine made new claims in the Memorial and these should be found inadmissible",
      outcome: "rejected",
      votes: [
        { for: 15, against: 1, scope: { uk: "щодо вимоги (b)", en: "as to submission (b)" } },
        {
          for: 14,
          against: 2,
          scope: { uk: "щодо вимог (c) і (d)", en: "as to submissions (c) and (d)" },
        },
      ],
    },
    {
      n: "4",
      claim:
        "Ukraine's claims are inadmissible as the Court's potential judgment would lack practical effect",
      outcome: "rejected",
      votes: [{ for: 14, against: 2 }],
    },
    {
      n: "5",
      claim:
        "Ukraine's request for a declaration that it did not breach its obligations under the Convention is inadmissible",
      outcome: "rejected",
      votes: [{ for: 13, against: 3 }],
    },
    {
      n: "6",
      claim: "Ukraine's Application is inadmissible as it constitutes an abuse of process",
      outcome: "rejected",
      votes: [{ for: 15, against: 1 }],
    },
    {
      n: "→",
      claim:
        "Finds that it has jurisdiction to entertain submission (b), and that the claim contained therein is admissible.",
      outcome: "finding",
      votes: [
        { for: 15, against: 1, scope: { uk: "юрисдикція", en: "jurisdiction" } },
        { for: 13, against: 3, scope: { uk: "прийнятність", en: "admissibility" } },
      ],
    },
  ],

  interpretations: [
    {
      term: { uk: "Один спір — два аспекти", en: "One dispute, two aspects" },
      ruling: {
        uk: "Суд розділив вимогу України надвоє. Перший аспект — прохання визнати, що Україна «не вчиняла геноциду»; лише він відповідає ознакам спору за статтею IX. Другий — прохання визнати незаконними дії Росії; ним Україна порушує питання міжнародної відповідальності, і його Суд розглядати не має права.",
        en: "The Court split Ukraine's claim in two. The first aspect — the request to find that Ukraine “has not committed genocide” — alone answers to a dispute under Article IX. The second — the request to find Russia's conduct unlawful — invokes State responsibility, and the Court has no jurisdiction over it.",
      },
    },
    {
      term: { uk: "Межа Конвенції про геноцид", en: "The limit of the Convention" },
      ruling: {
        uk: "Застосування сили з 24 лютого 2022 року й визнання «ДНР/ЛНР» лежать поза Конвенцією про геноцид: вони є зовнішніми щодо неї й регулюються іншими нормами міжнародного права.",
        en: "The use of force since 24 February 2022 and the recognition of the “DPR/LPR” lie outside the Genocide Convention: they are extrinsic to it and governed by other rules of international law.",
      },
    },
    {
      term: { uk: "Позов про невчинення порушення", en: "A claim of non-violation" },
      ruling: {
        uk: "Вимога держави визнати, що вона не порушувала Конвенцію, є прийнятною — п'яте заперечення Росії Суд відхилив. Це відкриває шлях для позовів, спрямованих проти хибних звинувачень.",
        en: "A State's request for a declaration that it did not breach the Convention is admissible — the Court rejected Russia's fifth objection. That opens a path for claims aimed at false accusations.",
      },
    },
  ],

  provisionalMeasures: [],

  theatresLabel: { uk: "Де це відбувалося", en: "Where the case arises" },

  theatres: [
    {
      place: { uk: "Донеччина та Луганщина", en: "Donetsk & Luhansk oblasts" },
      treaty: "Genocide Convention",
      markerKeys: ["donetsk", "luhansk"],
      // the only theatre sits level with Kyiv — drop its label below the zones
      labelDy: 168,
      labelDx: -125,
      summary: {
        uk: "Саме тут, за твердженням Росії, стався «геноцид», що став приводом для вторгнення. Україна просить Суд встановити, що жодних актів геноциду тут вчинено не було.",
        en: "This is where Russia claims a “genocide” took place — the stated pretext for the invasion. Ukraine asks the Court to find that no acts of genocide were committed here.",
      },
    },
  ],

  sources: [
    {
      url: "https://www.ejiltalk.org/icj-delivers-preliminary-objections-judgment-in-the-ukraine-v-russia-genocide-case-ukraine-loses-on-the-most-important-aspects/",
      title:
        "ICJ Delivers Preliminary Objections Judgment in the Ukraine v. Russia Genocide Case, Ukraine Loses on the Most Important Aspects",
      authors: "Marko Milanovic",
      publication: "EJIL: Talk!",
      date: "2 February 2024",
      type: "blog post",
    },
    {
      url: "https://verfassungsblog.de/the-curious-fate-of-the-false-claim-of-genocide/",
      title:
        "The Curious Fate of the False Claim of Genocide: On the ICJ's Preliminary Objections Judgment in Ukraine v. Russia and Beyond",
      authors: "Iryna Marchuk, Aloka Wanigasuriya",
      publication: "Verfassungsblog",
      date: "24 February 2024",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/human-rights-reparations-and-fact-finding-quandaries-in-the-2024-icj-judgments-in-ukraine-v-russian-federation/",
      title:
        "Human Rights, Reparations and Fact-Finding Quandaries in the 2024 ICJ Judgments in Ukraine v. Russian Federation",
      authors: "",
      publication: "EJIL: Talk!",
      date: "2024",
      type: "blog post",
    },
    {
      url: "https://opiniojuris.org/2026/02/24/icjs-recent-order-in-ukraine-v-russia-genocide-case-declaratory-relief-asymmetric-counter-claims-and-direct-connection-requirement/",
      title:
        "ICJ's Recent Order in Ukraine v. Russia Genocide Case: Declaratory Relief, Asymmetric Counter-Claims and Direct Connection Requirement",
      authors: "",
      publication: "Opinio Juris",
      date: "24 February 2026",
      type: "blog post",
    },
  ],
};

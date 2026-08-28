import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./echr-ukraine-netherlands.verbatim.json";
import verbatimUk from "./echr-ukraine-netherlands.uk.json";

/**
 * Ukraine and the Netherlands v. Russia [GC] (nos. 8019/16, 43800/14,
 * 28525/20 and 11055/22), merits judgment of 9 July 2025.
 *
 * `verbatim` is the doc's "ECHR mh-17" tab as ingested, quirks kept (the
 * "art. 43" of the lead, bracketed footnote digits, a Cyrillic "С" in
 * "Сonvention") — the tab is not yet marked finalized in the source doc and
 * will be re-ingested when it is. The visualization layer restates the
 * verbatim; context the tab does not carry — the judgment date and the four
 * application numbers, MH17's 298 victims, the expulsion timeline, the
 * reserved just-satisfaction phase — cites its sources and lives in
 * docs/research/echr-ukraine-netherlands-sources.md.
 */
export const echrUkraineNetherlands: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  // Ukrainian translation of the body, structurally 1:1 (23 blocks) — draft,
  // pending legal review.
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  title: {
    uk: "Україна і Нідерланди проти Росії",
    en: "Ukraine and the Netherlands v. Russia",
  },

  asOf: "2026-08-22",
  provisionalSource: true,

  forum: {
    institution: {
      uk: "Європейський суд з прав людини",
      en: "European Court of Human Rights",
    },
    seat: { uk: "Страсбург", en: "Strasbourg" },
  },

  /* Search-result description. `plain.tldr` used to serve as this and runs
     three to four sentences, so the snippet was cut off mid-word. */
  metaDesc: {
    uk: "Рішення Великої палати ЄСПЛ від 9 липня 2025: Росія відповідальна за системні порушення прав людини в Україні з 2014 року, зокрема збиття MH17.",
    en: "ECtHR Grand Chamber judgment of 9 July 2025: Russia held responsible for systemic human-rights violations in Ukraine since 2014, MH17 included.",
  },

  plain: {
    tldr: {
      uk: "Чотири міждержавні скарги — три від України, одна від Нідерландів через збиття MH17 — Велика палата ЄСПЛ розглянула разом і 9 липня 2025 року винесла рішення по суті. Суд визнав Росію відповідальною за системні порушення прав людини на сході України з 2014 року і по всій країні з 2022-го: від збиття MH17 і страт полонених до катувань, депортації дітей і заборони української освіти. Сатисфакцію (компенсації) буде визначено окремим рішенням.",
      en: "Four inter-State applications — three by Ukraine, one by the Netherlands over the downing of MH17 — were decided together by the ECtHR's Grand Chamber on 9 July 2025. The Court held Russia responsible for systemic human-rights violations in eastern Ukraine since 2014 and across the country from 2022: from the downing of MH17 and executions of prisoners to torture, the deportation of children and the ban on Ukrainian-language education. Just satisfaction is reserved for a separate ruling.",
    },
    whyMatters: {
      uk: "Це перше рішення ЄСПЛ по суті про повномасштабну міждержавну війну в Європі — і розворот від Georgia v. Russia (II): Суд поширив Конвенцію на активні бойові дії. Для сімей жертв MH17 це перша судова констатація відповідальності Росії; для тисяч індивідуальних скарг українців — фундамент фактів і права.",
      en: "It is the ECtHR's first merits judgment on a full-scale inter-State war in Europe — and a turn away from Georgia v. Russia (II): the Court extended the Convention to active hostilities. For the MH17 families it is the first judicial finding of Russia's responsibility; for thousands of individual Ukrainian applications, a foundation of fact and law.",
    },
  },

  glossary: [
    {
      term: { uk: "ЄКПЛ / Конвенція", en: "ECHR / the Convention" },
      def: {
        uk: "Європейська конвенція з прав людини (1950). Росія була її стороною до 16 вересня 2022 року — тому Суд розглядає події лише до цієї дати.",
        en: "The European Convention on Human Rights (1950). Russia was a party until 16 September 2022 — so the Court examines events only up to that date.",
      },
    },
    {
      term: { uk: "Велика палата", en: "Grand Chamber" },
      def: {
        uk: "Найвищий склад ЄСПЛ — 17 суддів. Розглядає найважливіші справи; її рішення остаточні.",
        en: "The ECtHR's highest formation — 17 judges. It hears the most important cases; its judgments are final.",
      },
    },
    {
      term: { uk: "Міждержавна скарга", en: "Inter-State application" },
      def: {
        uk: "Скарга однієї держави проти іншої (ст. 33 Конвенції) — рідкісний інструмент: тут їх одразу чотири, об'єднані в одне провадження.",
        en: "An application by one State against another (Article 33) — a rare instrument: here four of them, joined in one proceeding.",
      },
    },
    {
      term: { uk: "Фактичний контроль", en: "Effective control" },
      def: {
        uk: "Тест екстериторіальної юрисдикції: держава відповідає за Конвенцією там, де фактично контролює територію — навіть поза своїми кордонами. Щодо «ДНР»/«ЛНР» — з 11 травня 2014 року.",
        en: "The extraterritorial-jurisdiction test: a State answers under the Convention wherever it effectively controls territory, even beyond its borders. For the \"DPR\"/\"LPR\" — from 11 May 2014.",
      },
    },
    {
      term: { uk: "МГП", en: "IHL" },
      def: {
        uk: "Міжнародне гуманітарне право — право збройних конфліктів. Суд постановив: воно не витісняє гарантій Конвенції, а тлумачиться з нею в гармонії.",
        en: "International humanitarian law — the law of armed conflict. The Court held it does not displace the Convention's guarantees; the two are read in harmony.",
      },
    },
    {
      term: { uk: "Hors de combat", en: "Hors de combat" },
      def: {
        uk: "«Поза боєм» — поранені, полонені, ті, хто склав зброю. Їх убивство чи катування — порушення і МГП, і Конвенції.",
        en: "\"Out of the fight\" — the wounded, prisoners, those who surrendered. Killing or torturing them violates both IHL and the Convention.",
      },
    },
    {
      term: { uk: "Справедлива сатисфакція", en: "Just satisfaction" },
      def: {
        uk: "Компенсація за ст. 41 Конвенції. У цій справі її винесено в окрему стадію — суми ще попереду.",
        en: "Compensation under Article 41. Here it is reserved to a separate phase — the figures are still to come.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Україна", en: "Ukraine" },
      role: {
        uk: "Заявниця у трьох із чотирьох заяв (2014, 2016, 2022) — про схід України та повномасштабне вторгнення.",
        en: "Applicant in three of the four applications (2014, 2016, 2022) — on eastern Ukraine and the full-scale invasion.",
      },
      kind: "party",
    },
    {
      name: { uk: "Нідерланди", en: "The Netherlands" },
      role: {
        uk: "Заявник у справі MH17 (заява 2020 року): 298 загиблих, з них 196 — громадяни Нідерландів.",
        en: "Applicant in the MH17 case (the 2020 application): 298 dead, 196 of them Dutch nationals.",
      },
      kind: "party",
    },
    {
      name: { uk: "Російська Федерація", en: "Russian Federation" },
      role: {
        uk: "Відповідачка. Виключена з Ради Європи 16 березня 2022 року; з 16 вересня 2022-го — поза Конвенцією; у провадженні по суті участі не брала.",
        en: "Respondent. Expelled from the Council of Europe on 16 March 2022; outside the Convention from 16 September 2022; it did not take part on the merits.",
      },
      kind: "party",
    },
    {
      name: { uk: "Велика палата ЄСПЛ", en: "The Grand Chamber" },
      role: {
        uk: "17 суддів у Страсбурзі; рішення по суті від 9 липня 2025 року — здебільшого одностайне.",
        en: "Seventeen judges in Strasbourg; the merits judgment of 9 July 2025 was largely unanimous.",
      },
      kind: "court",
    },
    {
      name: { uk: "«ДНР» / «ЛНР»", en: "\"DPR\" / \"LPR\"" },
      role: {
        uk: "Сепаратистські утворення, чиї дії з 11 травня 2014 року автоматично присвоюються Росії.",
        en: "The separatist entities whose acts are automatically attributable to Russia from 11 May 2014.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: { uk: "Чому Нідерланди — сторона цієї справи?", en: "Why are the Netherlands a party?" },
      a: {
        uk: "Через MH17. 17 липня 2014 року ракета «Бук», яку Росія передала сепаратистам, збила малайзійський Boeing над Донеччиною — загинули всі 298 людей на борту, зокрема 196 нідерландців. У 2020 році Нідерланди подали власну міждержавну заяву, і Суд об'єднав її з українськими.",
        en: "Because of MH17. On 17 July 2014 a Buk missile that Russia had supplied to the separatists downed the Malaysian Boeing over the Donetsk region — all 298 aboard died, 196 of them Dutch. In 2020 the Netherlands filed its own inter-State application, joined with Ukraine's.",
      },
    },
    {
      q: { uk: "Росію ж виключили з Ради Європи — чому Суд узагалі розглядав справу?", en: "Russia was expelled — how could the Court still decide?" },
      a: {
        uk: "Конвенція діяла для Росії до 16 вересня 2022 року, і Суд зберігає юрисдикцію щодо всього, що сталося до цієї дати. Тому рішення охоплює вісім років конфлікту — від 2014-го до перших семи місяців повномасштабного вторгнення.",
        en: "The Convention bound Russia until 16 September 2022, and the Court keeps jurisdiction over everything before that date. So the judgment covers eight years of the conflict — from 2014 through the first seven months of the full-scale invasion.",
      },
    },
    {
      q: { uk: "Що це дає практично, якщо Росія не визнає Суд?", en: "What does it change if Russia ignores the Court?" },
      a: {
        uk: "Три речі. Авторитетно встановлені факти — від «Бука» для MH17 до системних катувань — які працюють в інших процесах. Правову базу для понад десяти тисяч індивідуальних скарг українців, що чекають у Страсбурзі. І стадію сатисфакції: присуджені суми стануть частиною загального рахунку до Росії, як у справах Ощадбанку і ДТЕК.",
        en: "Three things. Authoritatively established facts — from the Buk for MH17 to systemic torture — usable in other fora. A legal foundation for the ten-thousand-plus individual Ukrainian applications pending in Strasbourg. And the just-satisfaction phase: the sums awarded will join the broader bill to Russia, as in Oschadbank and DTEK.",
      },
    },
    {
      q: { uk: "Чим це рішення історичне для самого Суду?", en: "Why is the judgment historic for the Court itself?" },
      a: {
        uk: "Суд уперше застосував Конвенцію до активної фази міждержавної війни, відійшовши від Georgia v. Russia (II) з її «контекстом хаосу». Планована державна кампанія насильства — це не хаос, а здійснення влади і контролю, сказав Суд.",
        en: "For the first time the Court applied the Convention to the active phase of an inter-State war, stepping away from Georgia v. Russia (II) and its \"context of chaos\". A planned State campaign of violence, the Court said, is not chaos but the exercise of authority and control.",
      },
    },
    {
      q: { uk: "Що далі?", en: "What happens next?" },
      a: {
        uk: "Стадія справедливої сатисфакції — розмір компенсацій Суд визначить окремо. Виконання рішення наглядає Комітет міністрів Ради Європи; паралельно факти рішення живлять Реєстр збитків для України та інші механізми відповідальності.",
        en: "The just-satisfaction phase — the Court will fix compensation separately. Execution is supervised by the Council of Europe's Committee of Ministers; in parallel the judgment's findings feed the Register of Damage for Ukraine and other accountability mechanisms.",
      },
    },
  ],

  related: [

    {
      // hague-mh17 names this judgment as its sequel; the link ran one way
      // only, on a page whose second applicant State is a party because of
      // MH17.
      label: {
        uk: "Справа MH17: вирок у Гаазі",
        en: "The MH17 case: the verdict in The Hague",
      },
      note: {
        uk: "Окружний суд Гааги · кримінальний вирок, 2022",
        en: "The Hague District Court · criminal verdict, 2022",
      },
      href: "/cases/hague-mh17",
    },
    {
      label: {
        uk: "МКБФТ і МКЛРД (Україна проти РФ)",
        en: "ICSFT and CERD (Ukraine v. Russian Federation)",
      },
      note: { uk: "МС ООН · схід і Крим, 2014–2022", en: "ICJ · the east and Crimea, 2014–2022" },
      href: "/cases/icj-cerd-icsft",
    },
    {
      label: { uk: "Ситуація в Україні (МКС)", en: "Situation in Ukraine (ICC)" },
      note: {
        uk: "МКС · кримінальна відповідальність осіб за ті самі кампанії",
        en: "ICC · individual criminal responsibility for the same campaigns",
      },
      href: "/cases/icc-ukraine",
    },
    {
      label: { uk: "Україна проти Росії (Крим) [ВП]", en: "Ukraine v. Russia (re Crimea) [GC]" },
      note: { uk: "ЄСПЛ · кримська гілка", en: "ECtHR · the Crimea branch" },
      href: "/cases/ecthr-4",
    },
  ],

  judgment: {

    // cases.ts records 304; without it the button omits "PDF, N pp."

    /* 501, the PDF's own page count (its printed pagination runs to 497,
       then Annexes A-C). It read 304, which is not a number that appears
       anywhere in the document. */
    pages: 501,
    court: { uk: "Європейський суд з прав людини", en: "European Court of Human Rights" },
    url: "https://hudoc.echr.coe.int/eng#{%22appno%22:[%2243800/14%22],%22itemid%22:[%22001-244292%22]}",
    caseUrl: "https://www.echr.coe.int/w/ukraine-and-the-netherlands-v.-russia-nos.-8019/16-43800/14-and-28525/20-1",
    date: "2025-07-09",
    readLabel: { uk: "Читати рішення (HUDOC)", en: "Read the judgment (HUDOC)" },
    fileLabel: { uk: "Справа на сайті ЄСПЛ", en: "The case at the ECtHR" },
  },

  instruments: [
    {
      abbr: "ECHR",
      name: {
        uk: "Конвенція про захист прав людини і основоположних свобод",
        en: "Convention for the Protection of Human Rights and Fundamental Freedoms",
      },
      year: 1950,
      url: "https://www.echr.coe.int/documents/d/echr/convention_ENG",
    },
  ],

  stats: [
    {
      value: "4",
      label: { uk: "міждержавні заяви в одному рішенні", en: "inter-State applications in one judgment" },
    },
    {
      value: "298",
      label: { uk: "загиблих на борту MH17", en: "people killed aboard MH17" },
      em: true,
    },
    /* Twelve, counted from the judgment's own operative part (HUDOC 001-244292,
       pp. 493-497, after § 1652) rather than from the verbatim list below —
       which is where the audit's rival "11" comes from, and which is wrong in
       two directions at once. The distinct Convention and Protocol articles the
       Court found breached are Articles 2 (points 5, 6, 11, 12), 3 (8, 11, 13,
       22), 4 § 2 (14), 5 (15, 22), 8 (11, 16, 20, 22), 9 (17), 10 (18), 11
       (19), 13 (7, 24), 14 (23), and Articles 1 (11, 20) and 2 (21) of Protocol
       No. 1. That is twelve.

       The two directions: the verbatim's list omits Article 11 (freedom of
       assembly, operative point 19) and Article 13 (effective remedy, points 7
       and 24) altogether, and it adds Article 2 of Protocol No. 4, under which
       the Court found NO violation — points 11 and 22 both say it was "not
       necessary to examine separately" the P4-2 complaint. Drop P4-2 and add
       the two missing articles and the eleven becomes twelve.

       And the deliberate exclusion: operative point 25 holds that Russia failed
       to comply with Article 38, the obligation to furnish the Court with
       facilities to establish the facts. It is a breach, and it is a thirteenth
       article, but it is an obligation owed to the Court about the conduct of
       the proceedings, not one of the Convention rights the respondent violated
       against people. This tile counts the rights; the count is twelve. A page
       that wanted thirteen would have to say "articles of the Convention and
       its Protocols breached, Article 38 included", which is not what a reader
       of this tile's own label hears. */
    {
      value: "12",
      label: { uk: "статей Конвенції і протоколів порушено", en: "Convention and Protocol articles breached" },
    },
    {
      value: { uk: "8 років", en: "8 years" },
      label: { uk: "конфлікту охоплює рішення (2014–2022)", en: "of the conflict the judgment covers (2014–2022)" },
    },
  ],

  glance: [
    {
      label: { uk: "Заявники", en: "Applicants" },
      value: { uk: "Україна (×3) і Нідерланди", en: "Ukraine (×3) and the Netherlands" },
    },
    { label: { uk: "Відповідач", en: "Respondent" }, value: { uk: "Російська Федерація", en: "Russian Federation" } },
    { label: { uk: "Склад", en: "Formation" }, value: { uk: "Велика палата (17 суддів)", en: "Grand Chamber (17 judges)" } },
    {
      label: { uk: "Заяви", en: "Applications" },
      value: { uk: "8019/16 · 43800/14 · 28525/20 · 11055/22", en: "8019/16 · 43800/14 · 28525/20 · 11055/22" },
    },
    { label: { uk: "Рішення по суті", en: "Merits judgment" }, value: { uk: "9 липня 2025", en: "9 July 2025" } },
    {
      label: { uk: "Сатисфакція", en: "Just satisfaction" },
      value: { uk: "винесена в окрему стадію", en: "reserved to a separate phase" },
    },
  ],

  timelineTracks: [
    { id: "background", label: { uk: "Передісторія", en: "Background" } },
    { id: "proceedings", label: { uk: "Провадження", en: "Proceedings" } },
    { id: "judgment", label: { uk: "Рішення і далі", en: "Judgment and after" } },
  ],

  timeline: [
    {
      date: { uk: "лист. 2013 — лют. 2014", en: "Nov 2013 – Feb 2014" },
      iso: "2014-02-22",
      track: "background",
      kind: "context",
      label: { uk: "Євромайдан; Янукович виїжджає до Росії", en: "Euromaidan; Yanukovych departs for Russia" },
    },
    {
      date: { uk: "квіт. 2014", en: "Apr 2014" },
      iso: "2014-04-07",
      track: "background",
      kind: "context",
      label: { uk: "Озброєні групи захоплюють схід; проголошено «ДНР»", en: "Armed groups seize the east; the \"DPR\" is proclaimed" },
      note: {
        uk: "6–12 квітня — захоплення СБУ в Луганську, ОДА в Донецьку, Слов'янська групою Гіркіна; 14 квітня Україна починає АТО.",
        en: "6–12 April: the Luhansk SBU, the Donetsk administration and Sloviansk (Girkin's group) are seized; on 14 April Ukraine launches the ATO.",
      },
    },
    {
      date: { uk: "11 трав. 2014", en: "11 May 2014" },
      iso: "2014-05-11",
      track: "background",
      kind: "order",
      label: {
        uk: "З цієї дати Росія має фактичний контроль над районами «ДНР»/«ЛНР»",
        en: "From this date Russia has effective control of the \"DPR\"/\"LPR\" areas",
      },
      note: {
        uk: "Висновок Суду: на момент «референдумів» сепаратистську операцію в цілому вже керувала і координувала Росія — відтоді їхні дії присвоюються їй автоматично.",
        en: "The Court's finding: by the \"referendum\" date the separatist operation was managed and coordinated by Russia — from then on their acts are automatically attributable to it.",
      },
    },
    {
      date: { uk: "17 лип. 2014", en: "17 Jul 2014" },
      iso: "2014-07-17",
      track: "background",
      kind: "context",
      label: { uk: "Збиття MH17: 298 загиблих", en: "MH17 is downed: 298 dead" },
      note: {
        uk: "Ракета «Бук», передана Росією сепаратистам, — серед доказів масштабного військового постачання, встановленого Судом. 196 загиблих — громадяни Нідерландів.",
        en: "The Buk missile Russia supplied to the separatists is among the evidence of large-scale military supply the Court established. 196 of the dead were Dutch nationals.",
      },
    },
    {
      date: { uk: "2014–2022", en: "2014–2022" },
      iso: "2020-07-10",
      track: "proceedings",
      kind: "filing",
      label: {
        uk: "Чотири заяви: Україна (2014, 2016, 2022), Нідерланди (2020)",
        en: "Four applications: Ukraine (2014, 2016, 2022), the Netherlands (2020)",
      },
      note: {
        uk: "Суд об'єднав їх в одне провадження; слухання щодо юрисдикції — 26 січня 2022 року.",
        en: "The Court joined them in one proceeding; the jurisdiction hearing was held on 26 January 2022.",
      },
    },
    {
      date: { uk: "24 лют. 2022", en: "24 Feb 2022" },
      iso: "2022-02-24",
      track: "background",
      kind: "context",
      label: { uk: "Повномасштабне вторгнення", en: "The full-scale invasion" },
      note: {
        uk: "Наступ на чотирьох напрямках; облога Маріуполя до 20 травня; захоплення ЗАЕС; з жовтня — кампанія ударів по енергетиці.",
        en: "Four axes of advance; the siege of Mariupol until 20 May; the seizure of the ZNPP; from October, the energy-strike campaign.",
      },
    },
    {
      date: { uk: "16 бер. / 16 вер. 2022", en: "16 Mar / 16 Sep 2022" },
      iso: "2022-09-16",
      track: "proceedings",
      kind: "order",
      label: {
        uk: "Росію виключено з Ради Європи; Конвенція перестає для неї діяти",
        en: "Russia is expelled from the Council of Europe; the Convention ceases to bind it",
      },
      note: {
        uk: "Суд зберігає юрисдикцію щодо всього до 16 вересня 2022 року — саме до цієї межі сягає рішення.",
        en: "The Court keeps jurisdiction over everything before 16 September 2022 — the judgment reaches exactly that far.",
      },
    },
    {
      date: { uk: "25 січ. 2023", en: "25 Jan 2023" },
      iso: "2023-01-25",
      track: "proceedings",
      kind: "order",
      label: { uk: "Велика палата визнає заяви прийнятними", en: "The Grand Chamber declares the applications admissible" },
    },
    {
      date: { uk: "9 лип. 2025", en: "9 Jul 2025" },
      iso: "2025-07-09",
      track: "judgment",
      kind: "judgment",
      label: {
        uk: "Рішення по суті: Росія відповідальна за системні порушення",
        en: "Merits judgment: Russia responsible for systemic violations",
      },
      /* The 16–1 was attached to the wrong thing here. Checked against the
         judgment's operative part (pp. 493–497, after § 1652): every one of
         the breach findings was unanimous. Twenty-eight of the twenty-nine
         operative points were unanimous, and the exception — point 9 — is not
         a breach at all but the decision that it was not necessary to examine
         the Article 13 complaint separately in respect of MH17. As written
         the sentence said one of the twelve violations had a dissenter. */
      note: {
        uk: "Порушення 12 статей Конвенції і протоколів — усі одностайно. З 29 пунктів резолютивної частини 28 ухвалено одностайно; виняток — рішення не розглядати одну скаргу окремо (16 голосів проти 1).",
        en: "Breaches of 12 Convention and Protocol articles, every one unanimous. Twenty-eight of the twenty-nine operative points were unanimous; the exception is a decision not to examine one complaint separately (16 votes to 1).",
      },
    },
    {
      date: { uk: "попереду", en: "ahead" },
      iso: "2026-01-01",
      track: "judgment",
      kind: "context",
      label: { uk: "Стадія справедливої сатисфакції", en: "The just-satisfaction phase" },
      note: {
        uk: "Компенсації Суд визначить окремим рішенням; виконання наглядає Комітет міністрів РЄ.",
        en: "Compensation will be fixed by a separate ruling; execution is supervised by the CoE Committee of Ministers.",
      },
    },
  ],

  verdictsHeading: { uk: "Що встановив Суд", en: "What the Court found" },

  verdicts: [
    {
      track: "Art. 2",
      claim: {
        uk: "Право на життя: напади на цивільних, збиття MH17, страти полонених",
        en: "Right to life: attacks on civilians, the downing of MH17, executions of prisoners",
      },
      outcome: "violation",
    },
    {
      track: "Art. 3",
      claim: {
        uk: "Катування, сексуальне насильство, нелюдські умови тримання",
        en: "Torture, sexual violence, inhuman conditions of detention",
      },
      outcome: "violation",
    },
    {
      track: "Art. 4 § 2",
      claim: { uk: "Примусова праця", en: "Forced labour" },
      outcome: "violation",
    },
    {
      track: "Art. 5",
      claim: { uk: "Викрадення, незаконні арешти й затримання", en: "Abductions, unlawful arrests and detention" },
      outcome: "violation",
    },
    /* Article 8 stood on this page only inside the children row, where it is
       one of three articles in a single sentence — so the finding that carries
       it in its own right, the administrative practice of forced transfer,
       displacement, filtration and the destruction and looting of homes
       (operative points 11, 16 and 20), had no row at all. */
    {
      track: "Art. 8",
      claim: {
        uk: "Примусове переміщення, фільтрація, знищення і пограбування житла",
        en: "Forced transfer and displacement, filtration, the destruction and looting of homes",
      },
      outcome: "violation",
    },
    {
      track: "Art. 9–10",
      claim: {
        uk: "Переслідування релігійних громад; журналістів і мовників",
        en: "Persecution of religious congregations; of journalists and broadcasters",
      },
      outcome: "violation",
    },
    /* Articles 11 and 13 were missing from the matrix, which is most of why
       the twelve in the stat tile could not be counted off this page. Both are
       in the operative part: point 19, an administrative practice of
       interference with peaceful assembly in violation of Article 11; and
       points 7 and 24, Article 13 taken with Article 2 for MH17 and taken with
       Articles 2, 3, 4 § 2, 5, 8, 9, 10, 11 and 14 and Articles 1 and 2 of
       Protocol No. 1 for the practices. Neither appears in the verbatim
       findings list this matrix otherwise restates, so both are taken from the
       judgment itself (HUDOC 001-244292, pp. 495-496). */
    {
      track: "Art. 11",
      claim: {
        uk: "Втручання у свободу мирних зібрань",
        en: "Interference with the right to peaceful assembly",
      },
      outcome: "violation",
    },
    {
      track: "Art. 13",
      claim: {
        uk: "Відсутність ефективного засобу юридичного захисту — щодо MH17 і щодо всіх адміністративних практик",
        en: "No effective remedy — both for MH17 and for every administrative practice found",
      },
      outcome: "violation",
    },
    {
      track: "P1-1, P1-2",
      claim: {
        uk: "Знищення і привласнення власності; заборона освіти українською",
        en: "Destruction and appropriation of property; the ban on Ukrainian-language education",
      },
      outcome: "violation",
    },
    {
      track: "Art. 14",
      claim: {
        uk: "Дискримінація за етнічністю і проукраїнською позицією (одностайно)",
        en: "Discrimination by ethnicity and pro-Ukrainian stance (unanimous)",
      },
      outcome: "violation",
    },
    /* CHECKED, AND LEFT AS IT STANDS. The verbatim findings block says this
       finding was "in breach of Articles 3, 5 and 8 of the Convention and
       Article 2 of Protocol No. 4 … (by majority)", and this row says only
       Articles 3, 5 and 8, unanimously. The row is the one that matches the
       Court. Operative point 22 reads, in full: "Holds, unanimously, that there
       has been an administrative practice of the transfer to Russia and, in
       many cases, the adoption there of Ukrainian children in violation of
       Articles 3, 5 and 8 of the Convention and that it is not necessary to
       examine separately the complaint under Article 2 of Protocol No. 4 to the
       Convention" (HUDOC 001-244292, p. 496). So P4-2 was declined, not found,
       and the vote was unanimous rather than by a majority — the verbatim
       overstates the holding on both counts.

       The verbatim is not corrected: it is the source document's tab ingested
       unedited, quirks kept, and this is one of the quirks. It is recorded here
       and in docs/research/echr-ukraine-netherlands-sources.md so that the next
       ingest of that tab does not quietly "fix" this row to match it. */
    {
      track: "Діти · Children",
      trackLabel: { uk: "Депортація дітей", en: "Deportation of children" },
      claim: {
        uk: "Ст. 3, 5 і 8: викрадення і переміщення до Росії трьох груп дітей (одностайно)",
        en: "Arts. 3, 5 and 8: abduction and transfer to Russia of three groups of children (unanimously)",
      },
      outcome: "violation",
    },
  ],

  /* Strasbourg, which is where this Court sits. `forumKey` names the marker
     the seat is drawn on and the label beside it comes from `forum.seat`
     above — so with "hague" here the map printed «Страсбург» / "Strasbourg"
     over The Hague's point, and framed the picture from the wrong city. */
  mapFocus: { forumKey: "strasbourg", reachTo: "donetsk" },

  theatres: [
    {
      place: { uk: "Донбас із 2014", en: "The Donbas from 2014" },
      tag: { uk: "КОНТРОЛЬ З 11.05.2014", en: "CONTROL FROM 11 MAY 2014" },
      markerKeys: ["donetsk", "luhansk"],
      areas: ["east"],
      summary: {
        uk: "Фактичний контроль Росії над районами «ДНР»/«ЛНР»; збиття MH17 17 липня 2014 року.",
        en: "Russia's effective control of the \"DPR\"/\"LPR\" areas; the downing of MH17 on 17 July 2014.",
      },
    },
    {
      place: { uk: "Уся Україна з 2022", en: "All of Ukraine from 2022" },
      tag: { uk: "ВТОРГНЕННЯ", en: "INVASION" },
      markerKeys: ["kyiv"],
      areas: ["country"],
      summary: {
        uk: "Повномасштабне вторгнення 24 лютого 2022 року — охоплене рішенням до 16 вересня 2022-го.",
        en: "The full-scale invasion of 24 February 2022 — covered by the judgment up to 16 September 2022.",
      },
    },
  ],

  interpretations: [
    {
      term: { uk: "Конвенція діє і на війні", en: "The Convention applies in war" },
      ruling: {
        uk: "Конвенція застосовується в ситуаціях збройного конфлікту, її гарантії не витісняються МГП, а тлумачаться в гармонії з ним (ст. 31(3)(c) ВКПМД).",
        en: "The Convention applies in armed conflict; IHL does not displace its guarantees — the two are interpreted in harmony (VCLT art. 31(3)(c)).",
      },
    },
    {
      term: { uk: "Відхід від Georgia v. Russia (II)", en: "The turn from Georgia v. Russia (II)" },
      ruling: {
        uk: "«Контекст хаосу» більше не виключає юрисдикцію: стратегічно спланована кампанія нападів — це здійснення влади і контролю, тож Конвенція діє й в активній фазі бойових дій.",
        en: "\"Context of chaos\" no longer defeats jurisdiction: a strategically planned campaign of attacks is an exercise of authority and control, so the Convention reaches the active phase of hostilities.",
      },
    },
    {
      term: { uk: "Персональна юрисдикція через летальну силу", en: "Personal jurisdiction through lethal force" },
      ruling: {
        uk: "Держава, що застосовує летальну силу на території іншої держави і вбиває особу, здійснює над нею владу і контроль — Конвенція застосовується за ст. 1.",
        en: "A State that uses lethal force on another State's territory and kills a person exercises authority and control over them — the Convention applies under Article 1.",
      },
    },
    {
      term: { uk: "Автоматичне присвоєння", en: "Automatic attribution" },
      ruling: {
        uk: "Після встановлення фактичного контролю дії та бездіяльність сепаратистів присвоюються Росії автоматично — окремого доказування по кожному епізоду не потрібно.",
        en: "Once effective control is established, the separatists' acts and omissions are attributable to Russia automatically — no episode-by-episode proof is needed.",
      },
    },
    {
      term: { uk: "Межа юрисдикції: 16.09.2022", en: "The jurisdictional edge: 16 Sep 2022" },
      ruling: {
        uk: "Виключення з Ради Європи не звільнило Росію від відповідальності за минуле: Суд розглядає все до дати, коли Конвенція перестала для неї діяти.",
        en: "Expulsion from the Council of Europe did not erase past responsibility: the Court examines everything up to the date the Convention ceased to bind Russia.",
      },
    },
  ],

  sources: [
    // — official record —
    {
      url: "https://hudoc.echr.coe.int/eng#{%22appno%22:[%2243800/14%22],%22itemid%22:[%22001-244292%22]}",
      title: "Ukraine and the Netherlands v. Russia [GC] — merits judgment (HUDOC)",
      authors: "",
      publication: "European Court of Human Rights",
      date: "9 July 2025",
      type: "official/award",
    },
    {
      url: "https://www.echr.coe.int/w/ukraine-and-the-netherlands-v.-russia-nos.-8019/16-43800/14-and-28525/20-1",
      title: "Case page: Ukraine and the Netherlands v. Russia (nos. 8019/16, 43800/14, 28525/20 and 11055/22)",
      authors: "",
      publication: "European Court of Human Rights",
      date: "2025",
      type: "official/award",
    },
    {
      url: "https://jusmundi.com/en/document/decision/en-ukraine-and-the-netherlands-v-russian-federation-decision-of-the-grand-chamber-of-the-european-court-of-human-rights-wednesday-25th-january-2023",
      title: "Admissibility decision of the Grand Chamber (25 January 2023)",
      authors: "",
      publication: "Jus Mundi",
      date: "25 January 2023",
      type: "official/award",
    },
    // — the doc's research links —
    {
      url: "https://www.ejiltalk.org/harmonious-interpretation-lex-specialis-and-ihl-compliance-in-ukraine-and-the-netherlands-v-russia-an-open-question-on-the-right-to-life/",
      title: "Harmonious Interpretation, Lex Specialis, and IHL-Compliance: An Open Question on the Right to Life",
      authors: "Miles Jackson, Dapo Akande",
      publication: "EJIL: Talk!",
      date: "2025",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/grand-chamber-judgment-in-ukraine-and-the-netherlands-v-russia-forthcoming-next-week/",
      title: "Grand Chamber Judgment in Ukraine and the Netherlands v. Russia Forthcoming Next Week",
      authors: "Marko Milanovic",
      publication: "EJIL: Talk!",
      date: "2025",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/the-european-courts-merits-judgment-in-ukraine-and-the-netherlands-v-russia-as-good-as-it-gets-almost/",
      title: "The European Court's Merits Judgment in Ukraine and the Netherlands v. Russia: As Good as It Gets (Almost)",
      authors: "Marko Milanovic",
      publication: "EJIL: Talk!",
      date: "2025",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/control-in-the-context-of-chaos-the-war-in-ukraine-and-russias-jurisdiction-under-the-echr/",
      title: "Control in the Context of Chaos: The War in Ukraine and Russia's Jurisdiction under the ECHR",
      authors: "",
      publication: "EJIL: Talk!",
      date: "2022",
      type: "blog post",
    },
    {
      url: "https://www.ejiltalk.org/non-recognition-of-de-facto-regimes-in-case-law-of-the-european-court-of-human-rights-implications-for-cases-involving-crimea-and-eastern-ukraine/",
      title: "(Non-)Recognition of De Facto Regimes in Case Law of the ECtHR: Implications for Crimea and Eastern Ukraine",
      authors: "Gaiane Nuridzhanian",
      publication: "EJIL: Talk!",
      date: "2022",
      type: "blog post",
    },
    // — context added by this page —
    {
      url: "https://strasbourgobservers.com/2025/07/23/the-judgment-in-ukraine-and-the-netherlands-v-russia-a-nicaragua-moment-for-the-ecthr/",
      title: "The Judgment in Ukraine and the Netherlands v. Russia: A \"Nicaragua Moment\" for the ECtHR?",
      authors: "",
      publication: "Strasbourg Observers",
      date: "23 July 2025",
      type: "blog post",
    },
    {
      url: "https://www.twentyessex.com/grand-chamber-of-the-european-court-of-human-rights-issues-judgment-in-ukraine-and-the-netherlands-v-russian-federation/",
      title: "Grand Chamber issues judgment in Ukraine and The Netherlands v Russian Federation",
      authors: "",
      publication: "Twenty Essex",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://jurfem.com.ua/en/conflict-related-sexual-violence-in-the-ecthr-judgment-ukraine-and-the-netherlands-v-russia-a-historic-step-towards-accountability/",
      title: "Conflict-related sexual violence in the judgment: a historic step towards accountability",
      authors: "",
      publication: "JurFem",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://ulag.org.ua/articles-and-publications/ecthr-ukraine-netherlands-v-russia/",
      title: "Analysis of the ECtHR Judgment in Ukraine and the Netherlands v. Russia",
      authors: "",
      publication: "Ukrainian Legal Advisory Group",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://queritius.com/landmark-for-justice-key-legal-takeaways-from-the-echr-grand-chambers-judgment-in-ukraine-and-the-netherlands-v-russia/",
      title: "Landmark for Justice: Key Legal Takeaways from the Grand Chamber's Judgment",
      authors: "",
      publication: "Queritius",
      date: "2025",
      type: "news/insight",
    },
  ],
};

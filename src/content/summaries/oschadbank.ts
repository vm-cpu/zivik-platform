import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./oschadbank.verbatim.json";
import verbatimUk from "./oschadbank.uk.json";

/**
 * JSC Oschadbank v. The Russian Federation, PCA Case No. 2016-14,
 * Award of 26 November 2018.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source
 * document. The fields below add the visualization layer. Two rules govern it:
 *
 *  1. Everything up to and including the dispositif restates the Award itself,
 *     and every figure appears in that prose — the 294 outlets, the 45% and
 *     16.5% market shares, the three heads of loss, the LIBOR + 2% rate.
 *  2. Everything dated after 26 November 2018 — the French set-aside rounds,
 *     the 2023 revision request, the 2025 seizure and the pending US
 *     confirmation — is *not* in the Award. It is court and press record, and
 *     it is kept in `afterlife`, `objections` and the later timeline entries,
 *     each carrying its own citation, so a reader can always tell what the
 *     tribunal decided from what happened to the award afterwards.
 *
 * Chrome and analysis are bilingual; the verbatim body stays in English, the
 * language of the Award.
 */
export const oschadbank: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  // Ukrainian translation of the body, structurally 1:1 with the English
  // (same 104 blocks, same kinds) — draft, pending legal review.
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  /* This docket is live, so the page needs a date on its out-of-record figures
     — it had none, while carrying enforcement facts into 2026.

     Checked 27 August 2026 against Jus Mundi's case page (PCA 2016-14, its own
     "Updated on: 10 Aug 2026"). Four entries postdate the last one in the
     timeline below, and they are NOT written up here because their texts are
     not yet published — Jus Mundi has them as "Summary coming soon":

       Judgment, Paris Court of Appeal (pôle 5 ch. 16) 24/05331 — 23 June 2026
       Judgment, Paris Court of Appeal (pôle 5 ch. 16) 24/16339 — 23 June 2026
       Consent Order, High Court of Justice of England and Wales — 13 July 2026
       Resumed Revision Proceeding (pending) — 19 July 2026

     The last of those bears directly on the wording of the 1 July 2025 entry,
     which says the award is final in France: a revision proceeding has been
     resumed and is pending. Do not soften or restate that line by guesswork —
     read 24/05331 and 24/16339 first, then say what they held. */
  asOf: "2026-08-27",
  title: {
    uk: "Ощадбанк проти Російської Федерації",
    en: "JSC Oschadbank v. the Russian Federation",
  },

  forum: {
    institution: {
      uk: "Постійна палата третейського суду",
      en: "Permanent Court of Arbitration",
    },
    seat: { uk: "Париж", en: "Paris" },
  },

  plain: {
    tldr: {
      uk: "Ощадбанк — державний банк України — до 2014 року мав у Криму 294 відділення. Після анексії російські закони й Банк Росії зробили роботу банку неможливою, а його активи перейшли під управління російського фонду. Арбітраж у Парижі визнав це незаконною експропріацією і присудив банку понад 1,1 млрд доларів. Росія в процесі не брала участі й досі не заплатила.",
      en: "Oschadbank is Ukraine's state savings bank. Until 2014 it ran 294 outlets in Crimea. After the annexation, Russian law and the Bank of Russia made the business impossible to run, and a Russian fund took over its assets. A tribunal sitting in Paris found this to be an unlawful expropriation and awarded the bank more than USD 1.1 billion. Russia did not take part in the arbitration and has not paid.",
    },
    whyMatters: {
      uk: "Це один із перших «кримських» арбітражів, який пройшов повну перевірку в судах Франції та дійшов до стадії стягнення. Він показує робочу схему: інвестиційний договір 1998 року застосовується до Криму за критерієм фактичного контролю, а рішення можна виконувати за рахунок російських активів за кордоном.",
      en: "This is one of the first Crimea expropriation awards to survive full set-aside review and reach enforcement. It shows a working route: the 1998 investment treaty applies to Crimea on an effective-control test, and the award can be enforced against Russian state assets abroad.",
    },
  },

  glossary: [
    {
      term: { uk: "ДІД (BIT)", en: "BIT" },
      def: {
        uk: "Двосторонній інвестиційний договір — угода двох держав про захист інвестицій їхніх компаній. Тут: угода Україна–Росія від 27 листопада 1998 року.",
        en: "Bilateral investment treaty — an agreement between two States protecting each other's investors. Here: the Ukraine–Russia treaty of 27 November 1998.",
      },
    },
    {
      term: { uk: "Експропріація", en: "Expropriation" },
      def: {
        uk: "Вилучення державою інвестиції. Може бути прямою (націоналізація) або непрямою — коли заходи держави позбавляють власника економічної користі від активу.",
        en: "A State taking an investment. It can be direct (nationalisation) or indirect — measures that strip the owner of the economic use of the asset.",
      },
    },
    {
      term: { uk: "«Повзуча» експропріація", en: "Creeping expropriation" },
      def: {
        uk: "Серія заходів, кожен з яких сам собою не є вилученням, але разом вони дають той самий результат.",
        en: "A series of measures, none decisive on its own, that together produce the same result as a taking.",
      },
    },
    {
      term: { uk: "Присвоєння поведінки", en: "Attribution" },
      def: {
        uk: "Правило, за яким дії конкретного органу чи особи вважаються діями держави. Кодифіковане у Статтях КМП ООН про відповідальність держав.",
        en: "The rule that decides whose conduct counts as the State's. Codified in the ILC Articles on State Responsibility.",
      },
    },
    {
      term: { uk: "UNCITRAL Rules", en: "UNCITRAL Rules" },
      def: {
        uk: "Арбітражний регламент ЮНСІТРАЛ (тут — редакція 1976 року): процедурні правила розгляду, не пов'язані з жодним постійним судом.",
        en: "The UNCITRAL Arbitration Rules (here, the 1976 version): procedural rules for an arbitration, not tied to any standing court.",
      },
    },
    {
      term: { uk: "Місце арбітражу", en: "Seat of arbitration" },
      def: {
        uk: "Юридична «прописка» арбітражу. Визначає, суди якої країни можуть скасувати рішення. Тут — Париж, тому справу перевіряли французькі суди.",
        en: "The legal home of an arbitration. It decides which national courts may set the award aside. Here Paris, so the French courts reviewed it.",
      },
    },
    {
      term: { uk: "Скасування рішення", en: "Set-aside / annulment" },
      def: {
        uk: "Перевірка рішення судом за місцем арбітражу. Суд не переглядає спір по суті, а перевіряє, зокрема, чи мав арбітраж юрисдикцію.",
        en: "Review of an award by the courts of the seat. Those courts do not re-hear the dispute; they check matters such as whether the tribunal had jurisdiction.",
      },
    },
    {
      term: { uk: "Розгляд за відсутності сторони", en: "Non-appearance" },
      def: {
        uk: "Якщо належно повідомлена сторона не бере участі, арбітраж усе одно розглядає справу на основі наявних доказів (ст. 28 Регламенту).",
        en: "Where a duly notified party stays away, the tribunal still decides the case on the evidence before it (Article 28 of the Rules).",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "АТ «Ощадбанк»", en: "JSC Oschadbank" },
      role: {
        uk: "Позивач. Державний ощадний банк України; у Криму працював через сімферопольську філію.",
        en: "Claimant. Ukraine's state savings bank; it ran its Crimean business through a Simferopol branch.",
      },
      kind: "party",
    },
    {
      name: { uk: "Російська Федерація", en: "Russian Federation" },
      role: {
        uk: "Відповідач. Участі в арбітражі не брала — лише оспорила юрисдикцію листами.",
        en: "Respondent. It did not take part in the arbitration, beyond letters contesting jurisdiction.",
      },
      kind: "party",
    },
    {
      name: { uk: "Склад арбітражу (PCA)", en: "The tribunal (PCA)" },
      role: {
        uk: "Склад арбітражу за Регламентом ЮНСІТРАЛ 1976 року; справу адміністрував Постійний арбітражний суд, місце арбітражу — Париж.",
        en: "The tribunal constituted under the 1976 UNCITRAL Rules and administered by the Permanent Court of Arbitration; the seat was Paris.",
      },
      kind: "court",
    },
    {
      name: { uk: "Банк Росії", en: "Bank of Russia" },
      role: {
        uk: "Центральний банк РФ. 26 травня 2014 року заборонив філії банківську діяльність у Криму.",
        en: "Russia's central bank. On 26 May 2014 it barred the branch from banking activity in Crimea.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Фонд захисту вкладників (ФЗВ)", en: "Depositor Protection Fund" },
      role: {
        uk: "Створений російським законом; виплачував вкладникам, перебрав управління активами банку і подавав до нього регресні вимоги.",
        en: "Created by Russian law; it paid out depositors, took over the bank's assets and pursued recourse claims against it.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Україна", en: "Ukraine" },
      role: {
        uk: "Не сторона спору. Подала письмову позицію як третя сторона щодо тлумачення слова «територія».",
        en: "Not a party. It filed a non-disputing party submission on the meaning of “territory”.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: { uk: "Чи отримав Ощадбанк гроші?", en: "Has Oschadbank been paid?" },
      a: {
        uk: "Добровільно — ні. Стягнення йде через арешт російських державних активів за кордоном: у квітні 2025 року у Франції заарештовано майна приблизно на 87 млн євро — це близько 6% від основної суми. Процедура визнання рішення у США триває.",
        en: "Not voluntarily. Recovery runs through attaching Russian state assets abroad: in April 2025 about EUR 87 million of property was seized in France, roughly 6% of the principal. Confirmation proceedings in the United States are pending.",
      },
    },
    {
      q: {
        uk: "Чи означає рішення, що Крим — російський?",
        en: "Does the award say Crimea is Russian?",
      },
      a: {
        uk: "Ні. Арбітраж прямо відмовився висловлюватися про суверенітет. Він вирішував інше питання: хто з двох держав ніс договірні обов'язки перед інвесторами в Криму після березня 2014 року. Відповідь — Росія, бо вона мала фактичний контроль. Це працює проти неї, а не на її користь.",
        en: "No. The tribunal expressly declined to comment on sovereignty. It answered a different question: which of the two States owed treaty obligations to investors in Crimea after March 2014. The answer was Russia, because it had effective control — which cuts against Russia, not for it.",
      },
    },
    {
      q: {
        uk: "Чому справу розглядали французькі суди?",
        en: "Why did French courts get involved?",
      },
      a: {
        uk: "Місцем арбітражу був Париж, тож заяву Росії про скасування рішення розглядали суди Франції. Апеляційний суд Парижа скасував рішення у 2021 році, Касаційний суд це скасування відмінив у 2022-му, і 1 липня 2025 року апеляційний суд відхилив усі заперечення Росії.",
        en: "The seat of the arbitration was Paris, so Russia's set-aside application went to the French courts. The Paris Court of Appeal annulled the award in 2021, the Cour de cassation reversed that annulment in 2022, and on 1 July 2025 the Court of Appeal rejected all of Russia's grounds.",
      },
    },
    {
      q: { uk: "Що далі?", en: "What happens next?" },
      a: {
        uk: "Два напрями. Перший — стягнення: рішення остаточне у Франції, тривають процедури у Франції та США. Другий — новий спір: 24 липня 2025 року Ощадбанк повідомив Росію про претензії за тим самим договором щодо втрат на Донеччині, Луганщині, Херсонщині та Запоріжжі. Це окрема справа, рішення в ній ще немає.",
        en: "Two tracks. Enforcement: the award is final in France, and proceedings continue in France and the United States. And a new claim: on 24 July 2025 Oschadbank notified Russia of a dispute under the same treaty over losses in Donetsk, Luhansk, Kherson and Zaporizhzhia. That is a separate case, with no ruling yet.",
      },
    },
    {
      q: {
        uk: "Чому Росія не брала участі в арбітражі?",
        en: "Why did Russia not take part?",
      },
      a: {
        uk: "Росія заперечувала юрисдикцію арбітражу і обмежилася листами. Стаття 28 Регламенту ЮНСІТРАЛ дозволяє арбітражу розглянути справу за наявними доказами. Арбітраж зазначив, що через неявку відповідача мав «більший, ніж зазвичай, обов'язок» ретельно перевірити доказову базу.",
        en: "Russia denied the tribunal's jurisdiction and confined itself to letters. Article 28 of the UNCITRAL Rules lets a tribunal proceed on the evidence before it. The tribunal noted that the non-appearance placed on it “a heavier than usual obligation” to test that evidence.",
      },
    },
    {
      q: {
        uk: "Чому арбітраж не розглянув інші вимоги банку?",
        en: "Why were the bank's other claims left undecided?",
      },
      a: {
        uk: "З міркувань процесуальної економії. Встановивши порушення статті 5(1), арбітраж зазначив, що вимоги за статтями 2(2), 3(1), 4 і 7 та щодо відмови у правосудді не змінили б розміру відшкодування.",
        en: "Judicial economy. Having found a breach of Article 5(1), the tribunal held that the claims under Articles 2(2), 3(1), 4 and 7, and the denial-of-justice claim, would not have changed the damages.",
      },
    },
  ],

  related: [
    {
      label: {
        uk: "ПАТ «Укрнафта» проти РФ",
        en: "PJSC Ukrnafta v. Russian Federation",
      },
      note: { uk: "PCA 2015-34 · той самий ДІД", en: "PCA 2015-34 · same treaty" },
      href: "#registry",
    },
    {
      label: {
        uk: "АТ «ДТЕК Крименерго» проти РФ",
        en: "JSC DTEK Krymenergo v. Russian Federation",
      },
      note: {
        uk: "PCA 2018-41 · енергомережа Криму",
        en: "PCA 2018-41 · Crimea's power grid",
      },
      href: "/cases/dtek-krymenergo",
    },
    {
      label: {
        uk: "МКБФТ і МКЛРД (Україна проти РФ)",
        en: "ICSFT and CERD (Ukraine v. Russian Federation)",
      },
      note: { uk: "Міжнародний суд ООН · Крим і Донбас", en: "ICJ · Crimea and Donbas" },
      href: "/cases/icj-cerd-icsft",
    },
  ],

  judgment: {
    court: { uk: "Постійна палата третейського суду", en: "Permanent Court of Arbitration" },
    url: "https://jusmundi.com/en/document/decision/en-oschadbank-v-russian-federation-none-currently-available-friday-1st-january-2016#decision_4484",
    // The PCA does not publish a case page for this arbitration; italaw carries
    // the public docket, including the French court decisions.
    caseUrl: "https://www.italaw.com/cases/7491",
    date: "2018-11-26",
    readLabel: { uk: "Читати рішення", en: "Read the award" },
    fileLabel: { uk: "Матеріали справи", en: "Case documents" },
  },

  instruments: [
    {
      abbr: "BIT",
      name: {
        uk: "Угода між Урядом РФ і Кабінетом Міністрів України про заохочення та взаємний захист інвестицій",
        en: "Agreement between the Government of the Russian Federation and the Cabinet of Ministers of Ukraine on the Encouragement and Mutual Protection of Investments",
      },
      year: 1998,
      url: "https://investmentpolicy.unctad.org/international-investment-agreements/treaties/bilateral-investment-treaties/2907/russian-federation---ukraine-bit-1998-",
    },
    {
      abbr: "UNCITRAL Rules",
      name: {
        uk: "Арбітражний регламент ЮНСІТРАЛ",
        en: "UNCITRAL Arbitration Rules",
      },
      year: 1976,
      url: "https://uncitral.un.org/en/texts/arbitration/conventions/foreign_arbitral_awards",
    },
  ],

  stats: [
    {
      value: { uk: "$1,11 млрд", en: "$1.11B" },
      label: { uk: "присуджено 26 листопада 2018", en: "awarded on 26 November 2018" },
      em: true,
    },
    {
      value: { uk: "9,5", en: "9.5" },
      label: { uk: "років від позову до фіналу", en: "years, filing to final ruling" },
    },
    {
      value: { uk: "€87 млн", en: "€87M" },
      label: { uk: "активів РФ арештовано у Франції", en: "Russian assets seized in France" },
    },
    {
      value: { uk: "3 з 3", en: "3 of 3" },
      label: { uk: "заперечень щодо юрисдикції відхилено", en: "jurisdiction objections rejected" },
    },
  ],

  glance: [
    { label: { uk: "Позивач", en: "Claimant" }, value: { uk: "АТ «Ощадбанк»", en: "JSC Oschadbank" } },
    {
      label: { uk: "Відповідач", en: "Respondent" },
      value: { uk: "Російська Федерація", en: "Russian Federation" },
    },
    {
      label: { uk: "Установа", en: "Institution" },
      value: { uk: "Постійна палата третейського суду", en: "Permanent Court of Arbitration" },
    },
    { label: { uk: "Місце арбітражу", en: "Seat" }, value: { uk: "Париж", en: "Paris" } },
    {
      label: { uk: "Регламент", en: "Rules" },
      value: { uk: "ЮНСІТРАЛ, 1976", en: "UNCITRAL, 1976" },
    },
    { label: { uk: "Номер справи", en: "Case number" }, value: { uk: "PCA 2016-14", en: "PCA 2016-14" } },
    {
      label: { uk: "Рішення", en: "Award" },
      value: { uk: "26 листопада 2018", en: "26 November 2018" },
    },
  ],

  timelineTracks: [
    { id: "background", label: { uk: "Передісторія", en: "Background" } },
    { id: "arbitration", label: { uk: "Арбітраж", en: "Arbitration" } },
    { id: "french-courts", label: { uk: "Суди Франції", en: "French courts" } },
    { id: "enforcement", label: { uk: "Стягнення", en: "Enforcement" } },
  ],

  timeline: [
    {
      date: { uk: "27 лист. 1998", en: "27 Nov 1998" },
      iso: "1998-11-27",
      track: "background",
      kind: "context",
      label: {
        uk: "Росія й Україна підписують інвестиційний договір",
        en: "Russia and Ukraine sign a bilateral investment treaty",
      },
      note: {
        uk: "Той самий договір через два десятиліття стане підставою позову. Він набув чинності 27 січня 2000 року.",
        en: "The same treaty becomes the basis of the claim two decades later. It entered into force on 27 January 2000.",
      },
    },
    {
      date: { uk: "лют.–бер. 2014", en: "Feb–Mar 2014" },
      iso: "2014-03-01",
      track: "background",
      kind: "context",
      label: {
        uk: "Росія встановлює контроль над Кримом",
        en: "Russia takes control of Crimea",
      },
      note: {
        uk: "Від присутності військових наприкінці лютого до федеральних законів про приєднання 21 березня 2014 року.",
        en: "From the military presence in late February to the federal accession laws of 21 March 2014.",
      },
    },
    {
      date: { uk: "2 квіт. 2014", en: "2 Apr 2014" },
      iso: "2014-04-02",
      track: "background",
      kind: "context",
      label: {
        uk: "Ухвалено закони, що зробили роботу банку неможливою",
        en: "The two laws that made the business impossible to run",
      },
      note: {
        uk: "Федеральні закони № 37 і № 39: обслуговування в рублях, розкриття реєстру вкладників за 15 днів, створення Фонду захисту вкладників.",
        en: "Federal Laws No. 37 and No. 39: service in rubles, a depositor register within 15 days, and the creation of the Depositor Protection Fund.",
      },
    },
    {
      date: { uk: "26 трав. 2014", en: "26 May 2014" },
      iso: "2014-05-26",
      track: "background",
      kind: "context",
      label: {
        uk: "Банк Росії забороняє діяльність кримської філії",
        en: "The Bank of Russia bars the Crimean branch",
      },
      note: {
        uk: "Через три дні суд у Сімферополі передав усі активи банку під управління Фонду захисту вкладників.",
        en: "Three days later a Simferopol court placed all of the bank's assets under the Depositor Protection Fund.",
      },
    },
    {
      date: { uk: "8 лип. 2015", en: "8 Jul 2015" },
      iso: "2015-07-08",
      track: "arbitration",
      kind: "filing",
      label: {
        uk: "Ощадбанк повідомляє Росію про спір",
        en: "Oschadbank notifies Russia of the dispute",
      },
      note: {
        uk: "Стаття 9(1) договору вимагає спробувати домовитися, перш ніж іти в арбітраж.",
        en: "Article 9(1) of the treaty requires an attempt to settle before arbitration.",
      },
    },
    {
      date: { uk: "20 січ. 2016", en: "20 Jan 2016" },
      iso: "2016-01-20",
      track: "arbitration",
      kind: "filing",
      label: { uk: "Початок арбітражу", en: "The arbitration begins" },
      note: {
        uk: "Вручено повідомлення про арбітраж. Росія юрисдикцію заперечила, але участі не взяла.",
        en: "The Notice of Arbitration is served. Russia contested jurisdiction but never appeared.",
      },
    },
    {
      date: { uk: "27–29 бер. 2017", en: "27–29 Mar 2017" },
      iso: "2017-03-27",
      track: "arbitration",
      kind: "order",
      label: { uk: "Слухання у Парижі", en: "Hearing in Paris" },
      note: {
        uk: "Юрисдикція і суть — за одне засідання. Арбітраж окремо допитував експерта з оцінки збитків.",
        en: "Jurisdiction and merits in one hearing. The tribunal questioned the damages expert at length.",
      },
    },
    {
      date: { uk: "26 лист. 2018", en: "26 Nov 2018" },
      iso: "2018-11-26",
      track: "arbitration",
      kind: "judgment",
      label: {
        uk: "Рішення: Росія має сплатити понад 1,1 млрд доларів",
        en: "Final award: Russia ordered to pay over USD 1.1 billion",
      },
      note: {
        uk: "Арбітраж підтвердив свою юрисдикцію і визнав незаконну експропріацію інвестицій банку в Криму.",
        en: "The tribunal upheld its jurisdiction and found the unlawful expropriation of the bank's Crimean investments.",
      },
    },
    {
      date: { uk: "30 бер. 2021", en: "30 Mar 2021" },
      iso: "2021-03-30",
      track: "french-courts",
      kind: "order",
      label: {
        uk: "Апеляційний суд Парижа скасовує рішення",
        en: "Paris Court of Appeal sets the award aside",
      },
      note: {
        uk: "Підстава — темпоральна: суд вважав, що договір не охоплює інвестиції, зроблені до його укладення.",
        en: "On temporal grounds: the court held the treaty did not cover investments made before it existed.",
      },
    },
    {
      date: { uk: "7 груд. 2022", en: "7 Dec 2022" },
      iso: "2022-12-07",
      track: "french-courts",
      kind: "order",
      label: {
        uk: "Касаційний суд скасовує анулювання",
        en: "Cour de cassation reverses the annulment",
      },
      note: {
        uk: "Cour de cassation, civ. 1ère, № 21-15.390: у тексті договору немає темпорального обмеження. Справу повернуто на новий розгляд.",
        en: "Cour de cassation, civ. 1ère, no. 21-15.390: the treaty text contains no temporal limit. The case was remanded.",
      },
    },
    {
      date: { uk: "11 груд. 2023", en: "11 Dec 2023" },
      iso: "2023-12-11",
      track: "arbitration",
      kind: "order",
      label: {
        uk: "Арбітраж відхиляє заяву Росії про перегляд",
        en: "The tribunal dismisses Russia's revision request",
      },
      note: {
        uk: "Паралельно зі спробою скасувати рішення у Франції Росія просила сам арбітраж переглянути його.",
        en: "In parallel with the French set-aside, Russia asked the tribunal itself to revise the award.",
      },
    },
    {
      date: { uk: "квіт. 2025", en: "Apr 2025" },
      iso: "2025-04-01",
      track: "enforcement",
      kind: "order",
      label: {
        uk: "У Франції арештовано російського майна на €87 млн",
        en: "EUR 87 million of Russian property seized in France",
      },
      note: {
        uk: "Перше відчутне стягнення за рішенням — близько 6% основної суми.",
        en: "The first substantial recovery under the award — about 6% of the principal.",
      },
    },
    {
      date: { uk: "1 лип. 2025", en: "1 Jul 2025" },
      iso: "2025-07-01",
      track: "french-courts",
      kind: "judgment",
      label: {
        uk: "Апеляційний суд Парижа залишає рішення в силі",
        en: "Paris Court of Appeal upholds the award",
      },
      note: {
        uk: "Cour d'appel de Paris, pôle 5 ch. 16, № 24/05336: усі три заперечення щодо юрисдикції відхилено. У Франції рішення остаточне.",
        en: "Cour d'appel de Paris, pôle 5 ch. 16, no. 24/05336: all three jurisdiction objections rejected. The award is final in France.",
      },
    },
    {
      date: { uk: "24 лип. 2025", en: "24 Jul 2025" },
      iso: "2025-07-24",
      track: "arbitration",
      kind: "context",
      label: {
        uk: "Ощадбанк заявляє про другий спір проти Росії",
        en: "Oschadbank notifies Russia of a second dispute",
      },
      note: {
        uk: "Окрема справа за тим самим договором 1998 року — про втрати на Донеччині, Луганщині, Херсонщині та Запоріжжі. Це повідомлення про спір, а не рішення; склад арбітражу формується.",
        en: "A separate case under the same 1998 treaty, over losses in Donetsk, Luhansk, Kherson and Zaporizhzhia. This is a notice of dispute, not a ruling; the tribunal is being constituted.",
      },
    },
    {
      date: { uk: "27 січ. 2026", en: "27 Jan 2026" },
      iso: "2026-01-27",
      track: "enforcement",
      kind: "context",
      label: {
        uk: "Триває процедура визнання рішення у США",
        en: "US confirmation proceedings continue",
      },
      note: {
        uk: "Стягнення розширюється на інші юрисдикції, де є російські державні активи.",
        en: "Recovery extends to other jurisdictions where Russian state assets can be found.",
      },
    },
  ],

  verdictsHeading: { uk: "Що вирішив арбітраж", en: "What the tribunal decided" },

  verdicts: [
    {
      track: "Jurisdiction",
      trackLabel: { uk: "Юрисдикція", en: "Jurisdiction" },
      claim: {
        uk: "«Територія» договору охоплює Крим після березня 2014 року",
        en: "Treaty “territory” covers Crimea after March 2014",
      },
      outcome: "granted",
    },
    {
      track: "Jurisdiction",
      trackLabel: { uk: "Юрисдикція", en: "Jurisdiction" },
      claim: {
        uk: "Кримська філія — «інвестиція» за ст. 1(1)",
        en: "The Crimean branch is an “investment” under Art. 1(1)",
      },
      outcome: "granted",
    },
    {
      track: "Jurisdiction",
      trackLabel: { uk: "Юрисдикція", en: "Jurisdiction" },
      claim: {
        uk: "Ощадбанк — «інвестор» за договором",
        en: "Oschadbank is an “investor” under the treaty",
      },
      outcome: "granted",
    },
    {
      track: "Jurisdiction",
      trackLabel: { uk: "Юрисдикція", en: "Jurisdiction" },
      claim: {
        uk: "Заперечення Росії щодо юрисдикції",
        en: "Russia's objections to jurisdiction",
      },
      outcome: "rejected",
    },
    {
      track: "Merits",
      trackLabel: { uk: "Суть спору", en: "Merits" },
      claim: {
        uk: "Ст. 5(1) — незаконна експропріація",
        en: "Art. 5(1) — unlawful expropriation",
      },
      outcome: "violation",
    },
    {
      track: "Merits",
      trackLabel: { uk: "Суть спору", en: "Merits" },
      claim: {
        uk: "Ст. 2(2), 3(1), 4, 7 і відмова у правосудді",
        en: "Arts. 2(2), 3(1), 4, 7 and denial of justice",
      },
      outcome: "not-decided",
    },
    {
      track: "Remedies",
      trackLabel: { uk: "Наслідки", en: "Remedies" },
      claim: {
        uk: "Відшкодування — 1 111 300 729 доларів",
        en: "Damages — USD 1,111,300,729",
      },
      outcome: "granted",
    },
    {
      track: "Remedies",
      trackLabel: { uk: "Наслідки", en: "Remedies" },
      claim: {
        uk: "Відсотки: 6-місячний LIBOR + 2%, складні, річні",
        en: "Interest: six-month USD LIBOR + 2%, compounded annually",
      },
      outcome: "granted",
    },
    {
      track: "Remedies",
      trackLabel: { uk: "Наслідки", en: "Remedies" },
      claim: {
        uk: "Витрати на арбітраж і правову допомогу",
        en: "Costs of the arbitration and legal fees",
      },
      outcome: "granted",
    },
  ],

  mapFocus: { forumKey: "paris", reachTo: "crimea" },

  theatres: [
    {
      place: { uk: "Крим", en: "Crimea" },
      tag: "BIT 1998",
      markerKeys: ["crimea"],
      areas: ["crimea"],
      summary: {
        uk: "294 відділення, найбільший кредитний портфель півострова — активи, які банк втратив у 2014 році.",
        en: "294 outlets and the peninsula's largest loan book — the assets the bank lost in 2014.",
      },
    },
  ],

  takings: {
    heading: { uk: "Що було втрачено", en: "What was taken" },
    note: {
      uk: "Наприкінці 2013 року кримська філія була другою за депозитами і першою за кредитуванням на півострові. Примусове закриття прибрало найбільшого кредитора регіону за один квартал.",
      en: "At the end of 2013 the Crimean branch was second in deposits and first in lending on the peninsula. The forced closure removed the region's largest lender in a single quarter.",
    },
    metrics: [
      {
        label: { uk: "Відділень утрачено", en: "Branch outlets lost" },
        value: "294",
        count: 294,
        note: { uk: "одна позначка — одне відділення", en: "one mark per outlet" },
      },
      {
        label: { uk: "Частка кредитування в Криму", en: "Share of lending in Crimea" },
        value: "45%",
        percent: 45,
      },
      {
        label: { uk: "Частка роздрібних депозитів", en: "Share of retail deposits" },
        value: { uk: "16,5%", en: "16.5%" },
        percent: 16.5,
      },
      {
        label: { uk: "Кредити групі ActivSolar", en: "Loans to the ActivSolar Group" },
        value: "> USD 500,000,000",
        note: { uk: "16 кредитних ліній", en: "16 loan facilities" },
      },
      {
        label: { uk: "Договорів оренди розірвано", en: "Lease agreements terminated" },
        value: "85",
        note: {
          uk: "понад 80 приміщень зайняв РНКБ",
          en: "over 80 outlets taken over by RNCB",
        },
      },
      {
        label: { uk: "Вилучено під час рейдів", en: "Seized in the May 2014 raids" },
        value: "UAH 32M + RUB 605M",
        note: {
          uk: "готівка, золото, ювелірні вироби, коштовне каміння",
          en: "cash, gold, jewellery and precious stones",
        },
      },
    ],
  },

  attribution: {
    respondent: { uk: "Російська Федерація", en: "The Russian Federation" },
    note: {
      uk: "Заходи здійснювали різні органи. Арбітраж застосував Статті КМП ООН про відповідальність держав: стаття 4 — для органів держави, стаття 8 — для тих, хто діяв за її вказівкою чи під її контролем.",
      en: "The measures were carried out by different bodies. The tribunal applied the ILC Articles on State Responsibility: article 4 for organs of the State, article 8 for conduct directed or controlled by it.",
    },
    nodes: [
      {
        actor: { uk: "Збройні сили і парламент РФ", en: "Russian military and Parliament" },
        basis: "ILC art. 4",
        basisNote: { uk: "органи держави", en: "State organs" },
        did: {
          uk: "Військова присутність від кінця лютого 2014 року і закони про приєднання Криму.",
          en: "The military presence from late February 2014 and the accession legislation.",
        },
      },
      {
        actor: { uk: "Банк Росії", en: "Bank of Russia" },
        basis: "ILC art. 4",
        basisNote: { uk: "орган держави за структурою", en: "structurally a State organ" },
        did: {
          uk: "Встановив регуляторні умови і 26 травня 2014 року заборонив філії працювати.",
          en: "Imposed the regulatory conditions and, on 26 May 2014, barred the branch from operating.",
        },
      },
      {
        actor: { uk: "Кримська влада", en: "Crimean authorities" },
        basis: "ILC art. 4",
        basisNote: { uk: "органи держави з 18 березня 2014", en: "State organs from 18 March 2014" },
        did: {
          uk: "Посадовці, суди, парламент і Севастопольські збори — застосування законів про приєднання на півострові.",
          en: "Officials, courts, parliament and the Sevastopol Assembly enforcing the accession laws on the peninsula.",
        },
      },
      {
        actor: { uk: "Фонд захисту вкладників", en: "Depositor Protection Fund" },
        basis: "ILC art. 8",
        basisNote: { uk: "діяв за вказівкою держави", en: "directed and controlled by the State" },
        did: {
          uk: "Виплатив 53 399 вкладникам близько 4,6 млрд ₽, перебрав активи банку і заявив до нього регресні вимоги на ~4,7 млрд ₽.",
          en: "Paid 53,399 depositors about RUB 4.6 billion, took over the bank's assets and claimed some RUB 4.7 billion back from it.",
        },
      },
      {
        actor: { uk: "«Кримська самооборона»", en: "Crimean Self-Defense Forces" },
        basis: "ILC art. 8",
        basisNote: { uk: "під контролем кримської влади з 11 березня 2014", en: "controlled by the Crimean authorities from 11 March 2014" },
        did: {
          uk: "Фізичне вилучення готівки й коштовностей із головного офісу в Сімферополі у травні 2014 року.",
          en: "The physical seizure of cash and valuables from the Simferopol head office in May 2014.",
        },
      },
    ],
  },

  amounts: {
    note: {
      uk: "Росія не сплатила рішення добровільно, тому стягнення відбувається через арешт її державних активів за кордоном. €87 млн, заарештовані у Франції, — це приблизно 6% основної суми.",
      en: "Russia has not paid voluntarily, so recovery proceeds by attaching Russian state assets abroad. The EUR 87 million seized in France is roughly 6% of the principal.",
    },
    // NOTATION. Every `display` here is a pair, because Ukrainian and English
    // group and point numbers differently and this card printed one notation
    // to both readers. Ukrainian groups with a space and takes a comma for the
    // decimal — $3 866 307,34; English groups with a comma and takes a
    // point — $3,866,307.34. The symbol leads, and it is a symbol: the bars
    // used a third system of their own, "USD 1,111,300,729" and
    // "≈ EUR 87,000,000", while the stats tiles on this same page say
    // "$1,11 млрд" / "$1.11B" and "€87 млн" / "€87M". One page, one notation.
    //
    // The `amount` fields carry the exact cents too. They only scale the bars,
    // but rounded to whole dollars the two costs parts summed to 3 866 307
    // against a total of 3 866 307,34 — a gap with no source behind it. The
    // award's own figures are exact; they are used.
    figures: [
      {
        label: { uk: "Присуджено, 26 листопада 2018", en: "Principal awarded, 26 November 2018" },
        display: { uk: "$1 111 300 729", en: "$1,111,300,729" },
        amount: 1111300729,
        parts: [
          {
            label: { uk: "матеріальні та кредитні активи", en: "physical and loan assets" },
            display: { uk: "$597 771 793", en: "$597,771,793" },
            amount: 597771793,
          },
          {
            label: { uk: "втрачений майбутній прибуток", en: "lost future profits" },
            display: { uk: "$484 616 757", en: "$484,616,757" },
            amount: 484616757,
          },
          {
            label: { uk: "інші збитки", en: "other tangible losses" },
            display: { uk: "$28 912 179", en: "$28,912,179" },
            amount: 28912179,
          },
        ],
      },
      {
        label: {
          uk: "З нарахованими відсотками, за даними 2025 року",
          en: "Award value with accrued interest, as reported in 2025",
        },
        display: { uk: "> $1,5 млрд", en: "> $1.5B" },
        amount: 1500000000,
        estimated: true,
        note: {
          uk: "6-місячний LIBOR + 2%, складні відсотки, річні — від 31 березня 2014 року до повної сплати.",
          en: "Six-month USD LIBOR plus 2%, compounded annually, from 31 March 2014 until payment in full.",
        },
      },
      {
        label: { uk: "Витрати, присуджені арбітражем", en: "Costs awarded by the tribunal" },
        display: { uk: "$3 866 307,34", en: "$3,866,307.34" },
        amount: 3866307.34,
        parts: [
          {
            label: { uk: "витрати на арбітраж", en: "costs of the arbitration" },
            display: { uk: "$731 400,00", en: "$731,400.00" },
            amount: 731400,
          },
          {
            label: { uk: "правова допомога та експерти", en: "legal and expert fees" },
            display: { uk: "$3 134 907,34", en: "$3,134,907.34" },
            amount: 3134907.34,
          },
        ],
      },
      {
        label: {
          uk: "Арештовано у Франції, квітень 2025",
          en: "Russian property seized in France, April 2025",
        },
        // Euros, and the scale is dollars. The figure stays in euros because
        // that is the currency the French seizure is recorded in; converting
        // it would invent a rate and a date. Declaring the currency takes this
        // figure off the shared scale altogether — it used to carry a euro
        // magnitude on a dollar bar, which is a comparison this card cannot
        // make, and for a while it printed a percentage of it.
        //
        // FOR THE RESEARCHERS — the "≈ 6% of the principal" said here, in the
        // note above this block and in the FAQ does not come out of these
        // numbers. 87 000 000 is 7,8% of the 1 111 300 729 principal. It is
        // ~5,8% of the "> $1,5 млрд" accrued figure in the bar above, so the
        // six per cent looks like a share of the award WITH interest rather
        // than of the principal — but the source for the 6% is not recorded
        // here, and the currencies are being mixed either way. Both readings
        // are set out rather than one being chosen.
        display: { uk: "≈ €87 000 000", en: "≈ €87,000,000" },
        amount: 87000000,
        currency: "EUR",
        /* The share that used to stand here does not reproduce and cannot:
           87 000 000 euros against 1 111 300 729 dollars is 7,8% before any
           exchange rate, ~5,8% of the accrued figure, and neither is "6%".
           Any percentage across two currencies needs a rate and a date that no
           source here supplies, so the figure stands on its own. */
        note: {
          uk: "у євро — не звіряється зі шкалою в доларах",
          en: "in euros — not to the dollar scale",
        },
      },
    ],
  },

  objections: {
    heading: { uk: "Заперечення Росії щодо юрисдикції", en: "Russia's jurisdiction objections" },
    note: {
      uk: "Росія доводила, що договір не поширюється на кримські активи Ощадбанку. Апеляційний суд Парижа відхилив усі три підстави 1 липня 2025 року.",
      en: "Russia argued that the treaty did not apply to Oschadbank's Crimean assets. The Paris Court of Appeal rejected all three grounds on 1 July 2025.",
    },
    items: [
      {
        ground: { uk: "Час", en: "Timing" },
        latin: "ratione temporis",
        objection: {
          uk: "Інвестиції зроблені до 1992 року, тож договір їх не охоплює.",
          en: "The investments were made before 1992, so the treaty does not cover them.",
        },
        outcome: "rejected",
        reasoning: {
          uk: "У договорі немає такого часового обмеження, а спір виник у 2014 році — після набуття ним чинності.",
          en: "The treaty contains no such time limit, and the dispute arose in 2014, after it entered into force.",
        },
      },
      {
        ground: { uk: "Територія", en: "Territory" },
        latin: "ratione loci",
        objection: {
          uk: "Спірний статус Криму виводить його за межі територіальної дії договору.",
          en: "Crimea's contested status places it outside the treaty's territorial scope.",
        },
        outcome: "rejected",
        reasoning: {
          uk: "Після березня 2014 року активи перебували на території під контролем Росії — цього достатньо для територіальної вимоги договору.",
          en: "After March 2014 the assets were in territory under Russian control, which satisfies the treaty's territorial requirement.",
        },
      },
      {
        ground: { uk: "Предмет", en: "Subject matter" },
        latin: "ratione materiae",
        objection: {
          uk: "Український банк, інвестуючи всередині України, не здійснив іноземної інвестиції.",
          en: "A Ukrainian bank investing inside Ukraine made no foreign investment.",
        },
        outcome: "rejected",
        reasoning: {
          uk: "Договір захищає інвестиції, що існували на момент спору, незалежно від того, коли й у яких кордонах вони були зроблені.",
          en: "The treaty protects investments existing at the time of the dispute, regardless of when or under which borders they were made.",
        },
      },
    ],
  },

  afterlife: {
    heading: { uk: "Рішення у судах Франції", en: "The award in the French courts" },
    note: {
      uk: "Місцем арбітражу був Париж, тому заяву Росії про скасування розглядали французькі суди: два раунди в апеляційному суді й один у касаційному — понад шість років.",
      en: "The seat was Paris, so Russia's set-aside application ran through the French courts: two rounds before the Court of Appeal and one before the Cour de cassation, over six years.",
    },
    stages: [
      {
        year: "2018",
        title: { uk: "Рішення ухвалено", en: "Award rendered" },
        note: {
          uk: "Арбітраж PCA зобов'язує Росію сплатити близько 1,1 млрд доларів.",
          en: "The PCA tribunal orders Russia to pay about USD 1.1 billion.",
        },
        standing: "yes",
      },
      {
        year: "2021",
        title: { uk: "Скасовано", en: "Set aside" },
        note: {
          uk: "Апеляційний суд Парижа анулює рішення з темпоральних підстав.",
          en: "The Paris Court of Appeal annuls the award on temporal grounds.",
        },
        standing: "no",
      },
      {
        year: "2022",
        title: { uk: "Анулювання скасовано", en: "Annulment reversed" },
        note: {
          uk: "Касаційний суд не знаходить у договорі часового обмеження і повертає справу.",
          en: "The Cour de cassation finds no temporal limit in the treaty and remands the case.",
        },
        standing: "yes",
      },
      {
        year: "2025",
        title: { uk: "Залишено в силі", en: "Award upheld" },
        note: {
          uk: "На новому розгляді апеляційний суд відхиляє всі підстави. У Франції рішення остаточне.",
          en: "On remand, the Court of Appeal rejects all grounds. The award is final in France.",
        },
        standing: "yes",
      },
    ],
  },

  interpretations: [
    {
      term: { uk: "«Територія» (ст. 1(4))", en: "“Territory” (Art. 1(4))" },
      ruling: {
        uk: "Питання не в суверенітеті, а в тому, хто мав законодавчий та адміністративний контроль. Після приєднання договірні обов'язки перед інвесторами в Криму несла Росія.",
        en: "The test is not sovereignty but which State had legislative and administrative control. After the accession, the treaty obligations to investors in Crimea were Russia's.",
      },
    },
    {
      term: { uk: "«Інвестиція» (ст. 1(1))", en: "“Investment” (Art. 1(1))" },
      ruling: {
        uk: "Визначення широке: матеріальні активи, права оренди, а також вимоги за кредитами й депозитами. Часового обмеження в тексті немає — інвестиція не мусить бути зробленою після появи зобов'язань Росії.",
        en: "The definition is broad: tangible assets, leasehold rights, and claims arising from loans and deposits. The text has no temporal limit — the investment need not post-date Russia's obligations.",
      },
    },
    {
      term: { uk: "Експропріація — критерій наслідків", en: "Expropriation — the effects test" },
      ruling: {
        uk: "Значення має результат, а не намір. Вилучення може бути непрямим і складатися з низки заходів («повзуча» експропріація); за ст. 15 Статей КМП порушення настає, коли сукупний ефект достатній.",
        en: "The effects of the measures decide, not the intent behind them. A taking may be indirect and composed of a series of measures (“creeping expropriation”); under ILC article 15 the breach occurs once their cumulative effect suffices.",
      },
    },
    {
      term: { uk: "Законність вилучення (ст. 5(1))", en: "Lawfulness of a taking (Art. 5(1))" },
      ruling: {
        uk: "Чотири умови — суспільний інтерес, належна процедура, недискримінація та компенсація — є кумулятивними. Несплата компенсації сама собою робить експропріацію незаконною.",
        en: "The four conditions — public interest, due process, non-discrimination and compensation — are cumulative. Non-payment alone makes the taking unlawful.",
      },
    },
    {
      term: { uk: "Розгляд за відсутності сторони", en: "Deciding without the respondent" },
      ruling: {
        uk: "Стаття 28 Регламенту ЮНСІТРАЛ дозволяє розглянути справу за наявними доказами. Арбітраж визнав, що це покладає на нього «більший, ніж зазвичай, обов'язок» перевірити обґрунтованість рішення.",
        en: "Article 28 of the UNCITRAL Rules allows the tribunal to proceed on the evidence before it. The tribunal held that this placed on it “a heavier than usual obligation” to ensure the award was soundly based.",
      },
    },
    {
      term: { uk: "Ставка відсотків", en: "The interest rate" },
      ruling: {
        uk: "Ставка має відповідати валюті відшкодування. Гривневу ставку відхилено через девальвацію; застосовано 6-місячний доларовий LIBOR + 2%, складні відсотки, річні.",
        en: "The rate must match the currency of the award. A hryvnia rate was rejected because of the currency's depreciation; the tribunal applied six-month USD LIBOR plus 2%, compounded annually.",
      },
    },
  ],

  sources: [
    /* The EUR 87 million French attachment is stated six times on this page —
       the FAQ, a stat tile, a timeline entry, the amounts card — and until now
       no source here covered it. It is real; it was simply uncited. */
    {
      url: "https://en.interfax.com.ua/news/economic/1066322.html",
      title:
        "Ukraine's Oschadbank secures EUR 87 mln asset freeze in France over Crimean losses",
      authors: "Interfax-Ukraine",
      publication: "Interfax-Ukraine",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://www.iisd.org/itn/2023/07/01/pca-tribunal-finds-that-russia-committed-an-illegal-expropriation-against-ukrainian-bank/",
      title:
        "PCA tribunal finds that Russia committed an illegal expropriation against Ukrainian bank",
      authors: "",
      publication: "IISD — Investment Treaty News",
      date: "1 July 2023",
      type: "news/insight",
    },
    {
      url: "https://www.ejiltalk.org/crimea-investment-disputes-are-jurisdictional-hurdles-being-overcome-too-easily/",
      title:
        "Crimea Investment Disputes: are Jurisdictional Hurdles Being Overcome Too Easily?",
      authors: "",
      publication: "EJIL: Talk!",
      date: "",
      type: "blog post",
    },
    {
      url: "https://www.iareporter.com/articles/analysis-unpacking-the-reasons-that-led-the-paris-court-of-appeal-to-dismiss-russias-bid-to-set-aside-the-oschadbank-v-russia-crimea-award/",
      title:
        "Analysis: unpacking the reasons that led the Paris Court of Appeal to dismiss Russia's bid to set aside the Oschadbank v. Russia Crimea award",
      authors: "",
      publication: "IAReporter",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://www.iareporter.com/articles/ukraines-oschadbank-submits-notice-of-treaty-dispute-to-russia-over-donbass-kherson-and-zaporizhzhia-assets/",
      title:
        "Ukraine's Oschadbank submits notice of treaty dispute to Russia over Donbass, Kherson, and Zaporizhzhia assets",
      authors: "",
      publication: "IAReporter",
      date: "2025",
      type: "news/insight",
    },
    {
      url: "https://brill.com/view/journals/iclr/26/1-2/article-p187_8.xml",
      title: "Crimea-related investment arbitrations",
      authors: "",
      publication: "International Community Law Review (Brill)",
      date: "",
      type: "journal article",
    },
    {
      url: "https://www.researchgate.net/publication/363350690_Temporal_Issues_Relating_to_BIT_Dispute_Resolution",
      title: "Temporal Issues Relating to BIT Dispute Resolution",
      authors: "",
      publication: "ResearchGate",
      date: "2022",
      type: "preprint/repository",
    },
    {
      url: "https://www.lexology.com/library/detail.aspx?g=2692554c-0509-4ca7-b0d9-8903155bf6e0",
      title: "Oschadbank v. Russia — set-aside proceedings before the French courts",
      authors: "",
      publication: "Lexology",
      date: "",
      type: "news/insight",
    },
  ],
};

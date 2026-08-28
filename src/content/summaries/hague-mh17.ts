import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./hague-mh17.verbatim.json";
import verbatimUk from "./hague-mh17.uk.json";

/**
 * The MH17 criminal trial — Public Prosecution Service v. Girkin, Dubinskiy,
 * Pulatov and Kharchenko, District Court of The Hague, verdict of
 * 17 November 2022 (ECLI:NL:RBDHA:2022:14037).
 *
 * The verbatim body is the doc's tab (not yet marked finalized; the doc's
 * trailing bracket-footnotes belong to other tabs and are not part of this
 * text). Context beyond the tab — the exact verdict date, the finality (no
 * appeals), the ~EUR 16M in compensation to relatives, the JIT — cites its
 * sources and lives in docs/research/hague-mh17-sources.md.
 */
export const hagueMh17: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  title: {
    uk: "Справа MH17: вирок у Гаазі",
    en: "The MH17 verdict in The Hague",
  },
  /* The masthead in Ukrainian — the caption under the title and the line
     in the eyebrow. `masthead` keeps the decision's own English, which is
     what the citation block reproduces; this is what a Ukrainian reader
     sees at the top of the page. See `mastheadUk` in summaries/types.ts. */
  mastheadUk: {
    official:
      "Прокуратура проти Гіркіна, Дубінського, Пулатова і Харченка (рейс MH17) — окружний суд Гааги, ECLI:NL:RBDHA:2022:14037",
    judgment: "Вирок від 17 листопада 2022",
  },

  asOf: "2026-08-22",
  provisionalSource: true,

  forum: {
    institution: { uk: "Окружний суд Гааги", en: "District Court of The Hague" },
    seat: { uk: "Гаага", en: "The Hague" },
  },

  /* Search-result description. `plain.tldr` used to serve as this and runs
     three to four sentences, so the snippet was cut off mid-word. */
  metaDesc: {
    uk: "Вирок Окружного суду Гааги від 17 листопада 2022 у справі MH17: троє заочно засуджені до довічного ув'язнення, четвертого підсудного виправдано.",
    en: "The Hague District Court's MH17 verdict of 17 November 2022: three men sentenced to life in absentia, the fourth accused acquitted. Final, unappealed.",
  },

  plain: {
    tldr: {
      uk: "17 липня 2014 року ракета «Бук» збила над Донеччиною рейс MH17 — загинули всі 298 людей на борту. 17 листопада 2022 року нідерландський суд заочно засудив до довічного ув'язнення трьох організаторів доставки «Бука» — Гіркіна, Дубинського і Харченка — і виправдав четвертого підсудного, Пулатова. Вирок остаточний: ні прокуратура, ні засуджені його не оскаржили.",
      en: "On 17 July 2014 a Buk missile downed flight MH17 over the Donetsk region — all 298 aboard died. On 17 November 2022 a Dutch court sentenced three men who organised the Buk's deployment — Girkin, Dubinskiy and Kharchenko — to life in prison in absentia, and acquitted the fourth accused, Pulatov. The verdict is final: neither the prosecution nor the convicted appealed.",
    },
    whyMatters: {
      uk: "Це перший кримінальний вирок за збиття MH17 — і рідкісний приклад, коли національний суд довів до кінця заочний процес про міжнародний злочин: з іменами, доказами і довічними вироками. Його фактологія (маршрут «Бука», ролі підсудних) стала опорою для рішення ЄСПЛ 2025 року і позовів родин.",
      en: "The first criminal verdict for the downing of MH17 — and a rare instance of a national court completing an in-absentia trial of an international crime, with names, evidence and life sentences. Its factual record (the Buk's route, the defendants' roles) underpins the ECtHR's 2025 judgment and the families' claims.",
    },
  },

  glossary: [
    {
      term: { uk: "Заочний розгляд (in absentia)", en: "Trial in absentia" },
      def: {
        uk: "Процес без присутності підсудних. Нідерландське право його дозволяє; підсудні мали захисників і право на новий розгляд у разі затримання (крім Пулатова, який обрав захист і був виправданий).",
        en: "A trial without the accused present. Dutch law allows it; the accused had counsel and a retrial right if apprehended (Pulatov chose to mount a defence — and was acquitted).",
      },
    },
    {
      term: { uk: "Buk TELAR", en: "Buk TELAR" },
      def: {
        uk: "Самохідна пускова установка ЗРК «Бук». Суд встановив: ракету випустили з поля біля Первомайського, з установки, привезеної з Росії й повернутої туди.",
        en: "The Buk system's self-propelled launcher. The court found the missile was fired from a field near Pervomaiskyi, from a TELAR brought in from Russia and returned there.",
      },
    },
    {
      term: { uk: "JIT", en: "JIT" },
      def: {
        uk: "Спільна слідча група (Нідерланди, Австралія, Бельгія, Малайзія, Україна), що зібрала доказову базу справи.",
        en: "The Joint Investigation Team (the Netherlands, Australia, Belgium, Malaysia, Ukraine) that built the evidentiary record.",
      },
    },
    {
      term: { uk: "ECLI", en: "ECLI" },
      def: {
        uk: "Європейський ідентифікатор судового рішення. Вирок Гіркіну: ECLI:NL:RBDHA:2022:14037.",
        en: "The European Case Law Identifier. Girkin's verdict: ECLI:NL:RBDHA:2022:14037.",
      },
    },
    {
      term: { uk: "Справа Локербі", en: "The Lockerbie case" },
      def: {
        uk: "Вибух Boeing над Локербі 1988 року (270 загиблих) — орієнтир, на який обвинувачення посилалося щодо міри покарання.",
        en: "The 1988 bombing of a Boeing over Lockerbie (270 dead) — the sentencing reference the prosecution invoked.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Прокуратура Нідерландів", en: "The Dutch Public Prosecution Service" },
      role: {
        uk: "Обвинувачення на основі матеріалів JIT; вимагало довічного ув'язнення для всіх чотирьох.",
        en: "Prosecuted on the JIT record; sought life imprisonment for all four.",
      },
      kind: "party",
    },
    {
      name: { uk: "Ігор Гіркін («Стрєлков»)", en: "Igor Girkin (\"Strelkov\")" },
      role: {
        uk: "«Міністр оборони ДНР», формальний командувач її сил. Засуджений заочно до довічного.",
        en: "The \"DPR defence minister\" and formal commander of its forces. Convicted in absentia; life.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Сергій Дубинський", en: "Sergei Dubinskiy" },
      role: {
        uk: "Керівник «розвідки ДНР»; замовив доставку «Бука». Засуджений заочно до довічного.",
        en: "Head of \"DPR intelligence\"; ordered the Buk brought in. Convicted in absentia; life.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Леонід Харченко", en: "Leonid Kharchenko" },
      role: {
        uk: "Командир підрозділу, що супроводжував установку до місця пуску. Засуджений заочно до довічного.",
        en: "Commanded the unit escorting the TELAR to the launch site. Convicted in absentia; life.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Олег Пулатов", en: "Oleg Pulatov" },
      role: {
        uk: "Заступник Дубинського; єдиний, хто мав захист у процесі. Виправданий — активної ролі не доведено.",
        en: "Dubinskiy's deputy; the only one defended at trial. Acquitted — no active role proven.",
      },
      kind: "actor",
    },
    {
      name: { uk: "Окружний суд Гааги", en: "The District Court of The Hague" },
      role: {
        uk: "Розглядав справу в захищеному комплексі біля Схіпгола; вирок — 17 листопада 2022 року.",
        en: "Sat in the secured complex near Schiphol; verdict on 17 November 2022.",
      },
      kind: "court",
    },
  ],

  faq: [
    {
      q: { uk: "Чому судили Нідерланди, а не Україна чи міжнародний суд?", en: "Why the Netherlands, not Ukraine or an international court?" },
      a: {
        uk: "Більшість загиблих — 196 із 298 — громадяни Нідерландів, і держави JIT домовилися, що процес вестиме нідерландська юстиція за нідерландським правом. Спроба створити трибунал ООН у 2015 році була заблокована вето Росії в Радбезі.",
        en: "Most of the dead — 196 of 298 — were Dutch, and the JIT States agreed the Netherlands would prosecute under Dutch law. A 2015 attempt at a UN tribunal was vetoed by Russia in the Security Council.",
      },
    },
    {
      q: { uk: "Вирок заочний — він щось означає?", en: "The verdict is in absentia — does it mean anything?" },
      a: {
        uk: "Так. Він остаточний (ніхто не оскаржив), довічні строки діють, засуджені — в міжнародному розшуку і фактично замкнені в Росії. Суд також задовольнив позови родин — понад 16 млн євро компенсацій. А доказова база вироку лягла в основу рішення ЄСПЛ 2025 року.",
        en: "Yes. It is final (no one appealed), the life sentences stand, the convicted are internationally wanted and effectively confined to Russia. The court also granted the families' claims — over EUR 16 million in compensation. And its record underpins the ECtHR's 2025 judgment.",
      },
    },
    {
      q: { uk: "Чому Пулатова виправдали?", en: "Why was Pulatov acquitted?" },
      a: {
        uk: "Суд не знайшов доказів його активної чи вирішальної участі: він знав про «Бук» і бачив його, але не доведено, що він щось вирішував чи міг змінити. Це виправдання — найкраща відповідь на закиди про «показовий процес»: суд виправдовує, коли доказів бракує.",
        en: "The court found no evidence of an active or crucial role: he knew of and saw the Buk, but nothing showed he decided anything or could change it. The acquittal is the best answer to \"show trial\" claims — the court acquits where proof falls short.",
      },
    },
    {
      q: { uk: "А хто відповість за сам пуск і за Росію як державу?", en: "And who answers for the launch itself — and for Russia as a State?" },
      a: {
        uk: "Екіпаж «Бука» і командну вертикаль JIT дослідила у 2023 році, але призупинила розслідування без нових підозрюваних. Державну відповідальність Росії за MH17 у 2025 році встановив ЄСПЛ у справі «Україна і Нідерланди проти Росії»; триває і провадження Ради ІКАО за скаргою Нідерландів та Австралії.",
        en: "The JIT examined the Buk crew and the chain of command in 2023 but suspended the investigation without new suspects. Russia's State responsibility for MH17 was established by the ECtHR in 2025 in Ukraine and the Netherlands v. Russia; ICAO Council proceedings brought by the Netherlands and Australia also continue.",
      },
    },
  ],

  related: [
    {
      label: {
        uk: "Україна і Нідерланди проти Росії (ЄСПЛ)",
        en: "Ukraine and the Netherlands v. Russia (ECtHR)",
      },
      note: { uk: "державна відповідальність за MH17 — рішення 2025 року", en: "State responsibility for MH17 — the 2025 judgment" },
      href: "/cases/echr-ukraine-netherlands",
    },
    {
      label: { uk: "Фінляндія проти Тордена", en: "Finland v. Torden" },
      note: { uk: "інший нацсуд: універсальна юрисдикція", en: "another national court: universal jurisdiction" },
      href: "/cases/finland-torden",
    },
    {
      label: { uk: "Ситуація в Україні (МКС)", en: "Situation in Ukraine (ICC)" },
      note: { uk: "міжнародний кримінальний трек", en: "the international criminal track" },
      href: "/cases/icc-ukraine",
    },
  ],

  judgment: {
    court: { uk: "Окружний суд Гааги", en: "District Court of The Hague" },
    url: "https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBDHA:2022:14037",
    caseUrl: "https://www.courtmh17.com/en/",
    date: "2022-11-17",
    readLabel: { uk: "Вирок (rechtspraak.nl)", en: "The verdict (rechtspraak.nl)" },
    fileLabel: { uk: "Сайт процесу MH17", en: "The MH17 trial site" },
  },

  instruments: [
    {
      abbr: { uk: "КК Нідерландів", en: "Dutch Criminal Code" },
      name: {
        uk: "Кримінальний кодекс Нідерландів (статті про спричинення авіакатастрофи та вбивство)",
        en: "Dutch Criminal Code (causing an aircraft to crash; murder)",
      },
      year: 1881,
      url: "https://wetten.overheid.nl/BWBR0001854/",
    },
  ],

  stats: [
    { value: "298", label: { uk: "загиблих — усі, хто був на борту", en: "dead — everyone aboard" }, em: true },
    { value: "3", label: { uk: "довічні вироки заочно", en: "life sentences in absentia" } },
    { value: "1", label: { uk: "виправдання — Пулатов", en: "acquittal — Pulatov" } },
    {
      value: { uk: "€16 млн+", en: "€16M+" },
      label: { uk: "компенсацій родинам присуджено", en: "in compensation awarded to relatives" },
    },
  ],

  glance: [
    { label: { uk: "Обвинувачення", en: "Prosecution" }, value: { uk: "Прокуратура Нідерландів (на базі JIT)", en: "Dutch PPS (on the JIT record)" } },
    {
      label: { uk: "Підсудні", en: "Accused" },
      value: { uk: "Гіркін · Дубинський · Харченко · Пулатов", en: "Girkin · Dubinskiy · Kharchenko · Pulatov" },
    },
    { label: { uk: "Суд", en: "Court" }, value: { uk: "Окружний суд Гааги", en: "District Court of The Hague" } },
    {
      label: { uk: "Ідентифікатор", en: "Identifier" },
      /* The court gave four simultaneous judgments that day, one per accused;
         14037 is Girkin's. The row is styled as covering all four, so naming
         one ECLI unqualified sent a citing reader to the wrong document for
         three of them. */
      value: {
        uk: "ECLI:NL:RBDHA:2022:14037 (Гіркін) · 14036 Дубинський · 14039 Харченко · 14040 Пулатов",
        en: "ECLI:NL:RBDHA:2022:14037 (Girkin) · 14036 Dubinskiy · 14039 Kharchenko · 14040 Pulatov",
      },
    },
    { label: { uk: "Вирок", en: "Verdict" }, value: { uk: "17 листопада 2022", en: "17 November 2022" } },
    { label: { uk: "Статус", en: "Status" }, value: { uk: "остаточний — без апеляцій", en: "final — no appeals" } },
  ],

  timeline: [
    {
      date: { uk: "17 лип. 2014", en: "17 Jul 2014" },
      iso: "2014-07-17",
      kind: "context",
      label: { uk: "Збиття MH17 біля Первомайського: 298 загиблих", en: "MH17 downed near Pervomaiskyi: 298 dead" },
      note: {
        uk: "Boeing 777 Malaysia Airlines, рейс Амстердам–Куала-Лумпур. 196 загиблих — нідерландці.",
        en: "A Malaysia Airlines Boeing 777, Amsterdam to Kuala Lumpur. 196 of the dead were Dutch.",
      },
    },
    {
      date: { uk: "серп. 2014", en: "Aug 2014" },
      iso: "2014-08-07",
      kind: "filing",
      label: { uk: "Створено JIT", en: "The JIT is formed" },
      note: {
        uk: "Нідерланди, Австралія, Бельгія, Малайзія, Україна — спільне кримінальне розслідування.",
        en: "The Netherlands, Australia, Belgium, Malaysia and Ukraine open a joint criminal investigation.",
      },
    },
    {
      date: { uk: "9 бер. 2020", en: "9 Mar 2020" },
      iso: "2020-03-09",
      kind: "order",
      label: { uk: "Початок процесу в Гаазі", en: "The trial opens in The Hague" },
      note: {
        uk: "Заочно щодо трьох; Пулатова представляли адвокати.",
        en: "In absentia for three; Pulatov was represented by counsel.",
      },
    },
    {
      date: { uk: "17 лист. 2022", en: "17 Nov 2022" },
      iso: "2022-11-17",
      kind: "judgment",
      label: {
        uk: "Вирок: три довічні, одне виправдання, €16 млн+ родинам",
        en: "Verdict: three life sentences, one acquittal, €16M+ to relatives",
      },
      note: {
        uk: "Суд визнав установку «Бук» російською, привезеною з РФ і повернутою туди; конфлікт на сході кваліфіковано як керований Росією.",
        en: "The court found the Buk was Russian, brought from and returned to Russia; the eastern conflict was Russian-controlled.",
      },
    },
    {
      date: { uk: "поч. 2023", en: "Early 2023" },
      iso: "2023-02-08",
      kind: "order",
      label: {
        uk: "Вирок стає остаточним; JIT публікує висновки про командну вертикаль",
        en: "The verdict becomes final; the JIT reports on the chain of command",
      },
      note: {
        uk: "Ані прокуратура, ані засуджені не оскаржили. 8 лютого 2023 року JIT оприлюднила висновки щодо екіпажу «Бука» і вертикалі — і призупинила розслідування.",
        en: "Neither the prosecution nor the convicted appealed. On 8 February 2023 the JIT published its findings on the Buk crew and the chain of command — and suspended the investigation.",
      },
    },
    {
      date: { uk: "9 лип. 2025", en: "9 Jul 2025" },
      iso: "2025-07-09",
      kind: "context",
      label: {
        uk: "ЄСПЛ покладає на Росію державну відповідальність за MH17",
        en: "The ECtHR fixes Russia's State responsibility for MH17",
      },
      note: {
        uk: "Рішення «Україна і Нідерланди проти Росії» спирається зокрема на фактологію цього вироку.",
        en: "Ukraine and the Netherlands v. Russia builds in part on this verdict's factual record.",
      },
    },
  ],

  verdictsHeading: { uk: "Вирок суду", en: "The court's verdict" },

  verdicts: [
    {
      track: "Гіркін · Girkin",
      trackLabel: { uk: "Ігор Гіркін", en: "Igor Girkin" },
      claim: {
        uk: "Спричинення падіння MH17 і вбивство 298 людей — довічне ув'язнення (заочно)",
        en: "Causing MH17 to crash; the murder of 298 people — life imprisonment (in absentia)",
      },
      outcome: "convicted",
    },
    {
      track: "Дубинський · Dubinskiy",
      trackLabel: { uk: "Сергій Дубинський", en: "Sergei Dubinskiy" },
      claim: {
        uk: "Ті самі пункти — довічне ув'язнення (заочно)",
        en: "The same counts — life imprisonment (in absentia)",
      },
      outcome: "convicted",
    },
    {
      track: "Харченко · Kharchenko",
      trackLabel: { uk: "Леонід Харченко", en: "Leonid Kharchenko" },
      claim: {
        uk: "Ті самі пункти — довічне ув'язнення (заочно)",
        en: "The same counts — life imprisonment (in absentia)",
      },
      outcome: "convicted",
    },
    {
      track: "Пулатов · Pulatov",
      trackLabel: { uk: "Олег Пулатов", en: "Oleg Pulatov" },
      claim: {
        uk: "Активної чи вирішальної участі не доведено",
        en: "No active or crucial involvement proven",
      },
      outcome: "acquitted",
    },
  ],

  /* Same as finland-torden: a criminal trial captioned "seat of arbitration". */

  theatresHeading: { uk: "Де це сталося", en: "Where it happened" },

  mapFocus: { forumKey: "hague", reachTo: "donetsk" },

  theatres: [
    {
      place: { uk: "Первомайське, Донеччина", en: "Pervomaiskyi, Donetsk region" },
      tag: { uk: "МІСЦЕ ПУСКУ", en: "THE LAUNCH SITE" },
      markerKeys: ["donetsk"],
      summary: {
        uk: "Поле, з якого установка «Бук» випустила ракету по MH17 17 липня 2014 року.",
        en: "The field from which the Buk TELAR fired at MH17 on 17 July 2014.",
      },
    },
  ],

  interpretations: [
    {
      term: { uk: "Заочний процес — легітимний", en: "In absentia — and legitimate" },
      ruling: {
        uk: "Нідерландське право дозволило повний процес без підсудних: із захистом (для Пулатова), повним дослідженням доказів і виправданням там, де доказів забракло.",
        en: "Dutch law allowed a full trial without the accused: with a defence (for Pulatov), full evidence-testing, and an acquittal where proof fell short.",
      },
    },
    {
      term: { uk: "Не комбатанти — отже, вбивство", en: "Not combatants — therefore murder" },
      ruling: {
        uk: "Підсудні як керівники «ДНР» були цивільними без права вести бойові дії — тож збиття літака судили як умисне вбивство за загальним кримінальним правом, без комбатантського імунітету.",
        en: "As \"DPR\" leaders the accused were civilians with no right to fight — so the downing was tried as murder under ordinary criminal law, with no combatant immunity.",
      },
    },
    {
      term: { uk: "Локербі як орієнтир кари", en: "Lockerbie as the sentencing referent" },
      ruling: {
        uk: "За відсутності подібних справ у нідерландській практиці обвинувачення міряло покарання справою Локербі: планування, 298 жертв і тяжкість наслідків виправдовують лише довічне.",
        en: "With no Dutch precedent, the prosecution measured the sentence against Lockerbie: the planning, the 298 victims and the gravity justified nothing short of life.",
      },
    },
  ],

  sources: [
    {
      url: "https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBDHA:2022:14037",
      title: "Verdict against Girkin — ECLI:NL:RBDHA:2022:14037 (full text)",
      authors: "",
      publication: "Rechtspraak.nl",
      date: "17 November 2022",
      type: "official/award",
    },
    {
      url: "https://www.courtmh17.com/en/summaries-and-news/news/summary-of-the-day-in-court-17-november-2022-judgment.htm",
      title: "Summary of the day in court: 17 November 2022 — Judgment",
      authors: "",
      publication: "District Court of The Hague (courtmh17.com)",
      date: "17 November 2022",
      type: "official/award",
    },
    {
      url: "https://www.prosecutionservice.nl/topics/m/mh17-plane-crash/prosecution-and-trial",
      title: "MH17: prosecution and trial (finality; no appeals)",
      authors: "",
      publication: "Netherlands Public Prosecution Service",
      date: "2023",
      type: "official/filing",
    },
    {
      url: "https://nltimes.nl/2022/11/17/three-convicted-sentenced-life-prison-downing-flight-mh17-one-acquitted",
      title: "Three convicted & sentenced to life in prison for downing flight MH17; one acquitted (€16M+ compensation)",
      authors: "",
      publication: "NL Times",
      date: "17 November 2022",
      type: "news/insight",
    },
    {
      url: "https://www.ejiltalk.org/the-mh17-judgment-an-interesting-take-on-the-nature-of-the-armed-conflict-in-eastern-ukraine/",
      title: "The MH17 Judgment: An Interesting Take on the Nature of the Armed Conflict in Eastern Ukraine",
      authors: "",
      publication: "EJIL: Talk!",
      date: "2022",
      type: "blog post",
    },
    {
      url: "https://www.interfax.com/newsroom/top-stories/85062/",
      title: "The Hague District Court in absentia sentences Girkin, Dubinsky and Kharchenko to life in prison",
      authors: "",
      publication: "Interfax",
      date: "17 November 2022",
      type: "news/insight",
    },
  ],
};

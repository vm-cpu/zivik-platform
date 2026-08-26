import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./finland-torden.verbatim.json";
import verbatimUk from "./finland-torden.uk.json";

/**
 * Finland v. Yan Petrovsky ("Voislav Torden"), Helsinki District Court,
 * judgment of 14 March 2025 — the first universal-jurisdiction war-crimes
 * conviction over Ukraine in Finland.
 *
 * The verbatim body is the doc's tab (not yet marked finalized; re-ingest
 * when it is). The tab describes the arrest, the five charges and the
 * jurisdictional basis; the verdict itself — conviction on four of five
 * charges, life imprisonment, the announced appeal — is context with its own
 * sources, kept in the verdict matrix, the timeline and
 * docs/research/finland-torden-sources.md.
 */
export const finlandTorden: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  title: {
    uk: "Фінляндія проти Яна Петровського",
    en: "Finland v. Yan Petrovsky",
  },

  asOf: "2026-08-22",
  provisionalSource: true,

  forum: {
    institution: { uk: "Окружний суд Гельсінкі", en: "Helsinki District Court" },
    seat: { uk: "Гельсінкі", en: "Helsinki" },
  },

  /* Search-result description. `plain.tldr` used to serve as this and runs
     three to four sentences, so the snippet was cut off mid-word. */
  metaDesc: {
    uk: "Вирок Окружного суду Гельсінкі від 14 березня 2025: довічне ув'язнення Яну Петровському («Торден») за воєнні злочини — універсальна юрисдикція.",
    en: "Helsinki District Court, 14 March 2025: life imprisonment for Yan Petrovsky (\"Torden\") for war crimes in Ukraine, under universal jurisdiction.",
  },

  plain: {
    tldr: {
      uk: "Ян Петровський («Воїслав Торден») — заступник командира російського неонацистського загону «Русич». У вересні 2014-го його підрозділ під українським прапором влаштував засідку на батальйон «Айдар»: щонайменше 22 загиблих. У 2023 році Фінляндія затримала його в аеропорту Гельсінкі, а 14 березня 2025 року засудила до довічного ув'язнення за воєнні злочини — за універсальною юрисдикцією, хоча злочини скоєно в Україні проти українців.",
      en: "Yan Petrovsky (\"Voislav Torden\") was deputy commander of the Russian neo-Nazi unit Rusich. In September 2014 his unit ambushed the Aidar battalion under a Ukrainian flag: at least 22 dead. Finland arrested him at Helsinki airport in 2023 and on 14 March 2025 sentenced him to life imprisonment for war crimes — under universal jurisdiction, though the crimes were committed in Ukraine against Ukrainians.",
    },
    whyMatters: {
      uk: "Це перше в Фінляндії засудження за воєнні злочини у війні проти України — і демонстрація того, як працює універсальна юрисдикція: виконавцю досить перетнути кордон будь-якої держави, що переслідує міжнародні злочини. Жоден ордер МКС не знадобився — вистачило національного суду.",
      en: "Finland's first war-crimes conviction from the war on Ukraine — and a demonstration of universal jurisdiction at work: a perpetrator need only cross the border of any State that prosecutes international crimes. No ICC warrant was needed; a national court sufficed.",
    },
  },

  glossary: [
    {
      term: { uk: "Універсальна юрисдикція", en: "Universal jurisdiction" },
      def: {
        uk: "Право держави судити за найтяжчі міжнародні злочини незалежно від місця вчинення і громадянства учасників. У Фінляндії — глава 11, розділ 5(1) Кримінального кодексу.",
        en: "A State's power to try the gravest international crimes regardless of where they occurred or anyone's nationality. In Finland: Chapter 11, Section 5(1) of the Criminal Code.",
      },
    },
    {
      term: { uk: "«Русич»", en: "Rusich" },
      def: {
        uk: "Російський неонацистський найманецький загін, пов'язаний із «Вагнером»; відомий жорстокістю до полонених. Торден — співзасновник і заступник командира.",
        en: "A Russian neo-Nazi mercenary unit tied to Wagner, notorious for its treatment of prisoners. Torden co-founded and deputy-commanded it.",
      },
    },
    {
      term: { uk: "Віроломство", en: "Perfidy" },
      def: {
        uk: "Заборонене МГП зловживання довірою супротивника — тут: атака під українським прапором. Звідси пункт про «неналежне використання прапора».",
        en: "The IHL-prohibited abuse of an enemy's trust — here, attacking under a Ukrainian flag. Hence the \"improper use of a flag\" charge.",
      },
    },
    {
      term: { uk: "Відмова в пощаді", en: "Denying quarter" },
      def: {
        uk: "Оголошення, що полонених не братимуть. Саме по собі є воєнним злочином — навіть у формі постів у соцмережах.",
        en: "Declaring that no prisoners will be taken. A war crime in itself — even as social-media posts.",
      },
    },
    {
      term: { uk: "Hors de combat", en: "Hors de combat" },
      def: {
        uk: "«Поза боєм»: поранені й ті, хто здався. Їх убивство — умисне вбивство за Женевськими конвенціями.",
        en: "\"Out of the fight\": the wounded and those who surrendered. Killing them is wilful killing under the Geneva Conventions.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Фінляндія", en: "Finland" },
      role: {
        uk: "Держава обвинувачення: Національна прокуратура після розслідування Національного бюро розслідувань.",
        en: "The prosecuting State: the National Prosecution Authority, after an NBI investigation.",
      },
      kind: "party",
    },
    {
      name: { uk: "Ян Петровський («Воїслав Торден»)", en: "Yan Petrovsky (\"Voislav Torden\")" },
      role: {
        uk: "Підсудний. Підсанкційний росіянин, заступник командира «Русича»; затриманий у Гельсінкі 2023 року під вигаданим ім'ям.",
        en: "The accused. A sanctioned Russian, Rusich's deputy commander; arrested in Helsinki in 2023 under an assumed name.",
      },
      kind: "party",
    },
    {
      name: { uk: "Окружний суд Гельсінкі", en: "Helsinki District Court" },
      role: {
        uk: "Судив за фінським Кримінальним кодексом на основі універсальної юрисдикції; вирок — 14 березня 2025 року.",
        en: "Tried the case under the Finnish Criminal Code on universal jurisdiction; judgment on 14 March 2025.",
      },
      kind: "court",
    },
    {
      name: { uk: "Батальйон «Айдар»", en: "The Aidar battalion" },
      role: {
        uk: "Український підрозділ, на колону якого 5 вересня 2014 року влаштували засідку; потерпілі приєднали цивільні позови.",
        en: "The Ukrainian unit ambushed on 5 September 2014; its victims joined civil claims to the case.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: {
        uk: "Чому Фінляндія судить за злочини, скоєні в Україні проти українців?",
        en: "Why does Finland try crimes committed in Ukraine against Ukrainians?",
      },
      a: {
        uk: "Бо воєнні злочини — злочини проти всього людства. Глава 11, розділ 5(1) фінського Кримінального кодексу прямо дозволяє судити за них «незалежно від місця вчинення і громадянства потерпілих чи виконавців». Тордена судили, бо він фізично опинився на фінській території.",
        en: "Because war crimes are crimes against all humanity. Chapter 11, Section 5(1) of Finland's Criminal Code allows trying them \"regardless of where they were committed, and irrespective of the nationality of the victims or perpetrators\". Torden was tried because he was physically on Finnish soil.",
      },
    },
    {
      q: { uk: "Який вирок і чи остаточний він?", en: "What was the verdict, and is it final?" },
      a: {
        uk: "14 березня 2025 року суд визнав Тордена винним за чотирма з п'яти пунктів і призначив довічне ув'язнення. Один пункт відхилено. Торден заявив про апеляцію, тож справа може ще розглядатися вищими інстанціями.",
        en: "On 14 March 2025 the court found Torden guilty on four of the five charges and imposed life imprisonment. One charge was dismissed. Torden announced an appeal, so higher instances may yet hear the case.",
      },
    },
    {
      q: { uk: "Чому його не видали Україні?", en: "Why wasn't he extradited to Ukraine?" },
      a: {
        uk: "Фінський суд раніше відмовив у видачі через умови тримання, які могли б порушити його права, — і натомість Фінляндія судила його сама. Універсальна юрисдикція якраз і існує, щоб відмова у видачі не означала безкарності.",
        en: "A Finnish court earlier refused extradition over detention conditions that could breach his rights — and Finland tried him itself instead. That is what universal jurisdiction is for: a refused extradition must not mean impunity.",
      },
    },
    {
      q: { uk: "До чого тут Римський статут?", en: "Where does the Rome Statute come in?" },
      a: {
        uk: "Фінське визначення воєнних злочинів відсилає до Женевських конвенцій з протоколами і до Римського статуту, який Фінляндія ратифікувала. Тож обвинувачення сформульовані в тих самих категоріях, що й перед МКС, — але розглянуті національним судом.",
        en: "Finland's war-crimes definition points to the Geneva Conventions with their Protocols and to the Rome Statute, which Finland ratified. The charges are framed in the same categories as before the ICC — but tried by a national court.",
      },
    },
  ],

  related: [
    {
      label: { uk: "Вирок у справі MH17 (Гаага)", en: "The MH17 verdict (The Hague)" },
      note: { uk: "інший шлях нацсуду: заочний процес", en: "another national route: trial in absentia" },
      href: "/cases/hague-mh17",
    },
    {
      label: { uk: "Ситуація в Україні (МКС)", en: "Situation in Ukraine (ICC)" },
      note: { uk: "міжнародний трек індивідуальної відповідальності", en: "the international track of individual responsibility" },
      href: "/cases/icc-ukraine",
    },
    {
      label: {
        uk: "Україна і Нідерланди проти Росії (ЄСПЛ)",
        en: "Ukraine and the Netherlands v. Russia (ECtHR)",
      },
      note: { uk: "державна відповідальність за той самий Донбас-2014", en: "State responsibility for the same Donbas 2014" },
      href: "/cases/echr-ukraine-netherlands",
    },
  ],

  /*
   * NEITHER of these links is a court document, and the page must not pretend
   * otherwise. The Helsinki District Court's judgment of 14 March 2025 is not
   * published anywhere we can link — the registry row `fi-38` records that
   * with `decisionUrl: null`, and this page now says the same thing out loud.
   *
   * `url` is Sorcha MacLeod and Iryna Marchuk's EJIL:Talk! analysis and
   * `caseUrl` is Ukrainska Pravda's report of the verdict; both are listed in
   * `sources` below, which is where the page reads their publisher and kind
   * from. Before `urlType`/`caseUrlType` existed the template printed
   * "Окружний суд Гельсінкі" as the caption under the EJIL:Talk! button and
   * told search engines, in JSON-LD, that the court had authored the
   * Ukrainska Pravda article.
   */
  judgment: {
    court: { uk: "Окружний суд Гельсінкі", en: "Helsinki District Court" },
    url: "https://www.ejiltalk.org/prosecuting-members-of-russian-mercenary-groups-for-war-crimes-a-remedy-for-victims/",
    urlType: "blog post",
    caseUrl: "https://www.pravda.com.ua/eng/news/2025/03/14/7502855/",
    caseUrlType: "news/insight",
    date: "2025-03-14",
    readLabel: { uk: "Розбір справи (EJIL: Talk!)", en: "Case analysis (EJIL: Talk!)" },
    fileLabel: { uk: "Репортаж про вирок", en: "Report of the verdict" },
  },

  instruments: [
    {
      abbr: { uk: "КК Фінляндії", en: "Finnish Criminal Code" },
      name: {
        uk: "Кримінальний кодекс Фінляндії, глава 11, розділ 5(1) (212/2008)",
        en: "Finnish Criminal Code, Chapter 11, Section 5(1) (212/2008)",
      },
      year: 2008,
      url: "https://www.finlex.fi/en/legislation/translations/1889/eng/39-001",
    },
  ],

  stats: [
    { value: "5", label: { uk: "обвинувачень у воєнних злочинах", en: "war-crimes charges" } },
    { value: "22+", label: { uk: "українських військових убито в засідці", en: "Ukrainian soldiers killed in the ambush" } },
    {
      value: { uk: "довічне", en: "life" },
      label: { uk: "ув'язнення — вирок 14.03.2025", en: "imprisonment — the 14 Mar 2025 verdict" },
      em: true,
    },
    {
      value: { uk: "1-ше", en: "1st" },
      label: {
        uk: "у Фінляндії засудження за воєнні злочини проти України",
        en: "Finnish war-crimes conviction over Ukraine",
      },
    },
  ],

  glance: [
    { label: { uk: "Обвинувачення", en: "Prosecution" }, value: { uk: "Національна прокуратура Фінляндії", en: "Finnish National Prosecution Authority" } },
    { label: { uk: "Підсудний", en: "Accused" }, value: { uk: "Ян Петровський («Торден»)", en: "Yan Petrovsky (\"Torden\")" } },
    { label: { uk: "Суд", en: "Court" }, value: { uk: "Окружний суд Гельсінкі", en: "Helsinki District Court" } },
    { label: { uk: "Підстава", en: "Basis" }, value: { uk: "універсальна юрисдикція", en: "universal jurisdiction" } },
    { label: { uk: "Події", en: "The events" }, value: { uk: "Донбас, 5 вересня 2014", en: "The Donbas, 5 September 2014" } },
    { label: { uk: "Вирок", en: "Judgment" }, value: { uk: "14 березня 2025", en: "14 March 2025" } },
  ],

  timeline: [
    {
      date: { uk: "5 вер. 2014", en: "5 Sep 2014" },
      iso: "2014-09-05",
      kind: "context",
      label: {
        uk: "Засідка «Русича» на колону «Айдару» під українським прапором",
        en: "Rusich ambushes the Aidar column under a Ukrainian flag",
      },
      note: {
        uk: "Щонайменше 22 українські військові загинули; поранених добивали, тіла нівечили і фотографували.",
        en: "At least 22 Ukrainian soldiers died; the wounded were killed, bodies mutilated and photographed.",
      },
    },
    {
      date: { uk: "лип. 2023", en: "Jul 2023" },
      iso: "2023-07-20",
      kind: "filing",
      label: {
        uk: "Затримання в аеропорту Гельсінкі під вигаданим ім'ям",
        en: "Arrested at Helsinki airport under an assumed name",
      },
      note: {
        uk: "Підсанкційний Петровський летів до Франції як «Воїслав Торден».",
        en: "The sanctioned Petrovsky was travelling to France as \"Voislav Torden\".",
      },
    },
    {
      date: { uk: "жовт. 2024", en: "Oct 2024" },
      iso: "2024-10-01",
      kind: "order",
      label: { uk: "П'ять обвинувачень у воєнних злочинах", en: "Five war-crimes charges" },
      note: {
        uk: "Від віроломного прапора до відмови в пощаді; потерпілі приєднали цивільні позови.",
        en: "From the perfidious flag to denying quarter; victims joined civil claims.",
      },
    },
    {
      date: { uk: "14 бер. 2025", en: "14 Mar 2025" },
      iso: "2025-03-14",
      kind: "judgment",
      label: {
        uk: "Вирок: винен за 4 з 5 пунктів, довічне ув'язнення",
        en: "Verdict: guilty on 4 of 5 charges, life imprisonment",
      },
      note: {
        uk: "Перше у Фінляндії засудження за воєнні злочини у війні проти України. Торден заявив про апеляцію.",
        en: "Finland's first war-crimes conviction from the war on Ukraine. Torden announced an appeal.",
      },
    },
  ],

  verdictsHeading: { uk: "Вирок суду", en: "The court's verdict" },

  verdicts: [
    {
      track: "14.03.2025",
      trackLabel: { uk: "Вирок 14 березня 2025", en: "Verdict of 14 March 2025" },
      claim: {
        uk: "Воєнні злочини — 4 з 5 пунктів обвинувачення; довічне ув'язнення",
        en: "War crimes — four of the five charges; life imprisonment",
      },
      outcome: "convicted",
    },
    {
      track: "14.03.2025",
      trackLabel: { uk: "Вирок 14 березня 2025", en: "Verdict of 14 March 2025" },
      claim: { uk: "Один пункт обвинувачення", en: "One of the charges" },
      outcome: "rejected",
    },
    {
      track: "Далі",
      trackLabel: { uk: "Оскарження", en: "Appeal" },
      claim: { uk: "Торден оголосив апеляцію", en: "Torden announced an appeal" },
      outcome: "not-decided",
    },
  ],

  /* A district court trying an individual for war crimes has no "seat of
   arbitration". With one theatre and no heading of its own the template fell
   back to that label, so a criminal conviction was captioned with the
   vocabulary of an investor-state dispute. */

  theatresHeading: { uk: "Де це сталося", en: "Where it happened" },

  /*
   * The seat is Helsinki, not The Hague. It was "hague", so the map drew a
   * gold dot on the Dutch coast, captioned it "Гельсінкі · Окружний суд
   * Гельсінкі", and ran the universal-jurisdiction reach line to the Donbas
   * from the wrong country — on a page whose whole subject is the distance
   * between the forum and the crime.
   *
   * Helsinki sits 171px above the atlas's default 0 0 1000 560 frame, so the
   * frame opens northwards to 215px above it (room for the seat label) and
   * closes at y = 425, below the Donbas theatre and its halo — Crimea and the
   * Mediterranean are not part of this case. The width grows to 1160 so the
   * band keeps roughly the atlas's landscape proportion (1.81 against 1.79)
   * instead of turning into a portrait.
   */
  mapFocus: { forumKey: "helsinki", reachTo: "luhansk" },

  theatres: [
    {
      place: { uk: "Донбас, вересень 2014", en: "The Donbas, September 2014" },
      tag: { uk: "ЗАСІДКА НА «АЙДАР»", en: "THE AIDAR AMBUSH" },
      markerKeys: ["luhansk"],
      summary: {
        uk: "Операція «Русича» 5 вересня 2014 року — п'ять обвинувачень, розглянутих у Гельсінкі.",
        en: "Rusich's operation of 5 September 2014 — the five charges tried in Helsinki.",
      },
    },
  ],

  interpretations: [
    {
      term: { uk: "Універсальна юрисдикція працює", en: "Universal jurisdiction works" },
      ruling: {
        uk: "Глава 11, розділ 5(1) КК Фінляндії дозволяє судити за воєнні злочини незалежно від місця вчинення і громадянств. Достатньо присутності підозрюваного на території держави.",
        en: "Chapter 11, Section 5(1) of the Finnish Criminal Code reaches war crimes wherever committed and whoever involved. The suspect's presence on the territory suffices.",
      },
    },
    {
      term: { uk: "Два джерела визначення", en: "A two-source definition" },
      ruling: {
        uk: "Фінське визначення воєнних злочинів поєднує Женевські конвенції I–IV з Протоколами I–II і Римський статут — національний суд застосовує ті самі категорії, що й МКС.",
        en: "Finland's war-crimes definition joins Geneva Conventions I–IV with Protocols I–II and the Rome Statute — a national court applying the ICC's own categories.",
      },
    },
    {
      term: { uk: "Пости як злочин", en: "Posts as a crime" },
      ruling: {
        uk: "Пункт про відмову в пощаді ґрунтується на заявах у соцмережах («полонених не братимемо») — оголошення само по собі є воєнним злочином.",
        en: "The denying-quarter charge rests on social-media declarations (\"no prisoners\") — the announcement itself is the war crime.",
      },
    },
  ],

  sources: [
    {
      url: "https://www.ejiltalk.org/prosecuting-members-of-russian-mercenary-groups-for-war-crimes-a-remedy-for-victims/",
      title: "Prosecuting Members of Russian Mercenary Groups for War Crimes, a Remedy for Victims?",
      authors: "Sorcha MacLeod, Iryna Marchuk",
      publication: "EJIL: Talk!",
      date: "2025",
      type: "blog post",
    },
    {
      url: "https://sanctions-finder.com/sanction/velikiy-slavyan/Velikiy%20Slavyan",
      title: "Information about the accused (sanctions profile)",
      authors: "",
      publication: "Sanctions Finder",
      date: "",
      type: "news/insight",
    },
    {
      url: "https://www.pravda.com.ua/eng/news/2025/03/14/7502855/",
      title: "Court in Finland sentences Rusich group commander to life imprisonment for war crimes in Ukraine",
      authors: "",
      publication: "Ukrainska Pravda",
      date: "14 March 2025",
      type: "news/insight",
    },
    {
      url: "https://www.themoscowtimes.com/2025/03/14/finnish-court-sentences-russian-ultranationalist-to-life-in-prison-for-war-crimes-in-ukraine-a88362",
      title: "Finnish Court Sentences Russian Ultranationalist to Life in Prison for War Crimes in Ukraine",
      authors: "",
      publication: "The Moscow Times",
      date: "14 March 2025",
      type: "news/insight",
    },
    {
      url: "https://www.aljazeera.com/amp/news/2025/3/14/finnish-court-convicts-russian-man-for-war-crimes-in-ukraine",
      title: "Finnish court convicts Russian man for war crimes in Ukraine (guilty on four of five charges)",
      authors: "",
      publication: "Al Jazeera",
      date: "14 March 2025",
      type: "news/insight",
    },
    {
      url: "https://www.finlex.fi/en/legislation/translations/1889/eng/39-001",
      title: "The Criminal Code of Finland (translation) — Chapter 11",
      authors: "",
      publication: "Finlex",
      date: "",
      type: "official/treaty",
    },
  ],
};

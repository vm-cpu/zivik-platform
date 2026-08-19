import type { CourtHub, MapEvent } from "./types";

/**
 * Seat cities drawn on the events map.
 *
 * Every institution in `institutions.ts` that sits in Europe appears here, so
 * each of the 39 registry cases is reachable from the map: either through the
 * violation it arose from, or through the courthouse hearing it. ICAO is the
 * one exception — its Council sits in Montreal, outside the map window — so its
 * case surfaces through the MH17 event instead.
 */
export const courtHubs: CourtHub[] = [
  {
    id: "hague",
    city: { uk: "Гаага", en: "The Hague" },
    coord: [4.3, 52.08],
    institutionIds: ["icj", "icc", "pca", "nl"],
  },
  {
    id: "strasbourg",
    city: { uk: "Страсбург", en: "Strasbourg" },
    coord: [7.75, 48.58],
    institutionIds: ["ecthr"],
  },
  {
    id: "hamburg",
    city: { uk: "Гамбург", en: "Hamburg" },
    coord: [9.99, 53.55],
    institutionIds: ["itlos"],
  },
  {
    id: "stockholm",
    city: { uk: "Стокгольм", en: "Stockholm" },
    coord: [18.07, 59.33],
    institutionIds: ["scc"],
  },
  {
    id: "paris",
    city: { uk: "Париж", en: "Paris" },
    coord: [2.35, 48.86],
    institutionIds: ["icc-arb"],
  },
  {
    id: "brussels",
    city: { uk: "Брюссель", en: "Brussels" },
    coord: [4.35, 50.85],
    institutionIds: ["eu"],
  },
  {
    id: "helsinki",
    city: { uk: "Гельсінкі", en: "Helsinki" },
    coord: [24.94, 60.17],
    institutionIds: ["fi"],
  },
  {
    id: "vilnius",
    city: { uk: "Вільнюс", en: "Vilnius" },
    coord: [25.28, 54.69],
    institutionIds: ["lt"],
  },
];

/**
 * Alleged violations, pinned where they happened.
 *
 * `caseIds` must reference real rows in `cases.ts` — the map draws a line from
 * the pin to the seat of every court named there, so a wrong id is visible
 * immediately as a line to the wrong city.
 */
export const mapEvents: MapEvent[] = [
  {
    id: "crimea",
    coord: [34.3, 45.32],
    place: {
      label: { uk: "Кримський півострів", en: "Crimean peninsula" },
      precision: "area",
      // The ECtHR judgment is about an administrative practice across the whole
      // peninsula, not an incident at a point.
      sourceCaseId: "ecthr-4",
    },
    category: "hr",
    weight: 3,
    eyebrow: { uk: "Окупація · з лютого 2014", en: "Occupation · since February 2014" },
    title: { uk: "Окупація Криму", en: "Occupation of Crimea" },
    note: {
      uk: "Зникнення, свавільні затримання, переслідування кримських татар і примусове громадянство — предмет міждержавної заяви України та справи про расову дискримінацію.",
      en: "Disappearances, arbitrary detention, persecution of Crimean Tatars and imposed citizenship — the subject of Ukraine's inter-state application and of the racial-discrimination case.",
    },
    caseIds: ["ecthr-4", "icj-1"],
  },
  {
    id: "crimea-assets",
    coord: [33.4, 44.62],
    place: {
      label: {
        uk: "Крим — активи по всьому півострову",
        en: "Crimea — assets across the peninsula",
      },
      precision: "area",
      // Each arbitration names its own asset (Belbek airport, the Krymenergo
      // grid, Everest Estate in Yalta); the marker stands for all of them until
      // the individual sites are entered per case.
      sourceCaseId: "pca-23",
    },
    category: "asset",
    weight: 3,
    eyebrow: { uk: "Націоналізація · з 2014", en: "Expropriation · since 2014" },
    title: {
      uk: "Захоплення активів у Криму",
      en: "Seizure of assets in Crimea",
    },
    note: {
      uk: "Банки, аеропорт, АЗС і нафтогазові активи, націоналізовані після окупації, стали дванадцятьма інвестиційними арбітражами — а далі справами про визнання й виконання рішень у судах Нідерландів.",
      en: "Banks, an airport, filling stations and oil-and-gas assets nationalised after the occupation became twelve investment arbitrations — and then recognition-and-enforcement cases in the Dutch courts.",
    },
    caseIds: [
      "pca-20",
      "pca-21",
      "pca-22",
      "pca-23",
      "pca-24",
      "pca-25",
      "pca-26",
      "pca-27",
      "pca-28",
      "nl-34",
      "nl-35",
      "nl-36",
      "nl-37",
    ],
  },
  {
    id: "mh17",
    coord: [38.65, 48.13],
    place: {
      label: { uk: "Грабове, Донецька область", en: "Hrabove, Donetsk region" },
      precision: "site",
      // The crash site is established in the Dutch criminal proceedings and in
      // the Dutch Safety Board investigation.
      sourceCaseId: "nl-32",
    },
    category: "war",
    weight: 3,
    eyebrow: { uk: "MH17 · 17.07.2014", en: "MH17 · 17 July 2014" },
    title: { uk: "Збиття рейсу MH17", en: "Downing of flight MH17" },
    note: {
      uk: "298 загиблих над Грабовим. Єдина подія, що дійшла до чотирьох форумів: ЄСПЛ, кримінального суду Нідерландів, Ради ІКАО та — в апеляції на її рішення — Міжнародного Суду ООН.",
      en: "298 people killed over Hrabove. The one event that reached four forums: the ECtHR, a Dutch criminal court, the ICAO Council and — on appeal from its decision — the International Court of Justice.",
    },
    caseIds: ["ecthr-5", "nl-32", "nl-33", "icao-16", "icj-3"],
    featured: true,
  },
  {
    id: "donbas",
    coord: [38.9, 49.02],
    place: {
      label: {
        uk: "Донецька і Луганська області",
        en: "Donetsk and Luhansk regions",
      },
      precision: "area",
      sourceCaseId: "icj-1",
    },
    category: "war",
    weight: 3,
    eyebrow: { uk: "Схід України · з 2014", en: "Eastern Ukraine · since 2014" },
    title: {
      uk: "Збройний конфлікт на сході",
      en: "Armed conflict in the east",
    },
    note: {
      uk: "Обстріли, фінансування збройних формувань і поводження з полоненими — від міждержавних заяв до ЄСПЛ і справи про фінансування тероризму до вироку за універсальною юрисдикцією у Гельсінкі.",
      en: "Shelling, the financing of armed formations and the treatment of prisoners — from inter-state applications to the ECtHR and the terrorism-financing case to a universal-jurisdiction conviction in Helsinki.",
    },
    caseIds: ["ecthr-5", "ecthr-8", "icj-1", "icj-2", "fi-38"],
  },
  {
    id: "kerch",
    coord: [36.63, 45.27],
    place: {
      label: { uk: "Керченська протока", en: "Kerch Strait" },
      precision: "site",
      // ITLOS Order of 25 May 2019 recounts where the vessels were seized.
      sourceCaseId: "itlos-15",
    },
    category: "war",
    weight: 2,
    eyebrow: { uk: "Керченська протока · 25.11.2018", en: "Kerch Strait · 25 November 2018" },
    title: {
      uk: "Затримання кораблів і моряків",
      en: "Detention of vessels and sailors",
    },
    note: {
      uk: "Три військові кораблі й двадцять чотири моряки, захоплені під час переходу протокою. Трибунал з морського права наказав звільнити їх тимчасовими заходами.",
      en: "Three naval vessels and twenty-four sailors seized while transiting the strait. The Tribunal for the Law of the Sea ordered their release by way of provisional measures.",
    },
    caseIds: ["itlos-15"],
  },
  {
    id: "deportation",
    coord: [35.37, 46.84],
    place: {
      label: {
        uk: "Окуповані території півдня та сходу",
        en: "Occupied territories of the south and east",
      },
      precision: "area",
      // The ICC warrants name the conduct, not a place; the marker stands for
      // the occupied territories the children were taken from.
      sourceCaseId: "icc-9",
    },
    category: "hr",
    weight: 3,
    eyebrow: { uk: "Депортації · з 2022", en: "Deportations · since 2022" },
    title: {
      uk: "Депортація дітей та поводження з цивільними",
      en: "Deportation of children and treatment of civilians",
    },
    note: {
      uk: "Незаконне переміщення дітей з окупованих територій до Росії — перші два ордери МКС на арешт. Катування цивільних дійшли й до національних судів: Литва вперше домоглася екстрадиції.",
      en: "The unlawful transfer of children from occupied territories to Russia — the ICC's first two arrest warrants. Torture of civilians reached national courts too: Lithuania secured a first extradition.",
    },
    caseIds: ["icc-9", "icc-10", "icc-situation", "lt-39"],
  },
  {
    id: "strikes",
    coord: [30.52, 50.45],
    place: {
      label: {
        uk: "Енергосистема України — удари по всій території",
        en: "Ukraine's power grid — strikes nationwide",
      },
      precision: "area",
      sourceCaseId: "icc-11",
    },
    category: "war",
    weight: 3,
    eyebrow: { uk: "Удари по інфраструктурі · з 2022", en: "Strikes on infrastructure · since 2022" },
    title: {
      uk: "Удари по цивільних і енергетичних об'єктах",
      en: "Strikes on civilian and energy objects",
    },
    note: {
      uk: "Кампанія ударів по електромережі взимку 2022–2023 років. МКС видав ордери на командувача дальньої авіації, командувача Чорноморського флоту, міністра оборони й начальника генштабу.",
      en: "The campaign against the power grid in the winter of 2022–2023. The ICC issued warrants for the commander of long-range aviation, the Black Sea Fleet commander, the defence minister and the chief of the general staff.",
    },
    caseIds: ["icc-11", "icc-12", "icc-13", "icc-14", "icc-situation"],
  },
  {
    id: "energy-assets",
    coord: [34.63, 47.5],
    place: {
      label: {
        uk: "Запорізька АЕС, Енергодар",
        en: "Zaporizhzhia nuclear plant, Enerhodar",
      },
      precision: "site",
      source: {
        label: { uk: "Розташування станції", en: "Location of the plant" },
      },
    },
    category: "asset",
    weight: 2,
    eyebrow: { uk: "Енергетика · з 2020", en: "Energy · since 2020" },
    title: {
      uk: "Захоплення енергетичних активів",
      en: "Seizure of energy assets",
    },
    note: {
      uk: "Запорізька АЕС, магістральні мережі та гідроелектростанції на окупованих територіях — заявлені арбітражі Енергоатому, Укренерго й Укргідроенерго проти Росії.",
      en: "The Zaporizhzhia nuclear plant, transmission networks and hydroelectric stations in occupied territory — arbitrations notified by Energoatom, Ukrenergo and Ukrhydroenergo against Russia.",
    },
    caseIds: ["pca-29", "pca-30", "pca-31"],
  },
];

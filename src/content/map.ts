import type { Localized } from "./types";

/**
 * What the events map shows.
 *
 * This used to be hardcoded Ukrainian inside public/nasvitlo/map-dark.html, so
 * the English homepage embedded a Ukrainian map and none of it was readable by
 * a search engine. Every string is a pair now; coordinates live in
 * europe-map.json, already projected (see scripts/europe-map.mjs).
 */

/** What kind of harm a site stands for — drives the marker colour. */
export type EventCategory = "hr" | "war" | "asset";

export interface MapEvent {
  /** Marker key in europe-map.json. */
  key: string;
  category: EventCategory;
  /** Marker radius. Bigger means more proceedings, not more harm. */
  size: number;
  /** Date or period, shown above the title. */
  when: Localized;
  title: Localized;
  note: Localized;
  /** Court markers this site draws a line to. */
  courts: string[];
  /** The forums, spelled out for the card. */
  forums: Localized;
  /** How many proceedings this site accounts for. */
  count: Localized;
  /** Opened by default — the card the map leads with. */
  open?: boolean;
  /**
   * Slugs in SUMMARIES this site leads to. Assigned from what each decision is
   * actually about, not from the forum: Oschadbank is a Crimea case but its
   * arbitration sat in Paris, so the seat on the map says nothing about it.
   * Checked at build time in `map-links.ts` — a typo would otherwise render a
   * link to a 404.
   */
  cases?: string[];
}

export interface MapCourt {
  key: string;
  /**
   * Registry institutions seated in this city. The map draws six places where
   * harm happened, but the archive holds 39 proceedings, and the ones not tied
   * to those six places had nowhere to appear. Naming the institutions here
   * lets a court answer for its own caseload — and the union of these lists is
   * checked against the registry at build time, so no proceeding can go
   * unrepresented without the build saying so.
   */
  institutionIds: string[];
  /** Outside the projection's frame — named in the legend, not drawn. */
  offMap?: boolean;
  /** Nudge the label off a collision with a neighbouring city. */
  labelDy?: number;
  city: Localized;
  /**
   * Abbreviation → full name. `abbr` is optional: the international courts go
   * by acronyms that appear in the case citations themselves, but a national
   * court has none, and inventing one for an archive of citations would be
   * worse than leaving it out.
   */
  seats: { abbr?: string; name: Localized }[];
}

export const MAP_COURTS: MapCourt[] = [
  {
    key: "hague",
    institutionIds: ["icj", "icc", "pca", "nl"],
    city: { uk: "Гаага", en: "The Hague" },
    seats: [
      { abbr: "ICJ", name: { uk: "Міжнародний суд ООН", en: "International Court of Justice" } },
      { abbr: "ICC", name: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" } },
      { abbr: "PCA", name: { uk: "Постійна палата арбітражу", en: "Permanent Court of Arbitration" } },
    ],
  },
  {
    key: "strasbourg",
    institutionIds: ["ecthr"],
    city: { uk: "Страсбург", en: "Strasbourg" },
    seats: [
      { abbr: "ЄСПЛ / ECtHR", name: { uk: "Європейський суд з прав людини", en: "European Court of Human Rights" } },
    ],
  },
  {
    key: "hamburg",
    institutionIds: ["itlos"],
    city: { uk: "Гамбург", en: "Hamburg" },
    seats: [
      { abbr: "ITLOS", name: { uk: "Міжнародний трибунал з морського права", en: "International Tribunal for the Law of the Sea" } },
    ],
  },
  {
    key: "paris",
    institutionIds: ["icc-arb"],
    city: { uk: "Париж", en: "Paris" },
    seats: [
      {
        abbr: "PCA",
        name: {
          uk: "Постійна палата третейського суду — місце арбітражу у справі Ощадбанку",
          en: "Permanent Court of Arbitration — seat of the Oschadbank arbitration",
        },
      },
      {
        abbr: "ICC",
        name: {
          uk: "Міжнародний арбітражний суд Міжнародної торгової палати",
          en: "International Court of Arbitration of the International Chamber of Commerce",
        },
      },
    ],
  },
  {
    key: "vilnius",
    institutionIds: ["lt"],
    city: { uk: "Вільнюс", en: "Vilnius" },
    seats: [
      {
        name: {
          uk: "Суди Литви — універсальна юрисдикція",
          en: "The courts of Lithuania — universal jurisdiction",
        },
      },
    ],
  },
  {
    key: "brussels",
    institutionIds: ["eu"],
    // Not a court. Euroclear is where the Russian central-bank assets are
    // immobilised, and the archive tracks it as an enforcement measure rather
    // than a proceeding. It is on the map because the money is the point of
    // several of these cases, and it is labelled for what it is.
    labelDy: 13,
    city: { uk: "Брюссель", en: "Brussels" },
    seats: [
      {
        name: {
          uk: "ЄС і Бельгія — знерухомлення активів (Euroclear), не судовий орган",
          en: "The EU and Belgium — asset immobilisation (Euroclear), not a court",
        },
      },
    ],
  },
  {
    key: "montreal",
    institutionIds: ["icao"],
    // Montreal projects to x = -937 on a frame that runs 0…1200: it is on
    // another continent, so it is named in the legend and not drawn. The
    // appeal against its decision went to the ICJ, which is on the map.
    offMap: true,
    city: { uk: "Монреаль", en: "Montreal" },
    seats: [
      {
        abbr: "ICAO",
        name: {
          uk: "Рада Міжнародної організації цивільної авіації — поза кадром мапи",
          en: "Council of the International Civil Aviation Organization — outside the map's frame",
        },
      },
    ],
  },
  {
    key: "helsinki",
    institutionIds: ["fi"],
    city: { uk: "Гельсінкі", en: "Helsinki" },
    seats: [
      {
        name: {
          uk: "Окружний суд Гельсінкі — універсальна юрисдикція",
          en: "Helsinki District Court — universal jurisdiction",
        },
      },
    ],
  },
  {
    key: "stockholm",
    institutionIds: ["scc"],
    city: { uk: "Стокгольм", en: "Stockholm" },
    seats: [
      { abbr: "SCC", name: { uk: "Арбітражний інститут Торгової палати", en: "Arbitration Institute of the Stockholm Chamber of Commerce" } },
    ],
  },
];

export const MAP_EVENTS: MapEvent[] = [
  {
    key: "crimea",
    cases: ["icj-cerd-icsft", "oschadbank", "dtek-krymenergo"],
    category: "hr",
    size: 26,
    when: { uk: "Окупація · 2014", en: "Occupation · 2014" },
    title: { uk: "Окупація Криму", en: "Occupation of Crimea" },
    note: {
      uk: "Порушення прав людини, націоналізація активів.",
      en: "Human-rights violations and the seizure of assets.",
    },
    // Paris because the Oschadbank award — the largest here at $1.1bn — was
    // made there. The map listed Oschadbank among the decisions this site
    // leads to while drawing no line to where it was decided.
    courts: ["strasbourg", "hague", "paris"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · PCA (Гаага і Париж)",
      en: "ECtHR (Strasbourg) · PCA (The Hague and Paris)",
    },
    count: { uk: "8 проваджень", en: "8 proceedings" },
  },
  {
    key: "kerch",
    // No `cases`: ITLOS and the PCA arbitration over the vessels are both
    // still unwritten. The card says so rather than linking nowhere.
    category: "asset",
    size: 22,
    when: { uk: "Затримання · 2018", en: "Seizure · 2018" },
    title: { uk: "Затримання кораблів", en: "Seizure of the naval vessels" },
    note: {
      uk: "3 кораблі, 24 моряки. ITLOS та арбітраж PCA за Конвенцією з морського права.",
      en: "Three vessels, 24 sailors. ITLOS and a PCA arbitration under the Law of the Sea Convention.",
    },
    courts: ["hamburg", "hague"],
    forums: {
      uk: "ITLOS (Гамбург) · PCA (Гаага)",
      en: "ITLOS (Hamburg) · PCA (The Hague)",
    },
    count: { uk: "2 провадження", en: "2 proceedings" },
  },
  {
    key: "mh17",
    cases: ["hague-mh17", "echr-ukraine-netherlands"],
    category: "war",
    size: 24,
    when: { uk: "MH17 · 17.07.2014", en: "MH17 · 17 July 2014" },
    title: { uk: "Збиття рейсу MH17", en: "The downing of flight MH17" },
    note: {
      uk: "ЄСПЛ, суд Нідерландів та апеляція на рішення Ради ICAO до Міжнародного суду ООН.",
      en: "The ECtHR, a Dutch court, and an appeal from the ICAO Council to the ICJ.",
    },
    courts: ["strasbourg", "hague"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · ICJ і суд Нідерландів (Гаага)",
      en: "ECtHR (Strasbourg) · ICJ and the Dutch courts (The Hague)",
    },
    count: { uk: "3 рішення", en: "3 decisions" },
    open: true,
  },
  {
    key: "donbas",
    cases: ["echr-ukraine-netherlands", "icj-cerd-icsft", "icj-genocide", "finland-torden"],
    category: "war",
    size: 19,
    when: { uk: "Схід · 2014", en: "The east · 2014" },
    title: { uk: "Схід України", en: "Eastern Ukraine" },
    note: {
      uk: "Збройний конфлікт — міждержавні заяви.",
      en: "Armed conflict, brought as inter-State applications.",
    },
    // Helsinki: Finland tried Petrovsky for the Aidar ambush under universal
    // jurisdiction, and that judgment is one of the eight written up here.
    courts: ["strasbourg", "helsinki"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · Окружний суд Гельсінкі",
      en: "ECtHR (Strasbourg) · Helsinki District Court",
    },
    count: { uk: "2 провадження", en: "2 proceedings" },
  },
  {
    key: "energy",
    cases: ["dtek-krymenergo"],
    category: "asset",
    size: 19,
    when: { uk: "Енергетика · 2020", en: "Energy · 2020" },
    title: { uk: "Енергоактиви", en: "Energy assets" },
    note: {
      uk: "Укренерго, Енергоатом, ДТЕК — арбітражі проти РФ.",
      en: "Ukrenergo, Energoatom and DTEK — arbitrations against Russia.",
    },
    courts: ["hague"],
    forums: { uk: "PCA (Гаага)", en: "PCA (The Hague)" },
    count: { uk: "6 арбітражів", en: "6 arbitrations" },
  },
  {
    key: "mariupol",
    cases: ["icc-ukraine"],
    category: "war",
    size: 18,
    when: { uk: "2022", en: "2022" },
    title: { uk: "Воєнні злочини", en: "War crimes" },
    note: {
      uk: "Ситуація в Україні — розслідування та ордери Міжнародного кримінального суду.",
      en: "The situation in Ukraine — the ICC's investigation and its arrest warrants.",
    },
    courts: ["hague"],
    forums: { uk: "ICC (Гаага)", en: "ICC (The Hague)" },
    count: { uk: "6 ордерів", en: "6 warrants" },
  },
];

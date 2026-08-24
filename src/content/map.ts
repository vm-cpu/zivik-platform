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
}

export interface MapCourt {
  key: string;
  city: Localized;
  /** Abbreviation → full name, for the tooltip. */
  seats: { abbr: string; name: Localized }[];
}

export const MAP_COURTS: MapCourt[] = [
  {
    key: "hague",
    city: { uk: "Гаага", en: "The Hague" },
    seats: [
      { abbr: "ICJ", name: { uk: "Міжнародний суд ООН", en: "International Court of Justice" } },
      { abbr: "ICC", name: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" } },
      { abbr: "PCA", name: { uk: "Постійна палата арбітражу", en: "Permanent Court of Arbitration" } },
    ],
  },
  {
    key: "strasbourg",
    city: { uk: "Страсбург", en: "Strasbourg" },
    seats: [
      { abbr: "ЄСПЛ / ECtHR", name: { uk: "Європейський суд з прав людини", en: "European Court of Human Rights" } },
    ],
  },
  {
    key: "hamburg",
    city: { uk: "Гамбург", en: "Hamburg" },
    seats: [
      { abbr: "ITLOS", name: { uk: "Міжнародний трибунал з морського права", en: "International Tribunal for the Law of the Sea" } },
    ],
  },
  {
    key: "stockholm",
    city: { uk: "Стокгольм", en: "Stockholm" },
    seats: [
      { abbr: "SCC", name: { uk: "Арбітражний інститут Торгової палати", en: "Arbitration Institute of the Stockholm Chamber of Commerce" } },
    ],
  },
];

export const MAP_EVENTS: MapEvent[] = [
  {
    key: "crimea",
    category: "hr",
    size: 26,
    when: { uk: "Окупація · 2014", en: "Occupation · 2014" },
    title: { uk: "Окупація Криму", en: "Occupation of Crimea" },
    note: {
      uk: "Порушення прав людини, націоналізація активів.",
      en: "Human-rights violations and the seizure of assets.",
    },
    courts: ["strasbourg", "hague"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · PCA (Гаага)",
      en: "ECtHR (Strasbourg) · PCA (The Hague)",
    },
    count: { uk: "8 проваджень", en: "8 proceedings" },
  },
  {
    key: "kerch",
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
    category: "war",
    size: 19,
    when: { uk: "Схід · 2014", en: "The east · 2014" },
    title: { uk: "Схід України", en: "Eastern Ukraine" },
    note: {
      uk: "Збройний конфлікт — міждержавні заяви.",
      en: "Armed conflict, brought as inter-State applications.",
    },
    courts: ["strasbourg"],
    forums: { uk: "ЄСПЛ (Страсбург)", en: "ECtHR (Strasbourg)" },
    count: { uk: "2 провадження", en: "2 proceedings" },
  },
  {
    key: "energy",
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

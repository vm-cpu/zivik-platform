import { pick, type Localized } from "./types";
import type { Locale } from "@/i18n/config";
import geo from "./europe-map.json";

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
  /**
   * How many items in the registry this site accounts for — the number its
   * own `count` string states, as a number.
   *
   * The marker's radius is derived from it (see `markerSize`) rather than
   * written down beside it, because written down it drifted. The six radii
   * were 26, 22, 24, 19, 19 and 18 against counts of 11, 2, 3, 4, 4 and 6, so
   * the second-largest dot on the map stood for two proceedings and the
   * smallest for six — while the legend told the reader in as many words that
   * a bigger circle means more proceedings. The legend was right about what
   * the map ought to say and the map was not saying it.
   *
   * `count` keeps the wording because the six are not all the same kind of
   * thing — proceedings, decisions, arbitrations, arrest warrants — and this
   * archive does not flatten that in prose. It is one quantity for the purpose
   * of a radius: how much of the record this place accounts for. The guard at
   * the foot of this file checks the two against each other, so a count
   * corrected in the string cannot leave the drawing behind.
   */
  weight: number;
  /**
   * Date or period, shown above the title — and, since the map gained oblast
   * boundaries, the source of the marker's own label on the drawing.
   *
   * NEEDS THE OWNER'S REVIEW. Every tag but one reads "<noun> · <date>", and
   * the map takes the part before the interpunct as the shortest true name the
   * archive already gives that site: Окупація / Occupation, Затримання /
   * Seizure, Схід / The east, Енергетика / Energy, MH17. "Воєнні злочини" has
   * no such noun — its tag is a bare "2022" — so its marker is labelled 2022.
   * Nothing on the drawing is a place name we invented; the alternative was to
   * name six places ourselves, on an archive whose whole subject is who has
   * the right to name them.
   *
   * The consequence is that editing a tag edits the map. If a tag ever needs
   * to grow past about ten characters before the interpunct, the labels want a
   * field of their own rather than a longer derivation.
   */
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
  /**
   * Outside the projection's declared frame, so it has no entry in
   * europe-map.json's `markers` and says where it is in `offAt` instead.
   *
   * Whether it is drawn *as* off the map is a question about the framing, not
   * about this flag: where the view cannot hold the city it is docked against
   * the frame's edge on the bearing of `offAt`, with a tail running off the
   * picture, and where a framing can hold it — the Atlantic one — it is drawn
   * where it is, like any other seat. The comment here used to claim such a
   * city was "named in the legend and not drawn"; it was neither. `EventsMap`
   * filtered it out of the drawing and nothing else rendered it, so the ICAO
   * Council, which decided the MH17 case the ICJ is now hearing on appeal,
   * appeared nowhere at all.
   */
  offMap?: boolean;
  /**
   * Where the city really projects to, in the same units as
   * europe-map.json — off the 0…1200 × 0…460 frame, which is the whole point.
   * Computed with the projection in scripts/europe-map.mjs rather than
   * guessed; the marker list in that script only carries points that land
   * inside the frame, so an off-map seat has to say where it is here.
   *
   * It is a position and not merely a bearing: the Atlantic framing draws the
   * marker at it, and the widest view the reader can reach is derived from it,
   * so a second off-map seat would widen that framing by itself.
   */
  offAt?: { x: number; y: number };
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

/**
 * The diameter a site's marker is drawn at, from what it stands for.
 *
 * Square-rooted, so the mark's *area* rises with the count rather than its
 * width — the reader compares blobs, not radii, and a linear radius makes 11
 * look thirty times two rather than five. Fitted to the range the drawing
 * already used, 18…26 units, so nothing about the map's scale changes: the two
 * ends land exactly where they were (Crimea at 11 keeps 26, the Kerch strait
 * at 2 keeps 18) and only the middle four move into the right order.
 *
 * Rounded to a half unit. One decimal of a projection unit is 0.06 CSS pixels
 * at the framing the map opens in; the extra digits were noise in the markup.
 */
export function markerSize(weight: number): number {
  const lo = 2;
  const hi = 11;
  const n = Math.min(hi, Math.max(lo, weight));
  const t = (Math.sqrt(n) - Math.sqrt(lo)) / (Math.sqrt(hi) - Math.sqrt(lo));
  return Math.round((18 + 8 * t) * 2) / 2;
}

/**
 * What a court's card says where the map has nothing to link it to.
 *
 * Three of the nine seats hear proceedings that none of the six sites on this
 * map is about — Stockholm (the Naftogaz/Gazprom gas arbitrations), Vilnius
 * (Lithuania's universal-jurisdiction proceedings) and Brussels (which is not
 * a court at all) — so `courtSites` comes back empty for them and the card had
 * a heading with nothing under it. An empty section is not a fact; this is.
 *
 * A statement about this map's own structure rather than about any one court,
 * which is why it is one sentence here and not a field on nine entries. It
 * lives with the map's data rather than in the dictionaries because it is only
 * true of this drawing and its six places: reword the sites and it changes.
 */
export const MAP_COURT_NO_SITES: Localized = {
  uk: "Ці провадження не привʼязані до жодного з шести місць на мапі.",
  en: "These proceedings are not tied to any of the six places on this map.",
};

export const MAP_COURTS: MapCourt[] = [
  {
    key: "hague",
    institutionIds: ["icj", "icc", "pca", "nl"],
    city: { uk: "Гаага", en: "The Hague" },
    seats: [
      { abbr: "ICJ", name: { uk: "Міжнародний суд ООН", en: "International Court of Justice" } },
      { abbr: "ICC", name: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" } },
      { abbr: "PCA", name: { uk: "Постійна палата третейського суду", en: "Permanent Court of Arbitration" } },
      {
        // Six proceedings — the MH17 verdict and four Hoge Raad cassations —
        // and the map named none of them. The Supreme Court of the Netherlands
        // sits in The Hague (Korte Voorhout 8), as does the District Court
        // whose ECLI the MH17 judgment carries (RBDHA); that trial was heard
        // in the Schiphol justice complex for security, but the court is the
        // Hague one.
        name: {
          uk: "Окружний суд Гааги та Верховний суд Нідерландів",
          en: "The Hague District Court and the Supreme Court of the Netherlands",
        },
      },
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
    // Montreal projects to (-936.9, 407.1) on a frame that runs 0…1200 × 0…460:
    // it is on another continent, and widening the *projection* to reach it
    // would shrink Europe to nothing. So it is docked against the frame's
    // western edge, on that bearing, with a tail running off the picture —
    // the same mechanism any other off-map seat would get. The appeal against
    // its decision went to the ICJ, which is on the map.
    //
    // Widening the *view* is a different thing, and the map now offers it: the
    // Atlantic framing puts this point inside the picture, where it draws as
    // an ordinary court marker with an ordinary connector. The dock is what
    // the other framings do, not what this seat is.
    offMap: true,
    offAt: { x: -936.9, y: 407.1 },
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
    weight: 11,
    when: { uk: "Окупація · 2014", en: "Occupation · 2014" },
    title: { uk: "Окупація Криму", en: "Occupation of Crimea" },
    note: {
      uk: "Порушення прав людини, націоналізація активів.",
      en: "Human-rights violations and the seizure of assets.",
    },
    // Paris because the Oschadbank award — the largest here at $1.1bn — was
    // made there. The map listed Oschadbank among the decisions this site
    // leads to while drawing no line to where it was decided.
    //
    // The ICJ is named because this card links one of its cases. It was
    // missing from `forums` while `cases` led to icj-cerd-icsft, so the card
    // spelled out two of the three fora it actually sends a reader to.
    courts: ["strasbourg", "hague", "paris"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · ICJ і PCA (Гаага) · PCA (Париж)",
      en: "ECtHR (Strasbourg) · the ICJ and the PCA (The Hague) · the PCA (Paris)",
    },
    // WHAT THIS COUNTS: the registry rows whose subject is the occupation of
    // Crimea, in the fora named above. Eleven, and they can be listed —
    // icj-1 (CERD limb; its note reads "Crimea, Donbas"), ecthr-4 (Ukraine v
    // Russia (re Crimea)), and the nine BIT arbitrations over property taken
    // in Crimea: pca-20 Naftogaz/Chornomornaftogaz (PCA 2017-16), pca-21
    // Belbek, pca-22 PrivatBank, pca-23 Oschadbank, pca-24 Ukrnafta, pca-25
    // Stabil and others, pca-26 Everest Estate, pca-27 Lugzor and others,
    // pca-28 DTEK Krymenergo.
    //
    // It said 8, and no definition reconstructs 8 from this registry: the
    // arbitrations alone are 9, and with the ICJ and the ECtHR they are 11.
    // Deliberately NOT counted, so the next reader does not re-derive them:
    // nl-34…nl-37, the Hoge Raad set-aside and enforcement proceedings, which
    // are the afterlife of four awards already counted here rather than
    // separate Crimea cases; and eu-40 (Euroclear), which the registry itself
    // records as an enforcement measure and not a proceeding.
    count: { uk: "11 проваджень", en: "11 proceedings" },
  },
  {
    key: "kerch",
    // No `cases`: ITLOS and the PCA arbitration over the vessels are both
    // still unwritten. The card says so rather than linking nowhere.
    category: "asset",
    weight: 2,
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
    // WHAT THIS COUNTS: two proceedings — the ITLOS provisional-measures case
    // (ITLOS Case No. 26) and the Annex VII merits arbitration (PCA Case No.
    // 2019-28). Both are correct and both are named in the registry, but the
    // registry carries them on ONE row, itlos-15, whose citation recites both.
    // So the map counts two where the registry counts one, on purpose: this is
    // a difference in what a "row" is, not a disagreement about the facts.
    // Do not reconcile it by changing either side.
    count: { uk: "2 провадження", en: "2 proceedings" },
  },
  {
    key: "mh17",
    cases: ["hague-mh17", "echr-ukraine-netherlands"],
    category: "war",
    weight: 3,
    when: { uk: "MH17 · 17.07.2014", en: "MH17 · 17 July 2014" },
    title: { uk: "Збиття рейсу MH17", en: "The downing of flight MH17" },
    note: {
      uk: "ЄСПЛ, суд Нідерландів та апеляція на рішення Ради ICAO до Міжнародного суду ООН.",
      en: "The ECtHR, a Dutch court, and an appeal from the ICAO Council to the ICJ.",
    },
    // Montreal was missing, and the count already knew it: three decisions,
    // two of them summarised here, the third the ICAO Council's own — the
    // registry's icao-16, "Australia and the Netherlands v. Russian
    // Federation … under Article 84 of the Chicago Convention". The note below
    // has always named it. The map drew no line to it because the Council sits
    // off the frame; it is docked at the western edge now, so the chain the
    // note describes — Council, then appeal to the ICJ — can be seen.
    courts: ["strasbourg", "hague", "montreal"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · ICJ і суд Нідерландів (Гаага) · Рада ICAO (Монреаль)",
      en: "ECtHR (Strasbourg) · ICJ and the Dutch courts (The Hague) · the ICAO Council (Montreal)",
    },
    count: { uk: "3 рішення", en: "3 decisions" },
    open: true,
  },
  {
    key: "donbas",
    cases: ["echr-ukraine-netherlands", "icj-cerd-icsft", "icj-genocide", "finland-torden"],
    category: "war",
    weight: 4,
    when: { uk: "Схід · 2014", en: "The east · 2014" },
    title: { uk: "Схід України", en: "Eastern Ukraine" },
    // Three of the four are inter-State applications; the fourth, Finland v
    // Petrovsky, is a national criminal trial of one man. The note used to say
    // only "inter-State applications", which described the card's own link
    // list wrongly.
    note: {
      uk: "Збройний конфлікт — міждержавні заяви та вирок за універсальною юрисдикцією.",
      en: "Armed conflict — inter-State applications and a universal-jurisdiction conviction.",
    },
    // Helsinki: Finland tried Petrovsky for the Aidar ambush under universal
    // jurisdiction, and that judgment is one of the eight written up here.
    // The Hague, because two of the four cases this card links are the ICJ's
    // (icj-cerd-icsft and icj-genocide) and the card drew no line to them.
    courts: ["strasbourg", "hague", "helsinki"],
    forums: {
      uk: "ЄСПЛ (Страсбург) · ICJ (Гаага) · Окружний суд Гельсінкі",
      en: "ECtHR (Strasbourg) · the ICJ (The Hague) · Helsinki District Court",
    },
    // WHAT THIS COUNTS: the four proceedings this card links, one per registry
    // row — ecthr-5 (Ukraine and Netherlands v Russia), icj-1 (the ICSFT limb,
    // terrorism financing in the east), icj-2 (Allegations of Genocide) and
    // fi-38 (Finland v Petrovsky). It said 2 while linking 4.
    // Deliberately NOT counted: ecthr-8, Russia's own inter-State application
    // (App 36958/21, Rule 39 refused). The registry fixes no place for it —
    // its note is the application number and nothing else — so it cannot be
    // put on this site's card without deciding, here, what it is about.
    count: { uk: "4 провадження", en: "4 proceedings" },
  },
  {
    key: "energy",
    cases: ["dtek-krymenergo"],
    category: "asset",
    weight: 4,
    when: { uk: "Енергетика · 2020", en: "Energy · 2020" },
    title: { uk: "Енергоактиви", en: "Energy assets" },
    note: {
      uk: "Укренерго, Енергоатом, ДТЕК — арбітражі проти РФ.",
      en: "Ukrenergo, Energoatom and DTEK — arbitrations against Russia.",
    },
    courts: ["hague"],
    forums: { uk: "PCA (Гаага)", en: "PCA (The Hague)" },
    // WHAT THIS COUNTS: the arbitrations against Russia over generation and
    // grid assets that this registry holds — pca-28 DTEK Krymenergo (PCA
    // 2018-41), pca-29 Ukrenergo (PCA 2020-17), pca-30 Energoatom (II) and
    // pca-31 Ukrhydroenergo. Four, and the note above names three of the four
    // operators.
    //
    // It said 6, which nothing here reconstructs. Two things it is not: the
    // Naftogaz/Gazprom gas arbitrations (scc-17, scc-18, icc-arb-19) and
    // Naftogaz v Russia (pca-20) are gas-supply and Crimea-expropriation
    // matters, and adding them gives 8, not 6; and row pca-30 is styled
    // "(II)" while the registry holds no Energoatom (I), so the missing first
    // arbitration cannot be counted from this file either. If the six is
    // right in the world, the two extra proceedings have to enter the
    // registry before this card may say so.
    count: { uk: "4 арбітражі", en: "4 arbitrations" },
  },
  {
    key: "mariupol",
    cases: ["icc-ukraine"],
    category: "war",
    weight: 6,
    when: { uk: "2022", en: "2022" },
    title: { uk: "Воєнні злочини", en: "War crimes" },
    note: {
      uk: "Ситуація в Україні — розслідування та ордери Міжнародного кримінального суду.",
      en: "The situation in Ukraine — the ICC's investigation and its arrest warrants.",
    },
    courts: ["hague"],
    forums: { uk: "ICC (Гаага)", en: "ICC (The Hague)" },
    // WHAT THIS COUNTS: the six arrest warrants on the registry — icc-9 Putin,
    // icc-10 Lvova-Belova, icc-11 Kobylash, icc-12 Sokolov, icc-13 Shoigu,
    // icc-14 Gerasimov. Warrants, not proceedings: the umbrella situation
    // (icc-situation, ICC-01/22) is the investigation they issue from and is
    // not one of the six.
    count: { uk: "6 ордерів", en: "6 warrants" },
  },
];

/**
 * The short name a city's court wears on the drawing when it lights up.
 *
 * The map labelled its cities and nothing else, so "ГААГА" stood for four
 * institutions and said none of them. Only the abbreviations are used, because
 * those are what the case citations carry; where a city has none at all — a
 * national court, an enforcement body — the clause before the em dash in its
 * own name stands in, which is the shortest true name this file already
 * records. Nothing here is invented, and a seat that has neither is simply not
 * badged: the card and the legend still spell every institution out.
 */
export function courtBadges(c: MapCourt, locale: Locale): string[] {
  const abbrs = c.seats.map((s) => s.abbr).filter((a): a is string => !!a);
  if (abbrs.length) return abbrs;
  const first = c.seats[0];
  return first ? [pick(first.name, locale).split(" — ")[0].trim()] : [];
}

/**
 * Everything the drawing needs about a court that its card does not.
 *
 * Returned as one object so a render site adds a single spread rather than a
 * line per field — `EventsMap` is a client component and its props are
 * resolved on the server, so anything the SVG needs has to come through here.
 */
export function courtMarks(c: MapCourt, locale: Locale) {
  return { badges: courtBadges(c, locale), offAt: c.offAt };
}

/**
 * Nothing on this map may vanish without the build saying so.
 *
 * `map-links.ts` already refuses to build when a linked decision or a seated
 * institution disagrees with the registry. It could not catch the failure that
 * actually shipped: Montreal had a court entry, a comment claiming it was
 * "named in the legend", and no point in europe-map.json — so it rendered
 * nowhere, and nothing complained. This is the geometry half of that check,
 * next to the data it guards.
 */
{
  const markers = geo.markers as Record<string, number[]>;
  const keys = new Set(MAP_COURTS.map((c) => c.key));
  const wrong: string[] = [];
  for (const c of MAP_COURTS) {
    if (c.offMap) {
      if (!c.offAt) wrong.push(`court "${c.key}" is offMap and has no offAt to dock it by`);
    } else if (!(c.key in markers)) {
      wrong.push(`court "${c.key}" has no point in europe-map.json and is not offMap`);
    }
  }
  for (const e of MAP_EVENTS) {
    if (!(e.key in markers)) wrong.push(`event "${e.key}" has no point in europe-map.json`);
    // The radius says how much of the record a place accounts for, and the
    // card says it in words. They came apart once — six radii in one order and
    // six counts in another — so they are checked against each other here.
    // Both locales, because either string could be the one that is edited.
    for (const loc of ["uk", "en"] as const) {
      const said = /^\s*(\d+)/.exec(e.count[loc])?.[1];
      if (said !== String(e.weight)) {
        wrong.push(
          `event "${e.key}" is drawn for ${e.weight} but its ${loc} count reads "${e.count[loc]}"`,
        );
      }
    }
    for (const k of e.courts) {
      if (!keys.has(k)) wrong.push(`event "${e.key}" draws a line to unknown court "${k}"`);
    }
  }
  if (wrong.length) {
    throw new Error(`the map would silently drop something:\n  ${wrong.join("\n  ")}`);
  }
}

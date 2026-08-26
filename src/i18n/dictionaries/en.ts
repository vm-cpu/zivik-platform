import type { Dictionary } from "./uk";

/**
 * English UI dictionary. Typed as `Dictionary`, so it must mirror the exact
 * shape of the canonical Ukrainian dictionary — a missing or renamed key is a
 * compile error.
 *
 * The one-word rule the Ukrainian file sets out applies here word for word.
 * USER DECISION: the collection has a single name in English — "Library of
 * decisions" — and it is what the page title, the H1, the nav item, the hero
 * CTA, the home band, the footer link and every back link say. The earlier
 * library/registry split ("the library" the site, "the registry" the list) is
 * overruled; do not restore it, and do not reintroduce "registry" as a name
 * for the collection or for anything pointing at it. "Register" stays only
 * where a court or a State names its own — the Register of Damage for Ukraine,
 * the register of depositors quoted in the Oschadbank award — and "docket" is
 * the word for a case number.
 *
 * The route is still `/registry` and the keys are still `registry.*`: renaming
 * a URL that has already been given out is not a vocabulary change.
 */
const en: Dictionary = {
  meta: {
    title: "nasvitlo — international court decisions on the aggression against Ukraine",
    description:
      "An open library of international court decisions on Russia's aggression against Ukraine: the ECtHR, ICJ, ICC and arbitral tribunals. UCU Faculty of Law.",
    ogAlt: "nasvitlo — library of international court decisions",
  },
  nav: {
    skip: "Skip to content",
    menu: "Menu",
    home: "Home",
      about: "About us",
    decisions: "Library of decisions",
    map: "Map",
    team: "Team",
    partners: "Partners",
    blog: "Blog",
  },
  brand: {
    facultyAlt: "UCU Faculty of Law",
    wordmark: "nasvitlo",
  },
  hero: {
    credit: "A project of",
    creditCentre: "the Louis B. Sohn Research Centre",
    creditFaculty: "UCU Faculty of Law",
    lead: "The Library of Accountability and Justice for Ukraine — lighting the legal road Ukraine is walking towards justice.",
    ctaRegistry: "Library of decisions",
    ctaMap: "Map",
    chainHint: "pull the cord",
    lampLabel: "Turn the lamp on or off",
  },
  intro: {
    text: "An online library of international case-law (the International Court of Justice, the ECtHR, the ICC, the International Tribunal for the Law of the Sea, the Permanent Court of Arbitration) and of foreign national courts, arising from Ukraine's initiatives to hold Russia accountable for violations committed during the war against Ukraine.",
    about: "About us",
  },
  about: {
    more: "More about the project",
  },
  slogan: "We research · We explain · We bring to light",
  pending: {
    title: "Still being researched",
    body: "This proceeding is in the library, but its summary is not written yet — we are working on it. Below is what is already known, and a link to the court's own document where one is public.",
    forum: "Court",
    status: "Stage",
    kind: "Field",
    docket: "Docket",
    official: "The court's document",
    toRegistry: "The library of decisions",
    toMap: "The map",
  },
  quote: {
    text: "The Russian Federation shall immediately suspend the military operations that it commenced on 24 February 2022 in the territory of Ukraine.",
    source: "International Court of Justice · Provisional Measures · 16 March 2022",
    read: "Read the decision",
  },
  mapSection: {
    close: "Close card",
    label: "Map",
    heading: "Alleged violations and the courts assessing them",
    description:
      "Alleged violations — shelling, deportations and seizures — linked by a dotted line to the court where their legal assessment is made.",
    fullMap: "Full map →",
    legendCourt: "The court hearing it",
    legendLit: "The decision is written up",
    legendUnlit: "Still being researched",
    courtsSeat: "The courts sit in",
    courtHears: "Hears",
    inLibrary: "Which ones",
    caseload: "{n} {w} in the library",
    caseloadWord: { one: "proceeding", few: "proceedings", many: "proceedings" },
    zoomLabel: "Framing",
    zoomWide: "Europe",
    zoomClose: "Ukraine",
    zoomAtlantic: "Atlantic",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    wheelHint: "Ctrl or ⌘ + scroll to zoom",
    reads: "Decisions written up",
    pending: "Summary in preparation",
    legendWhat: "Places",
    legendHow: "Courts and links",
    legendLine: "Dashed line — the link between a court and an event",
    sizeKey: "A bigger circle means more proceedings",
    pageTitle: "The map of violations and courts",
    pageLede: "The violations happened in Ukraine; they are judged thousands of kilometres away. The map holds both ends: the place, and the court hearing it.",
    backHome: "Home",
  },
  registry: {
    label: "Library of decisions",
    heading: "Every proceeding against Russia, in one library",
    description:
      "Here the light is already on. The library grows step by step: first we add the case, then prepare a summary, a timeline and the documents.",
    fullRegistry: "The whole library",
    allCases: "All {count} {court} {cases} →",
    caseWord: { one: "case", few: "cases", many: "cases" },
    legendLit: "Ready to read: summary, timeline, documents",
    legendQueued: "Only the case record so far — the summary is being written",
    stageName: "Stage",
    outcomeName: "Decision type",
    stage: {
      preliminary: "Preliminary stage",
      investigation: "Investigation",
      merits: "Merits pending",
      satisfaction: "Awaiting satisfaction",
      appeal: "Under appeal",
      remitted: "Remitted",
      enforcement: "Enforcement",
      suspended: "Suspended",
      frozen: "Frozen",
      upcoming: "Yet to be heard",
      concluded: "Concluded",
    },
    outcome: {
      judgment: "Judgment",
      award: "Final award",
      verdict: "Verdict",
      liability: "Liability established",
      warrant: "Warrant",
      order: "Procedural orders",
      upheld: "Arbitration upheld",
      settlement: "Settled",
      rejected: "Rejected",
    },
  },
  newsletter: {
    heading: "Each month, a few more decisions brought to light",
    text: "A letter on the decisions we summarised over the month: what the court found, and what of it can be relied on.",
    subscribe: "Get the letter",
    support: "Support the library",
    assurance: "Summaries only. Unsubscribe from any letter.",
  },
  partners: {
    label: "Partners",
    heading: "Who we work with",
    all: "All partners",
    note: "The list is short, and it will grow.",
  },
  footer: {
    tagline:
      "A library of international court decisions on Russia's aggression against Ukraine. We shed light on what they say.",
    org: "The Louis B. Sohn Research Centre",
    faculty: "UCU Faculty of Law",
    colArchive: "Library",
    colCenter: "Centre",
    colContacts: "Contacts",
    linkRegistry: "Library of decisions",
    linkMap: "Events map",
    linkCourts: "Courts and institutions",
    linkDocs: "Documents",
    linkAbout: "About us",
    linkTeam: "Team",
    linkPartners: "Partners",
    linkBlog: "Blog",
    email: "nasvitlo@ucu.edu.ua",
    /* "Svientsitskoho" is the transliteration content/legal.ts already
       uses; the two must not spell the same street two ways. */
    address: "17 Svientsitskoho St., Lviv, 79011",
    rights: "© 2026 the Louis B. Sohn Research Centre, UCU. Materials — CC BY 4.0.",
    privacy: "Privacy policy",
    terms: "Terms of use",
  },
};

export default en;

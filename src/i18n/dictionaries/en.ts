import type { Dictionary } from "./uk";

/**
 * English UI dictionary. Typed as `Dictionary`, so it must mirror the exact
 * shape of the canonical Ukrainian dictionary — a missing or renamed key is a
 * compile error.
 */
const en: Dictionary = {
  meta: {
    title: "nasvitlo — international court decisions on the aggression against Ukraine",
    description:
      "An open archive of international court decisions on Russia's aggression against Ukraine: ECtHR, the International Court of Justice, the ICC, maritime arbitration. A project of the UCU Faculty of Law.",
    ogAlt: "nasvitlo — archive of international court decisions",
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
    text: "An online collection of international case-law (the International Court of Justice, the ECtHR, the ICC, the International Tribunal for the Law of the Sea, the Permanent Court of Arbitration) and of foreign national courts, arising from Ukraine's initiatives to hold Russia accountable for violations committed during the war against Ukraine.",
    about: "About the Library",
  },
  about: {
    more: "More about the project",
  },
  slogan: "We research · We explain · We bring to light",
  aboutRail: {
    title: "At a glance",
    scope: "Scope",
    scopeVal: "since 2014",
    proceedings: "Proceedings",
    institutions: "Instances",
    audience: "Audience",
    audienceVal: "scholars, practitioners, interested readers",
  },
  pending: {
    title: "Still being researched",
    body: "This proceeding is in the registry, but its summary is not written yet — we are working on it. Below is what is already known, and a link to the court's own document where one is public.",
    forum: "Court",
    status: "Stage",
    kind: "Field",
    docket: "Docket",
    official: "The court's document",
    toRegistry: "The full registry",
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
    legendHr: "Human rights",
    legendWar: "War crimes",
    legendAsset: "Seizure of assets",
    legendCourt: "The court hearing it",
    legendLit: "The decision is written up",
    legendUnlit: "Still being researched",
    courtsSeat: "The courts sit in",
    courtHears: "Hears",
    caseload: "{n} proceedings in the registry",
    zoomLabel: "Framing",
    zoomWide: "Europe",
    zoomClose: "Ukraine",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reads: "Decisions written up",
    pending: "Summary in preparation",
    legendWhat: "Places",
    legendHow: "Courts and links",
    legendLine: "A dashed line runs to the court hearing it",
    sizeKey: "A bigger circle means more proceedings",
    pageTitle: "The map of violations and courts",
    pageLede: "Every dot is an alleged violation. The dashed line runs to the court weighing it in law, and the card leads on to the decision itself.",
    backHome: "Home",
  },
  registry: {
    label: "Library of decisions",
    heading: "An online collection of international case-law",
    description:
      "Here the light is already on. The registry grows step by step: first we add the case, then prepare a summary, a timeline and the documents.",
    fullRegistry: "Full registry",
    allCases: "All {count} {court} {cases} →",
    caseWord: { one: "case", few: "cases", many: "cases" },
    legendLit: "Ready to read: summary, timeline, documents",
    legendQueued: "Only the case record so far — the summary is being written",
    status: {
      decided: "Decided",
      progress: "Pending",
      warrant: "Warrant",
      settled: "Settled",
      enforcement: "Enforcement",
      frozen: "Frozen",
      rejected: "Rejected",
    },
  },
  newsletter: {
    heading: "Each month, a few more decisions brought to light",
    text: "A letter on the decisions we summarised over the month: what the court found, and what it will support.",
    subscribe: "Get the letter",
    support: "Support the collection",
    assurance: "Summaries only. Unsubscribe from any letter.",
  },
  partners: {
    label: "Partners",
    heading: "Who we work with",
    all: "All partners →",
    note: "Placeholders for logos — send the files and we'll add the real ones.",
  },
  footer: {
    tagline:
      "An open archive of international court decisions on Russia's aggression against Ukraine.",
    org: "The Louis B. Sohn Research Centre",
    faculty: "UCU Faculty of Law",
    colArchive: "Archive",
    colCenter: "Centre",
    colContacts: "Contacts",
    linkRegistry: "Case registry",
    linkMap: "Events map",
    linkCourts: "Courts and instances",
    linkDocs: "Documents",
    linkAbout: "About the Library",
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

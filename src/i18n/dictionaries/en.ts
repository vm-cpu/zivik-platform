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
    eyebrow:
      "A project of the Louis B. Sohn Research Center, UCU Faculty of Law",
    lead: "The Library of Accountability and Justice for Ukraine — lighting the legal path Ukraine walks towards justice.",
    sub: "An online collection of international case-law (the International Court of Justice, the ECtHR, the ICC, the International Tribunal for the Law of the Sea, the Permanent Court of Arbitration) and of foreign domestic case-law concerning Ukraine's initiatives to hold Russia accountable for violations committed during the war against Ukraine.",
    ctaRegistry: "Library of decisions",
    ctaMap: "Map",
    chainHint: "pull the cord",
    lampLabel: "Turn the lamp on or off",
  },
  intro: {
    text: "We read the decisions of international courts and retell them in plain language — so you can rely on them in an argument, an article, or a claim.",
    about: "About the project",
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
  quote: {
    text: "The Russian Federation shall immediately suspend the military operations that it commenced on 24 February 2022 in the territory of Ukraine.",
    source: "International Court of Justice · Provisional Measures · 16 March 2022",
  },
  mapSection: {
    label: "Map",
    heading: "Alleged violations and the courts assessing them",
    description:
      "Alleged violations — shelling, deportations and seizures — linked by a dotted line to the court where their legal assessment takes place.",
    fullMap: "Full map →",
    legendEvent: "Alleged violation: shelling, deportation, seizure",
    legendCourt: "The court assessing it",
    categories: {
      hr: "Human rights",
      war: "Hostilities",
      asset: "Assets",
    },
    filterCategory: "Type of violation",
    filterForum: "Court",
    allForums: "All courts",
    onlyAnalysed: "With a summary only",
    reset: "Reset",
    counter: "{shown} of {total} events",
    empty: "No event matches these filters.",
    listTitle: "Alleged violations",
    hint: "Pick an event on the map or in the list to see the proceedings assessing it.",
    proceedings: "Proceedings",
    summaryLink: "Summary",
    decisionLink: "Text of the decision",
    inRegistry: "The whole library →",
    noDocument: "The text is not published yet",
    offMap: "Off the map",
    seatsTitle: "Courts in this city",
    proceedingsFew: "proceeding",
    proceedingsMany: "proceedings",
    inLibrary: "in the library",
    hubRegistry: "Show in the library →",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomReset: "Whole map",
    close: "Close",
    unmapped:
      "Another {n} proceedings are not pinned to a place — they are reachable through their court or in the library.",
    litBadge: "summary",
    loading: "Loading the map…",
  },
  registry: {
    label: "Library of decisions",
    heading: "An online collection of international case-law",
    description:
      "Here the light is already on. The collection grows step by step: first we add the case, then prepare a summary, a timeline and the documents.",
    fullRegistry: "The whole library ({count})",
    processed: "Processed",
    of: "of",
    queuedRest: "the rest are queued",
    onlyAnalysed: "Analysed only ({count})",
    allCases: "All {count} {court} cases →",
    legendLit: "Processed decision: summary, timeline, documents",
    legendQueued: "Queued: added, summary in preparation",
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
    heading: "Want to receive new summaries?",
    text: "One email a month: what the courts decided and what it means.",
    subscribe: "Subscribe",
    support: "Support the project",
  },
  team: {
    label: "Team",
    heading: "Who works on the library",
  },
  partners: {
    label: "Partners",
    heading: "Who we work with",
  },
  footer: {
    tagline:
      "An open archive of international court decisions on Russia's aggression against Ukraine.",
    org: "Louis Sohn Center",
    faculty: "UCU Faculty of Law",
    colArchive: "Archive",
    colCenter: "Center",
    colContacts: "Contacts",
    linkRegistry: "Library of decisions",
    linkMap: "Map of violations",
    linkCourts: "Courts and instances",
    linkDocs: "Documents",
    linkAbout: "About the project",
    linkTeam: "Team",
    linkPartners: "Partners",
    linkBlog: "Blog",
    email: "nasvitlo@ucu.edu.ua",
    address: "Lviv, 2a Kozelnytska St.",
    rights: "© 2026 Louis Sohn Center, UCU. Materials — CC BY 4.0.",
    privacy: "Privacy policy",
    terms: "Terms of use",
  },
};

export default en;

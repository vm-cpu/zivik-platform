export interface ReaderSection {
  number: string;
  title: string;
  description: string;
  href: string;
  group: "reading" | "reference";
}

export const readerSections: ReaderSection[] = [
  {
    number: "I",
    title: "The case",
    description: "Identifier, parties, findings, and the disjoined just-satisfaction track. The canonical page on application 28525/20.",
    href: "/reader/case",
    group: "reading",
  },
  {
    number: "II",
    title: "Procedural history",
    description: "Filings, joinder, hearings, judgment, disjoinder. From 13 March 2014 to today.",
    href: "/reader/procedural-history",
    group: "reading",
  },
  {
    number: "III",
    title: "Annotated judgment",
    description: "The merits-judgment press release, section by section, with paragraph anchors into the controlling parts of the public record.",
    href: "/reader/judgment",
    group: "reading",
  },
  {
    number: "IV",
    title: "Quotations",
    description: "Direct quotations used on this site, with attribution and a citation that copies to the clipboard.",
    href: "/reader/quotations",
    group: "reference",
  },
  {
    number: "V",
    title: "Facts",
    description: "Atomic facts curated from primary materials, filtered by topic, sortable, copyable.",
    href: "/reader/facts",
    group: "reference",
  },
  {
    number: "VI",
    title: "Voices on the record",
    description: "Three event bundles — the downing, the next of kin, the children — rendered through six voices each: Court, Ukraine, the Netherlands, Russia, monitor, academic.",
    href: "/reader/voices",
    group: "reference",
  },
  {
    number: "VII",
    title: "People",
    description: "Judges, defendants, individuals named on ICC arrest warrants. Each entry sourced.",
    href: "/reader/people",
    group: "reference",
  },
  {
    number: "VIII",
    title: "Conflict timeline",
    description: "Events the Court relied on as evidence — Mariupol, Kramatorsk, the children transfers, the siege cities — alongside the procedural-political turning points.",
    href: "/reader/timeline",
    group: "reference",
  },
  {
    number: "IX",
    title: "Glossary",
    description: "Defined terms used on this site: Buk-TELAR, JIT, de facto organ, administrative practice, just satisfaction, Article 3 bis, and others.",
    href: "/reader/glossary",
    group: "reference",
  },
  {
    number: "X",
    title: "Sources",
    description: "Bibliography of primary documents and secondary commentary cited on this site.",
    href: "/reader/sources",
    group: "reference",
  },
  {
    number: "XI",
    title: "Reading list",
    description: "External materials beyond what is cited here — primary documents, academic commentary, journalism, OSINT — filterable by depth and kind.",
    href: "/reader/reading-list",
    group: "reference",
  },
  {
    number: "XII",
    title: "Verify",
    description: "Every claim on the site in one table, with confidence band, source, and link.",
    href: "/reader/verify",
    group: "reference",
  },
];

export type CaseCategory =
  | "Crimea"
  | "MH17"
  | "Genocide"
  | "Children"
  | "Strikes"
  | "Naval"
  | "Gas"
  | "CBR";

export interface Milestone {
  date: string;
  event: string;
  highlight?: boolean;
}

export interface LegalCase {
  fol: number;
  name: string;
  italic: string;
  forum: string;
  forumLabel: string;
  docket: string;
  filed: string;
  year: string;
  status: string;
  statusLabel: string;
  amount: number | null;
  amountLbl: string;
  gilt?: boolean;
  note: string;
  summaryUrl?: string;
  milestones: Milestone[];
}

export interface ForumCity {
  id: string;
  name: string;
  coord: [number, number];
  hub?: boolean;
  major?: boolean;
  cases?: number[];
  sub: string;
  kind: string;
  forumGroups?: Record<string, { cases: number[]; kind: string }>;
}

export interface HarmSite {
  id: string;
  name: string;
  coord: [number, number];
  related: number[];
}

export interface Resource {
  label: string;
  pub: string;
  url: string;
  kind: string;
  icon: string;
}

export const categoryColors: Record<CaseCategory, string> = {
  Crimea: "#2f6cd6",
  MH17: "#d6452f",
  Genocide: "#7a4ed6",
  Children: "#d4a045",
  Strikes: "#e07c2f",
  Naval: "#2fa898",
  Gas: "#5e9c3d",
  CBR: "#b8893a",
};

export const THEMES: Record<string, { cases: number[] }> = {
  all: { cases: Array.from({ length: 41 }, (_, i) => i + 1) },
  crimea: { cases: [4, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38] },
  mh17: { cases: [5, 17, 33, 34, 3] },
  genocide: { cases: [1, 2] },
  children: { cases: [9, 10, 11] },
  strikes: { cases: [12, 13, 14, 15] },
  naval: { cases: [6, 16] },
  gas: { cases: [18, 19, 20] },
  cbr: { cases: [41] },
};

export const THEME_FRAMES: Record<string, { head: string; line: string }> = {
  all: {
    head: "A map of two <em>geographies</em>",
    line: "On the right, where the war was fought. On the left, where the world's courts have been asked to account for it. Every case is a journey between the two.",
  },
  crimea: {
    head: "The <em>Crimea</em> wave",
    line: "Eleven investor-state arbitrations under the 1998 Russia–Ukraine BIT, all over the same 2014 fact. Eight of the awards now sit at the Hoge Raad. France, Helsinki, London, Vienna are seizing assets.",
  },
  mh17: {
    head: "<em>MH17:</em> from a field to five courts",
    line: "A Buk missile fired from near Pervomaiskyi in July 2014. The legal answer follows it from Hrabove → Schiphol → Strasbourg → Montreal → The Hague. Five forums, one downed aircraft.",
  },
  genocide: {
    head: "<em>Genocide,</em> in reverse",
    line: "Ukraine asks the World Court to declare that its invocation of the Genocide Convention does not justify a war waged in its name. Thirty-two states intervene — the largest in ICJ history.",
  },
  children: {
    head: "The deportation of <em>children</em>",
    line: "Two ICC arrest warrants for unlawful transfer — Putin and Lvova-Belova. The first ICC warrant ever issued against a sitting permanent-five head of state.",
  },
  strikes: {
    head: "The <em>strike</em> campaign",
    line: "Four further ICC warrants — Kobylash, Sokolov, Shoigu, Gerasimov — for the missile campaign against Ukrainian electricity infrastructure between October 2022 and March 2023.",
  },
  naval: {
    head: "Three vessels at <em>Kerch</em>",
    line: "Berdyansk, Nikopol, Yani Kapu — and twenty-four servicemen, seized in November 2018. Contested first at ITLOS, then at the PCA Annex VII tribunal, then at the ECtHR.",
  },
  gas: {
    head: "The <em>gas</em> arbitrations",
    line: "Three commercial arbitrations between Naftogaz and Gazprom — Stockholm twice on the 2009 contracts, then Zurich after the 2022 force-majeure declaration on Sokhranivka. $1.37 billion confirmed in Bern, March 2026.",
  },
  cbr: {
    head: "€210 billion at <em>Euroclear</em>",
    line: "The Russian Central Bank's reserves, immobilised at Euroclear in Brussels since February 2022. As of December 2025, frozen indefinitely. The reparations-loan structure is still under negotiation.",
  },
};

export const FORUMS: ForumCity[] = [
  {
    id: "hague", name: "The Hague", coord: [4.31, 52.08], hub: true, major: true,
    sub: "ICJ · ICC · PCA · Hoge Raad · Schiphol", kind: "ICJ",
    forumGroups: {
      ICJ: { cases: [1, 2, 3], kind: "ICJ" },
      ICC: { cases: [9, 10, 11, 12, 13, 14, 15], kind: "ICC" },
      PCA: { cases: [21, 22, 23, 27, 28, 29], kind: "PCA" },
      "Hoge Raad": { cases: [35, 36, 37, 38], kind: "HR" },
      Schiphol: { cases: [33, 34], kind: "Schiphol" },
    },
  },
  { id: "strasbourg", name: "Strasbourg", coord: [7.75, 48.58], cases: [4, 5, 6, 7, 8], major: true, sub: "ECtHR", kind: "ECtHR" },
  { id: "paris", name: "Paris", coord: [2.35, 48.85], cases: [24, 30], major: true, sub: "PCA seat · Cour de cassation", kind: "CdC" },
  { id: "stockholm", name: "Stockholm", coord: [18.06, 59.33], cases: [18, 19], major: true, sub: "SCC Arbitration", kind: "SCC" },
  { id: "london", name: "London", coord: [-0.13, 51.51], cases: [29], sub: "UK High Court", kind: "UK" },
  { id: "helsinki", name: "Helsinki", coord: [24.94, 60.17], cases: [39], sub: "Helsinki District Court · enforcement", kind: "FI" },
  { id: "vilnius", name: "Vilnius", coord: [25.28, 54.69], cases: [40], sub: "LT universal jurisdiction", kind: "LT" },
  { id: "geneva", name: "Geneva", coord: [6.14, 46.20], cases: [25, 26], sub: "PCA seat · Crimea petrol", kind: "PCA" },
  { id: "zurich", name: "Zürich", coord: [8.54, 47.37], cases: [20], sub: "ICC arb seat", kind: "ICC arb" },
  { id: "frankfurt", name: "Frankfurt", coord: [8.68, 50.11], cases: [], sub: "OLG Frankfurt", kind: "DE" },
  { id: "hamburg", name: "Hamburg", coord: [9.99, 53.55], cases: [16], sub: "ITLOS", kind: "ITLOS" },
  { id: "vienna", name: "Vienna", coord: [16.37, 48.21], cases: [], sub: "enforcement seat", kind: "AT" },
  { id: "brussels", name: "Brussels", coord: [4.35, 50.85], cases: [41], sub: "EU Council · Euroclear", kind: "EU" },
];

export const HARMS: HarmSite[] = [
  { id: "crimea", name: "Crimea", coord: [34.0, 45.0], related: [4, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { id: "donbas", name: "Donbas", coord: [37.8, 48.0], related: [5, 7] },
  { id: "mariupol", name: "Mariupol", coord: [37.55, 47.10], related: [5, 9] },
  { id: "kerch", name: "Kerch Strait", coord: [36.50, 45.30], related: [6, 16] },
  { id: "mh17", name: "MH17 (Hrabove)", coord: [38.65, 48.13], related: [5, 17, 33, 34] },
  { id: "bucha", name: "Bucha", coord: [30.22, 50.55], related: [9, 10, 11] },
  { id: "kakhovka", name: "Kakhovka HPP", coord: [33.37, 46.78], related: [32] },
  { id: "zaporizhzhia", name: "Zaporizhzhia NPP", coord: [34.59, 47.51], related: [31] },
];

export const cases: LegalCase[] = [
  { fol: 1, name: "Allegations of Genocide", italic: "Ukraine v Russia · 32 intervening states", forum: "ICJ", forumLabel: "ICJ", docket: "GL 182", filed: "2022-02-26", year: "2022", status: "pending", statusLabel: "pending merits", amount: null, amountLbl: "", note: "32 states intervene — the largest in ICJ history. Preliminary objections: jurisdiction narrowed to negative genocide declaration only.", summaryUrl: "/reader/case/icj-genocide", milestones: [{ date: "2022-03-16", event: "Provisional measures (13–2): suspend military operations", highlight: true }, { date: "2024-02-02", event: "Preliminary objections — narrow jurisdiction" }, { date: "2027-12-07", event: "Rejoinder due" }] },
  { fol: 2, name: "Ukraine v Russia (CERD + ICSFT)", italic: "Terrorism Financing & Racial Discrimination Conventions", forum: "ICJ", forumLabel: "ICJ", docket: "GL 166", filed: "2017-01-16", year: "2017", status: "decided", statusLabel: "merits 2024", amount: null, amountLbl: "", note: "First ICJ merits ruling on the war. Russia violated ICSFT Art. 9(1) and CERD Arts. 2(1)(a) & 5(e)(v). No compensation awarded.", summaryUrl: "/reader/case/icj-cerd-icsft", milestones: [{ date: "2017-04-19", event: "Provisional measures (CERD)" }, { date: "2024-01-31", event: "Merits judgment", highlight: true }] },
  { fol: 3, name: "Russia v Australia & Netherlands", italic: "Article 84 appeal of the ICAO Council MH17 decision", forum: "ICJ", forumLabel: "ICJ", docket: "GL 201", filed: "2025-09-18", year: "2025", status: "pending", statusLabel: "preliminary phase", amount: null, amountLbl: "", note: "First Article 84 case to be litigated to its end.", milestones: [{ date: "2025-09-18", event: "Application filed", highlight: true }] },
  { fol: 4, name: "Ukraine v Russia (re Crimea) [GC]", italic: "Inter-state — occupation of Crimea since Feb 2014", forum: "ECtHR", forumLabel: "ECtHR", docket: "20958/14, 38334/18", filed: "2014-03-13", year: "2014", status: "decided", statusLabel: "violations found 2024", amount: null, amountLbl: "", note: "Articles 2, 3, 5, 6, 8–11, 14, 18, P1-1, P1-2, P4-2 all violated.", milestones: [{ date: "2021-01-14", event: "Admissibility — jurisdiction confirmed" }, { date: "2024-06-25", event: "Merits judgment — unanimous", highlight: true }] },
  { fol: 5, name: "Ukraine and the Netherlands v Russia [GC]", italic: "Eastern Ukraine, MH17, and the full-scale invasion", forum: "ECtHR", forumLabel: "ECtHR", docket: "8019/16 et al.", filed: "2014-06-13", year: "2014", status: "decided", statusLabel: "satisfaction pending", amount: null, amountLbl: "", note: "The largest human-rights case in European history.", milestones: [{ date: "2023-01-25", event: "Admissibility" }, { date: "2025-07-09", event: "Merits — Russia liable for MH17", highlight: true }] },
  { fol: 6, name: "Ukraine v Russia (VIII)", italic: "The Kerch Strait incident (Nov 2018)", forum: "ECtHR", forumLabel: "ECtHR", docket: "55855/18", filed: "2018-11-29", year: "2018", status: "pending", statusLabel: "pending", amount: null, amountLbl: "", note: "", milestones: [{ date: "2018-11-29", event: "Application filed", highlight: true }] },
  { fol: 7, name: "Ukraine v Russia (IX)", italic: "Targeted killings abroad — transnational repression", forum: "ECtHR", forumLabel: "ECtHR", docket: "10691/21", filed: "2021-02-19", year: "2021", status: "pending", statusLabel: "pending", amount: null, amountLbl: "", note: "", milestones: [] },
  { fol: 8, name: "Russia v Ukraine", italic: "Counter-application, struck out after CoE expulsion", forum: "ECtHR", forumLabel: "ECtHR", docket: "36958/21", filed: "2021-07-22", year: "2021", status: "struck", statusLabel: "struck out 2023", amount: null, amountLbl: "", note: "Russia ceased to be a Contracting Party.", milestones: [{ date: "2022-09-16", event: "Russia expelled from CoE" }, { date: "2023-07-18", event: "Struck out", highlight: true }] },
  { fol: 9, name: "Situation in Ukraine", italic: "ICC investigation referred by 43 states parties", forum: "ICC", forumLabel: "ICC", docket: "Sit. UA", filed: "2022-03-02", year: "2022", status: "pending", statusLabel: "investigation active", amount: null, amountLbl: "", note: "Six arrest warrants flow from this investigation.", milestones: [{ date: "2022-03-02", event: "43 states parties refer situation", highlight: true }] },
  { fol: 10, name: "Prosecutor v Putin", italic: "Arrest warrant — President of the Russian Federation", forum: "ICC", forumLabel: "ICC", docket: "PTC II", filed: "2023-03-17", year: "2023", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "First ICC warrant against a sitting P5 head of state.", milestones: [{ date: "2023-03-17", event: "Warrant issued", highlight: true }] },
  { fol: 11, name: "Prosecutor v Lvova-Belova", italic: "Russian Children's Commissioner", forum: "ICC", forumLabel: "ICC", docket: "PTC II", filed: "2023-03-17", year: "2023", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "Same charges as Putin: deportation and transfer of Ukrainian children.", milestones: [{ date: "2023-03-17", event: "Warrant issued", highlight: true }] },
  { fol: 12, name: "Prosecutor v Kobylash", italic: "Russian Long-Range Aviation commander", forum: "ICC", forumLabel: "ICC", docket: "PTC", filed: "2024-03-05", year: "2024", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-03-05", event: "Warrant issued", highlight: true }] },
  { fol: 13, name: "Prosecutor v Sokolov", italic: "Black Sea Fleet commander", forum: "ICC", forumLabel: "ICC", docket: "PTC", filed: "2024-03-05", year: "2024", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-03-05", event: "Warrant issued", highlight: true }] },
  { fol: 14, name: "Prosecutor v Shoigu", italic: "Then-Minister of Defence", forum: "ICC", forumLabel: "ICC", docket: "PTC", filed: "2024-06-24", year: "2024", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-06-24", event: "Warrant issued", highlight: true }] },
  { fol: 15, name: "Prosecutor v Gerasimov", italic: "Chief of the General Staff", forum: "ICC", forumLabel: "ICC", docket: "PTC", filed: "2024-06-24", year: "2024", status: "pending", statusLabel: "warrant outstanding", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-06-24", event: "Warrant issued", highlight: true }] },
  { fol: 16, name: "Detention of Ukrainian Naval Vessels", italic: "ITLOS provisional measures + Annex VII (PCA)", forum: "ITLOS", forumLabel: "ITLOS", docket: "ITLOS 26", filed: "2019-04-16", year: "2019", status: "pending", statusLabel: "merits pending", amount: null, amountLbl: "", note: "Russia's 'military activities' defence rejected.", milestones: [{ date: "2019-05-25", event: "Provisional measures: Russia must release" }, { date: "2019-09", event: "Vessels and crew released", highlight: true }, { date: "2022-06-27", event: "Annex VII Award on Preliminary Objections" }] },
  { fol: 17, name: "Australia & Netherlands v Russia (MH17)", italic: "ICAO Council, Article 84", forum: "ICAO", forumLabel: "ICAO", docket: "Art. 84", filed: "2022-03-14", year: "2022", status: "decided", statusLabel: "decided · on appeal", amount: null, amountLbl: "", note: "First Article 84 merits ruling in 80 years of ICAO history.", milestones: [{ date: "2025-05-12", event: "Council vote — Russia responsible" }, { date: "2025-06-30", event: "Formal decision", highlight: true }, { date: "2025-09-18", event: "Russia appeals to ICJ" }] },
  { fol: 18, name: "Naftogaz v Gazprom — Supply", italic: "SCC Stockholm — gas supply contract", forum: "SCC", forumLabel: "SCC", docket: "V 2014-078", filed: "2014-06-01", year: "2014", status: "decided", statusLabel: "settled 2019", amount: -2020000000, amountLbl: "−$2.02b", note: "Netted against the transit award.", milestones: [{ date: "2017-12-22", event: "Final award", highlight: true }] },
  { fol: 19, name: "Naftogaz v Gazprom — Transit", italic: "SCC Stockholm — gas transit contract", forum: "SCC", forumLabel: "SCC", docket: "V 2014-129", filed: "2014-10-01", year: "2014", status: "decided", statusLabel: "settled 2019", amount: 4630000000, amountLbl: "$4.63b", note: "Net $2.56b after offset; ~$2.1b paid before settlement.", milestones: [{ date: "2018-02-28", event: "Final award", highlight: true }, { date: "2019-12-20", event: "Berlin trilateral settlement" }] },
  { fol: 20, name: "Naftogaz v Gazprom (III)", italic: "ICC arbitration — Sokhranivka force-majeure transit", forum: "ICC arb", forumLabel: "ICC arb", docket: "27245/GL", filed: "2022-09-09", year: "2022", status: "decided", statusLabel: "final & confirmed", amount: 1370000000, amountLbl: "$1.37b", note: "First major arbitral win triggered by the full-scale invasion.", milestones: [{ date: "2025-06-20", event: "Final award", highlight: true }, { date: "2026-03", event: "Swiss Federal Tribunal confirms" }] },
  { fol: 21, name: "Naftogaz et al. v Russia", italic: "PCA — Crimean oil & gas expropriation", forum: "PCA", forumLabel: "PCA", docket: "2017-16", filed: "2016-10-17", year: "2016", status: "enforcing", statusLabel: "enforcing in 5 jurisdictions", amount: 5000000000, amountLbl: "$5.00b", gilt: true, note: "Paris, London, Helsinki, Vienna, US — five-front enforcement.", milestones: [{ date: "2019-02-22", event: "Partial award — jurisdiction & merits" }, { date: "2023-04-12", event: "Final award", highlight: true }, { date: "2024-12-06", event: "Hoge Raad confirms" }, { date: "2025-04-01", event: "Paris exequatur" }] },
  { fol: 22, name: "Aeroport Belbek + Kolomoisky v Russia", italic: "PCA — Sevastopol airport", forum: "PCA", forumLabel: "PCA", docket: "2015-07", filed: "2015-01-13", year: "2015", status: "decided", statusLabel: "liability final, quantum pending", amount: null, amountLbl: "", note: "", milestones: [{ date: "2017-02-24", event: "Award on jurisdiction" }, { date: "2024-12-06", event: "Hoge Raad confirms", highlight: true }] },
  { fol: 23, name: "PrivatBank + Finilon v Russia", italic: "PCA — Crimean banking operations", forum: "PCA", forumLabel: "PCA", docket: "2015-21", filed: "2015-04-13", year: "2015", status: "decided", statusLabel: "liability final, quantum pending", amount: 1000000000, amountLbl: "$1.0b cl.", note: "Quantum claimed.", milestones: [{ date: "2019-02-04", event: "Liability award" }, { date: "2024-12-06", event: "Hoge Raad confirms", highlight: true }] },
  { fol: 24, name: "Oschadbank v Russia", italic: "PCA · Paris-seated — Crimean banking branch", forum: "PCA", forumLabel: "PCA", docket: "2016-14", filed: "2016-01-20", year: "2016", status: "enforcing", statusLabel: "enforcing in France", amount: 1100000000, amountLbl: "$1.10b", note: "~$99m of Russian assets seized in France.", milestones: [{ date: "2018-11-26", event: "Award", highlight: true }, { date: "2022-12-07", event: "Cour de cassation quashes earlier annulment" }, { date: "2025-07-01", event: "Paris CoA confirms award" }] },
  { fol: 25, name: "Ukrnafta v Russia", italic: "PCA · Geneva — 16 petrol stations in Crimea", forum: "PCA", forumLabel: "PCA", docket: "2015-34", filed: "2015-06-15", year: "2015", status: "decided", statusLabel: "final and binding", amount: 44455012, amountLbl: "$44.5m", note: "Swiss FT — first to confirm BIT covers Crimea-located investments.", milestones: [{ date: "2018-10-16", event: "Swiss FT confirms jurisdiction", highlight: true }, { date: "2019-04-12", event: "Final award" }] },
  { fol: 26, name: "Stabil et al. v Russia", italic: "PCA · Geneva — 31 petrol stations", forum: "PCA", forumLabel: "PCA", docket: "2015-35", filed: "2015-06-15", year: "2015", status: "decided", statusLabel: "final and binding", amount: 34600000, amountLbl: "$34.6m", note: "", milestones: [{ date: "2019-04-12", event: "Final award", highlight: true }] },
  { fol: 27, name: "Everest Estate et al. v Russia", italic: "PCA — Crimean real estate", forum: "PCA", forumLabel: "PCA", docket: "2015-36", filed: "2015-06-19", year: "2015", status: "pending", statusLabel: "set-aside remanded", amount: 159000000, amountLbl: "$159m", note: "Only Crimea case the Hoge Raad has remanded.", milestones: [{ date: "2018-05-02", event: "Award on merits" }, { date: "2024-12-06", event: "Hoge Raad remands to Amsterdam", highlight: true }] },
  { fol: 28, name: "Lugzor et al. v Russia", italic: "PCA — Crimean real estate (5 claimants)", forum: "PCA", forumLabel: "PCA", docket: "2015-29", filed: "2015-05-26", year: "2015", status: "decided", statusLabel: "award rendered", amount: null, amountLbl: "undisc.", note: "", milestones: [{ date: "2022-10-04", event: "Award", highlight: true }] },
  { fol: 29, name: "DTEK Krymenergo v Russia", italic: "PCA — Crimean electricity grid", forum: "PCA", forumLabel: "PCA", docket: "2018-41", filed: "2018-01-01", year: "2018", status: "pending", statusLabel: "UK enforcement stayed", amount: 207800000, amountLbl: "$208m", note: "", milestones: [{ date: "2023-11-01", event: "Final award" }, { date: "2025-05-02", event: "UK High Court stays enforcement", highlight: true }] },
  { fol: 30, name: "NEK Ukrenergo v Russia", italic: "PCA · Paris — Crimean transmission grid", forum: "PCA", forumLabel: "PCA", docket: "Paris-seated", filed: "2020-11-01", year: "2020", status: "pending", statusLabel: "merits phase", amount: 580000000, amountLbl: "€527m cl.", note: "", milestones: [{ date: "2024-08-05", event: "Award on jurisdiction confirmed", highlight: true }] },
  { fol: 31, name: "Energoatom v Russia (II)", italic: "Notice of dispute — Zaporizhzhia NPP", forum: "PCA", forumLabel: "PCA", docket: "TBD", filed: "2023-03-01", year: "2023", status: "pending", statusLabel: "pre-arbitration", amount: 3000000000, amountLbl: "$3b cl.", note: "", milestones: [{ date: "2023-03", event: "Notice of dispute", highlight: true }] },
  { fol: 32, name: "Ukrhydroenergo v Russia", italic: "Notice of dispute — Kakhovka HPP", forum: "PCA", forumLabel: "PCA", docket: "TBD", filed: "2024-06-06", year: "2024", status: "pending", statusLabel: "pre-arbitration paused", amount: 2500000000, amountLbl: "$2.5b cl.", note: "", milestones: [{ date: "2024-06-06", event: "Notice of dispute", highlight: true }, { date: "2024-10", event: "Tender cancelled" }] },
  { fol: 33, name: "PPS v Girkin, Dubinskiy, Pulatov, Kharchenko", italic: "NL · The Hague — MH17 criminal trial", forum: "Domestic", forumLabel: "NL", docket: "ECLI:NL:RBDHA", filed: "2020-03-09", year: "2020", status: "decided", statusLabel: "verdicts irrevocable", amount: null, amountLbl: "", note: "~€16m in damages joined to the criminal proceedings.", milestones: [{ date: "2022-11-17", event: "Verdict — 3 convicted in absentia (life)", highlight: true }, { date: "2022-12-01", event: "Prosecution declines to appeal Pulatov" }] },
  { fol: 34, name: "JIT MH17 follow-on", italic: "NL · Joint Investigation Team", forum: "Domestic", forumLabel: "NL", docket: "JIT MH17", filed: "2014-08-01", year: "2014", status: "pending", statusLabel: "suspended", amount: null, amountLbl: "", note: "Identified Putin's 'active role' but no immunity waiver.", milestones: [{ date: "2023-02-08", event: "JIT suspends — leads exhausted", highlight: true }] },
  { fol: 35, name: "Russia v Naftogaz et al.", italic: "NL · Hoge Raad — set-aside cassation", forum: "Domestic", forumLabel: "NL · HR", docket: "HR:2024:1810", filed: "2023-01-01", year: "2023", status: "decided", statusLabel: "award stands", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-12-06", event: "Hoge Raad dismisses cassation", highlight: true }] },
  { fol: 36, name: "Russia v Belbek/Kolomoisky", italic: "NL · Hoge Raad — set-aside cassation", forum: "Domestic", forumLabel: "NL · HR", docket: "HR 2024", filed: "2022-01-01", year: "2022", status: "decided", statusLabel: "award stands", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-12-06", event: "Hoge Raad dismisses", highlight: true }] },
  { fol: 37, name: "Russia v PrivatBank/Finilon", italic: "NL · Hoge Raad — set-aside cassation", forum: "Domestic", forumLabel: "NL · HR", docket: "HR 2024", filed: "2022-01-01", year: "2022", status: "decided", statusLabel: "award stands", amount: null, amountLbl: "", note: "", milestones: [{ date: "2024-12-06", event: "Hoge Raad dismisses", highlight: true }] },
  { fol: 38, name: "Russia v Everest Estate", italic: "NL · Hoge Raad — remanded to Amsterdam CoA", forum: "Domestic", forumLabel: "NL · HR", docket: "HR 2024", filed: "2022-01-01", year: "2022", status: "pending", statusLabel: "remanded", amount: null, amountLbl: "", note: "Only Crimea case the Hoge Raad partly opened up.", milestones: [{ date: "2024-12-06", event: "Hoge Raad remands", highlight: true }] },
  { fol: 39, name: "Finland v Yan Petrovsky", italic: "FI · Helsinki — universal jurisdiction", forum: "Domestic", forumLabel: "FI", docket: "Helsinki", filed: "2024-12-01", year: "2024", status: "pending", statusLabel: "appeal pending", amount: null, amountLbl: "", note: "First UJ conviction worldwide of a mercenary-group member for Ukraine war crimes.", milestones: [{ date: "2025-03-14", event: "Conviction — life imprisonment", highlight: true }] },
  { fol: 40, name: "Lithuania v Gadzhimagomedov", italic: "LT · Vilnius — universal jurisdiction", forum: "Domestic", forumLabel: "LT", docket: "Vilnius", filed: "2025-10-30", year: "2025", status: "pending", statusLabel: "pre-trial detention", amount: null, amountLbl: "", note: "First Ukrainian extradition to a third state for prosecution.", milestones: [{ date: "2025-10-28", event: "Suspect transferred from Ukrainian custody", highlight: true }] },
  { fol: 41, name: "EU/Belgium · Russian Central Bank assets", italic: "€210bn immobilised at Euroclear", forum: "Domestic", forumLabel: "EU·BE", docket: "EU Council", filed: "2022-02-28", year: "2022", status: "pending", statusLabel: "frozen indefinitely", amount: 210000000000, amountLbl: "€210b", gilt: true, note: "The single largest pool of Russian state money under European control.", milestones: [{ date: "2024-05", event: "Windfall profits regulation 2024/1469" }, { date: "2025-12-12", event: "EU agrees indefinite freeze", highlight: true }] },
];

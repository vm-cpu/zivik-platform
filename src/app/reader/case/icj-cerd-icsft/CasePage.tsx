"use client";

import { useState } from "react";
import Link from "next/link";

/* ── All data below is from the source Word document ── */

const TIMELINE = [
  { date: "16 Jan 2017", event: "Application filed by Ukraine", type: "filing" as const },
  { date: "19 Apr 2017", event: "Provisional measures order (CERD measures granted)", type: "order" as const },
  { date: "8 Nov 2019", event: "Judgment on preliminary objections — jurisdiction confirmed", type: "ruling" as const },
  { date: "31 Jan 2024", event: "Merits judgment delivered", type: "judgment" as const },
];

type Verdict = "upheld" | "rejected" | "partial";

interface Finding {
  id: string;
  convention: "ICSFT" | "CERD" | "Order";
  article: string;
  claim: string;
  verdict: Verdict;
  ukraineClaim?: string;
  russiaPosition?: string;
  courtPosition: string;
  keyQuote?: string;
  quotePara?: string;
  excerpts?: { para: string; text: string }[];
}

const FINDINGS: Finding[] = [
  {
    id: "icsft-18",
    convention: "ICSFT",
    article: "Article 18",
    claim: "Failure to cooperate in prevention of terrorism financing",
    verdict: "rejected",
    ukraineClaim: "The Russian Federation has violated Article 18 by failing to take the practicable measures of: (i) preventing Russian state officials and agents from financing terrorism in Ukraine; (ii) discouraging public and private actors from financing terrorism in Ukraine; (iii) policing its border with Ukraine to stop the financing of terrorism; and (iv) monitoring and suspending banking activity and other fundraising activities undertaken on its territory to finance terrorism in Ukraine.",
    courtPosition:
      "Unlike the Genocide Convention, Article 18 refers to the obligation to \"cooperate in the prevention\" of terrorism financing, not to prevent it. Ukraine's arguments regarding state policy, border policing (limited to weapons supply, outside ICSFT scope), and failure to designate DPR/LPR as terrorist entities were all rejected.",
    excerpts: [
      { para: "Court", text: "Ukraine requests that the Court find that the Russian Federation violated its obligations under the ICSFT not because of actions taken by State officials in their individual capacity, but because of the Russian Federation's alleged policy of financing armed groups in eastern Ukraine. This request does not fall within the scope of Article 18 of the ICSFT and therefore cannot be upheld." },
      { para: "Court", text: "The Court observes that Ukraine's evidence concerning the alleged flow of support for armed groups operating in Ukraine across the border is limited to allegations relating to the supply of weapons and ammunition. The Court recalls its finding that the supply of weapons and ammunition as a means for committing predicate acts falls outside the material scope of the ICSFT." },
    ],
  },
  {
    id: "icsft-8",
    convention: "ICSFT",
    article: "Article 8",
    claim: "Failure to identify, detect, freeze or seize funds used for terrorism financing",
    verdict: "rejected",
    ukraineClaim: "The Russian Federation is responsible for violations of Article 8 of the ICSFT by failing to identify and detect funds used or allocated for the purposes of financing terrorism in Ukraine, and by failing to freeze or seize funds used or allocated for the purpose of financing terrorism in Ukraine.",
    courtPosition:
      "The obligation to freeze funds only arises when the State has reasonable grounds to suspect funds are for terrorism financing. Ukraine's requests for legal assistance contained only vague and highly generalized descriptions and did not demonstrate the funders' \"knowledge\" that funds would be used for predicate acts.",
    excerpts: [
      { para: "§ 97", text: "After examining the allegations and evidence contained in these documents (requests for legal assistance and notes verbales made by Ukraine), the Court concludes that they do not contain sufficiently specific and detailed evidence to give the Russian Federation reasonable grounds to suspect that the accounts, bank cards and other financial instruments listed therein were used or allocated for the purpose of committing the offences under Article 2 of the ICSFT. In particular, the documents provide only vague and highly generalized descriptions of the acts that were allegedly committed by members of the DPR and LPR and were alleged to qualify as predicate acts under Article 2, paragraph 1 (a) or (b), of the ICSFT." },
      { para: "§ 98", text: "In light of the foregoing, the Court concludes that it has not been established that the Russian Federation has violated its obligations under Article 8, paragraph 1, of the ICSFT. Therefore, Ukraine's claim under Article 8 cannot be upheld." },
    ],
  },
  {
    id: "icsft-9",
    convention: "ICSFT",
    article: "Article 9(1)",
    claim: "Failure to investigate persons alleged to have committed terrorism financing",
    verdict: "upheld",
    ukraineClaim: "The Russian Federation has violated Articles 9 and 10 of the ICSFT by failing to investigate the facts concerning persons who have committed or are alleged to have committed terrorism financing in Ukraine, and to extradite or prosecute alleged offenders.",
    courtPosition:
      "For the obligation to investigate to arise, Article 9(1) requires only that a State receive information that a person \"alleged\" to have committed the offence may be present in its territory. Almost one year after receiving the Ukrainian allegations, the Russian Federation appeared to have failed even to identify several of the alleged offenders.",
    keyQuote:
      "The Court concludes that the Russian Federation has violated its obligations under Article 9, paragraph 1, of the ICSFT.",
    quotePara: "§ 111",
    excerpts: [
      { para: "§ 111", text: "The Ministry of Foreign Affairs of the Russian Federation sent Ukraine a Note Verbale that included further details on the actions taken by the Russian competent authorities. This included the results of investigations into two of the alleged offenders. In both cases, the Russian Federation concluded that the individuals were not involved in providing financial support to the DPR and LPR. However, no clear information was provided by the Respondent concerning the other alleged offenders described in the Ukrainian communications as being present in Russian territory." },
      { para: "Court", text: "It is therefore notable that, almost one year after receiving the Ukrainian allegations, the Russian Federation appeared to have failed even to identify several of the alleged offenders." },
    ],
  },
  {
    id: "icsft-10",
    convention: "ICSFT",
    article: "Article 10",
    claim: "Failure to extradite or prosecute alleged offenders",
    verdict: "rejected",
    courtPosition:
      "The decision to submit a case for prosecution requires, at a minimum, reasonable grounds to suspect that an offence has been committed. The information provided by Ukraine did not give rise to such reasonable grounds.",
    excerpts: [
      { para: "§ 115", text: "Article 10, paragraph 1, requires States parties to the ICSFT to either prosecute or extradite alleged offenders of terrorism financing offences under Article 2. The Court observes that the Applicant has not brought to its attention any requests for extradition concerning alleged offenders and that the Applicant's argument accordingly appears to be limited to an alleged violation by the Russian Federation of its obligation to prosecute." },
      { para: "§ 118", text: "Just as with the obligation to prosecute or extradite in the Convention against Torture, the obligations found in Article 10, paragraph 1, of the ICSFT are ordinarily implemented after the relevant State party has performed other obligations under the ICSFT, such as the obligation under Article 9 to conduct an investigation into the facts of alleged terrorism financing." },
      { para: "§ 119", text: "The Court notes that the decision to submit a case to the competent authorities for purposes of prosecution is a serious one that requires, at a minimum, reasonable grounds to suspect that an offence has been committed. The Court recalls its finding that the information provided by Ukraine to the Russian Federation did not give rise to reasonable grounds to suspect that terrorism financing offences within the meaning of Article 2 of the ICSFT had been committed." },
      { para: "§ 120", text: "Based on the foregoing, the Court concludes that it has not been established that the Russian Federation has violated its obligations under Article 10, paragraph 1, of the ICSFT. Therefore, Ukraine's claim under Article 10 of the ICSFT cannot be upheld." },
    ],
  },
  {
    id: "icsft-12",
    convention: "ICSFT",
    article: "Article 12",
    claim: "Failure to provide mutual legal assistance in criminal investigations",
    verdict: "rejected",
    ukraineClaim: "The Russian Federation has violated Article 12 of the ICSFT by failing to provide Ukraine the greatest measure of assistance in connection with criminal investigations in respect of terrorism financing offenses.",
    courtPosition:
      "Of 12+ requests, only three concerned allegations within the ICSFT scope (the rest related to weapons supply). These three did not describe predicate acts in sufficient detail nor indicate that the alleged funders knew the funds would be used for such acts.",
    excerpts: [
      { para: "Court", text: "Ukraine relies upon at least 12 requests for legal assistance received by the Russian Federation. The Court limits its analysis to three requests — those of 11 November 2014, 3 December 2014 and 28 July 2015 — concerning allegations that citizens of the Russian Federation were involved in fundraising for the DPR or LPR. The remaining nine requests concerned allegations relating to the provision of weapons, ammunition and military equipment, which falls outside the scope of the ICSFT." },
      { para: "Court", text: "None of the three relevant requests described in any detail the commission of alleged predicate acts by the recipients of the provided funds. Nor did they indicate that the alleged funders knew the funds provided would be used for the commission of predicate acts." },
    ],
  },
  {
    id: "cerd-violence",
    convention: "CERD",
    article: "Arts. 2, 5(a), 6",
    claim: "Disappearances, murders, abductions and torture of Crimean Tatars and ethnic Ukrainians",
    verdict: "rejected",
    ukraineClaim: "Ukraine refers to 13 incidents of physical violence against named Crimean Tatars and ethnic Ukrainians as \"illustrations\" of a \"systematic pattern of violence and intimidation\". These incidents include the murder of Reshat Ametov, and the abduction and torture of Mykhailo Vdovchenko, Andrii Shchekun, Anatoly Kovalsky, Aleksandr Kostenko and Renat Paralamov. Ukraine contends that the acts targeted prominent activists, thereby depriving the communities of current or potential future leaders.",
    courtPosition:
      "Reports confirm that physical violence in Crimea was not only suffered by Crimean Tatars and ethnic Ukrainians, but also by persons of Russian and Central Asian origin. Even allowing a more liberal recourse to inferences, the Court is not convinced that these acts were based on ethnic origin.",
    excerpts: [
      { para: "§ 206", text: "Ukraine also asserts that the Russian Federation violated Article 6 of CERD by failing to investigate the disappearances and other acts of physical violence. In support of its allegations, Ukraine mainly relies on witness statements and reports by intergovernmental organizations, in particular on two reports by the OHCHR." },
      { para: "Court", text: "The Court acknowledges that Ukraine is not in a position to provide further evidence owing to its lack of access to Crimea. However, even when allowing a more liberal recourse to inferences of fact and circumstantial evidence for that reason, the Court is not convinced by the evidence placed before it that Crimean Tatars and ethnic Ukrainians were subjected to acts of physical violence based on their ethnic origin." },
    ],
  },
  {
    id: "cerd-lawenf",
    convention: "CERD",
    article: "Arts. 2, 4, 5(a), 6",
    claim: "Disproportionate law enforcement measures — searches, detentions, prosecutions",
    verdict: "partial",
    ukraineClaim: "The Russian Federation violated CERD by singling out and subjecting both the Crimean Tatar leadership and the wider Crimean Tatar population to manifestly disproportionate law enforcement measures based on its anti-extremism laws, in particular in the form of arbitrary searches, detentions and prosecutions. Since the referendum in March 2014, these practices have included conducting searches of Crimean Tatar mosques, schools and private homes. Ukraine points out that measures against \"religious\" extremism, including against members of Hizb-ut Tahrir or Tablighi Jamaat, were pretextual and disproportionately affected the predominantly Muslim Crimean Tatar community.",
    courtPosition:
      "The Court attributed considerable weight to UN reports that \"Crimean Tatars were disproportionately subjected to police and FSB raids of their homes, private businesses or meeting places, often followed by arrests.\" Disparate effect found, but measures attributed to political opposition against Russian control rather than ethnic origin.",
    keyQuote:
      "Crimean Tatars were disproportionately subjected to police and FSB raids of their homes, private businesses or meeting places, often followed by arrests.",
    quotePara: "§ 238 — OHCHR / UN Secretary-General reports, cited by the Court",
    excerpts: [
      { para: "§ 222", text: "According to Ukraine, the Russian Federation violated CERD, in particular Articles 2, paragraph 1, 4, 5 (a) and 6, by singling out and subjecting both the Crimean Tatar leadership and the wider Crimean Tatar population to manifestly disproportionate law enforcement measures based on its anti-extremism laws." },
      { para: "§ 230", text: "Ukraine argues that the Russian Federation has subjected the wider Crimean Tatar community to arbitrary searches and detentions in order to unsettle the entire community. According to Ukraine, since the referendum in March 2014, these practices have included conducting searches of Crimean Tatar mosques, schools and private homes." },
      { para: "§ 238", text: "In this regard, the Court attributes considerable weight to reports of several United Nations organs and monitoring bodies according to which the measures in question disproportionately affected Crimean Tatar persons." },
      { para: "§ 242", text: "With respect to Ukraine's claim that the Russian Federation violated Article 4 of CERD, the Court is not convinced that Ukraine has presented convincing evidence that statements have been made by State officials of the Russian Federation that were directed against Crimean Tatars based on their ethnic or national origin." },
      { para: "§ 245", text: "As far as persons belonging to the Crimean Tatar leadership are concerned, the Court considers that the context in which the measures were taken indicates that they were in response to the political opposition that these persons and institutions displayed against the exercise of territorial control by the Russian Federation in Crimea." },
    ],
  },
  {
    id: "cerd-mejlis",
    convention: "CERD",
    article: "Arts. 1(1), 2, 4, 5, 6",
    claim: "Ban on the Mejlis — dismantling the central political and cultural institution",
    verdict: "rejected",
    ukraineClaim: "Ukraine alleges that the Russian Federation violated CERD by imposing a ban on the Mejlis (the representative body of the Crimean Tatars) on 26 April 2016. In Ukraine's view, the ban forms part of a sustained campaign aimed at dismantling the Crimean Tatar community's central political and cultural institution and forms part of the Russian Federation's \"disinformation campaign\" to vilify Crimean Tatars, violating Article 4. Ukraine further alleges the courts brushed off applications by Crimean Tatar litigants seeking review of the ban, violating Article 6.",
    courtPosition:
      "The Mejlis was banned due to political activities carried out by some of its leaders in opposition to Russia, rather than on grounds of ethnic origin. The Qurultay has not been banned, nor is there sufficient evidence that it has been effectively prevented from fulfilling its representative role.",
    excerpts: [
      { para: "§ 267", text: "The ban entails the exclusion of the Mejlis from public life in Crimea. However, for the ban to amount to racial discrimination, Ukraine would also need to demonstrate that this exclusion was based on the ethnic origin of the Crimean Tatars as a group or of the members of the Mejlis. The Court is of the view that the Mejlis is neither the only, nor the primary institution representing the Crimean Tatar community. The Qurultay has not been banned, nor is there sufficient evidence that it has been effectively prevented from fulfilling its representative role." },
      { para: "§ 272", text: "The Court thus concludes that Ukraine has not provided convincing evidence that the ban of the Mejlis was based on the ethnic origin of its members, rather than its political positions and activities, and would therefore constitute an act of discrimination within the meaning of Article 1, paragraph 1, of CERD." },
    ],
  },
  {
    id: "cerd-citizenship",
    convention: "CERD",
    article: "Arts. 5(c), 5(d), 5(e)",
    claim: "Discriminatory citizenship regime forcing choice between Russian and Ukrainian citizenship",
    verdict: "rejected",
    ukraineClaim: "Ukraine claims that the Russian Federation violated its obligations under CERD through the introduction of its own nationality and immigration framework into Crimea, under the Federal Constitutional Law No. 6-FKZ of 21 March 2014. In Ukraine's view, discrimination stems from the fact that the Russian Federation has forced members of the Ukrainian and Crimean Tatar ethnic groups to choose between receiving Russian citizenship and swearing allegiance to the Russian Federation or retaining Ukrainian citizenship and accepting restrictions on their civil and political rights. Ukraine contends that Crimean Tatars and ethnic Ukrainians were disproportionately affected compared with ethnic Russians residing in Crimea.",
    courtPosition:
      "The legal consequences flow from the status of being either a Russian citizen or a foreigner. The respective status applies to all persons regardless of ethnic origin. While the measures may affect a significant number of Crimean Tatars or ethnic Ukrainians, this does not constitute racial discrimination under the Convention.",
    excerpts: [
      { para: "§ 276", text: "Ukraine claims that the Russian Federation violated its obligations under CERD, in particular Articles 5 (c), 5 (d) (i), 5 (d) (ii), 5 (d) (iii), 5 (e) (i) and 5 (e) (iv), through the introduction of its own nationality and immigration framework into Crimea." },
    ],
  },
  {
    id: "cerd-education",
    convention: "CERD",
    article: "Arts. 2(1)(a), 5(e)(v)",
    claim: "Suppression of Ukrainian-language education in Crimea after 2014",
    verdict: "upheld",
    ukraineClaim: "Ukraine asserts that the Russian Federation has used changes to the educational system in Crimea to promote Russian language and culture at the expense of Ukrainian and Crimean Tatar languages and cultures. Many Crimean parents have found that their requests for Ukrainian- or Crimean Tatar-language instruction have been ignored and other parents have felt unsafe even making such requests or under pressure to choose Russian-language education. Regarding Crimean Tatar education: one tenth-grade history textbook depicted Crimean Tatars as Nazi collaborators in World War II, rehabilitating the stereotype propounded by Stalin as an excuse to deport Crimean Tatars in 1944.",
    courtPosition:
      "Language is often an essential social bond among the members of an ethnic group. Russia exercises full control over the public school system in Crimea. It has not provided a convincing explanation for the sudden and radical changes in the use of Ukrainian as a language of instruction.",
    keyQuote:
      "The Court concludes that the Russian Federation has violated its obligations under Article 2, paragraph 1 (a), and Article 5 (e) (v) of CERD by the way in which it has implemented its educational system in Crimea after 2014 with regard to school education in the Ukrainian language.",
    quotePara: "§ 370",
    excerpts: [
      { para: "§ 338", text: "Ukraine asserts that the Russian Federation has used changes to the educational system in Crimea to promote Russian language and culture at the expense of Ukrainian and Crimean Tatar languages and cultures and has taken measures impeding the education of school children from the two communities." },
      { para: "§ 355", text: "Most of the measures complained of by Ukraine concern limitations to the availability of Ukrainian or Crimean Tatar as the language of instruction in primary schools. Language is often an essential social bond among the members of an ethnic group. Restrictive measures taken by a State party with respect to the use of language may therefore in certain situations manifest a \"distinction, exclusion, restriction or preference based on . . . descent, or national or ethnic origin\" within the meaning of Article 1, paragraph 1, of CERD." },
      { para: "Court — Ukrainian language", text: "The Russian Federation exercises full control over the public school system in Crimea. However, it has not provided a convincing explanation for the sudden and radical changes in the use of Ukrainian as a language of instruction, which produces a disparate adverse effect on the rights of ethnic Ukrainians." },
      { para: "Court — Crimean Tatar language", text: "The Court notes with concern that there has been one instance of a textbook which referred to the history of the Crimean Tatar community in a discriminatory way. However, the Court considers that Ukraine has not refuted the assertion of the Russian Federation that this was an isolated case which was remedied following an appeal by representatives of the Crimean Tatar community." },
      { para: "§ 365", text: "The Court is unable to conclude, based on the evidence submitted by the Parties, that the quality of the education in the Crimean Tatar language has significantly deteriorated since 2014." },
      { para: "§ 370", text: "In light of the above, the Court concludes that the Russian Federation has violated its obligations under Article 2, paragraph 1 (a), and Article 5 (e) (v) of CERD by the way in which it has implemented its educational system in Crimea after 2014 with regard to school education in the Ukrainian language." },
    ],
  },
  {
    id: "cerd-gatherings",
    convention: "CERD",
    article: "Arts. 2, 5(d)(ix), 5(e)(vi)",
    claim: "Suppression of culturally significant gatherings — Ukrainian Flag Day, Shevchenko birthday",
    verdict: "rejected",
    ukraineClaim: "Ukraine contends that the Russian Federation violated its obligations under CERD by suppressing gatherings that are of cultural importance to both the Crimean Tatar and the ethnic Ukrainian communities.",
    courtPosition: "The Court considers it to be proved that the Russian Federation imposed restrictive measures regarding the celebration of Ukrainian Flag Day and the birthday of Taras Shevchenko, and that these measures produced a disparate adverse effect on the rights of persons of ethnic Ukrainian origin. However, the Russian Federation has provided explanations for these restrictions that do not relate to a prohibited ground under Article 1(1).",
    excerpts: [
      { para: "§ 289", text: "Ukraine contends that the Russian Federation violated its obligations under CERD, in particular Articles 2, paragraph 1 (a), 5 (d) (ix) and 5 (e) (vi), by suppressing gatherings that are of cultural importance to both the Crimean Tatar and the ethnic Ukrainian communities." },
      { para: "§ 301", text: "The Court observes that the conformity of the relevant laws of the Russian Federation, notably the provisions on \"extremism\", with that State's human rights obligations has been called into question by international judicial and expert bodies owing to the risk of arbitrary interpretation and abuse." },
      { para: "§ 305", text: "However, the Court notes that the Russian Federation has provided explanations for these restrictions that do not relate to one of the prohibited grounds contained in Article 1, paragraph 1, of the Convention." },
    ],
  },
  {
    id: "cerd-media",
    convention: "CERD",
    article: "Arts. 2, 5(d)(viii), 5(e)(vi)",
    claim: "Restrictions on Crimean Tatar and Ukrainian media outlets",
    verdict: "rejected",
    ukraineClaim: "Ukraine claims that the Russian Federation violated its obligations under CERD by imposing restrictions on persons and institutions representing the media serving the Crimean Tatar and ethnic Ukrainian communities in Crimea. Ukraine argues that the number of media outlets serving these communities has significantly decreased since the introduction of the media laws and anti-extremism legislation in 2014.",
    courtPosition:
      "No convincing evidence that the purpose of the relevant domestic legislation is to differentiate between media outlets based on a prohibited ground. The Court cannot find that the measures were based on the ethnic origin of the persons affiliated with them.",
    excerpts: [
      { para: "§ 310", text: "Ukraine argues that, as a result of the discriminatory application of the Russian Federation's laws in Crimea, the number of media outlets serving the Crimean Tatar and ethnic Ukrainian communities has significantly decreased since the introduction of the media laws and anti-extremism legislation in Crimea in 2014." },
      { para: "§ 318", text: "The Court recalls that restrictions imposed on media organizations fall within the scope of CERD only in so far as these media organizations are \"collective bodies or associations, which represent individuals or groups of individuals\" and the measures imposed on them are based on national or ethnic origin by purpose or effect." },
    ],
  },
  {
    id: "cerd-culture",
    convention: "CERD",
    article: "Arts. 2, 5(e)(vi), 6",
    claim: "Assault on cultural heritage — destruction, demolition, failure to preserve sites",
    verdict: "rejected",
    ukraineClaim: "Ukraine submits that the Russian Federation violated its obligations under CERD by undertaking a \"general assault\" on the cultural heritage of Crimean Tatar and ethnic Ukrainian communities, particularly through the destruction, demolition, failure to preserve and closure of historically and culturally significant sites and institutions.",
    courtPosition:
      "Even if the preservation works on the Khan's Palace were carried out negligently, the Court is not convinced that such negligence would amount to discrimination based on ethnic origin. Other sites not sufficiently substantiated.",
    excerpts: [
      { para: "§ 324", text: "Ukraine submits that the Russian Federation violated its obligations under CERD, specifically Articles 2, paragraph 1, 5 (e) (vi) and 6, by undertaking a \"general assault\" on the cultural heritage of Crimean Tatar and ethnic Ukrainian communities." },
      { para: "§ 336", text: "With respect to Ukraine's allegations concerning the degradation of certain aspects of the cultural heritage of ethnic Ukrainians, the Court is of the view that Ukraine has not established that any differentiation of treatment of persons affiliated with cultural institutions in Crimea was based on their ethnic origin." },
    ],
  },
  {
    id: "order-mejlis",
    convention: "Order",
    article: "¶106(1)(a)",
    claim: "Russia maintained the ban on the Mejlis despite the 2017 provisional measures Order",
    verdict: "upheld",
    courtPosition:
      "The reference in the Order to Russia's obligations under CERD does not provide any scope for Russia to assess, for itself, whether the ban was justified. The wording refers to the source of the rights that the measure seeks to preserve and does not confer discretion.",
    keyQuote:
      "The Court therefore finds that the Russian Federation, by maintaining the ban on the Mejlis, has violated the Order indicating provisional measures. The Court notes that this finding is independent of the conclusion set out above that the ban on the Mejlis does not violate the Russian Federation's obligations under CERD.",
    quotePara: "§ 392",
  },
  {
    id: "order-education",
    convention: "Order",
    article: "¶106(1)(b)",
    claim: "Failure to ensure availability of education in Ukrainian language",
    verdict: "rejected",
    courtPosition:
      "The Order required only that education be accessible, not that a specific level of coverage be achieved. Instruction in Ukrainian was provided in one Ukrainian school and 13 Ukrainian classes in Russian schools attended by 318 children.",
    keyQuote:
      "The Court therefore concludes that the Russian Federation has not violated the Order in so far as it required the Respondent to ensure the availability of education in the Ukrainian language.",
    quotePara: "§ 395",
  },
  {
    id: "order-aggravation",
    convention: "Order",
    article: "¶106(2)",
    claim: "Failure to refrain from actions aggravating the dispute",
    verdict: "upheld",
    courtPosition:
      "Subsequent to the Order, Russia recognized the DPR and LPR as independent States and launched a \"special military operation\" against Ukraine. These actions severely undermined the basis for mutual trust and co-operation.",
    keyQuote:
      "The Court observes that, subsequent to the Order indicating provisional measures, the Russian Federation recognized the DPR and LPR as independent States and launched a 'special military operation' against Ukraine. In the view of the Court, these actions severely undermined the basis for mutual trust and co-operation and thus made the dispute more difficult to resolve.",
    quotePara: "§ 397–398",
  },
];

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "verdict", label: "Verdict scorecard" },
  { id: "icsft", label: "ICSFT findings" },
  { id: "cerd", label: "CERD findings" },
  { id: "order", label: "Provisional measures" },
  { id: "operative", label: "Operative clause" },
];

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const styles = {
    upheld: "bg-accent text-white",
    rejected: "bg-rule text-ink-soft",
    partial: "bg-[#b8893a] text-white",
  };
  const labels = { upheld: "Violation found", rejected: "Not established", partial: "Partial" };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-wider uppercase rounded-sm ${styles[verdict]}`}
    >
      {labels[verdict]}
    </span>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 mb-12">
      <h2 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.15em] uppercase text-ink-soft mt-12 mb-4 border-b border-rule pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-rule mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-4 hover:bg-bg-2/50 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft">
              {finding.article}
            </span>
            <VerdictBadge verdict={finding.verdict} />
          </div>
          <p className="font-[family-name:var(--font-newsreader)] text-[15px] text-ink leading-snug">
            {finding.claim}
          </p>
        </div>
        <span className="text-ink-soft text-lg shrink-0 mt-1 transition-transform" style={{ transform: open ? "rotate(45deg)" : "none" }}>
          +
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-rule/50">
          {finding.ukraineClaim && (
            <div className="mt-3 mb-3">
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft block mb-1">
                Ukraine&apos;s claim
              </span>
              <p className="font-[family-name:var(--font-newsreader)] text-[13px] leading-[1.7] text-ink-soft pl-3 border-l-2 border-rule">
                {finding.ukraineClaim}
              </p>
            </div>
          )}
          <div className="mt-3">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft block mb-1">
              Court&apos;s position
            </span>
            <p className="font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.75] text-ink">
              {finding.courtPosition}
            </p>
          </div>
          {finding.keyQuote && (
            <blockquote className="border-l-2 border-accent pl-3 mt-3 font-[family-name:var(--font-newsreader)] italic text-[13px] leading-[1.7] text-ink">
              {finding.keyQuote}
              {finding.quotePara && (
                <cite className="block mt-1 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] not-italic text-ink-soft">
                  {finding.quotePara}
                </cite>
              )}
            </blockquote>
          )}
          {finding.excerpts && finding.excerpts.length > 0 && (
            <details className="mt-4">
              <summary className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-accent cursor-pointer hover:underline">
                Judgment excerpts ({finding.excerpts.length})
              </summary>
              <div className="mt-2 space-y-3">
                {finding.excerpts.map((ex, i) => (
                  <div key={i} className="pl-3 border-l border-rule">
                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-ink-soft block mb-0.5">
                      {ex.para}
                    </span>
                    <p className="font-[family-name:var(--font-newsreader)] text-[13px] leading-[1.7] text-ink-soft">
                      {ex.text}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default function CasePage() {
  const [activeSection, setActiveSection] = useState("overview");

  const upheldCount = FINDINGS.filter((f) => f.verdict === "upheld").length;
  const rejectedCount = FINDINGS.filter((f) => f.verdict === "rejected").length;
  const partialCount = FINDINGS.filter((f) => f.verdict === "partial").length;
  const total = FINDINGS.length;

  const icsftFindings = FINDINGS.filter((f) => f.convention === "ICSFT");
  const cerdFindings = FINDINGS.filter((f) => f.convention === "CERD");
  const orderFindings = FINDINGS.filter((f) => f.convention === "Order");

  return (
    <div className="flex-1 flex">
      {/* Sticky TOC sidebar */}
      <nav className="hidden lg:block w-48 shrink-0 px-6 pt-8">
        <div className="sticky top-20">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-ink-soft mb-3">
            On this page
          </p>
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`block py-1.5 font-[family-name:var(--font-newsreader)] text-sm transition-colors ${
                activeSection === item.id
                  ? "text-ink font-medium"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-6 lg:px-8 max-w-[800px] pb-16">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2">
          <Link
            href="/atlas"
            className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-accent hover:underline"
          >
            ← Back to Atlas
          </Link>
        </div>

        {/* ── OVERVIEW ── */}
        <Section id="overview" title="Case overview">
          <div className="mb-6">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
              International Court of Justice · General List No. 166
            </p>
            <h1 className="font-[family-name:var(--font-newsreader)] text-[2.5rem] md:text-[3rem] leading-[1.1] font-normal text-ink mb-4">
              Ukraine{" "}
              <em className="font-[family-name:var(--font-newsreader)] italic">v.</em>{" "}
              Russian Federation
            </h1>
            <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-lg leading-relaxed mb-6">
              Application of the International Convention for the Suppression of
              the Financing of Terrorism and of the International Convention on
              the Elimination of All Forms of Racial Discrimination
            </p>
          </div>

          {/* Key facts grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink mb-6">
            {[
              { label: "Filed", value: "16 Jan 2017" },
              { label: "Judgment", value: "31 Jan 2024" },
              { label: "Status", value: "Merits delivered" },
              { label: "Remedies", value: "None ordered" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-3 ${i < 3 ? "border-r border-rule" : ""}`}
              >
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.1em] uppercase text-ink-soft">
                  {item.label}
                </div>
                <div className="font-[family-name:var(--font-newsreader)] text-sm text-ink mt-1">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <p className="font-[family-name:var(--font-newsreader)] text-[1.05rem] leading-[1.8] text-ink">
            On January 31, 2024, the International Court of Justice issued a
            judgment on the merits of the case brought by Ukraine against the
            Russian Federation in 2017. Ukraine alleged numerous violations by
            Russia of two treaties: the 1999 International Convention for the
            Suppression of the Financing of Terrorism (ICSFT), and the 1965
            International Convention on the Elimination of All Forms of Racial
            Discrimination (CERD).
          </p>
        </Section>

        {/* ── TIMELINE ── */}
        <Section id="timeline" title="Procedural timeline">
          <div className="relative pl-6 border-l-2 border-rule">
            {TIMELINE.map((item, i) => (
              <div key={i} className="mb-6 last:mb-0 relative">
                <div
                  className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${
                    item.type === "judgment"
                      ? "bg-accent border-accent"
                      : item.type === "order"
                        ? "bg-[#b8893a] border-[#b8893a]"
                        : "bg-bg border-ink"
                  }`}
                />
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-wider text-ink-soft uppercase">
                  {item.date}
                </div>
                <div className="font-[family-name:var(--font-newsreader)] text-[15px] text-ink mt-0.5">
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── VERDICT SCORECARD ── */}
        <Section id="verdict" title="Verdict scorecard">
          {/* Summary bar */}
          <div className="flex h-5 rounded-sm overflow-hidden mb-4 border border-rule">
            <div
              className="bg-accent transition-all"
              style={{ width: `${(upheldCount / total) * 100}%` }}
              title={`${upheldCount} upheld`}
            />
            <div
              className="bg-[#b8893a] transition-all"
              style={{ width: `${(partialCount / total) * 100}%` }}
              title={`${partialCount} partial`}
            />
            <div
              className="bg-rule transition-all"
              style={{ width: `${(rejectedCount / total) * 100}%` }}
              title={`${rejectedCount} rejected`}
            />
          </div>

          <div className="flex gap-6 mb-6 font-[family-name:var(--font-ibm-plex-mono)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent" />
              <span>Violation found ({upheldCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#b8893a]" />
              <span>Partial ({partialCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rule" />
              <span>Not established ({rejectedCount})</span>
            </div>
          </div>

          {/* Compact verdict table */}
          <div className="border border-rule">
            <div className="grid grid-cols-[1fr_100px_140px] gap-0 bg-bg-2 px-3 py-2 border-b border-rule font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft">
              <span>Article / Claim</span>
              <span>Convention</span>
              <span>Verdict</span>
            </div>
            {FINDINGS.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[1fr_100px_140px] gap-0 px-3 py-2.5 border-b border-rule/50 last:border-0 items-center"
              >
                <div>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-ink-soft">
                    {f.article}
                  </span>
                  <span className="font-[family-name:var(--font-newsreader)] text-[13px] text-ink block mt-0.5 leading-snug">
                    {f.claim.length > 60
                      ? f.claim.substring(0, 60) + "…"
                      : f.claim}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-ink-soft">
                  {f.convention}
                </span>
                <VerdictBadge verdict={f.verdict} />
              </div>
            ))}
          </div>
        </Section>

        {/* ── ICSFT FINDINGS ── */}
        <Section id="icsft" title="Findings under ICSFT">
          <p className="font-[family-name:var(--font-newsreader)] text-[15px] leading-[1.75] text-ink-soft mb-4">
            The Court first addressed a preliminary issue: the term
            &ldquo;funds&rdquo; under the ICSFT refers to resources provided or
            collected for their monetary and financial value and does not include
            weapons or training camps. Russia&apos;s &ldquo;clean hands&rdquo;
            defence was rejected — the doctrine cannot be applied in an
            inter-State dispute where jurisdiction is established. The standard
            of proof: convincing evidence, not &ldquo;fully conclusive.&rdquo;
          </p>
          {icsftFindings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </Section>

        {/* ── CERD FINDINGS ── */}
        <Section id="cerd" title="Findings under CERD">
          <p className="font-[family-name:var(--font-newsreader)] text-[15px] leading-[1.75] text-ink-soft mb-4">
            &ldquo;Racial discrimination&rdquo; under Article 1(1) consists of
            two elements: a distinction based on a prohibited ground, and an
            effect of nullifying or impairing human rights. A facially neutral
            measure may constitute discrimination if its effects show a
            disparate adverse impact — unless explained by non-prohibited
            grounds.
          </p>
          {cerdFindings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </Section>

        {/* ── PROVISIONAL MEASURES ── */}
        <Section id="order" title="Provisional Measures Order of 19 April 2017">
          <blockquote className="border-l-2 border-accent pl-4 mb-6 font-[family-name:var(--font-newsreader)] italic text-[14px] leading-[1.75] text-ink">
            &ldquo;(1) With regard to the situation in Crimea, the Russian
            Federation must, in accordance with its obligations under CERD, (a)
            Refrain from maintaining or imposing limitations on the ability of
            the Crimean Tatar community to conserve its representative
            institutions, including the Mejlis; (b) Ensure the availability of
            education in the Ukrainian language; (2) Both Parties shall refrain
            from any action which might aggravate or extend the dispute before
            the Court or make it more difficult to resolve.&rdquo;
            <cite className="block mt-2 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] not-italic text-ink-soft">
              § 376
            </cite>
          </blockquote>
          {orderFindings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </Section>

        {/* ── OPERATIVE CLAUSE ── */}
        <Section id="operative" title="Operative clause — Legal consequences">
          <div className="border border-ink p-4 mb-4 bg-bg-2/30">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft mb-3">
              The Court,
            </p>
            <div className="space-y-3 font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.7] text-ink">
              <p>
                <strong>Finds</strong> that the Russian Federation, by failing
                to take measures to investigate facts contained in information
                received from Ukraine regarding persons who have allegedly
                committed an offence set forth in Article 2 of the ICSFT, has
                violated its obligation under Article 9, paragraph 1, of the
                said Convention;
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> all other submissions made by Ukraine
                with respect to the ICSFT;
              </p>
              <p>
                <strong>Finds</strong> that the Russian Federation, by the way
                in which it has implemented its educational system in Crimea
                after 2014 with regard to school education in the Ukrainian
                language, has violated its obligations under Articles 2,
                paragraph 1 (a), and 5 (e) (v) of CERD;
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> all other submissions made by Ukraine
                with respect to CERD;
              </p>
              <p>
                <strong>Finds</strong> that the Russian Federation, by
                maintaining limitations on the Mejlis, has violated its
                obligation under paragraph 106 (1) (a) of the Order of 19 April
                2017;
              </p>
              <p>
                <strong>Finds</strong> that the Russian Federation has violated
                its obligation under paragraph 106 (2) of the Order of 19 April
                2017 to refrain from any action which might aggravate or extend
                the dispute;
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> all other submissions made by Ukraine
                with respect to the Order of 19 April 2017.
              </p>
            </div>
          </div>

          <p className="font-[family-name:var(--font-newsreader)] italic text-[14px] text-ink-soft">
            The Court decided not to order any specific legal remedies.
            Consequently, this decision will have no practical consequences, but
            will only have significant factual and legal implications.
          </p>
        </Section>

        {/* Source */}
        <div className="mt-8 pt-4 border-t border-rule">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-ink-soft">
            Source: Summary of ICJ Judgment of 31 January 2024 (GL 166).
            Quotations reproduced from the judgment where verifiable.
          </p>
        </div>
      </main>
    </div>
  );
}

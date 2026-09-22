import type { DecisionSummary, SummaryBlock } from "./types";
import verbatim from "./icj-cerd-icsft.verbatim.json";
import verbatimUk from "./icj-cerd-icsft.uk.json";

/**
 * ICSFT & CERD (Ukraine v. Russian Federation), ICJ Judgment of 31 January 2024.
 *
 * `verbatim` holds the summary prose exactly as ingested from the source .docx
 * (English — the language of the judgment). The fields below add a localized
 * visualization layer — stats, facts, timeline, verdicts and theatres — whose
 * every value restates something already in that prose:
 *   • timeline dates all appear in the text (Crimea 2014, filing 2017, the
 *     19 April 2017 Order, the 31 January 2024 Judgment);
 *   • the verdict matrix mirrors the operative findings in "4. LEGAL
 *     CONSEQUENCES" (the dispositif) — four violations, the rest rejected;
 *   • the theatres restate the two factual tracks (eastern Ukraine → ICSFT,
 *     Crimea → CERD) and anchor them to the map.
 * Short chrome strings are localized UA/EN; the body prose stays English.
 */
export const icjCerdIcsft: DecisionSummary = {
  ...(verbatim as {
    id: string;
    caseId: string;
    masthead: { official: string; parties: string; judgment: string };
    blocks: SummaryBlock[];
  }),
  blocksUk: (verbatimUk as { blocks: SummaryBlock[] }).blocks,

  /* «Стандартизована назва з одним розміром шрифту. Замінюємо назву на таку»
     — the owner's own wording, and it is the ICJ's full case name. What stood
     here was «Україна проти Російської Федерації», which is also the h1 of
     icj-genocide: the archive's two ICJ cases carried one headline between
     them and neither said which it was.

     One word-group differs from the owner's text. She wrote «про запобігання
     фінансуванню тероризму»; the convention's official Ukrainian name, fixed
     by the ratification law (Закон України № 149-IV of 12 September 2002,
     zakon.rada.gov.ua/go/995_518), is «про боротьбу з фінансуванням
     тероризму», and that is what the caption on this page and every other
     mention in the archive already use. On a page about that convention the
     h1 cannot be the one place that names it differently, so the official
     wording stands here — flagged to the owner, hers to overrule.

     Set in sentence case, not the capitals of the review document: the caps
     there are that document's heading style, and 130 characters of display
     serif in capitals is six lines of shouting. */
  title: {
    uk: "Застосування Міжнародної конвенції про боротьбу з фінансуванням тероризму та Міжнародної конвенції про ліквідацію всіх форм расової дискримінації (Україна проти Російської Федерації)",
    en: "Application of the International Convention for the Suppression of the Financing of Terrorism and of the International Convention on the Elimination of All Forms of Racial Discrimination (Ukraine v. Russian Federation)",
  },  /* The masthead in Ukrainian — the caption under the title and the line
     in the eyebrow. `masthead` keeps the decision's own English, which is
     what the citation block reproduces; this is what a Ukrainian reader
     sees at the top of the page. See `mastheadUk` in summaries/types.ts. */
  mastheadUk: {
    /* The same sentence as `title`, deliberately. The caption used to stop
       before «(Україна проти Російської Федерації)», so with the full case
       name in the h1 it rendered as a shortened copy of the headline directly
       under it — one name at two sizes, which is what the review asked to end.
       Identical, the masthead prints it once; see the guard on `.fullname` in
       cases/[slug]/page.tsx. The English `masthead.official` is untouched and
       is what the citation block reproduces. */
    official:
      "Застосування Міжнародної конвенції про боротьбу з фінансуванням тероризму та Міжнародної конвенції про ліквідацію всіх форм расової дискримінації (Україна проти Російської Федерації)",
    judgment: "Рішення від 31 січня 2024",
  },

  /**
   * Explicit rather than relying on the page template's default. That default
   * is invisible from the data, so every other consumer has to know about it —
   * and map-links.ts did not, which is why this decision showed no forum on
   * the events map.
   */
  forum: {
    institution: {
      uk: "Міжнародний суд ООН",
      en: "International Court of Justice",
    },
    seat: { uk: "Гаага", en: "The Hague" },
  },

  /* Search-result description. `plain.tldr` used to serve as this and runs
     three to four sentences, so the snippet was cut off mid-word. */
  metaDesc: {
    uk: "Рішення МС ООН від 31 січня 2024: два порушення — Росія не розслідувала фінансування тероризму і згорнула українську освіту в Криму.",
    en: "ICJ judgment of 31 January 2024: two breaches upheld — Russia failed to investigate terrorism financing and curtailed Ukrainian schooling in Crimea.",
  },

  plain: {
    tldr: {
    /* The judgment's own opening paragraph, not a retelling of it. The one
       that stood here was written for the page and showed it — and it also
       carried «лише два порушення» while the dashboard beside it counted
       four. Review: «Цей абзац я б теж переписала, бо дуже видно, що це ШІ
       склав. На наступний текст (він взятий з колонки САМЕРІ, тому звідти
       треба забрати)». So the paragraph moved rather than being copied: the
       `lead` block is gone from both summary files, and the closing sentence
       about the dismissal of most claims is the review's own addition. */
      uk: "31 січня 2024 року Міжнародний суд ООН («Суд») виніс рішення по суті у справі, порушеній Україною проти Російської Федерації у 2017 році («Рішення»). Україна стверджувала про численні порушення Росією двох договорів: Міжнародної конвенції про боротьбу з фінансуванням тероризму 1999 року («ICSFT») та Міжнародної конвенції про ліквідацію всіх форм расової дискримінації 1965 року («CERD»). Більшість вимог України було відхилено.",
      en: "On January 31, 2024, the International Court of Justice (“the Court”) issued a judgment on the merits of the case brought by Ukraine against the Russian Federation in 2017 (“the Judgment”). Ukraine alleged numerous violations by Russia of two treaties: the 1999 International Convention for the Suppression of the Financing of Terrorism (“ICSFT”), and the 1965 International Convention on the Elimination of All Forms of Racial Discrimination (“CERD”). Most of Ukraine's claims were dismissed.",
    },
    whyMatters: {
      uk: "Рішення Міжнародного суду ООН остаточне й оскарженню не підлягає, але не має механізму примусового виконання. Його головна вага — фактологічна та правова: воно офіційно фіксує порушення й дає опору для майбутніх позовів, статей та аргументів.",
      en: "A judgment of the International Court of Justice is final and cannot be appealed, but there is no mechanism to enforce it. Its weight is factual and legal: it puts the breaches on the record and gives a foundation for future claims, writing and argument.",
    },
  },

  glossary: [
    {
      term: { uk: "Меджліс", en: "Mejlis" },
      def: {
        uk: "Представницький орган кримськотатарського народу; заборонений Росією у 2016 році.",
        en: "The representative body of the Crimean Tatar people; banned by Russia in 2016.",
      },
    },
    {
      term: { uk: "Тимчасові заходи", en: "Provisional measures" },
      def: {
        uk: "Термінові приписи суду на час розгляду справи, щоб зберегти права сторін — свого роду забезпечення позову.",
        en: "Urgent orders a court issues while a case is pending, to preserve the parties' rights — akin to an injunction.",
      },
    },
    {
      term: { uk: "Dispositif", en: "Dispositif" },
      def: {
        uk: "Резолютивна (постановча) частина рішення — власне висновки, до яких дійшов суд.",
        en: "The operative part of a judgment — the Court's actual findings and orders.",
      },
    },
    {
      term: { uk: "CERD", en: "CERD" },
      def: {
        uk: "Міжнародна конвенція про ліквідацію всіх форм расової дискримінації (1965).",
        en: "International Convention on the Elimination of All Forms of Racial Discrimination (1965).",
      },
    },
    {
      term: { uk: "ICSFT", en: "ICSFT" },
      def: {
        uk: "Міжнародна конвенція про боротьбу з фінансуванням тероризму (1999).",
        en: "International Convention for the Suppression of the Financing of Terrorism (1999).",
      },
    },
    {
      term: { uk: "«ДНР» / «ЛНР»", en: "“DPR” / “LPR”" },
      def: {
        uk: "Самопроголошені утворення на сході України, підтримувані Росією; лапки означають невизнання.",
        en: "Self-proclaimed entities in eastern Ukraine backed by Russia; quotation marks signal non-recognition.",
      },
    },
    {
      term: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
      def: {
        uk: "Головний судовий орган ООН у Гаазі; вирішує спори між державами.",
        en: "The principal judicial organ of the UN, in The Hague; settles disputes between States.",
      },
    },
  ],

  whoIsWho: [
    {
      name: { uk: "Україна", en: "Ukraine" },
      role: { uk: "Заявник — держава, що подала позов.", en: "Applicant — the State that brought the case." },
      kind: "party",
    },
    {
      name: { uk: "Російська Федерація", en: "Russian Federation" },
      role: { uk: "Відповідач.", en: "Respondent." },
      kind: "party",
    },
    {
      name: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
      role: {
        uk: "Головний судовий орган ООН у Гаазі; вирішує спори між державами.",
        en: "The UN's principal judicial organ, in The Hague; settles disputes between States.",
      },
      kind: "court",
    },
    {
      name: { uk: "Кримські татари", en: "Crimean Tatars" },
      role: {
        uk: "Корінний народ Криму; від їхнього імені порушено питання дискримінації за CERD.",
        en: "Indigenous people of Crimea; the CERD discrimination claims were brought on their behalf.",
      },
      kind: "actor",
    },
    {
      name: { uk: "«ДНР» / «ЛНР»", en: "“DPR” / “LPR”" },
      role: {
        uk: "Самопроголошені збройні угруповання на сході; за їх фінансування Україна винила РФ.",
        en: "Self-proclaimed armed groups in the east; Ukraine blamed Russia for financing them.",
      },
      kind: "actor",
    },
  ],

  faq: [
    {
      q: { uk: "То Україна виграла?", en: "So did Ukraine win?" },
      a: {
        uk: "Частково. Суд визнав два порушення по суті (нерозслідування фінансування тероризму та згортання освіти українською в Криму) і два порушення тимчасового наказу, але відхилив більшість інших вимог.",
        en: "Partly. The Court upheld two breaches on the merits (failure to investigate terrorism financing, and curtailing Ukrainian-language education in Crimea) and two breaches of the interim Order, but dismissed most other claims.",
      },
    },
    {
      q: { uk: "Чи можна змусити Росію виконати рішення?", en: "Can Russia be forced to comply?" },
      a: {
        uk: "Прямого механізму примусу немає. Рішення остаточне, але його дотримання залежить від самої держави; теоретично питання виконання може розглядати Рада Безпеки ООН.",
        en: "There is no direct enforcement mechanism. The judgment is final, but compliance depends on the State itself; in theory enforcement can be raised at the UN Security Council.",
      },
    },
    {
      q: { uk: "Навіщо це рішення, якщо його не виконують?", en: "Why does the judgment matter if it isn't enforced?" },
      a: {
        uk: "Воно офіційно й авторитетно фіксує факти та правові порушення — це основа для майбутніх позовів, репарацій, журналістики й адвокації.",
        en: "It authoritatively puts the facts and legal breaches on the record — a foundation for future claims, reparations, journalism and advocacy.",
      },
    },
    {
      q: { uk: "Що буде далі?", en: "What happens next?" },
      a: {
        uk: "Рішення МС ООН оскарженню не підлягає. Паралельно тривають інші справи проти РФ — про геноцид (МС ООН), у ЄСПЛ та в Міжнародному кримінальному суді.",
        en: "An ICJ judgment cannot be appealed. Other cases against Russia continue in parallel — on genocide (ICJ), at the ECtHR, and at the International Criminal Court.",
      },
    },
  ],

  related: [
    {
      label: {
        uk: "Звинувачення у геноциді (Україна проти РФ)",
        en: "Allegations of Genocide (Ukraine v. Russian Federation)",
      },
      note: { uk: "МС ООН · 32 держави-інтервенти", en: "ICJ · 32 States intervening" },
      href: "/cases/icj-genocide",
    },
    {
      label: { uk: "Ордери МКС на арешт", en: "ICC arrest warrants" },
      note: { uk: "Міжнародний кримінальний суд", en: "International Criminal Court" },
      /* The situation page, which is where the six warrants are. `#registry`
         was written when nothing here had a page and it resolves to the home
         page's preview band — a card that names a decision and lands the
         reader on a list of thirty-three. */
      href: "/cases/icc-ukraine",
    },
    {
      label: { uk: "MH17 (ЄСПЛ)", en: "MH17 (ECtHR)" },
      note: { uk: "Європейський суд з прав людини", en: "European Court of Human Rights" },
      href: "/cases/echr-ukraine-netherlands",
    },
  ],

  judgment: {
    court: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
    url: "https://www.icj-cij.org/sites/default/files/case-related/166/166-20240131-jud-01-00-en.pdf",
    caseUrl: "https://www.icj-cij.org/case/166",
    /* 139 — the page count of the PDF at `url`, which is the convention
       icj-genocide already uses (70 there is likewise a file count). It read
       213: that is the number printed on the judgment's last page, because
       the judgment opens at I.C.J. Reports p. 80 and closes at p. 213, so it
       runs 134 Reports pages. The page renders this as "PDF, {n} с.", which
       made the button promise a reader seventy-four pages that are not
       there. */
    pages: 139,
    date: "2024-01-31",
  },

  instruments: [
    {
      abbr: "ICSFT",
      name: {
        uk: "Міжнародна конвенція про боротьбу з фінансуванням тероризму",
        en: "International Convention for the Suppression of the Financing of Terrorism",
      },
      year: 1999,
      url: "https://treaties.un.org/pages/ViewDetails.aspx?src=IND&mtdsg_no=XVIII-11&chapter=18&clang=_en",
    },
    {
      abbr: "CERD",
      name: {
        uk: "Міжнародна конвенція про ліквідацію всіх форм расової дискримінації",
        en: "International Convention on the Elimination of All Forms of Racial Discrimination",
      },
      year: 1965,
      url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-convention-elimination-all-forms-racial-discrimination",
    },
  ],

  stats: [
    { value: "2", label: { uk: "конвенції", en: "conventions" } },
    /* The accented tile of this dashboard. The template used to give it the
       accent by matching the English label string; the flag the model already
       has for it carries the same fact and survives a rewording. */
    {
      value: "4",
      label: { uk: "порушення", en: "violations found" },
      note: {
        uk: "2 за конвенціями · 2 за наказом 2017 року",
        en: "2 under the conventions · 2 under the 2017 Order",
      },
      em: true,
    },
    { value: "7", label: { uk: "років розгляду", en: "years to judgment" } },
  ],

  glance: [
    { label: { uk: "Заявник", en: "Applicant" }, value: { uk: "Україна", en: "Ukraine" } },
    {
      label: { uk: "Відповідач", en: "Respondent" },
      value: { uk: "Російська Федерація", en: "Russian Federation" },
    },
    {
      label: { uk: "Суд", en: "Court" },
      value: { uk: "Міжнародний суд ООН", en: "International Court of Justice" },
    },
    { label: { uk: "Місце", en: "Seat" }, value: { uk: "Гаага", en: "The Hague" } },
    { label: { uk: "Загальний список", en: "General List" }, value: { uk: "№ 166", en: "No. 166" } },
    {
      label: { uk: "Рішення", en: "Judgment" },
      value: { uk: "31 січня 2024", en: "31 January 2024" },
    },
  ],

  /* All four carry a sort key now.

     They did not, and the review found the result: «Хронологія подана не в
     хронологічному порядку». Events without `iso` sort last, so «поч. 2014»
     and «2017» — the two oldest — printed under the 2024 judgment.

     The reasoning that left them keyless was that widening a season or a year
     into 1 January invents a day. It does, but `iso` is not the printed date:
     the visible label still reads «поч. 2014», and `TimelineEvent.iso` is
     documented as a sort key whose date «may be a range or a month». The
     timeline already reads a four-character key at year precision — see the
     rail in CaseTimeline.tsx, which places `"2014"` as `2014-01-01`. So the
     key is given at the precision the label claims and no finer. */
  timeline: [
    {
      date: { uk: "поч. 2014", en: "Early 2014" },
      iso: "2014",
      label: {
        uk: "РФ встановлює контроль над Кримським півостровом",
        en: "Russian Federation takes control of the Crimean peninsula",
      },
      kind: "context",
    },
    {
      date: { uk: "2017", en: "2017" },
      iso: "2017",
      label: {
        uk: "Україна подає позов до Суду",
        en: "Ukraine institutes proceedings before the Court",
      },
      kind: "filing",
    },
    {
      date: { uk: "19 квіт. 2017", en: "19 Apr 2017" },
      iso: "2017-04-19",
      label: {
        uk: "Наказ про тимчасові заходи",
        en: "Order indicating provisional measures",
      },
      kind: "order",
    },
    {
      date: { uk: "31 січ. 2024", en: "31 Jan 2024" },
      iso: "2024-01-31",
      label: { uk: "Рішення по суті", en: "Judgment on the merits" },
      kind: "judgment",
    },
  ],

  /* Every claim Ukraine brought, and what the Court did with it.
   *
   * This was the dispositif and nothing else: four violations and three
   * catch-all clauses. The catch-alls are in the judgment's own words —
   * «Відхиляє всі інші вимоги, заявлені Україною щодо…» — and as an index
   * they told a reader that something had been rejected without saying
   * what, which is the one question this table exists to answer. Owner:
   * «не вистачає можливості переглянути які саме вимоги відхилено».
   *
   * The twelve rows below are the findings the write-up sets out, one per
   * heading in «Висновки за ICSFT» and «Висновки за CERD» and one for the
   * limb of the Order the Court held was not breached. Each outcome is the
   * one recorded on that finding — see `outcomes` in the write-up's blocks
   * and the note on it in summaries/types.ts. The catch-alls stay in the
   * record, flagged residual, because they are clauses of the judgment;
   * they stay out of the index because the index now says what they meant.
   */
  verdicts: [
    {
      track: "ICSFT",
      claim: { uk: "Ст. 8 — незаморожені кошти", en: "Art. 8 — funds not frozen" },
      outcome: "no-violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Ст. 9(1) — нерозслідування", en: "Art. 9(1) — failure to investigate" },
      outcome: "violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Ст. 10 — непереслідування", en: "Art. 10 — failure to prosecute" },
      outcome: "no-violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Ст. 12 — правова допомога", en: "Art. 12 — mutual legal assistance" },
      outcome: "no-violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Ст. 18 — співпраця у запобіганні", en: "Art. 18 — co-operation in prevention" },
      outcome: "no-violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "rejected",
      residual: true,
    },
    {
      track: "CERD",
      claim: {
        uk: "Ст. 2(1)(a) і 5(e)(v) — освіта українською",
        en: "Arts. 2(1)(a) & 5(e)(v) — Ukrainian-language education",
      },
      outcome: "violation",
    },
    {
      track: "CERD",
      claim: {
        uk: "Зникнення, вбивства, викрадення, катування",
        en: "Disappearances, murders, abductions, torture",
      },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Правоохоронні заходи", en: "Law-enforcement measures" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Заборона Меджлісу", en: "Ban on the Mejlis" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Громадянство", en: "Citizenship" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Культурно значущі зібрання", en: "Culturally significant gatherings" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Засоби масової інформації", en: "Media outlets" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Культурна спадщина та інституції", en: "Cultural heritage and institutions" },
      outcome: "no-violation",
    },
    {
      track: "CERD",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "rejected",
      residual: true,
    },
    {
      track: "Provisional measures",
      // Without this the Ukrainian page prints the English key as a section
      // heading in the middle of the verdict matrix.
      trackLabel: { uk: "Тимчасові заходи", en: "Provisional measures" },
      claim: { uk: "Збереження заборони Меджлісу", en: "Maintaining the ban on the Mejlis" },
      outcome: "violation",
    },
    {
      track: "Provisional measures",
      trackLabel: { uk: "Тимчасові заходи", en: "Provisional measures" },
      claim: { uk: "Загострення спору", en: "Aggravating / extending the dispute" },
      outcome: "violation",
    },
    {
      track: "Provisional measures",
      trackLabel: { uk: "Тимчасові заходи", en: "Provisional measures" },
      claim: { uk: "Доступність освіти українською", en: "Keeping Ukrainian-language education available" },
      outcome: "no-violation",
    },
    {
      track: "Provisional measures",
      trackLabel: { uk: "Тимчасові заходи", en: "Provisional measures" },
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "rejected",
      residual: true,
    },
  ],

  sources: [
    {
      url: "https://asil.org/ilib/icj-delivers-judgment-ukraine-v-russia-case-concerning-terrorism-financing-and-cerd/",
      title:
        "ICJ Delivers Judgment in Ukraine v. Russia Case Concerning Terrorism Financing and CERD",
      authors: "",
      publication: "ASIL",
      date: "2024",
      type: "news/insight",
    },
    {
      url: "https://www.ejiltalk.org/human-rights-reparations-and-fact-finding-quandaries-in-the-2024-icj-judgments-in-ukraine-v-russian-federation/",
      title:
        "Human Rights Reparations and Fact-Finding Quandaries in the 2024 ICJ Judgments in Ukraine v. Russian Federation",
      authors: "Diane Desierto",
      publication: "EJIL: Talk!",
      date: "11 March 2024",
      type: "blog post",
    },
    {
      url: "https://www.researchgate.net/publication/381785364_Judgment_on_the_merits_of_the_International_Court_of_Justice_of_January_31_2024_case_Ukraine_vs_Russian_Federation",
      title:
        "Judgment on the merits of the International Court of Justice of January 31, 2024, case Ukraine vs Russian Federation",
      authors: "O.A. Kiseleva",
      publication: "Law Enforcement Review (via ResearchGate)",
      date: "2024",
      type: "journal article",
    },
    {
      url: "https://www.cambridge.org/core/journals/american-journal-of-international-law/article/application-of-the-international-convention-for-the-suppression-of-the-financing-of-terrorism-and-of-international-convention-on-the-elimination-of-all-forms-of-racial-discrimination-ukraine-v-russian-federation-judgment/1C4B2C51220C6332B91392FAC2204267",
      title:
        "Application of the International Convention for the Suppression of the Financing of Terrorism and of International Convention on the Elimination of All Forms of Racial Discrimination (Ukraine v. Russian Federation), Judgment",
      authors: "Lauri Mälksoo",
      publication: "American Journal of International Law",
      date: "2024",
      type: "journal article",
    },
    {
      url: "https://internationallaw.blog/2024/04/08/narrow-interpretation-of-the-term-funds-by-the-judgement-of-31-january-2024-is-icj-the-one-to-blame/",
      title:
        "Narrow Interpretation of the Term “Funds” by the Judgement of 31 January 2024: Is ICJ the One to Blame?",
      authors: "Oleksandr Marusiak",
      publication: "International Law Blog",
      date: "8 April 2024",
      type: "blog post",
    },
    {
      url: "https://www.researchgate.net/publication/385033225_Application_of_the_International_Convention_for_the_Suppression_of_the_Financing_of_Terrorism_and_of_International_Convention_on_the_Elimination_of_All_Forms_of_Racial_Discrimination_Ukraine_v_Russian",
      title:
        "Application of the International Convention for the Suppression of the Financing of Terrorism and of International Convention on the Elimination of All Forms of Racial Discrimination (Ukraine v. Russian Federation)",
      authors: "",
      publication: "ResearchGate",
      date: "2024",
      type: "preprint/repository",
    },
    {
      url: "https://www.researchgate.net/publication/389453084_Comments_on_the_judgment_of_the_International_Court_of_Justice_of_31_January_2024_Case_No_166_Application_of_the_International_Convention_for_the_Suppression_of_the_Financing_of_Terrorism_and_the_Inte",
      title:
        "Comments on the judgment of the International Court of Justice of 31 January 2024, Case No. 166 (Ukraine v. Russian Federation)",
      authors: "Kaja Kowalczewska, Barbara Pauli",
      publication: "Polish Review of International and European Law",
      date: "2024",
      type: "journal article",
    },
    {
      url: "https://www.cambridge.org/core/journals/international-legal-materials/article/application-of-the-intl-conv-for-the-suppression-of-the-financing-of-terrorism-of-the-intl-conv-on-the-elimination-of-all-forms-of-racial-discr-ukr-v-russ-merits-icj/32AB65A2A320168FB1297F160747197D",
      title:
        "Application of the Int’l Conv. for the Suppression of the Financing of Terrorism & of the Int’l Conv. on the Elimination of All Forms of Racial Discr. (Ukr. v. Russ.) (Merits) (I.C.J.)",
      authors: "Iryna Marchuk",
      publication: "International Legal Materials",
      date: "2024",
      type: "journal article",
    },
    {
      url: "https://www.researchgate.net/publication/388942304_Reflecting_on_the_interpretation_and_application_of_the_international_convention_for_the_suppression_of_the_financing_of_terrorism_in_light_of_the_Ukraine_v_Russia_case",
      title:
        "Reflecting on the interpretation and application of the International Convention for the Suppression of the Financing of Terrorism in light of the Ukraine v. Russia case",
      authors: "Daniele Musmeci",
      publication: "Journal of International Dispute Settlement (via ResearchGate)",
      date: "2025",
      type: "journal article",
    },
    {
      url: "https://legaljournal.princeton.edu/from-financing-to-frontlines-interpreting-funds-in-the-international-convention-for-the-suppression-of-the-financing-of-terrorism/",
      title:
        "From Financing to Frontlines: Interpreting Funds in the International Convention for the Suppression of the Financing of Terrorism",
      authors: "Katherine Lee",
      publication: "Princeton Legal Journal",
      date: "Fall 2024",
      type: "journal article",
    },
  ],

  /* Empty, so the «Ключові тлумачення» band does not render on this page.
   *
   * It held three entries and all three were the three preliminary
   * determinations, condensed: «Кошти» (ICSFT), racial discrimination under
   * CERD Article 1(1), and the clean-hands doctrine. The write-up sets out
   * each of them under «Попередні визначення», in the Court's own words and
   * with the argument it answered — so the page said the same three things
   * twice, in two shapes, eight bands apart, and a reader who met the short
   * form second had no way to know it was the same ruling.
   *
   * The field stays on the type and the band still knows how to draw itself:
   * a decision whose holdings on the law are not in its write-up should
   * still have somewhere to put them. Owner: «прибери смугу тлумачення».
   */
  interpretations: [],

  /* The date the template used to hardcode. It is in the verbatim: "Order on
     Provisional Measures of 19 April 2017", and the dispositif cites
     "paragraph 106 (1) (a) of the Order of 19 April 2017". */
  provisionalMeasuresOrder: {
    uk: "Наказ від 19 квітня 2017",
    en: "Order of 19 April 2017",
  },

  /* Empty, so the «Тимчасові заходи» band does not render on this page.
   *
   * It held three rows — the measure, whether it was kept, and a note with
   * the paragraph number — and the write-up answers each of the Order's
   * three limbs under «Наказ про тимчасові заходи», with the Court's own
   * words and the same paragraph numbers. The one thing the band had that
   * the text did not was the plain statement of what each measure
   * required, and that has moved onto the limb it belongs to.
   *
   * Owner: «розділ тимчасові заходи дублює те що вказано у правових
   * висновках — можеш спробувати обʼєднати».
   */
  provisionalMeasures: [],

  /* The drawing sits inside the write-up, after part 1, on paper — part 1
     is where the two theatres are named and the map is what they look like.
     See `mapInline` in summaries/types.ts. */
  mapInline: true,

  theatres: [
    {
      /* «Схід України», not «Східна Україна» — review's correction. The
         adjective names a region as though it were a fixed entity; the
         genitive names a part of the country, which is what the theatre is. */
      place: { uk: "Схід України", en: "Eastern Ukraine" },
      tag: "ICSFT",
      markerKeys: ["donetsk", "luhansk"],
      areas: ["east"],
      summary: {
        uk: "Ймовірне фінансування збройних груп «ДНР» і «ЛНР» — трек фінансування тероризму.",
        en: "Alleged financing of armed groups linked to the “DPR” and “LPR” — terrorism-financing track.",
      },
    },
    {
      place: { uk: "Крим", en: "Crimea" },
      tag: "CERD",
      markerKeys: ["crimea"],
      areas: ["crimea"],
      summary: {
        uk: "Ймовірна кампанія расової дискримінації проти кримських татар і етнічних українців.",
        en: "Alleged campaign of racial discrimination against Crimean Tatars and ethnic Ukrainians.",
      },
    },
  ],
};

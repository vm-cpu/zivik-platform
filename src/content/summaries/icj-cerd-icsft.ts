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

  title: {
    uk: "Україна проти Російської Федерації",
    en: "Ukraine v. Russian Federation",
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
      uk: "Україна судилася з Росією у Міжнародному суді ООН за двома договорами — про фінансування тероризму (події на сході) і про расову дискримінацію (Крим). Суд визнав лише два порушення: Росія не розслідувала ймовірне фінансування тероризму й згорнула шкільну освіту українською мовою в Криму. Більшість вимог України відхилено.",
      en: "Ukraine took Russia to the International Court of Justice under two treaties — on terrorism financing (events in the east) and on racial discrimination (Crimea). The Court upheld only two breaches: Russia failed to investigate alleged terrorism financing, and it curtailed Ukrainian-language schooling in Crimea. Most of Ukraine's claims were dismissed.",
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
         reader on a list of thirty-nine. */
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
    { value: "4", label: { uk: "порушення", en: "violations found" }, em: true },
    { value: "7", label: { uk: "років розгляду", en: "years to judgment" } },
    { value: "139", label: { uk: "сторінок", en: "pages" } },
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

  timeline: [
    {
      date: { uk: "поч. 2014", en: "Early 2014" },
      label: {
        uk: "РФ встановлює контроль над Кримським півостровом",
        en: "Russian Federation takes control of the Crimean peninsula",
      },
      kind: "context",
    },
    {
      date: { uk: "2017", en: "2017" },
      label: {
        uk: "Україна подає позов до Суду",
        en: "Ukraine institutes proceedings before the Court",
      },
      kind: "filing",
    },
    {
      date: { uk: "19 квіт. 2017", en: "19 Apr 2017" },
      label: {
        uk: "Наказ про тимчасові заходи",
        en: "Order indicating provisional measures",
      },
      kind: "order",
    },
    {
      date: { uk: "31 січ. 2024", en: "31 Jan 2024" },
      label: { uk: "Рішення по суті", en: "Judgment on the merits" },
      kind: "judgment",
    },
  ],

  verdicts: [
    {
      track: "ICSFT",
      claim: { uk: "Ст. 9(1) — нерозслідування", en: "Art. 9(1) — failure to investigate" },
      outcome: "violation",
    },
    {
      track: "ICSFT",
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
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
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
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
      claim: { uk: "Інші вимоги", en: "All other submissions" },
      outcome: "no-violation",
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

  interpretations: [
    {
      term: { uk: "«Кошти» (ICSFT)", en: "“Funds” (ICSFT)" },
      ruling: {
        uk: "Лише грошові та фінансові ресурси. Постачання зброї та організація тренувальних таборів — поза сферою дії конвенції.",
        en: "Monetary and financial resources only. Supplying weapons and running training camps fall outside the Convention.",
      },
    },
    {
      term: { uk: "Расова дискримінація (CERD)", en: "Racial discrimination (CERD)" },
      ruling: {
        uk: "Розрізнення за забороненою ознакою з метою АБО наслідком применшення прав. Зовні нейтральний захід може кваліфікуватися за його непропорційним негативним впливом.",
        en: "A distinction on a prohibited ground with the purpose OR effect of impairing rights. A facially neutral measure can qualify by its disparate adverse effect.",
      },
    },
    {
      term: { uk: "Доктрина «чистих рук»", en: "“Clean hands” doctrine" },
      ruling: {
        uk: "Не застосовна у міждержавному спорі, де юрисдикцію встановлено, а заяву визнано прийнятною. Відхилена як заперечення по суті.",
        en: "Cannot apply in an inter-State dispute where jurisdiction is established and the application is admissible. Rejected as a defence on the merits.",
      },
    },
  ],

  /* The date the template used to hardcode. It is in the verbatim: "Order on
     Provisional Measures of 19 April 2017", and the dispositif cites
     "paragraph 106 (1) (a) of the Order of 19 April 2017". */
  provisionalMeasuresOrder: {
    uk: "Наказ від 19 квітня 2017",
    en: "Order of 19 April 2017",
  },

  provisionalMeasures: [
    {
      measure: { uk: "Не обмежувати Меджліс", en: "Not to restrict the Mejlis" },
      order: "violated",
      note: {
        uk: "Заборону збережено (§ 392) — але по суті це не порушення CERD, лише порушення Наказу.",
        en: "Ban maintained (§ 392) — yet not a CERD violation in substance, only a breach of the Order.",
      },
    },
    {
      measure: {
        uk: "Забезпечити освіту українською мовою",
        en: "Ensure Ukrainian-language education",
      },
      order: "complied",
      note: {
        uk: "Освіта залишалася доступною (§ 395).",
        en: "Education remained available (§ 395).",
      },
    },
    {
      measure: { uk: "Не загострювати спір", en: "Not to aggravate the dispute" },
      order: "violated",
      note: {
        uk: "Визнання «ДНР» і «ЛНР» та початок «спеціальної воєнної операції» (§ 397–398).",
        en: "Recognition of the “DPR” and “LPR” and the launch of a “special military operation” (§ 397–398).",
      },
    },
  ],

  theatres: [
    {
      place: { uk: "Східна Україна", en: "Eastern Ukraine" },
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

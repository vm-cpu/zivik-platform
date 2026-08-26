/**
 * Ukrainian UI dictionary. This is the canonical shape; `Dictionary` is derived
 * from it and every other locale must satisfy that type (see `en.ts`).
 *
 * UI *chrome* strings live here. Domain content (courts, cases, events,
 * partners) lives in the content layer (`src/content/`) with per-locale fields.
 *
 * ── One word: «Бібліотека рішень» ───────────────────────────────────────────
 * USER DECISION, and it overrides what this comment used to say. The reader
 * meets exactly one name for the collection: «Бібліотека рішень» in Ukrainian,
 * "Library of decisions" in English. The page title, the H1, the nav item, the
 * hero CTA, the band on the home page, the footer link and every back link all
 * carry it.
 *
 * The previous rule — which this replaces — split the vocabulary in two:
 * «бібліотека» for the site and «реєстр» for the list of 39 proceedings at
 * `/registry`. The user has ruled that out: «переконайся що ми всюди
 * використовуємо термінологію Бібліотека рішень а не реєстр». Do not restore
 * the split, and do not reintroduce «реєстр» as a name for the collection or
 * for any page, band, link or control that points at it.
 *
 * «Реєстр» survives in exactly two places, and both are somebody else's word,
 * not ours:
 *   • a court's or a State's own register named in quoted or legal text — the
 *     Register of Damage for Ukraine («Реєстр збитків») in
 *     `summaries/echr-ukraine-netherlands.ts`, the register of depositors in
 *     the Russian federal laws quoted by `summaries/oschadbank.ts`;
 *   • «реєстраційний номер» — a docket reference, which is what a docket is
 *     called in Ukrainian.
 *
 * The identifiers do not follow the words. The route is still `/registry`, the
 * component is still `RegistryTable`, the key is still `registry.*`: renaming
 * the URL breaks every link already given out, and renaming the keys is churn
 * with no reader on the other end. If the route is ever renamed it needs a
 * redirect and a sitemap change, neither of which is a vocabulary question.
 * ────────────────────────────────────────────────────────────────────────────
 */
const uk = {
  meta: {
    title: "насвітло — рішення міжнародних судів щодо агресії проти України",
    description:
      "Відкрита бібліотека рішень міжнародних судів щодо російської агресії проти України: ЄСПЛ, Міжнародний суд ООН, ICC, арбітражі. Проєкт Факультету права УКУ.",
    ogAlt: "насвітло — бібліотека рішень міжнародних судів",
  },
  nav: {
    skip: "Перейти до змісту",
    menu: "Меню",
    home: "Головна",
      about: "Про нас",
    decisions: "Бібліотека рішень",
    map: "Мапа",
    team: "Команда",
    partners: "Партнери",
    blog: "Блог",
  },
  brand: {
    facultyAlt: "Факультет права УКУ",
    wordmark: "насвітло",
  },
  hero: {
    credit: "Проєкт",
    creditCentre: "Дослідницького центру імені Луї Б. Зона",
    creditFaculty: "Факультету права УКУ",
    lead: "Бібліотека відповідальності та правосуддя для України — освітлюємо правовий шлях, яким Україна крокує до справедливості.",
    ctaRegistry: "Бібліотека рішень",
    ctaMap: "Мапа",
    chainHint: "потягніть за ланцюжок",
    lampLabel: "Увімкнути або вимкнути лампу",
  },
  intro: {
    text: "Онлайн-бібліотека міжнародної судової практики (Міжнародний суд ООН, ЄСПЛ, МКС, Міжнародний трибунал з морського права, Постійна палата третейського суду) та практики іноземних судів, що стосується українських ініціатив для притягнення Росії до відповідальності за порушення, вчинені під час війни проти України.",
    about: "Про нас",
  },
  about: {
    /* The home page keeps a two-paragraph summary of the collection; the full
       account — who runs it, how a summary is made, where the archive stands —
       is its own page, and this is the link between them. */
    more: "Докладніше про проєкт",
  },
  slogan: "Досліджуємо · Пояснюємо · Висвітлюємо",
  pending: {
    title: "Ще досліджуємо",
    body: "Цю справу вже внесено до бібліотеки, але конспекту ще немає — ми над ним працюємо. Нижче те, що вже відомо, і посилання на документ суду, якщо він у відкритому доступі.",
    forum: "Суд",
    status: "Стан",
    kind: "Галузь",
    docket: "Реєстраційний номер",
    official: "Документ суду",
    toRegistry: "До бібліотеки рішень",
    toMap: "До мапи",
  },
  quote: {
    text: "Російська Федерація повинна негайно призупинити воєнні операції, які вона розпочала 24 лютого 2022 року на території України.",
    source: "Міжнародний суд ООН · Тимчасові заходи · 16 березня 2022",
    read: "Читати рішення",
  },
  mapSection: {
    close: "Закрити картку",
    label: "Мапа",
    heading: "Факти порушень та суди, які здійснюють їх правову оцінку",
    description:
      "Заявлені порушення — обстріли, депортації та захоплення — зʼєднані пунктиром із судом, де здійснюється їх правова оцінка.",
    fullMap: "Повна мапа →",
    legendCourt: "Суд",
    legendLit: "Є конспект",
    legendUnlit: "Ще досліджуємо",
    courtsSeat: "Суди засідають у",
    courtHears: "Розглядає справи",
    inLibrary: "Які саме",
    /* Two placeholders, not one. The noun agrees with the number — 1
       провадження, 2–4 провадження, 5+ проваджень — and baked into the
       template as the genitive plural it read «1 проваджень» on six of the
       nine courts on the map. `plural()` in @/i18n/plural picks the form. */
    caseload: "{n} {w} у бібліотеці",
    caseloadWord: { one: "провадження", few: "провадження", many: "проваджень" },
    zoomLabel: "Масштаб",
    zoomWide: "Європа",
    zoomClose: "Україна",
    zoomAtlantic: "Вся мапа",
    zoomReset: "Відцентрувати",
    zoomIn: "Наблизити",
    zoomOut: "Віддалити",
    wheelHint: "Ctrl або ⌘ + прокручування — масштаб",
    /* What the drawing says on a phone, where the marks are too small to aim
       at and the list below is the interface. It was silent: a map-shaped
       picture with a grab cursor and a zoom stepper that answered nothing. */
    overview: "Оглядова мапа. Оберіть подію нижче — або відкрийте на весь екран.",
    openFull: "На весь екран",
    closeFull: "Вийти з повного екрана",
    reads: "Опрацьовані рішення",
    /* «11 проваджень» over three links left the reader unable to tell whether
       the other eight exist. The court cards answer this with «ЯКІ САМЕ»; the
       site cards had nothing. Not pluralised: the nouns differ per site —
       проваджень, рішення, арбітражів, ордерів — and the count line above
       already carries the right one. */
    writtenOf: "Опрацьовано {n} з {total}",
    /* The rest of a seat's caseload, in the registry, instead of printed into
       a 300px card. The Hague's ran to 3011px of scroll against a 753px
       window before this. */
    allInRegistry: "Усі {n} у реєстрі →",
    pending: "Конспект у підготовці",
    /* The registry's own wording for this field, not a new one: the sign in
       the source says which way the money ran, so what a tag can honestly
       print is the magnitude, called the sum in dispute. */
    amountLabel: "Сума у спорі",
    legendWhat: "Місця подій",
    /* The name on the control that folds the key away — see `legendOpen` in
       EventsMap. A legend is read once and then remembered; after that it is a
       column of things the reader already knows, where the map could be. */
    legendTitle: "Легенда",
    placesTitle: "Місця подій",
    legendHow: "Суди й звʼязки",
    legendLine: "Звʼязок суду з подією",
    /* The chevron and the tail on a seat the frame cannot hold. Rendered only
       where some seat is actually off the projection's window — today
       Montreal, and by data rather than by name. It was planned when the
       dock was built and never written: the type carried the comment with no
       field under it, so the one genuinely unfamiliar glyph on the drawing
       was the one thing the legend did not explain. */
    legendOffMap: "Суд поза кадром",
    legendRegions: "Межі областей",
    /* The ground a mark speaks for, where a point is not the whole truth
       about it — the ICC's situation is the whole country, not Mariupol.
       Rendered only where some site actually declares one. */
    legendArea: "Подія — про всю підсвічену територію",
    /* The map's whole mechanic, and it was nowhere in the legend: a reader
       had to guess that the marks answer at all. */
    legendPick: "Натисніть на подію або суд — засвітиться шлях між ними.",
    pageTitle: "Мапа порушень і судів",
    pageLede: "Порушення сталися в Україні, а судять їх за тисячі кілометрів звідти. Мапа тримає обидва кінці разом: місце події — і суд, який його розглядає.",
    backHome: "На головну",
  },
  registry: {
    /* The band on the home page previews the collection, so it is labelled
       with the collection's one name — the same name the page, the nav item
       and the footer link carry. The key stays `registry.*`; the words the
       reader sees do not. See the note at the top of this file. */
    label: "Бібліотека рішень",
    heading: "Кожне провадження проти Росії — в одній бібліотеці",
    description:
      "Тут уже світло. Бібліотека поповнюється поступово: спершу справу вносимо, потім готуємо конспект, таймлайн і документи.",
    fullRegistry: "Уся бібліотека",
    allCases: "Усі {count} {cases} {court} →",
    /* Ukrainian counts in three forms: 1 справа, 2–4 справи, 5+ справ. The
       string used to hardcode the third, so ITLOS and Finland read "Усі 1
       справ" on the home page. */
    caseWord: { one: "справа", few: "справи", many: "справ" },
    legendLit: "Можна прочитати: переказ, хронологія, документи",
    legendQueued: "Поки тільки картка справи — конспект пишемо",
    /* One chip used to carry «У розгляді», «Ордер» and «Рішення» side by side,
       which mixes two questions: where the proceedings stand, and what the
       forum issued. They are two tag dimensions now. Every label below is the
       wording the source `status` text uses — a case whose record fixes only
       one of the two carries only one tag. */
    /* The library names these two dimensions the way the columns and the
       filters over them do: «стан розгляду» and «тип рішення». They used to
       read «Етап» and «Що ухвалено», which agreed with nothing on the page. */
    stageName: "Стан розгляду",
    outcomeName: "Тип рішення",
    stage: {
      preliminary: "Попередній етап",
      investigation: "Розслідування",
      merits: "Розгляд по суті",
      satisfaction: "Очікує сатисфакції",
      appeal: "Оскаржується",
      remitted: "Новий розгляд",
      enforcement: "Виконання",
      suspended: "Призупинено",
      frozen: "Заморожено",
      upcoming: "До розгляду",
      concluded: "Завершено",
    },
    outcome: {
      judgment: "Рішення",
      award: "Остаточне рішення",
      verdict: "Вирок",
      liability: "Відповідальність",
      warrant: "Ордер",
      /* «Ордер» is an arrest warrant and belongs to the line above. A
         procedural act of a court or tribunal is «наказ» — the wording every
         summary on the site already uses for an ICJ order (icj-cerd-icsft,
         icj-genocide) and for an arbitral one («Процедурний наказ № 1»,
         oschadbank). This chip is what `outcome: "order"` renders, and the row
         that carries it — icj-3, ICJ GL 201 — is an ICJ docket. */
      order: "Процедурні накази",
      upheld: "Арбітраж залишено",
      settlement: "Врегульовано",
      rejected: "Відхилено",
    },
  },
  newsletter: {
    heading: "Щомісяця — ще кілька рішень насвітло",
    text: "Лист про те, які рішення ми опрацювали за місяць: що встановив суд і на що з цього можна опертися.",
    subscribe: "Отримувати листа",
    support: "Підтримати бібліотеку",
    assurance: "Тільки конспекти. Відписатися можна з будь-якого листа.",
  },
  partners: {
    label: "Партнери",
    heading: "З ким ми працюємо",
    /* The arrow used to live inside this string. It is a `.nsv-cta-arrow`
       span now, hidden from assistive technology and animated on hover — a
       screen reader was reading the glyph out as part of the label. */
    all: "Усі партнери",
    /* Shown on the partners page when the list is short, which it is: one
       external partner. It used to read «Місця для логотипів — надішліть
       файли» — a note to ourselves, addressed to the reader, on a band that
       has carried a real mark since ifa's arrived. */
    note: "Список короткий і поповнюватиметься.",
  },
  footer: {
    tagline:
      "Бібліотека рішень міжнародних судів щодо російської агресії проти України. Ми проливаємо на них світло.",
    org: "Дослідницький центр імені Луї Б. Зона",
    faculty: "Факультет права УКУ",
    colArchive: "Бібліотека",
    colCenter: "Центр",
    colContacts: "Контакти",
    linkRegistry: "Бібліотека рішень",
    linkMap: "Мапа подій",
    linkCourts: "Суди та інстанції",
    linkDocs: "Документи",
    linkAbout: "Про нас",
    linkTeam: "Команда",
    linkPartners: "Партнери",
    linkBlog: "Блог",
    email: "nasvitlo@ucu.edu.ua",
    /* Must not contradict the controller's address in content/legal.ts,
       which reads «вул. Іларіона Свєнціцького, 17, м. Львів, 79011,
       Україна». Same address, footer-length: no country line. */
    address: "вул. Іларіона Свєнціцького, 17, Львів, 79011",
    rights: "© 2026 Дослідницький центр імені Луї Б. Зона, УКУ. Матеріали — CC BY 4.0.",
    privacy: "Політика конфіденційності",
    terms: "Умови користування",
  },
};

export default uk;

/** Structural type every locale dictionary must satisfy. */
export type Dictionary = typeof uk;

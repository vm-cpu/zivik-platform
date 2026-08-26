/**
 * Ukrainian UI dictionary. This is the canonical shape; `Dictionary` is derived
 * from it and every other locale must satisfy that type (see `en.ts`).
 *
 * UI *chrome* strings live here. Domain content (courts, cases, events,
 * partners) lives in the content layer (`src/content/`) with per-locale fields.
 *
 * ── Two words, one distinction ──────────────────────────────────────────────
 * The thing had three names and the reader met all three: «Бібліотека рішень»
 * in the nav, the hero CTA and `registry.label`; «Реєстр рішень» in the page
 * title, the H1 and `footer.linkRegistry`; «Онлайн-бібліотека міжнародної
 * судової практики» in `registry.heading`. Both words are right, but not of
 * the same thing:
 *
 *   **бібліотека / the library** — the site. What насвітло *is*: the whole
 *   collection, its summaries, its method, the project behind it. It names the
 *   project (`intro.text`, `footer.tagline`, `newsletter.support`), never a
 *   page or a destination.
 *
 *   **реєстр / the registry** — the list of proceedings and nothing else, at
 *   `/registry` and previewed by the band on the home page. Anything that
 *   *points at that list* says «Реєстр рішень» / "Case registry", which is the
 *   name the page already gives itself in its `<title>` and its H1: the nav
 *   item, the hero CTA, the band's label, the footer link.
 *
 * So: you read the library; you search the registry. A link never promises one
 * and opens the other.
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
    decisions: "Реєстр рішень",
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
    ctaRegistry: "Реєстр рішень",
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
    body: "Цю справу вже внесено до реєстру, але конспекту ще немає — ми над ним працюємо. Нижче те, що вже відомо, і посилання на документ суду, якщо він у відкритому доступі.",
    forum: "Суд",
    status: "Стан",
    kind: "Галузь",
    docket: "Реєстраційний номер",
    official: "Документ суду",
    toRegistry: "До повного реєстру",
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
    fullMap: "Повна карта →",
    legendCourt: "Суд, який розглядає",
    legendLit: "Є конспект рішення",
    legendUnlit: "Ще досліджуємо",
    courtsSeat: "Суди засідають у",
    courtHears: "Розглядає справи",
    caseload: "{n} проваджень у реєстрі",
    zoomLabel: "Масштаб",
    zoomWide: "Європа",
    zoomClose: "Україна",
    zoomAtlantic: "Атлантика",
    zoomIn: "Наблизити",
    zoomOut: "Віддалити",
    wheelHint: "Ctrl або ⌘ + прокручування — масштаб",
    reads: "Опрацьовані рішення",
    pending: "Конспект у підготовці",
    legendWhat: "Місця подій",
    legendHow: "Суди й звʼязки",
    legendLine: "Пунктир — звʼязок між судом та подією",
    sizeKey: "Більше коло — більше проваджень",
    pageTitle: "Мапа порушень і судів",
    pageLede: "Порушення сталися в Україні, а судять їх за тисячі кілометрів звідти. Мапа тримає обидва кінці разом: місце події — і суд, який його розглядає.",
    backHome: "На головну",
  },
  registry: {
    /* The band on the home page previews the registry, so it is labelled with
       the registry's name — the same name the page, the nav item and the
       footer link carry. The heading used to be the first eight words of
       `intro.text` and named the library instead. */
    label: "Реєстр рішень",
    heading: "Кожне провадження проти Росії — в одному реєстрі",
    description:
      "Тут уже світло. Реєстр поповнюється поступово: спершу справу вносимо, потім готуємо конспект, таймлайн і документи.",
    fullRegistry: "Повний реєстр",
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
    /* The registry names these two dimensions the way the columns and the
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
      order: "Процедурні ордери",
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
    all: "Усі партнери →",
    note: "Місця для логотипів — надішліть файли, і ми поставимо справжні.",
  },
  footer: {
    tagline:
      "Бібліотека рішень міжнародних судів щодо російської агресії проти України. Ми проливаємо на них світло.",
    org: "Дослідницький центр імені Луї Б. Зона",
    faculty: "Факультет права УКУ",
    colArchive: "Бібліотека",
    colCenter: "Центр",
    colContacts: "Контакти",
    linkRegistry: "Реєстр рішень",
    linkMap: "Карта подій",
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

/**
 * Ukrainian UI dictionary. This is the canonical shape; `Dictionary` is derived
 * from it and every other locale must satisfy that type (see `en.ts`).
 *
 * UI *chrome* strings live here. Domain content (courts, cases, events,
 * partners) lives in the content layer (`src/content/`) with per-locale fields.
 */
const uk = {
  meta: {
    title: "насвітло — рішення міжнародних судів щодо агресії проти України",
    description:
      "Відкритий архів рішень міжнародних судів щодо російської агресії проти України: ЄСПЛ, Міжнародний суд ООН, ICC, морські арбітражі. Проєкт Факультету права УКУ.",
    ogAlt: "насвітло — архів рішень міжнародних судів",
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
    text: "Онлайн-колекція міжнародної судової практики (Міжнародний суд ООН, ЄСПЛ, МКС, Міжнародний трибунал з морського права, Постійна палата третейського суду) та практики іноземних судів, що стосується українських ініціатив для притягнення Росії до відповідальності за порушення, вчинені під час війни проти України.",
    about: "Про Бібліотеку",
  },
  about: {
    /* The home page keeps a two-paragraph summary of the collection; the full
       account — who runs it, how a summary is made, where the archive stands —
       is its own page, and this is the link between them. */
    more: "Докладніше про проєкт",
  },
  slogan: "Досліджуємо · Пояснюємо · Висвітлюємо",
  aboutRail: {
    title: "Коротко",
    scope: "Охоплення",
    scopeVal: "з 2014 року",
    proceedings: "Проваджень",
    institutions: "Інстанцій",
    audience: "Для кого",
    audienceVal: "науковці, практики, зацікавлені",
  },
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
    heading: "Де сталося — і де це судять",
    description:
      "Обстріли, депортації, захоплення активів — усе це сталося в Україні. Розглядають це в Гаазі, Страсбурзі, Гамбурзі. Пунктир зʼєднує обидва кінці.",
    fullMap: "Повна карта →",
    legendHr: "Права людини",
    legendWar: "Воєнні злочини",
    legendAsset: "Захоплення активів",
    legendCourt: "Суд, який розглядає",
    legendLit: "Є конспект рішення",
    legendUnlit: "Ще досліджуємо",
    courtsSeat: "Суди засідають у",
    courtHears: "Розглядає справи",
    caseload: "{n} проваджень у реєстрі",
    zoomLabel: "Масштаб",
    zoomWide: "Європа",
    zoomClose: "Україна",
    zoomIn: "Наблизити",
    zoomOut: "Віддалити",
    reads: "Опрацьовані рішення",
    pending: "Конспект у підготовці",
    legendWhat: "Місця подій",
    legendHow: "Суди й звʼязки",
    legendLine: "Пунктир — до суду, який розглядає",
    sizeKey: "Більше коло — більше проваджень",
    pageTitle: "Мапа порушень і судів",
    pageLede: "Порушення сталися в Україні, а судять їх за тисячі кілометрів звідти. Мапа тримає обидва кінці разом: місце події — і суд, який його розглядає.",
    backHome: "На головну",
  },
  registry: {
    label: "Бібліотека рішень",
    heading: "Онлайн-колекція міжнародної судової практики",
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
    status: {
      decided: "Рішення",
      progress: "У розгляді",
      warrant: "Ордер",
      settled: "Врегульовано",
      enforcement: "Виконання",
      frozen: "Заморожено",
      rejected: "Відхилено",
    },
  },
  newsletter: {
    heading: "Щомісяця — ще кілька рішень насвітло",
    text: "Лист про те, які рішення ми опрацювали за місяць: що встановив суд і на що з цього можна опертися.",
    subscribe: "Отримувати листа",
    support: "Підтримати колекцію",
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
      "Відкритий архів рішень міжнародних судів щодо російської агресії проти України.",
    org: "Дослідницький центр імені Луї Б. Зона",
    faculty: "Факультет права УКУ",
    colArchive: "Архів",
    colCenter: "Центр",
    colContacts: "Контакти",
    linkRegistry: "Реєстр рішень",
    linkMap: "Карта подій",
    linkCourts: "Суди та інстанції",
    linkDocs: "Документи",
    linkAbout: "Про Бібліотеку",
    linkTeam: "Команда",
    linkPartners: "Партнери",
    linkBlog: "Блог",
    email: "nasvitlo@ucu.edu.ua",
    /* Must not contradict the controller's address in content/legal.ts,
       which reads «вул. Іларіона Свєнціцького, 17, м. Львів, 79011,
       Україна». Same address, footer-length: no country line. */
    address: "вул. Іларіона Свєнціцького, 17, Львів, 79011",
    rights: "© 2026 Дослідницький центр імені Луї Б. Зона, УКУ. Матеріали — CC BY 4.0.",
    privacy: "Політика приватності",
    terms: "Умови використання",
  },
};

export default uk;

/** Structural type every locale dictionary must satisfy. */
export type Dictionary = typeof uk;

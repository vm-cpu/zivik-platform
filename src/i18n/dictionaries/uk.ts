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
    home: "Головна",
    decisions: "Рішення",
    map: "Карта",
    team: "Команда",
    partners: "Партнери",
    blog: "Блог",
  },
  brand: {
    facultyAlt: "Факультет права УКУ",
    wordmark: "насвітло",
  },
  hero: {
    eyebrow: "Проєкт Факультету права УКУ",
    lead: "Рішення міжнародних судів щодо агресії проти України — винесені на світло.",
    sub: "39 проваджень проти РФ: від Міжнародного суду ООН і ЄСПЛ до ордерів ICC і морських арбітражів.",
    ctaRegistry: "Реєстр рішень",
    ctaMap: "Карта подій",
    chainHint: "потягніть за ланцюжок",
    lampLabel: "Увімкнути або вимкнути лампу",
  },
  intro: {
    text: "Ми читаємо рішення міжнародних судів і переказуємо їх людською мовою — щоб на них можна було спертися в аргументі, статті чи позові.",
    about: "Про проєкт",
  },
  mapSection: {
    label: "Карта",
    heading: "Події та суди, які їх розглядають",
    description:
      "Обстріли, депортації та захоплення — зʼєднані пунктиром із залою, де про них ідеться.",
    fullMap: "Повна карта →",
    legendEvent: "Подія: обстріл, депортація, захоплення",
    legendCourt: "Суд, який її розглядає",
  },
  registry: {
    label: "Реєстр",
    heading: "Суди, які розглядають справи проти РФ",
    description:
      "Тут уже світло. Реєстр поповнюється поступово: спершу справу вносимо, потім готуємо конспект, таймлайн і документи.",
    fullRegistry: "Повний реєстр ({count})",
    processed: "Опрацьовано",
    of: "з",
    queuedRest: "решта — у черзі",
    onlyAnalysed: "Лише з аналізом ({count})",
    allCases: "Усі {count} справ {court} →",
    legendLit: "Опрацьоване рішення: конспект, таймлайн, документи",
    legendQueued: "У черзі: внесено, конспект у підготовці",
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
    heading: "Хочете отримувати нові конспекти?",
    text: "Лист раз на місяць: що вирішили суди й що це означає.",
    subscribe: "Підписатися",
    support: "Підтримати проєкт",
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
    org: "Центр Луї Зона",
    faculty: "Юридичний факультет УКУ",
    colArchive: "Архів",
    colCenter: "Центр",
    colContacts: "Контакти",
    linkRegistry: "Реєстр рішень",
    linkMap: "Карта подій",
    linkCourts: "Суди та інстанції",
    linkDocs: "Документи",
    linkAbout: "Про проєкт",
    linkTeam: "Команда",
    linkPartners: "Партнери",
    linkBlog: "Блог",
    email: "nasvitlo@ucu.edu.ua",
    address: "Львів, вул. Козельницька, 2а",
    rights: "© 2026 Центр Луї Зона, УКУ. Матеріали — CC BY 4.0.",
    privacy: "Політика приватності",
    terms: "Умови використання",
  },
};

export default uk;

/** Structural type every locale dictionary must satisfy. */
export type Dictionary = typeof uk;

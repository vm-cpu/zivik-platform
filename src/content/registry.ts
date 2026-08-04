import type { RegistryCase } from "./types";

/** Generic note shown for queued cases (not yet summarised). */
const queued = {
  uk: "Внесено до реєстру · конспект у підготовці",
  en: "Added to the registry · summary in preparation",
};

/**
 * The case registry. `lit` cases have a summary/timeline/documents; queued ones
 * are only recorded so far. This is the primary content the future admin edits.
 */
export const registryCases: RegistryCase[] = [
  // ── ECtHR ──────────────────────────────────────────────
  {
    id: "ecthr-ukr-nld-v-ru",
    courtId: "ecthr",
    title: {
      uk: "Україна та Нідерланди проти РФ",
      en: "Ukraine and the Netherlands v. Russia",
    },
    note: {
      uk: "Збиття MH17, порушення на сході України",
      en: "Downing of MH17, violations in eastern Ukraine",
    },
    status: "decided",
    date: "09.07.2025",
    lit: true,
  },
  {
    id: "ecthr-crimea",
    courtId: "ecthr",
    title: {
      uk: "Україна проти РФ щодо Криму",
      en: "Ukraine v. Russia re Crimea",
    },
    note: {
      uk: "Адміністративна практика в окупації",
      en: "Administrative practice under occupation",
    },
    status: "decided",
    date: "14.01.2021",
    lit: true,
  },
  {
    id: "ecthr-new-wave",
    courtId: "ecthr",
    title: {
      uk: "Україна проти РФ (нова хвиля справ)",
      en: "Ukraine v. Russia (new wave of cases)",
    },
    note: {
      uk: "Події після 24 лютого 2022 року",
      en: "Events after 24 February 2022",
    },
    status: "progress",
    date: "2022 →",
    lit: true,
  },
  {
    id: "ecthr-svyrydenko",
    courtId: "ecthr",
    title: {
      uk: "Свириденко та інші проти РФ",
      en: "Svyrydenko and Others v. Russia",
    },
    note: queued,
    status: "queued",
    date: "2023 →",
    lit: false,
  },

  // ── ICJ ────────────────────────────────────────────────
  {
    id: "icj-genocide",
    courtId: "icj",
    title: {
      uk: "Україна проти Російської Федерації",
      en: "Ukraine v. Russian Federation",
    },
    note: {
      uk: "Конвенція про запобігання геноциду: юрисдикція",
      en: "Genocide Convention: jurisdiction",
    },
    status: "decided",
    date: "02.02.2024",
    lit: true,
  },
  {
    id: "icj-cerd",
    courtId: "icj",
    title: {
      uk: "CERD і фінансування терору",
      en: "CERD and the financing of terrorism",
    },
    note: {
      uk: "Часткове задоволення позову України",
      en: "Partial admission of Ukraine's claim",
    },
    status: "decided",
    date: "31.01.2024",
    lit: true,
  },
  {
    id: "icj-provisional-measures",
    courtId: "icj",
    title: {
      uk: "Тимчасові заходи: припинити воєнні дії",
      en: "Provisional measures: cease military operations",
    },
    note: {
      uk: "Наказ, обовʼязковий до виконання",
      en: "An order binding on Russia",
    },
    status: "decided",
    date: "16.03.2022",
    lit: true,
  },
  {
    id: "icj-interventions",
    courtId: "icj",
    title: {
      uk: "Втручання третіх держав у справу про геноцид",
      en: "Third-state interventions in the genocide case",
    },
    note: queued,
    status: "queued",
    date: "2022 →",
    lit: false,
  },

  // ── ICC ────────────────────────────────────────────────
  {
    id: "icc-energy-strikes",
    courtId: "icc",
    title: {
      uk: "Удари по енергетичній інфраструктурі",
      en: "Strikes on energy infrastructure",
    },
    note: {
      uk: "Ордери на арешт: Кобилаш, Соколов",
      en: "Arrest warrants: Kobylash, Sokolov",
    },
    status: "warrant",
    date: "05.03.2024",
    lit: true,
  },
  {
    id: "icc-children",
    courtId: "icc",
    title: {
      uk: "Ордери на арешт: депортація дітей",
      en: "Arrest warrants: deportation of children",
    },
    note: {
      uk: "Незаконне переміщення дітей з окупованих територій",
      en: "Unlawful transfer of children from occupied territories",
    },
    status: "warrant",
    date: "17.03.2023",
    lit: true,
  },
  {
    id: "icc-black-sea-fleet",
    courtId: "icc",
    title: {
      uk: "Ордери щодо командувачів Чорноморського флоту",
      en: "Warrants against Black Sea Fleet commanders",
    },
    note: queued,
    status: "queued",
    date: "2024 →",
    lit: false,
  },

  // ── PCA ────────────────────────────────────────────────
  {
    id: "pca-coastal-rights",
    courtId: "pca",
    title: {
      uk: "Права прибережної держави в Чорному морі",
      en: "Coastal state rights in the Black Sea",
    },
    note: queued,
    status: "queued",
    date: "21.02.2020",
    lit: false,
  },
  {
    id: "pca-crimea-assets",
    courtId: "pca",
    title: {
      uk: "Арбітраж щодо активів у Криму",
      en: "Arbitration over assets in Crimea",
    },
    note: queued,
    status: "queued",
    date: "2019 →",
    lit: false,
  },

  // ── ITLOS ──────────────────────────────────────────────
  {
    id: "itlos-sailors",
    courtId: "itlos",
    title: {
      uk: "Затримання українських моряків",
      en: "Detention of Ukrainian sailors",
    },
    note: queued,
    status: "queued",
    date: "14.09.2022",
    lit: false,
  },
  {
    id: "itlos-azov-navigation",
    courtId: "itlos",
    title: {
      uk: "Свобода судноплавства в Азовському морі",
      en: "Freedom of navigation in the Sea of Azov",
    },
    note: queued,
    status: "queued",
    date: "2023 →",
    lit: false,
  },
];

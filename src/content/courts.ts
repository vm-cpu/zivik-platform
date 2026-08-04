import type { Court } from "./types";

/** Courts / instances hearing cases against Russia (registry accordion groups). */
export const courts: Court[] = [
  {
    id: "ecthr",
    abbr: { uk: "ЄСПЛ", en: "ECtHR" },
    name: {
      uk: "Європейський суд з прав людини",
      en: "European Court of Human Rights",
    },
    seat: { uk: "Страсбург", en: "Strasbourg" },
    total: 12,
    analysed: 3,
    order: 1,
  },
  {
    id: "icj",
    abbr: { uk: "ICJ", en: "ICJ" },
    name: {
      uk: "Міжнародний суд ООН",
      en: "International Court of Justice",
    },
    seat: { uk: "Гаага", en: "The Hague" },
    total: 4,
    analysed: 3,
    order: 2,
  },
  {
    id: "icc",
    abbr: { uk: "ICC", en: "ICC" },
    name: {
      uk: "Міжнародний кримінальний суд",
      en: "International Criminal Court",
    },
    seat: { uk: "Гаага", en: "The Hague" },
    total: 7,
    analysed: 2,
    order: 3,
  },
  {
    id: "pca",
    abbr: { uk: "PCA", en: "PCA" },
    name: {
      uk: "Постійна палата арбітражу",
      en: "Permanent Court of Arbitration",
    },
    seat: { uk: "Гаага", en: "The Hague" },
    total: 9,
    analysed: 0,
    order: 4,
  },
  {
    id: "itlos",
    abbr: { uk: "ITLOS", en: "ITLOS" },
    name: {
      uk: "Трибунал з морського права",
      en: "Tribunal for the Law of the Sea",
    },
    seat: { uk: "Гамбург", en: "Hamburg" },
    total: 3,
    analysed: 0,
    order: 5,
  },
];

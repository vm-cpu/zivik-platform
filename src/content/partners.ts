import type { Partner } from "./types";

/**
 * Real partner organisations only (no placeholder boxes). Add entries — with a
 * `logo` under `/public/logos/partners/` once files arrive — as partnerships
 * are confirmed.
 */
export const partners: Partner[] = [
  {
    id: "uku",
    name: { uk: "Український католицький університет", en: "Ukrainian Catholic University" },
    url: "https://ucu.edu.ua",
  },
  {
    id: "law-faculty",
    name: { uk: "Факультет права УКУ", en: "UCU Faculty of Law" },
    url: "https://law.ucu.edu.ua",
  },
  {
    id: "louis-sohn",
    name: { uk: "Центр Луї Зона", en: "Louis Sohn Center" },
  },
];

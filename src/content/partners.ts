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
    name: { uk: "Дослідницький центр імені Луї Б. Зона", en: "Louis B. Sohn Research Centre" },
  },
  {
    /* The logo file is not in the repo yet. ifa supplies its own mark and a
       prescribed wording for the funding line — both must come from them
       rather than be redrawn or paraphrased here. Drop the file at
       /public/logos/partners/ifa.svg and add `logo` below; until then the row
       renders the name, which is what the other three entries do. */
    id: "ifa",
    name: {
      uk: "Інститут зовнішніх зв’язків (ifa)",
      en: "Institut für Auslandsbeziehungen (ifa)",
    },
    url: "https://www.ifa.de",
  },
];

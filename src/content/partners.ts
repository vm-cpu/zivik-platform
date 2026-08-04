import type { Partner } from "./types";

/**
 * Partner organisations. Real logos go under `/public/logos/partners/`; entries
 * without a `logo` render as a text placeholder until files arrive.
 */
export const partners: Partner[] = [
  {
    id: "uku",
    name: { uk: "УКУ", en: "UCU" },
    url: "https://ucu.edu.ua",
  },
  {
    id: "louis-sohn",
    name: { uk: "Центр Луї Зона", en: "Louis Sohn Center" },
  },
  { id: "partner-3", name: { uk: "Логотип партнера", en: "Partner logo" } },
  { id: "partner-4", name: { uk: "Логотип партнера", en: "Partner logo" } },
  { id: "partner-5", name: { uk: "Логотип партнера", en: "Partner logo" } },
];

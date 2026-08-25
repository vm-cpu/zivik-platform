import type { Localized } from "./types";

/**
 * The people behind the archive.
 *
 * Roles are given in Ukrainian as the project uses them and in the English of
 * the grant structure the project is staffed under, which is where "Component
 * Lead" and "Research Assistant" come from — those are the titles that appear
 * in the paperwork, so they stay verbatim rather than being re-translated.
 */
export interface TeamMember {
  name: Localized;
  role: Localized;
  /**
   * Portrait, as a path under `/public/team/` — e.g. "/team/denkovych.jpg".
   *
   * Optional on purpose. Photographs arrive one at a time, and a row of
   * placeholder silhouettes next to two real faces looks worse than no faces
   * at all; a member without this field simply renders without a portrait,
   * and the list stays even. Square source, 400×400 or larger.
   */
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: { uk: "Ольга Денькович", en: "Olha Denkovych" },
    role: { uk: "Координаторка проєкту", en: "Project Coordinator" },
  },
  {
    name: { uk: "Тарас Лешкович", en: "Taras Leshkovych" },
    role: { uk: "Старший дослідник", en: "Component Lead" },
  },
  {
    name: { uk: "Марта Яциніна", en: "Marta Yatsynina" },
    role: { uk: "Старша дослідниця", en: "Component Lead" },
  },
  {
    name: { uk: "Марія Грицишин", en: "Mariia Hrytsyshyn" },
    role: { uk: "Асистентка дослідника", en: "Research Assistant" },
  },
  {
    name: { uk: "Ірина Пантелеймонюк", en: "Iryna Panteleimoniuk" },
    role: { uk: "Асистентка дослідника", en: "Research Assistant" },
  },
  {
    name: { uk: "Віола Мартинюк", en: "Viola Martyniuk" },
    role: { uk: "Технічна експертка", en: "Technical Expert" },
  },
  {
    name: { uk: "Андрій Удовиченко", en: "Andrii Udovychenko" },
    role: { uk: "Технічний експерт", en: "Technical Expert" },
  },
];

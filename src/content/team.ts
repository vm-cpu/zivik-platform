import type { TeamMember } from "./types";

/**
 * Project team. Ukrainian job titles are the ones agreed for the UA site; the
 * English column keeps the original project-role wording.
 */
export const team: TeamMember[] = [
  {
    id: "olha-denkovych",
    name: { uk: "Ольга Денькович", en: "Olha Denkovych" },
    role: { uk: "Координаторка проєкту", en: "Project Coordinator" },
    order: 1,
  },
  {
    id: "taras-leshkovych",
    name: { uk: "Тарас Лешкович", en: "Taras Leshkovych" },
    role: { uk: "Старший дослідник", en: "Component Lead" },
    order: 2,
  },
  {
    id: "marta-yatsynina",
    name: { uk: "Марта Яциніна", en: "Marta Yatsynina" },
    role: { uk: "Старша дослідниця", en: "Component Lead" },
    order: 3,
  },
  {
    id: "mariia-hrytsyshyn",
    name: { uk: "Марія Грицишин", en: "Mariia Hrytsyshyn" },
    role: { uk: "Асистентка дослідника", en: "Research Assistant" },
    order: 4,
  },
  {
    id: "iryna-panteleimoniuk",
    name: { uk: "Ірина Пантелеймонюк", en: "Iryna Panteleimoniuk" },
    role: { uk: "Асистентка дослідника", en: "Research Assistant" },
    order: 5,
  },
  {
    id: "viola-martyniuk",
    name: { uk: "Віола Мартинюк", en: "Viola Martyniuk" },
    role: { uk: "Технічна експертка", en: "Technical Expert" },
    order: 6,
  },
  {
    id: "andrii-udovychenko",
    name: { uk: "Андрій Удовиченко", en: "Andrii Udovychenko" },
    role: { uk: "Технічний експерт", en: "Technical Expert" },
    order: 7,
  },
];

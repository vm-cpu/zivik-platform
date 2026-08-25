import type { Partner } from "./types";

/**
 * Partners — organisations the project works *with*.
 *
 * The university, its Faculty of Law and the Louis B. Sohn Research Centre
 * were listed here and have been removed: they run the archive, they are not
 * partners of it. They are named where they belong — in the footer, on the
 * about page and as the controller in the legal pages — and listing them
 * alongside a genuine external partner both padded the row and misdescribed
 * everyone in it.
 *
 * Add entries — with a `logo` under `/public/logos/partners/`, supplied by the
 * partner — as partnerships are confirmed.
 */
export const partners: Partner[] = [
  {
    /* Mark supplied by ifa. Their prescribed wording for the funding line
       still has to come from them — it is not something to paraphrase. */
    id: "ifa",
    name: {
      uk: "Інститут зовнішніх зв’язків (ifa)",
      en: "Institut für Auslandsbeziehungen (ifa)",
    },
    url: "https://www.ifa.de",
    logo: "/logos/partners/ifa.png",
  },
];

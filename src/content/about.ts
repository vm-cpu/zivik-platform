import type { AboutContent } from "./types";

/**
 * The library's own description, verbatim (bilingual) from the source
 * materials. Full name: The Library of Accountability and Justice for Ukraine
 * 'NaSvitlo'.
 *
 * This renders on BOTH the home page's about band and /about, so anything
 * added here appears twice. The scope statement — which courts' practice the
 * library covers — deliberately lives in the about page's own prose instead:
 * it was the home page's intro band and the user asked for it off the home
 * page entirely.
 */
export const about: AboutContent = {
  title: {
    uk: "Що це за бібліотека",
    en: "What this library is",
  },
  paragraphs: {
    uk: [
      "Бібліотека відповідальності та правосуддя для України «НаСвітло» — це онлайн-бібліотека міжнародної судової практики, що стосується низки українських ініціатив для притягнення Росії до відповідальності за агресивну війну проти України. Протиправний характер дій Росії був визнаний Генеральною Асамблеєю ООН ще в березні 2014 року в резолюції, яка наголошувала на незаконності «референдуму» в Криму та закликала всі держави, міжнародні організації і спеціалізовані установи не визнавати жодних змін його статусу.",
      "Упродовж наступних років Україна розпочала численні судові провадження в міжнародних судах та трибуналах з метою захисту від російської агресії. Бібліотека «НаСвітло» має на меті зібрати в одному місці всю відповідну судову практику та аналітичні матеріали, що стосуються цих проваджень, і розрахована на науковців, практиків та всіх, хто цікавиться цією темою.",
    ],
    en: [
      "The Library of Accountability and Justice for Ukraine ‘NaSvitlo’ is an online library of international case-law concerning the various initiatives launched by Ukraine to hold Russia accountable for its war of aggression. The unlawful character of Russia’s actions was recognized by the UN General Assembly as early as March 2014, in a resolution underscoring the illegality of the ‘referendum’ in Crimea and calling upon all States, international organizations, and specialized agencies not to recognize any alteration of its status.",
      "Over the following years, Ukraine instituted numerous legal proceedings before multiple international courts and tribunals to defend itself against Russian aggression. The Library NaSvitlo aims to bring together all relevant jurisprudence and analytical materials arising from these proceedings, and is designed for scholars, practitioners, and all those with an interest in the subject.",
    ],
  },
};

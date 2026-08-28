import type { AboutContent, AboutLink } from "./types";
import { locales } from "@/i18n/config";

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
 *
 * ── Two owner's corrections, March 2026 ─────────────────────────────────────
 * 1. It said the library covers «низки українських ініціатив» / "the various
 *    initiatives launched by Ukraine". Not every proceeding here was brought
 *    by Ukraine: the Netherlands brought the fourth of the inter-State
 *    applications behind *Ukraine and the Netherlands v Russia* over MH17, and
 *    Finland tried Torden under universal jurisdiction on its own motion. The
 *    sentence names both origins now.
 * 2. The resolution was identified only by its month. It is General Assembly
 *    resolution 68/262 «Територіальна цілісність України» of 27 March 2014,
 *    and it is named in full and linked — this archive's whole method is that
 *    a reader can check a statement against the document behind it.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const about: AboutContent = {
  title: {
    uk: "Про проєкт",
    en: "About the project",
  },
  paragraphs: {
    uk: [
      "Бібліотека відповідальності та правосуддя для України «НаСвітло» — це онлайн-бібліотека міжнародної судової практики у справах, які порушили Україна та іноземні держави, щоб притягнути Росію до відповідальності за війну проти України. Протиправний характер дій Росії був визнаний ще у 2014 році: схвалена Генеральною Асамблеєю ООН 27 березня 2014 року резолюція «Територіальна цілісність України» наголошувала на незаконності «референдуму» в Криму та закликала всі держави, міжнародні організації і спеціалізовані установи не визнавати жодних змін його статусу.",
      "Упродовж наступних років Україна розпочала численні судові провадження в міжнародних судах та трибуналах у відповідь на війну Росії проти України. Бібліотека «НаСвітло» має на меті зібрати в одному місці всю відповідну судову практику та аналітичні матеріали, що стосуються цих проваджень, і розрахована на науковців, практиків та всіх, хто цікавиться цією темою.",
    ],
    en: [
      "The Library of Accountability and Justice for Ukraine ‘NaSvitlo’ is an online library of international case-law in the proceedings brought by Ukraine and by foreign States to hold Russia accountable for its war against Ukraine. The unlawful character of Russia’s actions was recognized as early as 2014: the resolution ‘Territorial integrity of Ukraine’, adopted by the UN General Assembly on 27 March 2014, underscored the illegality of the ‘referendum’ in Crimea and called upon all States, international organizations, and specialized agencies not to recognize any alteration of its status.",
      "Over the following years, Ukraine instituted numerous legal proceedings before multiple international courts and tribunals in response to Russia’s war against Ukraine. The Library NaSvitlo aims to bring together all relevant jurisprudence and analytical materials arising from these proceedings, and is designed for scholars, practitioners, and all those with an interest in the subject.",
    ],
  },
  /* A/RES/68/262, in the UN Digital Library — not a PDF on a mirror, and not
     the docs.un.org symbol permalink either. That one resolves, but it opens a
     JavaScript document viewer that renders nothing a reader can confirm the
     document by; this record page is titled with the resolution's own name,
     carries the date and the vote, and links the text in all six official
     languages. */
  links: {
    uk: [
      {
        text: "резолюція «Територіальна цілісність України»",
        href: "https://digitallibrary.un.org/record/767565",
      },
    ],
    en: [
      {
        text: "resolution ‘Territorial integrity of Ukraine’",
        href: "https://digitallibrary.un.org/record/767565",
      },
    ],
  },
};

/**
 * A link whose `text` is not in the prose renders as nothing at all — the
 * paragraph reads correctly and the citation silently disappears, which is the
 * one failure this file cannot afford. Editing the sentence and forgetting the
 * link table now fails the build instead.
 */
function checkAbout(content: AboutContent): void {
  if (!content.links) return;
  for (const locale of locales) {
    const prose = content.paragraphs[locale].join("\n");
    for (const link of content.links[locale]) {
      if (!prose.includes(link.text)) {
        throw new Error(
          `content/about.ts: ${locale} link text "${link.text}" is not in the ${locale} paragraphs`,
        );
      }
    }
  }
}

checkAbout(about);

export type { AboutLink };

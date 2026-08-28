import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  alternateOpenGraphLocales,
  isLocale,
  locales,
  localeOpenGraph,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContentRepository } from "@/content/repository";
import { pick } from "@/content/types";
import {
  siteUrl,
  pathAlternates,
  ogImage,
  defaultOgImage,
} from "@/lib/seo";
import "./partners.css";

/**
 * Partners — a page of its own.
 *
 * It used to be a band on the home page and the same band again inside
 * /about, with the header's «Партнери» item pointing at `/about#partners`.
 * That fragment is a real destination only from the about page; from anywhere
 * else the reader landed at the top of /about. It is a route now, and the nav
 * item, the footer link and the home band's button all point at it.
 *
 * The page is short because the record is short. `content/partners.ts` holds
 * exactly one external partner, and the university, its Faculty of Law and the
 * Louis B. Sohn Research Centre were deliberately removed from that list —
 * they run the library rather than partner with it. Nothing here describes
 * what any partner does for the project, because nothing in the repository
 * says. In particular ifa's funding statement is prescribed wording that has
 * to come from ifa; it is not something to paraphrase, so it is absent rather
 * than approximated.
 */
const T = {
  back: { uk: "На головну", en: "Home" },
  title: { uk: "Партнери", en: "Partners" },
  /* The lede says what the page lists. Who runs the library is a heading of
     its own further down, and the lede used to carry that sentence too — the
     same twenty-two words twice on a page of fifty-two, which is a third of
     everything it says. */
  lede: {
    uk: "Організації, з якими працює «НаСвітло».",
    en: "The organisations NaSvitlo works with.",
  },
  /* 71 / 96 characters — both inside the ~160 a search result shows. The
     description promised «і хто її веде» after the section that answered it
     was taken off the page; a search result is not the place to advertise
     something the page no longer says. */
  metaDesc: {
    uk: "Організації, з якими працює бібліотека рішень «НаСвітло».",
    en: "The organisations the NaSvitlo library of decisions works with.",
  },
  site: { uk: "Сайт організації", en: "The organisation’s site" },
  writeH: { uk: "Написати нам", en: "Write to us" },
  write: {
    uk: "Хочете співпрацювати з бібліотекою — напишіть.",
    en: "If you would like to work with the library, write to us.",
  },
  writeCta: { uk: "Написати нам", en: "Write to us" },
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const path = `/${locale}/partners`;
  const title = pick(T.title, locale);
  const description = pick(T.metaDesc, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: pathAlternates((l) => `/${l}/partners`),
    },
    openGraph: {
      type: "website",
      // Open Graph wants language_TERRITORY; a bare "uk" is ignored.
      locale: localeOpenGraph[locale],
      alternateLocale: alternateOpenGraphLocales(locale),
      url: path,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [ogImage(defaultOgImage, dict.meta.ogAlt)],
    },
    // A page that sets openGraph and no twitter inherits the layout's card —
    // it would otherwise share as the home page.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const dict = await getDictionary(locale);
  const repo = getContentRepository();
  const partners = await repo.getPartners();
  const L = <V,>(x: Record<Locale, V>) => pick(x, locale);

  return (
    <div className="page partnerspage">
      <main id="content" tabIndex={-1} className="prt-wrap">
        <header className="prt-mast">
          <Link href={`/${locale}`} className="prt-back">
            ← {L(T.back)}
          </Link>
          <h1>{L(T.title)}</h1>
          <p className="prt-lede">{L(T.lede)}</p>
        </header>

        {/* One card per partner, whatever the content layer holds. A single
            entry gets a card rather than a bare mark on a rule: a lone logo
            in a row reads as a placeholder for the row that never arrived. */}
        <ul className="prt-list">
          {partners.map((partner) => {
            const name = pick(partner.name, locale);
            return (
              <li key={partner.id} className="prt-card">
                {partner.logo && (
                  <span className="prt-mark">
                    <Image
                      src={partner.logo}
                      alt={name}
                      width={260}
                      height={74}
                      sizes="(max-width: 560px) 70vw, 260px"
                    />
                  </span>
                )}
                <span className="prt-name">{name}</span>
                {partner.url && (
                  <a
                    className="prt-site"
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {L(T.site)} ↗
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* The «Хто веде бібліотеку» section is gone. It was one heading over
            one sentence naming the Centre — which the footer names under the
            wordmark on this page and every other, so the section restated the
            page's own furniture in a bigger type size. */}

        <section className="prt-sec">
          <h2>{L(T.writeH)}</h2>
          <p className="prt-prose">{L(T.write)}</p>
          <p className="prt-action">
            <a className="nsv-cta" href={`mailto:${dict.footer.email}`}>
              {L(T.writeCta)}
              <span className="nsv-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}

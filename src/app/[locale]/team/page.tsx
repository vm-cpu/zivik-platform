import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import { siteUrl, pathAlternates } from "@/lib/seo";
import { team } from "@/content/team";
import "./team.css";

const T = {
  back: { uk: "На головну", en: "Home" },
  title: { uk: "Команда", en: "Team" },
  lede: {
    uk: "Проєкт веде Дослідницький центр імені Луї Б. Зона Факультету права УКУ.",
    en: "The project is run by the Louis B. Sohn Research Centre at the UCU Faculty of Law.",
  },
  contact: { uk: "Написати нам", en: "Write to us" },
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
  const title = pick(T.title, locale);
  const description = pick(T.lede, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}/team`,
      languages: pathAlternates((l) => `/${l}/team`),
    },
    openGraph: {
      type: "website",
      locale,
      url: `/${locale}/team`,
      siteName: dict.brand.wordmark,
      title,
      description,
      images: [{ url: "/og/nasvitlo.png", alt: dict.meta.ogAlt }],
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const L = (x: { uk: string; en: string }) => pick(x, locale as Locale);

  return (
    <div className="page teampage">

      <main id="content" className="team-wrap">
        <header className="team-mast">
          <Link href={`/${locale}`} className="team-back">
            ← {L(T.back)}
          </Link>
          <h1>{L(T.title)}</h1>
          <p className="team-lede">{L(T.lede)}</p>
        </header>

        <ul className="team-list">
          {team.map((m) => (
            <li key={m.name.en}>
              <span className="team-name">{L(m.name)}</span>
              <span className="team-role">{L(m.role)}</span>
            </li>
          ))}
        </ul>

        <p className="team-contact">
          <a href={`mailto:${dict.footer.email}`}>{L(T.contact)} →</a>
        </p>
      </main>
    </div>
  );
}

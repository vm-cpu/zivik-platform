import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  isLocale,
  locales,
  defaultLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContentRepository } from "@/content/repository";
import { pick } from "@/content/types";
import { siteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/days";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
import "./blog.css";

const T = {
  title: { uk: "Блог", en: "Blog" },
  lede: {
    uk: "Коментарі команди до рішень міжнародних судів, пояснення процедур і новини проваджень, у яких Україна домагається відповідальності Росії.",
    en: "The team's commentary on international court decisions, explanations of procedure, and news from the proceedings in which Ukraine seeks Russia's accountability.",
  },
  back: { uk: "← На головну", en: "← Back home" },
  emptyHead: {
    uk: "Перші публікації готуються",
    en: "The first posts are in preparation",
  },
  emptyBody: {
    uk: "Поки блог порожній. Тим часом загляньте до бібліотеки рішень — там уже є опрацьовані справи з конспектами й документами.",
    en: "The blog is empty for now. In the meantime, browse the library of decisions — analysed cases with summaries and documents are already there.",
  },
  emptyCta: { uk: "До бібліотеки рішень →", en: "To the library of decisions →" },
  readMore: { uk: "Читати →", en: "Read →" },
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
  const path = `/${locale}/blog`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/blog`;
  languages["x-default"] = `/${defaultLocale}/blog`;
  return {
    metadataBase: new URL(siteUrl),
    title: pick(T.title, locale),
    description: pick(T.lede, locale),
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      locale,
      url: path,
      title: pick(T.title, locale),
      description: pick(T.lede, locale),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const dict = await getDictionary(locale);
  const posts = await getContentRepository().getPosts();

  return (
    <div className="page blogpage">
      <Header locale={locale} dict={dict} />

      <main className="blog-wrap">
        <header className="blog-mast">
          <Link href={`/${locale}`} className="blog-back">
            {pick(T.back, locale)}
          </Link>
          <h1>{pick(T.title, locale)}</h1>
          <p className="blog-lede">{pick(T.lede, locale)}</p>
        </header>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <h2>{pick(T.emptyHead, locale)}</h2>
            <p>{pick(T.emptyBody, locale)}</p>
            <Link href={`/${locale}/registry`} className="blog-empty-cta">
              {pick(T.emptyCta, locale)}
            </Link>
          </div>
        ) : (
          <ul className="blog-list">
            {posts.map((post) => (
              <li key={post.id}>
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                <h2>
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    {pick(post.title, locale)}
                  </Link>
                </h2>
                {post.kicker ? (
                  <span className="blog-kicker">{pick(post.kicker, locale)}</span>
                ) : null}
                <p>{pick(post.excerpt, locale)}</p>
                <Link href={`/${locale}/blog/${post.slug}`} className="blog-more">
                  {pick(T.readMore, locale)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}

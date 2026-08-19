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
import "../blog.css";

const T = {
  back: { uk: "← Усі публікації", en: "← All posts" },
} as const;

export async function generateStaticParams() {
  const posts = await getContentRepository().getPosts();
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getContentRepository().getPost(slug);
  if (!post) return {};

  const path = `/${locale}/blog/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/blog/${slug}`;
  languages["x-default"] = `/${defaultLocale}/blog/${slug}`;
  const title = pick(post.title, locale);
  const description = pick(post.excerpt, locale);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "article",
      locale,
      url: path,
      title,
      description,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const post = await getContentRepository().getPost(slug);
  if (!post) notFound();
  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: pick(post.title, locale),
    description: pick(post.excerpt, locale),
    datePublished: post.date,
    inLanguage: locale,
    url: `${siteUrl}/${locale}/blog/${slug}`,
    publisher: { "@type": "Organization", name: dict.footer.org },
  };

  return (
    <div className="page blogpage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={locale} dict={dict} />

      <main className="blog-wrap">
        <header className="post-mast">
          <Link href={`/${locale}/blog`} className="blog-back">
            {pick(T.back, locale)}
          </Link>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <h1>{pick(post.title, locale)}</h1>
          {post.author ? (
            <div className="post-byline">{pick(post.author, locale)}</div>
          ) : null}
        </header>

        <article className="post-body">
          {pick(post.body, locale).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}

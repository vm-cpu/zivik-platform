import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeHtmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { homeMetadata } from "@/lib/seo";
import HtmlLang from "@/components/nasvitlo/HtmlLang";
import Header from "@/components/nasvitlo/Header";
import Footer from "@/components/nasvitlo/Footer";
// Only cross-surface primitives load for every page. home.css is the home
// page's own stylesheet and is imported there — loading it here put 399
// unscoped rules on the registry and decision pages too.
import "./shared.css";

type Params = { params: Promise<{ locale: string }> };

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return homeMetadata(locale, dict);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <HtmlLang lang={localeHtmlLang[locale]} />
      {/* Brand faces come from next/font in the root layout — self-hosted and
          preloaded, so there is no mid-render swap to fetch them. */}
      {/* One header and one footer for the whole locale. Every page used to
          render its own pair, which is how the site ended up with three
          different header grounds and a decision-page skip link that pointed
          somewhere different from every other page. */}
      <div className="nsv-root">
        <Header locale={locale} dict={dict} />
        {children}
        <Footer dict={dict} locale={locale} />
      </div>
    </>
  );
}

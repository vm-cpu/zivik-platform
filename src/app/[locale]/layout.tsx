import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeHtmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { homeMetadata } from "@/lib/seo";
import HtmlLang from "@/components/nasvitlo/HtmlLang";
import "./home.css";

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

  return (
    <>
      <HtmlLang lang={localeHtmlLang[locale]} />
      {/* Brand faces come from next/font in the root layout — self-hosted and
          preloaded, so there is no mid-render swap to fetch them. */}
      <div className="nsv-root">{children}</div>
    </>
  );
}

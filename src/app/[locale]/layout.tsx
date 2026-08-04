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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <div className="nsv-root">{children}</div>
    </>
  );
}

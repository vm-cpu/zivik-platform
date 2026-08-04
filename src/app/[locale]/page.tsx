import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContentRepository, getRegistryByCourt } from "@/content/repository";
import { siteUrl } from "@/lib/seo";
import LampShell from "@/components/nasvitlo/LampShell";
import Header from "@/components/nasvitlo/Header";
import Hero from "@/components/nasvitlo/Hero";
import Intro from "@/components/nasvitlo/Intro";
import MapSection from "@/components/nasvitlo/MapSection";
import Registry from "@/components/nasvitlo/Registry";
import Newsletter from "@/components/nasvitlo/Newsletter";
import Partners from "@/components/nasvitlo/Partners";
import Footer from "@/components/nasvitlo/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repo = getContentRepository();
  const [courts, stats, partners, casesByCourt] = await Promise.all([
    repo.getCourts(),
    repo.getStats(),
    repo.getPartners(),
    getRegistryByCourt(repo),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.brand.wordmark,
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    description: dict.meta.description,
    publisher: {
      "@type": "Organization",
      name: dict.footer.org,
      url: siteUrl,
    },
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LampShell>
        <Header locale={locale} dict={dict} />
        <Hero dict={dict} />
        <Intro locale={locale} dict={dict} stats={stats} />
        <MapSection dict={dict} />
        <Registry
          locale={locale}
          dict={dict}
          courts={courts}
          casesByCourt={casesByCourt}
        />
        <Newsletter dict={dict} />
        <Partners locale={locale} dict={dict} partners={partners} />
        <Footer dict={dict} />
      </LampShell>
    </div>
  );
}

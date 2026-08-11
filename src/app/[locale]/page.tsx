import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getCasesByInstitution,
  getContentRepository,
} from "@/content/repository";
import { siteUrl } from "@/lib/seo";
import "./home.css";
import LampShell from "@/components/nasvitlo/LampShell";
import Header from "@/components/nasvitlo/Header";
import Hero from "@/components/nasvitlo/Hero";
import Intro from "@/components/nasvitlo/Intro";
import About from "@/components/nasvitlo/About";
import Slogan from "@/components/nasvitlo/Slogan";
import MapSection from "@/components/nasvitlo/MapSection";
import Quote from "@/components/nasvitlo/Quote";
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
  const [institutions, stats, partners, cases, casesByInstitution, about] =
    await Promise.all([
      repo.getInstitutions(),
      repo.getStats(),
      repo.getPartners(),
      repo.getCases(),
      getCasesByInstitution(repo),
      repo.getAbout(),
    ]);
  const phase1 = institutions.filter((i) => i.phase1);
  const totalCases = cases.length;
  const analysedCases = cases.filter((c) => c.lit).length;

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
        <About
          locale={locale}
          dict={dict}
          about={about}
          totalCases={totalCases}
          institutionCount={institutions.length}
        />
        <Slogan dict={dict} />
        <MapSection dict={dict} />
        <Quote dict={dict} />
        <Registry
          locale={locale}
          dict={dict}
          institutions={phase1}
          casesByInstitution={casesByInstitution}
          totalCases={totalCases}
          analysedCases={analysedCases}
        />
        <Newsletter dict={dict} />
        <Partners locale={locale} dict={dict} partners={partners} />
        <Footer dict={dict} />
      </LampShell>
    </div>
  );
}

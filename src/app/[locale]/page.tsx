import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getCasesByInstitution,
  getContentRepository,
} from "@/content/repository";
import { jsonLdHtml, siteUrl } from "@/lib/seo";
import "./home.css";
import LampShell from "@/components/nasvitlo/LampShell";
import Hero from "@/components/nasvitlo/Hero";
import Intro from "@/components/nasvitlo/Intro";
import About from "@/components/nasvitlo/About";
import Slogan from "@/components/nasvitlo/Slogan";
import MapSection from "@/components/nasvitlo/MapSection";
import Quote from "@/components/nasvitlo/Quote";
import Registry from "@/components/nasvitlo/Registry";
import Newsletter from "@/components/nasvitlo/Newsletter";
import Partners from "@/components/nasvitlo/Partners";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repo = getContentRepository();
  const [institutions, partners, cases, casesByInstitution, about] =
    await Promise.all([
      repo.getInstitutions(),
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
        dangerouslySetInnerHTML={jsonLdHtml(jsonLd)}
      />
      {/* The one content region on the page. Without it there is no landmark
          for a screen reader to jump to. */}
      <main>
        <LampShell>
        <Hero dict={dict} />
        <Intro locale={locale} dict={dict} />
        <About
          locale={locale}
          dict={dict}
          about={about}
          totalCases={totalCases}
          institutionCount={institutions.length}
        />
        {/* The section stays — a home page for an archive has to say what the
            archive is — but it is now a summary with somewhere to go. The full
            account, including the editorial method, lives at /{locale}/about,
            which is where the primary navigation points. This block continues
            the About band's ground rather than opening a new one; the negative
            margin pulls it back under the band's own 50px foot so the link
            sits a normal 24px below the last paragraph. */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            marginTop: -26,
            padding: "0 28px 50px",
            background: "var(--surface)",
          }}
        >
          <Link className="btn btn-o" href={`/${locale}/about`}>
            {dict.about.more}
          </Link>
        </div>
        <Slogan dict={dict} />
        <MapSection locale={locale} dict={dict} />
        <Quote dict={dict} locale={locale} />
        <Registry
          locale={locale}
          dict={dict}
          institutions={phase1}
          casesByInstitution={casesByInstitution}
          totalCases={totalCases}
          analysedCases={analysedCases}
        />
        <Newsletter dict={dict} locale={locale} />
        <Partners locale={locale} dict={dict} partners={partners} />
        </LampShell>
      </main>
    </div>
  );
}

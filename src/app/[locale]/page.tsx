import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContentRepository } from "@/content/repository";
import { jsonLdHtml, siteUrl } from "@/lib/seo";
import "./home.css";
import LampShell from "@/components/nasvitlo/LampShell";
import Hero from "@/components/nasvitlo/Hero";
import About from "@/components/nasvitlo/About";
import Slogan from "@/components/nasvitlo/Slogan";
import Quote from "@/components/nasvitlo/Quote";
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
  /* Only what the page still draws. The library band used to need the five
     phase-1 courts, their cases grouped by institution and the analysed count;
     it is gone, and so is all of that. `institutions` and `cases` stay because
     the About summary counts them. */
  const [institutions, partners, cases, about] = await Promise.all([
    repo.getInstitutions(),
    repo.getPartners(),
    repo.getCases(),
    repo.getAbout(),
  ]);
  const totalCases = cases.length;

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
        <Hero dict={dict} locale={locale} />
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
        {/* No map band here any more.

            The map is the background of the first screen now — the thing the
            lamp lights — and a second, fuller copy of it a screen later was
            the same drawing asked twice. It keeps its own page, which is where
            a reader who wants to work with it goes, and the top bar still
            points at it. */}
        {/* Partners before the quotation, which is a swap of the two.

            Owner's decision, and the page reads better for it: the quotation
            band is the site's one dark surface below the lamp, and it used to
            sit between two grounds of pale paper, so the page went light,
            dark, light and ended on a partner row that had nothing after it
            but the footer. Now the light half of the page runs unbroken — the
            summary, the slogan, the partners — and the dark begins at the
            quotation and does not stop: the Court's words run straight into
            the footer's dark, with the gold rule between them, and the page
            closes in the same colour the lamp lit at the top. */}
        <Partners locale={locale} dict={dict} partners={partners} />
        {/* The library is not a band here any more.

            It was the home page's front door — the five courts, their
            caseloads, a row of cases apiece — and the owner's note is to take
            it off. The button under the lamp now goes to /registry, which is
            the page that can sort, filter and search the same thirty-nine
            proceedings. A summary of the archive on the way to the archive was
            a stop the reader did not need. */}
        {/* The support band is gone from here.

            It was a heading, a paragraph and a «Підтримати бібліотеку» button
            in a band of their own. The owner's note is to take the text off
            and move the ask — into the footer's contacts, where it now sits
            beside the address, and to somewhere near the top of the page,
            which is still open: the lamp carries exactly one button now, and
            putting a second one back there would undo the change that put it
            there. */}
        <Quote dict={dict} locale={locale} />
        </LampShell>
      </main>
    </div>
  );
}

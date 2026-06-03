import Link from "next/link";

export const metadata = {
  title:
    "Ukraine and the Netherlands v. Russia — A Reader (App. no. 28525/20)",
};

export default function ReaderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      {/* Header */}
      <header className="px-6 lg:px-12 pt-7 pb-4 flex items-baseline justify-between border-b border-rule">
        <Link
          href="/"
          className="font-[family-name:var(--font-newsreader)] text-ink font-medium text-base"
        >
          A Reader
        </Link>
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-wider">
          APP. NO. 28525/20
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 px-6 lg:px-12 max-w-[1000px]">
        <div className="pt-16 pb-8">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-6">
            EUROPEAN COURT OF HUMAN RIGHTS · INTER-STATE PROCEEDING
          </p>
          <h1 className="font-[family-name:var(--font-newsreader)] text-[3.5rem] md:text-[4.5rem] leading-[1.05] font-normal text-ink mb-6">
            Ukraine and the Netherlands{" "}
            <em className="font-[family-name:var(--font-newsreader)] italic">
              v.
            </em>{" "}
            Russia
          </h1>
          <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-xl leading-relaxed max-w-2xl mb-10">
            On the downing of Malaysia Airlines flight MH17, 17 July 2014, and
            Russia&apos;s subsequent conduct.
          </p>
          <div className="font-[family-name:var(--font-newsreader)] text-ink text-[1.05rem] leading-[1.75] max-w-2xl mb-4">
            <p>
              A research reader on the inter&#8209;state proceeding lodged by
              the Kingdom of the Netherlands against the Russian Federation
              under the European Convention on Human Rights. The Grand Chamber
              delivered its merits judgment on the joined applications on{" "}
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                9 July 2025
              </span>{" "}
              and disjoined this application from the rest of the case on the
              same day, to permit the just&#8209;satisfaction question to
              proceed separately.
            </p>
          </div>
          <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-base leading-relaxed max-w-2xl">
            Reading and reference. Quotations are reproduced from the public
            record where verifiable; paraphrase is marked. Sources are surfaced.
          </p>
        </div>

        {/* Available case summaries */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
            CASE SUMMARIES
          </h2>

          <Link
            href="/reader/case/icj-genocide"
            className="group grid grid-cols-[60px_1fr_40px] items-start gap-x-4 border-t border-rule py-6 hover:bg-bg-2/50 transition-colors -mx-6 px-6"
          >
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-accent text-sm pt-1">
              FOL. 01
            </span>
            <div>
              <h3 className="font-[family-name:var(--font-newsreader)] text-ink text-lg font-medium">
                Allegations of Genocide (Ukraine v. Russian Federation)
              </h3>
              <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-base leading-relaxed mt-1">
                ICJ · General List No. 182 · Preliminary Objections, 2 February
                2024. Six objections by Russia, jurisdiction narrowed to
                negative genocide declaration. 32 states intervene.
              </p>
            </div>
            <span className="text-ink-soft group-hover:text-ink transition-colors text-right pt-1">
              →
            </span>
          </Link>

          <Link
            href="/reader/case/icj-cerd-icsft"
            className="group grid grid-cols-[60px_1fr_40px] items-start gap-x-4 border-t border-b border-rule py-6 hover:bg-bg-2/50 transition-colors -mx-6 px-6"
          >
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-accent text-sm pt-1">
              FOL. 02
            </span>
            <div>
              <h3 className="font-[family-name:var(--font-newsreader)] text-ink text-lg font-medium">
                Ukraine v. Russian Federation (CERD + ICSFT)
              </h3>
              <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-base leading-relaxed mt-1">
                ICJ · General List No. 166 · Judgment of 31 January 2024.
                Terrorism financing and racial discrimination conventions.
                Verdict scorecard, procedural timeline, collapsible findings.
              </p>
            </div>
            <span className="text-ink-soft group-hover:text-ink transition-colors text-right pt-1">
              →
            </span>
          </Link>
        </div>

        {/* Atlas link */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
            SEE ALSO
          </h2>
          <Link
            href="/atlas"
            className="group flex items-center gap-4 border border-rule p-5 hover:bg-bg-2/50 transition-colors"
          >
            <div className="flex-1">
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-accent text-xs tracking-[0.15em] uppercase block mb-2">
                THE ATLAS
              </span>
              <span className="font-[family-name:var(--font-newsreader)] text-ink text-base font-medium block mb-1">
                All 41 cases on a map
              </span>
              <span className="font-[family-name:var(--font-newsreader)] text-ink-soft text-sm">
                Interactive map of forum cities and harm sites. Filter by theme,
                click any place for case details.
              </span>
            </div>
            <span className="text-ink-soft group-hover:text-ink transition-colors text-xl">
              →
            </span>
          </Link>
        </div>

        {/* On Confidence */}
        <section className="mb-12 max-w-2xl">
          <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
            ON CONFIDENCE
          </h3>
          <p className="font-[family-name:var(--font-newsreader)] text-ink text-base leading-[1.8]">
            Quotations marked <em>verbatim</em> are reproduced word&#8209;for&#8209;word
            from the cited primary source. Quotations marked{" "}
            <em>paraphrased</em> have been compressed or summarised.{" "}
            <em>Translated</em> appears where the original is in another
            language. <em>Secondary</em> appears where a fact reaches us via
            the Court&apos;s quotation rather than from the originating monitor
            or report. Numbers carry the cited source in the same block. The
            court text controls in every case.
          </p>
        </section>

        {/* On Scope */}
        <section className="mb-16 max-w-2xl">
          <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
            ON SCOPE
          </h3>
          <p className="font-[family-name:var(--font-newsreader)] text-ink text-base leading-[1.8]">
            This site covers application 28525/20. The wider Ukraine v. Russia
            material — the Crimea companion judgment, the full&#8209;scale&#8209;invasion
            track, the Donbas administrative practices, the BIT cohort, the ICC
            warrants beyond children transfers — appears here only where it
            bears on the Netherlands inter&#8209;state proceeding.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-rule px-6 lg:px-12 py-4 flex items-center justify-between text-ink-soft">
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs">
          A reader. Not legal advice. The judgments control.
        </span>
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs">
          2 case summaries available
        </span>
      </footer>
    </div>
  );
}

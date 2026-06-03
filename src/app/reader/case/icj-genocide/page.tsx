import Link from "next/link";
import CasePage from "./CasePage";

export const metadata = {
  title:
    "Allegations of Genocide — Ukraine v. Russian Federation (ICJ, GL 182) — A Reader",
};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <header className="px-6 lg:px-12 pt-7 pb-4 flex items-baseline justify-between border-b border-rule sticky top-0 bg-bg z-20">
        <Link
          href="/atlas"
          className="font-[family-name:var(--font-newsreader)] text-ink font-medium text-base"
        >
          A Reader
        </Link>
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-wider">
          FOL. 01 · GL 182
        </span>
      </header>
      <CasePage />
      <footer className="border-t border-rule px-6 lg:px-12 py-4 flex items-center justify-between text-ink-soft">
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs">
          A reader. Not legal advice. The judgments control.
        </span>
        <Link
          href="/atlas"
          className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-accent hover:underline"
        >
          ← Back to Atlas
        </Link>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl text-ink mb-4">
        Zivik
      </h1>
      <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-lg md:text-xl max-w-xl text-center mb-12">
        Reader&apos;s guide to international legal cases between Ukraine and
        Russia.
      </p>
      <div className="flex gap-6 flex-wrap justify-center">
        <Link
          href="/atlas"
          className="px-8 py-4 border border-rule hover:border-ink transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm tracking-wider uppercase"
        >
          The Atlas
        </Link>
        <Link
          href="/subway"
          className="px-8 py-4 border border-rule hover:border-ink transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm tracking-wider uppercase"
        >
          The Subway
        </Link>
        <Link
          href="/reader"
          className="px-8 py-4 border border-rule hover:border-ink transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm tracking-wider uppercase"
        >
          The Reader
        </Link>
      </div>
    </div>
  );
}

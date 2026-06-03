import SubwayMap from "./SubwayMap";
import Link from "next/link";

export const metadata = {
  title: "The Subway — Zivik",
};

export default function SubwayPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#4a443a]">
      <div className="max-w-[1320px] mx-auto px-8">
        {/* Header */}
        <div className="border-b border-[#c8c0ac] py-3.5 flex items-baseline justify-between font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[#4a443a]">
          <div className="flex items-baseline gap-1.5">
            <span className="font-[family-name:var(--font-fraunces)] text-[#1c1814] text-lg font-medium tracking-tight normal-case">
              caseflows
            </span>
            <span className="ml-2">· The Subway</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#d6452f] transition-colors">
              ← Home
            </Link>
            <Link
              href="/atlas"
              className="hover:text-[#d6452f] transition-colors"
            >
              Atlas
            </Link>
            <Link
              href="/reader"
              className="hover:text-[#d6452f] transition-colors"
            >
              Reader
            </Link>
          </nav>
        </div>

        {/* Title */}
        <header className="pt-12 pb-5 grid grid-cols-[1fr_auto] gap-8 items-end border-b border-[#1c1814]">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[54px] leading-none tracking-tight text-[#1c1814] mb-2">
              The <em className="italic text-[#d6452f]">Subway.</em>
            </h1>
            <p className="font-[family-name:var(--font-fraunces)] italic text-lg text-[#4a443a] max-w-[62ch]">
              Eight legal &ldquo;lines&rdquo; running between harm sites in
              Ukraine and the courts of Europe. The Hague is the megahub. To
              read a line is to follow a single conflict through every venue
              that has heard it.
            </p>
          </div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[#4a443a] text-right leading-[1.7] whitespace-nowrap">
            <div>
              <strong className="text-[#1c1814] font-medium">8</strong> lines
            </div>
            <div>
              <strong className="text-[#1c1814] font-medium">21</strong>{" "}
              stations
            </div>
            <div>
              <strong className="text-[#1c1814] font-medium">1</strong> megahub
            </div>
            <div className="text-[#8a8270] mt-2">after H. Beck, 1933</div>
          </div>
        </header>

        <SubwayMap />

        {/* Footer */}
        <footer className="mt-8 border-t border-[#1c1814] py-6 flex items-center justify-between font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-[0.06em] uppercase text-[#8a8270]">
          <span>zivik · the subway</span>
          <span>8 lines · 21 stations · 1 megahub</span>
        </footer>
      </div>
    </div>
  );
}

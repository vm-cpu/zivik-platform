"use client";

import { useState } from "react";
import Link from "next/link";

const TIMELINE = [
  { date: "26 Feb 2022", event: "Application filed by Ukraine", type: "filing" as const },
  { date: "16 Mar 2022", event: "Provisional measures (13–2): Russia must suspend military operations", type: "order" as const },
  { date: "5 Jun 2023", event: "32 of 33 intervention declarations admissible", type: "ruling" as const },
  { date: "2 Feb 2024", event: "Judgment on preliminary objections — narrow jurisdiction", type: "judgment" as const },
  { date: "5 Dec 2025", event: "Russian counter-claims declared admissible", type: "ruling" as const },
  { date: "7 Dec 2027", event: "Rejoinder due (scheduled)", type: "filing" as const },
];

type Verdict = "upheld" | "rejected";

interface Objection {
  id: string;
  number: string;
  claim: string;
  russiaArgument: string;
  courtPosition: string;
  verdict: Verdict;
  keyQuote?: string;
  quotePara?: string;
}

const OBJECTIONS: Objection[] = [
  {
    id: "obj-1",
    number: "First",
    claim: "No dispute existed under the Genocide Convention at the time of filing",
    russiaArgument: "The Court lacks jurisdiction as there was no dispute between the Parties under the Genocide Convention at the time of the filing of the Application.",
    courtPosition: "The Court distinguished two aspects of the dispute. The first aspect — Ukraine's request for a declaration that it has not committed genocide — satisfies the existence of a dispute under Article IX. The second aspect — that Russia acted unlawfully — is fundamentally different in nature.",
    verdict: "rejected",
    keyQuote: "By such a request, Ukraine does not seek to invoke the international responsibility of the Russian Federation for an internationally wrongful act; it seeks a judicial finding that it has itself not committed the wrongful acts that the Russian Federation has, falsely in Ukraine's view, imputed to it in public statements.",
    quotePara: "Judgment, para. 54",
  },
  {
    id: "obj-2",
    number: "Second",
    claim: "The Court lacks jurisdiction ratione materiae",
    russiaArgument: "Submissions (c) and (d) in paragraph 178 of Ukraine's Memorial — concerning Russia's use of force and recognition of DPR/LPR as violations of Articles I and IV of the Genocide Convention — do not fall within the Court's jurisdiction.",
    courtPosition: "The Court declined to exercise jurisdiction on Russia's use of force against Ukraine since 24 February 2022 as an alleged violation of the Genocide Convention, as well as on the recognition of the DPR and LPR. These submissions do not fall within the Court's jurisdiction ratione materiae.",
    verdict: "upheld",
    keyQuote: "The Court determined that it would exercise jurisdiction over one aspect of Ukraine's argument alone — the request to adjudge and declare that there is no credible evidence that Ukraine is responsible for committing genocide in the Donetsk and Luhansk oblasts.",
    quotePara: "Judgment, para. 151, 178(b)",
  },
  {
    id: "obj-3",
    number: "Third",
    claim: "New claims in the Memorial are inadmissible",
    russiaArgument: "Ukraine made new claims in the Memorial that transform the subject of the dispute and these should be found inadmissible.",
    courtPosition: "The Court rejected this objection. The submissions presented in the Memorial do not constitute new claims that transform the subject of the dispute.",
    verdict: "rejected",
  },
  {
    id: "obj-4",
    number: "Fourth",
    claim: "Judgment would lack practical effect",
    russiaArgument: "Ukraine's claims are inadmissible as the Court's potential judgment would lack practical effect.",
    courtPosition: "The Court rejected this objection. A judgment on the merits would have practical effect.",
    verdict: "rejected",
  },
  {
    id: "obj-5",
    number: "Fifth",
    claim: "Negative declaration request is inadmissible",
    russiaArgument: "Ukraine's request for a declaration that it did not breach its obligations under the Convention is inadmissible.",
    courtPosition: "The Court rejected this objection. A State may seek a declaration that it has not committed the wrongful acts imputed to it.",
    verdict: "rejected",
  },
  {
    id: "obj-6",
    number: "Sixth",
    claim: "Application constitutes abuse of process",
    russiaArgument: "Ukraine's Application is inadmissible as it constitutes an abuse of process.",
    courtPosition: "The Court rejected this objection. The Application does not constitute an abuse of process.",
    verdict: "rejected",
  },
];

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "jurisdiction", label: "Jurisdiction" },
  { id: "objections", label: "Preliminary objections" },
  { id: "operative", label: "Operative clause" },
];

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-wider uppercase rounded-sm ${
        verdict === "upheld"
          ? "bg-accent text-white"
          : "bg-rule text-ink-soft"
      }`}
    >
      {verdict === "upheld" ? "Upheld" : "Rejected"}
    </span>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 mb-12">
      <h2 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.15em] uppercase text-ink-soft mt-12 mb-4 border-b border-rule pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ObjectionCard({ obj }: { obj: Objection }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-rule mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-4 hover:bg-bg-2/50 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft">
              {obj.number} objection
            </span>
            <VerdictBadge verdict={obj.verdict} />
          </div>
          <p className="font-[family-name:var(--font-newsreader)] text-[15px] text-ink leading-snug">
            {obj.claim}
          </p>
        </div>
        <span className="text-ink-soft text-lg shrink-0 mt-1 transition-transform" style={{ transform: open ? "rotate(45deg)" : "none" }}>
          +
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-rule/50">
          <div className="mt-3 mb-3">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft block mb-1">
              Russia&apos;s argument
            </span>
            <p className="font-[family-name:var(--font-newsreader)] text-[13px] leading-[1.7] text-ink-soft pl-3 border-l-2 border-rule">
              {obj.russiaArgument}
            </p>
          </div>
          <div className="mt-3">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft block mb-1">
              Court&apos;s position
            </span>
            <p className="font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.75] text-ink">
              {obj.courtPosition}
            </p>
          </div>
          {obj.keyQuote && (
            <blockquote className="border-l-2 border-accent pl-3 mt-3 font-[family-name:var(--font-newsreader)] italic text-[13px] leading-[1.7] text-ink">
              {obj.keyQuote}
              {obj.quotePara && (
                <cite className="block mt-1 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] not-italic text-ink-soft">
                  {obj.quotePara}
                </cite>
              )}
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}

export default function CasePage() {
  const [activeSection, setActiveSection] = useState("overview");

  const upheldCount = OBJECTIONS.filter((o) => o.verdict === "upheld").length;
  const rejectedCount = OBJECTIONS.filter((o) => o.verdict === "rejected").length;

  return (
    <div className="flex-1 flex">
      {/* Sticky TOC */}
      <nav className="hidden lg:block w-48 shrink-0 px-6 pt-8">
        <div className="sticky top-20">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.12em] uppercase text-ink-soft mb-3">
            On this page
          </p>
          {TOC.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setActiveSection(item.id)}
              className={`block py-1.5 font-[family-name:var(--font-newsreader)] text-sm transition-colors ${activeSection === item.id ? "text-ink font-medium" : "text-ink-soft hover:text-ink"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="flex-1 px-6 lg:px-8 max-w-[800px] pb-16">
        <div className="pt-6 pb-2">
          <Link href="/atlas" className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-accent hover:underline">
            ← Back to Atlas
          </Link>
        </div>

        <Section id="overview" title="Case overview">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-ink-soft text-xs tracking-[0.15em] uppercase mb-4">
            International Court of Justice · General List No. 182
          </p>
          <h1 className="font-[family-name:var(--font-newsreader)] text-[2.5rem] md:text-[3rem] leading-[1.1] font-normal text-ink mb-4">
            Allegations of Genocide
          </h1>
          <p className="font-[family-name:var(--font-newsreader)] text-ink-soft text-lg leading-relaxed mb-6">
            Ukraine v. Russian Federation: 32 States Intervening — Preliminary Objections
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink mb-6">
            {[
              { label: "Filed", value: "26 Feb 2022" },
              { label: "Judgment", value: "2 Feb 2024" },
              { label: "Phase", value: "Preliminary objections" },
              { label: "Merits", value: "Pending" },
            ].map((item, i) => (
              <div key={item.label} className={`p-3 ${i < 3 ? "border-r border-rule" : ""}`}>
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-[0.1em] uppercase text-ink-soft">{item.label}</div>
                <div className="font-[family-name:var(--font-newsreader)] text-sm text-ink mt-1">{item.value}</div>
              </div>
            ))}
          </div>

          <p className="font-[family-name:var(--font-newsreader)] text-[1.05rem] leading-[1.8] text-ink mb-4">
            Application filed by Ukraine on 26 February 2022 — Article IX of the
            Genocide Convention invoked as basis of jurisdiction. The Russian
            Federation raised six preliminary objections to the jurisdiction of
            the Court and the admissibility of the Application.
          </p>
          <p className="font-[family-name:var(--font-newsreader)] text-[1.05rem] leading-[1.8] text-ink">
            Ukraine contends that the Russian Federation has made false
            allegations that Ukraine committed genocide in the Luhansk and
            Donetsk oblasts, and that the Russian Federation cannot lawfully, on
            the basis of such allegations, take any action against Ukraine under
            the Genocide Convention — in particular the recognition of the DPR
            and LPR and the launch of the &ldquo;special military operation.&rdquo;
          </p>
        </Section>

        <Section id="timeline" title="Procedural timeline">
          <div className="relative pl-6 border-l-2 border-rule">
            {TIMELINE.map((item, i) => (
              <div key={i} className="mb-6 last:mb-0 relative">
                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${
                  item.type === "judgment" ? "bg-accent border-accent" : item.type === "order" ? "bg-[#b8893a] border-[#b8893a]" : "bg-bg border-ink"
                }`} />
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] tracking-wider text-ink-soft uppercase">{item.date}</div>
                <div className="font-[family-name:var(--font-newsreader)] text-[15px] text-ink mt-0.5">{item.event}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="jurisdiction" title="Jurisdiction — The two aspects of the dispute">
          <p className="font-[family-name:var(--font-newsreader)] text-[15px] leading-[1.75] text-ink mb-4">
            The Court identified two distinct aspects of Ukraine&apos;s argument:
          </p>

          <div className="border border-ink mb-4 divide-y divide-rule">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft">First aspect</span>
                <span className="inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-wider uppercase rounded-sm bg-accent text-white">Jurisdiction accepted</span>
              </div>
              <p className="font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.75] text-ink">
                Ukraine&apos;s request for a declaration that it has not committed
                genocide — a &ldquo;negative declaration.&rdquo; Ukraine does not
                seek to invoke Russia&apos;s responsibility; it seeks a judicial
                finding that it has itself not committed the wrongful acts imputed
                to it.
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft">Second aspect</span>
                <span className="inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-wider uppercase rounded-sm bg-rule text-ink-soft">Jurisdiction declined</span>
              </div>
              <p className="font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.75] text-ink">
                Ukraine&apos;s request to have the Court adjudicate that Russia
                has acted unlawfully with respect to the Genocide Convention —
                including the use of force since 24 February 2022 and the
                recognition of the DPR/LPR. Through these submissions Ukraine
                seeks to invoke Russia&apos;s international responsibility.
              </p>
            </div>
          </div>

          <blockquote className="border-l-2 border-accent pl-3 mb-4 font-[family-name:var(--font-newsreader)] italic text-[13px] leading-[1.7] text-ink">
            The Court determined that it would exercise jurisdiction over one aspect
            of Ukraine&apos;s argument alone — the request to &ldquo;adjudge and
            declare that there is no credible evidence that Ukraine is responsible
            for committing genocide in the Donetsk and Luhansk oblasts of
            Ukraine.&rdquo;
            <cite className="block mt-1 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] not-italic text-ink-soft">
              Judgment, para. 178(b)
            </cite>
          </blockquote>

          <p className="font-[family-name:var(--font-newsreader)] text-[15px] leading-[1.75] text-ink-soft">
            Article IX of the Genocide Convention: &ldquo;Disputes between the
            Contracting Parties relating to the interpretation, application or
            fulfilment of the present Convention, including those relating to the
            responsibility of a State for genocide or any of the other acts
            enumerated in article III, shall be submitted to the International
            Court of Justice at the request of any of the parties to the
            dispute.&rdquo;
          </p>
        </Section>

        <Section id="objections" title="Six preliminary objections">
          <div className="flex h-5 rounded-sm overflow-hidden mb-4 border border-rule">
            <div className="bg-accent transition-all" style={{ width: `${(upheldCount / 6) * 100}%` }} />
            <div className="bg-rule transition-all" style={{ width: `${(rejectedCount / 6) * 100}%` }} />
          </div>
          <div className="flex gap-6 mb-6 font-[family-name:var(--font-ibm-plex-mono)] text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent" /> Upheld ({upheldCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rule" /> Rejected ({rejectedCount})</span>
          </div>

          {OBJECTIONS.map((obj) => (
            <ObjectionCard key={obj.id} obj={obj} />
          ))}
        </Section>

        <Section id="operative" title="Operative clause">
          <div className="border border-ink p-4 mb-4 bg-bg-2/30">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] tracking-wider uppercase text-ink-soft mb-3">
              The Court decides:
            </p>
            <div className="space-y-3 font-[family-name:var(--font-newsreader)] text-[14px] leading-[1.7] text-ink">
              <p>
                <strong>Upholds</strong> the second preliminary objection: submissions (c) and (d) in paragraph 178 of Ukraine&apos;s Memorial (concerning Russia&apos;s use of force and recognition of DPR/LPR as Genocide Convention violations) do not fall within the Court&apos;s jurisdiction.
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> the first preliminary objection (no dispute existed);
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> the third preliminary objection (new claims inadmissible);
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> the fourth preliminary objection (judgment would lack practical effect);
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> the fifth preliminary objection (negative declaration inadmissible);
              </p>
              <p className="text-ink-soft">
                <strong>Rejects</strong> the sixth preliminary objection (abuse of process).
              </p>
              <p className="mt-4 pt-3 border-t border-rule">
                Submission (b) in paragraph 178 of Ukraine&apos;s Memorial — that there is no credible evidence that Ukraine is responsible for committing genocide — <strong>does fall within the jurisdiction of the Court</strong> and is admissible. The Court will examine this claim on the merits at the next stage of the proceedings.
              </p>
            </div>
          </div>
        </Section>

        <div className="mt-8 pt-4 border-t border-rule">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-ink-soft">
            Source: Summary of ICJ Judgment on Preliminary Objections of 2 February 2024 (GL 182).
          </p>
        </div>
      </main>
    </div>
  );
}

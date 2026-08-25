import Link from "next/link";
import { pick } from "@/content/types";
import { registryCases } from "@/content/cases";
import { icjGenocide } from "@/content/summaries/icj-genocide";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import "./quote.css";

/**
 * The decision the pull-quote is taken from.
 *
 * The words are the operative paragraph of the ICJ's Order on provisional
 * measures of 16 March 2022 in *Allegations of Genocide* (Ukraine v. Russian
 * Federation) — one of the eight decisions written up here. Quoting a court
 * without saying where the sentence comes from is the one thing a legal
 * archive cannot do, and the reader had no way to reach it.
 */
const QUOTE_SLUG = "icj-genocide";

/**
 * The opening quotation mark, per language. Ukrainian sets «…», English “…”.
 * The dictionary's `quote.text` carries no marks of its own, so nothing is
 * doubled here — check before changing either side.
 */
const OPEN_MARK: Record<Locale, string> = { uk: "«", en: "“" };

/**
 * The source line is composed only from values recorded in this repository.
 * Nothing in it is written from memory:
 *
 *   • the parties come from `src/content/summaries/icj-genocide.ts` → `title`,
 *     which is also the <h1> of the case page this links to;
 *   • the court, the stage and the date come from the dictionaries
 *     (`quote.source`), rendered verbatim;
 *   • the General List number comes from `src/content/cases.ts` — the `note`
 *     on the `icj-2` row that owns this summary.
 *
 * One thing is deliberately dropped. The archive's full name for the case is
 * "Ukraine v. Russian Federation: 32 States intervening" — the title of the
 * Preliminary Objections judgment of 2 February 2024, which is the decision
 * the case page writes up. The sentence quoted here is from the order of
 * 16 March 2022, before any State had intervened, so the rider is left off
 * rather than attached to a decision it does not belong to. Everything that
 * remains is verbatim from the record; nothing is added to it.
 */
function citation(locale: Locale) {
  const fullName = icjGenocide.title
    ? pick(icjGenocide.title, locale)
    : icjGenocide.masthead.parties.replace(/^\(|\)$/g, "");
  const parties = fullName.split(":")[0].trim();
  const row = registryCases.find((c) => c.id === icjGenocide.caseId);
  const docket = row ? pick(row.note, locale) : undefined;
  return { parties, docket };
}

export default function Quote({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const href = `/${locale}/cases/${QUOTE_SLUG}`;
  const { parties, docket } = citation(locale);
  const meta = docket ? `${dict.quote.source} · ${docket}` : dict.quote.source;

  return (
    /* The band was `.nsv-quote`, styled from [locale]/home.css. It is now
       `.nsvq` with its own stylesheet next to this file, the way <Header> and
       <EventsMap> own theirs; the `.nsv-quote*` rules left in home.css are
       dead and can be deleted. */
    <figure className="nsvq">
      {/* The thin light element that divides this band from the map above it,
          in place of the empty strip that used to sit there. Decoration, so it
          is hidden from assistive technology. */}
      <span className="nsvq-seam" aria-hidden="true" />
      <span className="nsvq-mark" aria-hidden="true">
        {OPEN_MARK[locale]}
      </span>
      <blockquote className="nsvq-text" cite={href}>
        {dict.quote.text}
      </blockquote>
      <figcaption className="nsvq-cite">
        <Link href={href} className="nsvq-link">
          <cite className="nsvq-case">{parties}</cite>
          <span className="nsvq-meta">{meta}</span>
          <span className="nsvq-read">
            {dict.quote.read}
            <span aria-hidden="true"> →</span>
          </span>
        </Link>
      </figcaption>
    </figure>
  );
}

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
/* Both marks, not one. A single oversized glyph floating above the text is a
   decoration that has to be forgiven; a pair at reading size around the words
   is what actually marks a quotation, and it balances. The opening mark hangs
   into the margin so the first letter stays optically flush with the lines
   below it. */
const MARKS: Record<Locale, [string, string]> = {
  uk: ["«", "»"],
  en: ["\u201C", "\u201D"],
};

/**
 * What the link promises — and why it no longer promises the quoted decision.
 *
 * The words above are from the ICJ's Order on provisional measures of
 * 16 March 2022. The page this links to writes up a different decision in the
 * same case: the Judgment on Preliminary Objections of 2 February 2024. Its
 * `judgment.date` is 2024-02-02, its masthead reads JUDGMENT OF 2 FEBRUARY
 * 2024, its timeline runs 2014 → 26 February 2022 → 5 June 2023 → 2 February
 * 2024, and it carries no `provisionalMeasures` block. So the link said
 * "Читати рішення" / "Read the decision" and did not lead to the decision
 * quoted.
 *
 * The other repair would have been to add the Order to that page's timeline.
 * It is not available: nothing in this repository records the Order's date or
 * its content except `dict.quote.*` — the very strings under question — and
 * the icj-genocide verbatim, which mentions only the *request* for provisional
 * measures filed on 26 February 2022. Inventing the entry from memory is the
 * one thing this archive must not do, so the promise changed instead: the
 * label now names the decision the reader will actually find, and the date it
 * carries is read off `icjGenocide.judgment.date` rather than typed here, so
 * the two cannot drift apart.
 *
 * `dict.quote.read` ("Читати рішення" / "Read the decision") is what this
 * replaces and now has no consumer — a matter for whoever owns the
 * dictionaries.
 */
const DESTINATION: Record<Locale, string> = {
  uk: "Сторінка справи: рішення від {date} (попередні заперечення)",
  en: "The case page: judgment of {date} (preliminary objections)",
};

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
  // The linked page's own decision date, formatted the way the decision pages
  // format theirs. Read from the summary, never typed here.
  const linkedDate = new Date(`${icjGenocide.judgment.date}T00:00:00Z`).toLocaleDateString(
    locale === "uk" ? "uk-UA" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
  const destination = DESTINATION[locale].replace("{date}", linkedDate);

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
      {/* The ornament that says "someone else's words" before a word is read.
          Decorative and hidden from assistive technology: the <blockquote>
          carries the semantics and the marks around the text carry the
          punctuation, which a quotation from a court has to keep. */}
      <span className="nsvq-orn" aria-hidden="true">
        {MARKS[locale][0]}
      </span>
      <blockquote className="nsvq-text" cite={href}>
        {MARKS[locale][0]}
        {dict.quote.text}
        {MARKS[locale][1]}
      </blockquote>
      <figcaption className="nsvq-cite">
        <Link href={href} className="nsvq-link">
          <cite className="nsvq-case">{parties}</cite>
          <span className="nsvq-meta">{meta}</span>
          <span className="nsvq-read">
            {destination}
            <span aria-hidden="true"> →</span>
          </span>
        </Link>
      </figcaption>
    </figure>
  );
}

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

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

export default function Quote({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <figure className="nsv-quote">
      <blockquote className="nsv-quote-text" cite={`/${locale}/cases/${QUOTE_SLUG}`}>
        {dict.quote.text}
      </blockquote>
      <figcaption className="nsv-quote-src">
        <Link href={`/${locale}/cases/${QUOTE_SLUG}`} className="nsv-quote-link">
          <span>{dict.quote.source}</span>
          <em>{dict.quote.read} →</em>
        </Link>
      </figcaption>
    </figure>
  );
}

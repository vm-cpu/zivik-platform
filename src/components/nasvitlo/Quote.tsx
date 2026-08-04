import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Pull-quote from an actual judgment — a dramatic dark band using the court's
 * own words. `dict.quote` is already in the active locale.
 */
export default function Quote({ dict }: { dict: Dictionary }) {
  return (
    <figure className="nsv-quote">
      <blockquote className="nsv-quote-text">{dict.quote.text}</blockquote>
      <figcaption className="nsv-quote-src">{dict.quote.source}</figcaption>
    </figure>
  );
}

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick } from "@/content/types";
import type { RegistryCase } from "@/content/types";
import { institutions } from "@/content/institutions";

/**
 * A proceeding that is in the registry but has no summary yet.
 *
 * Thirty-one of the thirty-nine are in this state. Until now they were dead
 * ends: inert rows with no address, so nothing could link to them and the
 * fifteen official court documents recorded against them were rendered
 * nowhere at all. This page gives each one a URL, says plainly that the
 * summary is still being written, and hands the reader the court's own
 * document where there is one.
 *
 * The site's metaphor does the work: the light is not on here yet.
 */
export default function CasePending({
  entry,
  dict,
  locale,
}: {
  entry: RegistryCase;
  dict: Dictionary;
  locale: Locale;
}) {
  const inst = institutions.find((i) => i.id === entry.institutionId);
  const t = dict.pending;

  return (
    <div className="pend">
      <div className="pend-lamp" aria-hidden="true">
        <span className="pend-bulb" />
      </div>

      <p className="pend-eyebrow">
        {inst ? pick(inst.abbr, locale) : entry.institutionId}
        {entry.year ? ` · ${entry.year}` : ""}
      </p>

      <h1 className="pend-name">{entry.name}</h1>

      <p className="pend-say">{t.body}</p>

      <dl className="pend-facts">
        {inst && (
          <div>
            <dt>{t.forum}</dt>
            <dd>{pick(inst.name, locale)}</dd>
          </div>
        )}
        <div>
          <dt>{t.status}</dt>
          {/* The registry's own wording, not the one-word chip. A case at
              merits with a provisional-measures order in force and a case
              awaiting just satisfaction both read "Pending" on the chip; here
              they read as what they are. */}
          <dd>{pick(entry.status, locale)}</dd>
        </div>
        <div>
          <dt>{t.kind}</dt>
          <dd>{pick(entry.type, locale)}</dd>
        </div>
        {entry.note && (
          <div>
            <dt>{t.docket}</dt>
            <dd className="pend-mono">{pick(entry.note, locale)}</dd>
          </div>
        )}
      </dl>

      <div className="pend-ways">
        {entry.decisionUrl && (
          <a
            className="pend-doc"
            href={entry.decisionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.official} ↗
          </a>
        )}
        <Link className="pend-back" href={`/${locale}/registry`}>
          {t.toRegistry} →
        </Link>
        <Link className="pend-back" href={`/${locale}/map`}>
          {t.toMap} →
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { foreignLang, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { decisionMetadata } from "@/lib/seo";
import { pick } from "@/content/types";
import type { RegistryCase } from "@/content/types";
import { institutions } from "@/content/institutions";
import { registryCases } from "@/content/cases";

/**
 * Extra chrome labels this surface needs that the shared dictionary does not
 * carry. `dict.pending` covers the page's own copy; the amount is a registry
 * field (`amountUsd`) that had no label anywhere because nothing rendered it.
 */
const T = {
  amount: { uk: "Сума у спорі", en: "Amount in dispute" },
} as const;

/** The registry row behind a `/cases/{id}` URL that has no summary. */
export function pendingCase(slug: string): RegistryCase | undefined {
  return registryCases.find((c) => c.id === slug && !c.summarySlug);
}

/**
 * Amount at stake, as a plain grouped USD figure.
 *
 * The sign in the source encodes which way the money ran (the Naftogaz gas
 * sales arbitration is recorded as −2.02bn); that direction is not something
 * this page can caption honestly in one line, so it shows the magnitude and
 * calls it what it is — the sum in dispute.
 */
function money(amountUsd: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(amountUsd));
}

/**
 * Title and description for a proceeding with no summary yet.
 *
 * Same shape as the summary pages — `decisionMetadata` gives it the canonical,
 * the hreflang pair and a complete OG/Twitter card — but the description says
 * what this page actually is rather than promising a summary. No
 * `/og/cases/{id}.png` exists for these, so the card falls back to the site's.
 */
export function pendingMetadata({
  slug,
  locale,
  dict,
}: {
  slug: string;
  locale: Locale;
  dict: Dictionary;
}): Metadata {
  const entry = pendingCase(slug);
  if (!entry) return {};
  const inst = institutions.find((i) => i.id === entry.institutionId);
  const t = dict.pending;
  return decisionMetadata({
    locale,
    slug,
    title: `${entry.name} — ${inst ? pick(inst.name, locale) : entry.institutionId}`,
    description: `${t.title}. ${pick(entry.status, locale)} · ${pick(entry.note, locale)}${
      entry.year ? ` · ${entry.year}` : ""
    }.`,
    ogAlt: dict.meta.ogAlt,
    siteName: dict.brand.wordmark,
  });
}

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
  slug,
  dict,
  locale,
}: {
  slug: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const entry = pendingCase(slug);
  // A slug that is neither a summary nor a registry id is simply not a case.
  if (!entry) notFound();

  const inst = institutions.find((i) => i.id === entry.institutionId);
  const t = dict.pending;

  return (
    <div className="page pendingpage">
      <main id="content" tabIndex={-1} className="pend">
        <div className="pend-lamp" aria-hidden="true">
          <span className="pend-bulb" />
        </div>

        <p className="pend-eyebrow">
          {inst ? pick(inst.abbr, locale) : entry.institutionId}
          {entry.year ? ` · ${entry.year}` : ""}
        </p>

        <h1 className="pend-name" lang={foreignLang(entry.name, locale)}>
          {entry.name}
        </h1>

        <p className="pend-status">{t.title}</p>
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
          {entry.amountUsd != null && (
            <div>
              <dt>{pick(T.amount, locale)}</dt>
              <dd className="pend-mono">{money(entry.amountUsd, locale)}</dd>
            </div>
          )}
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
      </main>
    </div>
  );
}

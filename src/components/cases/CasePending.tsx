import type { Metadata } from "next";
import { moneyFull } from "@/content/money";
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
  seat: { uk: "Місце розгляду", en: "Seat" },
  pages: { uk: "Обсяг рішення", en: "Length of the decision" },
  pagesN: { uk: "с.", en: "pp." },
  /* The heading over the siblings. Deliberately says what the relation IS —
     same forum — and claims nothing about the law. These proceedings are
     neighbours on a docket, not authority for one another. */
  siblings: { uk: "Інші провадження в цьому суді", en: "Other proceedings before this forum" },
  /* Shown only when the forum has no analysed sibling to offer. */
  kindred: { uk: "Розібрані рішення тієї ж категорії", en: "Analysed decisions of the same kind" },
  /* The last resort, for a proceeding that is the only one of its forum and
     the only one of its field. Three records are: the ITLOS case, the ICC
     commercial arbitration and the EU enforcement decision. */
  kin2: {
    uk: { international: "Розібрані рішення міжнародних судів", arbitration: "Розібрані арбітражні рішення", national: "Розібрані рішення національних судів", executive: "Розібрані рішення бібліотеки" },
    en: { international: "Analysed decisions of international courts", arbitration: "Analysed arbitral awards", national: "Analysed decisions of national courts", executive: "Analysed decisions in the library" },
  },
  /* The row that carries the caption as the forum files it. «Повна назва»
     rather than «Цитування»: it is the name of the case, not a citation
     format. */
  caption: { uk: "Повна назва", en: "Full caption" },
  hasSummary: { uk: "є розбір", en: "analysed" },
  allOfForum: { uk: "Усі провадження цього суду", en: "All proceedings before this forum" },
  /* What the link actually opens. `dict.pending.official` stays the label for
     a decision or a forum's own case page; these name the rest, because a
     button that promises a judgment and opens a press release has spent the
     reader's trust for nothing. */
  linkKind: {
    uk: {
      "press-release": "Прес-реліз суду",
      "case-page": "Сторінка справи в суді",
      party: "Заява сторони",
      database: "Картка справи в базі даних",
      report: "Повідомлення в медіа",
    },
    en: {
      "press-release": "The court's press release",
      "case-page": "The case on the court's site",
      party: "A party's own statement",
      database: "The case in a database",
      report: "Press reporting",
    },
  },
} as const;

/** The registry row behind a `/cases/{id}` URL that has no summary. */
export function pendingCase(slug: string): RegistryCase | undefined {
  return registryCases.find((c) => c.id === slug && !c.summarySlug);
}

/** Amount at stake, whole. See `content/money.ts` for why it is unsigned. */
const money = moneyFull;

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
    /* The heading's name, not the caption. A tab, a search result and a
       shared link all show this string, and the caption runs to forty words:
       «National Joint Stock Company «Naftogaz of Ukraine» v. PJSC «Gazprom»,
       SCC Arbitration No. V 2014/129 - Gas Transit Arbitration — Арбітражний
       інститут…» is 130 characters before the forum's name begins. The full
       caption is on the page, in the row that carries it. */
    title: `${entry.nameShort ?? entry.name} — ${inst ? pick(inst.name, locale) : entry.institutionId}`,
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

  /* Thirty-one of the thirty-nine proceedings are in this state, and each was
     a leaf: a card, an apology and two links back to lists. What the registry
     already knows is that none of them stands alone — the ten pending Crimea
     BIT arbitrations sit beside Oschadbank and DTEK, which are written up, and
     the six pending ICC records are the individual warrants under a situation
     that is written up. Saying so turns a dead end into the cluster it belongs
     to, and the two relations below are the two the data actually supports.

     Same forum first. It is a fact about a docket, not about the law, and it
     is stated as such — nothing here claims one proceeding is authority for
     another. */
  const siblings = registryCases.filter(
    (c) => c.institutionId === entry.institutionId && c.id !== entry.id,
  );
  const SHOWN = 8;

  /* Only when the forum has no analysed neighbour to offer. A reader on the
     ITLOS case or the Lithuanian prosecution has no sibling at all, and the
     nearest useful thing the archive holds is a decision of the same kind. */
  const kindred =
    siblings.some((c) => c.lit)
      ? []
      : registryCases.filter(
          (c) =>
            c.lit &&
            c.id !== entry.id &&
            pick(c.type, locale) === pick(entry.type, locale),
        );

  /* And a proceeding that is alone in its forum AND alone in its field still
     has somewhere to go: the analysed decisions of forums of the same kind.
     That is a weaker relation than the two above and it is named as one — an
     international court's decision, an arbitral award — rather than dressed up
     as a connection between these particular cases. */
  const catOf = (c: RegistryCase) =>
    institutions.find((i) => i.id === c.institutionId)?.category;
  const category = inst?.category;
  /* The test is whether a written-up decision has been offered yet, not
     whether any neighbour has. Tied to `siblings.length` it left the two SCC
     arbitrations pointing at each other and nowhere else — both are stubs, so
     the page led a reader from one apology to another. */
  const offeredAnalysed = siblings.some((c) => c.lit) || kindred.length > 0;
  const kin2 =
    !offeredAnalysed && category
      ? registryCases.filter((c) => c.lit && c.id !== entry.id && catOf(c) === category)
      : [];
  /* `executive` has exactly one member — the EU decision — so a category match
     returns nothing for it. That record falls back to the library's analysed
     decisions, which is what its heading says. */
  const kin2Final =
    !offeredAnalysed && kin2.length === 0
      ? registryCases.filter((c) => c.lit && c.id !== entry.id)
      : kin2;

  const caseHref = (c: RegistryCase) =>
    `/${locale}/cases/${c.summarySlug ?? c.id}`;
  /* A heading takes the short name; the full caption is a fact of the record
     and is set out in the table below. */
  const caseName = (c: RegistryCase) =>
    locale === "uk" && c.nameUk ? c.nameUk : (c.nameShort ?? c.name);

  const relations = (items: RegistryCase[], heading: string) => (
    <section className="pend-rel">
      <h2>{heading}</h2>
      <ul>
        {/* The year leads, then the name.
            It used to be name first with the year in a column at the right
            edge, and the names here are long enough to wrap: the year floated
            alone opposite the second line of a title, with a hand's width of
            empty rail between them. Ranged left in a narrow mono column it is
            a ledger — the years line up, the names start on one axis, and the
            row has no gap in the middle of it. */}
        {items.slice(0, SHOWN).map((c) => (
          <li key={c.id} data-lit={c.lit ? "yes" : "no"}>
            <Link href={caseHref(c)}>
              <span className="pend-rel-year">{c.year ?? ""}</span>
              <span className="pend-rel-name">
                {/* `lang` belongs to the case name and not to the mark beside
                    it: the names are English on a Ukrainian page, the mark is
                    the page's own word. */}
                <span lang={foreignLang(caseName(c), locale)}>{caseName(c)}</span>
                {/* The space is a character, not a margin: without it the mark
                    is announced joined to the last word of the name. */}
                {c.lit && (
                  <>
                    {" "}
                    <b className="pend-rel-lit">{pick(T.hasSummary, locale)}</b>
                  </>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {items.length > SHOWN && (
        <Link className="pend-rel-more" href={`/${locale}/registry?court=${entry.institutionId}`}>
          {pick(T.allOfForum, locale)} ({items.length}) →
        </Link>
      )}
    </section>
  );

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

        <h1 className="pend-name" lang={foreignLang(caseName(entry), locale)}>
          {caseName(entry)}
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
          {inst?.seat && (
            <div>
              <dt>{pick(T.seat, locale)}</dt>
              <dd>{pick(inst.seat, locale)}</dd>
            </div>
          )}
          {entry.note && (
            <div>
              <dt>{t.docket}</dt>
              <dd className="pend-mono">{pick(entry.note, locale)}</dd>
            </div>
          )}
          {/* The caption in full, and only where the heading is not already
              it. Eleven of these captions carry something that is nowhere else
              on the record — ten co-claimants, a second docket, the date of a
              Council decision — so shortening the title cannot be allowed to
              take them off the page. */}
          {entry.nameShort && (
            <div>
              <dt>{pick(T.caption, locale)}</dt>
              <dd lang={foreignLang(entry.name, locale)}>{entry.name}</dd>
            </div>
          )}
          {/* Four of the thirty-nine records carry a page count. It was kept
              in the model with a note saying it should either get a surface or
              be cleared deliberately; this is the surface. On a page whose
              honest subject is a document the reader has not been given yet,
              how long that document is turns out to be one of the more useful
              things it can say. */}
          {entry.pages != null && (
            <div>
              <dt>{pick(T.pages, locale)}</dt>
              <dd className="pend-mono">
                {entry.pages} {pick(T.pagesN, locale)}
              </dd>
            </div>
          )}
        </dl>

        {siblings.length > 0 && relations(siblings, pick(T.siblings, locale))}
        {kindred.length > 0 && relations(kindred, pick(T.kindred, locale))}
        {kin2Final.length > 0 &&
          relations(
            kin2Final,
            T.kin2[locale === "uk" ? "uk" : "en"][category ?? "executive"],
          )}

        <div className="pend-ways">
          {entry.decisionUrl && (
            <a
              className="pend-doc"
              href={entry.decisionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.decisionUrlKind
                ? T.linkKind[locale === "uk" ? "uk" : "en"][entry.decisionUrlKind]
                : t.official}{" "}
              ↗
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

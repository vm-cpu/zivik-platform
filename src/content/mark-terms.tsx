import type { ReactNode } from "react";

/**
 * Glossary terms, marked in the running text.
 *
 * The decisions define their own vocabulary — «hors de combat», «ratione
 * loci», «фактичний контроль» — and the definitions were all in one band at
 * the foot of the page. A reader met the term in the fourth paragraph, and
 * either already knew it or scrolled past it. This puts the definition where
 * the word is.
 *
 * ── Rules the marking follows ──────────────────────────────────────────────
 *
 * **First occurrence only, once per page.** Wikipedia's rule, for Wikipedia's
 * reason: a term marked at every appearance turns a page of legal prose into a
 * field of underlines, and after the first one the reader knows.
 *
 * **Never inside a heading, never inside the dispositif.** A heading is a
 * signpost and does not want furniture in it. The operative clauses are the
 * court's own words in the order it ordered them, and they are quoted here to
 * be quoted onward — nothing gets inserted into them.
 *
 * **Inflection, word by word.** Ukrainian declines, and a page that only
 * matched dictionary forms would mark «юрисдикція» while walking past
 * «юрисдикції» and «юрисдикцію» — and would never find «міждержавної скарги»
 * under the headword «міждержавна скарга», where both words decline at once.
 * So every word of a term long enough to have a stable stem is matched by that
 * stem plus up to three more letters, and the words must still be adjacent.
 * Below that length a stem carries too little to be safe — «суд» would light up
 * «судно» and «судовий» — so short words are matched exactly. A headword
 * written as two alternatives, «ЄКПЛ / Конвенція», is tried as either.
 *
 * The failure mode of this rule is a term left unmarked, which costs a reader
 * nothing. The failure mode of a looser rule is the wrong definition attached
 * to the wrong word, which costs them the thing this archive is for.
 */
export interface TermRef {
  /** Stable id — the anchor on the glossary page. */
  id: string;
  term: string;
  def: string;
  /** Where the mark points: the term's entry in the dictionary. */
  href: string;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Ukrainian and Latin letters, for the word boundaries a \b cannot do. */
const LETTER = "A-Za-zА-Яа-яЇїІіЄєҐґ'’";

/**
 * The pattern that finds one term.
 *
 * `\b` is defined over ASCII word characters, so in a Cyrillic string it fires
 * in the middle of words and not at their edges. The boundaries here are
 * explicit lookarounds over the alphabet the site actually sets.
 */
function patternFor(term: string): RegExp {
  /* Quotes and guillemets are always packaging. A bracket is not: «Стаття
     12(3)» ends in one that belongs to the article number, and stripping it
     left the mark underlining «статті 12(3» with the bracket hanging outside
     it. A bracket only comes off when the whole headword is wrapped in a
     matching pair. */
  const strip = (t: string) => {
    const inner = t.replace(/^[«»"'“„\s]+|[»"'“„\s]+$/g, "");
    return /^\(.*\)$/.test(inner) ? inner.slice(1, -1).trim() : inner;
  };

  /* One word of a term. Long enough to have a stem, and it gets to decline;
     shorter than that and the stem would match half the dictionary. */
  const word = (w: string) => {
    if (w.length < 5) return escapeRe(w);
    const stem = w.replace(/[аяоеиіїуюєAEIOUaeiou]$/u, "");
    return `${escapeRe(stem)}[${LETTER}]{0,3}`;
  };

  /* «ЄКПЛ / Конвенція» is one headword offering two names for the same thing;
     either should find it. */
  const alternatives = term
    .split("/")
    .map(strip)
    .filter(Boolean)
    .map((alt) =>
      alt
        .split(/[\s\u2010-\u2015-]+/)
        .filter(Boolean)
        .map(word)
        .join("[\\s\u2010-\u2015-]+"),
    );

  return new RegExp(
    `(?<![${LETTER}])(?:${alternatives.join("|")})(?![${LETTER}])`,
    "iu",
  );
}

/**
 * Mark the first unused term found in one string.
 *
 * `used` is the page's running memory and is mutated: the caller creates one
 * set per page and hands it to every block in reading order, so "first
 * occurrence" means first on the page rather than first in the paragraph.
 *
 * Returns the original string when nothing matched, so a paragraph that
 * carries no terms costs nothing and renders as it did before.
 */
export function markTerms(
  text: string,
  terms: TermRef[],
  used: Set<string>,
): ReactNode {
  const hits: { start: number; end: number; ref: TermRef }[] = [];

  for (const ref of terms) {
    if (used.has(ref.id)) continue;
    const m = patternFor(ref.term).exec(text);
    if (!m) continue;
    /* One mark per span of text: two terms that share a stem would otherwise
       both claim the same word and the second would slice the first in half. */
    const start = m.index;
    const end = m.index + m[0].length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, ref });
    used.add(ref.id);
  }

  if (hits.length === 0) return text;
  hits.sort((a, b) => a.start - b.start);

  const out: ReactNode[] = [];
  let at = 0;
  hits.forEach((h, i) => {
    if (h.start > at) out.push(text.slice(at, h.start));
    const popId = `gd-${h.ref.id}-${i}`;
    out.push(
      /* The mark and its note are siblings, not nested.

         The note is what a screen reader gets through aria-describedby; put
         inside the link it would also become part of the link's own name, so
         every marked word would be announced as its whole definition followed
         by "link". Beside it, the link is called by the word and described by
         the definition, which is the distinction those two attributes exist
         to make. */
      <span className="gl-wrap" key={`m${i}`}>
        <a className="gl-mark" href={h.ref.href} aria-describedby={popId}>
          {text.slice(h.start, h.end)}
        </a>
        <span className="gl-pop" id={popId} role="tooltip">
          <b>{h.ref.term}</b>
          {h.ref.def}
        </span>
      </span>,
    );
    at = h.end;
  });
  if (at < text.length) out.push(text.slice(at));
  return <>{out}</>;
}

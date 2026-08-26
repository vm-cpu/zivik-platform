import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import "@/app/[locale]/newsletter.css";

/**
 * The sign-off band: two asks, side by side, with supporting the collection
 * given the primary control.
 *
 * Earlier versions got the hierarchy wrong twice. First it was two bare arrow
 * links of identical weight, which is a menu rather than a hierarchy. Then the
 * newsletter took the one visible control and rendered it as a near-black pill
 * on paper — an inversion of the site's own lit button, which is a gold fill
 * with dark text (`.btn-lit` in home.css). Both are fixed here: the button
 * uses the established lit idiom, and it belongs to the support ask, which is
 * the more important of the two.
 *
 * Each action sits next to the sentence that explains it. A prominent button
 * floating beside copy about something else is how a reader ends up clicking
 * the wrong thing.
 */

/**
 * The support ask, held here rather than in the dictionaries — the same
 * convention the team, registry, map and about pages use for page prose,
 * keeping the dictionaries to UI chrome.
 *
 * It used to describe the labour: weeks of reading, checking, translating.
 * True, but it asked a reader to care about our workload. It says why the work
 * matters instead — the decisions are already handed down and already public,
 * and are still effectively unreadable — which is the same thing the site's
 * name says.
 */
const SUPPORT = {
  heading: {
    uk: "Рішення вже ухвалені. Їх треба прочитати",
    en: "The decisions already exist. They need to be read",
  },
  text: {
    uk: "Міжнародні суди встановили факти й дали їм правову оцінку — сотнями сторінок процедурної мови кількома мовами. Ми проливаємо на них світло, щоб на них можна було спертися в аргументі, статті чи позові. Підтримка — це наступне опрацьоване рішення.",
    en: "International courts have established the facts and ruled on them — across hundreds of pages of procedural language in several languages. We shed light on those pages so they can be relied on in an argument, an article or a claim. Support is the next decision written up.",
  },
} as const;

export default function Newsletter({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  // Both actions go to the project address until there is a donation route and
  // a sign-up list. A real destination that works today, and one line to
  // repoint once either exists. Deliberately not a fake email field: an input
  // that posts nowhere is worse than an honest mailto.
  const mailto = (subject: string) =>
    `mailto:${dict.footer.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="nsv-newsletter">
      <div className="nsv-news-grid">
        {/* One ask. The monthly-letter column came off at the user's request:
            there is no sign-up list behind it yet, so the band was offering a
            subscription that does not exist beside a support ask that does. */}
        <div className="nsv-news-block">
          <h2 className="nsv-news-heading">{SUPPORT.heading[locale]}</h2>
          <p className="nsv-news-text">{SUPPORT.text[locale]}</p>
        </div>
        {/* The ask sits opposite the words rather than under them: with one
            column the band left half its width empty, which read as an
            unfinished section rather than a quiet one. */}
        <div className="nsv-news-act">
          <a className="nsv-cta nsv-cta" href={mailto(dict.newsletter.support)}>
            {dict.newsletter.support}
          </a>
        </div>
      </div>
    </div>
  );
}

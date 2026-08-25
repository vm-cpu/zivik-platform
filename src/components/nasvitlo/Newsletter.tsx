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
 */
const SUPPORT = {
  heading: {
    uk: "Бібліотека тримається на людях",
    en: "The library is kept by people",
  },
  text: {
    uk: "Кожен конспект — це тижні читання рішень, звірки документів і перекладу. Підтримка дає змогу опрацювати наступне.",
    en: "Every summary is weeks of reading decisions, checking documents and translating. Support is what lets us take on the next one.",
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
        {/* Primary: supporting the collection. */}
        <div className="nsv-news-block">
          <h2 className="nsv-news-heading">{SUPPORT.heading[locale]}</h2>
          <p className="nsv-news-text">{SUPPORT.text[locale]}</p>
          {/* The site's own button, not a second one invented beside it.
              `.btn .btn-o` is what the intro and the registry already use on
              paper; a bespoke pill here read as a different control from the
              ones above it on the same page. */}
          <a className="btn btn-o" href={mailto(dict.newsletter.support)}>
            {dict.newsletter.support}
          </a>
        </div>

        {/* Secondary: the monthly letter. Quieter control, same clarity. */}
        <div className="nsv-news-block nsv-news-block-2">
          <h2 className="nsv-news-heading nsv-news-heading-2">
            {dict.newsletter.heading}
          </h2>
          <p className="nsv-news-text">{dict.newsletter.text}</p>
          <a
            className="nsv-news-support"
            href={mailto(dict.newsletter.subscribe)}
          >
            <span className="nsv-news-support-label">
              {dict.newsletter.subscribe}
            </span>
            <span className="nsv-news-arrow" aria-hidden="true">
              →
            </span>
          </a>
          {/* Fine print sits under the action it reassures about. */}
          <p className="nsv-news-assurance">{dict.newsletter.assurance}</p>
        </div>
      </div>
    </div>
  );
}

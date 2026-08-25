import type { Dictionary } from "@/i18n/dictionaries";
import "@/app/[locale]/newsletter.css";

/**
 * The sign-off band: one invitation, one primary control, one quiet aside.
 *
 * It used to be two bare text links ending in an arrow, side by side and
 * identically weighted — which is not a hierarchy, it is a menu. Getting the
 * letter is the action this band exists for, so it is a control you can see
 * (a lamp-dark pill with a lit label and a warm pool of light under it, the
 * same "lit" mark the registry legend directly above uses for an analysed
 * decision). Supporting the collection is a real but secondary ask, so it
 * stays a link — quieter in size, weight and colour, and set apart from the
 * subscribe group rather than paired with it.
 */
export default function Newsletter({ dict }: { dict: Dictionary }) {
  // Until there is a sign-up form and a donation route, both actions go to
  // the project address — a real destination that works today, and one line
  // to repoint once the pages exist. Deliberately not a fake email field:
  // an input that posts nowhere is worse than an honest mailto.
  const mailto = (subject: string) =>
    `mailto:${dict.footer.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="nsv-newsletter">
      <div className="nsv-news-grid">
        <div className="nsv-news-copy">
          <h2 className="nsv-news-heading">{dict.newsletter.heading}</h2>
          <p className="nsv-news-text">{dict.newsletter.text}</p>
        </div>

        <div className="nsv-news-actions">
          <a className="nsv-news-cta" href={mailto(dict.newsletter.subscribe)}>
            <span className="nsv-news-lit" aria-hidden="true" />
            {dict.newsletter.subscribe}
          </a>
          {/* Fine print sits under the primary action, where the doubt is. */}
          <p className="nsv-news-assurance">{dict.newsletter.assurance}</p>
          <a
            className="nsv-news-support"
            href={mailto(dict.newsletter.support)}
          >
            <span className="nsv-news-support-label">
              {dict.newsletter.support}
            </span>
            <span className="nsv-news-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

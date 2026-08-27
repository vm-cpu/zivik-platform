import "./glance.css";

/**
 * The case at a glance — the docket facts a reader needs before anything else.
 *
 * `DecisionSummary.glance` has been authored on every one of the eight pages
 * (57 facts, 114 localized strings) and was rendered nowhere: the field existed
 * in `types.ts`, the data existed in every summary module, and no component
 * ever read it. This renders it, in the overview band, above the headline
 * figures — who prosecuted, on what basis, over what period, decided when.
 * The KPI strip beside it carries magnitudes; this carries identifiers, and
 * they are different questions.
 *
 * Props arrive locale-resolved, like the other instruments on this page.
 */
export interface GlanceFactR {
  label: string;
  value: string;
}

/**
 * A docket, not a grid.
 *
 * This was four equal columns of label-and-value, which treats thirteen facts
 * as thirteen equal things. They are not: «Заявник: Україна» is who the case
 * is, «Автентичний текст: французький» is a footnote. Worse, the content is
 * wildly uneven — 37 of the 57 facts across the eight pages are twenty
 * characters or fewer while one is eighty-five — so equal cells either crush
 * the long values or, once they are allowed to span, leave holes where a
 * two-column entry could not fit the tail of a row. Both were tried. The holes
 * were the symptom; the equal cells were the cause.
 *
 * One fact to a line, label left, value right. Nothing spans, so nothing can
 * leave a hole; the eighty-five-character identifier simply takes its line;
 * the reading order the card is authored in (see `GlanceFact` in
 * summaries/types.ts) is the order it is read in, top to bottom. And it stops
 * looking like the grid of KPI tiles directly beneath it, which is a different
 * instrument answering a different question.
 */

export default function GlanceFacts({ facts }: { facts: GlanceFactR[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="glance">
      {facts.map((f, i) => (
        <div key={i} className="glance-item">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

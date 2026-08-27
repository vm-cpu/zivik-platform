import "./glance.css";

/**
 * The case at a glance — the docket facts a reader needs before anything else.
 *
 * `DecisionSummary.glance` has been authored on every one of the eight pages
 * (48 facts, 96 localized strings) and was rendered nowhere: the field existed
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
 * How many columns a fact needs, from how much it has to say.
 *
 * The ledger used to give every entry one equal column, and the entries are
 * not equal. Measured across the eight pages, 55 facts: 34 are twenty
 * characters or fewer — «Гаага», «№ 182», a date — and sit comfortably in one
 * column; nine run 31 to 45 and wrapped to three and four lines in a column
 * sized for «Гаага»; and one, MH17's identifier, is 85 characters naming four
 * simultaneous judgments, which wrapped to five.
 *
 * So the thresholds are the data's own, not a guess. Giving the long ones the
 * room they need also packs the rows better, because a two-column entry beside
 * two one-column entries completes a row of four.
 */
function span(value: string): 1 | 2 | 4 {
  if (value.length > 70) return 4;
  if (value.length > 30) return 2;
  return 1;
}

export default function GlanceFacts({ facts }: { facts: GlanceFactR[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="glance">
      {facts.map((f, i) => (
        <div key={i} className="glance-item" data-span={span(f.value)}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

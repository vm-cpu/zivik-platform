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

import "./theatre-legend.css";

/**
 * The legend under the theatre map: the seat, and each place the case is about.
 *
 * Extracted from the map so that `Theatre.summary` has somewhere to render.
 * That field is authored on all eleven theatres across the eight summaries —
 * one sentence saying what happened at the place the map marks — and no
 * component read it: the legend printed "place — TAG" and stopped, so the map
 * told a reader *where* and never *what*.
 *
 * The markup keeps the `.map-legend` classes the decision page already styles;
 * the sentence and the layout it needs are new classes in this component's own
 * stylesheet. Props arrive locale-resolved.
 */
export interface TheatreLegendEntry {
  place: string;
  tag: string;
  summary?: string;
}

export default function TheatreLegend({
  seat,
  theatres,
}: {
  seat: { name: string; caption: string };
  theatres: TheatreLegendEntry[];
}) {
  return (
    <div className="map-legend">
      <span className="lg-seat">
        <i className="lg-court" />
        <span className="lg-place">
          {seat.name} — {seat.caption}
        </span>
      </span>
      {theatres.map((t, i) => (
        <span key={i} className="lg-theatre">
          <i />
          <span className="lg-place">
            {t.place} — <b>{t.tag}</b>
          </span>
          {t.summary && <span className="lg-note">{t.summary}</span>}
        </span>
      ))}
    </div>
  );
}

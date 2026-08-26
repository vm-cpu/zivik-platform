import "./provenance.css";

/**
 * What the reader is actually looking at, said before they rely on it.
 *
 * Four of the eight decision pages carry `provisionalSource: true` — their
 * verbatim body was ingested from a working draft that has not been finalized.
 * The fact was recorded in the data and in `types.ts`, and the string that
 * states it (`T.provisionalNote`) sat in the page template referenced by
 * nothing. A reader had no way to know. For an archive that exists to be
 * cited, that is the defect that matters most.
 *
 * A "draft Ukrainian translation, English governs" notice was rendered here
 * too and has been removed at the user's instruction — it is her editorial
 * process to describe, and she does not want the site to carry that claim.
 * The `"translation"` kind stays in the union so the mechanism is there if it
 * is ever wanted back; nothing constructs one today.
 *
 * A third note covers the case where the court's own text of the decision is
 * not published anywhere the page can link — finland-torden, whose registry
 * row already records `decisionUrl: null` while the page offered a blog post
 * and a news report under the court's name.
 *
 * Rendered twice: once as a band directly under the masthead, where a reader
 * meets it before the plain-language summary, and once, quietly, at the head
 * of the verbatim text for a reader who arrives there through the page nav.
 * Not at the foot — a provenance warning below the thing it warns about is
 * not a warning.
 */
export type ProvenanceKind = "provisional" | "translation" | "unpublished";

export interface ProvenanceNote {
  kind: ProvenanceKind;
  /** Short name of the caveat, e.g. "Preliminary text". */
  tag: string;
  /** One or two sentences: what is provisional, and what to do about it. */
  text: string;
}

export default function ProvenanceNotice({
  notes,
  label,
  variant = "band",
}: {
  notes: ProvenanceNote[];
  /** Accessible name of the region, e.g. "About this text". */
  label: string;
  /** "band" — the full-bleed strip under the masthead; "inline" — inside the
   *  reading column, above the verbatim text. */
  variant?: "band" | "inline";
}) {
  if (notes.length === 0) return null;

  const list = (
    <aside className="provnote" data-variant={variant} aria-label={label}>
      <ul>
        {notes.map((n) => (
          <li key={n.kind} data-kind={n.kind}>
            <b className="pn-tag">{n.tag}</b>
            <span className="pn-text">{n.text}</span>
          </li>
        ))}
      </ul>
    </aside>
  );

  if (variant === "inline") return list;

  return (
    <section className="provband">
      <div className="rail">{list}</div>
    </section>
  );
}

import geometry from "@/content/europe-map.json";

/**
 * The map, as the ground the lamp lights.
 *
 * Not a second copy of `EventsMap`. That component is the archive's map — pan,
 * zoom, three framings, court cards, a legend — and none of it belongs on a
 * first screen, where the reader has not asked a question yet. This is the
 * same geometry with everything that answers a question taken out: no
 * markers, no labels, no legend, nothing to press. Six countries and Ukraine,
 * and that is the whole drawing.
 *
 * Why it is here at all: the owner's note is that the map should be the
 * background of the first section and appear when the light comes on. That
 * turns the hero's metaphor into a sentence the page can actually say — the
 * lamp is lit, and what it shows is the countries where this war is being
 * judged. Pull the chain and they go dark with everything else.
 *
 * It joins the family of things the lamp lights (`.bcone`, `.bpool`, the lit
 * wordmark): same `--lit` fade on scroll, same disappearance at
 * `[data-on="no"]`, same z-index 1 under the text at 3. Nothing here is a new
 * behaviour; it is one more surface the existing switch already governs.
 *
 * A server component with no JavaScript of its own. The paths are in the
 * first HTML the reader gets, so the light has something to fall on before
 * hydration — a background that pops in late is worse than no background.
 */
interface HeroGeometry {
  viewBox: string;
  ukraine: string;
  forums: Record<string, string>;
}

const geo = geometry as HeroGeometry;

export default function HeroMap() {
  return (
    <span className="hmap" aria-hidden="true">
      <svg
        viewBox={geo.viewBox}
        /* Contain, not cover. Cover was the instinct — it is a background —
           and it was wrong: the frame is 1200x460 and the hero is nearer
           square, so covering cropped away everything but Scandinavia and
           Ukraine's edge, and six countries you cannot place are not a map.
           There are no letterbox bands to avoid, either: what sits behind is
           the lamp's own gradient, which is what the rest of the section is. */
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {Object.entries(geo.forums).map(([name, d]) => (
          <path key={name} className="hmap-state" d={d} />
        ))}
        {/* Ukraine, outlined rather than filled — the same division of labour
            the archive's own map makes, where the gold stroke is what says
            "this is the subject" and the fill says "this one is lit". Six lit
            countries with nothing between them would be a constellation
            nobody could read; with Ukraine drawn they are a sentence about
            where its road is being lit from. */}
        <path className="hmap-ua" d={geo.ukraine} />
      </svg>
    </span>
  );
}

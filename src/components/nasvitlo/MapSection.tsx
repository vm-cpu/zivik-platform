import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { buildMapModel } from "@/lib/map-model";
import MapExplorer from "./map/MapExplorer";
import Link from "next/link";

/**
 * Events map on the home page — the short version: the map, the legend and one
 * violation open, with everything else a click away on the full map page.
 */
export default async function MapSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const model = await buildMapModel(locale);

  return (
    <div
      id="map"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "10px 28px 40px",
        background: "var(--paper)",
        scrollMarginTop: 16,
      }}
    >
      <div
        className="nsv-sechead"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 18,
        }}
      >
        <div>
          <div className="lbl">
            <span>{dict.mapSection.label}</span>
          </div>
          <h2 style={{ fontSize: 27, margin: "0 0 8px" }}>
            {dict.mapSection.heading}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "var(--ink2)",
              margin: 0,
              maxWidth: 560,
            }}
          >
            {dict.mapSection.description}
          </p>
        </div>
        <Link
          href={`/${locale}/map`}
          style={{
            font: "700 11px var(--brand-font-body)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--red)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {dict.mapSection.fullMap}
        </Link>
      </div>

      {/* full-bleed to the page edges, as the section band above it */}
      <div style={{ margin: "22px -28px 0" }}>
        <MapExplorer
          model={model}
          t={dict.mapSection}
          variant="teaser"
          registryHref={`/${locale}/registry`}
          fullMapHref={`/${locale}/map`}
        />
      </div>
    </div>
  );
}

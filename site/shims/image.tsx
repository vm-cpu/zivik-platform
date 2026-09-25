/**
 * `next/image` under Astro: a plain, lazy, dimensioned <img>.
 *
 * Next's optimiser is not here. The two callers (partner logos, team photos)
 * pass width and height, which is what matters for layout stability; `sizes`
 * is kept, `priority` becomes eager loading, and the optimiser-only props are
 * dropped.
 */
import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string; width?: number; height?: number };
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  fill?: boolean;
  unoptimized?: boolean;
};

/** Optimiser-only props, dropped. */
const NEXT_ONLY = new Set(["quality", "placeholder", "blurDataURL", "unoptimized", "loader"]);

export default function Image({ src, alt, priority, fill, style, ...props }: ImageProps) {
  const rest = Object.fromEntries(Object.entries(props).filter(([k]) => !NEXT_ONLY.has(k)));
  const url = typeof src === "string" ? src : src.src;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- this *is* the Image component here
    <img
      src={url}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={
        fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
          : { color: "transparent", ...style }
      }
      {...rest}
    />
  );
}

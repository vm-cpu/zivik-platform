import type { DetailedHTMLProps, HTMLAttributes } from "react";

type Custom = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  "data-k"?: string;
  "data-p"?: string;
  "data-s"?: number | string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "nsv-island": Custom;
      "nsv-slot": Custom;
    }
  }
}

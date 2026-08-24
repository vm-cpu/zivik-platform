"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Whole years and months between `since` and now, as "years|months". */
function snapshot(since: string): string {
  const start = new Date(since);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  return `${Math.floor(months / 12)}|${months % 12}`;
}

/** Nothing to subscribe to: the figure is read once per mount, not streamed. */
const noop = () => () => {};

/**
 * The war's duration, in the tile row under the hero.
 *
 * The page is prerendered, so a figure computed on the server is frozen at
 * whatever the last deploy said — and this archive can go weeks between
 * deploys. `useSyncExternalStore` fits that split exactly: it renders the
 * build-time value during SSR and hydration, so a reader without JavaScript
 * still sees a figure, then reads the live one on the client.
 *
 * The snapshot is a string because React compares it with Object.is; returning
 * an object would make every render look like a change.
 *
 * Units render as their own element so they can be set quieter than the
 * figures — "12 р. 6 міс." in one 46px display serif read as four numerals.
 */
export default function SinceCounter({
  since,
  initialYears,
  initialMonths,
  unitYears,
  unitMonths,
}: {
  since: string;
  initialYears: number;
  initialMonths: number;
  unitYears: string;
  unitMonths: string;
}) {
  const getSnapshot = useCallback(() => snapshot(since), [since]);
  const getServerSnapshot = useCallback(
    () => `${initialYears}|${initialMonths}`,
    [initialYears, initialMonths],
  );

  const [years, months] = useSyncExternalStore(
    noop,
    getSnapshot,
    getServerSnapshot,
  ).split("|");

  return (
    <>
      {years}
      <span className="unit">{unitYears}</span>
      {months !== "0" && (
        <>
          <span className="num-part">{months}</span>
          <span className="unit">{unitMonths}</span>
        </>
      )}
    </>
  );
}

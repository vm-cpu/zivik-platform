"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Years and months between `since` and now, in the reader's language. */
function elapsed(
  since: string,
  unitYears: string,
  unitMonths: string,
): string {
  const start = new Date(since);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0
    ? `${years} ${unitYears}`
    : `${years} ${unitYears} ${rest} ${unitMonths}`;
}

/** Nothing to subscribe to: the figure is read once per mount, not streamed. */
const noop = () => () => {};

/**
 * The war's duration, in the tile row under the hero.
 *
 * The page is prerendered, so a figure computed on the server is frozen at
 * whatever the last deploy said — and this archive can go weeks between
 * deploys. `useSyncExternalStore` is the right shape for exactly this split:
 * it renders `initial` (computed at build time, so a reader without
 * JavaScript still sees a figure) during SSR and hydration, then reads the
 * live value on the client. Doing it with setState inside an effect would
 * work too, but it triggers a cascading render and React lints against it.
 */
export default function SinceCounter({
  since,
  initial,
  unitYears,
  unitMonths,
}: {
  since: string;
  initial: string;
  unitYears: string;
  unitMonths: string;
}) {
  const getSnapshot = useCallback(
    () => elapsed(since, unitYears, unitMonths),
    [since, unitYears, unitMonths],
  );
  const getServerSnapshot = useCallback(() => initial, [initial]);

  return <>{useSyncExternalStore(noop, getSnapshot, getServerSnapshot)}</>;
}

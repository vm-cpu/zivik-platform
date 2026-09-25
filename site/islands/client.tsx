/**
 * Browser half of the island runtime: hydrate every <nsv-island> on the page
 * with the module and props the server recorded on it.
 */
import { hydrateRoot } from "react-dom/client";
import islands from "virtual:nsv-islands";
import { PathnameContext } from "../shims/navigation";

/* Same as runtime.tsx's; not imported from there, which pulls in the server renderer. */
const islandPrefix = (n: number) => `i${n}-`;

type Loader = () => Promise<Record<string, unknown>>;
const registry = islands as Record<string, Loader>;

async function hydrate(el: HTMLElement) {
  const [file, name] = (el.dataset.k ?? "").split("#");
  const load = registry[file];
  if (!load) {
    console.error(`[islands] no module registered for ${file}`);
    return;
  }
  const Component = (await load())[name] as React.ComponentType<Record<string, unknown>>;
  const props = JSON.parse(el.dataset.p ?? "{}") as Record<string, unknown>;

  const slots = [...el.querySelectorAll<HTMLElement>("nsv-slot")].filter(
    (s) => s.closest("nsv-island") === el,
  );
  for (const [k, v] of Object.entries(props)) {
    const index = (v as { $slot?: number } | null)?.$slot;
    if (typeof index !== "number") continue;
    const html = slots.find((s) => s.dataset.s === String(index))?.innerHTML ?? "";
    props[k] = (
      <nsv-slot data-s={index} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
    );
  }

  hydrateRoot(
    el,
    <PathnameContext.Provider value={window.location.pathname}>
      <Component {...props} />
    </PathnameContext.Provider>,
    { identifierPrefix: islandPrefix(Number(el.dataset.n)) },
  );
}

for (const el of document.querySelectorAll<HTMLElement>("nsv-island")) void hydrate(el);

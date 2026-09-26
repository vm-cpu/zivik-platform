/**
 * Publishing in the admin rebuilds the site.
 *
 * Pages are prerendered from a snapshot of published content taken at build
 * time (site/content/), so an edit reaches readers through a build — which is
 * also where src/content's invariants run and can refuse it. This plugin is
 * the trigger: whenever the set of published entries changes, it POSTs the
 * Workers Builds deploy hook in the `DEPLOY_HOOK_URL` secret.
 *
 * Bursts are fine. Cloudflare drops a hook call that arrives while an earlier
 * one is still queued, so publishing ten entries in a row costs one build.
 *
 * Without the secret (local dev, a preview) it logs and does nothing. A hook
 * that cannot be reached, or a malformed secret, is logged with its cause and
 * never thrown: a failed rebuild must not read as a failed publish.
 */
import { definePlugin, type PluginContext } from "emdash";
import { env } from "cloudflare:workers";

/**
 * The hook URL as pasted into `wrangler secret put` or the dashboard, cleaned
 * of what a paste tends to carry along: surrounding whitespace and newlines,
 * and quotes around the whole value.
 */
function hookUrl(raw: string): URL | string {
  const cleaned = raw.trim().replace(/^(["'])(.*)\1$/s, "$2").trim();
  try {
    const url = new URL(cleaned);
    if (url.protocol !== "https:") return `expected an https:// URL, got ${url.protocol}`;
    return url;
  } catch {
    /* Only the length: a mis-pasted secret may be some other credential. */
    return `not a valid URL (${cleaned.length} characters; expected https://api.cloudflare.com/…)`;
  }
}

/* The hook URL is a credential — anyone holding it can start builds — so logs
   name only its host, never the path with the hook id, and never any part of
   a value that failed to parse. */
async function rebuild(reason: string, ctx: PluginContext) {
  const raw = (env as unknown as Record<string, string | undefined>).DEPLOY_HOOK_URL;
  if (!raw?.trim()) {
    ctx.log.info(`rebuild skipped (${reason}): DEPLOY_HOOK_URL is not set`);
    return;
  }
  const url = hookUrl(raw);
  if (typeof url === "string") {
    ctx.log.error(`rebuild skipped (${reason}): DEPLOY_HOOK_URL is ${url}`);
    return;
  }
  let res: Response;
  try {
    res = await fetch(url, { method: "POST" });
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    ctx.log.error(`rebuild request to ${url.host} did not complete (${reason}): ${message}`);
    return;
  }
  if (!res.ok) {
    const body = (await res.text().catch(() => "")).slice(0, 500);
    ctx.log.error(`rebuild request failed (${reason}): ${res.status} ${body}`);
    return;
  }
  ctx.log.info(`rebuild requested (${reason})`);
}

type Event = { collection: string; id?: string; content?: { slug?: string | null; id?: string } };
const on = (what: string) => async (event: Event, ctx: PluginContext) =>
  rebuild(`${what} ${event.collection}/${event.content?.slug ?? event.content?.id ?? event.id ?? "?"}`, ctx);

export function createPlugin() {
  return definePlugin({
    id: "nsv-rebuild-on-publish",
    version: "1.0.0",
    capabilities: ["content:read"],
    hooks: {
      "content:afterPublish": on("published"),
      "content:afterUnpublish": on("unpublished"),
      "content:afterDelete": on("deleted"),
      "content:afterRestore": on("restored"),
    },
  });
}

export default createPlugin;

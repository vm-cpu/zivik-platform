/**
 * Calling the Workers Builds deploy hook — shared by the publish plugin
 * (rebuild-on-publish.ts) and the Worker's cron (worker.ts), which retries a
 * publish whose rebuild never happened.
 *
 * The hook URL is a credential — anyone holding it can start builds — so logs
 * name only its host, never the path with the hook id, and never any part of
 * a value that failed to parse. Nothing here throws: a failed rebuild must not
 * read as a failed publish.
 */
import { env } from "cloudflare:workers";

type Log = { info(message: string): void; error(message: string): void };

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

/** POST the deploy hook; true when Cloudflare accepted it. */
export async function requestRebuild(reason: string, log: Log): Promise<boolean> {
  const raw = (env as unknown as Record<string, string | undefined>).DEPLOY_HOOK_URL;
  if (!raw?.trim()) {
    log.info(`rebuild skipped (${reason}): DEPLOY_HOOK_URL is not set`);
    return false;
  }
  const url = hookUrl(raw);
  if (typeof url === "string") {
    log.error(`rebuild skipped (${reason}): DEPLOY_HOOK_URL is ${url}`);
    return false;
  }
  let res: Response;
  try {
    res = await fetch(url, { method: "POST" });
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    log.error(`rebuild request to ${url.host} did not complete (${reason}): ${message}`);
    return false;
  }
  if (!res.ok) {
    const body = (await res.text().catch(() => "")).slice(0, 500);
    log.error(`rebuild request failed (${reason}): ${res.status} ${body}`);
    return false;
  }
  log.info(`rebuild requested (${reason})`);
  return true;
}

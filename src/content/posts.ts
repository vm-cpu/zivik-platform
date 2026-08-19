import type { Post } from "./types";

/**
 * Blog entries, newest first.
 *
 * Empty until the first text is ready — the blog page renders an honest
 * "no posts yet" state rather than filler. To publish, add an entry here:
 * the index page and `/[locale]/blog/<slug>` pick it up with no other change.
 */
export const posts: Post[] = [];

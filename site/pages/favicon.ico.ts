/** Browsers ask for /favicon.ico whatever the <link> says. */
import type { APIRoute } from "astro";
import favicon from "@/app/favicon.ico?url";

export const GET: APIRoute = ({ redirect }) => redirect(favicon, 301);

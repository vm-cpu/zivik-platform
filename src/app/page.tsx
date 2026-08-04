import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

/**
 * The bare root is normally redirected to a locale by `src/proxy.ts`; this is a
 * fallback (e.g. for static export) that sends visitors to the default locale.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

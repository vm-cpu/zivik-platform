/**
 * The body of `src/app/[locale]/layout.tsx`: one header and one footer for the
 * whole locale, around the page. The <html>/<head> half of that layout is
 * site/layouts/Document.astro.
 *
 * Keep this in step with the Next layout until the Next app is retired.
 */
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CENTRE_URL } from "@/content/centre";
import { glossaryEnabled } from "@/lib/flags";
import { blogEnabled, blogMissingPaths } from "@/content/blog";
import Header from "@/components/nasvitlo/Header";
import { headerDict } from "@/components/nasvitlo/header-dict";
import Footer from "@/components/nasvitlo/Footer";
import { PathnameContext } from "../shims/navigation";

export default function Chrome({
  locale,
  dict,
  pathname,
  node,
}: {
  locale: Locale;
  dict: Dictionary;
  pathname: string;
  node: ReactNode;
}) {
  return (
    <PathnameContext.Provider value={pathname}>
      <div className="nsv-root">
        <Header
            locale={locale}
            dict={headerDict(dict)}
            showGlossary={glossaryEnabled}
            showBlog={blogEnabled(locale)}
            missingPaths={blogMissingPaths()}
            supportHref={CENTRE_URL}
            supportLabel={dict.footer.support}
          />
        {node}
        <Footer dict={dict} locale={locale} />
      </div>
    </PathnameContext.Provider>
  );
}

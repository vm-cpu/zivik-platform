import type { Metadata } from "next";
import {
  Newsreader,
  IBM_Plex_Mono,
  Fraunces,
  Charis_SIL,
  Fira_Sans,
} from "next/font/google";
import { isIndexable } from "@/lib/seo";
import "./globals.css";

/**
 * Brand faces, self-hosted by next/font so they are preloaded and shipped with
 * metric-matched fallbacks — no flash of a different face on load (the old
 * <link> to fonts.googleapis.com swapped visibly mid-render).
 */
const charis = Charis_SIL({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-charis",
  display: "swap",
});

const firaSans = Fira_Sans({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-fira",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/**
 * Fallback only. Every page a reader can reach lives under `[locale]` and
 * sets its own title and description through `generateMetadata`; this covers
 * the bare root, which redirects, and the 404. It stays in the project's own
 * name — an English product label leaked onto real pages once already.
 */
export const metadata: Metadata = {
  // Doubles the X-Robots-Tag header from next.config.ts — cheap, and it still
  // applies if anything between Vercel and the reader drops the header.
  ...(isIndexable ? {} : { robots: { index: false, follow: false } }),
  title: "насвітло",
  description:
    "Рішення міжнародних судів щодо агресії проти України — винесені на світло.",
};

/**
 * Applies the saved theme before the first paint. Without this the page paints
 * in the OS theme and then snaps to the saved one — the flash we just removed
 * from the fonts. Kept tiny and dependency-free on purpose.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("nsv-theme");
if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${newsreader.variable} ${ibmPlexMono.variable} ${fraunces.variable} ${charis.variable} ${firaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

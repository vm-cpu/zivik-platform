import type { Metadata } from "next";
import {
  Newsreader,
  IBM_Plex_Mono,
  Fraunces,
  Charis_SIL,
  Fira_Sans,
} from "next/font/google";
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

export const metadata: Metadata = {
  title: "Zivik — Legal Cases Platform",
  description:
    "Reader's guide to international legal cases between Ukraine and Russia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${newsreader.variable} ${ibmPlexMono.variable} ${fraunces.variable} ${charis.variable} ${firaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

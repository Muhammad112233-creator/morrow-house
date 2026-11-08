import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteEffects from "@/components/site-effects";
import "./globals.css";

const grotesk = localFont({
  src: "../public/fonts/familjen-grotesk-latin.woff2",
  variable: "--font-grotesk",
  weight: "400 700",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../public/fonts/instrument-serif-regular-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/instrument-serif-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Morrow House — A home, held in light",
  description:
    "A residential study in Lahore, shaped by shade, honest materials and the unhurried rhythm of the day.",
  applicationName: "Morrow House",
  keywords: ["architecture", "residential design", "portfolio", "Lahore"],
  openGraph: {
    title: "Morrow House — A home, held in light",
    description:
      "An inward-looking residence shaped around shade, honest materials and the unhurried rhythm of the day.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${instrumentSerif.variable}`}>
        <SiteEffects>{children}</SiteEffects>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { hand, mono, sans, serif } from "@/lib/fonts";
import { site } from "@/site.config";
import { RunningHead } from "@/components/RunningHead";
import { Colophon } from "@/components/Colophon";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#141310" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${hand.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to text</a>
        <RunningHead />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Colophon />
      </body>
    </html>
  );
}

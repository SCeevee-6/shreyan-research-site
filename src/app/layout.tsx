import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import "./world.css";
import { display, hand, mono, sans, serif } from "@/lib/fonts";
import { site } from "@/site.config";
import { RunningHead } from "@/components/RunningHead";
import { Colophon } from "@/components/Colophon";
import { PageFade } from "@/components/PageFade";
import { CommandPalette, type PaletteItem } from "@/components/CommandPalette";
import { Eggs } from "@/components/Eggs";
import { sections } from "@/site.config";
import { getCollection } from "@/lib/content";
import { eggs } from "./appendix/eggs";

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

async function paletteItems(): Promise<PaletteItem[]> {
  const [research, maths, writing] = await Promise.all([
    getCollection("research"),
    getCollection("mathematics"),
    getCollection("writing"),
  ]);
  return [
    { label: "Cover", href: "/", group: "Page" },
    ...sections.map((s) => ({ label: s.title, href: `/${s.slug}`, group: `§${s.n}` })),
    ...research.map((r) => ({ label: r.data.title, href: `/research/${r.slug}`, group: "Research" })),
    ...maths.map((m) => ({ label: `Note ${m.data.n}: ${m.data.title}`, href: `/mathematics/${m.slug}`, group: "Mathematics" })),
    ...writing.map((w) => ({ label: w.data.title, href: `/writing/${w.slug}`, group: "Writing" })),
    { label: "Appendix: things to play with", href: "/appendix", group: "∎" },
    ...eggs.map((e) => ({ label: e.title, href: `/appendix/${e.slug}`, group: "Appendix" })),
  ];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const items = await paletteItems();
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${hand.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to text</a>
        <RunningHead />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          <PageFade>{children}</PageFade>
        </main>
        <Colophon />
        <CommandPalette items={items} />
        <Eggs />
      </body>
    </html>
  );
}

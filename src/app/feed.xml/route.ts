import { site } from "@/site.config";
import { getCollection } from "@/lib/content";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [research, maths, writing] = await Promise.all([
    getCollection("research"),
    getCollection("mathematics"),
    getCollection("writing"),
  ]);
  const items = [
    ...research.map((e) => ({ path: `/research/${e.slug}`, title: e.data.title, summary: e.data.summary, date: e.data.date })),
    ...maths.map((e) => ({ path: `/mathematics/${e.slug}`, title: `Note ${e.data.n}: ${e.data.title}`, summary: e.data.summary, date: e.data.date })),
    ...writing.map((e) => ({ path: `/writing/${e.slug}`, title: e.data.title, summary: e.data.summary ?? (e.data.kind === "poem" ? "A poem." : (e.data.form ?? "Prose")), date: e.data.date })),
  ].sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(site.title)}</title>
<link>${site.url}</link>
<description>${esc(site.description)}</description>
<language>en</language>
<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${site.url}${i.path}</link>
<guid>${site.url}${i.path}</guid>
${i.date ? `<pubDate>${new Date(i.date).toUTCString()}</pubDate>\n` : ""}<description>${esc(i.summary)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

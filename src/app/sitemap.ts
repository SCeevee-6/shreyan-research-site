import type { MetadataRoute } from "next";
import { sections, site } from "@/site.config";
import { getCollection } from "@/lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [research, maths, writing] = await Promise.all([
    getCollection("research"),
    getCollection("mathematics"),
    getCollection("writing"),
  ]);
  const url = (p: string) => new URL(p, site.url).toString();
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...sections.map((s) => ({ url: url(`/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...research.map((e) => ({ url: url(`/research/${e.slug}`), lastModified: e.data.date, priority: 0.7 })),
    ...maths.map((e) => ({ url: url(`/mathematics/${e.slug}`), lastModified: e.data.date, priority: 0.7 })),
    ...writing.map((e) => ({ url: url(`/writing/${e.slug}`), lastModified: e.data.date, priority: 0.6 })),
  ];
}

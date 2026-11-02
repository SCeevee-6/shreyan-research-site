import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Collection = "research" | "mathematics" | "writing";

export type Entry<T> = { slug: string; data: T; body: string };

/** Research maturity, in the order the site lists it. Never promote an entry beyond what is established. */
export const researchStatuses = [
  "Published",
  "Accepted",
  "Preprint",
  "Draft manuscript",
  "Ongoing research",
  "Computational investigation",
] as const;
export type ResearchStatus = (typeof researchStatuses)[number];

export type Link = { label: string; href: string };

export type ResearchMeta = {
  title: string;
  summary: string;
  question: string;
  field: string;
  status: ResearchStatus;
  period: string;
  date: string; // last revised
  order: number;
  links?: Link[];
};

export type MathMeta = {
  n: number;
  title: string;
  summary: string;
  statement: string; // TeX of the key result, shown on the index
  /** Not shown on the site; notes are deliberately undated. */
  date?: string;
  topics: string[];
  status: string; // e.g. "Proved (draft manuscript)", "Computation", "Negative results"
  links?: Link[];
  /** Lab-notebook revision log, oldest first. Shown as v1, v2, … at the foot of the note. */
  revisions?: string[];
};

export type WritingMeta = {
  title: string;
  kind: "poem" | "prose";
  /** Omitted when the author has not given one. Never estimate it. */
  date?: string;
  /** Position in the index when there are no dates to order by. */
  order?: number;
  form?: string;
  note?: string;
  summary?: string;
};

type MetaFor<C extends Collection> = C extends "research"
  ? ResearchMeta
  : C extends "mathematics"
    ? MathMeta
    : WritingMeta;

const SLUG = /^[a-z0-9-]+$/;

const time = (d: unknown) => Date.parse((d as { date?: string }).date ?? "") || 0;

export async function getCollection<C extends Collection>(name: C): Promise<Entry<MetaFor<C>>[]> {
  const dir = path.join(ROOT, name);
  // A section may have no entries yet (an empty or absent folder): that is an empty collection, not an error.
  const files = (await fs.readdir(dir).catch(() => [] as string[])).filter((f) => f.endsWith(".mdx"));
  const entries = await Promise.all(files.map((f) => readEntry<MetaFor<C>>(name, f.replace(/\.mdx$/, ""))));
  return entries
    .filter((e): e is Entry<MetaFor<C>> => e !== null)
    .sort((a, b) => time(b.data) - time(a.data));
}

export async function getEntry<C extends Collection>(name: C, slug: string) {
  return readEntry<MetaFor<C>>(name, slug);
}

async function readEntry<T>(name: Collection, slug: string): Promise<Entry<T> | null> {
  if (!SLUG.test(slug)) return null; // never let a route parameter escape the content directory
  try {
    const raw = await fs.readFile(path.join(ROOT, name, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    return { slug, data: data as T, body: content };
  } catch {
    return null;
  }
}

export async function getPage(name: string) {
  const raw = await fs.readFile(path.join(ROOT, `${name}.mdx`), "utf8");
  return matter(raw);
}

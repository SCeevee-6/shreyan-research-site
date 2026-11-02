/**
 * Everything personal about the site lives here, in /content and in /src/data.
 * Accuracy rules for editing content are in README.md.
 */
export const site = {
  name: "Shreyan Chethan",
  givenName: "Shreyan",
  familyName: "Chethan",
  title: "Shreyan Chethan — Notebook",
  description:
    "The working notebook of Shreyan Chethan: research in algebraic combinatorics and computational biology, mathematics written out with its proofs, writing, and the cello — published as it is made.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shreyanchethan.com",
  location: "Allen, Texas",
  /**
   * Correspondence address, stored split so it never appears whole in the HTML.
   * Taken from the résumé supplied on 1 Nov 2026 — confirm before deploying.
   */
  email: { user: "sceevee6", domain: "gmail.com" },
  profiles: [
    { label: "Zenodo", href: "https://doi.org/10.5281/zenodo.23653009" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shreyan-chethan-a0267a364/" },
  ],
} as const;

export const sections = [
  { n: 1, slug: "about", title: "About", gloss: "A note on the author" },
  { n: 2, slug: "research", title: "Research", gloss: "Register of projects" },
  { n: 3, slug: "publications", title: "Publications", gloss: "Records, by status" },
  { n: 4, slug: "mathematics", title: "Mathematics", gloss: "Notes, with proofs" },
  { n: 5, slug: "achievements", title: "Achievements", gloss: "A ledger" },
  { n: 6, slug: "writing", title: "Writing", gloss: "Poems, prose & vignettes" },
  { n: 7, slug: "music", title: "Music", gloss: "Cello" },
  { n: 8, slug: "contact", title: "Contact", gloss: "Correspondence" },
] as const;

export type SectionSlug = (typeof sections)[number]["slug"];

export function section(slug: SectionSlug) {
  return sections.find((s) => s.slug === slug)!;
}

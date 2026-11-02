/** Maturity of a record, in the order the bibliography lists it. */
export const publicationStatuses = ["Preprint", "Research record", "Draft manuscript"] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];

export type Publication = {
  id: string;
  status: PublicationStatus;
  /** Empty when the author line is not yet settled. */
  authors: string[];
  title: string;
  /** Where the record lives, e.g. "Zenodo". */
  venue: string;
  date: string;
  version?: string;
  note?: string;
  doi?: string;
  href?: string;
  project?: string; // internal link to a research entry
};

/**
 * Records, by status. Zenodo entries use only the title, creator, date and DOI from the
 * Zenodo record (checked 1 Nov 2026). There is no journal or bioRxiv record.
 */
export const publications: Publication[] = [
  {
    id: "chethan2026esm2",
    status: "Preprint",
    authors: ["S. Chethan"],
    title:
      "Zero-shot mutation-effect predictors share a substitution-type bias: predicting per-mutation errors of ESM-2 for abstention",
    venue: "Zenodo",
    date: "2026-10-26",
    doi: "10.5281/zenodo.23653009",
    project: "/research/protein-error-prediction",
  },
  {
    id: "chethan2026esm2code",
    status: "Research record",
    authors: ["S. Chethan"],
    title: "Code and results for: Predicting per-mutation errors of zero-shot ESM-2 mutation-effect scores",
    venue: "Zenodo",
    date: "2026-10-25",
    version: "1.3",
    doi: "10.5281/zenodo.23632503",
    project: "/research/protein-error-prediction",
    note: "Code and results deposit accompanying the preprint above. The DOI resolves to the latest version.",
  },
  {
    id: "polygonfusions2026draft",
    status: "Draft manuscript",
    authors: [],
    title:
      "Fusions of the point–distance schemes of generalized hexagons and octagons, and the orbital algebra of the Tits group on 1755 points",
    venue: "Unpublished draft",
    date: "2026-10-28",
    note: "Draft; the author line is not final.",
    project: "/research/generalized-polygon-schemes",
  },
];

/** BibTeX is offered only for records with a persistent identifier. */
export function bibtex(p: Publication) {
  const d = new Date(p.date);
  const fields: [string, string | undefined][] = [
    ["author", p.authors.map((a) => a.replace(/^S\. Chethan$/, "Chethan, Shreyan")).join(" and ")],
    ["title", `{${p.title}}`],
    ["howpublished", p.venue],
    ["year", String(d.getUTCFullYear())],
    ["month", d.toLocaleString("en", { month: "short", timeZone: "UTC" }).toLowerCase()],
    ["version", p.version],
    ["doi", p.doi],
    ["note", p.status === "Preprint" ? "Preprint" : p.status === "Research record" ? "Code and results" : undefined],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k.padEnd(12)}= {${v}}`)
    .join(",\n");
  return `@misc{${p.id},\n${body}\n}`;
}

import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { bibtex, publicationStatuses, publications, type Publication } from "@/data/publications";
import { formatDate } from "@/lib/issue";
import { Meta, PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Publications",
  description: "Records of the research, grouped by status: a preprint, a code and results deposit, and a draft manuscript.",
  alternates: { canonical: "/publications" },
};

function Authors({ names }: { names: string[] }) {
  return (
    <>
      {names.map((n, i) => {
        const own = n.includes(site.familyName);
        const sep = i === 0 ? "" : i === names.length - 1 ? " and " : ", ";
        return (
          <span key={n}>
            {sep}
            {own ? <span className="smallcaps text-ink">{n}</span> : n}
          </span>
        );
      })}
    </>
  );
}

function Entry({ p }: { p: Publication }) {
  const link = p.doi ? `https://doi.org/${p.doi}` : p.href;
  return (
    <>
      <p className="cite">
        {p.authors.length > 0 && (
          <>
            <Authors names={p.authors} />.{" "}
          </>
        )}
        “{p.title}.” <i>{p.venue}</i>
        {p.version && `, version ${p.version}`}, {p.date.slice(0, 4)}.
        {p.doi && <span className="font-mono text-note text-ink-2"> doi:{p.doi}</span>}
        {p.note && <span className="text-ink-2"> {p.note}</span>}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {p.project && (
          <Link href={p.project} className="bracket">
            Project
          </Link>
        )}
        {link && (
          <a href={link} className="bracket" rel="noopener noreferrer">
            {p.doi ? "DOI" : "Source"}
          </a>
        )}
        {p.doi && (
          <details className="group open:basis-full">
            <summary className="bracket inline-block">
              <span className="group-open:hidden">Cite</span>
              <span className="hidden group-open:inline">Hide citation</span>
              <span className="sr-only"> (BibTeX for “{p.title}”)</span>
            </summary>
            <div className="mt-3">
              <pre className="bibtex">{bibtex(p)}</pre>
              <p className="mt-2">
                <CopyButton text={bibtex(p)} label="Copy BibTeX" />
              </p>
            </div>
          </details>
        )}
      </div>
    </>
  );
}

export default function Publications() {
  const groups = publicationStatuses
    .map((status) => [status, publications.filter((p) => p.status === status)] as const)
    .filter(([, items]) => items.length > 0);

  return (
    <>
      <PageHead
        slug="publications"
        title="Records, by status"
        standfirst="What I've put out so far."
        meta={<Meta items={groups.map(([k, v]) => [k, String(v.length)] as [string, string])} />}
      />
      <div className="sheet mt-16 lg:mt-24">
        {groups.map(([status, items], gi) => (
          <section key={status} aria-labelledby={`g${gi}`} className="sheet-row">
            <Rule heavy />
            <h2 id={`g${gi}`} className="col-rail pt-4 text-[1.625rem] leading-[1.05] font-light tracking-[-0.01em]">
              {status}
            </h2>
            <ol className="col-wide lg:pt-5 pb-10 mt-4 lg:mt-0">
              {items.map((p, i) => (
                <li
                  key={p.id}
                  className={`grid gap-x-12 lg:grid-cols-[minmax(0,var(--measure))_var(--margin)] ${i ? "border-t border-hair pt-5 mt-5" : ""}`}
                >
                  <div className="min-w-0">
                    <Entry p={p} />
                  </div>
                  <p className="label label-muted mt-3 lg:mt-1 tnum">{formatDate(p.date)}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}

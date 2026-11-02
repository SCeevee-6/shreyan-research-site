import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import { formatMonth } from "@/lib/issue";
import { firstLine } from "@/components/Poem";
import { PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";

export const metadata: Metadata = {
  title: "Writing",
  description: "Poems and short prose, indexed by first line. No pieces are published yet.",
  alternates: { canonical: "/writing" },
};

export default async function Writing() {
  const all = await getCollection("writing");
  const poems = all.filter((w) => w.data.kind === "poem").sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
  const prose = all.filter((w) => w.data.kind === "prose").sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

  return (
    <>
      <PageHead
        slug="writing"
        title="Poems & prose"
        italic
        standfirst="Poems and a few short pieces."
      />

      {all.length === 0 && (
        <div className="sheet mt-16 lg:mt-24">
          <Rule heavy />
          <div className="sheet-row pt-6">
            <p className="col-rail label label-muted pt-1">Index</p>
            <p className="col-text text-[1.25rem] leading-snug italic text-ink-2">
              Nothing is published here yet. Poems and prose will appear in this index when they are ready to be read.
            </p>
          </div>
        </div>
      )}

      {poems.length > 0 && (
        <section aria-labelledby="poems" className="sheet mt-16 lg:mt-24">
          <div className="sheet-row">
            <h2 id="poems" className="col-rail label pb-3 lg:pb-0">
              Index of first lines
            </h2>
          </div>
          <Rule heavy className="mt-3" />
          <ol className="sheet-row">
            {poems.map((p) => (
              <li key={p.slug} className="sheet-row group pt-6 lg:pt-7">
                {p.data.date && <p className="col-rail label label-muted tnum pt-2.5">{formatMonth(p.data.date)}</p>}
                <div className="col-text">
                  <Link href={`/writing/${p.slug}#typed`} className="block no-underline">
                    <span className="block text-[1.5rem] leading-[1.3] italic transition-colors group-hover:text-red sm:text-[1.75rem]">
                      {firstLine(p.body)}
                    </span>
                    <span className="smallcaps mt-1 block text-ink-2">{p.data.title}</span>
                  </Link>
                </div>
                <p className="col-margin plain text-note text-ink-3 lg:pt-3">{p.data.form}</p>
                <Rule className="mt-6 lg:mt-7" />
              </li>
            ))}
          </ol>
        </section>
      )}

      {prose.length > 0 && (
        <section aria-labelledby="prose" className="sheet mt-20 lg:mt-28">
          <h2 id="prose" className="col-rail label">
            Prose
          </h2>
          <Rule heavy className="mt-3" />
          <ol className="sheet-row">
            {prose.map((p) => (
              <li key={p.slug} className="sheet-row pt-6 lg:pt-7">
                {p.data.date && <p className="col-rail label label-muted tnum pt-2.5">{formatMonth(p.data.date)}</p>}
                <div className="col-text">
                  <h3 className="text-[1.5rem] leading-tight sm:text-[1.75rem]">
                    <Link href={`/writing/${p.slug}`} className="link-quiet">
                      {p.data.title}
                    </Link>
                  </h3>
                  {p.data.summary && <p className="mt-2 text-ink-2">{p.data.summary}</p>}
                </div>
                <p className="col-margin plain text-note text-ink-3 lg:pt-3">{p.data.form ?? "Prose"}</p>
                <Rule className="mt-6 lg:mt-7" />
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getEntry } from "@/lib/content";
import { MDX } from "@/components/mdx";
import { EntryHead, Meta } from "@/components/PageHead";
import { Links } from "@/components/Status";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCollection("mathematics")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("mathematics", slug);
  if (!entry) return {};
  return {
    title: `Note ${entry.data.n}: ${entry.data.title}`,
    description: entry.data.summary,
    alternates: { canonical: `/mathematics/${slug}` },
    openGraph: { type: "article", title: entry.data.title, description: entry.data.summary },
  };
}

export default async function MathNote({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntry("mathematics", slug);
  if (!entry) notFound();
  const all = (await getCollection("mathematics")).sort((a, b) => a.data.n - b.data.n);
  const i = all.findIndex((n) => n.slug === slug);
  const prev = all[i - 1];
  const next = all[i + 1];

  return (
    <article>
      <EntryHead
        slug="mathematics"
        kicker={`Note ${entry.data.n} · ${entry.data.topics.join(", ")}`}
        title={entry.data.title}
        subtitle={<p className="italic">{entry.data.summary}</p>}
        meta={
          <Meta
            items={[
              ["Status", <span key="s" className="label text-red">{entry.data.status}</span>],
              ...(entry.data.links?.length ? ([["Sources", <Links key="l" links={entry.data.links} />]] as [string, React.ReactNode][]) : []),
            ]}
          />
        }
      />
      <div className="sheet mt-12 lg:mt-16">
        <div className="col-text prose-sheet" data-numbered>
          <MDX source={entry.body} />
        </div>
        {entry.data.revisions?.length ? (
          <section aria-label="Revisions" className="sheet-row mt-14">
            <h2 className="col-rail label label-muted">Revisions</h2>
            <ol className="col-text revisions">
              {entry.data.revisions.map((r, i) => (
                <li key={i}>
                  <span className="tnum text-red">v{i + 1}</span> {r}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
      <nav aria-label="Other notes" className="sheet mt-20">
        <div className="col-sheet grid grid-cols-2 gap-6 border-t border-hair pt-5">
          <div>
            {prev && (
              <Link href={`/mathematics/${prev.slug}`} className="link-quiet block">
                <span className="label label-muted block">← Note {prev.data.n}</span>
                <span className="mt-1 block text-h3">{prev.data.title}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/mathematics/${next.slug}`} className="link-quiet block">
                <span className="label label-muted block">Note {next.data.n} →</span>
                <span className="mt-1 block text-h3">{next.data.title}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </article>
  );
}

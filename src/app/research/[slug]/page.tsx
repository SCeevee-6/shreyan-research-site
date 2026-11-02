import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getEntry } from "@/lib/content";
import { formatDate } from "@/lib/issue";
import { MDX } from "@/components/mdx";
import { EntryHead, Meta } from "@/components/PageHead";
import { Links, Status } from "@/components/Status";
import { publications } from "@/data/publications";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCollection("research")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("research", slug);
  if (!entry) return {};
  return {
    title: entry.data.title,
    description: entry.data.summary,
    alternates: { canonical: `/research/${slug}` },
    openGraph: { type: "article", title: entry.data.title, description: entry.data.summary },
  };
}

export default async function ResearchEntry({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntry("research", slug);
  if (!entry) notFound();
  const { data } = entry;
  const records = publications.filter((p) => p.project === `/research/${slug}`);

  return (
    <article>
      <EntryHead
        slug="research"
        kicker={
          <>
            {data.field} · <Status status={data.status} />
          </>
        }
        title={data.title}
        subtitle={<p className="italic">{data.summary}</p>}
        meta={
          <Meta
            items={[
              ["Status", <Status key="s" status={data.status} />],
              ["Period", data.period],
              ["Revised", formatDate(data.date)],
              ...(data.links?.length ? ([["Sources", <Links key="l" links={data.links} />]] as [string, React.ReactNode][]) : []),
            ]}
          />
        }
      />
      <section aria-label="Research question" className="sheet mt-12 lg:mt-16">
        <div className="sheet-row">
          <p className="col-rail label pt-6 hidden lg:block">Question</p>
          <div className="col-text abstract">
            <p className="label mb-2 lg:hidden">Question</p>
            <p>{data.question}</p>
          </div>
        </div>
      </section>
      <div className="sheet mt-4">
        <div className="col-text prose-sheet" data-numbered>
          <MDX source={entry.body} />
        </div>
      </div>
      {records.length > 0 && (
        <div className="sheet mt-14">
          <div className="sheet-row">
            <p className="col-rail label pt-1">Records</p>
            <ul className="col-text text-small">
              {records.map((p) => (
                <li key={p.id}>
                  “{p.title}.” {p.status}, {formatDate(p.date)}.{" "}
                  <Link href="/publications" className="whitespace-nowrap">See bibliography</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

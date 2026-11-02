import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getEntry } from "@/lib/content";
import { formatDate } from "@/lib/issue";
import { MDX } from "@/components/mdx";
import { Poem, firstLine, lineCount } from "@/components/Poem";
import { EntryHead, Meta } from "@/components/PageHead";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCollection("writing")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("writing", slug);
  if (!entry) return {};
  const description = entry.data.kind === "poem" ? `A poem. “${firstLine(entry.body)} …”` : (entry.data.summary ?? `${entry.data.form ?? "Prose"}. “${entry.body.trim().split(". ")[0]}.”`);
  return {
    title: entry.data.title,
    description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { type: "article", title: entry.data.title, description },
  };
}

export default async function WritingEntry({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntry("writing", slug);
  if (!entry) notFound();
  const { data, body } = entry;
  const poem = data.kind === "poem";

  return (
    <article>
      <EntryHead
        slug="writing"
        kicker={poem ? "Poem" : (data.form ?? "Prose")}
        title={data.title}
        italicTitle={poem}
        subtitle={!poem && data.summary ? <p className="italic">{data.summary}</p> : undefined}
        meta={
          <Meta
            items={[
              ...(data.date ? ([["Written", formatDate(data.date)]] as [string, string][]) : []),
              ...(poem && data.form ? ([["Form", data.form]] as [string, string][]) : []),
              ...(poem ? ([["Lines", String(lineCount(body))]] as [string, string][]) : []),
            ]}
          />
        }
      />
      <div className="sheet mt-14 lg:mt-20">
        <div className="sheet-row">
          {poem ? (
            <>
              <div className="col-text">
                <Poem text={body} />
                {data.date && <p className="mt-12 label label-muted">— {formatDate(data.date)}</p>}
              </div>
              {data.note && <p className="col-margin text-note italic text-ink-2 lg:pt-2">{data.note}</p>}
            </>
          ) : (
            <div className="col-text prose-sheet">
              <MDX source={body} />
            </div>
          )}
        </div>
      </div>
      <p className="sheet mt-16">
        <Link href="/writing" className="col-text label link-quiet">
          ← Index of first lines
        </Link>
      </p>
    </article>
  );
}

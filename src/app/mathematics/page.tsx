import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import { Statement } from "@/components/Statement";
import { Meta, PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";
import { PolygonWalk } from "@/components/figures/PolygonWalk";

export const metadata: Metadata = {
  title: "Mathematics",
  description: "Notes on association schemes, generalized polygons and the Tits group, with statements copied from the draft manuscript and proofs where they exist.",
  alternates: { canonical: "/mathematics" },
};

export default async function Mathematics() {
  const notes = (await getCollection("mathematics")).sort((a, b) => a.data.n - b.data.n);
  const topics = Array.from(new Set(notes.flatMap((n) => n.data.topics)));
  return (
    <>
      <PageHead
        slug="mathematics"
        title="Notes, with proofs"
        standfirst="Notes from my work on generalized polygons and the Tits group."
        meta={<Meta items={[["Notes", String(notes.length)], ["Topics", topics.join(", ")]]} />}
      />
      <div className="sheet mt-12 lg:mt-16">
        <div className="col-sheet">
          <PolygonWalk />
        </div>
      </div>
      <ol className="sheet mt-10 lg:mt-14">
        {notes.map((note) => (
          <li key={note.slug} className="sheet-row">
            <Rule />
            <p className="col-rail flex items-baseline gap-2 pt-6 lg:block lg:pt-8">
              <span className="label label-muted lg:block">Note</span>
              <span className="text-[2.25rem] leading-none font-light tnum lg:mt-1 lg:block lg:text-[4rem]">{note.data.n}</span>
            </p>
            <div className="col-text pt-2 pb-12 lg:pt-8">
              <h2 className="text-[1.875rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.25rem]">
                <Link href={`/mathematics/${note.slug}`} className="link-quiet">
                  {note.data.title}
                </Link>
              </h2>
              <Statement source={note.data.statement} className="my-6 border-y border-hair py-1 text-[1.1rem]" />
              <p className="text-ink-2">{note.data.summary}</p>
            </div>
            <div className="col-margin -mt-6 mb-12 lg:mt-0 lg:mb-0 lg:pt-10">
              <Meta items={[["Status", note.data.status], ["Topics", note.data.topics.join(", ")]]} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

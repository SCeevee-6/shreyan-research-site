import type { Metadata } from "next";
import { distinctions, fields } from "@/data/achievements";
import { Meta, PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";

export const metadata: Metadata = {
  title: "Achievements",
  description: "A ledger of distinctions, grouped by field — mathematics first — with scores and years as recorded.",
  alternates: { canonical: "/achievements" },
};

export default function Achievements() {
  const groups = fields
    .map((f) => [f, distinctions.filter((d) => d.field === f)] as const)
    .filter(([, rows]) => rows.length > 0);

  return (
    <>
      <PageHead
        slug="achievements"
        title="A ledger of distinctions"
        standfirst="Competitions and awards, sorted by subject."
        meta={<Meta items={[["Entries", String(distinctions.length)], ["Fields", groups.map(([f]) => f).join(", ")]]} />}
      />

      <div className="sheet mt-16 lg:mt-24">
        {groups.map(([field, rows], gi) => (
          <section key={field} className="sheet-row" aria-labelledby={`f${gi}`}>
            <Rule heavy />
            <h2 id={`f${gi}`} className="col-rail pt-4 text-[1.625rem] leading-[1.05] font-light tracking-[-0.01em]">
              {field}
            </h2>
            <table className="col-wide ledger mt-3 mb-12 lg:mt-0">
              <caption className="sr-only">Distinctions in {field.toLowerCase()}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Distinction</th>
                  <th scope="col">Year</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.title + d.body + d.year}>
                    <td>
                      <span className="block text-[1.1875rem] leading-snug">{d.title}</span>
                      <span className="block text-ink-2 italic">{d.body}</span>
                      {d.note && <span className="mt-1 block text-note text-ink-3">{d.note}</span>}
                    </td>
                    <td className={`label tnum ${d.year ? "" : "label-muted"}`}>{d.year ?? "Undated"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </>
  );
}

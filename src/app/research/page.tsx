import type { Metadata } from "next";
import Link from "next/link";
import { getCollection, researchStatuses } from "@/lib/content";
import { formatDate } from "@/lib/issue";
import { Meta, PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";
import { Links, Status } from "@/components/Status";
import { BeadChain } from "@/components/figures/BeadChain";
import { Doily } from "@/components/figures/Doily";
import { OrbitRings } from "@/components/figures/OrbitRings";

const figures: Record<string, React.ReactNode> = {
  "generalized-polygon-schemes": <Doily id="reg-doily" />,
  "tits-group-orbital-configurations": <OrbitRings id="reg-orbits" />,
  "protein-error-prediction": <BeadChain count={18} />,
};

export const metadata: Metadata = {
  title: "Research",
  description: "A register of research projects — each with its question, method, results, limits and current status.",
  alternates: { canonical: "/research" },
};

export default async function Research() {
  const projects = (await getCollection("research")).sort((a, b) => a.data.order - b.data.order);
  const statuses = researchStatuses
    .map((s) => [s, projects.filter((p) => p.data.status === s).length] as const)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${s.toLowerCase()}`)
    .join("; ");
  return (
    <>
      <PageHead
        slug="research"
        title="Register of projects"
        standfirst="What I'm working on, and how far each project has got."
        meta={
          <Meta
            items={[
              ["Projects", String(projects.length)],
              ["Status", statuses || "—"],
              ["Fields", Array.from(new Set(projects.map((p) => p.data.field))).join("; ")],
            ]}
          />
        }
      />
      <ol className="sheet mt-16 lg:mt-24">
        {projects.map((p) => (
          <li key={p.slug} className="sheet-row">
            <Rule heavy />
            <div className="col-rail pt-5 lg:pt-6">
              <p className="text-[1.375rem] leading-none tnum">{p.data.period}</p>
              <Status status={p.data.status} className="mt-2 block" />
            </div>
            <div className="col-text pt-2 lg:pt-5 pb-12 lg:pb-16">
              <p className="label label-muted">
                No. {String(p.data.order).padStart(2, "0")} — {p.data.field}
              </p>
              <h2 className="mt-3 text-[1.875rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.01em]">
                <Link href={`/research/${p.slug}`} className="link-quiet">
                  {p.data.title}
                </Link>
              </h2>
              <p className="mt-4 text-ink-2">{p.data.summary}</p>
              <p className="mt-4 text-note italic text-ink-2">
                <span className="label not-italic text-ink-3 mr-2">Question</span>
                {p.data.question}
              </p>
              <p className="mt-5 text-note">
                <Link href={`/research/${p.slug}`}>Read the write-up</Link>
              </p>
            </div>
            <div className="col-margin lg:pt-7 pb-12 lg:pb-0 -mt-6 lg:mt-0">
              {figures[p.slug] && <div className="mb-6 max-w-[14rem]">{figures[p.slug]}</div>}
              <Meta
                items={[
                  ["Revised", formatDate(p.data.date)],
                  ...(p.data.links?.length
                    ? ([["Sources", <Links key="l" links={p.data.links} />]] as [string, React.ReactNode][])
                    : []),
                ]}
              />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

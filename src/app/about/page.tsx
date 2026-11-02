import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { education, libraries, programming, teaching } from "@/data/profile";
import { MDX } from "@/components/mdx";
import { Meta, PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shreyan Chethan — student mathematician and independent researcher in Allen, Texas: biography, education, interests and teaching.",
  alternates: { canonical: "/about" },
};

export default async function About() {
  const { data, content } = await getPage("about");
  return (
    <article>
      <PageHead slug="about" title="A note on the author" />

      <div className="sheet mt-10 lg:mt-14">
        <div className="sheet-row">
          <p className="col-text text-[1.375rem] leading-[1.42] italic tracking-[-0.005em] sm:text-[1.625rem]">{data.lede}</p>
          <div className="col-margin lg:pt-2">
            <Meta
              items={[
                ["Pronouns", "they/them"],
                ["Based in", "Allen, Texas"],
                ["Currently", <Link key="c" href="/mathematics/fusion-theorem">Fusions of generalized polygon schemes</Link>],
              ]}
            />
          </div>
        </div>
        <div className="col-text prose-sheet mt-10">
          <MDX source={content} />
        </div>
      </div>

      <section aria-labelledby="education" className="sheet mt-24 lg:mt-28">
        <Rule heavy />
        <div className="sheet-row pt-5">
          <h2 id="education" className="col-rail label">
            Education
          </h2>
          <div className="col-text">
            <p className="text-[1.5rem] leading-tight">{education.school}</p>
            <p className="mt-1 text-ink-2 italic">
              {education.place} · {education.standing}
            </p>
            <dl className="mt-6 grid gap-x-8 gap-y-5 text-small sm:grid-cols-[9rem_1fr]">
              <dt className="label label-muted pt-1">Current courses</dt>
              <dd>{education.current.join(" · ")}</dd>
              <dt className="label label-muted pt-1">Earlier</dt>
              <dd>{education.earlier.join(" · ")}</dd>
              <dt className="label label-muted pt-1">Outside school</dt>
              <dd>{education.outside.join(" · ")}</dd>
              <dt className="label label-muted pt-1">AP examinations</dt>
              <dd>
                <ul className="grid gap-x-6 sm:grid-cols-2">
                  {education.apExams.map(([exam, score]) => (
                    <li key={exam} className="flex items-baseline gap-2">
                      <span>{exam}</span>
                      <span className="leaders" />
                      <span className="tnum">{score}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="programming" className="sheet mt-20 lg:mt-24">
        <Rule heavy />
        <div className="sheet-row pt-5">
          <h2 id="programming" className="col-rail label">
            Programming
          </h2>
          <dl className="col-text grid gap-x-8 gap-y-5 text-small sm:grid-cols-[9rem_1fr]">
            {programming.map((p) => (
              <div key={p.level} className="contents">
                <dt className="label label-muted pt-1">{p.level}</dt>
                <dd>{p.items.join(" · ")}</dd>
              </div>
            ))}
            {libraries.map((l) => (
              <div key={l.language} className="contents">
                <dt className="label label-muted pt-1">Libraries, {l.language}</dt>
                <dd className="font-mono text-note">{l.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="teaching" className="sheet mt-20 lg:mt-24">
        <Rule heavy />
        <div className="sheet-row pt-5">
          <h2 id="teaching" className="col-rail label">
            Teaching
          </h2>
        </div>
        <ol className="sheet-row mt-6">
          {teaching.map((t) => (
            <li key={t.where} className="sheet-row pt-5">
              <p className="col-rail label label-muted tnum pt-1">{t.when ?? ""}</p>
              <div className="col-text">
                <p className="text-[1.1875rem]">{t.where}</p>
                <p className="mt-1 text-ink-2">{t.what}</p>
              </div>
              <Rule className="mt-5" />
            </li>
          ))}
        </ol>
        <p className="col-text mt-6 text-note text-ink-3">
          Also: fabrication lead for FIRST Tech Challenge Team 12106 (2025–); competitive chess.
        </p>
      </section>
    </article>
  );
}

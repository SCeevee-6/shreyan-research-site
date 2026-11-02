import type { Metadata } from "next";
import { ensembles, inStudy, instrument } from "@/data/music";
import { site } from "@/site.config";
import { PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";

export const metadata: Metadata = {
  title: "Music",
  description: "Cello: orchestras, and the studies currently in progress.",
  alternates: { canonical: "/music" },
};

export default function Music() {
  return (
    <>
      <PageHead
        slug="music"
        title={instrument.name}
        standfirst={`I've played cello since ${instrument.since}.`}
      />

      {/* The one centred composition on the site: a concert programme. */}
      <section aria-labelledby="programme" className="sheet mt-16 lg:mt-24">
        <div className="col-sheet programme border-y-2 border-ink px-2 py-12 sm:py-16">
          <p className="label label-muted">In study</p>
          <h2 id="programme" className="mt-3 text-[2.5rem] leading-none italic sm:text-[3rem]">
            {instrument.name}
          </h2>
          <p className="mt-3 text-note text-ink-2">{site.name}</p>

          <div className="mx-auto mt-14 max-w-[34rem]">
            <p className="part label label-muted">Studies</p>
            {inStudy.map((w) => (
              <div key={w.composer} className="mt-10">
                <p className="composer">{w.composer}</p>
                <ul className="mt-2 space-y-0.5">
                  {w.numbers.map((n) => (
                    <li key={n} className="text-[1.375rem] leading-snug italic">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ensembles" className="sheet mt-24 lg:mt-32">
        <h2 id="ensembles" className="col-rail label">
          Orchestras
        </h2>
        <Rule heavy className="mt-3" />
        <ol className="sheet-row">
          {ensembles.map((e) => (
            <li key={e.what} className="sheet-row pt-5">
              {e.when && <p className="col-rail label label-muted tnum pt-1.5">{e.when}</p>}
              <p className="col-text text-[1.25rem] leading-snug">{e.what}</p>
              {e.detail && <p className="col-margin plain text-note italic text-ink-2 lg:pt-1">{e.detail}</p>}
              <Rule className="mt-5" />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

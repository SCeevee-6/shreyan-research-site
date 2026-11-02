import type { Metadata } from "next";
import Link from "next/link";
import { Rule } from "@/components/Rule";
import { eggs } from "./eggs";

export const metadata: Metadata = {
  title: "Appendix",
  description: "Things to play with.",
  robots: { index: false },
};

export default function Appendix() {
  return (
    <div className="sheet pt-16 lg:pt-24">
      <div className="sheet-row">
        <p className="col-rail label text-red pt-3">Appendix</p>
        <div className="col-text">
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] italic">Things to play with</h1>
          <p className="mt-4 text-lede text-ink-2">Not research. You found the back of the notebook.</p>
        </div>
      </div>
      <Rule heavy className="mt-12" />
      <ol className="sheet-row">
        {eggs.map((e, i) => (
          <li key={e.slug} className="sheet-row pt-6">
            <p className="col-rail label label-muted tnum pt-1.5">A.{i + 1}</p>
            <div className="col-text">
              <Link href={`/appendix/${e.slug}`} className="text-[1.5rem] leading-snug no-underline hover:text-red">
                {e.title}
              </Link>
              <p className="mt-1 text-note italic text-ink-2">{e.gloss}</p>
            </div>
            <Rule className="mt-6" />
          </li>
        ))}
      </ol>
    </div>
  );
}

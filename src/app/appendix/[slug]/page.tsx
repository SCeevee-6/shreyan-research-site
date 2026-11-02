import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eggs } from "../eggs";
import { Cello } from "@/components/eggs/Cello";
import { SetGame } from "@/components/eggs/SetGame";
import { LightsOut } from "@/components/eggs/LightsOut";
import { Harmonograph } from "@/components/eggs/Harmonograph";
import { Buffon } from "@/components/eggs/Buffon";

type Props = { params: Promise<{ slug: string }> };

const toys: Record<string, React.ReactNode> = {
  cello: <Cello />,
  set: <SetGame />,
  "lights-out": <LightsOut />,
  harmonograph: <Harmonograph />,
  buffon: <Buffon />,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return eggs.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const egg = eggs.find((e) => e.slug === slug);
  return egg ? { title: egg.title, description: egg.gloss, robots: { index: false } } : {};
}

export default async function Egg({ params }: Props) {
  const { slug } = await params;
  const i = eggs.findIndex((e) => e.slug === slug);
  if (i < 0) notFound();
  const egg = eggs[i];
  return (
    <div className="sheet pt-16 lg:pt-24">
      <div className="sheet-row">
        <p className="col-rail label text-red pt-3">A.{i + 1}</p>
        <div className="col-text">
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] italic">{egg.title}</h1>
          <p className="mt-3 text-ink-2">{egg.gloss}</p>
        </div>
        <div className="col-sheet mt-10">{toys[slug]}</div>
        <p className="col-text mt-14">
          <Link href="/appendix" className="label link-quiet">← Appendix</Link>
        </p>
      </div>
    </div>
  );
}

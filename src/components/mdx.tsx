import { evaluate } from "@mdx-js/mdx";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { IntersectionDiagram } from "./figures/IntersectionDiagram";
import { BeadChain } from "./figures/BeadChain";
import { Doily } from "./figures/Doily";
import { OrbitRings } from "./figures/OrbitRings";
import { FusionCheck } from "./figures/FusionCheck";
import { FusionLattice } from "./figures/FusionLattice";
import { Pencil } from "./Pencil";
import { RiskCoverage } from "./figures/RiskCoverage";
import { BiasHeatmap } from "./figures/BiasHeatmap";
import { FitVsLaw } from "./figures/FitVsLaw";
import { Gloss } from "./Gloss";
import { Plot } from "./figures/Plot";

type Kind = "theorem" | "lemma" | "proposition" | "corollary" | "definition" | "remark";
type EnvProps = { n?: number | string; name?: string; pencil?: string; children: React.ReactNode };

function makeComponents() {
  // Per-document counter so each sidenote's toggle has a stable, unique id.
  let note = 0;

  function Note({ children }: { children: React.ReactNode }) {
    const n = ++note;
    const id = `sn-${n}`;
    return (
      <>
        <label htmlFor={id} className="sn-ref">
          <span className="sr-only">Note {n}</span>
        </label>
        <input type="checkbox" id={id} className="sn-toggle" />
        <span className="sidenote" role="note">
          {children}
        </span>
      </>
    );
  }

  const env = (kind: Kind) =>
    function Env({ n, name, pencil, children }: EnvProps) {
      return (
        <div className="theorem" data-kind={kind}>
          <p className="theorem-head">
            {pencil ? <Pencil note={pencil}>{`${kind} ${n}`}</Pencil> : <>{kind} {n}</>}
            {name && <span className="theorem-name"> ({name})</span>}
          </p>
          <div className="theorem-body">{children}</div>
        </div>
      );
    };

  function Proof({ children, of }: { children: React.ReactNode; of?: string }) {
    return (
      <div className="proof">
        <p className="proof-head">Proof{of ? ` of ${of}` : ""}.</p>
        {children}
      </div>
    );
  }

  function Figure({ n, caption, wide, children }: { n: number | string; caption: React.ReactNode; wide?: boolean; children: React.ReactNode }) {
    return (
      <figure className={`figure !my-12 ${wide ? "fig-wide" : ""}`}>
        {children}
        <figcaption>
          <span className="label mr-2 text-ink">Fig. {n}</span>
          {caption}
        </figcaption>
      </figure>
    );
  }

  function References({ children }: { children: React.ReactNode }) {
    return (
      <section aria-labelledby="refs" className="refs">
        <h2 id="refs" className="label">References</h2>
        {children}
      </section>
    );
  }

  return {
    Note,
    Theorem: env("theorem"),
    Lemma: env("lemma"),
    Proposition: env("proposition"),
    Corollary: env("corollary"),
    Definition: env("definition"),
    Remark: env("remark"),
    Proof,
    Figure,
    References,
    IntersectionDiagram,
    BeadChain,
    Doily,
    OrbitRings,
    FusionCheck,
    FusionLattice,
    Pencil,
    RiskCoverage,
    BiasHeatmap,
    FitVsLaw,
    Gloss,
    Plot,
  };
}

export async function MDX({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    Fragment,
    jsx,
    jsxs,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: "ignore", trust: false }]],
  });
  return <Content components={makeComponents()} />;
}

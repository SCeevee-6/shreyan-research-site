"use client";

import { useState } from "react";

/**
 * Buffon's needle. Needles as long as the gap between the lines are dropped at random; the chance one
 * crosses a line is 2/π, so π ≈ 2 · dropped / crossed. It converges slowly — that's part of the joke.
 */
type Needle = { x1: number; y1: number; x2: number; y2: number; hit: boolean };
const W = 600;
const H = 360;
const GAP = 60;

function drop(): Needle {
  const cx = Math.random() * W;
  const cy = Math.random() * H;
  const a = Math.random() * Math.PI;
  const dx = (GAP / 2) * Math.cos(a);
  const dy = (GAP / 2) * Math.sin(a);
  const y1 = cy - dy;
  const y2 = cy + dy;
  return { x1: cx - dx, y1, x2: cx + dx, y2, hit: Math.floor(y1 / GAP) !== Math.floor(y2 / GAP) };
}

export function Buffon() {
  const [needles, setNeedles] = useState<Needle[]>([]);
  const [total, setTotal] = useState({ n: 0, hits: 0 });
  const add = (k: number) => {
    const fresh = Array.from({ length: k }, drop);
    setNeedles((ns) => [...ns, ...fresh].slice(-400));
    setTotal((t) => ({ n: t.n + k, hits: t.hits + fresh.filter((f) => f.hit).length }));
  };
  const est = total.hits ? (2 * total.n) / total.hits : null;

  return (
    <div className="buffon">
      <svg viewBox={`0 0 ${W} ${H}`} className="buffon-plot" role="img" aria-label={`${total.n} needles dropped`}>
        {Array.from({ length: H / GAP + 1 }, (_, i) => (
          <line key={i} x1={0} x2={W} y1={i * GAP} y2={i * GAP} className="buffon-line" />
        ))}
        {needles.map((n, i) => (
          <line key={i} {...n} className={`buffon-needle ${n.hit ? "is-hit" : ""}`} />
        ))}
      </svg>
      <div className="set-bar">
        <button type="button" className="egg-btn" onClick={() => add(1)}>drop one</button>
        <button type="button" className="egg-btn" onClick={() => add(100)}>drop 100</button>
        <button type="button" className="egg-btn" onClick={() => add(10000)}>drop 10 000</button>
        <span className="tnum">
          {total.n.toLocaleString("en-US")} dropped · {total.hits.toLocaleString("en-US")} cross · π ≈ {est ? est.toFixed(5) : "—"}
        </span>
      </div>
    </div>
  );
}

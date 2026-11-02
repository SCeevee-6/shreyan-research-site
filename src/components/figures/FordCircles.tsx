"use client";

import { useState } from "react";

/**
 * Ford circles on [0, 1]. Each fraction p/q gets a circle of radius 1/(2q²) resting on the line at
 * p/q; neighbours in the Farey sequence are tangent. Hover (or tap) the gap between two neighbours
 * and their mediant drops in.
 */
type F = [number, number];
const W = 1000;
const S = 900; // pixels per unit
const X0 = 50;
const BASE = 470;

export function FordCircles() {
  const [fr, setFr] = useState<F[]>([[0, 1], [1, 2], [1, 1]]);
  const add = (i: number) =>
    setFr((f) => {
      const [a, b] = f[i];
      const [c, d] = f[i + 1];
      if (b + d > 40) return f;
      return [...f.slice(0, i + 1), [a + c, b + d], ...f.slice(i + 1)];
    });

  return (
    <svg viewBox={`0 0 ${W} 500`} className="ford" role="img" aria-label="Ford circles: hover a gap between two circles to add their mediant.">
      <line x1={0} x2={W} y1={BASE} y2={BASE} className="fig-hair" strokeWidth={1} />
      {fr.map(([p, q]) => {
        const r = (S / (2 * q * q));
        return (
          <g key={`${p}/${q}`} className="ford-c">
            <circle cx={X0 + (S * p) / q} cy={BASE - r} r={r} />
            {q <= 12 && (
              <text x={X0 + (S * p) / q} y={BASE + 22} textAnchor="middle" fontSize={q < 5 ? 16 : 11}>
                {p}/{q}
              </text>
            )}
          </g>
        );
      })}
      {fr.slice(0, -1).map(([a, b], i) => {
        const [c, d] = fr[i + 1];
        const x1 = X0 + (S * a) / b;
        const x2 = X0 + (S * c) / d;
        return (
          <rect
            key={`g${a}/${b}`}
            x={x1}
            width={x2 - x1}
            y={BASE - 60}
            height={60}
            className="ford-gap"
            onMouseEnter={() => add(i)}
            onClick={() => add(i)}
          />
        );
      })}
    </svg>
  );
}

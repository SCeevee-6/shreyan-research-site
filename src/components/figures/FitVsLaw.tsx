"use client";

import { useState } from "react";

/**
 * An illustration (not pilot data) of the project's thesis. Two right-hand sides ẋ = f(x) for a
 * population, fitted to the same noisy samples. Both fit about equally well; one breaks a law —
 * at x = 0 a population must not decrease, f(0) ≥ 0 — and the verifier finds the counterexample.
 */
const TRUE = (x: number) => x * (1 - x);
const A = (x: number) => 0.99 * x - 0.98 * x * x;
const B = (x: number) => -0.03 + 1.13 * x - 1.12 * x * x;
// Deterministic "noise", so the page is the same on every visit.
const DATA = Array.from({ length: 12 }, (_, i) => {
  const x = 0.25 + (0.7 * i) / 11;
  return [x, TRUE(x) + 0.012 * Math.sin(7.3 * i + 1)] as const;
});
const rmse = (f: (x: number) => number) => Math.sqrt(DATA.reduce((s, [x, y]) => s + (f(x) - y) ** 2, 0) / DATA.length);

const W = 600;
const H = 300;
const P = { l: 46, r: 14, t: 16, b: 38 };
const X1 = 1.05;
const YLO = -0.06;
const YHI = 0.3;
const px = (x: number) => P.l + (x / X1) * (W - P.l - P.r);
const py = (y: number) => P.t + ((YHI - y) / (YHI - YLO)) * (H - P.t - P.b);
const curve = (f: (x: number) => number) =>
  Array.from({ length: 106 }, (_, i) => i / 100).map((x, i) => `${i ? "L" : "M"}${px(x).toFixed(1)} ${py(f(x)).toFixed(1)}`).join(" ");

export function FitVsLaw() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="fvl" role="group" aria-label="Fit versus law">
      <svg viewBox={`0 0 ${W} ${H}`} className="fvl-plot" role="img" aria-label="Two fitted curves for the growth rate against population. Both pass through the data; the red one is negative at zero population.">
        <rect x={px(0)} y={py(0)} width={px(1.05) - px(0)} height={py(YLO) - py(0)} className="fvl-forbidden" />
        <line x1={P.l} x2={W - P.r} y1={py(0)} y2={py(0)} className="fvl-axis" />
        <line x1={px(0)} x2={px(0)} y1={P.t} y2={H - P.b} className="fvl-axis" />
        <text x={(W + P.l) / 2} y={H - 8} textAnchor="middle" className="rc-tick">population x</text>
        <text x={14} y={P.t + 8} className="rc-tick">ẋ</text>
        <path d={curve(A)} className="fvl-a" />
        <path d={curve(B)} className={`fvl-b ${checked ? "is-caught" : ""}`} />
        {DATA.map(([x, y], i) => (
          <circle key={i} cx={px(x)} cy={py(y)} r={3.2} className="fvl-dot" />
        ))}
        {checked && (
          <g className="fvl-stamp">
            <circle cx={px(0)} cy={py(B(0))} r={7} />
            <text x={px(0) + 16} y={py(B(0)) + 26}>COUNTEREXAMPLE · x = 0, ẋ = {B(0).toFixed(2)} &lt; 0</text>
          </g>
        )}
      </svg>
      <div className="fvl-row">
        <p>
          <span className="fvl-key fvl-key-a" /> model A, error <span className="tnum">{rmse(A).toFixed(4)}</span>
        </p>
        <p>
          <span className="fvl-key fvl-key-b" /> model B, error <span className="tnum">{rmse(B).toFixed(4)}</span>
        </p>
        <button type="button" className="fvl-btn" onClick={() => setChecked((c) => !c)} aria-pressed={checked}>
          {checked ? "Reset" : "Check the law f(0) ≥ 0"}
        </button>
      </div>
      <p className="rc-note">
        An illustration, not pilot data. Both curves fit the samples about equally well, so accuracy can’t tell
        them apart. Model B says an extinct population shrinks, so it can go negative.
      </p>
    </div>
  );
}

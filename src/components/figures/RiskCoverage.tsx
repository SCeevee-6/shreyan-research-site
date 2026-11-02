"use client";

import { useState } from "react";
import { riskCoverage } from "@/data/esm2";

/**
 * The confirmatory risk–coverage curves (49 test assays) as a toy: drag the coverage down and watch
 * the mean rank error of what's kept. Every point is a row of the deposited results file.
 */
const W = 640;
const H = 300;
const P = { l: 52, r: 16, t: 14, b: 40 };
const Y0 = 0;
const Y1 = 0.27;
const x = (c: number) => P.l + (1 - c) * (W - P.l - P.r) / 0.99;
const y = (e: number) => P.t + (1 - (e - Y0) / (Y1 - Y0)) * (H - P.t - P.b);
const path = (pts: [number, number][]) => pts.map(([c, e], i) => `${i ? "L" : "M"}${x(c).toFixed(1)} ${y(e).toFixed(1)}`).join(" ");

const LINES = [
  { key: "model", label: "error model", cls: "rc-model" },
  { key: "B-best", label: "wild-type log-prob", cls: "rc-base" },
  { key: "B-rand", label: "random", cls: "rc-rand" },
  { key: "oracle", label: "oracle", cls: "rc-oracle" },
] as const;

export function RiskCoverage() {
  const [cov, setCov] = useState(100);
  const at = (k: (typeof LINES)[number]["key"]) => riskCoverage[k].find(([c]) => Math.round(c * 100) === cov)![1];

  return (
    <div className="rc" role="group" aria-label="Risk–coverage explorer">
      <svg viewBox={`0 0 ${W} ${H}`} className="rc-plot" aria-hidden="true">
        {[0, 0.05, 0.1, 0.15, 0.2, 0.25].map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="rc-grid" />
            <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="rc-tick">{t.toFixed(2)}</text>
          </g>
        ))}
        {[1, 0.75, 0.5, 0.25, 0.01].map((c) => (
          <text key={c} x={x(c)} y={H - P.b + 18} textAnchor="middle" className="rc-tick">{Math.round(c * 100)}%</text>
        ))}
        <text x={(W + P.l) / 2} y={H - 4} textAnchor="middle" className="rc-tick">share of predictions kept</text>
        {LINES.map((l) => (
          <path key={l.key} d={path(riskCoverage[l.key])} className={`rc-line ${l.cls}`} />
        ))}
        <line x1={x(cov / 100)} x2={x(cov / 100)} y1={P.t} y2={H - P.b} className="rc-cursor" />
        {LINES.map((l) => (
          <circle key={l.key} cx={x(cov / 100)} cy={y(at(l.key))} r={3.5} className={`rc-dot ${l.cls}`} />
        ))}
      </svg>
      <label className="rc-slider">
        <span className="label">Keep</span>
        <input type="range" min={1} max={100} value={cov} onChange={(e) => setCov(Number(e.target.value))} />
        <span className="tnum">{cov}%</span>
      </label>
      <dl className="rc-out" aria-live="polite">
        {LINES.map((l) => (
          <div key={l.key}>
            <dt className={l.cls}>{l.label}</dt>
            <dd className="tnum">{at(l.key).toFixed(3)}</dd>
          </div>
        ))}
      </dl>
      <p className="rc-note">
        Mean rank error of the predictions kept, averaged over the 49 test assays. Lower is better; at 100% every method keeps
        everything and they meet at 0.246.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";

/**
 * A small calculator for Theorem 1. Pick a hexagon or octagon and an order (s, t); it reports the
 * point count, the classical necessary conditions for a thick polygon of that order, and whether
 * the distance scheme has a proper fusion. Everything is integer arithmetic — no claims beyond
 * what the page proves or cites.
 */
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

export function FusionCheck() {
  const [d, setD] = useState<3 | 4>(3);
  const [s, setS] = useState(2);
  const [t, setT] = useState(2);

  const points = d === 3 ? (1 + s) * (1 + s * t + s * s * t * t) : (1 + s) * (1 + s * t) * (1 + s * s * t * t);
  const feit = d === 3 ? isSquare(s * t) : isSquare(2 * s * t);
  const bound = d === 3 ? s <= t ** 3 && t <= s ** 3 : s <= t * t && t <= s * s;
  const q = s;
  const srg =
    d === 3 && s === t ? [(q ** 6 - 1) / (q - 1), q * (q + 1) * (q * q + 1), q ** 3 + q * q + q - 1, (q + 1) * (q * q + 1)] : null;

  const num = (label: string, value: number, set: (n: number) => void) => (
    <label className="fc-field">
      <span className="label">{label}</span>
      <input
        type="number"
        min={2}
        max={64}
        value={value}
        onChange={(e) => set(Math.min(64, Math.max(2, Math.round(Number(e.target.value) || 2))))}
      />
    </label>
  );

  return (
    <div className="fc" role="group" aria-label="Fusion calculator">
      <div className="fc-inputs">
        <fieldset className="fc-field">
          <legend className="label">Polygon</legend>
          <div className="fc-toggle">
            {([3, 4] as const).map((k) => (
              <button key={k} type="button" aria-pressed={d === k} onClick={() => setD(k)}>
                {k === 3 ? "hexagon" : "octagon"}
              </button>
            ))}
          </div>
        </fieldset>
        {num("s", s, setS)}
        {num("t", t, setT)}
      </div>
      <dl className="fc-out" aria-live="polite">
        <dt>points</dt>
        <dd>{points.toLocaleString("en-US")}</dd>
        <dt>Feit–Higman</dt>
        <dd>
          {d === 3 ? `st = ${s * t}` : `2st = ${2 * s * t}`} {feit ? "is a square ✓" : "is not a square ✗"}
        </dd>
        <dt>{d === 3 ? "Haemers–Roos" : "Higman"}</dt>
        <dd>
          {d === 3 ? "s ≤ t³ and t ≤ s³" : "s ≤ t² and t ≤ s²"} {bound ? "✓" : "✗"}
        </dd>
        <dt>proper fusion</dt>
        <dd>
          {s === t ? (
            <>
              yes, unique: A<sub>0</sub>, A<sub>1</sub>+…+A<sub>{d - 1}</sub>, A<sub>{d}</sub>
              {srg && <span className="fc-srg">strongly regular, ({srg.map((n) => n.toLocaleString("en-US")).join(", ")})</span>}
            </>
          ) : (
            "none (s ≠ t)"
          )}
        </dd>
      </dl>
      <p className="fc-note">
        The fusion answer holds for any graph with this intersection array. The two middle rows are necessary
        conditions only; passing them doesn’t mean such a polygon exists.
      </p>
    </div>
  );
}

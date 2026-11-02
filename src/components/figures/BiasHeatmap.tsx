"use client";

import { useState } from "react";
import { pairTable } from "@/data/esm2";

/**
 * The deposited substitution-pair table (162 development assays) as a 20×20 grid: rows are the
 * wild-type residue, columns the mutant. Shade = raw mean rank error of ESM-2 for that substitution.
 * Mutant residues marked in red are the ones ESM-2 ranks as more damaging than measured (Fig. 2).
 */
const AA = "GAVLIMFWYCPSTNQDEKRH".split("");
const HARSH = new Set(["C", "W", "M", "Y", "F"]);
const cell = new Map(pairTable.map(([w, m, n, e]) => [`${w}${m}`, { n, e }]));
const es = pairTable.map((p) => p[3]);
const LO = Math.min(...es);
const HI = Math.max(...es);
const GRAND = 0.2345; // grand mean rank error, pair_table_log.json

export function BiasHeatmap() {
  const [hover, setHover] = useState<string | null>(null);
  const [col, setCol] = useState<string | null>(null);
  const h = hover ? cell.get(hover) : null;
  const S = 22;
  const O = 24;

  return (
    <div className="hm">
      <svg viewBox={`0 0 ${O + 20 * S + 2} ${O + 20 * S + 2}`} className="hm-plot" role="img" aria-label="Substitution-pair error table, 20 by 20. Hover a cell for the exact value.">
        {AA.map((a, i) => (
          <g key={a}>
            <text x={O + i * S + S / 2} y={O - 7} textAnchor="middle" className={`hm-lab hm-col ${HARSH.has(a) ? "is-harsh" : ""} ${col === a ? "is-on" : ""}`} onClick={() => setCol(col === a ? null : a)}>
              {a}
            </text>
            <text x={O - 7} y={O + i * S + S / 2 + 4} textAnchor="end" className="hm-lab">
              {a}
            </text>
          </g>
        ))}
        {AA.map((w, i) =>
          AA.map((m, j) => {
            const c = cell.get(w + m);
            if (!c) return <rect key={w + m} x={O + j * S} y={O + i * S} width={S - 2} height={S - 2} className="hm-diag" />;
            const dim = col && col !== m;
            return (
              <rect
                key={w + m}
                x={O + j * S}
                y={O + i * S}
                width={S - 2}
                height={S - 2}
                className={`hm-cell ${hover === w + m ? "is-hover" : ""}`}
                style={{ fill: c.e > GRAND ? "var(--red)" : "var(--ink)", fillOpacity: dim ? 0.06 : 0.08 + 0.85 * Math.abs(c.e - GRAND) / Math.max(HI - GRAND, GRAND - LO) }}
                onMouseEnter={() => setHover(w + m)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setCol(col === m ? null : m)}
              />
            );
          }),
        )}
      </svg>
      <p className="hm-read" aria-live="polite">
        {h && hover ? (
          <>
            <span className="tnum">{hover[0]}→{hover[1]}</span>: mean rank error <span className="tnum">{h.e.toFixed(3)}</span>,
            over <span className="tnum">{h.n.toLocaleString("en-US")}</span> mutations
          </>
        ) : (
          <>Rows: wild type. Columns: mutant. Red is worse than the average {GRAND.toFixed(3)}, ink better. Click a mutant to isolate it.</>
        )}
      </p>
    </div>
  );
}

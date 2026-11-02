"use client";

import { useState } from "react";

/**
 * The fusion test for the Tits group on 1755 points, run live on the intersection numbers (1) of
 * Note 2. B[i][j][k] = p_{ij}^k. Click an orbital to move it to the next block; the partition is a
 * fusion exactly when, for every pair of blocks I, J, the sum of p_{ij}^k over i in I, j in J is the
 * same for every k in a block K.
 */
const B: number[][][] = [
  [], // B_0 = I, not needed
  [[0, 1, 0, 0, 0], [10, 1, 1, 0, 0], [0, 8, 1, 1, 0], [0, 0, 8, 1, 5], [0, 0, 0, 8, 5]],
  [[0, 0, 1, 0, 0], [0, 8, 1, 1, 0], [80, 8, 6, 1, 5], [0, 64, 8, 38, 25], [0, 0, 64, 40, 50]],
  [[0, 0, 0, 1, 0], [0, 0, 8, 1, 5], [0, 64, 8, 38, 25], [640, 64, 304, 200, 250], [0, 512, 320, 400, 360]],
  [[0, 0, 0, 0, 1], [0, 0, 0, 8, 5], [0, 0, 64, 40, 50], [0, 512, 320, 400, 360], [1024, 512, 640, 576, 608]],
];
const K = [1, 10, 80, 640, 1024];
const NAMES = ["a", "b", "c", "d"];

type Verdict = { ok: true } | { ok: false; I: number[]; J: number[]; k1: number; v1: number; k2: number; v2: number };

function check(assign: number[]): Verdict {
  const blocks = [...new Set(assign)].map((b) => [1, 2, 3, 4].filter((i) => assign[i - 1] === b));
  for (const I of blocks)
    for (const J of blocks)
      for (const Kb of blocks) {
        const val = (k: number) => I.reduce((s, i) => s + J.reduce((t, j) => t + B[i][j][k], 0), 0);
        const v1 = val(Kb[0]);
        for (const k of Kb.slice(1)) {
          const v2 = val(k);
          if (v2 !== v1) return { ok: false, I, J, k1: Kb[0], v1, k2: k, v2 };
        }
      }
  return { ok: true };
}

const set = (I: number[]) => `R${I.join("+")}`;

export function FusionLattice() {
  const [assign, setAssign] = useState([0, 1, 2, 3]);
  const v = check(assign);
  const nBlocks = new Set(assign).size;
  const trivial = nBlocks === 1 || nBlocks === 4;

  return (
    <div className="fl" role="group" aria-label="Fusion explorer">
      <p className="fl-hint">Click an orbital to move it into another block.</p>
      <div className="fl-row">
        {[1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            className="fl-chip"
            data-block={assign[i - 1]}
            onClick={() => setAssign((a) => a.map((b, j) => (j === i - 1 ? (b + 1) % 4 : b)))}
            aria-label={`R${i}, valency ${K[i]}, in block ${NAMES[assign[i - 1]]}`}
          >
            <span className="italic">R</span>
            <sub>{i}</sub>
            <span className="fl-k">{K[i]}</span>
            <span className="fl-block">{NAMES[assign[i - 1]]}</span>
          </button>
        ))}
      </div>
      <p className={`fl-verdict ${v.ok ? "is-ok" : "is-bad"}`} aria-live="polite">
        {v.ok ? (
          <>✓ closes{trivial ? " — but it’s a trivial partition" : " — a proper fusion!"}</>
        ) : (
          <>
            ✗ doesn’t close: in {set(v.I)} · {set(v.J)}, the coefficient of R{v.k1} is {v.v1} but of R{v.k2} is{" "}
            {v.v2}
          </>
        )}
      </p>
    </div>
  );
}

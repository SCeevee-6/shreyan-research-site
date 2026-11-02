"use client";

import { useEffect, useState } from "react";

/**
 * Lights Out on a 5×5 board. Pressing a cell flips it and its four neighbours; the goal is a dark
 * board. Over F₂ the press matrix has a 2-dimensional kernel, so only a quarter of all boards can be
 * solved. The hint solves the linear system and points at one press of a solution.
 */
const N = 5;
const press = (b: number[], i: number) => {
  const r = Math.floor(i / N);
  const c = i % N;
  const out = [...b];
  for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const rr = r + dr;
    const cc = c + dc;
    if (rr >= 0 && rr < N && cc >= 0 && cc < N) out[rr * N + cc] ^= 1;
  }
  return out;
};

/** Gaussian elimination over F₂: which cells to press to clear board b (null if unsolvable). */
function solve(b: number[]): number[] | null {
  const M = N * N;
  // Row i of the system: which presses flip cell i, and whether cell i is lit.
  const rows = Array.from({ length: M }, (_, i) => [...Array.from({ length: M }, (_, j) => press(Array(M).fill(0), j)[i]), b[i]]);
  const piv: number[] = [];
  let r = 0;
  for (let c = 0; c < M && r < M; c++) {
    const p = rows.findIndex((row, k) => k >= r && row[c]);
    if (p < 0) continue;
    [rows[r], rows[p]] = [rows[p], rows[r]];
    rows.forEach((row, k) => {
      if (k !== r && row[c]) for (let j = c; j <= M; j++) row[j] ^= rows[r][j];
    });
    piv.push(c);
    r++;
  }
  if (rows.slice(r).some((row) => row[M])) return null;
  const x = Array(M).fill(0);
  piv.forEach((c, k) => (x[c] = rows[k][M]));
  return x;
}

export function LightsOut() {
  const [board, setBoard] = useState<number[]>(Array(N * N).fill(0));
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState<number | null>(null);

  const scramble = () => {
    let b = Array(N * N).fill(0);
    for (let k = 0; k < 12; k++) b = press(b, Math.floor(Math.random() * N * N));
    if (b.every((v) => !v)) b = press(b, 12);
    setBoard(b);
    setMoves(0);
    setHint(null);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect -- random board on the client only
  useEffect(scramble, []);

  const won = board.every((v) => !v) && moves > 0;

  return (
    <div className="lo">
      <div className="lo-grid" role="grid" aria-label="Lights Out board">
        {board.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`lo-cell ${v ? "is-on" : ""} ${hint === i ? "is-hint" : ""}`}
            aria-label={`row ${Math.floor(i / N) + 1}, column ${(i % N) + 1}, ${v ? "lit" : "dark"}`}
            onClick={() => {
              setBoard(press(board, i));
              setMoves((m) => m + 1);
              setHint(null);
            }}
          />
        ))}
      </div>
      <div className="set-bar">
        <span className="tnum">{moves} presses</span>
        <button type="button" className="egg-btn" onClick={() => setHint(solve(board)?.findIndex((x) => x) ?? null)}>
          hint
        </button>
        <button type="button" className="egg-btn" onClick={scramble}>
          new board
        </button>
      </div>
      {won && <p className="egg-win">Dark. {moves} presses.</p>}
    </div>
  );
}

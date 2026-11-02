"use client";

import { useState } from "react";
import { IntersectionDiagram } from "./IntersectionDiagram";

/** The cover plate as a toy: two sliders set (s, t); the red fusion bracket appears exactly when s = t. */
export function PlatePlay() {
  const [s, setS] = useState(2);
  const [t, setT] = useState(2);
  const slider = (name: string, v: number, set: (n: number) => void) => (
    <label className="plate-slider">
      <span className="italic">{name}</span>
      <input type="range" min={2} max={4} step={1} value={v} onChange={(e) => set(Number(e.target.value))} />
      <span className="tnum w-3">{v}</span>
    </label>
  );
  return (
    <div>
      <IntersectionDiagram s={s} t={t} id="plate" />
      <div className="plate-controls">
        {slider("s", s, setS)}
        {slider("t", t, setT)}
        <span className={`plate-verdict ${s === t ? "is-fused" : ""}`} aria-live="polite">
          {s === t ? "fuses" : "no fusion"}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

/**
 * A harmonograph: two damped pendulums, one swinging the pen left–right and one up–down. When their
 * frequencies are in a simple ratio you get a closed Lissajous figure; nudge it off and the figure
 * slowly precesses while the swing dies away.
 */
export function Harmonograph() {
  const [ratio, setRatio] = useState(1.5);
  const [detune, setDetune] = useState(0.006);
  const [phase, setPhase] = useState(0.5);
  const [damp, setDamp] = useState(0.0035);

  const d = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < 6000; i++) {
      const t = i * 0.05;
      const e = Math.exp(-damp * t);
      const x = e * (Math.sin(t + phase) + 0.35 * Math.sin(t * (2 + detune)));
      const y = e * (Math.sin(t * (ratio + detune) ) + 0.35 * Math.sin(t * (3 - detune) + 1.2));
      pts.push(`${i ? "L" : "M"}${(200 + 140 * x).toFixed(1)} ${(200 + 140 * y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [ratio, detune, phase, damp]);

  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number, step: number) => (
    <label className="egg-slider">
      <span className="italic">{label}</span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} />
      <span className="tnum">{v.toFixed(step < 0.01 ? 4 : 2)}</span>
    </label>
  );

  return (
    <div className="harmono">
      <svg viewBox="0 0 400 400" className="harmono-plot" role="img" aria-label="Harmonograph drawing">
        <path key={d.length + ratio + detune + phase + damp} d={d} pathLength={1} className="harmono-path" />
      </svg>
      <div className="harmono-ctl">
        {slider("frequency ratio", ratio, setRatio, 1, 3, 0.25)}
        {slider("detune", detune, setDetune, 0, 0.03, 0.001)}
        {slider("phase", phase, setPhase, 0, 3.14, 0.01)}
        {slider("damping", damp, setDamp, 0.0005, 0.01, 0.0005)}
      </div>
    </div>
  );
}

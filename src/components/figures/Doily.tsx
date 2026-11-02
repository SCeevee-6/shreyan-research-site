"use client";

import { useEffect, useState } from "react";

/**
 * The generalized quadrangle GQ(2,2) — "the doily". Points are the 15 two-element subsets of
 * {1,…,6}; lines are the 15 synthemes (three disjoint pairs). Two points are collinear iff disjoint.
 * The 5-cycle (1 2 3 4 5) gives the 5-fold symmetry of the drawing. Every incidence is computed.
 *
 * A red point walks the geometry: point → a line through it → another point on that line. Hovering
 * or focusing a point lights up its three lines. Under reduced motion the walk stops.
 */

type P = [number, number];
const C: P = [300, 300];

function pairs() {
  const out: [number, number][] = [];
  for (let a = 1; a <= 6; a++) for (let b = a + 1; b <= 6; b++) out.push([a, b]);
  return out;
}

/** Ring and angle from the orbit of the pair under (1 2 3 4 5). */
function place([a, b]: [number, number]): P {
  const ang = (k: number) => -Math.PI / 2 + (2 * Math.PI * k) / 5;
  const at = (r: number, t: number): P => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t)];
  if (b === 6) return at(70, ang(a - 1) + Math.PI); // {i,6}: inner ring, on the spoke of its straight line
  const d = (b - a + 5) % 5;
  if (d === 1 || d === 4) {
    // {i,i+1}: outer ring, placed between i and i+1
    const i = d === 1 ? a : b;
    return at(250, ang(i - 1) + Math.PI / 5);
  }
  // {i,i+2}: middle ring, opposite the skipped element
  const i = d === 2 ? a : b;
  return at(165, ang(i + 1 - 1) + Math.PI);
}

/** Circle through three points, or null if they are collinear. */
function circumcircle([ax, ay]: P, [bx, by]: P, [cx, cy]: P) {
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-6) return null;
  const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
  const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
  return { x: ux, y: uy, r: Math.hypot(ax - ux, ay - uy) };
}

/** The shortest arc of a circle passing through the three points in order around it. */
function linePath(pts: P[]) {
  const c = circumcircle(pts[0], pts[1], pts[2]);
  if (!c || c.r > 2000) {
    const s = [...pts].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    return `M ${s[0][0]} ${s[0][1]} L ${s[2][0]} ${s[2][1]}`;
  }
  // Order the points by angle and drop the largest gap: the arc covers the other two gaps.
  const withT = pts.map((p) => ({ p, t: Math.atan2(p[1] - c.y, p[0] - c.x) })).sort((u, v) => u.t - v.t);
  const gaps = withT.map((u, i) => {
    const v = withT[(i + 1) % 3];
    return (v.t - u.t + 2 * Math.PI) % (2 * Math.PI);
  });
  const g = gaps.indexOf(Math.max(...gaps));
  const start = withT[(g + 1) % 3].p;
  const mid = withT[(g + 2) % 3].p;
  const end = withT[g].p;
  // Two arcs (start→mid, mid→end), each going the increasing-angle way, keep the path exactly on the points.
  const g1 = gaps[(g + 1) % 3];
  const g2 = gaps[(g + 2) % 3];
  const r = c.r.toFixed(2);
  const f = (p: P) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  return `M ${f(start)} A ${r} ${r} 0 ${g1 > Math.PI ? 1 : 0} 1 ${f(mid)} A ${r} ${r} 0 ${g2 > Math.PI ? 1 : 0} 1 ${f(end)}`;
}

function geometry() {
  const pts = pairs();
  const key = (p: [number, number]) => `${p[0]}${p[1]}`;
  const lines: number[][] = [];
  const seen = new Set<string>();
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j <= i || p.some((x) => q.includes(x))) return;
      const rest = [1, 2, 3, 4, 5, 6].filter((x) => !p.includes(x) && !q.includes(x)) as [number, number];
      const k = pts.findIndex((r) => key(r) === key(rest));
      const id = [i, j, k].sort((a, b) => a - b).join("-");
      if (!seen.has(id)) {
        seen.add(id);
        lines.push([i, j, k].sort((a, b) => a - b));
      }
    }),
  );
  const pos = pts.map(place);
  return { pts, pos, lines, paths: lines.map((l) => linePath(l.map((i) => pos[i]))) };
}

const G = geometry();

export function Doily({ id = "doily", className = "" }: { id?: string; className?: string }) {
  const g = G;
  const [walk, setWalk] = useState({ point: 0, line: g.lines.findIndex((l) => l.includes(0)) });
  const [hover, setHover] = useState<number | null>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let step = 0;
    const t = window.setInterval(() => {
      step++;
      setMotion(true);
      setWalk((w) => {
        // Move to another point on the current line, then choose a new line through it.
        const others = g.lines[w.line].filter((p) => p !== w.point);
        const point = others[step % 2];
        const through = g.lines.map((l, i) => [l, i] as const).filter(([l, i]) => l.includes(point) && i !== w.line);
        const line = through[step % through.length][1];
        return { point, line };
      });
    }, 1400);
    return () => window.clearInterval(t);
  }, [g]);

  const lit = hover === null ? new Set<number>() : new Set(g.lines.flatMap((l, i) => (l.includes(hover) ? [i] : [])));

  return (
    <svg viewBox="0 0 600 600" role="img" aria-labelledby={`${id}-t`} className={`doily ${className}`}>
      <title id={`${id}-t`}>
        The generalized quadrangle of order 2, drawn as the doily: 15 points and 15 lines, three points on every
        line and three lines through every point.
      </title>
      {g.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          className={`doily-line ${lit.has(i) ? "is-lit" : ""} ${motion && walk.line === i ? "is-walk" : ""}`}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {g.pos.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={hover === i ? 11 : 8}
            className={`doily-point ${hover === i ? "is-lit" : ""}`}
            tabIndex={0}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          >
            <title>{`Point {${g.pts[i].join(",")}}`}</title>
          </circle>
        </g>
      ))}
      {motion && (
        <circle cx={g.pos[walk.point][0]} cy={g.pos[walk.point][1]} r={14} className="doily-walker" aria-hidden="true" />
      )}
    </svg>
  );
}

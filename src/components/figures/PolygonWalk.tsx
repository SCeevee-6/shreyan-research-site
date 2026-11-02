import { DrawIn } from "./DrawIn";

/** Vertices of a regular n-gon, first vertex at the top. */
function polygon(n: number, cx: number, cy: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as const;
  });
}

const path = (pts: readonly (readonly [number, number])[]) =>
  `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;

/**
 * The thin generalized hexagon and octagon — an ordinary hexagon and octagon — with a point walking
 * their edges. Decorative: the moving points are hidden under reduced motion.
 */
export function PolygonWalk() {
  const shapes = [
    { n: 6, cx: 250, cy: 100, r: 72, dur: 9 },
    { n: 8, cx: 750, cy: 100, r: 78, dur: 12 },
  ];
  return (
    <DrawIn>
      <svg viewBox="0 0 1000 200" aria-hidden="true" className="block w-full">
        {shapes.map(({ n, cx, cy, r, dur }, s) => {
          const pts = polygon(n, cx, cy, r);
          const d = path(pts);
          return (
            <g key={n}>
              <path id={`walk-${n}`} d={d} className="fig-ink" strokeWidth={1.25} pathLength={1} data-draw style={{ "--d": `${s * 300}ms` } as React.CSSProperties} />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={4} style={{ fill: "var(--paper)" }} className="fig-ink" strokeWidth={1.25} />
              ))}
              <circle r={6} className="walker" style={{ fill: "var(--red)" }}>
                <animateMotion dur={`${dur}s`} repeatCount="indefinite">
                  <mpath href={`#walk-${n}`} />
                </animateMotion>
              </circle>
              <circle r={3.5} className="walker" style={{ fill: "var(--ink-3)" }}>
                <animateMotion dur={`${dur * 1.5}s`} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                  <mpath href={`#walk-${n}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>
    </DrawIn>
  );
}

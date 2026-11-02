/**
 * The Tits group on 1755 points, seen from one point: the five orbitals as rings of 1, 10, 80, 640
 * and 1024 points. The two outer rings are thinned 4:1 so they stay legible (160 and 256 dots drawn).
 * Each ring turns at its own speed; the centre point and its ten neighbours are in red.
 */
export function OrbitRings({ id = "orbits", className = "" }: { id?: string; className?: string }) {
  const rings = [
    { n: 1, shown: 1, r: 0, dot: 6 },
    { n: 10, shown: 10, r: 52, dot: 5 },
    { n: 80, shown: 80, r: 112, dot: 3 },
    { n: 640, shown: 160, r: 176, dot: 2.2 },
    { n: 1024, shown: 256, r: 244, dot: 1.8 },
  ];
  return (
    <svg viewBox="0 0 600 600" role="img" aria-labelledby={`${id}-t`} className={`orbits ${className}`}>
      <title id={`${id}-t`}>
        The Tits group acting on 1755 points, seen from one point: rings of 1, 10, 80, 640 and 1024 points at
        distance 0 to 4. The two outer rings are drawn at one dot per four points.
      </title>
      {rings.slice(1).map((ring, k) => (
        <circle key={`o${k}`} cx={300} cy={300} r={ring.r} className="fig-hair" strokeWidth={1} />
      ))}
      {rings.map((ring, k) => (
        <g key={k} className="orbit-ring" style={{ "--k": k } as React.CSSProperties}>
          {Array.from({ length: ring.shown }, (_, i) => {
            const t = (2 * Math.PI * i) / ring.shown + k * 0.3;
            return (
              <circle
                key={i}
                cx={300 + ring.r * Math.cos(t)}
                cy={300 + ring.r * Math.sin(t)}
                r={ring.dot}
                style={{ fill: k <= 1 ? "var(--red)" : "var(--ink-3)" }}
              />
            );
          })}
        </g>
      ))}
      <g className="orbit-ring" style={{ "--k": 1 } as React.CSSProperties}>
      {Array.from({ length: 10 }, (_, i) => {
        const t = (2 * Math.PI * i) / 10 + 0.3;
        return (
          <line
            key={`s${i}`}
            x1={300}
            y1={300}
            x2={300 + 52 * Math.cos(t)}
            y2={300 + 52 * Math.sin(t)}
            className="orbit-spoke"
            style={{ "--i": i } as React.CSSProperties}
          />
        );
      })}
      </g>
      <g className="orbit-labels" aria-hidden="true">
        {rings.slice(1).map((ring, k) => (
          <text key={k} x={300 + ring.r + 6} y={296} fontSize={13} className="fig-text">
            {ring.n}
          </text>
        ))}
      </g>
    </svg>
  );
}

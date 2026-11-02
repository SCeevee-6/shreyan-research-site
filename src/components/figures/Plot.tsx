type Series = { label: string; points: [number, number][]; accent?: boolean };

/** A plain scientific line plot: hairline grid, ink series, the reference series in red. */
export function Plot({
  series,
  xLabel,
  yLabel,
  xTicks,
  yTicks,
  logX = false,
  title,
}: {
  series: Series[];
  xLabel: string;
  yLabel: string;
  xTicks: number[];
  yTicks: number[];
  logX?: boolean;
  title: string;
}) {
  const W = 640, H = 360, L = 56, R = 16, T = 16, B = 52;
  const fx = (v: number) => (logX ? Math.log10(v) : v);
  const xs = xTicks.map(fx);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...yTicks), Math.max(...yTicks)];
  const sx = (v: number) => L + ((fx(v) - x0) / (x1 - x0)) * (W - L - R);
  const sy = (v: number) => H - B - ((v - y0) / (y1 - y0)) * (H - T - B);
  const midY = (T + H - B) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={L} x2={W - R} y1={sy(t)} y2={sy(t)} className="fig-hair" strokeWidth={0.75} strokeDasharray={t === y0 ? undefined : "2 4"} />
          <text x={L - 10} y={sy(t) + 4} textAnchor="end" fontSize={12} className="fig-text">{t}</text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={sx(t)} x2={sx(t)} y1={H - B} y2={H - B + 6} className="fig-ink" strokeWidth={1} />
          <text x={sx(t)} y={H - B + 22} textAnchor="middle" fontSize={12} className="fig-text">{t}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} className="fig-ink" strokeWidth={1} />
      <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize={12} className="fig-text">{xLabel}</text>
      <text x={14} y={midY} textAnchor="middle" fontSize={12} className="fig-text" transform={`rotate(-90 14 ${midY})`}>{yLabel}</text>
      {series.map((s) => {
        const d = s.points.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ");
        const [lx, ly] = s.points[s.points.length - 1];
        const colour = s.accent ? "var(--red)" : "var(--ink)";
        return (
          <g key={s.label}>
            <path d={d} className={s.accent ? "fig-red" : "fig-ink"} strokeWidth={1.5} />
            {s.points.map(([x, y]) => (
              <circle key={x} cx={sx(x)} cy={sy(y)} r={2.75} style={{ fill: colour }} />
            ))}
            <text x={sx(lx)} y={sy(ly) - 12} textAnchor="end" fontSize={12} className="fig-text" style={{ fill: s.accent ? "var(--red)" : "var(--ink-2)" }}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

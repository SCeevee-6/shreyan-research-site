import { DrawIn } from "./DrawIn";

type Props = {
  /** Order (s, t) of the generalized hexagon. */
  s?: number;
  t?: number;
  /** Mark the fusion A_1 + A_2 (only a scheme when s = t). */
  fusion?: boolean;
  title?: string;
  className?: string;
  id?: string;
};

const W = 1000;
const H = 300;
const CY = 120;

/**
 * Intersection diagram of a distance-regular graph with the array of a generalized hexagon of
 * order (s, t): b_0 = s(t+1), b_1 = b_2 = st; c_1 = c_2 = 1, c_3 = t+1; a_i = s-1 (i < 3),
 * a_3 = (s-1)(t+1). Layer sizes k_i are computed from the array, not drawn by hand.
 */
export function IntersectionDiagram({ s = 2, t = 2, fusion = true, title, className, id = "hexagon" }: Props) {
  const b = [s * (t + 1), s * t, s * t];
  const c = [0, 1, 1, t + 1];
  const a = [0, s - 1, s - 1, (s - 1) * (t + 1)];
  const k = [1];
  for (let i = 1; i <= 3; i++) k.push((k[i - 1] * b[i - 1]) / c[i]);
  const n = k.reduce((x, y) => x + y, 0);
  const r = k.map((v) => 30 + 11 * Math.sqrt(v));
  const x = [110, 370, 630, 890];
  const srg = s === t ? [n, k[1] + k[2], s ** 3 + s ** 2 + s - 1, (s + 1) * (s ** 2 + 1)] : null;
  title ??=
    `Intersection diagram of the point graph of a generalized hexagon of order (${s}, ${t}): from one point, ` +
    `${k.join(", ")} points lie at distance 0, 1, 2 and 3, ${n} in all. ` +
    (fusion && srg
      ? `Marked in red: the fusion A1 + A2, a strongly regular graph with parameters (${srg.join(", ")}).`
      : "");

  return (
    <DrawIn>
      <svg
        viewBox={`0 0 ${W} ${fusion && srg ? H : H - 60}`}
        role="img"
        aria-labelledby={`${id}-title`}
        className={className}
      >
        <title id={`${id}-title`}>{title}</title>
        {x.slice(0, 3).map((x0, i) => {
          const x1 = x0 + r[i];
          const x2 = x[i + 1] - r[i + 1];
          return (
            <g key={`e${i}`}>
              <line
                x1={x1}
                x2={x2}
                y1={CY}
                y2={CY}
                className="fig-ink"
                strokeWidth={1}
                pathLength={1}
                data-draw
                style={{ "--d": `${i * 220 + 160}ms` } as React.CSSProperties}
              />
              <text x={x1 + 12} y={CY - 12} fontSize={20} className="fig-text">
                {b[i]}
              </text>
              <text x={x2 - 12} y={CY + 28} fontSize={20} textAnchor="end" className="fig-text">
                {c[i + 1]}
              </text>
            </g>
          );
        })}
        {x.map((cx, i) => (
          <g key={`v${i}`}>
            <circle
              cx={cx}
              cy={CY}
              r={r[i]}
              className="fig-ink"
              strokeWidth={1.25}
              pathLength={1}
              data-draw
              transform={`rotate(-90 ${cx} ${CY})`}
              style={{ "--d": `${i * 220}ms` } as React.CSSProperties}
            />
            <text
              x={cx}
              y={CY + (a[i] ? 2 : 10)}
              fontSize={30}
              textAnchor="middle"
              style={{ fill: "var(--ink)" }}
              className="fig-text"
            >
              {k[i]}
            </text>
            {a[i] > 0 && (
              <text x={cx} y={CY + 30} fontSize={16} textAnchor="middle" className="fig-text">
                a = {a[i]}
              </text>
            )}
            <text x={cx} y={CY - r[i] - 14} fontSize={16} textAnchor="middle" className="fig-text">
              Γ{["₀", "₁", "₂", "₃"][i]}
            </text>
          </g>
        ))}
        {fusion && srg && (
          <g>
            <path
              d={`M ${x[1] - r[1]} 232 v 12 H ${x[2] + r[2]} v -12`}
              className="fig-red"
              strokeWidth={1.5}
              pathLength={1}
              data-draw
              style={{ "--d": "1000ms" } as React.CSSProperties}
            />
            <text
              x={(x[1] + x[2]) / 2}
              y={276}
              fontSize={18}
              textAnchor="middle"
              style={{ fill: "var(--red)" }}
              className="fig-text"
            >
              A₁ + A₂ : SRG({srg.join(", ")})
            </text>
          </g>
        )}
      </svg>
    </DrawIn>
  );
}

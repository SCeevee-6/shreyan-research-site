import { DrawIn } from "./figures/DrawIn";

const arrows = {
  // Hand-drawn strokes: slightly uneven curves with a two-stroke head.
  down: "M 20 4 C 26 22, 14 38, 22 58 M 12 46 L 22 59 L 30 45",
  left: "M 70 14 C 52 8, 30 22, 6 16 M 16 6 L 5 16 L 17 25",
  right: "M 4 16 C 22 8, 46 24, 68 14 M 58 5 L 69 14 L 58 24",
  curl: "M 6 8 C 40 0, 58 30, 34 40 C 18 46, 22 26, 48 30 C 60 32, 66 44, 62 58 M 54 50 L 62 59 L 68 48",
};

/**
 * A note in red pencil, the way one annotates a printed page. Purely marginal: it never carries
 * information the page doesn't already give.
 */
export function Scribble({
  children,
  arrow,
  className = "",
  tilt = -3,
}: {
  children: React.ReactNode;
  arrow?: keyof typeof arrows;
  className?: string;
  tilt?: number;
}) {
  const vertical = arrow === "down" || arrow === "curl";
  return (
    <DrawIn className={`scribble ${vertical ? "flex-col" : "flex-row"} ${className}`}>
      <span className="scribble-text" style={{ transform: `rotate(${tilt}deg)` }}>
        {children}
      </span>
      {arrow && (
        <svg viewBox="0 0 74 62" aria-hidden="true" className="scribble-arrow">
          <path d={arrows[arrow]} pathLength={1} data-draw style={{ "--d": "500ms" } as React.CSSProperties} />
        </svg>
      )}
    </DrawIn>
  );
}

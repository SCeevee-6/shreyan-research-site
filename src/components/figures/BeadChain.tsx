/**
 * A chain of residues rippling like a strand in solution; a few of them periodically hollow out,
 * the way an abstaining model sets its riskiest predictions aside. Decorative, CSS only, and still
 * under reduced motion.
 */
export function BeadChain({ count = 34 }: { count?: number }) {
  const flagged = new Set([5, 13, 22, 29]);
  const step = 940 / (count - 1);
  return (
    <svg viewBox="0 0 1000 120" aria-hidden="true" className="bead-chain block w-full">
      <line x1={30} x2={970} y1={60} y2={60} className="fig-hair" strokeWidth={1} />
      {Array.from({ length: count }, (_, i) => {
        const x = 30 + i * step;
        const y = 60 + 22 * Math.sin(i / 2.2);
        const hi = flagged.has(i);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={hi ? 9 : 7}
            className={hi ? "bead bead-flag" : "bead"}
            style={{ "--i": i } as React.CSSProperties}
          />
        );
      })}
    </svg>
  );
}

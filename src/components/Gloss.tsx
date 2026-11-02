/**
 * Margin glossary: a dotted-underlined term whose one-line definition appears in the margin on hover
 * or focus (and below the line on small screens). Pure CSS; the definition is in the DOM for print.
 */
const TERMS: Record<string, string> = {
  fusion:
    "Merge some relations of a scheme; it’s a fusion if the merged matrices still multiply into combinations of each other.",
  scheme:
    "An association scheme: relations on pairs of points whose adjacency matrices multiply into combinations of each other.",
  "intersection numbers":
    "p_ij^k: for x, y in relation k, how many z have (x, z) in relation i and (z, y) in relation j.",
  krein:
    "The structure constants of the scheme’s algebra under entrywise product, in the basis of its eigenspaces. Always ≥ 0.",
  polygon:
    "A geometry whose incidence graph has diameter n and girth 2n. Order (s, t): s + 1 points on a line, t + 1 lines on a point.",
  srg: "Strongly regular: every vertex has k neighbours; adjacent pairs share λ, non-adjacent pairs share μ.",
  naurc: "Normalized area under the risk–coverage curve: 1 is the oracle ordering, 0 is random, below 0 is worse than random.",
  "risk–coverage":
    "Rank predictions by how risky they look, drop the riskiest, and track the error of what’s left as you keep less.",
  "rank error": "How far a mutation’s predicted rank within its assay is from its measured rank, on a 0–1 scale.",
  abstention: "Declining to act on a prediction the model thinks is likely wrong.",
  "accuracy-equivalent": "A candidate whose held-out error is within 10% of the best in its cell.",
};

export function Gloss({ t, children }: { t: keyof typeof TERMS | string; children: React.ReactNode }) {
  const def = TERMS[t];
  if (!def) return <>{children}</>;
  return (
    <span className="gloss" tabIndex={0}>
      {children}
      <span className="gloss-def" role="tooltip">
        {def}
      </span>
    </span>
  );
}

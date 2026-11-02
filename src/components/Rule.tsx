/** A rule spanning the whole sheet (rail to margin). Used inside `.sheet` or `.sheet-row`. */
export function Rule({ heavy = false, className = "" }: { heavy?: boolean; className?: string }) {
  return <div aria-hidden className={`col-sheet h-0 ${heavy ? "border-t-2 border-ink" : "border-t border-hair"} ${className}`} />;
}

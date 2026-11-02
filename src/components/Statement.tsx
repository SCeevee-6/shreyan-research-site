import { tex } from "@/lib/tex";

/**
 * A key result set as display maths. Display maths cannot break, so on phones the same
 * TeX is set inline, where KaTeX may wrap it at relations such as = or ⟺.
 */
export function Statement({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={className}>
      <div className="hidden sm:block" dangerouslySetInnerHTML={{ __html: tex(source, true) }} />
      <p className="statement-inline sm:hidden" dangerouslySetInnerHTML={{ __html: tex(source, false) }} />
    </div>
  );
}

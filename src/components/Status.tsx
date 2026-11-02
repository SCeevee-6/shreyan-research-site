import type { ResearchStatus } from "@/lib/content";

const unfinished: ResearchStatus[] = ["Ongoing research", "Computational investigation", "Draft manuscript"];

/** Maturity label. Unfinished work is marked in red, the annotation colour, so it is never mistaken for a result in print. */
export function Status({ status, className = "" }: { status: ResearchStatus; className?: string }) {
  return <span className={`label ${unfinished.includes(status) ? "text-red" : "text-ink"} ${className}`}>{status}</span>;
}

export function Links({ links }: { links?: { label: string; href: string }[] }) {
  if (!links?.length) return null;
  return (
    <ul className="space-y-0.5">
      {links.map((l) => (
        <li key={l.href}>
          {/* 24px line box keeps stacked links at the WCAG 2.2 minimum target size. */}
          <a href={l.href} rel="noopener noreferrer" className="inline-block min-h-6 leading-6">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

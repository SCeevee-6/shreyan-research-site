import Link from "next/link";
import { section, type SectionSlug } from "@/site.config";

/** Opening of every section: numeral in the rail, title and standfirst in the text, facts in the margin. */
export function PageHead({
  slug,
  title,
  standfirst,
  meta,
  italic = false,
}: {
  slug: SectionSlug;
  title?: string;
  italic?: boolean;
  standfirst?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const s = section(slug);
  return (
    <div className="sheet pt-14 sm:pt-20 lg:pt-24">
      <div className="sheet-row">
        <p className="col-rail leading-[0.8] font-light text-[3.25rem] lg:text-[5.75rem] tracking-[-0.03em] tnum" aria-hidden>
          <span className="sect">§</span>
          {s.n}
        </p>
        <div className="col-text">
          <p className="label label-muted mt-1 lg:mt-0">
            Section {s.n} <span className="px-1">/</span> {s.gloss}
          </p>
          <h1 className={`mt-3 text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.02em] ${italic ? "italic" : ""}`}>
            {title ?? s.title}
          </h1>
          {standfirst && <div className="mt-6 text-lede text-ink-2 italic max-w-[34rem]">{standfirst}</div>}
        </div>
        {meta && <div className="col-margin lg:pt-8">{meta}</div>}
      </div>
    </div>
  );
}

/** Opening of a single entry (article, note, poem). */
export function EntryHead({
  slug,
  kicker,
  title,
  subtitle,
  meta,
  italicTitle,
}: {
  slug: SectionSlug;
  kicker?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  italicTitle?: boolean;
}) {
  const s = section(slug);
  return (
    <div className="sheet pt-12 sm:pt-16 lg:pt-20">
      <div className="sheet-row">
        <p className="col-rail label pt-2">
          <Link href={`/${s.slug}`} className="link-quiet">
            <span className="sect">§</span>
            {s.n} {s.title}
          </Link>
        </p>
        <div className="col-text">
          {kicker && <p className="label label-muted">{kicker}</p>}
          <h1
            className={`mt-3 text-[clamp(2.125rem,4.6vw,3.5rem)] leading-[1.05] tracking-[-0.015em] ${italicTitle ? "italic" : ""}`}
          >
            {title}
          </h1>
          {subtitle && <div className="mt-5 text-lede text-ink-2">{subtitle}</div>}
        </div>
        {meta && <div className="col-margin lg:pt-9">{meta}</div>}
      </div>
    </div>
  );
}

export function Meta({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="meta">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

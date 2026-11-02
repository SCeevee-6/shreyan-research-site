"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "@/site.config";

export function useCurrentSection() {
  const path = usePathname() ?? "/";
  return sections.find((s) => path === `/${s.slug}` || path.startsWith(`/${s.slug}/`))?.slug;
}

export function SectionNav() {
  const current = useCurrentSection();
  return (
    <nav aria-label="Sections" className="hidden min-[1180px]:block">
      <ol className="flex gap-x-4 xl:gap-x-5">
        {sections.map((s) => {
          const here = s.slug === current;
          return (
            <li key={s.slug}>
              <Link
                href={`/${s.slug}`}
                aria-current={here ? "page" : undefined}
                className={`label no-underline whitespace-nowrap hover:text-red ${here ? "text-ink" : "text-ink-2"}`}
              >
                <span className={here ? "text-red" : "text-ink-3"}>{here ? "§" : s.n}</span> {s.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

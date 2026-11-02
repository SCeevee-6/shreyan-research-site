"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { sections } from "@/site.config";

export function useCurrentSection() {
  const path = usePathname() ?? "/";
  return sections.find((s) => path === `/${s.slug}` || path.startsWith(`/${s.slug}/`))?.slug;
}

/** Section list. One red § travels along it to whichever section you are in. */
export function SectionNav() {
  const current = useCurrentSection();
  const list = useRef<HTMLOListElement>(null);
  const [x, setX] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = list.current?.querySelector<HTMLElement>("[aria-current='page'] .sect-n");
      setX(el ? el.offsetLeft : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [current]);

  return (
    <nav aria-label="Sections" className="hidden min-[1180px]:block">
      <ol ref={list} className="relative flex gap-x-4 xl:gap-x-5">
        {x !== null && (
          <span className="sect-mark label text-red" style={{ transform: `translateX(${x}px)` }} aria-hidden="true">
            §
          </span>
        )}
        {sections.map((s) => {
          const here = s.slug === current;
          return (
            <li key={s.slug}>
              <Link
                href={`/${s.slug}`}
                aria-current={here ? "page" : undefined}
                className={`label no-underline whitespace-nowrap hover:text-red ${here ? "text-ink" : "text-ink-2"}`}
              >
                <span className={`sect-n ${here ? "invisible" : "text-ink-3"}`}>{here ? "§" : s.n}</span> {s.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

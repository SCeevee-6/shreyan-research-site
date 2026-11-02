import Link from "next/link";
import { sections, site } from "@/site.config";
import { updated } from "@/lib/issue";

export function Colophon() {
  return (
    <footer className="sheet mt-28 pb-12 sm:mt-36">
      <div className="col-sheet rule-heavy pt-5 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="label">Colophon</p>
          <p className="mt-3 max-w-[30rem] text-note text-ink-2">
            Set in Newsreader and Instrument Sans, with catalogue numerals in IBM Plex Mono and mathematics
            typeset by KaTeX. Built with Next.js. This site sets no cookies, runs no analytics and loads nothing
            from third parties.
          </p>
        </div>
        <nav aria-label="Contents (footer)">
          <p className="label">Contents</p>
          <ol className="mt-3 columns-2 gap-6 text-note">
            {sections.map((s) => (
              <li key={s.slug} className="break-inside-avoid">
                <span className="label label-muted inline-block w-4">{s.n}</span>
                <Link href={`/${s.slug}`} className="link-quiet">{s.title}</Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="text-note text-ink-2">
          <p className="label">Updated</p>
          <p className="mt-3">{updated()}</p>
          <p className="mt-3 text-ink-3">© {new Date().getUTCFullYear()} {site.name}. Text and images may not be reused without permission.</p>
          <p className="mt-3"><Link href="/feed.xml" className="link-quiet">RSS feed</Link></p>
          <p className="mt-3 hidden text-ink-3 lg:block">Press <kbd className="kbd">/</kbd> to jump anywhere.</p>
        </div>
      </div>
    </footer>
  );
}

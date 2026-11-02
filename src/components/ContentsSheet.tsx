"use client";

import Link from "next/link";
import { useRef } from "react";
import { sections } from "@/site.config";
import { useCurrentSection } from "./SectionNav";

/** Below 1180px the running head folds into a single control that opens the contents as a full sheet. */
export function ContentsSheet() {
  const current = useCurrentSection();
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className="label text-ink-2 hover:text-red cursor-pointer"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        Contents <span aria-hidden className="text-red">§</span>
      </button>
      <dialog
        ref={ref}
        aria-label="Contents"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper text-ink backdrop:bg-transparent p-0"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="mx-auto flex min-h-full max-w-[42rem] flex-col px-5 pt-5 pb-10 sm:px-8">
          <div className="flex items-baseline justify-between border-b border-hair pb-3">
            <p className="label label-muted">Contents</p>
            <button type="button" className="label text-ink-2 hover:text-red cursor-pointer" onClick={close} autoFocus>
              Close <span aria-hidden>×</span>
            </button>
          </div>
          <nav aria-label="Sections" className="mt-8">
            <ol>
              <li className="border-b border-hair">
                <Link href="/" onClick={close} className="flex items-baseline gap-4 py-3 no-underline">
                  <span className="label label-muted w-6">—</span>
                  <span className="text-[1.75rem] leading-tight italic">Cover</span>
                </Link>
              </li>
              {sections.map((s) => (
                <li key={s.slug} className="border-b border-hair">
                  <Link
                    href={`/${s.slug}`}
                    onClick={close}
                    aria-current={s.slug === current ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-3 no-underline"
                  >
                    <span className={`label w-6 ${s.slug === current ? "text-red" : "text-ink-3"}`}>
                      {s.slug === current ? "§" : s.n}
                    </span>
                    <span className="text-[1.75rem] leading-tight">{s.title}</span>
                    <span className="ml-auto text-note italic text-ink-3 text-right hidden min-[420px]:inline">{s.gloss}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </dialog>
    </>
  );
}

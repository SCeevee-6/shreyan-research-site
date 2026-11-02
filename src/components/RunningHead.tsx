import Link from "next/link";
import { site } from "@/site.config";
import { ContentsSheet } from "./ContentsSheet";
import { SectionNav } from "./SectionNav";

export function RunningHead() {
  return (
    <header className="sheet pt-5 pb-4 sm:pt-6">
      <div className="col-sheet flex items-baseline justify-between gap-6 border-b border-hair pb-3">
        <p className="flex min-w-0 items-baseline gap-3">
          <Link href="/" className="link-quiet whitespace-nowrap text-[1.0625rem] leading-none italic">
            {site.name}
          </Link>
        </p>
        <SectionNav />
        <div className="min-[1180px]:hidden">
          <ContentsSheet />
        </div>
      </div>
    </header>
  );
}

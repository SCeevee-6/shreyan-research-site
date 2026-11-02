import Link from "next/link";

export const metadata = { title: "Erratum" };

export default function NotFound() {
  return (
    <div className="sheet pt-20 lg:pt-28">
      <div className="sheet-row">
        <p className="col-rail label text-red pt-3">Erratum</p>
        <div className="col-text">
          <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.02em]">
            For this page, <span className="italic">read</span> another.
          </h1>
          <p className="mt-6 text-lede italic text-ink-2">
            The page you asked for is not on this site. It may have been moved or renamed.
          </p>
          <p className="mt-10">
            <Link href="/">Return to the cover</Link> and its table of contents.
          </p>
        </div>
      </div>
    </div>
  );
}

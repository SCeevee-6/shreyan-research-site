import Link from "next/link";
import { sections, site } from "@/site.config";
import { formatMonth, updated } from "@/lib/issue";
import { getCollection } from "@/lib/content";
import { Statement } from "@/components/Statement";
import { Status } from "@/components/Status";
import { publications } from "@/data/publications";
import { distinctions } from "@/data/achievements";
import { instrument } from "@/data/music";
import { PlatePlay } from "@/components/figures/PlatePlay";
import { Rule } from "@/components/Rule";
import { Scribble } from "@/components/Scribble";
import { Doily } from "@/components/figures/Doily";
import { ensembles, inStudy } from "@/data/music";

export default async function Cover() {
  const [research, maths, writing] = await Promise.all([
    getCollection("research"),
    getCollection("mathematics"),
    getCollection("writing"),
  ]);
  const note = (n: number) => maths.find((m) => m.data.n === n);
  const leadNote = note(1) ?? maths[0];
  const secondNote = note(2);
  const leadResearch = research.find((r) => r.slug === "protein-error-prediction") ?? research[0];
  const leadPoem = writing
    .filter((w) => w.data.kind === "poem")
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))[0];
  const stanza = leadPoem
    ? leadPoem.body
        .trim()
        .split(/\n\s*\n/)[0]
        .split("\n")
        .map((l) => l.trim())
    : [];
  const noteHref = leadNote ? `/mathematics/${leadNote.slug}` : "/mathematics";

  const contents: Record<string, { count: string; latest?: string }> = {
    about: { count: "Introduction" },
    research: { count: `${research.length} projects`, latest: research[0]?.data.date },
    publications: {
      count: `${publications.length} records`,
      latest: publications
        .map((p) => p.date)
        .sort()
        .at(-1),
    },
    mathematics: { count: `${maths.length} notes`, latest: maths[0]?.data.date },
    achievements: { count: `${distinctions.length} entries` },
    writing: writing.length
      ? {
          count: `${writing.length} ${writing.every((w) => w.data.kind === "poem") ? "poems" : "pieces"}`,
          latest: writing[0]?.data.date,
        }
      : { count: "None yet" },
    music: { count: instrument.name },
    contact: { count: "Address & privacy" },
  };

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    description: site.description,
    sameAs: site.profiles.map((p) => p.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* ── Masthead ── */}
      <div className="sheet pt-10 sm:pt-14 lg:pt-16">
        <div className="col-sheet flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 label label-muted">
          <span>{site.location}</span>
          <span className="hidden sm:inline">Research · Mathematics · Writing · Music</span>
          <span>Updated {updated()}</span>
        </div>
        <h1 className="col-sheet mt-6 sm:mt-8 font-light leading-[0.84] tracking-[-0.035em] text-[clamp(4rem,20vw,11.75rem)]">
          <span className="block">{site.givenName}</span>
          <span className="block italic font-normal tracking-[-0.03em] pl-[0.55em] lg:pl-[calc(var(--rail)+var(--gap-l))]">
            {site.familyName}
          </span>
        </h1>
      </div>

      {/* ── Statement ── */}
      <div className="sheet mt-10 lg:mt-14">
        <div className="sheet-row">
          <p className="col-rail label label-muted pt-2 hidden lg:block">A notebook</p>
          <p className="col-text text-lede sm:text-[1.5rem] sm:leading-[1.4]">
            I&rsquo;m a student in Allen, Texas. This is where I keep my research in algebraic combinatorics and
            computational biology, my math notes, my writing, and some music.
          </p>
        </div>
      </div>

      {/* ── Lead: the fusion theorem ── */}
      {leadNote && (
        <section aria-labelledby="lead" className="sheet mt-14 lg:mt-20">
          <Rule heavy />
          <div className="sheet-row pt-6 lg:pt-8">
            <p className="col-rail label pt-1.5">
              <span className="sect">§</span>4 Note {leadNote.data.n}
              <br />
              <span className="label-muted">Theorem B</span>
            </p>
            <div className="col-text">
              <h2 id="lead" className="text-[1.875rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.25rem]">
                <Link href={noteHref} className="link-quiet">
                  {leadNote.data.title}
                </Link>
              </h2>
              <Statement source={leadNote.data.statement} className="my-6 border-y border-hair py-1 text-[1.1rem]" />
              <p className="text-ink-2">{leadNote.data.summary}</p>
              <p className="mt-4 text-note">
                <Link href={noteHref}>Read the statement and the hexagon proof</Link>
              </p>
            </div>
            <p className="col-margin plain label !mt-4 lg:!mt-0 lg:pt-2.5">
              <span className="text-red">{leadNote.data.status}</span>
              <Scribble arrow="left" className="mt-6 hidden lg:inline-flex" tilt={-4}>
                start here
              </Scribble>
            </p>
          </div>
        </section>
      )}

      {/* ── Plate ── */}
      <div className="sheet mt-14 lg:mt-20">
        <figure className="sheet-row">
          <div className="col-sheet">
            <PlatePlay />
          </div>
          <span className="col-rail label mt-4">
            Plate I
            <Scribble arrow="curl" className="mt-4 hidden lg:flex" tilt={-6}>
              only when s = t
            </Scribble>
          </span>
          <figcaption className="col-text text-note text-ink-2 mt-1 lg:mt-4">
            The point graph of a generalized hexagon of order (s, t), seen from one point: the points at distance
            0, 1, 2 and 3, with the edge counts between layers. Move the sliders. Merging distances 1 and 2 — in red — gives a
            strongly regular graph, which by Theorem B happens exactly when s = t.{" "}
            <Link href={noteHref}>From §4, Note 1</Link>.
          </figcaption>
        </figure>
      </div>

      {/* ── Lately: what's on the desk, with the doily to play with ── */}
      <section aria-labelledby="lately" className="sheet mt-20 lg:mt-28">
        <Rule heavy />
        <div className="col-sheet grid items-center gap-x-12 gap-y-8 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
          <div>
            <h2 id="lately" className="font-[family-name:var(--ff-hand)] text-[2.4rem] leading-none text-red">
              lately —
            </h2>
            <ul className="mt-6 space-y-4 text-[1.1875rem] leading-snug">
              <li>
                Computing the{" "}
                <Link href="/research/tits-group-orbital-configurations">orbital configurations of the Tits group</Link>
                .
              </li>
              <li>
                Reading the errors of a protein language model:{" "}
                <Link href="/research/protein-error-prediction">where ESM-2 is wrong</Link>.
              </li>
              <li>
                On cello,{" "}
                {inStudy
                  .map((w) => `${w.composer} ${w.numbers.map((n) => n.replace("No. ", "")).join(", ")}`)
                  .join("; ")}
                {ensembles[0] ? ` — and ${ensembles[0].what} at ${ensembles[0].detail}` : ""}.
              </li>
              <li>
                Writing <Link href="/writing">poems and short prose</Link>.
              </li>
            </ul>
          </div>
          <figure>
            <Doily id="cover-doily" />
            <figcaption className="mt-2 flex items-start justify-between gap-4">
              <span className="text-note text-ink-2">
                The generalized quadrangle of order 2: fifteen points, fifteen lines, three of each through each other.
              </span>
              <Scribble tilt={3} className="shrink-0">
                hover a point
              </Scribble>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Contents ── */}
      <section aria-labelledby="contents" className="sheet mt-20 lg:mt-28">
        <h2 id="contents" className="col-sheet label pb-3">
          Contents
        </h2>
        <Rule heavy />
        <ol className="sheet-row">
          {sections.map((s) => {
            const c = contents[s.slug];
            return (
              <li key={s.slug} className="sheet-row group">
                <Link
                  href={`/${s.slug}`}
                  className="col-sheet grid grid-cols-subgrid no-underline border-b border-hair py-3.5 lg:py-4 hover:text-ink"
                >
                  <span className="col-rail hidden lg:block text-[1.75rem] leading-none font-light tnum pt-1">
                    <span className="text-ink-3 group-hover:text-red transition-colors">§</span>
                    {s.n}
                  </span>
                  <span className="col-text flex items-baseline gap-3">
                    <span className="label text-ink-3 lg:hidden w-5 shrink-0">{s.n}</span>
                    <span className="text-[1.625rem] sm:text-[2.125rem] leading-[1.1] tracking-[-0.01em] group-hover:text-red transition-colors">
                      {s.title}
                    </span>
                    <span className="leaders group-hover:border-ink" />
                    <span className="label label-muted whitespace-nowrap">{c.count}</span>
                  </span>
                  <span className="col-margin plain text-note italic text-ink-2 lg:pt-2.5 pl-8 lg:pl-0">
                    {s.gloss}
                    {c.latest && <span className="not-italic text-ink-3"> · {formatMonth(c.latest)}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── From the notebook: excerpts, each in its own typography ── */}
      <section aria-labelledby="excerpts" className="sheet mt-24 lg:mt-32">
        <h2 id="excerpts" className="col-sheet label pb-3">
          From the notebook
        </h2>
        <Rule heavy />

        {secondNote && (
          <>
            <article className="sheet-row py-10 lg:py-12">
              <p className="col-rail label pt-1">
                <span className="sect">§</span>4 Note {secondNote.data.n}
              </p>
              <div className="col-text">
                <h3 className="text-h2">
                  <Link href={`/mathematics/${secondNote.slug}`} className="link-quiet">
                    {secondNote.data.title}
                  </Link>
                </h3>
                <Statement source={secondNote.data.statement} className="mt-2 text-[1.15rem]" />
              </div>
              <p className="col-margin text-note text-ink-2 lg:pt-1.5">{secondNote.data.summary}</p>
            </article>
            <Rule />
          </>
        )}

        {leadResearch && (
          <>
            <article className="sheet-row py-10 lg:py-12">
              <p className="col-rail label pt-1">
                <span className="sect">§</span>2 Research
              </p>
              <div className="col-text">
                <h3 className="text-h2">
                  <Link href={`/research/${leadResearch.slug}`} className="link-quiet">
                    {leadResearch.data.title}
                  </Link>
                </h3>
                <p className="mt-4 text-ink-2">{leadResearch.data.summary}</p>
              </div>
              <p className="col-margin plain label label-muted !mt-4 lg:!mt-0 lg:pt-2.5">
                {leadResearch.data.field}
                <br />
                <Status status={leadResearch.data.status} /> · {leadResearch.data.period}
              </p>
            </article>
            <Rule />
          </>
        )}

        {leadPoem && (
          <article className="sheet-row py-10 lg:py-12">
            <p className="col-rail label pt-1">
              <span className="sect">§</span>6 Poem
            </p>
            <div className="col-text">
              <h3 className="text-h2 italic">
                <Link href={`/writing/${leadPoem.slug}`} className="link-quiet">
                  {leadPoem.data.title}
                </Link>
              </h3>
              <p className="mt-4 text-[1.1875rem] leading-[1.7]">
                {stanza.map((l, i) => (
                  <span key={i} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <p className="mt-4 text-note">
                <Link href={`/writing/${leadPoem.slug}`}>Continue reading</Link>
              </p>
            </div>
          </article>
        )}
      </section>
    </>
  );
}

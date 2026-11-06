import Link from "next/link";
import { getCollection } from "@/lib/content";
import { site, sections } from "@/site.config";
import { Statement } from "@/components/Statement";
import { PlatePlay } from "@/components/figures/PlatePlay";
import { Doily } from "@/components/figures/Doily";
import { OrbitRings } from "@/components/figures/OrbitRings";
import { BeadChain } from "@/components/figures/BeadChain";
import { FitVsLaw } from "@/components/figures/FitVsLaw";
import { PracticeLog } from "@/components/PracticeLog";
import { inStudy, instrument } from "@/data/music";

export default async function Cover() {
  const [research, maths, writing] = await Promise.all([
    getCollection("research"),
    getCollection("mathematics"),
    getCollection("writing"),
  ]);
  const note = (n: number) => maths.find((m) => m.data.n === n);
  const lead = note(1) ?? maths[0];
  const tits = note(2);
  const byslug = (s: string) => research.find((r) => r.slug === s);
  const protein = byslug("protein-error-prediction");
  const ode = byslug("verified-ode-discovery");
  const poem = writing.filter((w) => w.data.kind === "poem").sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))[0];
  const stanza = poem ? poem.body.trim().split(/\n\s*\n/)[0].split("\n").map((l) => l.trim()) : [];

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

      <section className="hero" aria-labelledby="name">
        <h1 id="name" className="hero-name">
          {site.name}
        </h1>
        <p className="hero-sub">
          I&rsquo;m a student in Allen, Texas. This is where I keep my research in algebraic combinatorics and
          computational biology, my math notes, my writing, and some music.
        </p>
        <div className="hero-cta">
          <Link href="/research" className="pill pill-solid">
            See the research
          </Link>
          <Link href="/mathematics" className="pill pill-ghost">
            Read the notes
          </Link>
        </div>
      </section>

      <div className="tiles">
        {lead && (
          <section className="tile tile-wide" aria-labelledby="t-lead">
            <h2 id="t-lead">{lead.data.title}</h2>
            <Statement source={lead.data.statement} className="tile-statement" />
            <p className="tile-sub">Move the sliders. The bracket appears exactly when s = t.</p>
            <div className="tile-links">
              <Link href={`/mathematics/${lead.slug}`}>Read the proof</Link>
              <Link href="/research/generalized-polygon-schemes">The project</Link>
            </div>
            <div className="tile-art">
              <div>
                <PlatePlay />
              </div>
            </div>
          </section>
        )}

        <section className="tile" aria-labelledby="t-doily">
          <h2 id="t-doily">Fifteen points. Fifteen lines.</h2>
          <p className="tile-sub">The generalized quadrangle of order 2. Hover a point to light its three lines.</p>
          <div className="tile-links">
            <Link href="/research/generalized-polygon-schemes">Generalized polygons</Link>
          </div>
          <div className="tile-art">
            <Doily id="cover-doily" />
          </div>
        </section>

        {tits && (
          <section className="tile tile-dark" aria-labelledby="t-tits">
            <h2 id="t-tits">{tits.data.title}</h2>
            <p className="tile-sub">Five orbitals of 1, 10, 80, 640 and 1024 points, seen from one point.</p>
            <div className="tile-links">
              <Link href={`/mathematics/${tits.slug}`}>Open the note</Link>
            </div>
            <div className="tile-art">
              <OrbitRings id="cover-orbits" />
            </div>
          </section>
        )}

        {protein && (
          <section className="tile" aria-labelledby="t-protein">
            <h2 id="t-protein">{protein.data.title}</h2>
            <p className="tile-sub">{protein.data.summary.split(" — ")[0]}.</p>
            <div className="tile-links">
              <Link href={`/research/${protein.slug}`}>Read the study</Link>
              <a href="https://doi.org/10.5281/zenodo.23653009">Preprint</a>
            </div>
            <div className="tile-art">
              <BeadChain count={18} />
            </div>
          </section>
        )}

        {ode && (
          <section className="tile" aria-labelledby="t-ode">
            <h2 id="t-ode">Equations that fit, and still break the law.</h2>
            <p className="tile-sub">{ode.data.summary.split(". ")[0]}.</p>
            <div className="tile-links">
              <Link href={`/research/${ode.slug}`}>See the pilot</Link>
            </div>
            <div className="tile-art">
              <FitVsLaw />
            </div>
          </section>
        )}

        {poem && (
          <section className="tile" aria-labelledby="t-poem">
            <h2 id="t-poem">Writing</h2>
            <p className="tile-poem">
              {stanza.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </p>
            <div className="tile-links">
              <Link href={`/writing/${poem.slug}`}>Read {poem.data.title}</Link>
              <Link href="/writing">All writing</Link>
            </div>
          </section>
        )}

        <section className="tile" aria-labelledby="t-cello">
          <h2 id="t-cello">{instrument.name}</h2>
          <p className="tile-sub">
            Now studying{" "}
            {inStudy.map((w) => `${w.composer} ${w.numbers.map((n) => n.replace("No. ", "")).join(", ")}`).join(" and ")}.
          </p>
          <div className="tile-links">
            <Link href="/music">Music</Link>
            <Link href="/appendix/cello">Play one</Link>
          </div>
          <div className="tile-art">
            <PracticeLog />
          </div>
        </section>
      </div>

      <nav className="index" aria-labelledby="everything">
        <h2 id="everything">Everything</h2>
        <ol>
          {sections.map((s) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}`}>
                <span className="index-title">{s.title}</span>
                <span className="index-note">{s.gloss}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

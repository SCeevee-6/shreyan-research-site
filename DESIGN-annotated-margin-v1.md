# The Annotated Margin
### Creative concept & design system for the notebook of Shreyan Chethan

---

## 1. Central concept

The site is a **journal of one person's inquiry** — and its
organising idea is *the margin*.

Every serious working document has two voices: the main text, which states, and the
margin, which qualifies, cites, dates, corrects and wonders. Mathematicians write
lemmas in the margin; editors write corrections there; poets number their lines
there. This site treats the margin as structure rather than ornament:

- **The text block** carries the work itself, set for long reading.
- **The rail** (left) carries *where you are*: section numerals, years, note numbers.
- **The margin** (right) carries *what qualifies the work*: dates, collaborators,
  sidenotes, sources, status.

The single accent colour is **proofreader's red** — the colour of a pencil that
marks revisions. It is used only for things that annotate: the section sign `§`,
the current location, sidenote numerals, hover states, the specimen notice, and
one highlighted triple in the cover plate. Never for decoration, never for fills.

The homepage is **a cover that prints its own contents**, the way mid-century
mathematical journals and literary quarterlies did: masthead, issue line, a plate
drawn from the lead article (the intersection diagram of a generalized hexagon — the figure from
*Mathematics, Note 1*),
and a table of contents with dot leaders.

**Personality:** exacting but warm. Scholarly without being stuffy; the italic
does the warmth, the numerals do the exactness.

## 2. Typography

| Role | Face | Why |
|---|---|---|
| Text & display | **Newsreader** (variable, `opsz` 6–72, roman + italic) | A contemporary text serif with a real optical-size axis: it can be set at 11px in the margin and 160px on the cover and remain itself. Its italic is lively enough to carry poetry. |
| Labels, navigation, tables | **Instrument Sans** (variable, `wdth`) | A restrained grotesk for the apparatus — the Swiss half of the system. Uppercase, tracked, small. Never used for reading text. |
| Catalogue numerals | **IBM Plex Mono** | Only for catalogue marks, DOIs, BibTeX and dates in ledgers — places where characters must align and read as *data*. |
| Mathematics | **KaTeX (Computer Modern)** | Equations look like mathematics, not like web text. The serif body sits comfortably beside CM. |

### Scale (rem, at 16px root)

| Token | Size / line-height | Use |
|---|---|---|
| `micro` | 0.6875 / 1.4, +0.08em, uppercase, sans | labels, running head |
| `note` | 0.8125 / 1.45, serif | sidenotes, captions, margin |
| `small` | 0.9375 / 1.5 | meta lines, bibliography |
| `body` | 1.125 / 1.62 | reading text (≈ 66 characters per line) |
| `lede` | 1.375 / 1.45 | standfirsts, opening paragraphs |
| `h3` | 1.25 / 1.3 | subsection |
| `h2` | 1.75 / 1.2 | section |
| `h1` | clamp(2.5, 5vw, 4.25) / 1.02 | page title |
| `display` | clamp(4.25, 13vw, 11.5) / 0.86 | cover masthead only |

Rules: one display size per page; headings in Newsreader at weight 400 (never bold
headings — weight comes from size); body text 400; numerals old-style in prose and
tabular-lining in tables and ledgers.

## 3. Colour tokens

| Token | Paper (light) | Carbon (dark) | Use |
|---|---|---|---|
| `--paper` | `#F3EFE7` | `#141310` | page |
| `--paper-2` | `#EAE5DA` | `#1D1C18` | recessed panels (abstract, BibTeX) |
| `--ink` | `#1A1915` | `#E9E4D8` | text, heavy rules |
| `--ink-2` | `#45423B` | `#BDB7AA` | secondary text |
| `--ink-3` | `#68645A` | `#938D80` | meta, line numbers (≥ 4.5:1 on paper) |
| `--hair` | ink @ 18% | ink @ 20% | hairlines |
| `--red` | `#B3301A` | `#EE6C52` | annotation only |

Dark mode follows the reader's system setting — it is the same journal printed on
carbon paper, not a separate theme.

**Background:** flat paper. No textures, gradients, noise or blobs. The page is the
material.

## 4. Grid — "the sheet"

Desktop (≥ 1024px) uses a named-line grid:

```
| outer | rail 9rem | gap 2.5rem | text ≤ 36rem | gap 3rem | margin 14rem | outer |
```

- `text` — reading column (≈ 66ch at body size)
- `rail` → `text` — headed blocks (§ numeral + title)
- `text` → `margin` — "wide": figures, tables, ledgers
- `rail` → `margin` — "full sheet": cover compositions, contents

Tablet (640–1023px): rail and margin collapse; rail content becomes a label line
above each block; margin content becomes an inline annotation with a red left rule.
Mobile (< 640px): single column, 1.25rem gutters, sidenotes become tap-to-reveal.

**Spacing scale** (multiples of 4px, tuned to the body line of ~29px):
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 · 160`. Vertical rhythm between blocks
uses 48 / 72 / 112 — never arbitrary values.

## 5. Rules & dividers

- **Heavy rule** — 2px ink — opens a section (as in a journal).
- **Hairline** — 1px `--hair` — separates entries in registers and ledgers.
- **Red rule** — 1px red, left edge — marks annotations at narrow widths.
- No boxes with rounded corners. No shadows. Radius is 0 everywhere.

## 6. Navigation philosophy

The navigation is a **running head**, not a nav bar: name at left,
numbered sections at right, set small, on every page, scrolling away with the page
like a printed running head (not sticky — the content is the interface). The
current section is marked with a red `§`. Below 1100px the list folds into a single
"Contents" control that opens the table of contents as a full sheet (native
`<dialog>`: focus-trapped, Esc to close). The footer is a **colophon** that repeats
the contents and states how the site is made.

Sections are numbered and keep their numbers everywhere:
§1 About · §2 Research · §3 Publications · §4 Mathematics · §5 Achievements ·
§6 Writing · §7 Music · §8 Contact. The cover is unnumbered.

## 7. Interaction & motion

Motion should feel like ink, not like software: short (120–180ms), opacity and
colour only, no translation of text, no scroll-triggered reveals, no parallax.

- Links: hairline underline → red underline + red text on hover.
- Contents rows: numeral turns red; dot leaders darken.
- Focus: 2px red outline, 3px offset — always visible on keyboard focus.
- `prefers-reduced-motion`: all transitions removed.

## 8. Page identities (one system, nine treatments)

| Page | Treatment | Driven by |
|---|---|---|
| **Cover** (Home) | Masthead + plate + contents with dot leaders + three excerpts each in its native typography (a theorem, an abstract, a stanza) | journal covers |
| **§1 About** | "Note on the author": a lede in large italic, prose in the text column, facts in the margin | contributor notes |
| **§2 Research** | *Register* of projects with heavy rules; status and years in the rail. Articles: abstract panel, numbered sections, figures, sidenotes, numbered references | scientific papers |
| **§3 Publications** | Bibliography: year in the rail, hanging-indent citations, author name in small caps, `[pdf] [doi] [cite]` with BibTeX | reference lists |
| **§4 Mathematics** | Index of notes where each entry *shows its key statement typeset*. Notes: theorem/proof environments, numbered equations, ∎ | AMS-style exposition |
| **§5 Achievements** | Almanac ledger: large year numerals, tabular columns for distinction / body / level, totals in the head | almanacs, archival registers |
| **§6 Writing** | *Index of first lines*. Poems: narrow measure, generous leading, line numbers every five lines in the margin, date at foot | literary journals |
| **§7 Music** | A recital **programme**: the only centred composition on the site — composers in small caps, works in italic, movements indented | concert programmes |
| **§8 Contact** | A letter of correspondence plus the privacy colophon | letterpress colophons |

## 9. Components

`RunningHead` · `ContentsSheet` · `Colophon` · `SpecimenNotice` · `PageHead`
(rail numeral + title + standfirst + margin meta) · `Sidenote` · `Theorem` /
`Lemma` / `Definition` / `Proof` · `Equation` (KaTeX `\tag`) · `Figure` / `Plate` ·
`Abstract` · `References` · `Citation` + `BibTeX` · `Register` (research) ·
`Ledger` (achievements) · `Programme` (music) · `Poem` (line-numbered) ·
`Leaders` (dot-leader contents rows).

## 10. Responsive philosophy

The sheet does not shrink; it **refolds**. At each breakpoint the margin's
information moves into the text flow rather than disappearing: dates become a
label above a title, sidenotes become tappable, ledger columns stack into
"year — distinction / body · level" lines. The cover's masthead scales with the
viewport but its line break is fixed ("Shreyan / Chethan"), and the plate moves
below the masthead rather than shrinking beside it.

---

## 11. Review log (Playwright, three passes)

Every route was captured at 1440 / 834 / 390 px (light and dark) with `npm run shots`, critiqued
from the rendered output, revised, and re-captured. What the renders showed, and what changed:

| Seen in the render | Why it was wrong | Revision |
|---|---|---|
| Issue label collided with the nav in the running head at 1440px | Broken apparatus on every page | Issue label shows only when the nav is folded (it already sits on the cover) |
| Cover plate cropped at 0.3 read as a **bell curve** | Wrong scientific association on a mathematics cover | Cropped at ½: C(0) and C(1) meet in a cusp, C(½) nested beneath — unmistakably Ford circles |
| Equation tags set inline (`1/2q².(1)`) | KaTeX 0.16 markup styled by 0.19 CSS | Pinned one KaTeX version for markup and stylesheet |
| Wide display equations ran into the margin; corollary identities clipped | Maths must never scroll or clip | Split into `aligned` blocks |
| Theorem statements clipped on phones | Display maths cannot wrap | `Statement` renders display maths ≥ 640px and wrappable inline maths below; Note 2's statement rewritten as a chain of equalities |
| Abstract panel spanned into the margin (~110 characters a line) | Too long a measure for reading | Abstract held to the text column |
| Margin metadata cramped | `dd:last-child` matched every item | Spacing between groups, not after items |
| List hairlines ran past the sheet edge to the viewport | Rules elsewhere stop at the sheet; inconsistent | Rules drawn as sheet-width grid items |
| Ledger columns drifted between years | Auto table layout sized per table | Fixed table layout and column widths |
| About: facts beside the title pushed the lede 170px down | Weak opening composition | Facts moved beside the lede |
| Research excerpt truncated with an ellipsis on the cover | Truncation is not editorial | Full summary |
| Open Graph card all italic, name colliding with the plate | Missing weight; overlap | Roman 300 + italic 400; plate scaled beneath the name |
| axe: `aria-label` on sidenote labels and cite toggles | Prohibited / name mismatch | Visually hidden text instead |

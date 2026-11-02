# Shreyan Chethan — Notebook

A personal research notebook, set like a journal. The design concept, tokens, grid and
page treatments are documented in [DESIGN.md](DESIGN.md).

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MDX · KaTeX · fully static, Vercel-ready.

## Content rules

Every entry is real and must stay accurate. Never add achievements, publications, dates, collaborators,
proofs, poems or recordings that have not been supplied; never describe a draft or preprint as published; copy numbers and theorem statements exactly from their source; and where something is
unverified, say so instead of filling the gap. Research and mathematics entries state their status
(`researchStatuses` in `src/lib/content.ts`; `status` in each note's front matter).

Writing has no pieces yet, and Music lists only what has been supplied; both pages render honestly
when empty.

## Where content lives

| Section | Source | Format |
|---|---|---|
| About | `content/about.mdx` | MDX; `lede` in front matter |
| Research | `content/research/*.mdx` | MDX with `question`, `status`, `period`, `order`, `links`, … |
| Publications | `src/data/publications.ts` | typed list grouped by status (Preprint / Research record / Draft manuscript); BibTeX for DOI records |
| Mathematics | `content/mathematics/*.mdx` | MDX; `statement` (TeX, single-quoted YAML) shows on the index |
| Achievements | `src/data/achievements.ts` | typed list grouped by field; `year` omitted when not recorded |
| Writing | `content/writing/*.mdx` | `kind: poem` → plain text, blank line = stanza, two-space indent = indented line; `kind: prose` → MDX |
| Music | `src/data/music.ts` | instrument, orchestras, works in study |

MDX components available in articles and notes:

```mdx
<Note>A sidenote — sits in the margin on desktop, tap-to-open on phones.</Note>
<Theorem n="B" name="…">…</Theorem>   (also Lemma, Proposition, Corollary, Definition, Remark)
<Proof>…</Proof>                          (<Proof of="Theorem 1"> for a named proof)
<Figure n={1} caption="…" wide>…</Figure>
<Plot … />  <IntersectionDiagram s={2} t={2} />
<References>1. …</References>
```

Display maths: `$$ … \tag{1} $$`, separated from the surrounding text by blank lines.

## Commands

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build && npm start
```

```bash
npm run lint && npm run typecheck
```

### Design-review loop (Playwright)

With the site running (`npm start`, default port 3000):

```bash
npm run shots
```

captures every route at desktop (1440), tablet (834) and mobile (390) into `.shots/` and reports
horizontal overflow, console errors and failed requests. Options: `--dark`, `--only cover,music`,
`--vp mobile`, `--fold`, `--base http://localhost:3100`.

```bash
npm run audit:a11y
```

runs axe-core (WCAG 2.2 AA) on every route in light and dark schemes, checks one `h1` per page,
and verifies the contents dialog traps focus and closes on Escape.

First-time setup for Playwright: `npx playwright install chromium`.

## Deploying to Vercel

Import the repository in Vercel (framework preset: Next.js) and set
`NEXT_PUBLIC_SITE_URL` to the production URL so canonical links, the sitemap, RSS feed and Open
Graph images use the right origin. No other configuration is needed; every page is prerendered.

## Privacy & security

- No cookies, analytics, third-party scripts, embeds or remote fonts (fonts are self-hosted via `next/font`).
- No forms. The email address is assembled in the browser only when a reader asks for it.
- Security headers in `next.config.ts`: CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`,
  strict referrer policy, and a Permissions-Policy that disables camera, microphone, geolocation
  and interest tracking.
- Route parameters are validated against `^[a-z0-9-]+$` before any file read, and unknown slugs 404
  (`dynamicParams = false`).
- The site names the city and school, but carries no photograph, phone number or postal address.

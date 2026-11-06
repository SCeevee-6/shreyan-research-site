# Proof Sheet — design system

High-contrast editorial print, set in a heavy academic monospace. Replaces "The Annotated Margin"
(kept for reference in `DESIGN-annotated-margin-v1.md`; its grid and margin structure survive).

## Voice
- **Structure is mono.** JetBrains Mono (`--ff-display`) for every heading, label, numeral, control
  and piece of data. Headings 700, the cover name and section numerals 800, tracking −0.04em.
- **Reading is serif.** Newsreader stays for prose, poems, captions and statements — long text is
  never set in mono.
- **Hand** (Caveat) only for red-pencil marks.
- Labels are sentence case, untracked, 12px mono. No uppercase eyebrows; no kicker above a heading.

## Colour
Paper `#f5f3ee` / ink `#0b0b0a` (dark: `#0c0c0b` / `#f3f0e9`). One accent, proofreader's red
`#c42d16` (dark `#ff5b3d`), for marks only: §, the full stop on the cover, selection, focus, hover.

## Structure
- 4px spacing scale. Rules are printed: 3px ink for section breaks, 1px hairline inside.
- Rail / text / margin grid from v1. Nothing centred; the concert programme is flush left.
- Interactive panels: hairline box with a 3px ink top rule. No coloured side stripes, no offset shadows.

## Motion
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, 160ms for hover and colour; buttons press to 0.97.
- Page entry: 180ms ink-settle from 40% opacity. Strokes draw in once.
- Cover: a WebGL halftone screen (15° angle, as in print) whose dots follow a slow noise field and
  swell under an eased cursor. Paused off-screen; one still frame under reduced motion.

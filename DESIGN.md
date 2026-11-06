# Clean — design system

Apple-style: white and `#f5f5f7` surfaces, one face (Inter, optically sized), a single blue for
everything interactive. Supersedes the Proof Sheet mono world and "The Annotated Margin"
(`DESIGN-annotated-margin-v1.md`). Styles live in `src/app/apple.css`, loaded after `globals.css`.

- **Type:** Inter for UI and reading; tracking tightens with size (−0.045em at the hero, −0.022em in
  body). Poems keep Newsreader; mathematics keeps KaTeX. Labels are sentence case, never tracked caps.
- **Colour:** ink `#1d1d1f`, secondary `#6e6e73`, hairline `#d2d2d7`, accent `#0071e3` (dark:
  black, `#f5f5f7`, `#a1a1a6`, `#424245`, `#2997ff`). The old `--red` token now carries the blue.
- **Layout:** one reading column (43.25rem) with a wider band for figures; no side rails.
- **Cover:** centred hero, pill buttons, then a 2-up grid of 28px-radius tiles, each built around a
  live figure; one dark tile for contrast; a two-column index at the end.
- **Chrome:** a 48px translucent nav bar (`backdrop-filter: saturate(180%) blur(20px)`) that the page
  scrolls under; solid under `prefers-reduced-transparency`.
- **Motion:** press feedback on pointer-down (scale 0.97, 100ms); `cubic-bezier(0.23,1,0.32,1)`
  ease-out for colour; the palette materialises (scale + blur); 220ms page fade.

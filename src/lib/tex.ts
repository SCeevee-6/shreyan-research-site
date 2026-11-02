import katex from "katex";

/** Server-side KaTeX for statements outside MDX (index pages, the cover). Source is first-party content. */
export function tex(source: string, display = true) {
  return katex.renderToString(source, { displayMode: display, throwOnError: false, strict: "ignore", trust: false });
}

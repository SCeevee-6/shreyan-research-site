"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import katex from "katex";

export type PaletteItem = { label: string; href: string; group: string };

/**
 * Press / (or Ctrl+K) to jump anywhere. Start with a backslash and it becomes a TeX scratchpad:
 * whatever you type is rendered live by KaTeX.
 */
export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]");
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        setQ("");
        setSel(0);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const tex = q.startsWith("\\");
  const results = useMemo(() => {
    if (tex) return [];
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((i) => words.every((w) => `${i.label} ${i.group}`.toLowerCase().includes(w))).slice(0, 8);
  }, [q, tex, items]);
  const rendered = useMemo(
    () => (tex ? katex.renderToString(q, { throwOnError: false, displayMode: true, strict: "ignore" }) : ""),
    [q, tex],
  );

  if (!open) return null;
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="palette-backdrop" onMouseDown={() => setOpen(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Jump to" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input}
          className="palette-input"
          placeholder="Jump to…   or type \frac{p}{q}"
          value={q}
          spellCheck={false}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") setSel((s) => Math.min(s + 1, results.length - 1));
            if (e.key === "ArrowUp") setSel((s) => Math.max(s - 1, 0));
            if (e.key === "Enter" && results[sel]) go(results[sel].href);
          }}
          aria-controls="palette-list"
        />
        {tex ? (
          <div className="palette-tex" dangerouslySetInnerHTML={{ __html: rendered }} />
        ) : (
          <ul id="palette-list" className="palette-list" role="listbox">
            {results.map((r, i) => (
              <li key={r.href} role="option" aria-selected={i === sel}>
                <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r.href)}>
                  <span>{r.label}</span>
                  <span className="label label-muted">{r.group}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="palette-empty italic">Nothing by that name.</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

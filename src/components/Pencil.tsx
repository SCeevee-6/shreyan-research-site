"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Red pencil on the page: a loose ring around a few words, and (optionally) a note in the margin.
 * Both draw themselves once, the first time they scroll into view. Inline, so it can sit in a sentence.
 */
export function Pencil({ children, note, tilt = -4 }: { children: React.ReactNode; note?: string; tilt?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"static" | "ready" | "in">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("ready");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { threshold: 1, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="pencil draw" data-state={state}>
      {children}
      <svg className="pencil-ring" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        {/* Not quite closed, and overshooting, the way a hand circles something. */}
        <path d="M 8 26 C 2 12, 30 2, 58 3 C 86 4, 99 14, 96 24 C 92 36, 50 39, 24 36 C 10 34, 4 28, 14 14" pathLength={1} data-draw />
      </svg>
      {note && (
        <span className="pencil-note" style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true">
          {note}
        </span>
      )}
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draws the strokes of a figure (elements marked `data-draw`) when it first scrolls into view.
 * Without JavaScript, or with reduced motion, the figure is simply shown complete.
 */
export function DrawIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.25 },
    );
    io.observe(el);
    // Never leave a figure undrawn: if the observer has not fired (hidden tab, odd browser), draw anyway.
    const fallback = window.setTimeout(() => setState("in"), 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`draw ${className}`} data-state={state}>
      {children}
    </div>
  );
}

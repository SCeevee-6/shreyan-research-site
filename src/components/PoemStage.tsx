"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a poem. Arriving from the index (#typed), the poem types itself out once. "Reading mode"
 * hides everything on the page but the poem; Esc or the same button brings it back.
 */
export function PoemStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    if (location.hash !== "#typed" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const poem = ref.current?.querySelector(".poem");
    poem?.classList.add("typing");
    history.replaceState(null, "", location.pathname);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-reading", reading);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setReading(false);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      document.documentElement.removeAttribute("data-reading");
    };
  }, [reading]);

  return (
    <div ref={ref} className="poem-stage">
      {children}
      <button type="button" className="reading-toggle label link-quiet" aria-pressed={reading} onClick={() => setReading((r) => !r)}>
        {reading ? "Leave reading mode" : "Reading mode"}
      </button>
    </div>
  );
}

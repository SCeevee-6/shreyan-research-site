"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a poem. Arriving from the index (#typed), the poem types itself out once. "Reading mode"
 * hides everything on the page but the poem; Esc or the same button brings it back.
 */
export function PoemStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (location.hash !== "#typed" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const poem = ref.current?.querySelector(".poem");
    if (!poem) return;
    poem.classList.add("typing");
    history.replaceState(null, "", location.pathname);
    setTyping(true);
    const lines = poem.querySelectorAll<HTMLElement>(".line");
    const last = lines[lines.length - 1];
    const done = () => setTyping(false);
    last?.addEventListener("animationend", done);
    return () => last?.removeEventListener("animationend", done);
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
      {typing && (
        <button
          type="button"
          className="poem-skip label link-quiet"
          onClick={() => {
            ref.current?.querySelector(".poem")?.classList.remove("typing");
            setTyping(false);
          }}
        >
          skip ›
        </button>
      )}
      <button type="button" className="reading-toggle label link-quiet" aria-pressed={reading} onClick={() => setReading((r) => !r)}>
        {reading ? "Leave reading mode" : "Reading mode"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Small things for people who type at a page. Each is a true statement, written in red pencil.
 * 1755 — the index of the stabilizer in the Tits group. tune — the cello's open strings.
 * fano — the smallest projective plane. And a note for anyone who opens the console.
 */
const EGGS: Record<string, string> = {
  "1755": "17 971 200 ÷ 10 240 = 1755",
  tune: "C₂ 65.4 · G₂ 98.0 · D₃ 146.8 · A₃ 220 Hz",
  fano: "7 points, 7 lines, 3 on each — and no smaller plane exists",
  qed: "∎ — the tombstone is Halmos’s",
};

export function Eggs() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "%cFeit–Higman (1964):%c a finite thick generalized n-gon exists only for n ∈ {2, 3, 4, 6, 8, 12}.\nYou are reading the source of a site about the 6 and the 8.",
      "color:#b3301a;font-style:italic",
      "color:inherit",
    );
    let buf = "";
    let timer: number | undefined;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]")) || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-8);
      const hit = Object.keys(EGGS).find((k) => buf.endsWith(k));
      if (hit) {
        buf = "";
        setMsg(EGGS[hit]);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setMsg(null), 4200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  return msg ? (
    <p className="egg" role="status">
      {msg}
    </p>
  ) : null;
}

"use client";

import { useEffect, useState } from "react";

/**
 * SET. Each card is a vector in F₃⁴ (number, shape, colour, fill); three cards form a set exactly
 * when they sum to zero — i.e. they are a line of the affine space AG(4, 3).
 */
type Card = [number, number, number, number];
const ALL: Card[] = Array.from({ length: 81 }, (_, i) => [i % 3, Math.floor(i / 3) % 3, Math.floor(i / 9) % 3, Math.floor(i / 27) % 3]);
const key = (c: Card) => c.join("");
const isSet = (a: Card, b: Card, c: Card) => a.every((_, i) => (a[i] + b[i] + c[i]) % 3 === 0);
const third = (a: Card, b: Card) => a.map((_, i) => (6 - a[i] - b[i]) % 3) as Card;

function findSet(cards: Card[]): number[] | null {
  const idx = new Map(cards.map((c, i) => [key(c), i]));
  for (let i = 0; i < cards.length; i++)
    for (let j = i + 1; j < cards.length; j++) {
      const k = idx.get(key(third(cards[i], cards[j])));
      if (k !== undefined && k > j) return [i, j, k];
    }
  return null;
}

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const COLORS = ["var(--red)", "var(--ink)", "#3d6e8f"];
const SHAPES = [
  "M -18 -9 C -18 -14, -12 -14, -6 -14 L 6 -14 C 12 -14, 18 -14, 18 -9 L 18 9 C 18 14, 12 14, 6 14 L -6 14 C -12 14, -18 14, -18 9 Z", // capsule
  "M 0 -15 L 20 0 L 0 15 L -20 0 Z", // diamond
  "M -16 10 C -22 -2, -12 -16, -2 -10 C 6 -6, 10 -14, 16 -12 C 22 -8, 14 8, 4 6 C -4 4, -8 16, -16 10 Z", // squiggle
];

function CardFace({ c, id }: { c: Card; id: string }) {
  const [n, shape, color, fill] = c;
  const col = COLORS[color];
  return (
    <svg viewBox="0 0 120 60" aria-label={`${n + 1} ${["capsule", "diamond", "squiggle"][shape]}${n ? "s" : ""}, ${["red", "black", "blue"][color]}, ${["solid", "striped", "open"][fill]}`} role="img">
      <defs>
        <pattern id={`st-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="4" stroke={col} strokeWidth="1.4" />
        </pattern>
      </defs>
      {Array.from({ length: n + 1 }, (_, i) => (
        <path
          key={i}
          d={SHAPES[shape]}
          transform={`translate(${60 + (i - n / 2) * 40} 30) scale(0.8)`}
          fill={fill === 0 ? col : fill === 1 ? `url(#st-${id})` : "none"}
          stroke={col}
          strokeWidth={2.2}
        />
      ))}
    </svg>
  );
}

export function SetGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [table, setTable] = useState<Card[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [found, setFound] = useState(0);
  const [hint, setHint] = useState<number | null>(null);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  const deal = () => {
    const d = shuffle(ALL);
    setTable(d.slice(0, 12));
    setDeck(d.slice(12));
    setSel([]);
    setFound(0);
    setHint(null);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect -- shuffle on the client only, so the server render is stable
  useEffect(deal, []);

  // Keep a set on the table while cards remain.
  useEffect(() => {
    if (table.length && !findSet(table) && deck.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- dealing three more is the rule of the game
      setTable((t) => [...t, ...deck.slice(0, 3)]);
      setDeck((d) => d.slice(3));
    }
  }, [table, deck]);

  const pick = (i: number) => {
    setHint(null);
    const next = sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i];
    if (next.length < 3) return setSel(next);
    const [a, b, c] = next.map((k) => table[k]);
    if (isSet(a, b, c)) {
      setFound((f) => f + 1);
      setFlash("ok");
      const rest = table.filter((_, k) => !next.includes(k));
      const refill = table.length <= 12 ? deck.slice(0, 3) : [];
      // Put replacements where the old cards were, so the table doesn't jump around.
      const t = [...table];
      if (refill.length) next.forEach((k, m) => (t[k] = refill[m]));
      setTable(refill.length ? t : rest);
      setDeck((d) => d.slice(refill.length));
    } else setFlash("no");
    setSel([]);
    window.setTimeout(() => setFlash(null), 500);
  };

  const over = table.length > 0 && !findSet(table) && !deck.length;

  return (
    <div className="set">
      <div className={`set-table ${flash ? `is-${flash}` : ""}`}>
        {table.map((c, i) => (
          <button key={key(c)} type="button" className={`set-card ${sel.includes(i) ? "is-sel" : ""} ${hint === i ? "is-hint" : ""}`} onClick={() => pick(i)} aria-pressed={sel.includes(i)}>
            <CardFace c={c} id={key(c)} />
          </button>
        ))}
      </div>
      <div className="set-bar">
        <span className="tnum">{found} found · {deck.length} in the deck</span>
        <button type="button" className="egg-btn" onClick={() => setHint(findSet(table)?.[0] ?? null)}>
          hint
        </button>
        <button type="button" className="egg-btn" onClick={deal}>
          new game
        </button>
      </div>
      {over && <p className="egg-win">No sets left. {found} found — the most possible is 27.</p>}
      <p className="text-note text-ink-3 mt-4">
        Three cards make a set when, for each of number, shape, colour and fill, they are all the same or all different.
        Read each card as a point of F₃⁴ and a set is just three points on a line — any two cards determine the third.
      </p>
    </div>
  );
}

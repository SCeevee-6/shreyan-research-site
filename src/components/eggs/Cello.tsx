"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A cello you can play. Press on a string and drag along it to change the stopped length; release to
 * lift the bow. The sound is a bowed-string approximation: a sawtooth through a body filter, with
 * vibrato that comes in after the note settles. Keys 1–4 play the open strings.
 */
const STRINGS = [
  { name: "C", f: 65.41 },
  { name: "G", f: 98.0 },
  { name: "D", f: 146.83 },
  { name: "A", f: 220.0 },
];
const NOTES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const noteName = (f: number) => {
  const m = Math.round(69 + 12 * Math.log2(f / 440));
  const cents = Math.round(100 * (69 + 12 * Math.log2(f / 440) - m));
  return `${NOTES[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}${cents ? ` ${cents > 0 ? "+" : ""}${cents}¢` : ""}`;
};

const H = 520; // fingerboard length on screen, nut to the end of the board
const BOARD = 0.62; // the board covers this fraction of the vibrating string
const freqAt = (s: number, y: number) => STRINGS[s].f / (1 - (Math.max(0, Math.min(H, y)) / H) * BOARD);
// First-position tapes: whole steps 1, 2, 3, 4 semitones above the open string.
const tapes = [1, 2, 3, 4, 5, 7].map((st) => (1 - 2 ** (-st / 12)) / BOARD * H);

type Voice = { osc: OscillatorNode; gain: GainNode; lfoGain: GainNode };

export function Cello() {
  const ctx = useRef<AudioContext | null>(null);
  const voice = useRef<Voice | null>(null);
  const [playing, setPlaying] = useState<{ s: number; y: number } | null>(null);

  const start = (s: number, y: number) => {
    ctx.current ??= new AudioContext();
    const ac = ctx.current;
    void ac.resume();
    stop();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freqAt(s, y);
    // Body: a low-pass and two resonances near the cello's main body modes.
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    const b1 = ac.createBiquadFilter();
    b1.type = "peaking";
    b1.frequency.value = 220;
    b1.gain.value = 6;
    const b2 = ac.createBiquadFilter();
    b2.type = "peaking";
    b2.frequency.value = 600;
    b2.gain.value = 4;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 5.4;
    const lfoGain = ac.createGain();
    lfoGain.gain.setValueAtTime(0, t);
    lfoGain.gain.linearRampToValueAtTime(osc.frequency.value * 0.006, t + 0.6);
    lfo.connect(lfoGain).connect(osc.frequency);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.09);
    osc.connect(lp).connect(b1).connect(b2).connect(gain).connect(ac.destination);
    osc.start();
    lfo.start();
    voice.current = { osc, gain, lfoGain };
    setPlaying({ s, y });
  };

  const move = (s: number, y: number) => {
    const v = voice.current;
    if (!v || !ctx.current || playing?.s !== s) return;
    v.osc.frequency.setTargetAtTime(freqAt(s, y), ctx.current.currentTime, 0.015);
    setPlaying({ s, y });
  };

  function stop() {
    const v = voice.current;
    const ac = ctx.current;
    if (!v || !ac) return;
    const t = ac.currentTime;
    v.gain.gain.cancelScheduledValues(t);
    v.gain.gain.setTargetAtTime(0, t, 0.08);
    v.osc.stop(t + 0.5);
    voice.current = null;
    setPlaying(null);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const i = ["1", "2", "3", "4"].indexOf(e.key);
      if (i >= 0 && !e.repeat) start(i, 0);
    };
    const up = (e: KeyboardEvent) => ["1", "2", "3", "4"].includes(e.key) && stop();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  const yOf = (e: React.PointerEvent<SVGElement>) => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
    const r = svg.getBoundingClientRect();
    return ((e.clientY - r.top) / r.height) * (H + 60) - 30;
  };

  return (
    <div className="cello">
      <svg viewBox={`0 0 240 ${H + 60}`} className="cello-board" onPointerUp={stop} onPointerLeave={stop}>
        <path d={`M 60 30 L 180 30 L 196 ${H + 30} L 44 ${H + 30} Z`} className="cello-wood" />
        <line x1={58} x2={182} y1={30} y2={30} className="cello-nut" />
        {tapes.map((y, i) => (
          <line key={i} x1={62 - (y / H) * 16} x2={178 + (y / H) * 16} y1={30 + y} y2={30 + y} className="cello-tape" />
        ))}
        {STRINGS.map((st, s) => {
          const x0 = 78 + s * 28;
          const x1 = 66 + s * 36;
          const on = playing?.s === s;
          return (
            <g key={st.name}>
              <line x1={x0} x2={x1} y1={30} y2={H + 30} className={`cello-string ${on ? "is-on" : ""}`} style={{ strokeWidth: 3.2 - s * 0.55 }} />
              <line
                x1={x0}
                x2={x1}
                y1={30}
                y2={H + 30}
                className="cello-hit"
                onPointerDown={(e) => {
                  (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                  start(s, yOf(e));
                }}
                onPointerMove={(e) => e.buttons && move(s, yOf(e))}
              />
              <text x={x0} y={20} textAnchor="middle" className="cello-label">
                {st.name}
              </text>
              {on && playing && <circle cx={x0 + ((x1 - x0) * Math.max(0, playing.y)) / H} cy={30 + Math.max(0, playing.y)} r={7} className="cello-finger" />}
            </g>
          );
        })}
      </svg>
      <div className="cello-side">
        <p className="cello-note tnum" aria-live="polite">{playing ? noteName(freqAt(playing.s, playing.y)) : "—"}</p>
        <p className="text-note text-ink-3">
          Press a string and hold; slide to change the note. The pale lines are first-position tapes. Keys 1–4 play the open
          strings, C G D A.
        </p>
      </div>
    </div>
  );
}

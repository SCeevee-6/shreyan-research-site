/** Renders a poem from plain text: blank lines separate stanzas, a two-space indent marks an indented line. Every fifth line is numbered. */
export function Poem({ text }: { text: string }) {
  const stanzas = text
    .trim()
    .split(/\n\s*\n/)
    .map((s) => s.split("\n").filter((l) => l.trim().length));
  let n = 0;
  // Per-line character count and start time, for the typewriter reveal (CSS-only; see .poem.typing).
  const starts = stanzas.flat().reduce<number[]>((acc, l, i, all) => [...acc, i ? acc[i - 1] + all[i - 1].trim().length * 38 + 260 : 0], []);
  const timing = (i: number, line: string) => {
    const c = line.trim().length;
    return { "--n": c, "--at": `${starts[i]}ms`, "--dur": `${c * 38}ms` } as React.CSSProperties;
  };
  return (
    <div className="poem">
      {stanzas.map((lines, i) => (
        <p key={i} className="stanza">
          {lines.map((line) => {
            n++;
            const indent = /^\s{2,}/.test(line);
            return (
              <span key={n} className="line block" data-indent={indent ? 1 : undefined} style={timing(n - 1, line)}>
                {n % 5 === 0 && (
                  <span className="ln" aria-hidden>
                    {n}
                  </span>
                )}
                {line.trim()}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

export function lineCount(text: string) {
  return text.split("\n").filter((l) => l.trim().length).length;
}

export function firstLine(text: string) {
  return text.trim().split("\n")[0].trim();
}

import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { site } from "@/site.config";

export const alt = `${site.name} — Notebook`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamic = "force-static";

export default async function OpenGraphImage() {
  const dir = path.join(process.cwd(), "node_modules/@fontsource/newsreader/files");
  const [roman, italic] = await Promise.all([
    fs.readFile(path.join(dir, "newsreader-latin-300-normal.woff")),
    fs.readFile(path.join(dir, "newsreader-latin-400-italic.woff")),
  ]);

  // The cover plate, reduced: the intersection diagram of a generalized hexagon of order (2, 2),
  // layers of 1, 6, 24 and 32 points, with the fused distances 1 and 2 bracketed in red.
  const W = 1200, BASE = 630, CY = 500;
  const k = [1, 6, 24, 32];
  const xs = [520, 680, 850, 1040];
  const r = k.map((v) => 18 + 8 * Math.sqrt(v));
  const parts: string[] = [];
  for (let i = 0; i < 3; i++)
    parts.push(`<line x1="${xs[i] + r[i]}" x2="${xs[i + 1] - r[i + 1]}" y1="${CY}" y2="${CY}" stroke="#1a1915" stroke-opacity="0.55" stroke-width="1.5"/>`);
  for (let i = 0; i < 4; i++)
    parts.push(`<circle cx="${xs[i]}" cy="${CY}" r="${r[i]}" fill="none" stroke="#1a1915" stroke-opacity="0.7" stroke-width="1.5"/>`);
  parts.push(`<path d="M ${xs[1] - r[1]} ${CY + r[3] + 14} v 10 H ${xs[2] + r[2]} v -10" fill="none" stroke="#b3301a" stroke-width="2.5"/>`);
  const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BASE}" viewBox="0 0 ${W} ${BASE}">${parts.join("")}</svg>`,
  )}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3efe7", color: "#1a1915", padding: "56px 72px", position: "relative", fontFamily: "Newsreader", fontWeight: 300 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={svg} width={W} height={BASE} style={{ position: "absolute", left: 0, top: 0 }} alt="" />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#68645a", borderBottom: "1px solid rgba(26,25,21,0.25)", paddingBottom: 14 }}>
          <span>Research · Mathematics · Writing · Music</span>
          <span>{site.location}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30, fontSize: 132, lineHeight: 0.88, letterSpacing: -4 }}>
          <span>{site.givenName}</span>
          <span style={{ fontStyle: "italic", fontWeight: 400, paddingLeft: 110 }}>{site.familyName}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: roman, weight: 300, style: "normal" },
        { name: "Newsreader", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}

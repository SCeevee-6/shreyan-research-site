// Design-review harness: captures every route at desktop, tablet and mobile widths
// and reports layout faults (horizontal overflow, console errors, failed requests).
//
//   node scripts/screenshots.mjs [--base http://localhost:3000] [--only cover,music] [--dark] [--fold]
//
// Screenshots land in .shots/<viewport>/<name>.png
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = arg("--base", "http://localhost:3000");
const ONLY = arg("--only", "")?.split(",").filter(Boolean);
const DARK = args.includes("--dark");
const FOLD = args.includes("--fold"); // viewport-only (above the fold) instead of full page
const OUT = path.resolve(arg("--out", ".shots"));

const routes = [
  ["cover", "/"],
  ["about", "/about"],
  ["research", "/research"],
  ["research-entry", "/research/generalized-polygon-schemes"],
  ["research-tits", "/research/tits-group-orbital-configurations"],
  ["publications", "/publications"],
  ["mathematics", "/mathematics"],
  ["math-note", "/mathematics/fusion-theorem"],
  ["math-tits", "/mathematics/tits-1755"],
  ["math-orbitals", "/mathematics/tits-orbital-algebras"],
  ["math-ledger", "/mathematics/results-ledger"],
  ["achievements", "/achievements"],
  ["writing", "/writing"],
  ["poem", "/writing/the-vase"],
  ["research-protein", "/research/protein-error-prediction"],
  ["vignette", "/writing/dress-up"],
  ["music", "/music"],
  ["contact", "/contact"],
  ["not-found", "/no-such-page"],
].filter(([n]) => !ONLY.length || ONLY.includes(n));

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 834, height: 1112 }],
  ["mobile", { width: 390, height: 844 }],
].filter(([n]) => !arg("--vp") || arg("--vp").split(",").includes(n));

const browser = await chromium.launch();
const problems = [];

for (const [vpName, viewport] of viewports) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: DARK ? "dark" : "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`[${vpName}] console: ${m.text()}`));
  page.on("requestfailed", (r) => problems.push(`[${vpName}] request failed: ${r.url()}`));
  await fs.mkdir(path.join(OUT, vpName + (DARK ? "-dark" : "")), { recursive: true });

  for (const [name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > w + 1 && getComputedStyle(el).position !== "fixed";
        })
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}`);
      return { scroll: document.documentElement.scrollWidth > w, offenders };
    });
    if (overflow.scroll) problems.push(`[${vpName}] ${name}: horizontal overflow → ${overflow.offenders.join(", ")}`);
    const file = path.join(OUT, vpName + (DARK ? "-dark" : ""), `${name}.png`);
    await page.screenshot({ path: file, fullPage: !FOLD });
  }
  await ctx.close();
}
await browser.close();

console.log(`Captured ${routes.length} routes × ${viewports.length} viewports → ${OUT}`);
console.log(problems.length ? `\nProblems:\n  ${problems.join("\n  ")}` : "No layout problems detected.");

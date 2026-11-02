// Accessibility audit: runs axe-core (WCAG 2.2 A/AA) on every route in light and dark schemes,
// and checks that each page has exactly one h1 and that the contents dialog traps focus.
//
//   node scripts/a11y.mjs [--base http://localhost:3000]
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const i = process.argv.indexOf("--base");
const BASE = i > 0 ? process.argv[i + 1] : "http://localhost:3000";
const routes = [
  "/", "/about", "/research", "/research/generalized-polygon-schemes", "/research/tits-group-orbital-configurations",
  "/publications", "/mathematics", "/mathematics/fusion-theorem", "/mathematics/tits-1755",
  "/mathematics/tits-orbital-algebras", "/mathematics/results-ledger", "/achievements", "/writing", "/writing/the-vase",
  "/writing/reflecting-pool", "/writing/forest", "/research/protein-error-prediction", "/writing/dress-up", "/music",
  "/contact",
];

const browser = await chromium.launch();
let failures = 0;

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .exclude(".katex-mathml") // KaTeX's hidden MathML mirror is for assistive tech, not visual contrast
      .analyze();
    const h1 = await page.locator("h1").count();
    const issues = result.violations.map((v) => `${v.id} (${v.impact}) × ${v.nodes.length}: ${v.nodes[0]?.target.join(" ")}`);
    if (h1 !== 1) issues.push(`expected one h1, found ${h1}`);
    if (issues.length) {
      failures += issues.length;
      console.log(`✗ [${scheme}] ${route}\n    ${issues.join("\n    ")}`);
    }
  }
  await ctx.close();
}

// Keyboard: the folded contents dialog opens, traps focus, and closes on Escape.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/research");
  await page.getByRole("button", { name: /contents/i }).click();
  const open = await page.locator("dialog[open]").count();
  for (let k = 0; k < 15; k++) await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => !!document.activeElement?.closest("dialog"));
  await page.keyboard.press("Escape");
  const closed = (await page.locator("dialog[open]").count()) === 0;
  if (!(open && inside && closed)) {
    failures++;
    console.log(`✗ contents dialog: open=${open} focusTrapped=${inside} closesOnEscape=${closed}`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} accessibility issue(s).` : `All ${routes.length} routes pass axe (light & dark); dialog keyboard behaviour OK.`);
process.exit(failures ? 1 : 0);

// Renders the built app's Document view to public/ricardo-valero-cv.pdf —
// the file the header's "Download PDF" link serves. Run after content or
// style changes: npm run build && npm run pdf (then rebuild or copy to dist).
//
// reducedMotion: revealOnScroll bails out under reduced motion, so every
// [data-reveal] item renders at full opacity without scripted scrolling.
import { copyFileSync, existsSync } from "node:fs"
import { chromium } from "playwright"
import { preview } from "vite"

const OUT = "public/ricardo-valero-cv.pdf"

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html not found — run `npm run build` first")
  process.exit(1)
}

const server = await preview({ preview: { port: 4173, strictPort: true } })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ reducedMotion: "reduce" })
  // vite preview mounts under the configured base, so the hash route hangs off it
  await page.goto("http://localhost:4173/portfolio/#/document")
  await page.waitForSelector(".document-company")
  // real page margins repeat on every page; they render white (Chromium
  // never paints backgrounds there), which the print tokens match by
  // setting --paper to white
  await page.pdf({
    path: OUT,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", right: "14mm", bottom: "16mm", left: "14mm" },
  })
  // keep the current build's copy in sync so a rebuild isn't required
  copyFileSync(OUT, "dist/ricardo-valero-cv.pdf")
  console.log(`✓ wrote ${OUT} (and dist copy)`)
} finally {
  await browser.close()
  await new Promise((resolve) => server.httpServer.close(resolve))
}

import { chromium } from "playwright"

// vite preview mounts under vite.config.ts's `base`, hence the /portfolio suffix
const BASE = process.env.BASE_URL ?? "http://localhost:4173/portfolio"
const results = []
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail })
  console.log(ok ? "✓" : "✗", name, detail)
}

const browser = await chromium.launch()

// --- desktop pass -----------------------------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${BASE}/#/document`)
  await page.waitForSelector(".document-company")
  // scroll through so every reveal group fires, then capture settled state
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (el) => getComputedStyle(el).opacity === "0",
      ).length,
  )
  check("all reveal items visible after scroll", hidden === 0, `${hidden} hidden`)
  await page.screenshot({ path: "shots/desktop-document.png", fullPage: true })

  // keyboard: tab until the Timeline switcher button has focus, press Enter
  let focused = ""
  for (let i = 0; i < 15 && focused !== "Timeline"; i++) {
    await page.keyboard.press("Tab")
    focused = await page.evaluate(() => document.activeElement?.textContent ?? "")
  }
  check("keyboard reaches Timeline switch", focused === "Timeline")
  const outline = await page.evaluate(
    () => getComputedStyle(document.activeElement).outlineStyle,
  )
  check("focus visible on switcher", outline !== "none", `outline: ${outline}`)
  await page.keyboard.press("Enter")
  await page.waitForSelector(".timeline-entry", { timeout: 5000 })
  check("Enter switches to timeline", page.url().includes("#/timeline"))
  await page.waitForTimeout(600)
  await page.screenshot({ path: "shots/desktop-timeline.png", fullPage: true })

  // keyboard into a collapsible trigger and expand it
  let state = null
  for (let i = 0; i < 10 && state === null; i++) {
    await page.keyboard.press("Tab")
    state = await page.evaluate(() =>
      document.activeElement?.classList.contains("timeline-trigger")
        ? document.activeElement.getAttribute("data-state")
        : null,
    )
  }
  check("keyboard reaches collapsible trigger", state !== null, `state: ${state}`)
  await page.keyboard.press("Enter")
  await page.waitForTimeout(400)
  const open = await page.evaluate(
    () => document.activeElement?.getAttribute("data-state"),
  )
  check("Enter expands entry", open === "open", `state: ${open}`)
  const demoInTimeline = await page.evaluate(
    () => document.querySelectorAll(".demo-stage").length,
  )
  check("demo stage in expanded entry", demoInTimeline > 0, `${demoInTimeline} stages`)
  await page.screenshot({ path: "shots/desktop-timeline-open.png", fullPage: true })

  // rapid collapsible toggling mid-demo must not error or orphan loops
  const pageErrors = []
  page.on("pageerror", (e) => pageErrors.push(e.message))
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Enter")
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(600)
  check("rapid collapsible toggle: no errors", pageErrors.length === 0, pageErrors.join("; "))
  await page.close()
}

// --- mobile pass -------------------------------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
  for (const view of ["document", "timeline"]) {
    await page.goto(`${BASE}/#/${view}`)
    await page.waitForSelector(view === "document" ? ".document-company" : ".timeline-entry")
    await page.waitForTimeout(600)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    check(`mobile ${view}: no horizontal overflow`, overflow <= 0, `overflow: ${overflow}px`)
    await page.screenshot({ path: `shots/mobile-${view}.png`, fullPage: view === "document" })
  }
  await page.close()
}

// --- reduced motion pass -------------------------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(`${BASE}/#/document`)
  await page.waitForSelector(".document-company")
  const t0 = Date.now()
  await page.click("text=Timeline")
  await page.waitForSelector(".timeline-entry")
  const elapsed = Date.now() - t0
  // reduced motion keeps a brief opacity-only crossfade (~150ms exit), no movement
  check("reduced motion: quick opacity-only switch", elapsed < 600, `${elapsed}ms`)
  const opacity = await page.evaluate(
    () => getComputedStyle(document.querySelector(".timeline-entry")).opacity,
  )
  check("reduced motion: content fully visible", opacity === "1", `opacity: ${opacity}`)

  // demos must render their static final state — nothing hidden, no loops
  await page.goto(`${BASE}/#/document`)
  await page.waitForSelector(".demo-stage")
  await page.waitForTimeout(500)
  const hiddenDemoParts = await page.evaluate(
    () =>
      // dot/beam are transient actors, hidden by design in the static state
      [...document.querySelectorAll(
        ".demo-stage [data-d]:not([data-d='dot']):not([data-d='beam'])",
      )].filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length,
  )
  check("reduced motion: demo final state fully visible", hiddenDemoParts === 0, `${hiddenDemoParts} dimmed parts`)
  await page.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)

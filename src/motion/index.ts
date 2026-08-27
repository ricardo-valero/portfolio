import { animate, inView, stagger } from "motion"
import { onCleanup } from "solid-js"

/**
 * All animation goes through these helpers: they bind to Solid's lifecycle
 * (onCleanup) and honor prefers-reduced-motion, so views never touch the
 * motion API directly and can't leak observers or animate unmounted nodes.
 *
 * Timing values mirror the motion tokens in tokens.css (--reveal-duration,
 * --exit-duration, --stagger-step, --ease-out) — keep them in sync.
 */

const REVEAL_MS = 250
const EXIT_MS = 150
const STAGGER_S = 0.06
const STAGGER_CAP = 6 // reveal cascades never exceed ~360ms regardless of count
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export const reducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Staggered fade/slide-up of `[data-reveal]` descendants inside each
 * `[data-reveal-group]` when the group scrolls into view. Fires once per
 * group (inView with no returned cleanup observes a single entry). The
 * stagger is capped so long lists don't cascade mostly off-screen.
 * Call during component setup (onMount) — cleanup is registered here.
 */
export const revealOnScroll = (root: HTMLElement): void => {
  const groups = root.querySelectorAll<HTMLElement>("[data-reveal-group]")
  if (reducedMotion()) return
  const stops: VoidFunction[] = []
  for (const group of groups) {
    const items = group.querySelectorAll<HTMLElement>("[data-reveal]")
    if (items.length === 0) continue
    for (const item of items) item.style.opacity = "0"
    stops.push(
      inView(
        group,
        () => {
          animate(
            items,
            { opacity: [0, 1], transform: ["translateY(16px)", "none"] },
            {
              duration: REVEAL_MS / 1000,
              ease: EASE_OUT,
              delay: (i: number) => Math.min(i, STAGGER_CAP) * STAGGER_S,
            },
          )
        },
        // "some": fire on any intersection — a ratio threshold can be
        // unreachable for groups much taller than the viewport
        { amount: "some", margin: "0px 0px -80px 0px" },
      ),
    )
  }
  onCleanup(() => {
    for (const stop of stops) stop()
  })
}

/**
 * Choreographed view exit: quick fade/slide out. Resolves when done.
 * Exits still use a strong ease-out — starting fast matters most while
 * the user is watching. Reduced motion keeps an opacity-only fade.
 */
export const animateViewExit = async (el: HTMLElement): Promise<void> => {
  const keyframes = reducedMotion()
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(-8px)" }
  await animate(el, keyframes, {
    duration: EXIT_MS / 1000,
    ease: EASE_OUT,
  }).finished
}

/**
 * Choreographed view enter: the container fades/slides in as one unit.
 * Item-level reveals belong to revealOnScroll — never both on one node,
 * or the two systems restart each other mid-flight.
 */
export const animateViewEnter = (el: HTMLElement): void => {
  const keyframes = reducedMotion()
    ? { opacity: [0, 1] }
    : { opacity: [0, 1], transform: ["translateY(16px)", "none"] }
  animate(el, keyframes, { duration: REVEAL_MS / 1000, ease: EASE_OUT })
}

/**
 * Cancel an in-flight transition: retarget the container back to rest from
 * its CURRENT values — no from-keyframes, or the opacity visibly pops.
 */
export const animateViewCancel = (el: HTMLElement): void => {
  animate(
    el,
    { opacity: 1, transform: "translateY(0px)" },
    { duration: EXIT_MS / 1000, ease: EASE_OUT },
  )
}

export type DemoLoopControls = { replay: () => void }

/**
 * Play a demo cycle ONCE per viewport entry — the vignette explains, then
 * rests in its final state; scrolling away and back re-triggers a pass,
 * click/Enter replays deliberately. No infinite loops: many stages on one
 * page phase-lock into a pulsing wall. Markup must show the FINAL state by
 * default — under reduced motion this never runs and the static diagram
 * stands on its own. Call during component setup (onMount).
 */
export const demoLoop = (
  el: HTMLElement,
  cycle: () => Promise<void>,
): DemoLoopControls => {
  if (reducedMotion()) return { replay: () => {} }
  let disposed = false
  let visible = false
  let running = false

  const play = async () => {
    if (running || disposed) return
    running = true
    await cycle()
    running = false
  }

  const stop = inView(
    el,
    () => {
      visible = true
      void play()
      return () => {
        visible = false
      }
    },
    { amount: 0.4 },
  )

  onCleanup(() => {
    disposed = true
    stop()
  })

  return {
    replay: () => {
      if (!disposed && visible) void play()
    },
  }
}

/** Constant-motion actors (typing, scans, travel) get linear/ease-in-out. */
export const DEMO_EASE_INOUT: [number, number, number, number] = [
  0.77, 0, 0.175, 1,
]

/** Shared easing/duration for demo cycle steps, mirroring the tokens. */
export const demoStep = (
  targets: Parameters<typeof animate>[0],
  keyframes: Record<string, unknown>,
  opts?: {
    duration?: number
    delayStep?: number
    ease?: "linear" | [number, number, number, number]
  },
): Promise<void> =>
  animate(targets as never, keyframes as never, {
    duration: opts?.duration ?? REVEAL_MS / 1000,
    ease: opts?.ease ?? EASE_OUT,
    delay: opts?.delayStep !== undefined ? stagger(opts.delayStep) : undefined,
  }).finished.then(() => {})

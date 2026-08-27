import { For, type Component } from "solid-js"
import { demoStep } from "../../motion"

const DEFAULT_LABELS = ["uptime", "throughput", "status"]
const CHART_POINTS = "0,26 14,20 28,23 42,12 56,16 70,7 84,10 100,3"

/**
 * A ticking line chart plus status chips settling to OK.
 * Final state (markup): full chart drawn, chips OK.
 */
export const Dashboard: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 3) ?? DEFAULT_LABELS
  return (
    <div class="demo-dashboard">
      <svg
        class="demo-dashboard-chart"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
      >
        <polyline
          data-d="plot"
          points={CHART_POINTS}
          fill="none"
          pathLength="1"
        />
      </svg>
      <div class="demo-dashboard-chips">
        <For each={labels()}>
          {(label) => (
            <span class="demo-chip is-ok" data-d="chip">
              <span class="demo-chip-dot" />
              {label}
            </span>
          )}
        </For>
      </div>
    </div>
  )
}

export const dashboardCycle = async (root: HTMLElement): Promise<void> => {
  const plot = root.querySelector("[data-d='plot']")
  const chips = [...root.querySelectorAll("[data-d='chip']")]
  // unified reset fade — never snap the drawn chart back to zero
  await demoStep([...(plot ? [plot] : []), ...chips], { opacity: 0 }, {
    duration: 0.18,
  })
  if (plot) {
    await demoStep(plot, { opacity: 1, strokeDashoffset: [1, 0] }, {
      duration: 0.9,
    })
  }
  await demoStep(
    chips,
    { opacity: 1, transform: ["translateY(4px)", "none"] },
    { duration: 0.25, delayStep: 0.1 },
  )
}

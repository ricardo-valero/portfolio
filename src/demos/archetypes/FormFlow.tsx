import { For, type Component } from "solid-js"
import { demoStep } from "../../motion"

const DEFAULT_LABELS = ["name", "id", "unit"]

/**
 * Form fields fill and validate one by one; a scan sweep finishes.
 * Final state (markup): all fields filled and checked, beam hidden
 * (transient actor, not part of the diagram).
 */
export const FormFlow: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 3) ?? DEFAULT_LABELS
  return (
    <div class="demo-formflow">
      <For each={labels()}>
        {(label) => (
          <div class="demo-formflow-row">
            <span class="demo-label">{label}</span>
            <span class="demo-formflow-field">
              <span class="demo-formflow-fill" data-d="fill" />
            </span>
            <span class="demo-formflow-check" data-d="check">
              ✓
            </span>
          </div>
        )}
      </For>
      <div class="demo-formflow-scan">
        <span class="demo-formflow-beam" data-d="beam" />
      </div>
    </div>
  )
}

export const formFlowCycle = async (root: HTMLElement): Promise<void> => {
  const fills = [...root.querySelectorAll("[data-d='fill']")]
  const checks = [...root.querySelectorAll("[data-d='check']")]
  const beam = root.querySelector("[data-d='beam']")
  await demoStep([...fills, ...checks], { opacity: 0 }, { duration: 0.18 })
  for (let i = 0; i < fills.length; i++) {
    await demoStep(
      fills[i],
      { opacity: 1, transform: ["scaleX(0)", "scaleX(1)"] },
      { duration: 0.3 },
    )
    await demoStep(
      checks[i],
      { opacity: [0, 1], transform: ["scale(0.9)", "scale(1)"] },
      { duration: 0.15 },
    )
  }
  if (beam) {
    // beam is 40% of the bar: 250% of its own width completes the sweep
    await demoStep(
      beam,
      {
        transform: ["translateX(-100%)", "translateX(250%)"],
        opacity: [0, 1, 1, 0],
      },
      { duration: 0.45, ease: "linear" },
    )
  }
}

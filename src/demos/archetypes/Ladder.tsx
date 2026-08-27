import { For, type Component } from "solid-js"
import { demoStep } from "../../motion"

const DEFAULT_LABELS = ["input", "logic", "output"]

/**
 * Ladder-logic rungs between two rails: power flows across each rung in
 * turn and its coil energizes. Final state (markup): all rungs energized.
 */
export const Ladder: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 3) ?? DEFAULT_LABELS
  return (
    <div class="demo-ladder">
      <For each={labels()}>
        {(label) => (
          <div class="demo-ladder-row">
            <span class="demo-label">{label}</span>
            <span class="demo-ladder-rung">
              <span class="demo-ladder-flow" data-d="flow" />
              <span class="demo-ladder-contact" />
            </span>
            <span class="demo-ladder-coil">
              <span class="demo-ladder-coil-fill" data-d="coil" />
            </span>
          </div>
        )}
      </For>
    </div>
  )
}

export const ladderCycle = async (root: HTMLElement): Promise<void> => {
  const flows = [...root.querySelectorAll("[data-d='flow']")]
  const coils = [...root.querySelectorAll("[data-d='coil']")]
  // de-energize, then power flows rung by rung
  await demoStep([...flows, ...coils], { opacity: 0 }, { duration: 0.18 })
  for (let i = 0; i < flows.length; i++) {
    // power flow is constant motion → linear
    await demoStep(
      flows[i],
      { opacity: 1, transform: ["scaleX(0)", "scaleX(1)"] },
      { duration: 0.3, ease: "linear" },
    )
    await demoStep(
      coils[i],
      { opacity: [0, 1], transform: ["scale(0.9)", "scale(1)"] },
      { duration: 0.15 },
    )
  }
}

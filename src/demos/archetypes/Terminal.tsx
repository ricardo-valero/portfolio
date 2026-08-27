import { For, type Component } from "solid-js"
import { demoStep } from "../../motion"

const DEFAULT_LABELS = ["build", "test", "deploy"]

/**
 * Commands type themselves, each confirmed with an ok marker.
 * Final state (markup): full transcript with all ok markers.
 */
export const Terminal: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 3) ?? DEFAULT_LABELS
  return (
    <div class="demo-terminal">
      <For each={labels()}>
        {(label) => (
          <div class="demo-terminal-line">
            <span class="demo-terminal-prompt">$</span>
            <span class="demo-terminal-cmd" data-d="cmd">
              {label}
            </span>
            <span class="demo-terminal-ok" data-d="ok">
              ok
            </span>
          </div>
        )}
      </For>
    </div>
  )
}

export const terminalCycle = async (root: HTMLElement): Promise<void> => {
  const cmds = [...root.querySelectorAll("[data-d='cmd']")]
  const oks = [...root.querySelectorAll("[data-d='ok']")]
  await demoStep([...cmds, ...oks], { opacity: 0 }, { duration: 0.18 })
  for (let i = 0; i < cmds.length; i++) {
    // typing is constant motion → linear
    await demoStep(
      cmds[i],
      { opacity: 1, clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
      { duration: 0.3, ease: "linear" },
    )
    await demoStep(oks[i], { opacity: [0, 1] }, { duration: 0.15 })
  }
}

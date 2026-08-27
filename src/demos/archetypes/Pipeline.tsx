import { For, Show, type Component } from "solid-js"
import { DEMO_EASE_INOUT, demoStep } from "../../motion"

const DEFAULT_LABELS = ["source", "store", "transform", "serve"]

/**
 * Nodes connected left→right; a dot travels each track and nodes light up
 * as it arrives. Final state (markup): every node lit, dots hidden
 * (transient actors are not part of the diagram).
 */
export const Pipeline: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 4) ?? DEFAULT_LABELS
  return (
    <div class="demo-pipeline">
      <For each={labels()}>
        {(label, i) => (
          <>
            <Show when={i() > 0}>
              <span class="demo-pipeline-track">
                <span class="demo-pipeline-dot" data-d="dot" />
              </span>
            </Show>
            <span class="demo-pipeline-node is-lit" data-d="node">
              <span class="demo-label">{label}</span>
            </span>
          </>
        )}
      </For>
    </div>
  )
}

export const pipelineCycle = async (root: HTMLElement): Promise<void> => {
  const nodes = [...root.querySelectorAll("[data-d='node']")]
  const dots = [...root.querySelectorAll("[data-d='dot']")]
  // dim everything, then light stage by stage as the dot crosses
  await demoStep(nodes, { opacity: [null, 0.35] }, { duration: 0.18 })
  if (nodes[0]) await demoStep(nodes[0], { opacity: 1 }, { duration: 0.15 })
  for (let i = 0; i < dots.length; i++) {
    // dot is 8px on a 20px track: 150% of its own width spans the track
    await demoStep(
      dots[i],
      {
        transform: ["translateX(0)", "translateX(150%)"],
        opacity: [0, 1, 1, 0],
      },
      { duration: 0.25, ease: DEMO_EASE_INOUT },
    )
    const next = nodes[i + 1]
    if (next) {
      await demoStep(next, { opacity: 1, transform: ["scale(1.08)", "scale(1)"] }, {
        duration: 0.15,
      })
    }
  }
}

import { Show, onMount, type Component } from "solid-js"
import { Dynamic } from "solid-js/web"
import type { Demo } from "../schema/resume"
import { demoLoop, reducedMotion, type DemoLoopControls } from "../motion"
import { demoRegistry } from "./registry"
import "./demos.css"

/**
 * Chrome around a demo archetype: bounded vignette, plays once per viewport
 * entry via demoLoop, button replays. Markup renders the final state, so
 * reduced motion (a plain non-interactive figure) and any animation failure
 * still show a readable diagram.
 */
export const DemoStage: Component<{ demo: Demo }> = (props) => {
  let root!: HTMLElement
  let controls: DemoLoopControls | undefined
  const definition = () => demoRegistry[props.demo.archetype]
  const description = () =>
    props.demo.labels?.join(", ") ?? props.demo.archetype

  onMount(() => {
    controls = demoLoop(root, () => definition().cycle(root))
  })

  const vignette = (
    <div class="demo-stage-canvas" aria-hidden="true">
      <Dynamic component={definition().view} labels={props.demo.labels} />
    </div>
  )

  return (
    <Show
      when={!reducedMotion()}
      fallback={
        <div
          class="demo-stage"
          ref={(el) => (root = el)}
          role="img"
          aria-label={`Diagram: ${description()}`}
        >
          {vignette}
        </div>
      }
    >
      <button
        type="button"
        class="demo-stage"
        ref={(el) => (root = el)}
        aria-label={`Replay demo animation: ${description()}`}
        onClick={() => controls?.replay()}
      >
        {vignette}
      </button>
    </Show>
  )
}

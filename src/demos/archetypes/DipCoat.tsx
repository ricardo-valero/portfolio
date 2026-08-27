import { For, type Component } from "solid-js"
import { DEMO_EASE_INOUT, demoStep } from "../../motion"

const DEFAULT_LABELS = ["bath A", "bath B"]

/**
 * A sample rod dips into liquid baths in a timed sequence: immerse, hold,
 * withdraw, move to the next bath, repeat. Final state (markup): rod
 * raised over the last bath.
 */
export const DipCoat: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 3) ?? DEFAULT_LABELS
  return (
    <div class="demo-dipcoat">
      <div
        class="demo-dipcoat-arm"
        data-d="arm"
        style={{
          width: `${100 / labels().length}%`,
          // final state: raised over the last bath (cycle's end position)
          transform: `translate(${(labels().length - 1) * 100}%, 0px)`,
        }}
      >
        <span class="demo-dipcoat-rod" />
        <span class="demo-dipcoat-sample" />
      </div>
      <div class="demo-dipcoat-baths">
        <For each={labels()}>
          {(label) => (
            <div class="demo-dipcoat-slot">
              <span class="demo-dipcoat-well">
                <span class="demo-dipcoat-liquid" />
              </span>
              <span class="demo-label">{label}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export const dipCoatCycle = async (root: HTMLElement): Promise<void> => {
  const arm = root.querySelector("[data-d='arm']")
  if (!arm) return
  const baths = root.querySelectorAll(".demo-dipcoat-slot").length
  // reset to the first bath without snapping the visible final state
  await demoStep(arm, { opacity: 0 }, { duration: 0.18 })
  await demoStep(arm, { opacity: 1, transform: "translate(0%, 0px)" }, {
    duration: 0.15,
  })
  // to-only keyframes throughout: immerse → hold → withdraw → transfer
  for (let i = 0; i < baths; i++) {
    const x = `${i * 100}%`
    await demoStep(arm, { transform: `translate(${x}, 14px)` }, {
      duration: 0.25,
      ease: DEMO_EASE_INOUT,
    })
    await demoStep(arm, { transform: `translate(${x}, 14px)` }, {
      duration: 0.2,
    })
    await demoStep(arm, { transform: `translate(${x}, 0px)` }, {
      duration: 0.25,
      ease: DEMO_EASE_INOUT,
    })
    if (i < baths - 1) {
      await demoStep(arm, { transform: `translate(${(i + 1) * 100}%, 0px)` }, {
        duration: 0.2,
        ease: DEMO_EASE_INOUT,
      })
    }
  }
}

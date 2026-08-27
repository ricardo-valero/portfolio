import { For, type Component } from "solid-js"
import { demoStep } from "../../motion"

const DEFAULT_LABELS = ["Carrier A", "Carrier B", "Carrier C"]

/**
 * A parcel fans out rate requests to carriers; quotes return; the best
 * one highlights. Final state (markup): all quotes visible, best marked.
 */
export const RateShop: Component<{ labels?: readonly string[] }> = (props) => {
  const labels = () => props.labels?.slice(0, 4) ?? DEFAULT_LABELS
  return (
    <div class="demo-rateshop">
      <div class="demo-rateshop-parcel" data-d="parcel" />
      <div class="demo-rateshop-rows">
        <For each={labels()}>
          {(label, i) => (
            <div class="demo-rateshop-row">
              <span class="demo-rateshop-line" data-d="line" />
              <span class="demo-label">{label}</span>
              <span
                class="demo-rateshop-quote"
                classList={{ "is-best": i() === 0 }}
                data-d="quote"
              >
                $
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export const rateShopCycle = async (root: HTMLElement): Promise<void> => {
  const lines = [...root.querySelectorAll("[data-d='line']")]
  const quotes = [...root.querySelectorAll("[data-d='quote']")]
  const best = root.querySelector(".demo-rateshop-quote.is-best")
  // unified reset fade — never snap the drawn final state back to zero
  await demoStep([...lines, ...quotes], { opacity: 0 }, { duration: 0.18 })
  await demoStep(
    lines,
    { opacity: 1, transform: ["scaleX(0)", "scaleX(1)"] },
    { duration: 0.35, delayStep: 0.08 },
  )
  await demoStep(
    quotes,
    { opacity: 1, transform: ["scale(0.9)", "scale(1)"] },
    { duration: 0.25, delayStep: 0.08 },
  )
  if (best) {
    await demoStep(best, { transform: ["scale(1)", "scale(1.06)", "scale(1)"] }, {
      duration: 0.3,
    })
  }
}

import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  untrack,
  type Component,
} from "solid-js"
import { Dynamic } from "solid-js/web"
import { resume } from "../data/resume"
import { views, defaultView, findView } from "../views/registry"
import { animateViewCancel, animateViewEnter, animateViewExit } from "../motion"
import "./shell.css"

const viewIdFromHash = (): string => {
  const match = /^#\/(\w+)/.exec(window.location.hash)
  return (match && findView(match[1])?.id) || defaultView.id
}

export const App: Component = () => {
  const [activeId, setActiveId] = createSignal(viewIdFromHash())
  // displayed lags active during the exit half of the transition
  const [displayedId, setDisplayedId] = createSignal(activeId())
  let viewContainer!: HTMLDivElement
  let epoch = 0

  const onHashChange = () => setActiveId(viewIdFromHash())
  onMount(() => {
    window.addEventListener("hashchange", onHashChange)
    onCleanup(() => window.removeEventListener("hashchange", onHashChange))
  })

  let transitioning = false
  createEffect(() => {
    const next = activeId()
    const current = ++epoch
    if (next === untrack(displayedId)) {
      // switched back to the displayed view mid-transition: retarget the
      // container to rest from its current values, or a stale exit leaves
      // it hidden / a from-keyframe restart makes the opacity pop
      if (transitioning) {
        transitioning = false
        animateViewCancel(viewContainer)
      }
      return
    }
    transitioning = true
    void animateViewExit(viewContainer).then(() => {
      // a newer switch superseded this one mid-exit; let it win
      if (current !== epoch) return
      transitioning = false
      setDisplayedId(next)
      animateViewEnter(viewContainer)
    })
  })

  const switchTo = (id: string) => {
    window.location.hash = `/${id}`
  }

  return (
    <div class="shell">
      <header class="shell-header">
        <p class="eyebrow">Curriculum Vitae</p>
        <h1 class="shell-name">{resume.name}</h1>
        <p class="shell-headline">{resume.headline}</p>
        <Show when={resume.summary}>
          {(summary) => <p class="shell-summary">{summary()}</p>}
        </Show>
        <ul class="shell-links">
          <For each={resume.links}>
            {(link) => (
              <li>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              </li>
            )}
          </For>
        </ul>
        <div class="shell-actions">
          <nav class="shell-switcher" aria-label="Resume views">
            <For each={views}>
              {(view) => (
                <button
                  type="button"
                  class="shell-switch"
                  aria-pressed={activeId() === view.id}
                  onClick={() => switchTo(view.id)}
                >
                  {view.label}
                </button>
              )}
            </For>
          </nav>
          <a
            class="shell-download"
            href={`${import.meta.env.BASE_URL}ricardo-valero-cv.pdf`}
            download="ricardo-valero-cv.pdf"
          >
            Download PDF
          </a>
        </div>
      </header>
      <main id="main" tabindex="-1" class="shell-view" ref={viewContainer}>
        <Dynamic
          component={findView(displayedId())?.component ?? defaultView.component}
          resume={resume}
        />
      </main>
    </div>
  )
}

import { For, Show, onMount, type Component } from "solid-js"
import { Collapsible } from "@ark-ui/solid/collapsible"
import type { Resume, Role, Company, EducationEntry } from "../../schema/resume"
import { formatRange } from "../../data/format"
import { techKind } from "../../data/tech"
import { revealOnScroll } from "../../motion"
import { DemoStage } from "../../demos/DemoStage"
import "./timeline.css"

type TimelineEntry =
  | { type: "work"; start: string; end?: string; company: Company; role: Role }
  | { type: "education"; start: string; end: string; entry: EducationEntry }

const toEntries = (resume: Resume): TimelineEntry[] => {
  const work = resume.work.flatMap((company) =>
    company.roles.map(
      (role): TimelineEntry => ({
        type: "work",
        start: role.start,
        end: role.end,
        company,
        role,
      }),
    ),
  )
  const education = resume.education.map(
    (entry): TimelineEntry => ({
      type: "education",
      start: entry.start,
      end: entry.end,
      entry,
    }),
  )
  // ongoing roles lead; the rest by start descending (YearMonth strings
  // sort correctly lexicographically)
  return [...work, ...education].sort((a, b) => {
    const ongoing = Number(b.end === undefined) - Number(a.end === undefined)
    return ongoing !== 0 ? ongoing : b.start.localeCompare(a.start)
  })
}

/** Chronological journey through work + education; details expand per entry. */
export const TimelineView: Component<{ resume: Resume }> = (props) => {
  let root!: HTMLDivElement
  onMount(() => revealOnScroll(root))
  const entries = () => toEntries(props.resume)

  return (
    <div class="timeline" ref={root} data-reveal-group>
      <ol class="timeline-list">
        <For each={entries()}>
          {(item) => (
            <li class="timeline-entry" data-kind={item.type} data-reveal>
              <span class="timeline-marker" aria-hidden="true" />
              <Collapsible.Root class="timeline-card">
                <div class="timeline-meta">
                  <span class="timeline-dates">
                    {formatRange(item.start, item.end)}
                  </span>
                  <span class="eyebrow">
                    {item.type === "work" ? "Work" : "Education"}
                  </span>
                </div>
                <Collapsible.Trigger class="timeline-trigger">
                  <span class="timeline-title">
                    {item.type === "work"
                      ? item.role.title
                      : item.entry.program}
                  </span>
                  <span class="timeline-org">
                    {item.type === "work"
                      ? item.company.name
                      : item.entry.institution}
                  </span>
                  <span class="timeline-chevron" aria-hidden="true">
                    +
                  </span>
                </Collapsible.Trigger>
                <Collapsible.Content class="timeline-content">
                  <Show
                    when={item.type === "work" ? item : undefined}
                    fallback={
                      <Show
                        when={item.type === "education" ? item : undefined}
                      >
                        {(edu) => (
                          <Show when={edu().entry.note}>
                            {(note) => (
                              <p class="timeline-note">{note()}</p>
                            )}
                          </Show>
                        )}
                      </Show>
                    }
                  >
                    {(work) => (
                      <div class="timeline-projects">
                        <For each={work().role.projects}>
                          {(project) => (
                            <div class="timeline-project">
                              <p class="timeline-project-name">
                                {project.name}
                                <Show when={project.client}>
                                  {(client) => (
                                    <span class="timeline-client">
                                      {" "}
                                      for {client()}
                                    </span>
                                  )}
                                </Show>
                              </p>
                              <ul>
                                <For each={project.bullets}>
                                  {(bullet) => <li>{bullet}</li>}
                                </For>
                              </ul>
                              <Show when={project.demo}>
                                {(demo) => <DemoStage demo={demo()} />}
                              </Show>
                              <p class="timeline-tech">
                                <For each={project.tech}>
                                  {(tech) => (
                                    <span
                                      class={`timeline-tech-item is-${techKind(tech)}`}
                                    >
                                      {tech}
                                    </span>
                                  )}
                                </For>
                              </p>
                            </div>
                          )}
                        </For>
                      </div>
                    )}
                  </Show>
                </Collapsible.Content>
              </Collapsible.Root>
            </li>
          )}
        </For>
      </ol>
    </div>
  )
}

import { For, Show, onMount, type Component } from "solid-js"
import type { Resume } from "../../schema/resume"
import { formatRange } from "../../data/format"
import { techKind } from "../../data/tech"
import { revealOnScroll } from "../../motion"
import { DemoStage } from "../../demos/DemoStage"
import "./document.css"

/** PDF-like single-column rendering of the resume, sections reveal on scroll. */
export const DocumentView: Component<{ resume: Resume }> = (props) => {
  let root!: HTMLDivElement
  onMount(() => revealOnScroll(root))

  return (
    <div class="document" ref={root}>
      <section class="document-section" data-reveal-group>
        <h2 class="eyebrow" data-reveal>
          Work Experience
        </h2>
        <For each={props.resume.work}>
          {(company) => (
            <article class="document-company" data-reveal>
              <h3 class="document-company-name">
                <Show when={company.url} fallback={company.name}>
                  {(url) => (
                    <a href={url()} target="_blank" rel="noreferrer">
                      {company.name}
                    </a>
                  )}
                </Show>
              </h3>
              <For each={company.roles}>
                {(role) => (
                  <div class="document-role">
                    <div class="document-role-header">
                      <h4>{role.title}</h4>
                      <span class="document-dates">
                        {formatRange(role.start, role.end)}
                      </span>
                    </div>
                    <For each={role.projects}>
                      {(project) => (
                        <div class="document-project">
                          <p class="document-project-name">
                            {project.name}
                            <Show when={project.client}>
                              {(client) => (
                                <span class="document-client">
                                  {" "}
                                  for {client()}
                                </span>
                              )}
                            </Show>
                          </p>
                          <p class="document-contribution">
                            {project.contribution}
                          </p>
                          <ul>
                            <For each={project.bullets}>
                              {(bullet) => <li>{bullet}</li>}
                            </For>
                          </ul>
                          <Show when={project.demo}>
                            {(demo) => <DemoStage demo={demo()} />}
                          </Show>
                          <p class="document-tech">
                            <For each={project.tech}>
                              {(tech) => (
                                <span
                                  class={`document-tech-item is-${techKind(tech)}`}
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
              </For>
            </article>
          )}
        </For>
      </section>

      <section class="document-section" data-reveal-group>
        <h2 class="eyebrow" data-reveal>
          Side Projects
        </h2>
        <For each={props.resume.sideProjects}>
          {(project) => (
            <article class="document-company" data-reveal>
              <h3 class="document-company-name">
                <Show when={project.url} fallback={project.name}>
                  {(url) => (
                    <a href={url()} target="_blank" rel="noreferrer">
                      {project.name}
                    </a>
                  )}
                </Show>
              </h3>
              <div class="document-project">
                <ul>
                  <For each={project.bullets}>
                    {(bullet) => <li>{bullet}</li>}
                  </For>
                </ul>
                <p class="document-tech">
                  <For each={project.tech}>
                    {(tech) => (
                      <span class={`document-tech-item is-${techKind(tech)}`}>
                        {tech}
                      </span>
                    )}
                  </For>
                </p>
              </div>
            </article>
          )}
        </For>
      </section>

      <section class="document-section" data-reveal-group>
        <h2 class="eyebrow" data-reveal>
          Education
        </h2>
        <For each={props.resume.education}>
          {(entry) => (
            <article class="document-education" data-reveal>
              <div class="document-role-header">
                <h4>{entry.institution}</h4>
                <span class="document-dates">
                  {formatRange(entry.start, entry.end)}
                </span>
              </div>
              <p>{entry.program}</p>
              <Show when={entry.note}>
                {(note) => <p class="document-note">{note()}</p>}
              </Show>
            </article>
          )}
        </For>
      </section>

      <section class="document-section" data-reveal-group>
        <h2 class="eyebrow" data-reveal>
          Skills
        </h2>
        <dl class="document-skills">
          <For each={props.resume.skills}>
            {(group) => (
              <div class="document-skill-row" data-reveal>
                <dt>{group.category}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            )}
          </For>
        </dl>
      </section>

      <section class="document-section" data-reveal-group>
        <h2 class="eyebrow" data-reveal>
          Languages
        </h2>
        <dl class="document-skills">
          <For each={props.resume.languages}>
            {(lang) => (
              <div class="document-skill-row" data-reveal>
                <dt>{lang.name}</dt>
                <dd>{lang.level}</dd>
              </div>
            )}
          </For>
        </dl>
      </section>
    </div>
  )
}

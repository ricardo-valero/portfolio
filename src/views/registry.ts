import type { Component } from "solid-js"
import type { Resume } from "../schema/resume"
import { DocumentView } from "./document/DocumentView"
import { TimelineView } from "./timeline/TimelineView"

export type ViewDefinition = {
  id: string
  label: string
  component: Component<{ resume: Resume }>
}

// Adding a view = one module + one entry here. Shell and switcher read this.
export const views: readonly ViewDefinition[] = [
  { id: "document", label: "Document", component: DocumentView },
  { id: "timeline", label: "Timeline", component: TimelineView },
]

export const defaultView = views[0]

export const findView = (id: string): ViewDefinition | undefined =>
  views.find((view) => view.id === id)

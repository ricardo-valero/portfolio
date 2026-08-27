import type { Component } from "solid-js"
import type { DemoArchetype } from "../schema/resume"
import { RateShop, rateShopCycle } from "./archetypes/RateShop"
import { Pipeline, pipelineCycle } from "./archetypes/Pipeline"
import { Dashboard, dashboardCycle } from "./archetypes/Dashboard"
import { Terminal, terminalCycle } from "./archetypes/Terminal"
import { FormFlow, formFlowCycle } from "./archetypes/FormFlow"
import { DipCoat, dipCoatCycle } from "./archetypes/DipCoat"
import { Ladder, ladderCycle } from "./archetypes/Ladder"

export type DemoProps = { labels?: readonly string[] }

export type DemoDefinition = {
  view: Component<DemoProps>
  // one animation pass over the rendered markup, scoped to the stage root
  cycle: (root: HTMLElement) => Promise<void>
}

// Adding an archetype = one component module + one entry here.
export const demoRegistry: Record<DemoArchetype, DemoDefinition> = {
  "rate-shop": { view: RateShop, cycle: rateShopCycle },
  pipeline: { view: Pipeline, cycle: pipelineCycle },
  dashboard: { view: Dashboard, cycle: dashboardCycle },
  terminal: { view: Terminal, cycle: terminalCycle },
  "form-flow": { view: FormFlow, cycle: formFlowCycle },
  "dip-coat": { view: DipCoat, cycle: dipCoatCycle },
  ladder: { view: Ladder, cycle: ladderCycle },
}

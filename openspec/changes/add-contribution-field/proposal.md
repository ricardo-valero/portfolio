## Why

The résumé describes *what projects were* but not *what was distinctly mine*. Five
project entries currently share two copy-pasted bullets verbatim — `"Led design and
architecture of UI/UX, tech stack, database, and APIs"` appears three times, `"Developed
a full-stack app, database design, and APIs"` twice — so distinct pieces of work read as
interchangeable. Reviewers have flagged this directly.

Nothing in the schema prevents it, because `bullets` is an undifferentiated
`Array<string>`: a project description and a personal-contribution claim are the same
field, so neither the type system nor the views can tell them apart, and there is no
point at which a missing contribution fails.

Two adjacent gaps have the same root cause — content that exists but has no structural
home. Practices that are central to current work (spec-driven development with OpenSpec,
AI-assisted engineering, automated testing) sit as undifferentiated entries in a
`Daily Drivers` tool list next to the terminal emulator. And `sideProjects` carries no
dates, leaving an unexplained gap in the rendered timeline between employment periods.

## What Changes

- **BREAKING (data)**: `Project` gains a required `contribution` field. Every project
  entry in `src/data/resume.ts` must supply one, or the schema decode fails — the same
  contract the rest of the résumé data already operates under.
- **The build learns to enforce that contract.** Discovered during implementation:
  `vite build` type-checks and bundles but never *executes* the data module, so a decode
  failure could not fail the build. Invalid résumé data compiled cleanly, reached `dist/`,
  and only threw in the visitor's browser — caught today only by `npm run smoke`. The
  README's claim that invalid data "fails the dev server and the build loudly" was
  therefore true of the dev server and false of the build. A `scripts/validate-data.mjs`
  step loads and decodes the data module before `vite build` runs, making the claim hold.
- `contribution` is deliberately **not** added to `SideProject`. Independent work is
  wholly the author's by construction, so the field would carry no information there.
- All project entries are rewritten so each `contribution` states a distinct, specific
  contribution. The duplicated bullets are replaced.
- A previously omitted .NET Core / EF Core SCADA-MES reporting project is added to the
  Industrial Code role, moving demonstrated .NET and SQL Server work out of the earliest
  junior-titled role and into a senior one.
- `DocumentView` and `TimelineView` render `contribution` with visual treatment distinct
  from `bullets`, so the contribution claim is legible as a different kind of statement
  rather than one more bullet.
- `skills` is restructured: `AI-Assisted Engineering` and `Testing` become their own
  categories; `Daily Drivers` narrows to tools only.
- `SideProject` gains optional `start`/`end` date fields, rendered where views show
  chronology.
- A `flake.nix` is added. The résumé claims, as a contribution, that `flake.nix` was made
  a requirement across every project at the author's current employer; the repository that
  makes that claim currently has none, and needs `nix shell nixpkgs#nodejs` to build at
  all. A work sample should hold to the standard it advertises.

## Capabilities

### New Capabilities

- `project-contribution`: Every project carries a distinct, required statement of the
  author's personal contribution, validated at load and rendered distinctly from
  descriptive bullets.
- `resume-skills-taxonomy`: Skills are organized so engineering *practices* are
  first-class categories, separable from the *tools* used day to day.
- `resume-timeline-continuity`: Independent work carries dates, so rendered chronology
  has no unexplained gaps.

### Modified Capabilities

None. `openspec/specs/` is empty; this is the first change to declare capabilities.

## Impact

- `src/schema/resume.ts` — `Project` gains a required field; `SideProject` gains two
  optional ones. Exported `Project` / `SideProject` types change, so every consumer is
  type-checked against the new shape.
- `src/data/resume.ts` — every project entry edited; one project added; `skills`
  restructured; `sideProjects` dated. This is the bulk of the work.
- `src/views/document/DocumentView.tsx` + `document.css` — render and style
  `contribution`.
- `src/views/timeline/TimelineView.tsx` + `timeline.css` — same, plus side-project dates.
- `scripts/validate-data.mjs` (new) and `package.json` — the `build` script gains a
  validation step ahead of `vite build`.
- `flake.nix` + `flake.lock` (new), `.envrc` (new) — a dev shell providing Node. No change
  to how the app is built; `npm run build` still works outside Nix.
- `README.md` — its build-enforcement claim becomes accurate rather than aspirational; the
  `flake.nix` gets a mention in the scripts section.
- `npm run build` fails until every project has a `contribution` — intended, and the
  reason the field is required rather than optional.
- `public/ricardo-valero-cv.pdf` is regenerated from the built Document view; no separate
  document to update.
- `dom-smoke.mjs` assertions may need updating if they assert on rendered project markup.

### Out of scope

- No link to any private or employer-owned repository is added to the résumé data.
  Employer work is described, not linked.
- No new view, no new demo archetype, no change to the PDF pipeline.

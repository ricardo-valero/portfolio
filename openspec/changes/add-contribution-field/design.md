## Context

See `proposal.md` — Why.

Constraints that shape the approach:

- `src/data/resume.ts` is the only data file, decoded by `decodeResume` at module load.
  A decode failure takes down the dev server and `npm run build`. That is the enforcement
  mechanism this change leans on.
- `decodeResume` is `Schema.decodeUnknownSync(Resume)`. Because the input is typed
  `unknown`, TypeScript does **not** check the inline literal in `resume.ts` against the
  schema — only the runtime decode does. Any guarantee this change wants must therefore be
  expressed in the schema, not assumed from the type checker.
- Two views render projects (`DocumentView`, `TimelineView`) with near-identical project
  markup. The PDF is `DocumentView` driven through headless Chromium, so any styling must
  survive print: no hover, no viewport-dependent layout, no color-only distinction.
- `TimelineView`'s `TimelineEntry` union covers `work | education` only. Side projects are
  currently absent from the chronology entirely.

## Goals / Non-Goals

**Goals:**

- Make a missing or duplicated contribution a build failure, not a review catch.
- Give `contribution` a rendering that reads as a different kind of claim than a bullet,
  identically on screen and in print.
- Keep the per-project markup change small enough to stay duplicated across the two views
  rather than forcing a shared-component extraction.

**Non-Goals:**

- No shared `<ProjectCard>` extraction. The two views deliberately diverge in structure
  (collapsible vs. linear); unifying them is a separate concern and would grow this change
  well past its purpose.
- No scoring, tagging, or role-targeting of content. A single résumé, not per-application
  variants.
- No change to `formatRange`, the demo registry, or the PDF pipeline.

## Decisions

### 1. `contribution` is required on `Project`, not optional

`Schema.NonEmptyString`, no `optionalKey`.

*Why:* an optional field would be satisfied by omission, which is exactly the failure mode
this change exists to prevent — the current duplicated bullets are what "nobody checked"
looks like. Required means the cost is paid once, up front, for all fifteen projects, and
never again.

*Alternative considered:* optional field plus a lint rule or smoke assertion. Rejected —
it puts the guarantee somewhere other than the schema, which is where every other
guarantee in this repo lives.

*Consequence, accepted:* the build is red from the moment the schema changes until the
last project has a contribution written. Implementation order in `tasks.md` accounts for
this.

### 2. Uniqueness is enforced by a schema-level check, not by review

Add a `Schema.check` on the `Resume` struct asserting that all project `contribution`
values are distinct, and that no project's `contribution` equals any of its own `bullets`.

*Why:* the spec requires distinctness, and distinctness is not expressible on a single
`Project` in isolation — it is a property of the whole collection, so it belongs on
`Resume`. Copy-paste is the specific failure being designed against; a check that catches
literal duplication catches the exact mistake that produced the current data.

*Limitation, accepted:* this catches identical text, not two differently-worded but
equally vacuous statements. Semantic vacuity stays a human judgment.

*Alternative considered:* leaving it to review. Rejected — review is what already failed.

### 3. `SideProject` gains no `contribution` field, and excess keys must error

Effect Schema strips unknown keys by default rather than rejecting them, so simply
omitting the field would let a stray `contribution` on a side project pass silently. The
spec requires rejection, so decoding must be configured to error on excess properties.

*Implementation note:* the exact option name differs across Effect versions — this repo is
on `effect@4.0.0-beta.101`. The task list includes verifying the v4 API surface for
excess-property behavior before wiring it. If v4 exposes no such option, the fallback is a
`Schema.check` on `SideProject` asserting the key is absent, which is uglier but keeps the
guarantee in the schema per Decision 1's reasoning.

### 4. Contribution renders as a lead line, above the bullets

Order within a project becomes: name → **contribution** → bullets → demo → tech.

Treatment: a `<p>` with its own class, not an `<li>`, distinguished by weight and a small
indent or rule — deliberately *near* the bullets in size, since it is not a heading. No
"My contribution:" label; the placement and treatment carry the distinction.

*Why above:* a reader scanning the résumé gives each project roughly one line of
attention. The contribution is the sentence that differentiates, so it gets that line. Put
below the bullets, it is the sentence most often not read.

*Why no label:* labels of that form read as a template being filled in. The structure is
for the author's benefit; the reader should just encounter a better first sentence.

*Alternative considered:* rendering it as the first `<li>` with a modifier class. Rejected
— it stays a bullet semantically, and the spec requires it not be one.

### 5. Side projects join the timeline as a third entry variant

Extend `TimelineEntry` with `{ type: "side"; start; end?; project: SideProject }`, built
only from side projects that declare a `start`. Undated side projects continue to appear
in `DocumentView` only.

*Why:* the existing sort already does the right thing — ongoing entries first, then start
descending — so continuity comes for free once the variant exists. Gating on `start`
avoids inventing dates for work that genuinely has no period.

*Consequence:* `TimelineView`'s `Collapsible.Content` currently branches `work` vs.
`education` via nested `Show` fallbacks. A third variant makes that nesting the wrong
shape; it should become a flat switch on `item.type`.

### 6. The build validates the data by executing it, not by type-checking it

Add `scripts/validate-data.mjs`, which loads `src/data/resume.ts` through Vite's
`ssrLoadModule` and lets the module-load decode throw. Wire it into `build` ahead of
`vite build`:

```
"build": "tsc -b && node scripts/validate-data.mjs && vite build"
```

*Why this was needed:* `vite build` type-checks and bundles but never executes the data
module. Because `decodeResume` takes `unknown`, TypeScript cannot check the inline literal
either (see Context). So before this, invalid résumé data compiled cleanly, was written to
`dist/`, and threw only in the visitor's browser — `npm run smoke` was the sole thing that
caught it. Everything else in this change assumes the build enforces the contract; it did
not, and neither did the README's claim.

*Why Vite's `ssrLoadModule` over alternatives:* Vite is already a dependency, so this adds
no packages and resolves TypeScript, path aliases, and `import.meta.env` exactly as the
app does. Running the check *before* `vite build` means invalid data never reaches `dist/`.

*Alternatives considered:* appending `npm run smoke` to `build` — rejected, it validates
after `dist/` is already written and couples every build to happy-dom rendering. Adding
`tsx` or `vite-node` — rejected, a new dependency for something Vite already does.

### 7. The repository gets a `flake.nix`

*Why:* the résumé asserts, as a contribution, that the author made `flake.nix` mandatory on
every project at their current employer and converted CI to Nix. This repository — the work
sample backing that résumé — has no flake, and building it here required
`nix shell nixpkgs#nodejs` because no Node is on the PATH. The gap between the claim and the
artifact is the kind of thing the claim invites a reader to check.

Scope: a dev shell providing Node and an `.envrc` for `direnv`. Deliberately *not* a Nix
build of the site itself — packaging the Vite build adds real complexity and buys nothing
this change needs. `npm run build` continues to work outside Nix.

### 8. `Testing` and `AI-Assisted Engineering` are added as skill categories

`Daily Drivers` keeps only tools (editor, terminal, shell environment). Practices and the
tools specific to them move to the two new categories.

*Why:* per `resume-skills-taxonomy`, a reader scanning for a capability should find a
category that names it. A methodology listed beside a terminal emulator reads as a
preference rather than a practice.

Note that `Testing` is a category the résumé can only honestly claim once something backs
it. It does: the service described in the Integration Hub entry carries 73 test files and a
CI job gating format, credo, dialyzer, and tests. The gap was presentational, not real.

## Risks / Trade-offs

- **Fifteen contributions must be written before the build goes green again.** → Sequence
  the tasks so the data rewrite lands with the schema change in the same working session;
  do not commit a red intermediate state.
- **Contribution and bullets drift into saying the same thing.** → The uniqueness check
  catches literal duplication; the bullets for rewritten projects should be trimmed to
  project description only, letting the contribution carry the personal claim.
- **The lead line pushes each project taller, and the PDF has a page budget.** → Check
  page count after `npm run pdf`; if it grows past the current budget, cut bullets rather
  than cut contributions — the bullets are the redundant half.
- **`dom-smoke.mjs` may assert on project markup** and break when the element order
  changes. → Read it before editing views; update assertions in the same change.
- **Effect v4 beta's excess-property API is unverified.** → Decision 3 carries an explicit
  fallback that keeps the guarantee regardless.
- **Adding a .NET/SQL Server project to a past role invites scrutiny of its recency.** →
  Only work actually performed in that role is added; the contribution states scope
  honestly rather than implying currency.

## Migration Plan

No deployment surface — this is a static site. Sequence:

1. Schema changes (`contribution` required, `SideProject` dates, checks). Build goes red.
2. Data rewrite: all projects, the added project, skills, side-project dates. Build green.
3. View + CSS changes, then smoke assertions.
4. `npm run build && npm run pdf`, review the PDF for page count and print fidelity.

Rollback is `git revert` — no state, no migration, no consumers.

## Open Questions

- **Whether the .NET/SQL Server reporting fix was index and schema redesign alone, or also
  involved pre-computed aggregates.** Both are true to "reports were too slow"; the
  distinction only sharpens the wording of one field. Resolve while writing the data.
- **Whether the two new skill categories sit above or below the language/backend
  categories.** Ordering only; affects no requirement.

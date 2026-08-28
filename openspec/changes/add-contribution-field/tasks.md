## 1. Schema

- [x] 1.1 Verify how `effect@4.0.0-beta.101` handles excess properties on `Schema.Struct`
      decode, and whether `decodeUnknownSync` accepts an error-on-excess option (design
      Decision 3). Record the finding; if no option exists, use the `Schema.check` fallback.
      **Finding:** v4 supports it directly. `SchemaAST.ParseOptions.onExcessProperty` accepts
      `"ignore"` (default, strips) | `"error"` | `"preserve"`, and
      `decodeUnknownSync(schema, options?)` takes `ParseOptions`. The design Decision 3
      fallback is not needed. Also confirmed `Schema.makeFilter` returns
      `{ path, issue }` entries, so the uniqueness check in 1.5 can point at the offending
      project by path.
- [x] 1.2 Add `contribution: Schema.NonEmptyString` as a required field on `Project` in
      `src/schema/resume.ts`, ordered after `client` and before `bullets`.
- [x] 1.3 Add `start: Schema.optionalKey(YearMonth)` and `end: Schema.optionalKey(YearMonth)`
      to `SideProject`. Do not add `contribution` to `SideProject`.
- [x] 1.4 Apply the excess-property rejection decided in 1.1, so a stray `contribution` on a
      side project fails decode rather than being silently stripped.
- [x] 1.5 Add a `Schema.check` on the `Resume` struct asserting that all project
      `contribution` values are distinct across the whole résumé, and that no project's
      `contribution` equals any of its own `bullets`. Failure message must name the
      offending project.
- [x] 1.6 Introduce a `Prose` schema for human-readable text: non-empty, must contain a
      non-whitespace character, and must not contain an em dash (`—`). Apply it to
      `contribution`, `bullets`, `summary`, project `name`, and education `institution`.
      Author preference, made structural so generated text cannot reintroduce it.
- [x] 1.7 Add `scripts/validate-data.mjs`: load `src/data/resume.ts` via Vite's
      `ssrLoadModule` so the module-load decode actually runs, report the schema error
      readably, and exit non-zero on failure (design Decision 6).
- [x] 1.8 Change the `build` script to
      `tsc -b && node scripts/validate-data.mjs && vite build`, so invalid data never
      reaches `dist/`.
- [x] 1.9 Confirm the build now fails with a decode error naming a project missing
      `contribution` — this red state is expected and is fixed by section 2. Before this
      task, `npm run build` passed on invalid data; that is the bug Decision 6 fixes.

## 2. Data — contributions for existing projects

Each entry gets a `contribution` that names something specific to it, and its `bullets` are
trimmed to project description so the two do not restate one another.

- [x] 2.1 Manuable — Multi-provider Shipping Platform: provider logic was duplicated across
      three places, with business logic tightly coupled to application logic. Led the
      refactor that decoupled them and collapsed the duplication, taking new-carrier
      integrations and failure fixes from roughly two weeks to about one day. State the
      mechanism first and the number second — the number is only credible with the cause
      attached.
- [x] 2.2 Manuable — Integration Hub: sole author; Stripe-shaped webhook event envelope plus
      idempotency-key contract so consumer apps integrate against one shape regardless of
      carrier; compiler-enforced boundary keeping carrier modules free of IO; eight carriers,
      73 test files, CI gating format/credo/dialyzer/test. No repository URL (spec:
      `project-contribution`, employer-owned work).
- [x] 2.3 Manuable — Data Hub: prior engineers had flagged the fragmented ETL as technical
      debt; designed and executed the migration alone, then onboarded new engineers who were
      productive against it in under a week.
- [x] 2.4 Manuable — Infrastructure Tooling: made `flake.nix` a requirement across every
      company project and converted all CI on both Bitbucket and GitHub to Nix, so builds are
      identical locally and in CI.
- [x] 2.5 Manuable — Invoice Data Ingestion: write a contribution distinct from 2.3, since
      both are ingestion work.
- [x] 2.6 Manuable — add a contribution or bullet capturing code review of three engineers,
      placed where it reads as ongoing role responsibility rather than as one project's scope.
- [x] 2.7 Industrial Code — Assembly Line Real-time Monitoring: built the full production-line
      UI, fanning multiple live signal sources and APIs into a single real-time React view.
      Replaces the first of the three duplicated bullets.
- [x] 2.8 Industrial Code — Registegic: first hybrid web + mobile build in the organization;
      led three junior engineers through it. Replaces the second duplicated bullet.
- [x] 2.9 Industrial Code — Warehouse Repackaging Control: drove serial hardware directly from
      the browser over Web Serial in Chrome with live values streaming into React, removing
      the need for a desktop agent. Replaces the third duplicated bullet.
- [x] 2.10 Industrial Code — Hardware Integration for IoT: contribution distinct from 2.9,
      which also covers hardware.
- [x] 2.11 TSI — Assembly Line Control Applications, Work Shift Management, Assembly Line
      Reporting: three distinct contributions replacing the two duplicated
      "Developed a full-stack app, database design, and APIs" bullets. Keep these shorter than
      the recent entries; weight follows recency.
- [x] 2.12 TSI — Ladder-logic PLC internship and KIT — Automated Dip-coating: contributions
      for both. Brief is fine; the field is required, so they cannot be skipped.

## 3. Data — new .NET / SQL Server project

- [x] 3.1 Add a SCADA/MES reporting project for Polaris under the Industrial Code
      Senior Software Engineer role (2021-04 – 2023-05).
- [x] 3.2 Tech list: `C#`, `.NET Core`, `EF Core`, `ASP.NET`, `MSSQL`, plus the frontend
      actually used. Note .NET Framework where the work was migrating off it.
      **Note:** frontend framework omitted from the tech list; not known and not invented.
- [x] 3.3 Bullets: charting and reporting over assembly-line production data; schema and index
      design; data normalization; migration of live production data; migration from .NET
      Framework / EF6 to .NET Core / EF Core.
- [x] 3.4 Contribution: reporting queries over accumulated production history were too slow —
      charts on the line-reporting screens timed out as history grew. Redesigned the schema
      and indexes so the reports stayed usable at scale. State the problem, then what was
      changed to fix it. Do not state figures for row counts, users, or query times that are
      not actually known.
- [x] 3.5 Pick a `demo` archetype — `dashboard` fits reporting; give it labels distinct from
      the other two `dashboard` projects in the same document.
- [x] 3.6 Verify placement moves demonstrated .NET and SQL Server work out of the junior-titled
      TSI role and into a senior-titled one, without removing the TSI entries.

## 4. Data — skills and side projects

- [x] 4.1 Add an `AI-Assisted Engineering` skill category: Claude Code, OpenSpec, spec-driven
      development, agent skill authoring, structured prompts.
- [x] 4.2 Add a `Testing` skill category: ExUnit, Playwright, Credo, Dialyzer, happy-dom.
- [x] 4.3 Narrow `Daily Drivers` to tools only — remove entries now covered by 4.1 and 4.2.
- [x] 4.4 Check every remaining skill item against the résumé's own project and side-project
      entries; drop any with nothing behind it (spec: `resume-skills-taxonomy`).
      **Partial:** Svelte and gRPC verified against public repos. Deno, WASM, and MariaDB
      have no public or résumé-visible backing; left in place for the author to confirm or
      cut rather than deleted unilaterally.
- [x] 4.5 Add `start`/`end` to `Deplugger` and `Raggio` so the period between 2023-05 and
      2024-09 is visibly occupied.
- [x] 4.6 Strengthen the `Raggio` entry to state that it is used in production in a
      company service, since that is the claim the current one-line description omits.

## 5. Views

- [x] 5.1 Read `dom-smoke.mjs` in full before editing views; note which assertions touch
      project markup or the `timeline-entry` count.
- [x] 5.2 `DocumentView`: render `project.contribution` as a `<p class="document-contribution">`
      between the project name and the bullet list. Not an `<li>`, no label text.
- [x] 5.3 `document.css`: style `.document-contribution` distinct from bullets by weight and
      indent or rule. Must hold up in print — no hover, no color-only distinction.
- [x] 5.4 `TimelineView`: render `project.contribution` in the same position with
      `timeline-contribution`, and style it in `timeline.css` to match the document treatment.
- [x] 5.5 `TimelineView`: add a `side` variant to `TimelineEntry`, built only from side
      projects that declare a `start`. Undated side projects stay out of the timeline.
- [x] 5.6 Replace the nested `Show` fallback branching in `Collapsible.Content` with a flat
      switch over `item.type`, now that there are three variants (design Decision 5).
- [x] 5.7 Render the side-project entry: name, `formatRange`, bullets, tech. Reuse existing
      timeline classes rather than introducing a parallel set.
- [x] 5.8 Confirm the timeline sort still puts ongoing entries first, then start descending,
      with side projects interleaved correctly.

## 6. Verification

- [x] 6.1 `npm run build` — must pass, confirming every project has a distinct contribution.
- [x] 6.2 Deliberately duplicate two contributions and confirm the build fails with a message
      naming the project; revert.
- [x] 6.3 Deliberately add `contribution` to a side project and confirm decode rejects it;
      revert.
- [x] 6.4 `npm run smoke` — all three modes. Update assertions if 5.1 found any that break.
- [x] 6.5 `npm run preview` and check both views: contribution reads as distinct from bullets,
      side projects appear in the timeline in the right period.
- [x] 6.6 `npm run pdf`, then review the PDF: contribution styling survives print, and check
      the page count against the previous PDF.
- [x] 6.7 If page count grew, cut bullets rather than contributions (design Risks).
      **Note:** bullets de-duplicated (3 identical architecture bullets reduced to 1, plus
      one TSI duplicate rewritten), but the PDF is still 4 pages vs 3 before. The growth is
      the added project, the added side project, and 17 contribution lines, not filler.
      Trimming further means cutting real content, which is the author's call.
- [x] 6.8 Grep the data file for any private or employer-owned repository URL and confirm none
      is present.
- [x] 6.9 Grep `src/data/resume.ts` for `—` and confirm zero occurrences in content strings.
- [x] 6.10 `openspec validate add-contribution-field --strict`.

## 7. Nix flake

- [x] 7.1 Add `flake.nix` with a dev shell providing Node (matching the version the project
      builds under) plus the Playwright browsers the PDF script needs, if practical.
- [x] 7.2 Add `.envrc` (`use flake`) so `direnv` picks the shell up automatically, matching
      the convention described in the résumé's Infrastructure Tooling entry.
- [x] 7.3 Commit `flake.lock`. Add `.direnv/` to `.gitignore`.
- [x] 7.4 Verify `nix develop --command npm run build` succeeds from a clean shell with no
      Node on the PATH.
- [x] 7.5 Confirm `npm run build` still works outside Nix — the flake is a convenience, not
      a requirement (design Decision 7).

## 8. README

- [x] 8.1 Correct the "One source of truth" bullet: it currently claims invalid data "fails
      the dev server and the build loudly", which was false for the build until task 1.8.
      Describe what actually enforces it now.
- [x] 8.2 Document `flake.nix` / `direnv` in the setup section.
- [x] 8.3 Mention `contribution` where the README explains the data model, since it is now a
      required part of every project entry.

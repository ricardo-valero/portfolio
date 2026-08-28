# portfolio

An interactive résumé. One typed data source, rendered into several switchable
views and into a PDF — so the résumé itself is the work sample.

**Live:** https://ricardo-valero.github.io/portfolio/

## Why it's built this way

A résumé is usually a document. This one is a small system, because the
structure is the point:

- **One source of truth.** `src/data/resume.ts` is the only file that changes
  when career data changes. It is decoded at module load by an
  [Effect Schema](https://effect.website) in `src/schema/resume.ts`, so invalid
  data fails the dev server instead of rendering wrong. `vite build` never
  executes app code, so the build gets its own check: `npm run validate` loads
  the data module through Vite and lets the decode throw, and `npm run build`
  runs it before bundling so bad data cannot reach `dist/`.
- **Every project states a contribution.** `contribution` is a required field
  distinct from `bullets`: what was mine, as opposed to what the project was.
  The schema rejects a résumé where two projects share one, or where a
  contribution merely restates a bullet of its own project, because
  interchangeable entries are the failure the field exists to prevent.
- **Views are a registry, not a routing table.** Adding a view is one module
  plus one entry in `src/views/registry.ts`. The shell, the switcher, and the
  hash router all read from that list.
- **The PDF is a render target, not a separate document.** `npm run pdf` drives
  the built Document view through headless Chromium, so the PDF cannot drift
  from the site.

## Demo archetypes

Project entries can carry an abstract animated vignette. These are wireframe
sketches of a system's shape, not replicas of any product — reusable archetypes
rather than bespoke components, registered in `src/demos/registry.ts`:

| Archetype | Shape |
|---|---|
| `rate-shop` | requests fan out to carrier nodes, rates return, cheapest highlights |
| `pipeline` | dots flow left→right through labeled stages |
| `dashboard` | a ticking chart with status chips settling green |
| `terminal` | a command transcript typing itself out |
| `form-flow` | fields validating and advancing through steps |
| `dip-coat` | a layered coating process |
| `ladder` | stepped progression between levels |

Each archetype exports a component and a `cycle(root)` function — one animation
pass scoped to its stage — so `DemoStage` can drive them uniformly and skip them
entirely under `prefers-reduced-motion`.

## Stack

SolidJS · Vite · TypeScript · Effect Schema · Motion One · Playwright

## Scripts

```bash
npm install
npm run dev       # dev server
npm run validate  # decode src/data/resume.ts and report schema errors
npm run build     # tsc -b && validate && vite build
npm run preview   # serve dist/ at http://localhost:4173/portfolio/
npm run pdf       # regenerate public/ricardo-valero-cv.pdf from the built site
npm run smoke     # happy-dom checks: document, timeline, rapid view switching
```

A `flake.nix` provides Node and the Playwright browsers the PDF script needs.
With [direnv](https://direnv.net) the shell loads on `cd`; otherwise:

```bash
nix develop            # or: direnv allow, once
```

The flake is a convenience, not a requirement: `npm run build` works fine
against any Node 22.

`npm run pdf` requires a prior `npm run build`. `verify-browser.mjs` runs
deeper Playwright checks against a running preview server.

### A note on `base`

The site is served from a project subpath, so `vite.config.ts` sets
`base: '/portfolio/'`. Vite rewrites asset URLs in `index.html` automatically,
but anything built at runtime must go through `import.meta.env.BASE_URL` — see
the PDF download link in `src/shell/App.tsx`.

## License

Code is MIT (see `LICENSE`). The résumé content — the career history, project
descriptions, and the generated CV — is not licensed for reuse.
